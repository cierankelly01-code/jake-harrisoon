import "server-only";
import { isHoneypotTripped, verifyTurnstile } from "./turnstile";
import { isRateLimited } from "./rate-limit";

export type GuardResult = { ok: true } | { ok: false; silent: boolean; message?: string };

/**
 * Single guard for every public mutating server action: honeypot, rate
 * limit, then Turnstile. Every form-accepting action should call this
 * first — it's what stops the drift the four Phase 1 forms had before
 * (some had Turnstile, some didn't; care-plans had neither). `silent:
 * true` means a bot tripped the honeypot — callers should return their
 * normal success state without revealing that anything was blocked.
 */
export async function protectFormSubmission(
  formData: FormData,
  rateLimitKey: string
): Promise<GuardResult> {
  if (isHoneypotTripped(formData)) {
    return { ok: false, silent: true };
  }
  if (isRateLimited(rateLimitKey, 5, 60_000)) {
    return { ok: false, silent: false, message: "Too many requests. Try again in a minute." };
  }
  const turnstileOk = await verifyTurnstile(formData.get("turnstileToken") as string | null);
  if (!turnstileOk) {
    return { ok: false, silent: false, message: "Verification failed. Please try again." };
  }
  return { ok: true };
}
