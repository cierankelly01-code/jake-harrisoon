import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/lib/content/business";
import { PlaceholderMarker } from "@/components/ui/placeholder";
import { HAS_PUBLISHED_PRICES } from "@/lib/content/domestic-prices";
import { COMMERCIAL_ENABLED } from "@/lib/division-shared";

export const metadata: Metadata = {
  title: "Contact",
  description: COMMERCIAL_ENABLED
    ? "How to reach Marmion Building Services — instant domestic boiler quotes, commercial tender and PQQ enquiries, and coverage across Tamworth, Lichfield, Sutton Coldfield and the wider West Midlands."
    : "How to reach Marmion Building Services — instant domestic boiler quotes and coverage across Tamworth, Lichfield, Sutton Coldfield and the wider West Midlands.",
};

/**
 * This page is the destination every contact affordance on the site falls
 * back to while `business.phoneMain` is null (see lib/content/contact-links.ts).
 * So it cannot be a stub: someone arriving here has already tried to make
 * contact once and been redirected.
 *
 * It deliberately does NOT call phoneLink()/emailLink() — those resolve to
 * "/contact", which from this page is a link to itself. The unconfirmed
 * numbers are rendered here as what they are: <Placeholder> chips, with the
 * two routes that genuinely work put first and given the most weight.
 *
 * There is no callback form here on purpose. A form that posts nowhere is
 * worse than no form — it silently eats leads. When the callback server
 * action is built (Phase 2), it drops into the DIRECT LINES section below.
 */

/**
 * The commercial route (/tenders) drops out while COMMERCIAL_ENABLED is
 * false (division-shared.ts) — middleware.ts redirects that URL to `/`, so
 * linking to it here would send someone straight back to the homepage
 * instead of the tender form they clicked for.
 */
const ROUTES = [
  {
    index: "01",
    eyebrow: "Domestic",
    href: "/boiler-quote",
    title: "Get an instant boiler quote",
    body: "Answer a few questions about your home and your current system and you get a real, itemised price in about two minutes — no home visit needed first, no salesman on the sofa.",
    cta: "Start the quote",
  },
  ...(COMMERCIAL_ENABLED
    ? [
        {
          index: "02",
          eyebrow: "Commercial",
          href: "/tenders",
          title: "Send us an ITT, spec or PQQ",
          body: "Upload the tender documents and they go straight to both directors, flagged by deadline. Completed PQQ documentation comes back within 24 hours.",
          cta: "Open the tender form",
        },
      ]
    : []),
];

const SECONDARY = [
  { href: "/care-plans", label: "Care plans", note: "Cover, servicing and priority callout on one monthly payment." },
  {
    href: "/prices",
    label: HAS_PUBLISHED_PRICES ? "Published prices" : "How we price",
    note: HAS_PUBLISHED_PRICES
      ? "Fixed prices for straightforward domestic jobs."
      : "The four rules every job is priced by, and why the number does not move.",
  },
  ...(COMMERCIAL_ENABLED
    ? [{ href: "/capability", label: "Capability statement", note: "Scope, coverage and credentials as a downloadable PDF." }]
    : []),
];

/** Direct contact routes. Rendered only once a value exists. */
const DIRECT_LINES = [
  { label: "Telephone", value: business.phoneMain, factLabel: "MAIN PHONE" },
  { label: "Out of hours", value: business.phoneOutOfHours, factLabel: "OUT-OF-HOURS PHONE" },
  { label: "General enquiries", value: business.emailGeneral, factLabel: "GENERAL EMAIL" },
  ...(COMMERCIAL_ENABLED
    ? [{ label: "Tenders & PQQ", value: business.emailTenders, factLabel: "TENDERS EMAIL" }]
    : []),
  { label: "Registered office", value: business.registeredOffice, factLabel: "REGISTERED OFFICE" },
] as const;

export default function ContactPage() {
  return (
    <>
      {/* ── Intro ─────────────────────────────────────────────────────── */}
      <section
        className="mx-auto max-w-5xl px-6"
        style={{ paddingTop: "var(--space-section-mobile)", paddingBottom: "var(--space-section-tight)" }}
      >
        <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
          Contact
        </span>
        <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl" style={{ color: "var(--ink)" }}>
          Tell us what needs doing.
        </h1>
        <p className="mt-5 max-w-2xl text-lg" style={{ color: "var(--steel)" }}>
          {COMMERCIAL_ENABLED
            ? "Two routes below get you a real answer without waiting for anyone to pick up the phone — one for homes, one for buildings. Both land with the directors directly."
            : "Get a real answer below without waiting for anyone to pick up the phone. It lands with the directors directly."}
        </p>
      </section>

      {/* ── The two paths that actually work ──────────────────────────── */}
      <section
        className="mx-auto max-w-5xl px-6"
        style={{ paddingBottom: "var(--space-section-tight)" }}
      >
        <div className={`grid gap-6 ${COMMERCIAL_ENABLED ? "md:grid-cols-2" : "md:max-w-md"}`}>
          {ROUTES.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="docket docket--linked flex flex-col border p-7"
              style={{
                borderColor: "var(--border-hairline)",
                borderRadius: "var(--radius)",
                background: "var(--paper-raised)",
              }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
                  {route.eyebrow}
                </span>
                <span className="font-mono-label tabular-nums" style={{ color: "var(--steel)" }}>
                  {route.index}
                </span>
              </div>

              <h2 className="font-display mt-5 text-2xl" style={{ color: "var(--ink)" }}>
                {route.title}
              </h2>
              <p className="mt-3 flex-1 text-sm" style={{ color: "var(--steel)" }}>
                {route.body}
              </p>

              <span className="mt-6 flex items-center gap-3">
                <span className="font-mono-label" style={{ color: "var(--flame)" }}>
                  {route.cta}
                </span>
                <span className="docket__arrow" aria-hidden="true">
                  <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
                    <path d="M0 6h20M15 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                  </svg>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Direct lines ──────────────────────────────────────────────── */}
      <section className="grain relative" style={{ background: "var(--ink)", color: "var(--paper)" }}>
        <div
          className="relative z-10 mx-auto max-w-5xl px-6"
          style={{ paddingTop: "var(--space-section-tight)", paddingBottom: "var(--space-section-tight)" }}
        >
          <div className="section-index" data-index="03">
            <h2 className="font-display text-2xl md:text-3xl">Direct lines</h2>
          </div>
          {/* Only routes that actually work are listed. A "Direct lines"
              heading above five amber "to be confirmed" chips was the most
              damaging block on the site: this is the page every unconfirmed
              CTA falls back to, and it read as a business that could not be
              contacted at all. Outstanding details stay tracked as hidden
              markers and in CONTENT_NEEDED.md. */}
          <p className="mt-4 max-w-2xl text-sm" style={{ color: "var(--steel-dim)" }}>
            {DIRECT_LINES.some((line) => line.value)
              ? "Reach us directly, or use the forms above — both go to the same two people."
              : "The forms above are live and monitored today, and both go straight to the two directors. Direct lines are published here as each is registered."}
          </p>

          <dl className="mt-8 border-t" style={{ borderColor: "var(--border-hairline-dark)" }}>
            {DIRECT_LINES.filter((line) => line.value).map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col gap-2 border-b py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                style={{ borderColor: "var(--border-hairline-dark)" }}
              >
                <dt className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
                  {label}
                </dt>
                <dd className="text-sm sm:text-right" style={{ color: "var(--paper)" }}>
                  {value}
                </dd>
              </div>
            ))}
            {DIRECT_LINES.filter((line) => !line.value).map(({ factLabel }) => (
              <PlaceholderMarker key={factLabel} label={factLabel} />
            ))}
            <div
              className="flex flex-col gap-2 border-b py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              style={{ borderColor: "var(--border-hairline-dark)" }}
            >
              <dt className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
                Based in
              </dt>
              <dd className="text-sm sm:text-right" style={{ color: "var(--paper)" }}>
                {business.base}
              </dd>
            </div>
          </dl>

          <h3 className="font-mono-label mt-12" style={{ color: "var(--copper-bright)" }}>
            Where we work
          </h3>
          <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm" style={{ color: "var(--steel-dim)" }}>
            {business.coverage.map((town) => (
              <span key={town}>{town}</span>
            ))}
          </p>
          <p className="mt-4 max-w-2xl text-sm" style={{ color: "var(--steel-dim)" }}>
            {COMMERCIAL_ENABLED ? (
              <>
                Outside that list? Commercial contracts travel further than domestic call-outs —
                send the details through the{" "}
                <Link href="/tenders" className="link-draw" style={{ color: "var(--flame-glow)" }}>
                  tender form
                </Link>{" "}
                and we&apos;ll tell you honestly whether we can cover it.
              </>
            ) : (
              <>
                Outside that list? Start the{" "}
                <Link href="/boiler-quote" className="link-draw" style={{ color: "var(--flame-glow)" }}>
                  instant quote
                </Link>{" "}
                anyway — it will tell you honestly whether we can cover it.
              </>
            )}
          </p>
        </div>
      </section>

      {/* ── Everything else ───────────────────────────────────────────── */}
      <section
        className="mx-auto max-w-5xl px-6"
        style={{ paddingTop: "var(--space-section-tight)", paddingBottom: "var(--space-section-mobile)" }}
      >
        <div className="section-index" data-index="04">
          <h2 className="font-display text-2xl md:text-3xl" style={{ color: "var(--ink)" }}>
            Answers without asking
          </h2>
        </div>
        <ul className="mt-6 border-t" style={{ borderColor: "var(--border-hairline)" }}>
          {SECONDARY.map(({ href, label, note }) => (
            <li key={href} className="border-b" style={{ borderColor: "var(--border-hairline)" }}>
              <Link href={href} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6">
                <span className="link-draw font-display text-lg sm:w-64" style={{ color: "var(--ink)" }}>
                  {label}
                </span>
                <span className="flex-1 text-sm" style={{ color: "var(--steel)" }}>
                  {note}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
