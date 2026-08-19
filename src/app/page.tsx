import { Hero } from "@/components/home/hero";
import { CredibilityBar } from "@/components/home/credibility-bar";
import { CapabilitySnapshot } from "@/components/home/capability-snapshot";
import { ServicesGrid } from "@/components/home/services-grid";
import { RecentWork } from "@/components/home/recent-work";
import { SectorsServed } from "@/components/home/sectors-served";
import { AccreditationWall } from "@/components/home/accreditation-wall";
import { ReviewsOrReferences } from "@/components/home/reviews-or-references";
import { ServiceAreaMap } from "@/components/home/service-area-map";
import { CarePlansTeaser } from "@/components/home/care-plans-teaser";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CredibilityBar />
      <CapabilitySnapshot />
      <ServicesGrid />
      <RecentWork />
      <SectorsServed />
      <AccreditationWall />
      <ReviewsOrReferences />
      <ServiceAreaMap />
      <CarePlansTeaser />
      <Faq />
      <FinalCta />
    </>
  );
}
