/**
 * Published domestic pricing. Every `price` is null until the directors
 * confirm real figures — see CONTENT_NEEDED.md. Never invent a number here;
 * the whole point of this page is that the prices are real.
 *
 * `href` turns a note into a real link rather than printing a route path as
 * body copy, which is what "see /boiler-quote for a banded price" was doing.
 */
export type PriceLine = {
  job: string;
  price: string | null;
  note?: string;
  href?: string;
  hrefLabel?: string;
};

export const DOMESTIC_PRICES: PriceLine[] = [
  { job: "Annual boiler service", price: null },
  { job: "Gas safety certificate (CP12)", price: null },
  { job: "Landlord gas safety certificate", price: null },
  { job: "Power flush (up to 10 radiators)", price: null },
  { job: "Radiator replacement (supply & fit)", price: null },
  { job: "Unvented cylinder service", price: null },
  {
    job: "Emergency callout (evenings/weekends)",
    price: null,
    note: "No callout fee on work you have accepted a price for.",
  },
  {
    job: "Combi boiler swap, like-for-like",
    price: null,
    note: "Priced per property rather than as one figure — the instant quote gives you bands in about two minutes.",
    href: "/boiler-quote",
    hrefLabel: "Build a price",
  },
];

/** True once the directors have signed off at least one real figure. */
export const HAS_PUBLISHED_PRICES = DOMESTIC_PRICES.some((line) => line.price !== null);
