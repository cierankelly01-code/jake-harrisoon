"use client";

import Link from "next/link";
import { useDivision } from "@/components/division/division-provider";
import { phoneLink } from "@/lib/content/contact-links";
import { track } from "@/lib/analytics";

export function FinalCta() {
  const { division } = useDivision();
  const isCommercial = division === "commercial";
  const phone = phoneLink();

  return (
    <section
      id="enquire"
      aria-labelledby="final-cta-heading"
      className="grain relative"
      style={{ background: "var(--flame-deep)", color: "var(--paper)" }}
    >
      <div
        aria-hidden="true"
        className="blueprint-grid pointer-events-none absolute inset-0"
        style={{ opacity: 0.35 }}
      />
      <div
        className="relative z-10 mx-auto grid max-w-[100rem] gap-6 px-6 sm:gap-10 lg:grid-cols-12 lg:items-end"
        style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
      >
        <div className="lg:col-span-7">
          <span className="font-mono-label" style={{ color: "var(--flame-pale)" }}>
            Next step
          </span>
          <h2 id="final-cta-heading" className="font-display font-display-xl mt-5 text-4xl">
            {isCommercial
              ? "Send the ITT. Get the paperwork back tomorrow."
              : "Get the price first. Decide after."}
          </h2>
          <p className="mt-6 max-w-[46ch] text-lg" style={{ color: "color-mix(in srgb, var(--paper) 78%, transparent)" }}>
            {isCommercial
              ? "Completed PQQ documentation within 24 hours of receipt, and clarifications raised in writing before we price rather than after award."
              : "Build a boiler price in about two minutes, with no salesperson and no home visit. Nothing is committed until you say so."}
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-5 lg:items-end">
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href={isCommercial ? "/tenders" : "/boiler-quote"}
              onClick={() => track("cta_click", { location: "final", action: "primary" })}
              className="btn btn--primary"
            >
              {isCommercial ? "Submit a tender enquiry" : "Get an instant price"}
            </Link>
            <Link
              href={phone.href}
              onClick={() => track("cta_click", { location: "final", action: "call" })}
              className="btn btn--secondary-dark"
            >
              {phone.isDirect ? `Call ${phone.label}` : "Request a callback"}
            </Link>
          </div>
          <p className="font-mono-label lg:text-right" style={{ color: "color-mix(in srgb, var(--paper) 70%, transparent)" }}>
            {isCommercial
              ? "One named contact from enquiry onwards"
              : "No callout fee on quoted work · No obligation"}
          </p>
        </div>
      </div>
    </section>
  );
}
