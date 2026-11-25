import Link from "next/link";
import { business } from "@/lib/content/business";
import { PlaceholderMarker } from "@/components/ui/placeholder";
import { phoneLink, emailLink } from "@/lib/content/contact-links";
import { COMMERCIAL_ENABLED } from "@/lib/division-shared";
import { Logo } from "@/components/layout/logo";

const SERVICE_LINKS = [
  { label: "New boiler quote", href: "/boiler-quote" },
  { label: "Care plans", href: "/care-plans" },
  { label: "How we price", href: "/prices" },
  { label: "Emergency plumbing", href: "/emergency" },
  ...(COMMERCIAL_ENABLED
    ? [
        { label: "Capability statement", href: "/capability" },
        { label: "Tenders & PQQ", href: "/tenders" },
      ]
    : []),
];

const COMPANY_LINKS = [
  { label: "Contact us", href: "/contact" },
  { label: "Privacy notice", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
];

/** Companies Act 2006 disclosure. Unconfirmed values render as hidden audit markers. */
const STATUTORY = [
  { label: "Registered name", value: business.legalEntity as string | null, marker: "REGISTERED NAME" },
  { label: "Company no.", value: business.companyNumber, marker: "COMPANY NUMBER" },
  { label: "VAT no.", value: business.vatNumber, marker: "VAT NUMBER" },
  { label: "Gas Safe reg.", value: business.gasSafeNumber, marker: "GAS SAFE NUMBER" },
  { label: "Registered office", value: business.registeredOffice, marker: "REGISTERED OFFICE" },
] as const;

export function SiteFooter() {
  const phone = phoneLink();
  const email = emailLink();

  return (
    <footer style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <div className="container-x grid gap-10 py-14 md:grid-cols-12 md:py-20">
        <div className="flex flex-col gap-5 md:col-span-5">
          <Logo onDark />
          <p className="max-w-[36ch] text-sm leading-relaxed" style={{ color: "var(--steel-dim)" }}>
            Gas Safe registered boiler installation, servicing and plumbing. Based in {business.base},
            covering {business.coverage.length} towns across the West Midlands.
          </p>
          <div className="flex flex-col gap-2 pt-1">
            <Link href={phone.href} className="font-display link-draw self-start text-xl" style={{ color: "#fff" }}>
              {phone.isDirect ? phone.label : "Request a callback"}
            </Link>
            <Link href={email.href} className="link-draw self-start text-sm" style={{ color: "var(--steel-dim)" }}>
              {email.isDirect ? email.label : "Send us an enquiry"}
            </Link>
          </div>
        </div>

        <nav aria-label="Services" className="flex flex-col gap-1 md:col-span-2">
          <span className="font-mono-label mb-2" style={{ color: "var(--steel-dim)" }}>
            Services
          </span>
          {SERVICE_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="link-draw self-start text-sm" style={{ color: "#fff" }}>
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Company" className="flex flex-col gap-1 md:col-span-2">
          <span className="font-mono-label mb-2" style={{ color: "var(--steel-dim)" }}>
            Company
          </span>
          {COMPANY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="link-draw self-start text-sm" style={{ color: "#fff" }}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-1 md:col-span-3">
          <span className="font-mono-label mb-2" style={{ color: "var(--steel-dim)" }}>
            Areas we cover
          </span>
          <p className="text-sm leading-relaxed" style={{ color: "var(--steel-dim)" }}>
            {business.coverage.join(" · ")}
          </p>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border-hairline-dark)" }}>
        <div className="container-x flex flex-col gap-6 py-8 text-xs md:flex-row md:items-start md:justify-between">
          <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3" style={{ color: "var(--steel-dim)" }}>
            {STATUTORY.map(({ label, value, marker }) =>
              value ? (
                <div key={marker} className="flex gap-2">
                  <dt className="shrink-0 font-semibold" style={{ color: "#fff" }}>
                    {label}
                  </dt>
                  <dd>{value}</dd>
                </div>
              ) : (
                /* Wrapped in a <div>. A <dl> may only directly contain
                   <dt>, <dd>, <div>, <script> or <template>, and
                   PlaceholderMarker renders a bare <span hidden> — invisible,
                   but an HTML validation error on every page of the site. */
                <div key={marker}>
                  <PlaceholderMarker label={marker} />
                </div>
              )
            )}
          </dl>
          <p className="shrink-0" style={{ color: "var(--steel-dim)" }} suppressHydrationWarning>
            © {new Date().getFullYear()} {business.legalEntity ?? business.tradingName}
          </p>
        </div>
      </div>
    </footer>
  );
}
