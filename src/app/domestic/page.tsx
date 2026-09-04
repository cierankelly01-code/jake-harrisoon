import type { Metadata } from "next";
import { HomepageSections } from "@/components/home/homepage-sections";

/**
 * The domestic homepage's own, indexable, shareable URL — the counterpart
 * to /commercial. See DESIGN_SYSTEM.md §10 and commercial/page.tsx.
 */
export const metadata: Metadata = {
  title: "Boiler Installation & Emergency Plumbing | Tamworth & the West Midlands",
  description:
    "Gas Safe registered engineers who quote the job and then do the job. Build your own boiler price in about two minutes — no salesperson, and no home visit needed to get a number.",
  alternates: { canonical: "/domestic" },
  openGraph: {
    url: "/domestic",
    title: "Boiler Installation & Emergency Plumbing | Tamworth & the West Midlands",
    description:
      "Gas Safe registered engineers who quote the job and then do the job. Build your own boiler price in about two minutes — no salesperson, and no home visit needed to get a number.",
  },
};

export default function DomesticHomePage() {
  return <HomepageSections />;
}
