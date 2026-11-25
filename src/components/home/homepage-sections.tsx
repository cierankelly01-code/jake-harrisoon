import { HeroNight } from "@/components/home/hero-night";
import { NeedRouter } from "@/components/home/need-router";
import { EverythingWeDo } from "@/components/home/everything-we-do";
import { PricePromise } from "@/components/home/price-promise";
import { HowItWorks } from "@/components/home/how-it-works";
import { Engineers } from "@/components/home/engineers";
import { CarePlansTeaser } from "@/components/home/care-plans-teaser";
import { ServiceAreaMap } from "@/components/home/service-area-map";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Homepage content, shared by `/`, `/commercial` and `/domestic` so all
 * three render identical markup; only the division context differs.
 *
 * Reordered November 2026 for the green/black rebuild (see DESIGN.md). The
 * client asked for rygroup.co.uk's shape — one bold colour, big type, a
 * "what are you looking for" router and a full service list — with the
 * carousels, the chat widget and the unverifiable award and rating blocks
 * left out.
 *
 *   Hero            who we are, three ways in
 *   Need router     the signature moment — route by need, not audience
 *   Everything      the full domestic service list, all visible, no slider
 *   Price promise   the transparent-pricing band, behaviour not fake figures
 *   How it works    three steps + what happens on the day
 *   Engineers       Jake and Harrison, the actual differentiator
 *   Care plans      secondary offer (domestic only)
 *   Coverage        local proof
 *   FAQ             remaining objections
 *   Final CTA       close
 *
 * `boiler-types`, `why-marmion`, `comparison-table`, the old `hero` and
 * `quick-price` came off the homepage because the client asked for "nice
 * and simple" and the page was arguing the same point four times.
 *
 * They are now orphaned — nothing imports any of them. They are being kept
 * through the client-feedback round in case a section is asked for back,
 * and should be deleted along with their dead CSS (`.docket*`,
 * `.utility-strip`, `.icon-well*`, `.price-flip`, `.seg`, `.reveal--lead`,
 * `.tick--on-dark`, `.chip--dark`, `.card--dark`, `.scroll-fade-x*`,
 * `.footer-cta__arrow`) once the structure is signed off. Do not read their
 * presence as evidence they are wired up anywhere.
 */
export function HomepageSections() {
  return (
    <>
      <HeroNight />
      <NeedRouter />
      <EverythingWeDo />
      <PricePromise />
      <HowItWorks />
      <Engineers />
      <CarePlansTeaser />
      <ServiceAreaMap />
      <Faq />
      <FinalCta />
    </>
  );
}
