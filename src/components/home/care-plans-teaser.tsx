"use client";

import Link from "next/link";
import { useDivision } from "@/components/division/division-provider";

export function CarePlansTeaser() {
  const { division } = useDivision();
  if (division !== "domestic") return null;

  return (
    <section
      aria-labelledby="care-teaser-heading"
      className="mx-auto max-w-[100rem] px-6"
      style={{ paddingBottom: "var(--space-section)" }}
    >
      <div
        className="flex flex-col items-start gap-6 border p-8 md:flex-row md:items-center md:justify-between md:p-10"
        style={{ borderColor: "var(--border-hairline)", borderRadius: "var(--radius)", background: "var(--paper-raised)" }}
      >
        <div>
          <span className="section-index font-mono-label" data-index="06" style={{ color: "var(--copper-ink)" }}>
            Care plans
          </span>
          <h2 id="care-teaser-heading" className="font-display mt-4 max-w-[26ch] text-2xl" style={{ color: "var(--ink)" }}>
            Annual service, breakdown cover and priority callout, on one monthly payment.
          </h2>
          <p className="mt-3 max-w-[52ch] text-sm" style={{ color: "var(--steel)" }}>
            Cancel any time, no minimum term, and the annual service is booked by us rather than
            left for you to remember.
          </p>
        </div>
        {/* No whitespace-nowrap: at 320px this card's available width (after
            section + card padding) is under 200px, and "Compare the three
            plans" set to nowrap forced 19px of real page overflow — only
            ever caught once /domestic existed as its own route, since this
            section is domestic-only and previous sweeps mostly ran against
            the commercial default. A wrapped two-line button is fine; page
            overflow is not. */}
        <Link href="/care-plans" className="btn btn--primary text-center">
          Compare the three plans
        </Link>
      </div>
    </section>
  );
}
