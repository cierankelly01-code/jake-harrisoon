"use client";

import { useDivision } from "@/components/division/division-provider";
import { COMMERCIAL_PROMISES, DOMESTIC_PROMISES } from "@/lib/content/promises";

/**
 * The named guarantee, in the form this trade actually respects: a numbered
 * schedule of commitments, each with the thing that makes it checkable.
 *
 * This is the no-reviews-yet playbook (conversion-blueprints.md) doing the
 * work a review wall would normally do. A business with no published reviews
 * still has commitments it will be held to, and stating them precisely beats
 * an empty testimonials section every time.
 */
export function Commitments() {
  const { division } = useDivision();
  const promises = division === "commercial" ? COMMERCIAL_PROMISES : DOMESTIC_PROMISES;
  const isCommercial = division === "commercial";

  return (
    <section
      aria-labelledby="commitments-heading"
      className="mx-auto max-w-[100rem] px-6"
      style={{ paddingTop: "var(--space-section-dense)", paddingBottom: "var(--space-section-dense)" }}
    >
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="section-index font-mono-label" data-index="01" style={{ color: "var(--copper-ink)" }}>
            What we commit to
          </span>
          <h2 id="commitments-heading" className="font-display mt-4 max-w-[22ch] text-3xl" style={{ color: "var(--ink)" }}>
            {isCommercial
              ? "Four things you can hold us to on any contract."
              : "Four things you can hold us to on any job."}
          </h2>
        </div>
        <p className="max-w-[40ch] text-sm" style={{ color: "var(--steel)" }}>
          Written down so they can be checked, not implied so they can be argued about later.
        </p>
      </header>

      {/* One reveal on the list, not four on each row: motion-cookbook
          discipline caps sitewide reveal targets at ~8, and four numbered
          rows in the same list read as one idea arriving together anyway —
          staggering them individually bought nothing but reveal budget. */}
      <ol className="reveal mt-10 grid gap-px" style={{ background: "var(--border-hairline)" }}>
        {promises.map((promise, index) => (
          <li
            key={promise.id}
            className="group grid gap-4 p-6 md:grid-cols-12 md:gap-8 md:p-8"
            style={{ background: "var(--surface)" }}
          >
            <div className="flex items-start gap-4 md:col-span-5">
              <span className="font-mono-label pt-1" style={{ color: "var(--copper-ink)" }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl leading-tight" style={{ color: "var(--ink)" }}>
                {promise.title}
              </h3>
            </div>
            <p className="text-base md:col-span-4" style={{ color: "var(--steel)" }}>
              {promise.detail}
            </p>
            <p
              className="border-l-2 pl-4 text-sm md:col-span-3"
              style={{ borderColor: "var(--flame)", color: "var(--ink)" }}
            >
              {promise.proof}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
