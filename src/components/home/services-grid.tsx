"use client";

import { useDivision } from "@/components/division/division-provider";
import { Docket } from "@/components/ui/docket";
import { FROM_PRICE_GBP, FROM_MONTHLY_GBP } from "@/lib/quote/pricing";

/**
 * Hiding prices kills local-service conversion, so each domestic docket
 * carries the route to a real number rather than a "call for a quote".
 * The published price list is not confirmed yet (CONTENT_NEEDED.md), so
 * these point at the instant quote engine, which does produce a figure,
 * instead of showing a "from £X" that nobody has signed off.
 */
const COMMERCIAL_SERVICES = [
  {
    refCode: "MBS-C-SVC-01",
    title: "PPM & reactive contracts",
    description:
      "Fixed-price planned preventative maintenance schedules, with reactive work charged at agreed contract rates rather than whatever the day looks like.",
    meta: [
      { label: "Term", value: "12–60 MTH" },
      { label: "SLA", value: "AGREED" },
    ],
    href: "/tenders",
    action: "Submit a tender enquiry",
  },
  {
    refCode: "MBS-C-SVC-02",
    title: "Mechanical installation & plant rooms",
    description:
      "Full M&E install, plant room upgrades and commercial boiler installation, priced from a survey of the actual plant rather than the tender drawings alone.",
    meta: [
      { label: "Scope", value: "M&E" },
      { label: "RAMS", value: "ISSUED" },
    ],
    href: "/capability",
    action: "See capability statement",
  },
  {
    refCode: "MBS-C-SVC-03",
    title: "Statutory compliance packages",
    description:
      "CP12, L8 Legionella monitoring, RPZ testing and G3 servicing bundled into one annual contract with a single renewal date.",
    meta: [
      { label: "Cover", value: "CP12 · L8 · RPZ" },
      { label: "Billing", value: "ANNUAL" },
    ],
    href: "/tenders",
    action: "Ask for a schedule",
  },
] as const;

const DOMESTIC_SERVICES = [
  {
    refCode: "MBS-D-SVC-01",
    title: "Boiler installation",
    description:
      "Combi, system and regular boilers fitted by Gas Safe registered engineers. Cleanse, filter and controls included in the quoted price, not added afterwards.",
    // A real figure before the quote gate. Hiding every number until after
    // eight questions and a contact form is what kills local-service
    // conversion — this comes straight from the pricing config, so it cannot
    // drift from what the engine returns.
    meta: [
      { label: "From", value: `£${FROM_PRICE_GBP.toLocaleString("en-GB")}` },
      { label: "Or from", value: `£${FROM_MONTHLY_GBP}/MO` },
      { label: "Warranty", value: "UP TO 10 YRS" },
    ],
    href: "/boiler-quote",
    action: "Build a price now",
  },
  {
    refCode: "MBS-D-SVC-02",
    title: "Emergency plumbing",
    description:
      "Two-hour arrival windows, and we ring when we leave the job before yours. No callout fee on work you have accepted a price for.",
    meta: [
      { label: "Windows", value: "2 HOURS" },
      { label: "Callout", value: "NONE ON QUOTED WORK" },
    ],
    href: "/contact",
    action: "Get someone out",
  },
  {
    refCode: "MBS-D-SVC-03",
    title: "Servicing & care plans",
    description:
      "Annual service, gas safety certificate and cover for parts and labour on one monthly payment, so a breakdown is not a surprise bill.",
    meta: [
      { label: "Billing", value: "MONTHLY" },
      { label: "Cancel", value: "ANY TIME" },
    ],
    href: "/care-plans",
    action: "Compare care plans",
  },
] as const;

export function ServicesGrid() {
  const { division } = useDivision();
  const isCommercial = division === "commercial";
  const services = isCommercial ? COMMERCIAL_SERVICES : DOMESTIC_SERVICES;

  return (
    <section
      aria-labelledby="services-heading"
      className="mx-auto max-w-[100rem] px-6"
      style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
    >
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="section-index font-mono-label" data-index="02" style={{ color: "var(--copper-ink)" }}>
            Services
          </span>
          <h2 id="services-heading" className="font-display mt-4 max-w-[24ch] text-3xl" style={{ color: "var(--ink)" }}>
            {isCommercial
              ? "Three ways contracts usually start with us."
              : "Three things people usually call us about."}
          </h2>
        </div>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {services.map((service, index) => (
          <Docket
            key={service.refCode}
            variant={division}
            refCode={service.refCode}
            status={{ label: "STATUS", value: "AVAILABLE" }}
            title={service.title}
            description={service.description}
            meta={[...service.meta]}
            href={service.href}
            action={service.action}
            revealIndex={index}
          />
        ))}
      </div>
    </section>
  );
}
