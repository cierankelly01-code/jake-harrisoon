import "server-only";

/**
 * In-memory sliding-window limiter. Fine for a single Coolify container;
 * if this is ever scaled to multiple instances, swap the Map for a Redis
 * INCR+EXPIRE (documented in HANDOFF.md) — the call sites don't change.
 *
 * KNOWN LIMITATION: the caller passes a key built from the
 * `x-forwarded-for` header, which any client can set to an arbitrary
 * value on a direct request. This limiter is a soft abuse-reduction
 * layer, not the primary defence — Turnstile + the honeypot (see
 * lib/security/guard.ts) are what actually gate a determined attacker.
 * A real fix needs the reverse proxy (Coolify/Traefik) configured to
 * overwrite x-forwarded-for with the connecting IP, which is
 * infrastructure config, not application code.
 */
const buckets = new Map<string, number[]>();
const MAX_TRACKED_KEYS = 5000; // crude bound so an attacker cycling spoofed keys can't grow this unbounded

export function isRateLimited(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  buckets.set(key, hits);

  if (buckets.size > MAX_TRACKED_KEYS) {
    const oldestKey = buckets.keys().next().value;
    if (oldestKey) buckets.delete(oldestKey);
  }

  return hits.length > limit;
}
