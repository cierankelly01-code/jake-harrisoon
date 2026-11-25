/**
 * Care plan tiers. Prices here are STARTER figures for the Phase 1 build —
 * not confirmed retail prices. The directors must review and sign off
 * every monthly figure before this goes live, same caveat as
 * lib/quote/pricing.ts. Edit `monthlyPriceGbp` to change what Stripe
 * charges — no other code needs to change (Checkout sessions are built
 * with dynamic price_data from this file, not pre-created Stripe Price
 * objects, so there's nothing to keep in sync in the Stripe dashboard).
 */

/**
 * False until the directors sign off every monthly figure above.
 *
 * While it is false the UI must not present these as retail prices. They
 * were rendering as a hero-sized "from £8 a month" with no caveat, which
 * is exactly the invented-looking number the rest of this build refuses to
 * print — `business.ts` keeps unconfirmed facts `null` for the same reason.
 * Flip this to true in the same commit that confirms the figures.
 */
export const CARE_PLAN_PRICES_CONFIRMED = false;

export type CarePlanTier = "service" | "cover" | "complete";

export type CarePlanDefinition = {
  tier: CarePlanTier;
  name: string;
  monthlyPriceGbp: number;
  features: { label: string; included: boolean; note?: string }[];
};

export const CARE_PLANS: CarePlanDefinition[] = [
  {
    tier: "service",
    name: "Service",
    monthlyPriceGbp: 8,
    features: [
      { label: "Annual boiler service", included: true },
      { label: "Gas safety certificate", included: false },
      { label: "Breakdown cover", included: false },
      { label: "Parts & labour", included: false },
      { label: "Heating & radiators", included: false },
      { label: "Plumbing & drains", included: false },
      { label: "Priority callout", included: false },
    ],
  },
  {
    tier: "cover",
    name: "Cover",
    monthlyPriceGbp: 14,
    features: [
      { label: "Annual boiler service", included: true },
      { label: "Gas safety certificate", included: true },
      { label: "Breakdown cover", included: true },
      { label: "Parts & labour", included: true, note: "up to £500" },
      { label: "Heating & radiators", included: false },
      { label: "Plumbing & drains", included: false },
      { label: "Priority callout", included: true, note: "24hr" },
    ],
  },
  {
    tier: "complete",
    name: "Complete",
    monthlyPriceGbp: 22,
    features: [
      { label: "Annual boiler service", included: true },
      { label: "Gas safety certificate", included: true },
      { label: "Breakdown cover", included: true },
      { label: "Parts & labour", included: true, note: "unlimited" },
      { label: "Heating & radiators", included: true },
      { label: "Plumbing & drains", included: true },
      { label: "Priority callout", included: true, note: "same day" },
    ],
  },
];
