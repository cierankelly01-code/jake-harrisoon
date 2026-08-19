import type { Metadata } from "next";
import { business } from "@/lib/content/business";
import { FactOrPlaceholder } from "@/components/ui/placeholder";
import { MonoStat } from "@/components/ui/mono-stat";
import { CapabilityDownloadForm } from "@/components/forms/capability-download-form";

export const metadata: Metadata = {
  title: "Capability Statement",
  description:
    "Full capability statement for Marmion Building Services — services, accreditations, insurance schedule, coverage and response SLAs. Download the PDF instantly.",
};

const SERVICES_COMMERCIAL = [
  "PPM contracts",
  "Reactive maintenance",
  "Mechanical installation",
  "Plant room servicing",
  "Commercial boilers",
  "Legionella / L8 monitoring",
  "Gas safety (CP12)",
  "Backflow / RPZ testing",
  "Washroom & kitchen fit-outs",
  "Void property works",
  "Section 20 planned works",
];

const SERVICES_DOMESTIC = [
  "Boiler installation",
  "Boiler repair & servicing",
  "Emergency plumbing",
  "Central heating",
  "Radiators & power flushing",
  "Unvented cylinders",
  "Underfloor heating",
  "Bathroom installation",
  "Blocked drains",
  "Heat pumps",
];

const SECTORS = [
  "Main contractors",
  "Housing associations",
  "Local authority",
  "Healthcare",
  "Education",
  "Hospitality",
  "Retail",
  "Offices",
  "Care homes",
  "Leisure",
  "Industrial",
  "Letting agents",
];

const QUALIFICATIONS = ["Gas Safe commercial", "F-Gas", "G3 unvented", "L8 Legionella", "CSCS"];

export default function CapabilityPage() {
  return (
    <div style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <section
        className="mx-auto max-w-6xl px-6"
        style={{ paddingTop: "var(--space-section-mobile)", paddingBottom: "var(--space-section-mobile)" }}
      >
        <span className="font-mono-label" style={{ color: "var(--copper)" }}>
          Tender weapon
        </span>
        <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl">
          Capability statement
        </h1>
        <p className="mt-4 max-w-2xl text-lg" style={{ color: "var(--steel-dim)" }}>
          Everything a procurement lead or main contractor needs to put {business.tradingName} on
          a tender list — services, accreditations, insurance schedule, coverage and response
          SLAs. Download it instantly below, or send us the ITT and we return completed PQQ
          documentation within 24 hours.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-12">
            <div>
              <h2 className="font-mono-label mb-4" style={{ color: "var(--steel-dim)" }}>
                Company overview
              </h2>
              <p style={{ color: "var(--steel-dim)" }}>
                {business.legalEntity} — {business.divisions.commercial} and{" "}
                {business.divisions.domestic}, based in {business.base}. Directed by{" "}
                {business.directors.map((d) => d.firstName).join(" and ")}, {business.ownership},
                both Gas Safe registered engineers.
              </p>
            </div>

            <div>
              <h2 className="font-mono-label mb-4" style={{ color: "var(--steel-dim)" }}>
                Key figures
              </h2>
              <div className="grid grid-cols-2 gap-6 border p-6 sm:grid-cols-3" style={{ borderColor: "var(--border-hairline-dark)", borderRadius: "var(--radius)" }}>
                <MonoStat label="Public liability" value={business.publicLiability} tone="dark" />
                <MonoStat label="Employers liability" value={business.employersLiability} tone="dark" />
                <MonoStat label="Response SLA" value={business.responseSla} tone="dark" />
                <MonoStat label="Gas Safe no." value={business.gasSafeNumber} tone="dark" />
                <MonoStat label="Out-of-hours cover" value={business.outOfHoursCover} tone="dark" />
                <MonoStat label="Coverage" value={`${business.coverage.length} areas`} tone="dark" />
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="font-mono-label mb-4" style={{ color: "var(--steel-dim)" }}>
                  Services — commercial
                </h2>
                <ul className="flex flex-col gap-2 text-sm">
                  {SERVICES_COMMERCIAL.map((s) => (
                    <li key={s} className="hairline pt-2" style={{ borderColor: "var(--border-hairline-dark)" }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-mono-label mb-4" style={{ color: "var(--steel-dim)" }}>
                  Services — domestic
                </h2>
                <ul className="flex flex-col gap-2 text-sm">
                  {SERVICES_DOMESTIC.map((s) => (
                    <li key={s} className="hairline pt-2" style={{ borderColor: "var(--border-hairline-dark)" }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-mono-label mb-4" style={{ color: "var(--steel-dim)" }}>
                Sectors served
              </h2>
              <div className="flex flex-wrap gap-2">
                {SECTORS.map((s) => (
                  <span
                    key={s}
                    className="border px-3 py-1.5 text-sm"
                    style={{ borderColor: "var(--border-hairline-dark)", borderRadius: "var(--radius)", color: "var(--steel-dim)" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-mono-label mb-4" style={{ color: "var(--steel-dim)" }}>
                Qualifications held
              </h2>
              <p style={{ color: "var(--steel-dim)" }}>
                {QUALIFICATIONS.join(" · ")} — registration numbers confirmed on request pending
                completion of <FactOrPlaceholder value={null} label="ACCREDITATION_ROADMAP.md" />.
              </p>
            </div>

            <div>
              <h2 className="font-mono-label mb-4" style={{ color: "var(--steel-dim)" }}>
                Health &amp; safety
              </h2>
              <p style={{ color: "var(--steel-dim)" }}>
                RAMS issued before every mobilisation. Full health &amp; safety, environmental and
                quality management policies are published on /compliance (in progress — see
                CONTENT_NEEDED.md).
              </p>
            </div>

            <div>
              <h2 className="font-mono-label mb-4" style={{ color: "var(--steel-dim)" }}>
                Coverage
              </h2>
              <p style={{ color: "var(--steel-dim)" }}>{business.coverage.join(" · ")}</p>
            </div>

            <div>
              <h2 className="font-mono-label mb-4" style={{ color: "var(--steel-dim)" }}>
                Contact
              </h2>
              <p style={{ color: "var(--steel-dim)" }}>
                Tenders: <FactOrPlaceholder value={business.emailTenders} label="EMAIL TENDERS" /> ·
                General: <FactOrPlaceholder value={business.emailGeneral} label="EMAIL GENERAL" /> ·
                Tel: <FactOrPlaceholder value={business.phoneMain} label="PHONE MAIN" />
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <CapabilityDownloadForm />
          </aside>
        </div>
      </section>
    </div>
  );
}
