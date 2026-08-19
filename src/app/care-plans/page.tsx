import type { Metadata } from "next";
import { CarePlansSection } from "@/components/care-plans/care-plans-section";

export const metadata: Metadata = {
  title: "Care Plans",
  description: "Annual service, gas safety certificate, breakdown cover and priority callout — one monthly payment.",
};

export default function CarePlansPage() {
  return (
    <div className="mx-auto max-w-6xl px-6" style={{ paddingTop: "var(--space-section-mobile)", paddingBottom: "var(--space-section-mobile)" }}>
      <span className="font-mono-label" style={{ color: "var(--copper)" }}>
        Care plans
      </span>
      <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl" style={{ color: "var(--ink)" }}>
        One monthly payment. No surprise call-out bills.
      </h1>
      <p className="mt-4 max-w-xl text-lg" style={{ color: "var(--steel)" }}>
        Annual service, gas safety certificate, breakdown cover and priority callout — pick the
        level of cover that matches how much you want to think about your boiler.
      </p>
      <div className="mt-10">
        <CarePlansSection />
      </div>
    </div>
  );
}
