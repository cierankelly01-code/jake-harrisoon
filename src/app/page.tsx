import type { Metadata } from "next";
import { getInitialDivision } from "@/lib/division";
import { HomepageSections } from "@/components/home/homepage-sections";

/**
 * `/` stays cookie-driven (a returning visitor who picked a division keeps
 * landing on it here with no reload), but that means the content an
 * anonymous crawler sees at `/` is identical to whichever of /commercial or
 * /domestic is the resolved default — without a canonical pointing at that
 * route, both URLs would compete as duplicate content. See
 * DESIGN_SYSTEM.md §10.
 */
export async function generateMetadata(): Promise<Metadata> {
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
