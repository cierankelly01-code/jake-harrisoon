import { COMPARISON_ROWS } from "@/lib/content/promises";

/**
 * PLUGIN — comparison table.
 *
 * Names no competitor: the right-hand column describes common practice in
 * the trade, which is a fair characterisation rather than a claim about any
 * identifiable firm. Every left-hand entry is a commitment published
 * elsewhere on this site, so nothing here is a new promise.
 *
 * Mobile: the table scrolls horizontally inside its own container with a
 * shadow affordance rather than reflowing into unreadable stacked cells.
 */
export function ComparisonTable() {
  return (
    <section
      aria-labelledby="comparison-heading"
      className="mx-auto max-w-[100rem] px-6"
      style={{ paddingTop: "var(--space-section-dense)", paddingBottom: "var(--space-section-dense)" }}
    >
      <span className="section-index font-mono-label" data-index="06" style={{ color: "var(--copper-ink)" }}>
        Straight comparison
      </span>
      <h2 id="comparison-heading" className="font-display mt-4 max-w-[24ch] text-3xl" style={{ color: "var(--ink)" }}>
        The differences that actually show up on the invoice.
      </h2>

      <div
        className="mt-10 overflow-x-auto border"
        style={{ borderColor: "var(--border-hairline)", borderRadius: "var(--radius)" }}
      >
        <table className="w-full border-collapse text-left" style={{ minWidth: "44rem" }}>
          <caption className="sr-only">
            How Marmion works compared with common practice in the heating trade
          </caption>
          <thead>
            <tr style={{ background: "var(--ink)" }}>
              <th
                scope="col"
                className="font-mono-label px-5 py-4"
                style={{ color: "var(--steel-dim)", width: "30%" }}
              >
                On the job
              </th>
              <th
                scope="col"
                className="font-mono-label px-5 py-4"
                style={{ color: "var(--paper)", background: "var(--flame-deep)", width: "36%" }}
              >
                Marmion
              </th>
              <th scope="col" className="font-mono-label px-5 py-4" style={{ color: "var(--steel-dim)", width: "34%" }}>
                Common in the trade
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, index) => (
              <tr
                key={row.point}
                style={{
                  background: index % 2 === 0 ? "var(--surface)" : "var(--surface-raised)",
                  borderTop: "1px solid var(--border-hairline)",
                }}
              >
                <th scope="row" className="px-5 py-4 text-sm font-medium" style={{ color: "var(--ink)" }}>
                  {row.point}
                </th>
                <td
                  className="px-5 py-4 text-sm"
                  style={{
                    color: "var(--ink)",
                    background: "color-mix(in srgb, var(--flame) 7%, transparent)",
                    borderInline: "1px solid var(--border-hairline)",
                  }}
                >
                  <span className="flex items-start gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mt-1 shrink-0">
                      <path d="M2 7.5L5.5 11L12 3.5" stroke="var(--flame)" strokeWidth="2" />
                    </svg>
                    {row.us}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm" style={{ color: "var(--steel)" }}>
                  <span className="flex items-start gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mt-1 shrink-0">
                      <path d="M3 3L11 11M11 3L3 11" stroke="var(--steel)" strokeWidth="1.6" />
                    </svg>
                    {row.typical}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-mono-label mt-4" style={{ color: "var(--steel)" }}>
        Right-hand column describes common practice in the trade. No individual firm is referred to.
      </p>
    </section>
  );
}
