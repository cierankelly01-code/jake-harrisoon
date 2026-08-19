import "server-only";
import { isTurnstileConfigured, stubLog } from "@/lib/env";

/** Verifies a Cloudflare Turnstile token server-side. Stubs to "pass" when
 * no site is configured yet, so forms are fully testable before the client
 * sets up a Turnstile site. */
export async function verifyTurnstile(token: string | null): Promise<boolean> {
  if (!isTurnstileConfigured()) {
    stubLog("Turnstile verify", { token });
    return true;
  }
  if (!token) return false;

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: token,
    }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

/** Honeypot: a field named `website` that must stay empty. Bots fill every
 * field; real users never see it (visually hidden, not display:none, so
 * screen readers + basic bots both leave it alone the same way). */
export function isHoneypotTripped(formData: FormData): boolean {
  const value = formData.get("website");
  return typeof value === "string" && value.length > 0;
}
