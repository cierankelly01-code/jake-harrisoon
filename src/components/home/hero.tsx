"use client";

import Link from "next/link";
import { useDivision } from "@/components/division/division-provider";
import { business } from "@/lib/content/business";
import { FactOrPlaceholder } from "@/components/ui/placeholder";
import { track } from "@/lib/analytics";

/**
 * Hero pattern: BENTO (art-directions.md §hero catalog 4) — one headline cell
 * plus proof cells in an asymmetric grid.
 *
 * Chosen over the split-editorial and big-type patterns for a specific
 * reason: this business has no photography and no published proof yet, so a
 * pattern that leans on a hero image or on a single claim would have nothing
 * to put in it. A bento's cells can be filled with things that are true on
 * day one — coverage, commitments, the two divisions — and it degrades
 * gracefully as real facts arrive to replace them.
 */

const COPY = {
  commercial: {
    eyebrow: "Mechanical · PPM · Statutory compliance",
    headline: "One contract. Every statutory certificate. One renewal date.",
    sub: "PPM and reactive cover from a single site to a multi-site portfolio, across the West Midlands. Send us the ITT and completed PQQ documentation comes back within 24 hours.",
    primaryCta: { label: "Get the capability statement", href: "/capability" },
    secondaryCta: { label: "Submit a tender enquiry", href: "/tenders" },
    // Two fields is the real cost of the PDF, so say two fields. Claiming
    // "no account needed · issued immediately" in front of a form reads as
    // a bait-and-switch the moment the form appears.
    reassurance: "Name and work email · PDF downloads on the spot · RAMS before every mobilisation",
  },
  domestic: {
    eyebrow: "Boilers · Heating · Emergency plumbing",
    headline: "Priced before we start. Fixed until we finish.",
    sub: "Gas Safe registered engineers who quote the job and then do the job. Build your own boiler price in about two minutes — no salesperson, and no home visit needed to get a number.",
    primaryCta: { label: "Build my boiler price", href: "/boiler-quote" },
    secondaryCta: { label: "How we price", href: "/prices" },
    // Says what the quote actually costs the reader in time and detail. The
    // previous line ("PDF issued immediately · no account needed") oversold a
    // funnel that is eight questions long and ends at a contact-details gate.
    reassurance: "Eight questions, about two minutes · No callout fee on quoted work · No obligation",
  },
} as const;

export function Hero() {
  const { division } = useDivision();
  const copy = COPY[division];
  const isCommercial = division === "commercial";

  const fg = isCommercial ? "var(--paper)" : "var(--ink)";
  const muted = isCommercial ? "var(--steel-dim)" : "var(--steel)";
  const rule = isCommercial ? "var(--border-hairline-dark)" : "var(--border-hairline)";
  // Copper needs a different value per surface to hold AA: --copper itself is
  // a border colour and only reaches 4.46:1 as text on --paper.
  const accent = isCommercial ? "var(--copper-bright)" : "var(--copper-ink)";

  return (
    <section
      className={`relative overflow-hidden ${isCommercial ? "grain" : ""}`}
      style={{
        background: isCommercial
          ? "linear-gradient(158deg, var(--ink) 0%, var(--ink) 42%, var(--flame-deep) 132%)"
          : "var(--paper)",
        color: fg,
      }}
    >
      {/* Blueprint hairline grid — used once, here, so it stays a signature
          rather than wallpaper. */}
      <div
        aria-hidden="true"
        className="blueprint-grid pointer-events-none absolute inset-0"
        style={{ opacity: isCommercial ? 0.5 : 0.35 }}
      />
      {isCommercial && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(58% 46% at 18% 14%, var(--flame) 0%, transparent 68%)",
            opacity: 0.3,
          }}
        />
      )}

      <div
        className="relative z-10 mx-auto max-w-[100rem] px-6"
        style={{
          paddingTop: "clamp(1.75rem, 0.4rem + 4.2vw, 6rem)",
          paddingBottom: "clamp(2rem, 0.6rem + 4.2vw, 6rem)",
        }}
      >
        {/* Hairlines are drawn as real borders rather than by showing a
            container background through 1px grid gaps: the headline cell is
            transparent so the section gradient reads through it, and a gap
            trick would have flooded that cell with the rule colour. */}
        <div className="grid lg:grid-cols-12">
          {/* Headline cell */}
          <div
            className="flex flex-col justify-between gap-6 px-5 py-6 sm:gap-8 sm:p-8 lg:col-span-8 lg:p-10"
            style={{ borderTop: `1px solid ${rule}`, borderBottom: `1px solid ${rule}` }}
          >
            <div>
              <span className="font-mono-label" style={{ color: accent }}>
                {copy.eyebrow}
              </span>
              {/* --text-hero, not --text-5xl: the 44px floor ran this to eight
                  lines on a 375px phone and pushed the primary CTA off the
                  fold. Sub copy is clamped too so hero + CTA clear 812px. */}
              <h1
                className="font-display font-display-xl mt-4 sm:mt-6"
                style={{ color: fg, fontSize: "var(--text-hero)" }}
              >
                {copy.headline}
              </h1>
              <p
                className="mt-4 max-w-[46ch] sm:mt-7"
                style={{
                  color: muted,
                  fontSize: "clamp(1rem, 0.94rem + 0.28vw, 1.125rem)",
                }}
              >
                {copy.sub}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={copy.primaryCta.href}
                  onClick={() => track("cta_click", { location: "hero", action: "primary" })}
                  className="btn btn--primary"
                >
                  {copy.primaryCta.label}
                </Link>
                <Link
                  href={copy.secondaryCta.href}
                  onClick={() => track("cta_click", { location: "hero", action: "secondary" })}
                  className={`btn ${isCommercial ? "btn--secondary-dark" : "btn--secondary"}`}
                >
                  {copy.secondaryCta.label}
                </Link>
              </div>
              <p className="font-mono-label mt-4" style={{ color: muted, letterSpacing: "0.1em" }}>
                {copy.reassurance}
              </p>
            </div>
          </div>

          {/* Proof cells — everything here is true today. */}
          <div
            className="hero-proof grid lg:col-span-4"
            style={{
              borderTop: `1px solid ${rule}`,
              borderBottom: `1px solid ${rule}`,
              ["--rule" as string]: rule,
            }}
          >
            {[
              {
                label: "Based",
                value: business.base,
                foot: `${business.coverage.length} towns covered`,
              },
              {
                label: isCommercial ? "PQQ turnaround" : "Arrival windows",
                value: isCommercial ? "24 hours" : "Two hours",
                foot: isCommercial
                  ? "From receipt of the ITT, in writing"
                  : "And a call when we leave the job before yours",
              },
              {
                label: isCommercial ? "RAMS" : "Callout fee on quoted work",
                value: isCommercial ? "Before every mobilisation" : "None",
                foot: isCommercial
                  ? "With your site team before anyone arrives"
                  : "Pricing the job costs you nothing",
              },
              {
                label: "Gas Safe register",
                // Until the registration number is confirmed this cell says
                // something true and useful rather than showing a customer an
                // amber chip in the hero: how to check any engineer, on the
                // official register, before letting them touch a boiler.
                value: business.gasSafeNumber ?? "Check any engineer's ID",
                placeholderLabel: "GAS SAFE NUMBER",
                // Until the number is confirmed, this cell earns its place by
                // telling people how to check any engineer rather than just
                // showing them a gap.
                foot: business.gasSafeNumber
                  ? "Both directors are registered engineers"
                  : "Ask any engineer for their ID card and check it at gassaferegister.co.uk",
              },
            ].map((cell, index) => (
              <ProofCell
                key={cell.label}
                label={cell.label}
                value={cell.value}
                foot={cell.foot}
                placeholderLabel={cell.placeholderLabel}
                dark={isCommercial}
                rule={rule}
                first={index === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofCell({
  label,
  value,
  foot,
  dark,
  rule,
  first,
  placeholderLabel,
}: {
  label: string;
  value: string | null;
  foot: string;
  dark: boolean;
  rule: string;
  first: boolean;
  placeholderLabel?: string;
}) {
  return (
    <div
      className="flex flex-col gap-1.5 p-6 lg:p-7"
      style={{
        /* Opaque, not a translucent panel over the gradient: a semi-transparent
           surface makes the text contrast behind it depend on where the
           gradient happens to be, which is unverifiable and drifts as the
           gradient changes. */
        background: dark ? "var(--ink)" : "var(--paper-raised)",
        borderTop: first ? undefined : `1px solid ${rule}`,
      }}
    >
      <span className="font-mono-label" style={{ color: dark ? "var(--steel-dim)" : "var(--steel)" }}>
        {label}
      </span>
      <span
        className="font-display text-xl leading-tight"
        style={{ color: dark ? "var(--paper)" : "var(--ink)" }}
      >
        <FactOrPlaceholder value={value} label={placeholderLabel ?? label.toUpperCase()} compact />
      </span>
      <span className="text-sm" style={{ color: dark ? "var(--steel-dim)" : "var(--steel)" }}>
        {foot}
      </span>
    </div>
  );
}
