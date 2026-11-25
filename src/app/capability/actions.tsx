"use server";

import { renderToBuffer } from "@react-pdf/renderer";
import { headers } from "next/headers";
import { capabilityDownloadSchema } from "@/lib/validation/capability";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { protectFormSubmission } from "@/lib/security/guard";
import { escapeHtml } from "@/lib/security/escape-html";
import { sendEmail } from "@/lib/email/send";
import { business } from "@/lib/content/business";
import { CapabilityStatementDocument } from "@/lib/pdf/capability-statement";

export type CapabilityActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  pdfBase64?: string;
};

export async function downloadCapabilityStatement(
  _prev: CapabilityActionState,
  formData: FormData
): Promise<CapabilityActionState> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const guard = await protectFormSubmission(formData, `capability:${ip}`);
  if (!guard.ok) {
    if (guard.silent) return { status: "success" };
    return { status: "error", message: guard.message };
  }

  const parsed = capabilityDownloadSchema.safeParse({
    name: formData.get("name"),
    organisation: formData.get("organisation"),
    email: formData.get("email"),
    role: formData.get("role"),
    sector: formData.get("sector"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const supabase = getSupabaseServiceClient();
  if (supabase) {
    const { error } = await supabase.from("capability_downloads").insert({
      name: parsed.data.name,
      organisation: parsed.data.organisation || null,
      email: parsed.data.email,
      role: parsed.data.role || null,
      sector: parsed.data.sector || null,
    });
    if (error) console.error("[capability_downloads] insert failed", error);
  } else {
    console.warn("[STUB] capability_downloads insert", parsed.data);
  }

  const pdfBuffer = await renderToBuffer(<CapabilityStatementDocument />);
  const safeName = escapeHtml(parsed.data.name);

  await sendEmail({
    to: parsed.data.email,
    subject: "Hartson Heating — Capability Statement",
    html: `<p>Hi ${safeName},</p><p>Attached is our capability statement. If you have an ITT or specification, send it to ${escapeHtml(business.emailTenders ?? "our tenders address")} — we return completed PQQ documentation within 24 hours.</p>`,
    attachments: [{ filename: "marmion-capability-statement.pdf", content: pdfBuffer }],
  });

  return {
    status: "success",
    pdfBase64: pdfBuffer.toString("base64"),
  };
}
