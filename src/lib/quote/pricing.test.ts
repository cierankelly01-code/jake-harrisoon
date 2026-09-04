import { describe, expect, it } from "vitest";
import { calculateQuote, deriveMovingLocation, type QuoteInput } from "./pricing";

describe("deriveMovingLocation", () => {
  // The regression this whole function exists to guard: the wizard tells a
  // customer to leave "target location" blank if the boiler is staying put,
  // and a blank field posts as "". Comparing that raw against the current
  // location ("" !== "kitchen") used to read as "yes, moving" and applied
  // the relocation uplift to essentially every quote the site produced.
  it("is false when the target location is left blank", () => {
    expect(deriveMovingLocation("Kitchen", "")).toBe(false);
    expect(deriveMovingLocation("", "")).toBe(false);
  });

  it("is false when target is whitespace-only", () => {
    expect(deriveMovingLocation("Kitchen", "   ")).toBe(false);
  });

  it("is false when target matches current, regardless of case or padding", () => {
    expect(deriveMovingLocation("Kitchen", "kitchen")).toBe(false);
    expect(deriveMovingLocation("Kitchen", "  Kitchen  ")).toBe(false);
    expect(deriveMovingLocation("  Airing Cupboard  ", "airing cupboard")).toBe(false);
  });

  it("is true when target differs from current", () => {
    expect(deriveMovingLocation("Kitchen", "Loft")).toBe(true);
  });

  it("is true when a target is given but no current location was recorded", () => {
    expect(deriveMovingLocation("", "Loft")).toBe(true);
  });
});

describe("calculateQuote", () => {
  const baseInput: QuoteInput = {
    propertyType: "semi_detached",
    bedrooms: 3,
    bathrooms: 1,
    currentSystem: "combi",
    movingLocation: false,
  };

  it("always returns exactly three tiers, in budget/recommended/premium order", () => {
    const tiers = calculateQuote(baseInput);
    expect(tiers.map((t) => t.tier)).toEqual(["budget", "recommended", "premium"]);
  });

  it("prices strictly increase from budget to premium", () => {
    const [budget, recommended, premium] = calculateQuote(baseInput);
    expect(budget.priceLow).toBeLessThan(recommended.priceLow);
    expect(recommended.priceLow).toBeLessThan(premium.priceLow);
    expect(budget.priceHigh).toBeLessThan(recommended.priceHigh);
    expect(recommended.priceHigh).toBeLessThan(premium.priceHigh);
  });

  it("applies no complexity or relocation uplift for a like-for-like combi swap that stays put", () => {
    const [, recommended] = calculateQuote(baseInput);
    // Base band (BASE_PRICE_LOW/HIGH) at the recommended tier's 1x
    // multiplier — a plain regression check against the pricing.ts
    // constants, so an accidental change to either shows up here.
    expect(recommended.priceLow).toBe(1850);
    expect(recommended.priceHigh).toBe(2400);
  });

  it("applies the complexity uplift for the current system", () => {
    const [, combi] = calculateQuote({ ...baseInput, currentSystem: "combi" });
    const [, backBoiler] = calculateQuote({ ...baseInput, currentSystem: "back_boiler" });
    // back_boiler carries the largest uplift (strip-out, new flue run).
    expect(backBoiler.priceLow - combi.priceLow).toBe(900);
    expect(backBoiler.priceHigh - combi.priceHigh).toBe(900);
  });

  it("adds the relocation uplift on top of the complexity uplift when moving", () => {
    const [, stationary] = calculateQuote({ ...baseInput, currentSystem: "back_boiler", movingLocation: false });
    const [, moving] = calculateQuote({ ...baseInput, currentSystem: "back_boiler", movingLocation: true });
    expect(moving.priceLow - stationary.priceLow).toBe(400);
    expect(moving.priceHigh - stationary.priceHigh).toBe(400);
  });

  it("sizes the recommended kW by bedrooms and bathrooms", () => {
    expect(calculateQuote({ ...baseInput, bedrooms: 2, bathrooms: 1 })[0].kw).toBe(24);
    expect(calculateQuote({ ...baseInput, bedrooms: 3, bathrooms: 1 })[0].kw).toBe(28);
    expect(calculateQuote({ ...baseInput, bedrooms: 4, bathrooms: 1 })[0].kw).toBe(30);
    // Two bathrooms pushes a small property up a size even at 2 bedrooms.
    expect(calculateQuote({ ...baseInput, bedrooms: 2, bathrooms: 2 })[0].kw).toBe(30);
    // Big and multi-bathroom still tops out at 30 — only a large *single*
    // bathroom property (>4 bedrooms, <2 bathrooms) falls through to 35.
    expect(calculateQuote({ ...baseInput, bedrooms: 5, bathrooms: 3 })[0].kw).toBe(30);
    expect(calculateQuote({ ...baseInput, bedrooms: 6, bathrooms: 1 })[0].kw).toBe(35);
  });

  it("derives the monthly figure from the midpoint of the banded price over 60 months", () => {
    const [, recommended] = calculateQuote(baseInput);
    const expectedMonthly = Math.round((recommended.priceLow + recommended.priceHigh) / 2 / 60);
    expect(recommended.monthlyOver60).toBe(expectedMonthly);
  });

  it("gives every tier a longer warranty than the one below it", () => {
    const [budget, recommended, premium] = calculateQuote(baseInput);
    expect(budget.warrantyYears).toBeLessThan(recommended.warrantyYears);
    expect(recommended.warrantyYears).toBeLessThan(premium.warrantyYears);
  });
});
