"use client";

import Link from "next/link";
import { useDivision } from "@/components/division/division-provider";

export function FinalCta() {
  const { division } = useDivision();
  const isCommercial = division === "commercial";

  return (
    <section style={{ background: "var(--flame-deep)", color: "var(--paper)" }}>
      <div
        className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 md:flex-row md:items-center md:justify-between"
        style={{ paddingTop: "var(--space-section-mobile)", paddingBottom: "var(--space-section-mobile)" }}
      >
        <h2 className="font-display max-w-xl text-3xl leading-tight">
          {isCommercial ? "Send us the ITT. We'll do the rest." : "Boiler on the way out? Get a price now."}
        </h2>
        <Link
          href={isCommercial ? "/tenders" : "/boiler-quote"}
          className="font-mono-label whitespace-nowrap px-6 py-3.5"
          style={{ background: "var(--flame)", color: "var(--paper)", borderRadius: "var(--radius)" }}
        >
          {isCommercial ? "Submit a tender enquiry" : "Get an instant price"}
        </Link>
      </div>
    </section>
  );
}
