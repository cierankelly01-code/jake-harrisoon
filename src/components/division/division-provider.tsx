"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { DIVISION_COOKIE, type Division } from "@/lib/division-shared";

type DivisionContextValue = {
  division: Division;
  setDivision: (next: Division) => void;
};

const DivisionContext = createContext<DivisionContextValue | null>(null);

/**
 * Wraps the whole app. Swaps hero, CTAs, proof and services between
 * Commercial and Domestic with no page reload, and persists the choice
 * in a cookie so the server renders the right default on the next visit.
 * Commercial is the default state (§4 of the master brief).
 */
export function DivisionProvider({
  initialDivision,
  children,
}: {
  initialDivision: Division;
  children: React.ReactNode;
}) {
  const [division, setDivisionState] = useState<Division>(initialDivision);

  const setDivision = useCallback((next: Division) => {
    setDivisionState(next);
    document.cookie = `${DIVISION_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }, []);

  const value = useMemo(() => ({ division, setDivision }), [division, setDivision]);

  return <DivisionContext.Provider value={value}>{children}</DivisionContext.Provider>;
}

export function useDivision() {
  const ctx = useContext(DivisionContext);
  if (!ctx) throw new Error("useDivision must be used within DivisionProvider");
  return ctx;
}
