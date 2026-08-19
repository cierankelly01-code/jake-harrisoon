"use client";

import { useDivision } from "@/components/division/division-provider";

/** No reviews or client references exist yet — never fabricate either (§17). */
export function ReviewsOrReferences() {
  const { division } = useDivision();
  const isCommercial = division === "commercial";

  return (
    <section
      className="mx-auto max-w-6xl px-6"
      style={{ paddingBottom: "var(--space-section-mobile)" }}
    >
      <span className="font-mono-label" style={{ color: "var(--copper)" }}>
        {isCommercial ? "Client references" : "Reviews"}
      </span>
      <div
        className="mt-6 border p-8 text-sm"
        style={{ borderColor: "var(--border-hairline)", borderRadius: "var(--radius)", color: "var(--steel)" }}
      >
        {isCommercial
          ? "References are made available on request once a project's completion permission is confirmed with the client. None are published here yet."
          : "Review collection launches with the first completed jobs, via a direct Google review link — see /reviews once live. None are published here yet."}
      </div>
    </section>
  );
}
