/**
 * Boiler quote pricing config. Edit the numbers in this file to change
 * prices sitewide — no other code needs to change. See HANDOFF.md
 * "Editing boiler prices" for a worked example.
 *
 * These are STARTER figures for the Phase 1 build, not confirmed retail
 * prices — the directors must review and adjust every band before this
 * goes live. Nothing here is presented to a customer as a guaranteed
 * price: the quote engine always shows a banded range across three tiers,
 * never a single number, and always follows with a survey to confirm.
 */

export type PropertyType = "flat" | "terraced" | "semi_detached" | "detached" | "bungalow";
export type CurrentSystem = "combi" | "system" | "regular" | "back_boiler" | "electric" | "none";
export type BoilerTier = "budget" | "recommended" | "premium";

export type QuoteInput = {
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  currentSystem: CurrentSystem;
  movingLocation: boolean; // target boiler location differs from current
};

export type QuoteTier = {
  tier: BoilerTier;
  label: string;
  boiler: string;
  kw: number;
  priceLow: number;
  priceHigh: number;
  warrantyYears: number;
  monthlyOver60: number;
};

/** Base combi kW recommendation by bedrooms/bathrooms — rough sizing rule,
 * a real survey always overrides this. */
function recommendedKw(bedrooms: number, bathrooms: number): number {
  if (bedrooms <= 2 && bathrooms <= 1) return 24;
  if (bedrooms <= 3 && bathrooms <= 1) return 28;
  if (bedrooms <= 4 || bathrooms >= 2) return 30;
  return 35;
}

const TIER_MULTIPLIER: Record<BoilerTier, number> = {
  budget: 0.85,
  recommended: 1,
  premium: 1.35,
};

const TIER_BOILER_NAME: Record<BoilerTier, (kw: number) => string> = {
  budget: (kw) => `Budget ${kw}kW Combi`,
  recommended: (kw) => `Worcester Bosch 4000 ${kw}kW Combi`,
  premium: (kw) => `Worcester Bosch 8000 Style ${kw}kW Combi`,
};

const TIER_WARRANTY: Record<BoilerTier, number> = {
  budget: 5,
  recommended: 10,
  premium: 12,
};

const BASE_PRICE_LOW = 1850; // straightforward like-for-like combi swap
const BASE_PRICE_HIGH = 2400;

const COMPLEXITY_UPLIFT: Record<CurrentSystem, number> = {
  combi: 0, // like-for-like
  system: 250,
  regular: 350,
  back_boiler: 900, // strip-out, new flue run — see the Docket example in §5
  electric: 500,
  none: 700,
};

const MOVING_LOCATION_UPLIFT = 400;

export function calculateQuote(input: QuoteInput): QuoteTier[] {
  const kw = recommendedKw(input.bedrooms, input.bathrooms);
  const complexityUplift = COMPLEXITY_UPLIFT[input.currentSystem] + (input.movingLocation ? MOVING_LOCATION_UPLIFT : 0);

  return (["budget", "recommended", "premium"] as BoilerTier[]).map((tier) => {
    const low = Math.round((BASE_PRICE_LOW + complexityUplift) * TIER_MULTIPLIER[tier]);
    const high = Math.round((BASE_PRICE_HIGH + complexityUplift) * TIER_MULTIPLIER[tier]);
    const midpoint = (low + high) / 2;
    return {
      tier,
      label: tier === "recommended" ? "RECOMMENDED" : tier === "budget" ? "BUDGET" : "PREMIUM",
      boiler: TIER_BOILER_NAME[tier](kw),
      kw,
      priceLow: low,
      priceHigh: high,
      warrantyYears: TIER_WARRANTY[tier],
      monthlyOver60: Math.round(midpoint / 60),
    };
  });
}
