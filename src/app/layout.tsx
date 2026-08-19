import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { getInitialDivision } from "@/lib/division";
import { DivisionProvider } from "@/components/division/division-provider";
import { RevealInit } from "@/components/ui/reveal-init";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: {
    default: "Marmion Building Services | Mechanical, Electrical & Plumbing Contractor",
    template: "%s | Marmion Building Services",
  },
  description:
    "Mechanical contracting, PPM and statutory compliance across the West Midlands, plus domestic plumbing and heating in Tamworth, Lichfield and Sutton Coldfield.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const initialDivision = await getInitialDivision();

  return (
    <html lang="en" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col" style={{ background: "var(--surface)" }}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:px-4 focus:py-2"
          style={{ background: "var(--flame)", color: "var(--paper)", borderRadius: "var(--radius)" }}
        >
          Skip to main content
        </a>
        <DivisionProvider initialDivision={initialDivision}>
          <RevealInit />
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </DivisionProvider>
      </body>
    </html>
  );
}
