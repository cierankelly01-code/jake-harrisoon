"use server";

import { renderToBuffer } from "@react-pdf/renderer";
import { headers } from "next/headers";
import { capabilityDownloadSchema } from "@/lib/validation/capability";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { isHoneypotTripped, verifyTurnstile } from "@/lib/security/turnstile";
import { isRateLimited } from "@/lib/security/rate-limit";
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
  if (isHoneypotTripped(formData)) {
    // Silently "succeed" for bots — never reveal the honeypot triggered.
    return { status: "success" };
  }

  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(`capability:${ip}`, 5, 60_000)) {
    return { status: "error", message: "Too many requests. Try again in a minute." };
  }

  const turnstileOk = await verifyTurnstile(formData.get("turnstileToken") as string | null);
  if (!turnstileOk) {
    return { status: "error", message: "Verification failed. Please try again." };
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

  await sendEmail({
    to: parsed.data.email,
    subject: "Marmion Building Services — Capability Statement",
    html: `<p>Hi ${parsed.data.name},</p><p>Attached is our capability statement. If you have an ITT or specification, send it to ${business.emailTenders ?? "our tenders address"} — we return completed PQQ documentation within 24 hours.</p>`,
    attachments: [{ filename: "marmion-capability-statement.pdf", content: pdfBuffer }],
  });

  return {
    status: "success",
    pdfBase64: pdfBuffer.toString("base64"),
  };
}
