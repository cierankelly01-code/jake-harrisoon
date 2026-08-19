"use client";

import { useDivision } from "@/components/division/division-provider";
import { Docket } from "@/components/ui/docket";

const COMMERCIAL_SERVICES = [
  {
    refCode: "MBS-C-SVC-01",
    title: "PPM & reactive contracts",
    description: "Fixed-price planned preventative maintenance schedules, reactive charged at agreed contract rates.",
    meta: [
      { label: "Term", value: "12–60 MTH" },
      { label: "SLA", value: "AGREED" },
    ],
  },
  {
    refCode: "MBS-C-SVC-02",
    title: "Mechanical installation & plant rooms",
    description: "Full M&E install, plant room upgrades and commercial boiler installation.",
    meta: [
      { label: "Scope", value: "M&E" },
      { label: "RAMS", value: "ISSUED" },
    ],
  },
  {
    refCode: "MBS-C-SVC-03",
    title: "Statutory compliance packages",
    description: "CP12, L8 Legionella monitoring, RPZ testing and G3 servicing bundled into one annual contract.",
    meta: [
      { label: "Cover", value: "CP12 · L8 · RPZ" },
      { label: "Billing", value: "ANNUAL" },
    ],
  },
] as const;

const DOMESTIC_SERVICES = [
  {
    refCode: "MBS-D-SVC-01",
    title: "Boiler installation",
    description: "Combi, system and regular boilers fitted by Gas Safe registered engineers. Fixed price before we start.",
    meta: [
      { label: "Warranty", value: "UP TO 10 YRS" },
      { label: "Finance", value: "FROM £X/MO" },
    ],
  },
  {
    refCode: "MBS-D-SVC-02",
    title: "Emergency plumbing",
    description: "Two-hour arrival windows. We ring when we leave the last job.",
    meta: [
      { label: "Windows", value: "2 HOURS" },
      { label: "Callout fee", value: "NONE ON QUOTED WORK" },
    ],
  },
  {
    refCode: "MBS-D-SVC-03",
    title: "Central heating & radiators",
    description: "Power flushing, radiator upgrades, unvented cylinders and underfloor heating.",
    meta: [
      { label: "Survey", value: "ON SITE" },
      { label: "Price", value: "FIXED" },
    ],
  },
] as const;

export function ServicesGrid() {
  const { division } = useDivision();
  const services = division === "commercial" ? COMMERCIAL_SERVICES : DOMESTIC_SERVICES;

  return (
    <section
      className="mx-auto max-w-6xl px-6"
      style={{ paddingBottom: "var(--space-section-mobile)" }}
    >
      <span className="font-mono-label" style={{ color: "var(--copper)" }}>
        Services
      </span>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {services.map((s) => (
          <Docket
            key={s.refCode}
            variant={division}
            refCode={s.refCode}
            status={{ label: "STATUS", value: "AVAILABLE" }}
            title={s.title}
            description={s.description}
            meta={[...s.meta]}
          />
        ))}
      </div>
    </section>
  );
}
