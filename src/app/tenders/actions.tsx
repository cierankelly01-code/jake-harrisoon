"use server";

import { renderToBuffer } from "@react-pdf/renderer";
import { headers } from "next/headers";
import { tenderEnquirySchema } from "@/lib/validation/tenders";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { uploadToStorage } from "@/lib/supabase/storage";
import { protectFormSubmission } from "@/lib/security/guard";
import { escapeHtml } from "@/lib/security/escape-html";
import { sendEmail } from "@/lib/email/send";
import { notifyDirectors } from "@/lib/email/notify-directors";
import { CapabilityStatementDocument } from "@/lib/pdf/capability-statement";

export type TenderActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitTenderEnquiry(
  _prev: TenderActionState,
  formData: FormData
): Promise<TenderActionState> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const guard = await protectFormSubmission(formData, `tenders:${ip}`);
  if (!guard.ok) {
    if (guard.silent) return { status: "success" };
    return { status: "error", message: guard.message };
  }

  const parsed = tenderEnquirySchema.safeParse({
    organisation: formData.get("organisation"),
    contactName: formData.get("contactName"),
    contactRole: formData.get("contactRole"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    sector: formData.get("sector"),
    contractType: formData.get("contractType"),
    siteCount: formData.get("siteCount") || undefined,
    valueBand: formData.get("valueBand"),
    termMonths: formData.get("termMonths") || undefined,
    deadline: formData.get("deadline"),
    pqqRequired: formData.get("pqqRequired") === "on",
    frameworkName: formData.get("frameworkName"),
    currentProvider: formData.get("currentProvider"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const idempotencyKey = (formData.get("idempotencyKey") as string) || crypto.randomUUID();

  const documentFile = formData.get("document") as File | null;
  const documentPath = documentFile ? await uploadToStorage("tender-documents", documentFile, "tenders", "document") : null;

  const supabase = getSupabaseServiceClient();
  let leadId: string | null = null;

  if (supabase) {
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .upsert(
        {
          division: "commercial",
          type: "tender",
          name: parsed.data.contactName,
          organisation: parsed.data.organisation,
          role: parsed.data.contactRole || null,
          phone: parsed.data.phone || null,
          email: parsed.data.email,
          message: parsed.data.message || null,
          source_page: "/tenders",
          priority: "high",
          idempotency_key: idempotencyKey,
        },
        { onConflict: "idempotency_key", ignoreDuplicates: false }
      )
      .select("id")
      .single();

    if (leadError) console.error("[leads] upsert failed", leadError);
    leadId = lead?.id ?? null;

    const { error: tenderError } = await supabase.from("tender_enquiries").insert({
      lead_id: leadId,
      organisation: parsed.data.organisation,
      contact_name: parsed.data.contactName,
      contact_role: parsed.data.contactRole || null,
      sector: parsed.data.sector || null,
      contract_type: parsed.data.contractType,
      site_count: parsed.data.siteCount ?? null,
      value_band: parsed.data.valueBand || null,
      term_months: parsed.data.termMonths ?? null,
      deadline: parsed.data.deadline || null,
      pqq_required: parsed.data.pqqRequired ?? false,
      framework_name: parsed.data.frameworkName || null,
      document_urls: documentPath ? [documentPath] : [],
      current_provider: parsed.data.currentProvider || null,
    });
    if (tenderError) console.error("[tender_enquiries] insert failed", tenderError);
  } else {
    console.warn("[STUB] tender enquiry", { ...parsed.data, documentPath, idempotencyKey });
  }

  const safeOrg = escapeHtml(parsed.data.organisation);
  const safeContact = escapeHtml(parsed.data.contactName);
  const safeRole = escapeHtml(parsed.data.contactRole || "role not given");
  const safeSector = escapeHtml(parsed.data.sector || "n/a");
  const safeEmail = escapeHtml(parsed.data.email);
  const safePhone = parsed.data.phone ? escapeHtml(parsed.data.phone) : "";
  const safeMessage = escapeHtml(parsed.data.message || "");
  const deadlineLine = parsed.data.deadline ? ` DEADLINE ${parsed.data.deadline}` : "";

  await notifyDirectors({
    preferTenders: true,
    subject: `📋 TENDER — ${safeOrg} — ${parsed.data.siteCount ?? "?"} sites —${deadlineLine || " no deadline given"}`,
    html: `<p>New tender enquiry from ${safeContact} (${safeRole}) at ${safeOrg}.</p>
      <p>Contract type: ${escapeHtml(parsed.data.contractType)} · Sector: ${safeSector} · Sites: ${parsed.data.siteCount ?? "n/a"} · Value band: ${escapeHtml(parsed.data.valueBand || "n/a")} · Deadline: ${escapeHtml(parsed.data.deadline || "n/a")}</p>
      <p>Contact: ${safeEmail} ${safePhone ? `/ ${safePhone}` : ""}</p>
      <p>${safeMessage}</p>`,
  });

  const pdfBuffer = await renderToBuffer(<CapabilityStatementDocument />);
  await sendEmail({
    to: parsed.data.email,
    subject: "Hartson Heating — Tender enquiry received",
    html: `<p>Hi ${safeContact},</p><p>Thanks — we've received your enquiry for ${safeOrg}. We return completed PQQ documentation within 24 hours. Our capability statement is attached in the meantime.</p>`,
    attachments: [{ filename: "marmion-capability-statement.pdf", content: pdfBuffer }],
  });

  return { status: "success" };
}
