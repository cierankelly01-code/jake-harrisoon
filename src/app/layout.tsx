import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { LocalBusinessSchema } from "@/components/seo/local-business-schema";
import { fontVariables } from "@/lib/fonts";
import { getInitialDivision } from "@/lib/division";
import { COMMERCIAL_ENABLED } from "@/lib/division-shared";
import { DivisionProvider } from "@/components/division/division-provider";
import { RevealInit } from "@/components/ui/reveal-init";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StickyCallBar } from "@/components/plugins/sticky-call-bar";

/**
 * Default title/description lead with domestic while COMMERCIAL_ENABLED is
 * false (client request, 5 September 2026 — division-shared.ts): every
 * page that doesn't set its own metadata, plus every social share, used to
 * open with "Mechanical, Electrical & Plumbing Contractor" — the
 * commercial framing — on a site now steering every visitor toward
 * boiler/heating/plumbing. Flip the flag back and this reverts with it.
 */
const SITE_TITLE = COMMERCIAL_ENABLED
  ? "Hartson Heating | Mechanical, Electrical & Plumbing Contractor"
  : "Boiler Installation & Plumbing, Tamworth | Hartson";
const SITE_DESCRIPTION = COMMERCIAL_ENABLED
  ? "Mechanical contracting, PPM and statutory compliance across the West Midlands, plus domestic plumbing and heating in Tamworth, Lichfield and Sutton Coldfield."
  : "Gas Safe registered boiler installation, servicing and emergency plumbing in Tamworth, Lichfield, Sutton Coldfield and across the West Midlands.";

export const metadata: Metadata = {
  // Required for canonical + opengraph-image URLs to resolve absolutely.
  // Reads NEXT_PUBLIC_SITE_URL — see lib/site.ts.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Hartson Heating",
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Hartson Heating",
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // The image itself comes from app/opengraph-image.tsx automatically.
  },
  twitter: { card: "summary_large_image" },
  // No verification tokens, no author/publisher claims — nothing asserted that
  // isn't owned. Search Console verification goes here once the domain is live.
};

/**
 * themeColor lives on the `viewport` export, not `metadata` — it was moved
 * there in Next 14 and warns if left in `metadata`. Ink is the browser-chrome
 * colour on mobile in both schemes; the site itself is light-only
 * (`color-scheme: light` in globals.css), so there is no separate dark entry.
 */
export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const initialDivision = await getInitialDivision();

  return (
    // suppressHydrationWarning: the inline script below adds `.js` to this
    // element before React hydrates, so the server and client className
    // deliberately differ. Without this, every page logged a hydration
    // mismatch error to the console.
    <html
      lang="en"
      className={`${fontVariables} h-full`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Adds `.js` to <html> before first paint. The reveal system hides
          elements via `.js .reveal { opacity: 0 }`, and adding the class from
          an effect (as it was) meant the browser painted every reveal element
          at full opacity, hydration then blanked them, and they faded back in
          on scroll — a visible flash on every page load. Doing it here keeps
          the no-JS guarantee (no script, no class, nothing hidden) while
          removing the flash.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col" style={{ background: "var(--surface)" }}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:px-4 focus:py-2"
          style={{ background: "var(--flame)", color: "var(--ink)", borderRadius: "12px", fontWeight: 600 }}
        >
          Skip to main content
        </a>
        <LocalBusinessSchema />
        <DivisionProvider initialDivision={initialDivision}>
          <RevealInit />
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <StickyCallBar />
        </DivisionProvider>
      </body>
    </html>
  );
}
