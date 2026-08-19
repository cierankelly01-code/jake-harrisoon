import type { Metadata } from "next";
import { DOMESTIC_PRICES } from "@/lib/content/domestic-prices";
import { FactOrPlaceholder } from "@/components/ui/placeholder";

export const metadata: Metadata = {
  title: "Prices",
  description: "Real prices for straightforward domestic jobs.",
};

export default function PricesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6" style={{ paddingTop: "var(--space-section-mobile)", paddingBottom: "var(--space-section-mobile)" }}>
      <span className="font-mono-label" style={{ color: "var(--copper)" }}>
        Prices
      </span>
      <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl" style={{ color: "var(--ink)" }}>
        Real prices for straightforward jobs.
      </h1>
      <p className="mt-4 text-lg" style={{ color: "var(--steel)" }}>
        If yours isn&apos;t straightforward we&apos;ll tell you before we start, not after.
      </p>

      <table className="mt-10 w-full border-collapse text-sm">
        <thead>
          <tr className="hairline text-left" style={{ borderColor: "var(--border-hairline)" }}>
            <th className="pb-3 font-mono-label" style={{ color: "var(--steel)" }}>
              Job
            </th>
            <th className="pb-3 text-right font-mono-label" style={{ color: "var(--steel)" }}>
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {DOMESTIC_PRICES.map((line) => (
            <tr key={line.job} className="hairline" style={{ borderColor: "var(--border-hairline)" }}>
              <td className="py-4" style={{ color: "var(--ink)" }}>
                {line.job}
                {line.note && (
                  <span className="mt-1 block text-xs" style={{ color: "var(--steel)" }}>
                    {line.note}
                  </span>
                )}
              </td>
              <td className="py-4 text-right font-mono tabular-nums" style={{ color: "var(--ink)" }}>
                <FactOrPlaceholder value={line.price} label={`PRICE — ${line.job.toUpperCase()}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
