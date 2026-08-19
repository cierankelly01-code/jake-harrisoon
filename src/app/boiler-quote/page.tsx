import type { Metadata } from "next";
import { QuoteWizard } from "@/components/quote/quote-wizard";

export const metadata: Metadata = {
  title: "Instant Boiler Quote",
  description: "Get a three-tier boiler price band in minutes, before you've even picked up the phone.",
};

export default function BoilerQuotePage() {
  return (
    <div className="mx-auto max-w-2xl px-6" style={{ paddingTop: "var(--space-section-mobile)", paddingBottom: "var(--space-section-mobile)" }}>
      <span className="font-mono-label" style={{ color: "var(--copper)" }}>
        Instant boiler quote
      </span>
      <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl" style={{ color: "var(--ink)" }}>
        A price band in under two minutes.
      </h1>
      <p className="mt-4 text-lg" style={{ color: "var(--steel)" }}>
        No calls, no waiting. Answer a few questions and we&apos;ll show you three price bands before
        confirming with a free survey.
      </p>
      <div className="mt-10">
        <QuoteWizard />
      </div>
    </div>
  );
}
