import Link from "next/link";
import { business } from "@/lib/content/business";
import { PlaceholderMarker } from "@/components/ui/placeholder";
import { phoneLink, emailLink } from "@/lib/content/contact-links";

/**
 * The footer as a designed destination rather than a sitemap dump: the two
 * conversion routes restated, the coverage list as real local-SEO content,
 * and the statutory disclosure block presented as a drawing title block
 * rather than a plain text row.
 *
 * A giant outlined wordmark used to close the page here. Killed: it is the
 * single most template-legible move in web design right now — every AI
 * page generator reaches for it — and it actively broke on mobile (the
 * word wrapped mid-letter, "MARMI" / "ON", on every page at 375px, because
 * `clamp(4rem, 15vw, 15rem)` has no floor low enough for a nine-letter word
 * at phone widths). The brand name is already stated in prose two columns
 * over; it does not need to shout twice. In its place: the statutory
 * disclosure row, which every UK limited company's site is required to
 * carry, restyled as the title block a real drawing set ends on — bordered
 * cells, mono labels, sheet-register language — so the legally mandatory
 * content does the closing flourish's job instead of a decorative repeat.
 *
 * Companies Act 2006 s.82 / the Company, LLP and Business (Names and Trading
 * Disclosures) Regulations require a UK limited company's website to state
 * its registered name, company number, place of registration and registered
 * office address. None of those are confirmed yet, so each cell renders a
 * placeholder marker AND is called out as a launch blocker in
 * CONTENT_NEEDED.md — this is the one place on the site where showing the
 * gap is doing exactly the job it should.
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
 * Companies Act 2006 / ecommerce disclosures, laid out as a drawing title
 * block. Each cell renders its value only once it exists in `business` —
 * see CONTENT_NEEDED.md for what is outstanding.
 */
const TITLE_BLOCK = [
  { label: "REGISTERED NAME", value: business.legalEntity as string | null, marker: "REGISTERED NAME" },
  { label: "COMPANY NO.", value: business.companyNumber, marker: "COMPANY NUMBER" },
  { label: "VAT NO.", value: business.vatNumber, marker: "VAT NUMBER" },
  { label: "GAS SAFE", value: business.gasSafeNumber, marker: "GAS SAFE NUMBER" },
  { label: "REGISTERED OFFICE", value: business.registeredOffice, marker: "REGISTERED OFFICE" },
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

      {/* Statutory title block. Reads like the block a real drawing set
          closes on: SHEET / SCALE / REV cells, hairline-divided, mono
          labels over the value. Every cell here is a legal disclosure
          requirement, not decoration — see the file-header note above. A
          cell appears once its fact is known; PlaceholderMarker keeps the
          gap in the DOM for the [data-placeholder] sweep and in
          CONTENT_NEEDED.md until then. */}
      <div className="relative z-10 border-t" style={{ borderColor: "var(--border-hairline-dark)" }}>
        {/* Every cell carries its own full border rather than relying on
            nth-child selectors to place dividers only between siblings —
            adjacent hairlines simply overlap to one line, and the lattice
            this makes echoes the blueprint grid used on the hero. */}
        <div
          className="mx-auto grid max-w-[100rem] gap-px sm:grid-cols-3 lg:grid-cols-5"
          style={{ background: "var(--border-hairline-dark)" }}
        >
          {TITLE_BLOCK.map(({ label, value, marker }) => (
            <div key={marker} className="px-6 py-5" style={{ background: "var(--ink)" }}>
              <span className="font-mono-label block" style={{ color: "var(--steel-dim)" }}>
                {label}
              </span>
              <span className="mt-2 block text-sm" style={{ color: "var(--paper)" }}>
                {value ?? <PlaceholderMarker label={marker} />}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="relative z-10 mx-auto flex max-w-[100rem] flex-col gap-2 border-t px-6 py-6 font-mono text-xs md:flex-row md:items-center md:justify-between"
        style={{ color: "var(--steel-dim)", borderColor: "var(--border-hairline-dark)" }}
      >
        <span>SHEET — FOOTER · SCALE N.T.S.</span>
        {/* Rendered at request time, not build time: this page is otherwise
            statically prerendered, which would freeze the year at whenever the
            site was last deployed. */}
        <span suppressHydrationWarning>
          © {new Date().getFullYear()} {business.legalEntity}. We stand behind the work.
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
