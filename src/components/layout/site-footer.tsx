import Link from "next/link";
import { business } from "@/lib/content/business";
import { FactOrPlaceholder } from "@/components/ui/placeholder";

/** Pages that exist in this build phase — everything else in the footer's
 * information architecture renders as plain text rather than a dead link,
 * since Phase 2/3 pages (legal, areas, services) aren't built yet. */
const LIVE_LINKS: Record<string, string> = {
  Capability: "/capability",
  Tenders: "/tenders",
  "Instant Boiler Quote": "/boiler-quote",
  "Care Plans": "/care-plans",
  Prices: "/prices",
};

function FooterLink({ label }: { label: string }) {
  const href = LIVE_LINKS[label];
  if (href) {
    return (
      <Link href={href} className="hover:text-flame-glow" style={{ color: "var(--steel-dim)" }}>
        {label}
      </Link>
    );
  }
  return <span style={{ color: "var(--steel)" }}>{label}</span>;
}

const SERVICE_LINKS = [
  "Capability",
  "Tenders",
  "Instant Boiler Quote",
  "Care Plans",
  "Prices",
];

const LEGAL_LINKS = [
  "Privacy policy",
  "Terms",
  "Cookies",
  "Complaints procedure",
  "Modern slavery statement",
];

const AREA_LINKS = business.coverage;

export function SiteFooter() {
  return (
    <footer style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <div
        className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4"
        style={{ paddingTop: "var(--space-section-mobile)" }}
      >
        <div className="flex flex-col gap-3 md:col-span-1">
          <span className="font-display text-xl">MARMION</span>
          <span className="font-mono-label" style={{ color: "var(--copper)", letterSpacing: "0.18em" }}>
            BUILDING SERVICES
          </span>
          <p className="mt-2 text-sm" style={{ color: "var(--steel-dim)" }}>
            {business.legalEntity}
          </p>
          <p className="text-sm" style={{ color: "var(--steel-dim)" }}>
            <FactOrPlaceholder value={business.registeredOffice} label="REGISTERED OFFICE" />
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
            Services
          </span>
          {SERVICE_LINKS.map((label) => (
            <FooterLink key={label} label={label} />
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
            Coverage
          </span>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm" style={{ color: "var(--steel-dim)" }}>
            {AREA_LINKS.map((town) => (
              <span key={town}>{town}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
            Legal
          </span>
          {LEGAL_LINKS.map((label) => (
            <FooterLink key={label} label={label} />
          ))}
        </div>
      </div>

      <div
        className="hairline mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 font-mono text-xs md:flex-row md:items-center md:justify-between"
        style={{ color: "var(--steel-dim)" }}
      >
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span>
            COMPANY NO. <FactOrPlaceholder value={business.companyNumber} label="COMPANY NUMBER" />
          </span>
          <span>
            VAT NO. <FactOrPlaceholder value={business.vatNumber} label="VAT NUMBER" />
          </span>
          <span>
            GAS SAFE <FactOrPlaceholder value={business.gasSafeNumber} label="GAS SAFE NUMBER" />
          </span>
        </div>
        <span>
          © {new Date().getFullYear()} {business.legalEntity}. We stand behind the work.
        </span>
      </div>
    </footer>
  );
}
