"use client";

import { useDivision } from "@/components/division/division-provider";
import { FactOrPlaceholder } from "@/components/ui/placeholder";
import { business } from "@/lib/content/business";

/**
 * Every line here is a commitment or declaration made on the client's
 * behalf. Per §8.1.3 of the brief, none render an accreditation the
 * business does not hold — figures are placeholders until confirmed.
 */
export function CredibilityBar() {
  const { division } = useDivision();

  const items =
    division === "commercial"
      ? [
          { label: "SSIP accredited", value: business.accreditationsHeld.includes("SSIP") ? "Yes" : null },
          { label: "Public liability", value: business.publicLiability },
          { label: "RAMS", value: "Before every mobilisation" },
          { label: "Reactive SLA", value: business.responseSla },
        ]
      : [
          { label: "Fixed price", value: "Before we start" },
          { label: "Callout fee on quoted work", value: "None" },
          { label: "Arrival windows", value: "Two hours" },
          { label: "Gas Safe no.", value: business.gasSafeNumber },
        ];

  return (
    <div className="border-y" style={{ borderColor: "var(--border-hairline)", background: "var(--paper-raised)" }}>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="font-mono-label" style={{ color: "var(--steel)" }}>
              {item.label}
            </span>
            <span className="font-mono text-lg tabular-nums" style={{ color: "var(--ink)" }}>
              <FactOrPlaceholder value={item.value} label={item.label.toUpperCase()} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
