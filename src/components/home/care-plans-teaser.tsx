"use client";

import Link from "next/link";
import { useDivision } from "@/components/division/division-provider";
import { CARE_PLANS, CARE_PLAN_PRICES_CONFIRMED } from "@/lib/care-plans/tiers";
import { Arrow, Tick } from "@/components/ui/icons";
import { Placeholder } from "@/components/ui/placeholder";

/**
 * A teaser, not the plans page.
 *
 * This block used to render the full three-tier pricing grid — 1,659px on a
 * 375 screen, two whole phone screens of monthly-contract detail wedged
 * between "meet the owners" and "where we work", on a page the client asked
 * to keep simple. It was also the most template-looking object on the site:
 * three cards with a green "Recommended" badge on the middle one is a SaaS
 * pricing table, not a plumber's homepage.
 *
 * It now names the three plans and sends people to /care-plans, which
 * carries the comparison properly. The figures in `tiers.ts` are unsigned
 * off, so no price is printed here until `CARE_PLAN_PRICES_CONFIRMED`.
 */
export function CarePlansTeaser() {
  const { division } = useDivision();
  if (division !== "domestic") return null;

  return (
    <section aria-labelledby="care-teaser-heading" className="container-x section--tight">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-6">
          <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
            Boiler care plans
          </span>
          <h2
            id="care-teaser-heading"
            className="font-display mt-3 text-3xl"
            style={{ color: "var(--ink)" }}
          >
            {CARE_PLAN_PRICES_CONFIRMED
              ? `Boiler cover from £${CARE_PLANS[0].monthlyPriceGbp} a month.`
              : "Boiler cover on one monthly payment."}
          </h2>
          <p className="mt-4 max-w-[48ch] text-base" style={{ color: "var(--steel)" }}>
            Annual service, gas safety certificate and breakdown cover on one monthly payment. We
            book the service each year, so you don&rsquo;t have to remember.
          </p>
          {!CARE_PLAN_PRICES_CONFIRMED && (
            <p className="mt-4">
              <Placeholder label="CARE PLAN MONTHLY PRICES" />
            </p>
          )}
        </div>

        <div className="lg:col-span-6">
          <ul className="ticks">
            {[
              "Cancel any time, no minimum term",
              "Priority callout on the higher plans",
              "Set up online in a couple of minutes",
            ].map((line) => (
              <li key={line}>
                <span className="tick" aria-hidden="true">
                  <Tick />
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                  {line}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm" style={{ color: "var(--steel)" }}>
            Three plans:{" "}
            {CARE_PLANS.map((plan) => plan.name)
              .join(", ")
              .replace(/, ([^,]*)$/, " and $1")}
            .
          </p>

          <Link href="/care-plans" className="btn btn--secondary mt-5">
            Compare the plans
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
