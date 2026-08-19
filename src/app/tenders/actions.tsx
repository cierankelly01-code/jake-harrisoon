"use server";

import { renderToBuffer } from "@react-pdf/renderer";
import { headers } from "next/headers";
import { tenderEnquirySchema } from "@/lib/validation/tenders";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { uploadToStorage } from "@/lib/supabase/storage";
import { isHoneypotTripped, verifyTurnstile } from "@/lib/security/turnstile";
import { isRateLimited } from "@/lib/security/rate-limit";
import { sendEmail } from "@/lib/email/send";
import { business } from "@/lib/content/business";
import { CapabilityStatementDocument } from "@/lib/pdf/capability-statement";

export type TenderActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitTenderEnquiry(
  _prev: TenderActionState,
  formData: FormData
): Promise<TenderActionState> {
  if (isHoneypotTripped(formData)) {
    return { status: "success" };
  }

  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(`tenders:${ip}`, 5, 60_000)) {
    return { status: "error", message: "Too many requests. Try again in a minute." };
  }

  const turnstileOk = await verifyTurnstile(formData.get("turnstileToken") as string | null);
  if (!turnstileOk) {
    return { status: "error", message: "Verification failed. Please try again." };
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
  const documentPath = documentFile ? await uploadToStorage("tender-documents", documentFile, "tenders") : null;

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

  const deadlineLine = parsed.data.deadline ? ` DEADLINE ${parsed.data.deadline}` : "";
  await sendEmail({
    to: [business.emailTenders ?? "tenders@marmion.example", business.emailGeneral ?? "info@marmion.example"],
    subject: `📋 TENDER — ${parsed.data.organisation} — ${parsed.data.siteCount ?? "?"} sites —${deadlineLine || " no deadline given"}`,
    html: `<p>New tender enquiry from ${parsed.data.contactName} (${parsed.data.contactRole || "role not given"}) at ${parsed.data.organisation}.</p>
      <p>Contract type: ${parsed.data.contractType} · Sector: ${parsed.data.sector || "n/a"} · Sites: ${parsed.data.siteCount ?? "n/a"} · Value band: ${parsed.data.valueBand || "n/a"} · Deadline: ${parsed.data.deadline || "n/a"}</p>
      <p>Contact: ${parsed.data.email} ${parsed.data.phone ? `/ ${parsed.data.phone}` : ""}</p>
      <p>${parsed.data.message || ""}</p>`,
  });

  const pdfBuffer = await renderToBuffer(<CapabilityStatementDocument />);
  await sendEmail({
    to: parsed.data.email,
    subject: "Marmion Building Services — Tender enquiry received",
    html: `<p>Hi ${parsed.data.contactName},</p><p>Thanks — we've received your enquiry for ${parsed.data.organisation}. We return completed PQQ documentation within 24 hours. Our capability statement is attached in the meantime.</p>`,
    attachments: [{ filename: "marmion-capability-statement.pdf", content: pdfBuffer }],
  });

  return { status: "success" };
}
