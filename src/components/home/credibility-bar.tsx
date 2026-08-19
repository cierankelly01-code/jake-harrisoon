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

  // Deliberately not repeating the hero trust strip's Gas Safe no./public
  // liability/response SLA — these are the *next* four things a buyer
  // wants to know, not the same four again.
  const items =
    division === "commercial"
      ? [
          { label: "SSIP accredited", value: business.accreditationsHeld.includes("SSIP") ? "Yes" : null },
          { label: "RAMS", value: "Before every mobilisation" },
          { label: "Subcontracting", value: "Vetted network only" },
          { label: "PQQ turnaround", value: "24 hours" },
        ]
      : [
          { label: "Fixed price", value: "Before we start" },
          { label: "Callout fee on quoted work", value: "None" },
          { label: "Arrival windows", value: "Two hours" },
          { label: "Engineers", value: "Not subcontracted" },
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
              <FactOrPlaceholder value={item.value} label={item.label.toUpperCase()} compact />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
