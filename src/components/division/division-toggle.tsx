"use client";

import { useDivision } from "./division-provider";
import { track } from "@/lib/analytics";

export function DivisionToggle({
  tone = "dark",
  block = false,
}: {
  tone?: "dark" | "light";
  /** Stretch to fill the container — used by the phone-width header strip,
      where this is the most important control on the page and was previously
      not rendered at all below 640px. */
  block?: boolean;
}) {
  const { division, setDivision } = useDivision();
  const isDark = tone === "dark";

  return (
    <div
      role="group"
      aria-label="Switch between Commercial and Domestic"
      className={`${block ? "flex w-full" : "inline-flex"} border p-0.5 font-mono-label`}
      style={{
        borderColor: isDark ? "var(--border-hairline-dark)" : "var(--border-hairline)",
        borderRadius: "var(--radius)",
      }}
    >
      {(["commercial", "domestic"] as const).map((opt) => {
        const active = division === opt;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => {
              setDivision(opt);
              track("division_switch", { to: opt });
            }}
            className={`division-option px-3 py-2 ${block ? "flex-1" : ""}`}
            style={{
              borderRadius: "var(--radius)",
              background: active ? "var(--flame)" : "transparent",
              color: active ? "var(--paper)" : isDark ? "var(--steel-dim)" : "var(--steel)",
            }}
          >
            {opt === "commercial" ? "Commercial" : "Domestic"}
          </button>
        );
      })}
    </div>
  );
}
