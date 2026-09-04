export type Division = "commercial" | "domestic";

export const DIVISION_COOKIE = "marmion-division";

/**
 * Routes whose own content belongs to exactly one division regardless of
 * the cookie. Shared (not "server-only") because both lib/division.ts
 * (forces the initial server render — see there for why) and
 * division-toggle.tsx (decides whether clicking the toggle should navigate
 * rather than swap in place) need the same list; letting them drift would
 * silently reopen the bug this exists to close, where the header disagreed
 * with a page that can't itself react to the toggle.
 */
export const DOMESTIC_ONLY_ROUTES = ["/boiler-quote", "/prices", "/care-plans", "/emergency"];
export const COMMERCIAL_ONLY_ROUTES = ["/capability", "/tenders"];
