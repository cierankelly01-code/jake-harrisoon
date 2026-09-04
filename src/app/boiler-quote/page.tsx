import type { Metadata } from "next";
import { QuoteWizard } from "@/components/quote/quote-wizard";
import { DOMESTIC_PROMISES } from "@/lib/content/promises";

export const metadata: Metadata = {
  title: "Instant Boiler Quote",
  description:
    "Answer eight questions and get three boiler price bands in about two minutes. No calls, no home visit, no obligation.",
};

/**
 * The wizard used to sit under a full-viewport headline in a narrow centred
 * column, so on a laptop the tool itself started below the fold with ~700px
 * of empty page either side of it. It now runs as a two-column layout: a
 * compact header and the reassurance rail on the left, the tool on the right
 * and on screen immediately.
 */
export default function BoilerQuotePage() {
  return (
    <div
      className="mx-auto max-w-[100rem] px-6"
      style={{ paddingTop: "var(--space-section-tight)", paddingBottom: "var(--space-section)" }}
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
            Instant boiler quote
          </span>
          <h1 className="font-display font-display-xl mt-4 text-3xl" style={{ color: "var(--ink)" }}>
            Three price bands in about two minutes.
          </h1>
          <p className="mt-5 max-w-[42ch] text-lg" style={{ color: "var(--steel)" }}>
            Eight questions, no phone call and nobody at your door. You get three bands now; the
            fixed price is set after a free survey and does not move once it is.
          </p>

          <ul className="mt-10 flex flex-col border-t" style={{ borderColor: "var(--border-hairline)" }}>
            {DOMESTIC_PROMISES.map((promise) => (
              <li key={promise.id} className="border-b py-4" style={{ borderColor: "var(--border-hairline)" }}>
                <div className="flex gap-3">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                    className="mt-1 shrink-0"
                  >
                    <path d="M2 7.5L5.5 11L12 3.5" stroke="var(--flame)" strokeWidth="2" />
                  </svg>
                  <div>
                    <p className="text-base font-medium" style={{ color: "var(--ink)" }}>
                      {promise.title}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "var(--steel)" }}>
                      {promise.proof}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <div
            className="border p-6 md:p-8"
            style={{
              borderColor: "var(--border-hairline)",
              borderRadius: "var(--radius)",
              background: "var(--surface-raised)",
            }}
          >
            <QuoteWizard />
          </div>
        </div>
      </div>
    </div>
  );
}
