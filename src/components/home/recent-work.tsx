"use client";

import { useDivision } from "@/components/division/division-provider";
import { DocketFallbackArt } from "@/components/ui/docket-fallback-art";

/**
 * No real jobs or contracts exist in the system yet. Per §5/§17 of the
 * brief, an honest empty state beats an invented case study — this
 * renders the Docket frame with no fabricated title, client or scope,
 * ready to populate the moment the first job is logged via /ops (Phase 3).
 */
export function RecentWork() {
  const { division } = useDivision();
  const isCommercial = division === "commercial";

  return (
    <section
      className="mx-auto max-w-6xl px-6"
      style={{ paddingBottom: "var(--space-section-mobile)" }}
    >
      <span className="font-mono-label" style={{ color: "var(--copper)" }}>
        {isCommercial ? "Recent projects" : "Recent work"}
      </span>

      <div
        className="mt-6 grid gap-0 overflow-hidden border md:grid-cols-[1.2fr_1fr]"
        style={{ borderColor: "var(--border-hairline)", borderRadius: "var(--radius)" }}
      >
        <div className="aspect-[16/9] md:aspect-auto">
          <DocketFallbackArt variant={division} />
        </div>
        <div
          className="flex flex-col justify-center gap-3 p-8"
          style={{ background: "var(--surface-raised)" }}
        >
          <span className="font-mono-label" style={{ color: "var(--steel)" }}>
            {isCommercial ? "MBS-C-0001" : "MBS-D-0001"} · AWAITING FIRST ENTRY
          </span>
          <p className="font-display text-xl" style={{ color: "var(--ink)" }}>
            {isCommercial
              ? "The first contract docket goes live the day it's logged."
              : "The first job docket goes live the day it's logged."}
          </p>
          <p className="text-sm" style={{ color: "var(--steel)" }}>
            {isCommercial
              ? "Real project references only — sector, scope, duration and value band, with client permission before any name is used."
              : "Before-and-after from the same standing position, job reference, location and warranty — no stock photography, ever."}
          </p>
        </div>
      </div>
    </section>
  );
}
