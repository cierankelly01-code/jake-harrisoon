import Link from "next/link";
import { Arrow } from "@/components/ui/icons";

/**
 * "Everything we do" — the full-plumbing-company list.
 *
 * The client's reference site carries six service tiles (Gas, Plumbing &
 * Heating, Electrical, Building, Drainage, Renewables) behind a carousel.
 * Hartson's six are the ones two Gas Safe engineers can actually deliver,
 * and they are a plain list rather than a slider: all six are visible on a
 * phone without a swipe, and the whole thing is in the HTML for crawlers
 * that do not run JavaScript.
 *
 * Nothing here is a claim about work completed, accreditation held or
 * volume. Each line describes the service only.
 */

type Service = {
  title: string;
  detail: string;
  href: string;
};

const SERVICES: Service[] = [
  {
    title: "Boiler installation",
    detail:
      "Combi, system or regular, with the old one taken away and the system cleaned before the new one goes on.",
    href: "/boiler-quote",
  },
  {
    title: "Boiler repair",
    detail:
      "Fault found and explained before anything is replaced, so you can decide between repair and replacement on real numbers.",
    href: "/emergency",
  },
  {
    title: "Servicing and gas safety",
    detail:
      "Annual boiler service, landlord gas safety certificates and the paperwork manufacturers ask for to keep a warranty valid.",
    href: "/care-plans",
  },
  {
    title: "Central heating",
    detail:
      "Radiators, valves, thermostats, pipework and power flushing — cold rooms, noisy pipes and heating that never quite gets there.",
    href: "/contact",
  },
  {
    title: "Plumbing repairs",
    detail:
      "Leaks traced before anything is lifted, plus taps, toilets, showers, stopcocks and burst pipes.",
    href: "/contact",
  },
  {
    title: "Bathrooms",
    detail:
      "Full bathroom installation, including the first and second fix plumbing and the making good afterwards.",
    href: "/contact",
  },
];

export function EverythingWeDo() {
  return (
    <section
      className="section"
      style={{ background: "var(--paper-raised)" }}
      aria-labelledby="everything-heading"
    >
      <div className="container-x">
        <p
          className="font-mono-label text-xs"
          style={{ color: "var(--copper-ink)", letterSpacing: "0.12em" }}
        >
          DOMESTIC HEATING AND PLUMBING
        </p>
        <h2
          id="everything-heading"
          className="font-display mt-3 text-3xl"
          style={{ color: "var(--ink)" }}
        >
          Everything we do.
        </h2>

        {/* Six ruled rows, not a six-card grid — which is what DESIGN.md's
            wireframe specified before the build drifted. As cards this ran
            1,316px on a 375 screen for six short service names; as rows the
            whole list is scannable in one glance, which is the job it is
            actually doing. */}
        <ul
          className="mt-8 list-none overflow-hidden p-0"
          style={{
            background: "var(--paper)",
            border: "1px solid var(--border-hairline)",
            borderRadius: "var(--radius)",
          }}
        >
          {SERVICES.map((service, i) => (
            <li
              key={service.title}
              style={{
                borderTop: i === 0 ? undefined : "1px solid var(--border-hairline)",
              }}
            >
              <Link
                href={service.href}
                className="service-cell flex items-baseline justify-between gap-4 sm:gap-8"
              >
                <span className="min-w-0">
                  <span className="font-display block text-lg" style={{ color: "var(--ink)" }}>
                    {service.title}
                  </span>
                  <span
                    className="mt-1 block text-sm sm:mt-0.5"
                    style={{ color: "var(--steel)" }}
                  >
                    {service.detail}
                  </span>
                </span>
                <span className="shrink-0" style={{ color: "var(--copper-ink)" }}>
                  <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
