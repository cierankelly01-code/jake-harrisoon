"use client";

import Link from "next/link";
import { business } from "@/lib/content/business";
import { phoneLink } from "@/lib/content/contact-links";
import { track } from "@/lib/analytics";
import { Arrow } from "@/components/ui/icons";

/**
 * "Night shift" hero — see DESIGN.md.
 *
 * Near-black flood, one electric green, three actions and nothing else above
 * the fold. The client's reference (rygroup.co.uk) floods its hero with one
 * brand colour and offers three pill CTAs; this is that idea in his palette,
 * without the carousel — a slider hides three quarters of its own content on
 * a phone and needs a working pointer to escape.
 *
 * The headline leads on the two owners' names rather than on a boiler. A
 * two-man firm cannot out-scale RY Group and should not try; what it has
 * instead is that you know exactly who is coming.
 *
 * No `tel:` is written directly. `phoneLink()` degrades to the callback page
 * while `business.phoneMain` is unconfirmed, so the most valuable control on
 * the page never becomes an empty dialler.
 */

/* Named towns come from the same-day list, not the full coverage list. The
   hero was headlining Sutton Coldfield, which is in the booked-in tier —
   naming a slow-tier town beside an emergency button is the wrong promise. */
const AREAS_SHOWN = 3;

export function HeroNight() {
  /* Falls back to /emergency, not the default /contact. Until a real
     number lands this button cannot dial, and a general callback form is
     the wrong landing for someone who can smell gas — /emergency opens
     with the National Gas Emergency number and the triage steps. */
  const phone = phoneLink("/emergency");
  const town = business.base.split(",")[0];
  const shown = business.coverageCore.slice(0, AREAS_SHOWN);
  const more = business.coverage.length - AREAS_SHOWN;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        /* A single soft green bloom, bottom-right. Painted on the section
           itself rather than as an absolutely positioned child: a child wide
           enough to look like a glow hangs past the right edge, which the
           verifier flags and which costs a composited layer for nothing. */
        background:
          "radial-gradient(70% 90% at 108% 125%, rgba(47, 211, 122, 0.18) 0%, rgba(47, 211, 122, 0.06) 38%, transparent 68%), var(--ink)",
      }}
      aria-labelledby="hero-heading"
    >
      <div className="container-x relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <div className="lg:col-span-7">
        <p
          className="font-mono-label text-xs"
          style={{ color: "var(--copper-bright)", letterSpacing: "0.12em" }}
        >
          {town.toUpperCase()} · GAS SAFE REGISTERED ENGINEERS
        </p>

        <h1
          id="hero-heading"
          className="font-display font-display-xl mt-4 max-w-[17ch]"
          style={{ fontSize: "var(--text-hero)", color: "var(--paper)" }}
        >
          Heating sorted, by the two people who own the firm.
        </h1>

        <p
          className="mt-5 max-w-[46ch] text-base sm:text-lg"
          style={{ color: "var(--steel-dim)" }}
        >
          {business.directors.map((d) => d.firstName).join(" and ")} — no call centre, no
          subcontractors, and a fixed written price before anyone starts work.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={phone.href}
            onClick={() => track("cta_click", { location: "hero", action: "emergency" })}
            className="btn btn--primary btn--lg"
          >
            {phone.isDirect ? `Emergency — call ${phone.label}` : "Emergency call-out"}
          </Link>
          <Link
            href="/boiler-quote"
            onClick={() => track("cta_click", { location: "hero", action: "primary" })}
            className="btn btn--secondary-dark btn--lg"
          >
            Get a fixed price
            <Arrow />
          </Link>
          <Link
            href="/care-plans"
            onClick={() => track("cta_click", { location: "hero", action: "service" })}
            className="btn btn--secondary-dark btn--lg"
          >
            Book a service
            <Arrow />
          </Link>
        </div>

        <p className="mt-8 text-sm" style={{ color: "var(--steel-dim)" }}>
          {shown.join(" · ")}
          {more > 0 && (
            <>
              {" "}
              and{" "}
              <Link
                href="/contact"
                className="link-draw"
                style={{ color: "var(--copper-bright)" }}
              >
                {more} more areas
              </Link>
            </>
          )}
        </p>
        </div>

        {/* The client-supplied cutaway render (see PROGRESS.md — their
            asset, not stock). It exists only to stop the right half of a
            1440 fold being 40% dead black, so it is purely decorative.
            Painted as a CSS background behind a `min-width: 1024px` media
            query rather than an <img>: an <img> inside a `hidden lg:block`
            wrapper is still downloaded on every phone that will never show
            it, and reports naturalWidth 0 to any checker that looks. The
            fixed aspect-ratio keeps CLS at zero. */}
        <div className="hero-cutaway lg:col-span-5" aria-hidden="true" />
      </div>
    </section>
  );
}
