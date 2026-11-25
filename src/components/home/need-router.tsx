import Link from "next/link";
import { Arrow } from "@/components/ui/icons";

/**
 * The signature moment — see DESIGN.md.
 *
 * The client's reference site opens with "WHAT ARE YOU LOOKING FOR?" and
 * routes by *audience* (domestic / commercial / landlord / managing agent).
 * Hartson is domestic only, so routing by audience would give a homeowner
 * four doors that all lead to the same place. This routes by **need**
 * instead, which is the question someone actually arrives with.
 *
 * Four real `<a>` elements. No carousel, no JavaScript, no state. The hover
 * lift is one transform and one colour swap, and `prefers-reduced-motion`
 * kills it through the global rule in `globals.css`.
 */

type Need = {
  href: string;
  title: string;
  /** Answers "is this me?" in one plain line. */
  detail: string;
  icon: React.ReactNode;
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const NEEDS: Need[] = [
  {
    href: "/boiler-quote",
    title: "A new boiler",
    detail: "Yours is on its last legs, or the repair bill no longer makes sense.",
    /* A wall-hung boiler with a flame in the window — the first glyph was
       a rectangle with two text lines in it and read as a receipt. */
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
        <rect x="5" y="3" width="14" height="14" rx="2" {...stroke} />
        <path d="M12 7.5c1.1 1.4 2.2 2.4 2.2 3.8a2.2 2.2 0 0 1-4.4 0c0-1.4 1.1-2.4 2.2-3.8Z" {...stroke} />
        <path d="M8 17v3M16 17v3" {...stroke} />
      </svg>
    ),
  },
  {
    href: "/emergency",
    title: "Something's broken",
    detail: "No heating, no hot water, or water where water should not be.",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
        <path d="M12 3c2.5 3.2 5 5.8 5 9a5 5 0 0 1-10 0c0-3.2 2.5-5.8 5-9Z" {...stroke} />
        <path d="M12 9v4" {...stroke} />
      </svg>
    ),
  },
  {
    href: "/care-plans",
    title: "A service or gas check",
    detail: "Annual service, landlord certificate, or keeping the warranty valid.",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
        <path d="M12 3 4 6v5.5c0 4.4 3.2 8.2 8 9.5 4.8-1.3 8-5.1 8-9.5V6l-8-3Z" {...stroke} />
        <path d="m9 12 2.2 2.2L15.5 10" {...stroke} />
      </svg>
    ),
  },
  {
    href: "/contact",
    title: "Plumbing or a bathroom",
    detail: "Leaks, taps, radiators, pipework, or a bathroom you want redone.",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
        <path d="M4 13h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Z" {...stroke} />
        <path d="M9 13V6a2 2 0 0 1 2-2h1" {...stroke} />
        <path d="M7 20l-1 1M17 20l1 1" {...stroke} />
      </svg>
    ),
  },
];

export function NeedRouter() {
  return (
    <section
      className="section"
      style={{ background: "var(--paper)" }}
      aria-labelledby="need-router-heading"
    >
      <div className="container-x">
        <h2
          id="need-router-heading"
          className="font-display text-3xl"
          style={{ color: "var(--ink)" }}
        >
          What do you need?
        </h2>
        <p className="mt-3 max-w-[52ch] text-base" style={{ color: "var(--steel)" }}>
          Pick the one that sounds like you. Every route ends with a real person and a
          price in writing.
        </p>

        {/* 2-up from 375, not 1-up. Four full-width cards ran to 1,079px —
            more than a phone screen and a half for the one component that
            is supposed to be the fast way in. */}
        <ul className="mt-8 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-4">
          {NEEDS.map((need) => (
            <li key={need.href}>
              <Link href={need.href} className="need-card">
                <span className="need-card__icon" aria-hidden="true">
                  {need.icon}
                </span>
                <span
                  className="font-display mt-4 block text-lg sm:mt-5 sm:text-xl"
                  style={{ color: "var(--ink)", minHeight: "2lh" }}
                >
                  {need.title}
                </span>
                <span className="mt-2 block text-sm" style={{ color: "var(--steel)" }}>
                  {need.detail}
                </span>
                {/* A persistent arrow, not a hover state. The traffic is
                    touch, where there is no hover, and without it these
                    read as information cards rather than links. */}
                <span
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold"
                  style={{ color: "var(--copper-ink)" }}
                >
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
