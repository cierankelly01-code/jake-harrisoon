import type { Metadata } from "next";
import Link from "next/link";
import { DOMESTIC_PRICES, HAS_PUBLISHED_PRICES } from "@/lib/content/domestic-prices";
import { FactOrPlaceholder, PlaceholderMarker } from "@/components/ui/placeholder";

export const metadata: Metadata = {
  title: HAS_PUBLISHED_PRICES ? "Prices" : "How we price",
  description:
    "How Marmion prices domestic work: a fixed written price before we start, that does not move once we are on site.",
};

/**
 * This page used to be headlined "Real prices for straightforward jobs" above
 * a table in which all eight prices rendered as amber TBC chips — the page's
 * own content falsified its promise, and it was linked from the homepage as
 * "see published prices".
 *
 * Until the directors sign off real figures, the page leads with the thing
 * that IS true and is genuinely the differentiator — how the pricing works —
 * and routes people to the instant quote, which does produce a number today.
 * The table stays, honestly labelled, so the page becomes a price list the
 * moment `domestic-prices.ts` is filled in, with no other change needed.
 */
const PRINCIPLES = [
  {
    ref: "01",
    title: "Priced from a survey, not a phone call",
    detail:
      "We look at the actual system before quoting. Mains pressure and flow rate get measured rather than assumed, so the number is based on your house and not on an average one.",
  },
  {
    ref: "02",
    title: "One figure, everything in it",
    detail:
      "Parts, labour, flue, controls, the system cleanse and making good are all in the quoted price. There is no second invoice for the things a job always needs.",
  },
  {
    ref: "03",
    title: "It does not move",
    detail:
      "Once you have accepted a written price, that is what you pay. Not if it takes us longer, not if the old boiler fights us, not if a part costs more than we thought.",
  },
  {
    ref: "04",
    title: "Changes are agreed before they happen",
    detail:
      "If you ask for something different, or we find something that genuinely changes the job, you get a revised price in writing and you decide. Nobody carries on and bills you afterwards.",
  },
];

export default function PricesPage() {
  return (
    <>
      <section className="grain relative" style={{ background: "var(--ink)", color: "var(--paper)" }}>
        <div
          aria-hidden="true"
          className="blueprint-grid pointer-events-none absolute inset-0"
          style={{ opacity: 0.4 }}
        />
        <div
          className="relative z-10 mx-auto grid max-w-[100rem] gap-10 px-6 lg:grid-cols-12"
          style={{ paddingTop: "var(--space-section-tight)", paddingBottom: "var(--space-section-tight)" }}
        >
          <div className="lg:col-span-7">
            <span className="font-mono-label" style={{ color: "var(--copper-bright)" }}>
              Pricing
            </span>
            <h1 className="font-display font-display-xl mt-5 text-4xl">
              {HAS_PUBLISHED_PRICES
                ? "Real prices for straightforward jobs."
                : "A fixed price before we start. It does not move after."}
            </h1>
            <p className="mt-6 max-w-[48ch] text-lg" style={{ color: "var(--steel-dim)" }}>
              {HAS_PUBLISHED_PRICES
                ? "If yours isn't straightforward we'll tell you before we start, not after."
                : "The published list for straightforward jobs is being signed off. In the meantime the instant quote gives you real price bands for a boiler in about two minutes, with nothing to pay and nobody visiting."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/boiler-quote" className="btn btn--primary">
                Get an instant price
              </Link>
              <Link href="/contact" className="btn btn--secondary-dark">
                Ask about a specific job
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div
        className="mx-auto max-w-[100rem] px-6"
        style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
      >
        <section aria-labelledby="principles-heading">
          <span className="section-index font-mono-label" data-index="01" style={{ color: "var(--copper-ink)" }}>
            How we price
          </span>
          <h2 id="principles-heading" className="font-display mt-4 max-w-[24ch] text-3xl" style={{ color: "var(--ink)" }}>
            Four rules we price every job by.
          </h2>

          <ol className="mt-10 grid gap-px md:grid-cols-2" style={{ background: "var(--border-hairline)" }}>
            {PRINCIPLES.map((item, index) => (
              <li
                key={item.ref}
                className="reveal p-6 md:p-8"
                style={{ background: "var(--surface)", ["--reveal-delay" as string]: String(index) }}
              >
                <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
                  {item.ref}
                </span>
                <h3 className="font-display mt-3 text-xl" style={{ color: "var(--ink)" }}>
                  {item.title}
                </h3>
                <p className="mt-3 text-base" style={{ color: "var(--steel)" }}>
                  {item.detail}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="pricelist-heading" style={{ marginTop: "var(--space-section)" }}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="section-index font-mono-label" data-index="02" style={{ color: "var(--copper-ink)" }}>
                Price list
              </span>
              <h2 id="pricelist-heading" className="font-display mt-4 text-3xl" style={{ color: "var(--ink)" }}>
                {HAS_PUBLISHED_PRICES ? "Straightforward jobs." : "Published shortly."}
              </h2>
              {!HAS_PUBLISHED_PRICES && (
                <p className="mt-5 max-w-[40ch] text-base" style={{ color: "var(--steel)" }}>
                  These are the jobs we will publish a flat price for. We would rather leave the
                  column empty than put up a number we might have to argue with you about later —
                  it goes live once both directors have signed it off.
                </p>
              )}
            </div>

            <div className="lg:col-span-8">
              <div
                className="overflow-x-auto border"
                style={{ borderColor: "var(--border-hairline)", borderRadius: "var(--radius)" }}
              >
                <table className="w-full border-collapse text-left text-sm" style={HAS_PUBLISHED_PRICES ? { minWidth: "32rem" } : undefined}>
                  <caption className="sr-only">
                    {HAS_PUBLISHED_PRICES
                      ? "Published prices for straightforward domestic jobs"
                      : "Straightforward domestic jobs we will publish a flat price for"}
                  </caption>
                  <thead>
                    <tr style={{ background: "var(--ink)" }}>
                      <th scope="col" className="font-mono-label px-5 py-4" style={{ color: "var(--steel-dim)" }}>
                        Job
                      </th>
                      {HAS_PUBLISHED_PRICES && (
                        <th
                          scope="col"
                          className="font-mono-label px-5 py-4 text-right"
                          style={{ color: "var(--steel-dim)" }}
                        >
                          Price
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {DOMESTIC_PRICES.map((line, index) => (
                      <tr
                        key={line.job}
                        style={{
                          background: index % 2 === 0 ? "var(--surface)" : "var(--surface-raised)",
                          borderTop: "1px solid var(--border-hairline)",
                        }}
                      >
                        <th scope="row" className="px-5 py-4 font-medium" style={{ color: "var(--ink)" }}>
                          {line.job}
                          {line.note && (
                            <span className="mt-1.5 block text-xs font-normal" style={{ color: "var(--steel)" }}>
                              {line.note}
                              {line.href && (
                                <>
                                  {" "}
                                  <Link href={line.href} className="link-draw" style={{ color: "var(--ink)" }}>
                                    {line.hrefLabel ?? "More"}
                                  </Link>
                                </>
                              )}
                            </span>
                          )}
                        </th>
                        {HAS_PUBLISHED_PRICES ? (
                          <td
                            className="font-mono tnum whitespace-nowrap px-5 py-4 text-right align-top"
                            style={{ color: "var(--ink)" }}
                          >
                            <FactOrPlaceholder
                              value={line.price}
                              label={`PRICE — ${line.job.toUpperCase()}`}
                              missing="chip"
                              compact
                            />
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Audit trail for the unpublished figures. Kept outside the
                  table because a <span> is not a valid child of <tr>. */}
              {!HAS_PUBLISHED_PRICES &&
                DOMESTIC_PRICES.map((line) => (
                  <PlaceholderMarker
                    key={line.job}
                    label={`PRICE — ${line.job.toUpperCase()}`}
                  />
                ))}
              <p className="font-mono-label mt-4" style={{ color: "var(--steel)" }}>
                All prices include VAT · No callout fee on quoted work
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
