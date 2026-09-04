import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { LocalBusinessSchema } from "@/components/seo/local-business-schema";
import { fontVariables } from "@/lib/fonts";
import { getInitialDivision } from "@/lib/division";
import { DivisionProvider } from "@/components/division/division-provider";
import { RevealInit } from "@/components/ui/reveal-init";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StickyCallBar } from "@/components/plugins/sticky-call-bar";

export const metadata: Metadata = {
  // Required for canonical + opengraph-image URLs to resolve absolutely.
  // Reads NEXT_PUBLIC_SITE_URL — see lib/site.ts.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Marmion Building Services | Mechanical, Electrical & Plumbing Contractor",
    template: "%s | Marmion Building Services",
  },
  description:
    "Mechanical contracting, PPM and statutory compliance across the West Midlands, plus domestic plumbing and heating in Tamworth, Lichfield and Sutton Coldfield.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Marmion Building Services",
    url: "/",
    title: "Marmion Building Services | Mechanical, Electrical & Plumbing Contractor",
    description:
      "Mechanical contracting, PPM and statutory compliance across the West Midlands, plus domestic plumbing and heating in Tamworth, Lichfield and Sutton Coldfield.",
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
  themeColor: "#0b0e14",
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
          style={{ background: "var(--flame)", color: "var(--paper)", borderRadius: "var(--radius)" }}
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
