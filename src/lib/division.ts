import "server-only";
import { cookies, headers } from "next/headers";
import {
  COMMERCIAL_ENABLED,
  DIVISION_COOKIE,
  DOMESTIC_ONLY_ROUTES,
  COMMERCIAL_ONLY_ROUTES,
  type Division,
} from "@/lib/division-shared";

/**
 * Server-side read for the initial render. While COMMERCIAL_ENABLED is
 * false (client request, 5 September 2026 — domestic only "for right
 * now"), this always returns "domestic": middleware.ts has already
 * redirected every commercial-only route to `/` before this can even run,
 * so the only question left is what `/` and the domestic-only routes
 * render, and it's always domestic. Flip that constant back on and every
 * branch below it resumes exactly as it was.
 *
 * With commercial enabled: /commercial, /domestic, and every route listed
 * in DOMESTIC_ONLY_ROUTES/COMMERCIAL_ONLY_ROUTES (division-shared.ts)
 * force their division regardless of the cookie: a route someone typed,
 * followed from a search result, or shared as a link should never silently
 * show the wrong proposition in the header because of a stale cookie from
 * a previous visit, or no cookie at all — a fresh reviewer caught exactly
 * this on /boiler-quote and /care-plans, neither of which reads
 * useDivision() itself, so a cookie-less visit defaulted the surrounding
 * header to "Commercial" on two unambiguously domestic pages. Every other
 * route (the cookie-driven `/`, plus division-neutral pages like /contact)
 * is unaffected, so the header toggle's choice still persists there
 * exactly as before. Pathname comes from middleware.ts via a response
 * header, since a Server Component in the App Router has no direct
 * route-match API of its own.
 */
export async function getInitialDivision(): Promise<Division> {
  if (!COMMERCIAL_ENABLED) return "domestic";

  const pathname = (await headers()).get("x-pathname") ?? "";
  if (pathname.startsWith("/commercial")) return "commercial";
  if (pathname.startsWith("/domestic")) return "domestic";
  if (DOMESTIC_ONLY_ROUTES.some((route) => pathname.startsWith(route))) return "domestic";
  if (COMMERCIAL_ONLY_ROUTES.some((route) => pathname.startsWith(route))) return "commercial";

  const store = await cookies();
  const value = store.get(DIVISION_COOKIE)?.value;
  return value === "domestic" ? "domestic" : "commercial";
}
