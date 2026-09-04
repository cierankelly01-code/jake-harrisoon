"use client";

import { usePathname, useRouter } from "next/navigation";
import { useDivision } from "./division-provider";
import { track } from "@/lib/analytics";
import { DOMESTIC_ONLY_ROUTES, COMMERCIAL_ONLY_ROUTES } from "@/lib/division-shared";

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
  const pathname = usePathname();
  const router = useRouter();
  const isDark = tone === "dark";
  // On /commercial, /domestic, and every single-division page (the wizard,
  // care plans, capability, tenders...) the surrounding page content can't
  // itself react to the toggle — lib/division.ts forces these server-side
  // for exactly that reason. Switching here navigates to the general /
  // commercial or /domestic homepage instead of silently swapping the
  // header under content that would then contradict it (the bug a fresh
  // reviewer caught: the toggle showed "Commercial" active while the page
  // was the domestic boiler-quote wizard). Everywhere else (the
  // cookie-driven `/` and division-neutral pages like /contact) the
  // existing no-reload swap is unchanged.
  const routeDivision =
    pathname === "/commercial" || COMMERCIAL_ONLY_ROUTES.some((route) => pathname.startsWith(route))
      ? "commercial"
      : pathname === "/domestic" || DOMESTIC_ONLY_ROUTES.some((route) => pathname.startsWith(route))
        ? "domestic"
        : null;

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
              if (routeDivision && opt !== routeDivision) router.push(`/${opt}`);
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
