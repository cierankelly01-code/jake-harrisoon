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
  rateLimitKey: string,
  options: {
    /**
     * Requests allowed per minute. The default of 5 suits a form that is
     * submitted once. It does NOT suit an action called repeatedly during one
     * sitting — the boiler wizard autosaves after every step, so a visitor
     * moving briskly through it hit the limit partway and silently lost the
     * photo upload and the last answers.
     */
    limit?: number;
    /**
     * Skip Turnstile for background autosaves. The widget only renders on the
     * final step, so intermediate saves legitimately have no token; without
     * this they would all fail the moment real Turnstile keys are configured.
     */
    skipTurnstile?: boolean;
  } = {}
): Promise<GuardResult> {
  const { limit = 5, skipTurnstile = false } = options;

  if (isHoneypotTripped(formData)) {
    return { ok: false, silent: true };
  }
  if (isRateLimited(rateLimitKey, limit, 60_000)) {
    return { ok: false, silent: false, message: "Too many requests. Try again in a minute." };
  }
  if (skipTurnstile) {
    return { ok: true };
  }
  const turnstileOk = await verifyTurnstile(formData.get("turnstileToken") as string | null);
  if (!turnstileOk) {
    return { ok: false, silent: false, message: "Verification failed. Please try again." };
  }
  return { ok: true };
}
