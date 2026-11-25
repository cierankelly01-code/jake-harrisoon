import Link from "next/link";
import { DOMESTIC_PRICES, HAS_PUBLISHED_PRICES } from "@/lib/content/domestic-prices";
import { Arrow, Tick } from "@/components/ui/icons";

/**
 * The transparent-pricing band.
 *
 * The client's reference site leads with "TRANSPARENT PRICING — we publish
 * all of our basic pricing information". That is the right promise to
 * borrow, and the wrong one to fake: Hartson's published figures are all
 * `null` until the directors sign them off (see `domestic-prices.ts`).
 *
 * So the band promises the *behaviour*, which is true today and checkable,
 * and only lists real figures once `HAS_PUBLISHED_PRICES` turns true. No
 * "from £XX" is invented to fill the space.
 */

const COMMITMENTS = [
  "A fixed written price before an engineer starts",
  "It does not move for parts, time, or what we find behind the old boiler",
  "No callout fee on work you have accepted a price for",
];

export function PricePromise() {
  const published = DOMESTIC_PRICES.filter((line) => line.price !== null);

  return (
    <section
      className="section band-green-deep"
      style={{ background: "var(--flame-deep)" }}
      aria-labelledby="price-promise-heading"
    >
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p
              className="font-mono-label text-xs"
              style={{ color: "var(--flame-pale)", letterSpacing: "0.12em" }}
            >
              TRANSPARENT PRICING
            </p>
            <h2
              id="price-promise-heading"
              className="font-display font-display-xl mt-3 max-w-[14ch] text-4xl"
              style={{ color: "var(--paper)" }}
            >
              The price we quote is the price you pay.
            </h2>
            <p className="mt-5 max-w-[46ch] text-base" style={{ color: "var(--flame-pale)" }}>
              The only thing that changes a quoted price is you changing the scope, in
              writing. That is the whole policy.
            </p>

            <Link href="/prices" className="btn btn--white btn--lg mt-7">
              {/* Not "See what things cost" — /prices currently publishes
                  no figures, so that label promised something the page
                  cannot deliver. */}
              How we price
              <Arrow />
            </Link>
          </div>

          <div className="lg:col-span-6">
            <ul className="grid list-none gap-4 p-0">
              {COMMITMENTS.map((line) => (
                <li key={line} className="flex gap-3">
                  <span
                    className="tick mt-0.5 shrink-0"
                    aria-hidden="true"
                    style={{ background: "var(--flame)", color: "var(--ink)" }}
                  >
                    <Tick />
                  </span>
                  <span className="text-base" style={{ color: "var(--paper)" }}>
                    {line}
                  </span>
                </li>
              ))}
            </ul>

            {HAS_PUBLISHED_PRICES && (
              <dl
                className="mt-8 grid gap-px overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.18)",
                  borderRadius: "var(--radius)",
                }}
              >
                {published.map((line) => (
                  <div
                    key={line.job}
                    className="flex items-baseline justify-between gap-4 px-4 py-3"
                    style={{ background: "var(--flame-deep)" }}
                  >
                    <dt className="text-sm" style={{ color: "var(--flame-pale)" }}>
                      {line.job}
                    </dt>
                    <dd
                      className="tnum font-display text-lg"
                      style={{ color: "var(--paper)" }}
                    >
                      {line.price}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
