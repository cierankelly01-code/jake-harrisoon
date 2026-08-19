import type { Metadata } from "next";
import { CarePlansSection } from "@/components/care-plans/care-plans-section";

export const metadata: Metadata = {
  title: "Care Plans",
  description: "Annual service, gas safety certificate, breakdown cover and priority callout — one monthly payment.",
};

export default async function CarePlansPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; cancelled?: string }>;
}) {
  const { success, cancelled } = await searchParams;

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

      {success && (
        <div
          className="mt-8 border p-4"
          style={{ borderColor: "var(--flame)", borderRadius: "var(--radius)", background: "var(--paper-raised)", color: "var(--ink)" }}
          role="status"
        >
          You&apos;re signed up. A confirmation is on its way to your email.
        </div>
      )}
      {cancelled && (
        <div
          className="mt-8 border p-4"
          style={{ borderColor: "var(--border-hairline)", borderRadius: "var(--radius)", background: "var(--paper-raised)", color: "var(--ink)" }}
          role="status"
        >
          Checkout was cancelled — no payment was taken. Pick a plan below whenever you&apos;re ready.
        </div>
      )}

      <div className="mt-10">
        <CarePlansSection />
      </div>
    </div>
  );
}
