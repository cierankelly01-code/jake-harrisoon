import { Hero } from "@/components/home/hero";
import { SectorsServed } from "@/components/home/sectors-served";
import { Commitments } from "@/components/home/commitments";
import { ServicesGrid } from "@/components/home/services-grid";
import { ProcessStory } from "@/components/home/process-story";
import { Standards } from "@/components/home/standards";
import { Founders } from "@/components/home/founders";
import { ComparisonTable } from "@/components/plugins/comparison-table";
import { CarePlansTeaser } from "@/components/home/care-plans-teaser";
import { ServiceAreaMap } from "@/components/home/service-area-map";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Section order follows the local-service blueprint: Hook → Proof → Offer →
 * Objections → Close, with a deliberate light/dark alternation so the page
 * has a rhythm instead of running as one continuous cream field.
 *
 *   Hero            hook + the proof that is true today          dark
 *   Ticker          what we cover                                dark
 *   Commitments     the named guarantee (proof)                  light
 *   Services        the offer                                    light
 *   Process ★       showstopper — kills fear of the unknown      dark
 *   Standards       borrowed credibility                         dark
 *   Founders        who turns up                                 raised
 *   Comparison      objection handling                           light
 *   Care plans      secondary offer                              light
 *   Coverage        local proof                                  light
 *   FAQ             remaining objections                         light
 *   Final CTA       close                                        blue
 *
 * The empty-state sections that used to sit in the middle of this page
 * (recent work, reviews, accreditations held, half-null capability stats)
 * have been removed rather than restyled. Three consecutive panels saying
 * "nothing here yet" is worse than not having the sections, and everything
 * they were reserving space for is now covered by proof that is real on day
 * one: commitments, process, standards and the two named directors.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <SectorsServed />
      <Commitments />
      <ServicesGrid />
      <ProcessStory />
      <Standards />
      <Founders />
      <ComparisonTable />
      <CarePlansTeaser />
      <ServiceAreaMap />
      <Faq />
      <FinalCta />
    </>
  );
}
