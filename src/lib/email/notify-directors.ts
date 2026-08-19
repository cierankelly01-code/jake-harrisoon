import "server-only";
import { business } from "@/lib/content/business";
import { sendEmail } from "./send";
import { stubLog } from "@/lib/env";

/**
 * Routes an internal lead notification to whichever real director address
 * is confirmed (`business.emailTenders` / `emailGeneral`). Never falls
 * back to a fake "@marmion.example" address — if neither is confirmed
 * yet, this logs a loud warning instead of silently sending (or trying
 * to send) to an address that doesn't exist. See CONTENT_NEEDED.md.
 */
export async function notifyDirectors(input: { subject: string; html: string; preferTenders?: boolean }) {
  const addresses = [
    input.preferTenders ? business.emailTenders : business.emailGeneral,
    input.preferTenders ? business.emailGeneral : business.emailTenders,
  ].filter((v): v is string => Boolean(v));

  if (addresses.length === 0) {
    stubLog(
      "notifyDirectors — no confirmed director email yet, not sending",
      { subject: input.subject }
    );
    return { ok: false as const };
  }

  return sendEmail({ to: addresses, subject: input.subject, html: input.html });
}
