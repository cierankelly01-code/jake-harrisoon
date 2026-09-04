import Link from "next/link";
import { business } from "@/lib/content/business";

/**
 * 404. A dead end is the one page guaranteed to be reached by someone who
 * already wanted something, so it is built as a router, not an apology —
 * every live destination on the site is one click away, and the two that
 * actually convert are given the most weight.
 *
 * The conceit is the drawing register: this site's whole visual language is
 * issued drawings and sheet numbers, so a missing page is a sheet that was
 * never issued. No cartoon, no "oops".
 */

const ROUTES = [
  {
    index: "01",
    href: "/boiler-quote",
    label: "Instant boiler quote",
    note: "Domestic — a real price in about two minutes, no home visit first.",
  },
  {
    index: "02",
    href: "/tenders",
    label: "Tender & PQQ enquiry",
    note: "Commercial — send the ITT or specification straight to both directors.",
  },
  {
    index: "03",
    href: "/capability",
    label: "Capability statement",
    note: "Services, coverage and the full contracting scope, downloadable as a PDF.",
  },
  {
    index: "04",
    href: "/contact",
    label: "Contact",
    note: "Every way to reach us, and which one gets the fastest answer.",
  },
];

const TITLE_BLOCK = [
  { key: "Sheet no.", value: "—" },
  { key: "Status", value: "NOT ISSUED" },
  { key: "Revision", value: "—" },
  { key: "Register", value: `${business.tradingName.toUpperCase()} / WEB` },
];

export default function NotFound() {
  return (
    <div className="grain relative" style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <div
        className="relative z-10 mx-auto max-w-5xl px-6"
        style={{ paddingTop: "var(--space-section-mobile)", paddingBottom: "var(--space-section-mobile)" }}
      >
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-mono-label" style={{ color: "var(--amber)" }}>
            Error 404
          </span>
          <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
            Drawing register
          </span>
        </div>

        <h1
          className="font-display font-display-xl mt-5 text-4xl md:text-6xl"
          style={{ color: "var(--paper)" }}
        >
          This sheet was never issued.
        </h1>

        <p className="mt-6 max-w-xl text-lg" style={{ color: "var(--steel-dim)" }}>
          The page you asked for isn&apos;t in the register. It was either superseded, never
          drawn, or the address was mistyped somewhere between there and here. Nothing is
          broken at your end.
        </p>

        {/* Title block — the panel every real drawing carries in its bottom-right corner. */}
        <dl
          className="mt-10 grid max-w-2xl border sm:grid-cols-4"
          style={{ borderColor: "var(--border-hairline-dark)", borderRadius: "var(--radius)" }}
        >
          {TITLE_BLOCK.map(({ key, value }) => (
            /* Stacked on a phone the cells divide horizontally; on a wide
               screen it becomes one row of four, so the dividing rule has to
               switch axis with it — otherwise the last cell doubles up a
               hairline against the container's own border. */
            <div
              key={key}
              className="border-b p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
              style={{ borderColor: "var(--border-hairline-dark)" }}
            >
              <dt className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
                {key}
              </dt>
              <dd className="mt-2 font-mono text-sm tabular-nums" style={{ color: "var(--paper)" }}>
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <h2 className="font-mono-label mt-14" style={{ color: "var(--copper-bright)" }}>
          Sheets that are issued
        </h2>

        <ul className="mt-4 border-t" style={{ borderColor: "var(--border-hairline-dark)" }}>
          {ROUTES.map(({ index, href, label, note }) => (
            <li key={href} className="border-b" style={{ borderColor: "var(--border-hairline-dark)" }}>
              <Link
                href={href}
                className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span
                  className="font-mono-label shrink-0 sm:w-16"
                  style={{ color: "var(--copper-bright)" }}
                >
                  {index}
                </span>
                <span className="flex-1">
                  <span
                    className="link-draw font-display text-xl md:text-2xl"
                    style={{ color: "var(--paper)" }}
                  >
                    {label}
                  </span>
                  <span className="mt-1 block text-sm" style={{ color: "var(--steel-dim)" }}>
                    {note}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="docket__arrow shrink-0 self-start sm:self-center"
                  style={{ color: "var(--flame-glow)" }}
                >
                  <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
                    <path
                      d="M0 6h20M15 1l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link href="/" className="btn btn--primary">
            Back to the homepage
          </Link>
          <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
            {business.base}
          </span>
        </div>
      </div>
    </div>
  );
}
