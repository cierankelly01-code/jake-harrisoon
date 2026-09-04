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
 * PLUGIN — announcement ticker (marquee).
 *
 * The track is duplicated in the markup and the clone carries aria-hidden,
 * so a screen reader hears the list once. It pauses on hover and on keyboard
 * focus, and reduced motion turns it into an ordinary horizontally
 * scrollable strip rather than freezing content out of reach.
 */
export function SectorsServed() {
  const { division } = useDivision();
  const isCommercial = division === "commercial";
  const items = isCommercial ? SECTORS : DOMESTIC_WORK;
  const label = isCommercial ? "Sectors served" : "What we do";

  return (
    <section
      aria-labelledby="ticker-heading"
      className="overflow-hidden border-y"
      style={{ background: "var(--ink)", borderColor: "var(--border-hairline-dark)" }}
    >
      <h2 id="ticker-heading" className="sr-only">
        {label}
      </h2>
      <div className="marquee py-5" style={{ ["--marquee-duration" as string]: "48s" }}>
        <div className="marquee__track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 ? "true" : undefined}
              className="flex shrink-0 items-center"
            >
              {items.map((item) => (
                <li key={item} className="font-mono-label flex items-center gap-6 px-6" style={{ color: "var(--steel-dim)" }}>
                  <span
                    aria-hidden="true"
                    style={{ color: "var(--copper-bright)", letterSpacing: 0 }}
                  >
                    ◆
                  </span>
                  <span style={{ whiteSpace: "nowrap" }}>{item}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
