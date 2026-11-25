"use client";

import { useDivision } from "@/components/division/division-provider";
import { COMMERCIAL_PROMISES, DOMESTIC_PROMISES } from "@/lib/content/promises";

/**
 * Three things the quote includes that are often charged as extras. The
 * core promises live in the hero; this section does not repeat them.
 */
const DOMESTIC_EXTRA = [
  {
    id: "cleanse",
    title: "System cleanse and filter included",
    detail: "Every new boiler goes on a cleaned, inhibited system with a magnetic filter. It's on the quote, not added on the day.",
  },
  {
    id: "warranty",
    title: "Warranty registered for you",
    detail: "We commission the boiler, complete the benchmark record and register the manufacturer's warranty the same day.",
  },
];

const ICONS: Record<string, React.ReactNode> = {
  price: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M8 10h8M8 14h5" />
    </svg>
  ),
  engineers: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0113 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15 20a5 5 0 016.5-4.8" />
    </svg>
  ),
  arrival: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  callout: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12a8 8 0 1016 0 8 8 0 00-16 0z" />
      <path d="M9.5 9.5a2.5 2.5 0 015 0c0 1.8-2.5 2-2.5 4M12 17h.01" />
    </svg>
  ),
  cleanse: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z" />
    </svg>
  ),
  warranty: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
};

export function WhyMarmion() {
  const { division } = useDivision();
  const promises = division === "commercial" ? COMMERCIAL_PROMISES : DOMESTIC_PROMISES;
  // The hero already makes the first three promises; this section carries
  // what the quote includes that people usually pay extra for.
  const items =
    division === "commercial"
      ? promises
      : [promises.find((p) => p.id === "callout")!, ...DOMESTIC_EXTRA.map((e) => ({ ...e, proof: "" }))];

  return (
    <section
      aria-labelledby="why-heading"
      className="section"
      style={{ background: "var(--paper-raised)" }}
    >
      <div className="container-x">
        <div className="max-w-[60ch]">
          <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
            What&rsquo;s included
          </span>
          <h2 id="why-heading" className="font-display mt-3 text-3xl" style={{ color: "var(--ink)" }}>
            Included in every boiler price.
          </h2>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="card reveal flex flex-col gap-4 p-6"
              style={{ ["--reveal-delay" as string]: String(index % 3) }}
            >
              <span className="icon-well" aria-hidden="true">
                {ICONS[item.id] ?? ICONS.price}
              </span>
              <div>
                <h3 className="font-display text-lg" style={{ color: "var(--ink)" }}>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--steel)" }}>
                  {item.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
