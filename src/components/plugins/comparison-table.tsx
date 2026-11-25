import { COMPARISON_ROWS } from "@/lib/content/promises";
import { Cross, Tick } from "@/components/ui/icons";

/**
 * Hartson vs. common trade practice. The right-hand column names no firm.
 * Below `lg` the table scrolls sideways with a fade cue.
 */
export function ComparisonTable() {
  return (
    <section aria-labelledby="comparison-heading" className="section--tight" style={{ background: "var(--paper-raised)" }}>
      <div className="container-x">
        <div className="max-w-[60ch]">
          <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
            Straight comparison
          </span>
          <h2 id="comparison-heading" className="font-display mt-3 text-3xl" style={{ color: "var(--ink)" }}>
            The differences that show up on the invoice.
          </h2>
        </div>
        {/* Phones: one card per row, both answers visible. No sideways scrolling. */}
        <ul className="mt-6 grid gap-3 md:hidden">
          {COMPARISON_ROWS.map((row) => (
            <li key={row.point} className="card p-4">
              <p className="text-sm font-bold" style={{ color: "var(--ink)" }}>
                {row.point}
              </p>
              <div className="mt-3 flex items-start gap-2.5">
                <span className="tick" aria-hidden="true">
                  <Tick />
                </span>
                <p className="text-sm">
                  <span className="font-semibold" style={{ color: "var(--copper-ink)" }}>Hartson: </span>
                  <span style={{ color: "var(--ink)" }}>{row.us}</span>
                </p>
              </div>
              <div className="mt-2 flex items-start gap-2.5">
                <span className="tick" aria-hidden="true" style={{ background: "#eef1ee", color: "var(--steel)" }}>
                  <Cross />
                </span>
                <p className="text-sm" style={{ color: "var(--steel)" }}>
                  <span className="font-semibold">Common in the trade: </span>
                  {row.typical}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div
          className="mt-10 hidden overflow-hidden md:block"
          style={{ border: "1px solid var(--border-hairline)", borderRadius: "var(--radius)", background: "#fff" }}
        >
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">How Hartson works compared with common practice in the heating trade</caption>
            <thead>
              <tr>
                <th scope="col" className="px-5 py-4 text-sm font-semibold" style={{ color: "var(--steel)", width: "30%" }}>
                  On the job
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-sm font-bold"
                  style={{ color: "var(--copper-ink)", background: "var(--flame-tint)", width: "36%", borderRadius: "12px 12px 0 0" }}
                >
                  Hartson
                </th>
                <th scope="col" className="px-5 py-4 text-sm font-semibold" style={{ color: "var(--steel)", width: "34%" }}>
                  Common in the trade
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.point} style={{ borderTop: "1px solid var(--border-hairline)" }}>
                  <th scope="row" className="px-5 py-4 text-sm font-semibold" style={{ color: "var(--ink)" }}>
                    {row.point}
                  </th>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--ink)", background: "color-mix(in srgb, var(--flame-tint) 55%, #fff)" }}>
                    <span className="flex items-start gap-2.5">
                      <span className="tick" aria-hidden="true">
                        <Tick />
                      </span>
                      <span className="font-medium">{row.us}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--steel)" }}>
                    <span className="flex items-start gap-2.5">
                      <span className="tick" aria-hidden="true" style={{ background: "#eef1ee", color: "var(--steel)" }}>
                        <Cross />
                      </span>
                      {row.typical}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs" style={{ color: "var(--steel)" }}>
          The right-hand column describes common practice in the trade. No individual firm is referred to.
        </p>
      </div>
    </section>
  );
}
