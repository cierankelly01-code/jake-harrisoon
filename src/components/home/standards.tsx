"use client";

import { useDivision } from "@/components/division/division-provider";
import { business } from "@/lib/content/business";
import { COMMERCIAL_STANDARDS, DOMESTIC_STANDARDS } from "@/lib/content/promises";
import { DirectorCards, formatDirectorNames } from "@/components/home/founders";

/**
 * Borrowed credibility, done honestly — and who turns up, merged into one
 * section rather than two. Round 4 mobile-length fix: Standards and
 * Founders were back-to-back "credibility" content (a dark section
 * immediately followed by a raised one) at 1461px + 1321px on a 375px
 * viewport; one section's worth of padding and a border transition between
 * them was pure overhead. This keeps every fact from both — nothing was cut
 * — under one heading, one intro paragraph, and one set of section padding.
 *
 * The left column explains the published standards the work is carried out
 * to — describing the standard itself, which is verifiable and useful, and
 * never claiming a registration — and introduces the two people doing the
 * work. The right column stacks the director cards, the standards list
 * (which renders one as held only when `business.accreditationsHeld`
 * actually contains it — everything else is plainly labelled as being
 * worked towards), and accreditations.
 *
 * Replaces the previous "None recorded yet — see ACCREDITATION_ROADMAP.md"
 * panel, which leaked an internal filename onto the public site.
 */
const ROADMAP_TARGETS = [
  "SSIP (CHAS / SafeContractor / Constructionline)",
  "Constructionline Gold",
  "Gas Safe commercial",
  "WaterSafe",
  "F-Gas",
  "G3 unvented",
];

export function Standards() {
  const { division } = useDivision();
  const standards = division === "commercial" ? COMMERCIAL_STANDARDS : DOMESTIC_STANDARDS;
  const held = business.accreditationsHeld;

  return (
    <section
      aria-labelledby="standards-heading"
      className="grain relative border-y"
      style={{ background: "var(--ink)", color: "var(--paper)", borderColor: "var(--border-hairline-dark)" }}
    >
      <div
        className="relative z-10 mx-auto max-w-[100rem] px-6"
        style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
      >
        <div className="grid gap-7 sm:gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="section-index font-mono-label" data-index="04" style={{ color: "var(--copper-bright)" }}>
              Standards &amp; who turns up
            </span>
            <h2 id="standards-heading" className="font-display mt-4 text-3xl">
              The standards the work is done to, by two engineers, not a call centre.
            </h2>
            <p className="mt-5 max-w-[42ch] text-sm" style={{ color: "var(--steel-dim)" }}>
              {business.tradingName} is owned {business.ownership} by{" "}
              {formatDirectorNames(business.directors.map((d) => d.firstName))}, both Gas Safe
              registered and still on the tools — the person who quotes your job is the person who
              does it. What follows are published national standards, not badges we have awarded
              ourselves: where a scheme requires registration, we list it as held only once it is.
            </p>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-8">
            <DirectorCards />

            <div className="grid gap-px" style={{ background: "var(--border-hairline-dark)" }}>
            {standards.map((standard, index) => (
              <div
                key={standard.code}
                className="reveal grid gap-2 p-6 sm:grid-cols-12 sm:gap-6"
                style={{ background: "var(--ink)", ["--reveal-delay" as string]: String(index) }}
              >
                <span className="font-mono text-sm sm:col-span-3" style={{ color: "var(--flame-glow)" }}>
                  {standard.code}
                </span>
                <span className="font-display text-lg sm:col-span-4" style={{ color: "var(--paper)" }}>
                  {standard.name}
                </span>
                <span className="text-sm sm:col-span-5" style={{ color: "var(--steel-dim)" }}>
                  {standard.what}
                </span>
              </div>
            ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-px border-t pt-8 sm:mt-12 sm:pt-12 md:grid-cols-2" style={{ borderColor: "var(--border-hairline-dark)" }}>
          <div className="pr-8">
            <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
              Accreditations held
            </span>
            {held.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {held.map((item) => (
                  <li
                    key={item}
                    className="font-mono-label border px-3 py-2"
                    style={{ borderColor: "var(--flame-glow)", color: "var(--paper)", borderRadius: "var(--radius)" }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 max-w-[42ch] text-sm" style={{ color: "var(--steel-dim)" }}>
                None yet. We would rather show you an empty list than a logo we have not earned — every
                accreditation below appears here, with its registration number, the day it is awarded.
              </p>
            )}
          </div>

          <div className="border-t pt-8 md:border-l md:border-t-0 md:pl-8 md:pt-0" style={{ borderColor: "var(--border-hairline-dark)" }}>
            <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
              Working towards
            </span>
            <ul className="mt-4 flex flex-wrap gap-2">
              {ROADMAP_TARGETS.map((item) => (
                <li
                  key={item}
                  className="font-mono-label border px-3 py-2"
                  style={{
                    borderColor: "var(--border-hairline-dark)",
                    color: "var(--steel-dim)",
                    borderRadius: "var(--radius)",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
