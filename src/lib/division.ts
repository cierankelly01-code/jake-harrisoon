import "server-only";
import { cookies, headers } from "next/headers";
import { DIVISION_COOKIE, type Division } from "@/lib/division-shared";

/**
 * Server-side read for the initial render — commercial is the default
 * state (§4). /commercial and /domestic force their division regardless of
 * the cookie: a route someone typed, followed from a search result, or
 * shared as a link should never silently show the other proposition
 * because of a stale cookie from a previous visit. Every other route
 * (starting with `/`) stays cookie-driven, so the header toggle's choice
 * still persists there exactly as before. Pathname comes from middleware.ts
 * via a response header, since a Server Component in the App Router has no
 * direct route-match API of its own.
 */
export async function getInitialDivision(): Promise<Division> {
  const pathname = (await headers()).get("x-pathname") ?? "";
  if (pathname.startsWith("/commercial")) return "commercial";
  if (pathname.startsWith("/domestic")) return "domestic";

  const store = await cookies();
  const value = store.get(DIVISION_COOKIE)?.value;
  return value === "domestic" ? "domestic" : "commercial";
}
