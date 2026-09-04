import Link from "next/link";
import { business } from "@/lib/content/business";
import { PlaceholderMarker } from "@/components/ui/placeholder";
import { phoneLink, emailLink } from "@/lib/content/contact-links";

/**
 * The footer as a designed destination rather than a sitemap dump: a giant
 * wordmark, the two conversion routes restated, the coverage list as real
 * local-SEO content, and the statutory disclosure block.
 *
 * Companies Act 2006 s.82 / the Company, LLP and Business (Names and Trading
 * Disclosures) Regulations require a UK limited company's website to state
 * its registered name, company number, place of registration and registered
 * office address. None of those are confirmed yet, so each renders as a
 * placeholder chip AND is called out as a launch blocker in the note beneath
 * — this is the one place on the site where an amber chip is doing exactly
 * the job it should.
 */
const SERVICE_LINKS = [
  { label: "Capability statement", href: "/capability" },
  { label: "Tenders & PQQ", href: "/tenders" },
  { label: "Instant boiler quote", href: "/boiler-quote" },
  { label: "Care plans", href: "/care-plans" },
  { label: "How we price", href: "/prices" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy notice", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
];

const PENDING_LEGAL = ["Complaints procedure", "Modern slavery statement"];

/**
 * Companies Act 2006 / ecommerce disclosures. Each row renders only once its
 * value exists in `business` — see CONTENT_NEEDED.md for what is outstanding.
 */
const DISCLOSURES = [
  { label: "COMPANY NO.", value: business.companyNumber, marker: "COMPANY NUMBER" },
  { label: "VAT NO.", value: business.vatNumber, marker: "VAT NUMBER" },
  { label: "GAS SAFE", value: business.gasSafeNumber, marker: "GAS SAFE NUMBER" },
] as const;

export function SiteFooter() {
  const phone = phoneLink();
  const email = emailLink();

  return (
    <footer className="grain relative" style={{ background: "var(--ink)", color: "var(--paper)" }}>
      {/* Restate the two routes that convert, once, at the end. */}
      <div className="relative z-10 border-b" style={{ borderColor: "var(--border-hairline-dark)" }}>
        <div className="mx-auto grid max-w-[100rem] gap-px px-6 py-0 md:grid-cols-2">
          <Link
            href="/boiler-quote"
            className="footer-cta group flex items-center justify-between gap-6 py-10 md:pr-10"
          >
            <span>
              <span className="font-mono-label" style={{ color: "var(--copper-bright)" }}>
                Domestic
              </span>
              <span className="font-display mt-2 block text-2xl">Get an instant boiler price</span>
            </span>
            <FooterArrow />
          </Link>
          <Link
            href="/tenders"
            className="footer-cta group flex items-center justify-between gap-6 border-t py-10 md:border-l md:border-t-0 md:pl-10"
            style={{ borderColor: "var(--border-hairline-dark)" }}
          >
            <span>
              <span className="font-mono-label" style={{ color: "var(--copper-bright)" }}>
                Commercial
              </span>
              <span className="font-display mt-2 block text-2xl">Submit a tender enquiry</span>
            </span>
            <FooterArrow />
          </Link>
        </div>
      </div>

      <div className="relative z-10 mx-auto grid max-w-[100rem] gap-10 px-6 py-16 md:grid-cols-12">
        <div className="flex flex-col gap-3 md:col-span-4">
          <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
            Get in touch
          </span>
          <Link href={phone.href} className="font-display link-draw self-start text-2xl">
            {phone.isDirect ? phone.label : "Request a callback"}
          </Link>
          <Link href={email.href} className="link-draw self-start text-base" style={{ color: "var(--steel-dim)" }}>
            {email.isDirect ? email.label : "Send us an enquiry"}
          </Link>
          <p className="mt-4 max-w-[34ch] text-sm" style={{ color: "var(--steel-dim)" }}>
            {business.legalEntity}, working out of {business.base} across {business.coverage.length}{" "}
            towns in the West Midlands.
          </p>
        </div>

        <nav aria-label="Services" className="flex flex-col gap-2.5 md:col-span-3">
          <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
            Services
          </span>
          {SERVICE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-draw self-start py-1 text-sm"
              style={{ color: "var(--paper)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2.5 md:col-span-3">
          <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
            Coverage
          </span>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm" style={{ color: "var(--steel-dim)" }}>
            {business.coverage.map((town) => (
              <span key={town}>{town}</span>
            ))}
          </div>
        </div>

        <nav aria-label="Legal" className="flex flex-col gap-2.5 md:col-span-2">
          <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
            Legal
          </span>
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-draw self-start py-1 text-sm"
              style={{ color: "var(--paper)" }}
            >
              {link.label}
            </Link>
          ))}
          {PENDING_LEGAL.map((label) => (
            <span key={label} className="py-1 text-sm" style={{ color: "var(--steel-dim)" }}>
              {label} <span style={{ color: "var(--steel-dim)", opacity: 0.75 }}>(to follow)</span>
            </span>
          ))}
        </nav>
      </div>

      {/* Giant wordmark — the footer earns its own screen. */}
      <div className="relative z-10 overflow-hidden px-6">
        <span
          aria-hidden="true"
          className="font-display block select-none leading-[0.8]"
          style={{
            fontSize: "clamp(4rem, 15vw, 15rem)",
            color: "transparent",
            WebkitTextStroke: "1px var(--border-hairline-dark)",
          }}
        >
          MARMION
        </span>
      </div>

      <div
        className="relative z-10 mx-auto flex max-w-[100rem] flex-col gap-4 border-t px-6 py-8 font-mono text-xs md:flex-row md:items-start md:justify-between"
        style={{ color: "var(--steel-dim)", borderColor: "var(--border-hairline-dark)" }}
      >
        {/* Statutory disclosures. A row appears once its fact is known and is
            silently absent until then — printing "COMPANY NO." beside an amber
            warning triangle on all ten pages satisfied no disclosure duty and
            told every visitor the site was unfinished. The gaps are still
            tracked: PlaceholderMarker keeps them in the DOM for the
            [data-placeholder] sweep, and in CONTENT_NEEDED.md for the client. */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-2">
              REGISTERED NAME <span style={{ color: "var(--paper)" }}>{business.legalEntity}</span>
            </span>
            {DISCLOSURES.map(({ label, value, marker }) =>
              value ? (
                <span key={marker} className="flex items-center gap-2">
                  {label} <span style={{ color: "var(--paper)" }}>{value}</span>
                </span>
              ) : (
                <PlaceholderMarker key={marker} label={marker} />
              )
            )}
          </div>
          {business.registeredOffice ? (
            <span className="flex flex-wrap items-center gap-2">
              REGISTERED OFFICE{" "}
              <span style={{ color: "var(--paper)" }}>{business.registeredOffice}</span>
            </span>
          ) : (
            <PlaceholderMarker label="REGISTERED OFFICE" />
          )}
        </div>
        {/* Rendered at request time, not build time: this page is otherwise
            statically prerendered, which would freeze the year at whenever the
            site was last deployed. */}
        <span className="md:text-right" suppressHydrationWarning>
          © {new Date().getFullYear()} {business.legalEntity}.
          <br />
          We stand behind the work.
        </span>
      </div>
    </footer>
  );
}

function FooterArrow() {
  return (
    <span className="footer-cta__arrow shrink-0" aria-hidden="true" style={{ color: "var(--flame-glow)" }}>
      <svg width="30" height="14" viewBox="0 0 30 14" fill="none">
        <path d="M0 7h27M22 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
  );
}
