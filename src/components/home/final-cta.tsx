"use client";

import Link from "next/link";
import { useDivision } from "@/components/division/division-provider";
import { phoneLink } from "@/lib/content/contact-links";
import { track } from "@/lib/analytics";
import { Arrow } from "@/components/ui/icons";

export function FinalCta() {
  const { division } = useDivision();
  const isCommercial = division === "commercial";
  const phone = phoneLink();

  return (
    <section id="enquire" aria-labelledby="final-cta-heading" className="container-x pb-16 sm:pb-24">
      <div
        className="relative overflow-hidden px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20"
        style={{ background: "var(--ink)", color: "#fff", borderRadius: "var(--radius-lg)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(47,211,122,0.28) 0%, rgba(47,211,122,0) 70%)" }}
        />
        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h2 id="final-cta-heading" className="font-display text-4xl">
              {isCommercial ? "Send the ITT. Get the paperwork back tomorrow." : "Get the price first. Decide after."}
            </h2>
            <p className="mt-5 max-w-[46ch] text-lg" style={{ color: "var(--steel-dim)" }}>
              {isCommercial
                ? "Completed PQQ documentation within 24 hours of receipt, and clarifications raised in writing before we price rather than after award."
                : "About two minutes online. No salesperson, no home visit, nothing booked until you say so."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:flex-col lg:items-stretch">
            <Link
              href={isCommercial ? "/tenders" : "/boiler-quote"}
              onClick={() => track("cta_click", { location: "final", action: "primary" })}
              className="btn btn--primary btn--lg"
            >
              {isCommercial ? "Submit a tender enquiry" : "Get my fixed price"}
              <Arrow />
            </Link>
            <Link
              href={phone.href}
              onClick={() => track("cta_click", { location: "final", action: "call" })}
              className="btn btn--secondary-dark btn--lg"
            >
              {phone.isDirect ? `Call ${phone.label}` : "Request a callback"}
            </Link>
            <p className="text-center text-xs sm:text-left lg:text-center" style={{ color: "var(--steel-dim)" }}>
              {isCommercial ? "One named contact from enquiry onwards." : "No obligation, and no callout fee on quoted work."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
