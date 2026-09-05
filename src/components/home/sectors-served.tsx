"use client";

import { useDivision } from "@/components/division/division-provider";

export const SECTORS = [
  "Main contractors",
  "Housing associations",
  "Local authority",
  "Healthcare",
  "Education",
  "Hospitality",
  "Retail",
  "Offices",
  "Care homes",
  "Leisure",
  "Industrial",
  "Letting agents",
];

export const DOMESTIC_WORK = [
  "Boiler installation",
  "Combi swaps",
  "Annual servicing",
  "Gas safety certificates",
  "Power flushing",
  "Radiator upgrades",
  "Unvented cylinders",
  "Underfloor heating",
  "Emergency plumbing",
  "Landlord CP12",
  "Thermostats & controls",
  "Leak detection",
];

/**
 * A spec-sheet index strip. An infinite-scroll marquee used to sit here —
 * killed alongside the footer wordmark as the other most template-legible
 * element on the page (every "as seen in" logo scroller does the same
 * trick). What replaces it does the same job — a scannable list of what's
 * covered, right under the hero — as a static schedule: each item gets its
 * own two-digit index like a drawing register entry, ticked off with hairline
 * dividers instead of an auto-scrolling bullet train. No motion to pause on
 * hover or fight with reduced-motion, and a screen reader hears the list
 * exactly once because there is only one copy of it.
 *
 * A single scrollable row rather than wrapping: wrapping twelve items at
 * 375px ran to six stacked rows (~300px, five times the marquee it
 * replaced) and undid part of the mobile-length work done elsewhere on the
 * page. A horizontal `overflow-x-auto` strip keeps the section a fixed,
 * short height at every width — the same "wide content scrolls in its own
 * lane" rule the /privacy table already follows.
 *
 * `.scroll-fade-x--dark` on the list: without it, a static screenshot at
 * 375px shows item 2 cut off mid-word ("02 COMBI SW") with no cue it
 * continues — a fresh reviewer read that as a broken fragment, not a
 * scrollable strip. Same fade/edge-hint technique as the comparison
 * table, just the dark-background variant.
 */
export function SectorsServed() {
  const { division } = useDivision();
  const isCommercial = division === "commercial";
  const items = isCommercial ? SECTORS : DOMESTIC_WORK;
  const label = isCommercial ? "Sectors served" : "What we do";

  return (
    <section
      aria-labelledby="ticker-heading"
      className="border-y"
      style={{ background: "var(--ink)", borderColor: "var(--border-hairline-dark)" }}
    >
      <h2 id="ticker-heading" className="sr-only">
        {label}
      </h2>
      <ul className="scroll-fade-x scroll-fade-x--dark mx-auto flex max-w-[100rem] flex-nowrap overflow-x-auto">
        {items.map((item, index) => (
          <li
            key={item}
            className="font-mono-label flex shrink-0 items-center gap-2.5 border-r px-4 py-3 sm:px-5"
            style={{ color: "var(--steel-dim)", borderColor: "var(--border-hairline-dark)" }}
          >
            <span aria-hidden="true" style={{ color: "var(--copper-bright)", letterSpacing: 0 }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span style={{ whiteSpace: "nowrap" }}>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
