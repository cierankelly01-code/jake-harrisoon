"use client";

import { useDivision } from "./division-provider";

export function DivisionToggle({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { division, setDivision } = useDivision();
  const isDark = tone === "dark";

  return (
    <div
      role="group"
      aria-label="Switch between Commercial and Domestic"
      className="inline-flex border p-0.5 font-mono-label"
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
            onClick={() => setDivision(opt)}
            className="px-3 py-2 transition-colors"
            style={{
              borderRadius: "var(--radius)",
              background: active ? "var(--flame)" : "transparent",
              color: active ? "var(--paper)" : isDark ? "var(--steel-dim)" : "var(--steel)",
              transitionDuration: "var(--duration-micro)",
            }}
          >
            {opt === "commercial" ? "Commercial" : "Domestic"}
          </button>
        );
      })}
    </div>
  );
}
