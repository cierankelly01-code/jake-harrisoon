import { Figtree } from "next/font/google";

/**
 * One family, weight contrast. Figtree at 800 with tight tracking does the
 * headline work; 400/500 carries body and UI. Loading a single variable
 * font keeps the font payload small and avoids the "designer" tell of a
 * second display face.
 */
export const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const fontVariables = figtree.variable;
