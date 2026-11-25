import Link from "next/link";
import { COMMERCIAL_ENABLED } from "@/lib/division-shared";
import { Arrow } from "@/components/ui/icons";

const ROUTES = [
  { href: "/boiler-quote", label: "Get a fixed boiler price", note: "About two minutes, no home visit first." },
  { href: "/care-plans", label: "Boiler care plans", note: "Service, certificate and breakdown cover on one monthly payment." },
  { href: "/emergency", label: "Emergency help", note: "No heating, a leak, or a gas smell — what to do now." },
  { href: "/contact", label: "Request a callback", note: "Goes straight to the two directors." },
  ...(COMMERCIAL_ENABLED
    ? [{ href: "/tenders", label: "Tender & PQQ enquiry", note: "Send the ITT straight to both directors." }]
    : []),
];

export default function NotFound() {
  return (
    <div className="container-x section">
      <div className="max-w-[60ch]">
        <span className="font-mono-label" style={{ color: "var(--amber-ink)" }}>
          Error 404
        </span>
        <h1 className="font-display mt-3" style={{ fontSize: "var(--text-4xl)", color: "var(--ink)" }}>
          That page isn&rsquo;t here.
        </h1>
        <p className="mt-4 text-lg" style={{ color: "var(--steel)" }}>
          The link is out of date or the address was mistyped. Nothing is broken at your end —
          here&rsquo;s where most people are trying to get to.
        </p>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {ROUTES.map((route) => (
          <li key={route.href}>
            <Link href={route.href} className="card card--link flex h-full items-center justify-between gap-4 p-6">
              <span>
                <span className="font-display block text-lg" style={{ color: "var(--ink)" }}>
                  {route.label}
                </span>
                <span className="mt-1 block text-sm" style={{ color: "var(--steel)" }}>
                  {route.note}
                </span>
              </span>
              <span className="shrink-0" style={{ color: "var(--copper-ink)" }} aria-hidden="true">
                <Arrow />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/" className="btn btn--secondary mt-10">
        Back to the homepage
      </Link>
    </div>
  );
}
