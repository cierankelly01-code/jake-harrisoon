import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Makes the resolved pathname available to Server Components via
 * `headers()`. The root layout needs it for exactly one thing: forcing the
 * Commercial/Domestic division on /commercial and /domestic regardless of
 * the `marmion-division` cookie, without duplicating the header/footer/
 * DivisionProvider tree per route — see DESIGN_SYSTEM.md §10 for why a
 * second nested provider around just the page content is the wrong fix
 * (it leaves the header showing the cookie's division while the page shows
 * the forced one).
 */
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    // Every route except static assets and image optimisation — those never
    // reach a Server Component that reads x-pathname.
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
