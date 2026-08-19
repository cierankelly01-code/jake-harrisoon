"use client";

import Link from "next/link";
import { useDivision } from "@/components/division/division-provider";

export function CarePlansTeaser() {
  const { division } = useDivision();
  if (division !== "domestic") return null;

  return (
    <section
      className="mx-auto max-w-6xl px-6"
      style={{ paddingBottom: "var(--space-section-mobile)" }}
    >
      <div
        className="flex flex-col items-start gap-4 border p-8 md:flex-row md:items-center md:justify-between"
        style={{ borderColor: "var(--border-hairline)", borderRadius: "var(--radius)", background: "var(--paper-raised)" }}
      >
        <div>
          <span className="font-mono-label" style={{ color: "var(--copper)" }}>
            Care plans
          </span>
          <p className="font-display mt-2 text-2xl" style={{ color: "var(--ink)" }}>
            Annual service, breakdown cover and priority callout — one monthly payment.
          </p>
        </div>
        <Link
          href="/care-plans"
          className="font-mono-label whitespace-nowrap px-5 py-3"
          style={{ background: "var(--flame)", color: "var(--paper)", borderRadius: "var(--radius)" }}
        >
          View plans
        </Link>
      </div>
    </section>
  );
}
