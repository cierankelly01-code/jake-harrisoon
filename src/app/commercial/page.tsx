import type { Metadata } from "next";
import { HomepageSections } from "@/components/home/homepage-sections";

/**
 * The commercial homepage's own, indexable, shareable URL — see
 * DESIGN_SYSTEM.md §10. Before this route existed, the commercial
 * proposition only ever appeared behind a cookie-driven toggle on `/`:
 * `location.href` never changed, so it had no search surface at all despite
 * being half the site's offer. lib/division.ts forces the division for
 * this path regardless of the marmion-division cookie.
 */
export const metadata: Metadata = {
  title: "Mechanical Contractor | PPM, Statutory Compliance & Reactive Cover",
  description:
    "PPM and reactive cover from a single site to a multi-site portfolio, across the West Midlands. Send the ITT and completed PQQ documentation comes back within 24 hours.",
  alternates: { canonical: "/commercial" },
  openGraph: {
    url: "/commercial",
    title: "Mechanical Contractor | PPM, Statutory Compliance & Reactive Cover",
    description:
      "PPM and reactive cover from a single site to a multi-site portfolio, across the West Midlands. Send the ITT and completed PQQ documentation comes back within 24 hours.",
  },
};

export default function CommercialHomePage() {
  return <HomepageSections />;
}
