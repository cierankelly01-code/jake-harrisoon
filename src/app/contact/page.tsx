import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/lib/content/business";
import { PlaceholderMarker } from "@/components/ui/placeholder";
import { COMMERCIAL_ENABLED } from "@/lib/division-shared";
import { CallbackForm } from "@/components/forms/callback-form";
import { Arrow } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a callback from Hartson Heating — Gas Safe registered boiler installation, servicing and plumbing across Tamworth and the West Midlands.",
};

const DIRECT_LINES = [
  { label: "Telephone", value: business.phoneMain, factLabel: "MAIN PHONE", href: (v: string) => `tel:${v.replace(/[^\d+]/g, "")}` },
  { label: "Out of hours", value: business.phoneOutOfHours, factLabel: "OUT-OF-HOURS PHONE", href: (v: string) => `tel:${v.replace(/[^\d+]/g, "")}` },
  { label: "Email", value: business.emailGeneral, factLabel: "GENERAL EMAIL", href: (v: string) => `mailto:${v}` },
  ...(COMMERCIAL_ENABLED
    ? [{ label: "Tenders & PQQ", value: business.emailTenders, factLabel: "TENDERS EMAIL", href: (v: string) => `mailto:${v}` }]
    : []),
] as const;

const QUICK_ROUTES = [
  {
    href: "/boiler-quote",
    title: "Want a boiler price?",
    body: "Skip the phone call — get a fixed-price range online in about two minutes.",
    cta: "Get my fixed price",
  },
  {
    href: "/emergency",
    title: "No heating, a leak, or a gas smell?",
    body: "What to do right now, and how to get someone out.",
    cta: "Emergency help",
    amber: true,
  },
  {
    href: "/care-plans",
    title: "After boiler cover?",
    body: "Service, certificate and breakdown cover on one monthly payment.",
    cta: "Compare plans",
  },
];

export default function ContactPage() {
  const directLines = DIRECT_LINES.filter((line) => line.value);

  return (
    <>
      <section className="container-x pt-10 sm:pt-14">
        <div className="max-w-[60ch]">
          <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
            Contact
          </span>
          <h1 className="font-display mt-3" style={{ fontSize: "var(--text-4xl)", color: "var(--ink)" }}>
            Tell us what needs doing.
          </h1>
          <p className="mt-4 text-lg" style={{ color: "var(--steel)" }}>
            Everything here goes straight to the two directors, not a call centre. Based in{" "}
            {business.base}, covering {business.coverage.length} towns.
          </p>
        </div>
      </section>

      <section className="container-x section--tight">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <CallbackForm />
          </div>

          <aside className="flex flex-col gap-4 lg:col-span-5">
            {directLines.length > 0 && (
              <div className="card card--soft p-6">
                <span className="font-mono-label" style={{ color: "var(--steel)" }}>
                  Direct lines
                </span>
                <dl className="mt-3 flex flex-col gap-3">
                  {directLines.map((line) => (
                    <div key={line.label}>
                      <dt className="text-xs font-semibold" style={{ color: "var(--steel)" }}>
                        {line.label}
                      </dt>
                      <dd>
                        <a href={line.href(line.value as string)} className="font-display link-draw text-lg" style={{ color: "var(--ink)" }}>
                          {line.value}
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {DIRECT_LINES.filter((line) => !line.value).map((line) => (
              <PlaceholderMarker key={line.factLabel} label={line.factLabel} />
            ))}

            {QUICK_ROUTES.map((route) => (
              <Link key={route.href} href={route.href} className="card card--link flex items-center justify-between gap-4 p-5">
                <span>
                  <span className="font-display block text-lg" style={{ color: "var(--ink)" }}>
                    {route.title}
                  </span>
                  <span className="mt-1 block text-sm" style={{ color: "var(--steel)" }}>
                    {route.body}
                  </span>
                  <span
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold"
                    style={{ color: route.amber ? "var(--amber-ink)" : "var(--copper-ink)" }}
                  >
                    {route.cta}
                    <Arrow />
                  </span>
                </span>
              </Link>
            ))}

            <div className="card card--soft p-6">
              <span className="font-mono-label" style={{ color: "var(--steel)" }}>
                Where we work
              </span>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--steel)" }}>
                {business.coverage.join(" · ")}
              </p>
              <p className="mt-3 text-sm" style={{ color: "var(--steel)" }}>
                Just outside the list? Ask anyway — we&rsquo;ll tell you straight whether we can cover you properly.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
