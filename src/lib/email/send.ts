import "server-only";
import { Resend } from "resend";
import { isResendConfigured, stubLog } from "@/lib/env";

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer }[];
};

/** Sends via Resend when configured; otherwise logs the full payload so the
 * lead-routing and auto-reply flows are exercisable end-to-end in dev. */
export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean; id?: string }> {
  if (!isResendConfigured()) {
    stubLog("sendEmail", { to: input.to, subject: input.subject, attachments: input.attachments?.map((a) => a.filename) });
    return { ok: true };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_ADDRESS ?? "Marmion <no-reply@marmion.example>",
    to: input.to,
    subject: input.subject,
    html: input.html,
    attachments: input.attachments,
  });

  if (error) {
    console.error("[Resend] send failed", error);
    return { ok: false };
  }
  return { ok: true, id: data?.id };
}
