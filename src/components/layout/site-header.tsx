import Link from "next/link";
import { business } from "@/lib/content/business";
import { FactOrPlaceholder } from "@/components/ui/placeholder";
import { DivisionToggle } from "@/components/division/division-toggle";
import { MobileUtilityBar } from "./mobile-utility-bar";

const NAV_LINKS = [
  { href: "/capability", label: "Capability" },
  { href: "/tenders", label: "Tenders" },
  { href: "/boiler-quote", label: "Instant Quote" },
  { href: "/care-plans", label: "Care Plans" },
  { href: "/prices", label: "Prices" },
];

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50">
      {/* Utility bar — desktop */}
      <div
        className="hidden items-center justify-between px-6 py-2 font-mono-label md:flex"
        style={{ background: "var(--ink)", color: "var(--steel-dim)" }}
      >
        <div className="flex items-center gap-6">
          <span>
            TEL{" "}
            <a href="tel:" className="hover:text-flame-glow" style={{ color: "var(--paper)" }}>
              <FactOrPlaceholder value={business.phoneMain} label="PHONE MAIN" />
            </a>
          </span>
          <span>
            EMAIL{" "}
            <a href="mailto:" className="hover:text-flame-glow" style={{ color: "var(--paper)" }}>
              <FactOrPlaceholder value={business.emailGeneral} label="EMAIL GENERAL" />
            </a>
          </span>
          <span>
            GAS SAFE{" "}
            <FactOrPlaceholder value={business.gasSafeNumber} label="GAS SAFE NUMBER" />
          </span>
        </div>
        <div className="flex items-center gap-4">
          {business.accreditationsHeld.length > 0 ? (
            business.accreditationsHeld.map((a) => <span key={a}>{a}</span>)
          ) : (
            <span style={{ color: "var(--steel)" }}>SSIP · CONSTRUCTIONLINE — PENDING</span>
          )}
        </div>
      </div>

      {/* Main nav */}
      <nav
        className="flex items-center justify-between border-b px-6 py-4"
        style={{ background: "var(--surface-dark)", borderColor: "var(--border-hairline-dark)" }}
      >
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-xl" style={{ color: "var(--paper)" }}>
            MARMION
          </span>
          <span
            className="font-mono-label mt-1"
            style={{ color: "var(--copper)", letterSpacing: "0.18em" }}
          >
            BUILDING SERVICES
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono-label transition-colors"
              style={{ color: "var(--steel-dim)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <DivisionToggle tone="dark" />
      </nav>

      <MobileUtilityBar />
    </div>
  );
}
