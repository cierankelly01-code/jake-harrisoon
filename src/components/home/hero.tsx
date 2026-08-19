"use client";

import Link from "next/link";
import { useDivision } from "@/components/division/division-provider";
import { DivisionToggle } from "@/components/division/division-toggle";
import { business } from "@/lib/content/business";
import { FactOrPlaceholder } from "@/components/ui/placeholder";

const COPY = {
  commercial: {
    eyebrow: "Marmion Commercial",
    headline: "Mechanical contracting, PPM and statutory compliance across the West Midlands.",
    sub: "PPM and reactive contracts from single site to multi-site portfolios. RAMS issued before every mobilisation. Send us the ITT — we return PQQ documentation within 24 hours.",
    primaryCta: { label: "Download capability statement", href: "/capability" },
    secondaryCta: { label: "Submit a tender enquiry", href: "/tenders" },
  },
  domestic: {
    eyebrow: "Marmion Domestic",
    headline: "Boilers fitted properly. Priced before we start.",
    sub: "Gas Safe registered engineers, not subcontracted. Fixed price before we start — the price doesn't move once we're on site.",
    primaryCta: { label: "Get an instant price", href: "/boiler-quote" },
    secondaryCta: { label: "Call now", href: "tel:" },
  },
} as const;

export function Hero() {
  const { division } = useDivision();
  const copy = COPY[division];
  const isCommercial = division === "commercial";

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: isCommercial
          ? "linear-gradient(160deg, var(--ink) 0%, var(--flame-deep) 140%)"
          : "var(--paper)",
        color: isCommercial ? "var(--paper)" : "var(--ink)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: isCommercial
            ? "radial-gradient(60% 50% at 20% 20%, var(--flame) 0%, transparent 70%)"
            : "none",
          animation: isCommercial ? "breathe var(--duration-breathe) ease-in-out infinite" : undefined,
        }}
      />
      <style>{`@keyframes breathe { 0%,100% { opacity: 0.25 } 50% { opacity: 0.5 } }`}</style>

      <div
        className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6"
        style={{ paddingTop: "var(--space-section-mobile)", paddingBottom: "var(--space-section-mobile)" }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono-label" style={{ color: isCommercial ? "var(--copper)" : "var(--flame)" }}>
            {copy.eyebrow}
          </span>
          <DivisionToggle tone={isCommercial ? "dark" : "light"} />
        </div>

        <h1 className="font-display max-w-5xl text-balance text-4xl leading-[1.08] md:text-5xl 2xl:text-6xl">
          {copy.headline}
        </h1>

        <p className="max-w-xl text-lg" style={{ color: isCommercial ? "var(--steel-dim)" : "var(--steel)" }}>
          {copy.sub}
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href={copy.primaryCta.href}
            className="font-mono-label px-6 py-3.5 transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--flame)", color: "var(--paper)", borderRadius: "var(--radius)" }}
          >
            {copy.primaryCta.label}
          </Link>
          <Link
            href={copy.secondaryCta.href}
            className="font-mono-label border px-6 py-3.5 transition-colors"
            style={{
              borderColor: isCommercial ? "var(--border-hairline-dark)" : "var(--border-hairline)",
              color: isCommercial ? "var(--paper)" : "var(--ink)",
              borderRadius: "var(--radius)",
            }}
          >
            {copy.secondaryCta.label}
          </Link>
        </div>

        <div
          className="mt-6 grid grid-cols-2 gap-6 border-t pt-6 sm:grid-cols-4"
          style={{ borderColor: isCommercial ? "var(--border-hairline-dark)" : "var(--border-hairline)" }}
        >
          <TrustStat label="Gas Safe no." value={business.gasSafeNumber} dark={isCommercial} />
          <TrustStat label="Public liability" value={business.publicLiability} dark={isCommercial} />
          <TrustStat label="Response SLA" value={business.responseSla} dark={isCommercial} />
          <TrustStat label="Base" value={business.base} dark={isCommercial} />
        </div>
      </div>
    </section>
  );
}

function TrustStat({ label, value, dark }: { label: string; value: string | null; dark: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono-label" style={{ color: dark ? "var(--steel-dim)" : "var(--steel)" }}>
        {label}
      </span>
      <span className="font-mono text-sm tabular-nums" style={{ color: dark ? "var(--paper)" : "var(--ink)" }}>
        <FactOrPlaceholder value={value} label={label.toUpperCase()} compact />
      </span>
    </div>
  );
}
