export type Division = "commercial" | "domestic";

export const DIVISION_COOKIE = "marmion-division";

/**
 * Client request, 5 September 2026: focus on domestic only "for right
 * now" — temporary, not a decision to drop the commercial proposition.
 * Everything commercial-specific stays in the codebase (the toggle,
 * /commercial, /capability, /tenders, every COMMERCIAL_* copy branch) and
 * comes back by flipping this one constant to `true` — no rebuild, no
 * un-deleting anything. See middleware.ts (redirects the disabled routes
 * to `/`), division.ts (forces "domestic" everywhere while this is off),
 * site-header.tsx and site-footer.tsx (hide the toggle and commercial nav/
 * footer links). Ask the user before flipping this back — it's their call,
 * not a technical one.
 */
export const COMMERCIAL_ENABLED = false;

/**
 * Routes that only make sense with the commercial division switched on —
 * middleware.ts redirects each of these to `/` while COMMERCIAL_ENABLED is
 * false. /domestic is included even though it's a domestic route: with the
 * toggle gone, `/` alone is the canonical domestic homepage, so /domestic
 * redirects too rather than serving the same content at two URLs.
 */
export const COMMERCIAL_GATED_ROUTES = ["/commercial", "/domestic", "/capability", "/tenders"];

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
