import "server-only";

/**
 * In-memory sliding-window limiter. Fine for a single Coolify container;
 * if this is ever scaled to multiple instances, swap the Map for a Redis
 * INCR+EXPIRE (documented in HANDOFF.md) — the call sites don't change.
 */
const buckets = new Map<string, number[]>();

export function isRateLimited(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  buckets.set(key, hits);
  return hits.length > limit;
}
