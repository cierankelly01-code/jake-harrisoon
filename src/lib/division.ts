import "server-only";
import { cookies } from "next/headers";
import { DIVISION_COOKIE, type Division } from "@/lib/division-shared";

/** Server-side read for the initial render — commercial is the default state (§4). */
export async function getInitialDivision(): Promise<Division> {
  const store = await cookies();
  const value = store.get(DIVISION_COOKIE)?.value;
  return value === "domestic" ? "domestic" : "commercial";
}
