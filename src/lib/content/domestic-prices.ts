/**
 * Published domestic pricing. Every `price` is null until the directors
 * confirm real figures — see CONTENT_NEEDED.md. Never invent a number
 * here; the whole point of this page is that the prices are real.
 */
export type PriceLine = { job: string; price: string | null; note?: string };

export const DOMESTIC_PRICES: PriceLine[] = [
  { job: "Annual boiler service", price: null },
  { job: "Gas safety certificate (CP12)", price: null },
  { job: "Landlord gas safety certificate", price: null },
  { job: "Power flush (up to 10 radiators)", price: null },
  { job: "Radiator replacement (supply & fit)", price: null },
  { job: "Unvented cylinder service", price: null },
  { job: "Emergency callout (evenings/weekends)", price: null, note: "no callout fee on quoted work" },
  { job: "Combi boiler swap, like-for-like", price: null, note: "see /boiler-quote for a banded price" },
];
