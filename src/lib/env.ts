/**
 * Central "is this integration live yet?" check. Every server action reads
 * these instead of trusting `process.env` directly, so the whole app runs
 * end-to-end against real code paths in dev with no credentials — server
 * actions log a STUB line and behave as if the call succeeded, rather than
 * silently no-op'ing or throwing. Flip real values into `.env.local`
 * (see `.env.example`) and every integration goes live with no code change.
 */

export const isSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const isSupabaseServiceConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export const isResendConfigured = () => Boolean(process.env.RESEND_API_KEY);

export const isStripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

export const isTurnstileConfigured = () =>
  Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

export function stubLog(action: string, payload: unknown) {
  console.warn(`[STUB] ${action} — no live credentials configured, logging instead:`, payload);
}
