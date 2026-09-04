/**
 * The one place the canonical origin is resolved. `sitemap.ts`, `robots.ts`,
 * `metadataBase` and the LocalBusiness JSON-LD all read from here, so
 * pointing the site at its real domain is a single `.env` change
 * (`NEXT_PUBLIC_SITE_URL`) rather than a hunt through the tree.
 *
 * Falls back to localhost so `next build` never emits a half-formed URL if
 * the variable is missing — but see HANDOFF.md: this MUST be set in
 * production or every canonical, OG and sitemap URL will point at localhost.
 */

const RAW = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Canonical origin, never with a trailing slash. */
export const SITE_URL = RAW.replace(/\/+$/, "");

/** Absolute URL for a site-relative path. `abs("/contact")` → `https://…/contact`. */
export function abs(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
