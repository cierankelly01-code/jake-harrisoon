import type { Metadata } from "next";
import { getInitialDivision } from "@/lib/division";
import { COMMERCIAL_ENABLED } from "@/lib/division-shared";
import { HomepageSections } from "@/components/home/homepage-sections";

/**
 * `/` stays cookie-driven (a returning visitor who picked a division keeps
 * landing on it here with no reload), but that means the content an
 * anonymous crawler sees at `/` is identical to whichever of /commercial or
 * /domestic is the resolved default — without a canonical pointing at that
 * route, both URLs would compete as duplicate content. See
 * DESIGN_SYSTEM.md §10.
 *
 * While COMMERCIAL_ENABLED is false (division-shared.ts), /domestic
 * redirects to `/`, so pointing the canonical there would target a URL
 * that 307s away — `/` self-canonicalises instead, since it's the only
 * homepage that actually exists right now.
 */
export async function generateMetadata(): Promise<Metadata> {
  if (!COMMERCIAL_ENABLED) return { alternates: { canonical: "/" }, openGraph: { url: "/" } };

  const division = await getInitialDivision();
  const canonical = division === "domestic" ? "/domestic" : "/commercial";
  return {
    alternates: { canonical },
    openGraph: { url: canonical },
  };
}

export default function HomePage() {
  return <HomepageSections />;
}
