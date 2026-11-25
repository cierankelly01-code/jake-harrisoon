import "server-only";
import { Resend } from "resend";
import { isResendConfigured, stubLog } from "@/lib/env";

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer }[];
};

/**
 * The From address, or nothing sends.
 *
 * This used to fall back to "Hartson <no-reply@marmion.example>" — a domain
 * nobody owns, under the old company's name. With RESEND_FROM_ADDRESS unset
 * in production every customer quote would have gone out from it, failed
 * SPF and DKIM, and landed in spam, while `sendEmail` reported success.
 * Refusing to send is the honest failure: the caller sees `ok: false` and
 * can tell the customer to try another route.
 */
function requireFromAddress(): string {
  const from = process.env.RESEND_FROM_ADDRESS;
  if (!from) {
    throw new Error(
      "RESEND_FROM_ADDRESS is not set. Refusing to send from a fallback domain — " +
        "set it to a verified sender on a domain the business owns."
    );
  }
  return from;
}

/** Sends via Resend when configured; otherwise logs the full payload so the
 * lead-routing and auto-reply flows are exercisable end-to-end in dev. */
export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean; id?: string }> {
  if (!isResendConfigured()) {
    stubLog("sendEmail", { to: input.to, subject: input.subject, attachments: input.attachments?.map((a) => a.filename) });
    return { ok: true };
  }

  let from: string;
  try {
    from = requireFromAddress();
  } catch (error) {
    console.error("[Resend] not sending", error);
    return { ok: false };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from,
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
