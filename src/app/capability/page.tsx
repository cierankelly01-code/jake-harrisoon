import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/lib/content/business";
import { PlaceholderMarker } from "@/components/ui/placeholder";
import { MonoStat } from "@/components/ui/mono-stat";
import { CapabilityDownloadForm } from "@/components/forms/capability-download-form";

export const metadata: Metadata = {
  title: "Capability Statement",
  description:
    "Full capability statement for Hartson Heating — services, accreditations, insurance schedule, coverage and response SLAs. Download the PDF instantly.",
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

/**
 * These were previously headed "Qualifications held" — which was a false
 * claim, because `business.accreditationsHeld` is empty and none of them
 * have been evidenced yet. They are the competencies the business is working
 * towards, and they are labelled as exactly that. Anything genuinely held
 * renders from `business.accreditationsHeld`, with its registration number.
 */
const QUALIFICATIONS_TARGETED = [
  "Gas Safe commercial",
  "F-Gas",
  "G3 unvented",
  "L8 Legionella",
  "CSCS",
];

/** Direct contact routes, rendered only where a value actually exists. */
const DIRECT_CONTACTS = [
  { label: "Tenders email:", value: business.emailTenders, marker: "EMAIL TENDERS" },
  { label: "General email:", value: business.emailGeneral, marker: "EMAIL GENERAL" },
  { label: "Telephone:", value: business.phoneMain, marker: "PHONE MAIN" },
] as const;

export default function CapabilityPage() {
  return (
    <div style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <section
        className="mx-auto max-w-[100rem] px-6"
        style={{ paddingTop: "var(--space-section-tight)", paddingBottom: "var(--space-section)" }}
      >
        <span className="font-mono-label" style={{ color: "var(--copper-bright)" }}>
          For procurement
        </span>
        <h1 className="font-display font-display-xl mt-5 text-4xl">Capability statement</h1>
        <p className="mt-4 max-w-2xl text-lg" style={{ color: "var(--steel-dim)" }}>
          Everything a procurement lead or main contractor needs to put {business.tradingName} on
          a tender list — services, accreditations, insurance schedule, coverage and response
          SLAs. Two fields and the PDF downloads on the spot, or send us the ITT and we return completed PQQ
          documentation within 24 hours.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-12">
            <div>
              <h2 className="font-mono-label mb-4" style={{ color: "var(--steel-dim)" }}>
                Company overview
              </h2>
              <p style={{ color: "var(--steel-dim)" }}>
                {/* Reworded so the sentence survives a null registered name
                    — it used to open with a bare em dash once legalEntity
                    went to null. Route is gated today, but this is a formal
                    tender document the day COMMERCIAL_ENABLED flips back. */}
                {business.tradingName} runs {business.divisions.commercial} and{" "}
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
                Accreditations
              </h2>
              {business.accreditationsHeld.length > 0 ? (
                <p style={{ color: "var(--steel-dim)" }}>
                  Held: {business.accreditationsHeld.join(" · ")}. Registration numbers and
                  certificates issued with the PQQ pack.
                </p>
              ) : (
                <p style={{ color: "var(--steel-dim)" }}>
                  Accreditation is in progress. Currently working towards:{" "}
                  <span style={{ color: "var(--paper)" }}>
                    {QUALIFICATIONS_TARGETED.join(" · ")}
                  </span>
                  . None are held yet — we would rather tell you here than have you find it at PQQ
                  stage — and each appears on this page with its registration number on the day it
                  is awarded.
                </p>
              )}
            </div>

            <div>
              <h2 className="font-mono-label mb-4" style={{ color: "var(--steel-dim)" }}>
                Health &amp; safety
              </h2>
              <p style={{ color: "var(--steel-dim)" }}>
                RAMS issued to your site team before every mobilisation, not just the first. Written
                health &amp; safety, environmental and quality management policies are issued with
                the PQQ pack on request.
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
              {/* Direct contact details are unconfirmed, so this leads with the
                  route that actually works today — the tender enquiry form,
                  which takes documents and reaches the directors — rather than
                  leaving a procurement lead with three placeholder chips and
                  no way to reach anyone. */}
              <p className="max-w-[60ch]" style={{ color: "var(--steel-dim)" }}>
                Send the ITT through the{" "}
                <Link href="/tenders" className="link-draw" style={{ color: "var(--paper)" }}>
                  tender enquiry form
                </Link>
                , which accepts drawings and specifications and goes straight to both directors. You
                get completed PQQ documentation back within 24 hours and a named point of contact
                from that moment on.
              </p>
              {DIRECT_CONTACTS.some((c) => c.value) ? (
                <dl className="mt-5 flex flex-col gap-2 text-sm">
                  {DIRECT_CONTACTS.filter((c) => c.value).map((c) => (
                    <div key={c.marker} className="flex flex-wrap gap-2">
                      <dt style={{ color: "var(--steel-dim)" }}>{c.label}</dt>
                      <dd style={{ color: "var(--paper)" }}>{c.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {DIRECT_CONTACTS.filter((c) => !c.value).map((c) => (
                <PlaceholderMarker key={c.marker} label={c.marker} />
              ))}
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
