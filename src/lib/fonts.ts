import { Archivo, Instrument_Sans, Martian_Mono } from "next/font/google";

/**
 * Display face. Archivo is a variable Google Font with a real width axis
 * (62–125 wdth), so "Archivo Expanded" from the brand spec is produced by
 * dialling the variable font to its wide end via --font-archivo-wdth in
 * tokens.css, rather than substituting a different family. See
 * HANDOFF.md "Fonts" for the rationale.
 */
export const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  weight: ["400", "500"],
  display: "swap",
});

export const martianMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const fontVariables = `${archivo.variable} ${instrumentSans.variable} ${martianMono.variable}`;
