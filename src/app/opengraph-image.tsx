import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { business } from "@/lib/content/business";

/**
 * The share card. Treated as an ad, not a screenshot of the page — a shrunk
 * hero screenshot is illegible at the ~260px width a link preview actually
 * renders at in WhatsApp, Slack and iMessage, which is where a trade
 * business's links really get passed around.
 *
 * FONTS. next/font gives no runtime handle on the binaries it downloads, and
 * next/og ships exactly one face (Noto Sans Regular) — so a plain
 * `fontWeight: 800` here silently renders light, which reads as a fashion
 * label rather than a contractor. Two static instances are therefore checked
 * in at src/assets/fonts and read from disk at render time:
 *
 *   archivo-expanded-800.ttf — Archivo at wdth 125 / wght 800, i.e. exactly
 *     the "Archivo Expanded" the design system dials the variable font to.
 *   martian-mono-500.ttf     — the micro-label face, same as .font-mono-label.
 *
 * Read from disk, not fetched, so neither the build nor a request depends on
 * Google Fonts being reachable. If the read fails for any reason the card
 * still renders in next/og's bundled face rather than 500-ing — a plain card
 * beats a broken link preview.
 *
 * This route uses no dynamic APIs, so Next prerenders the PNG at build time
 * and the font read happens on the build machine, where src/ is present. If
 * `output: "standalone"` is ever turned on in next.config.ts, add
 * `outputFileTracingIncludes` for src/assets/fonts so the .ttf files are
 * still traced into the deployed bundle.
 */

export const alt =
  "Marmion Building Services — mechanical, electrical and plumbing contractor, Tamworth, Staffordshire";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Hardcoded, not `var(--…)`: Satori resolves no CSS custom properties.
const INK = "#0b0e14";
const PAPER = "#f7f6f3";
const FLAME = "#1f5fe0";
const COPPER = "#a6613c"; // hairline rules only
const COPPER_BRIGHT = "#c87a4e"; // copper as TEXT on ink — the legible one
const STEEL_DIM = "#98a1ad";

const DISPLAY = "Archivo Expanded";
const MONO = "Martian Mono";

// Three towns only. Martian Mono is a wide face and the coverage line has to
// share its row with the division label — five towns wraps and collides.
const COVERAGE_SHOWN = 3;
const shown = business.coverage.slice(0, COVERAGE_SHOWN);
const remaining = business.coverage.length - shown.length;
const coverageLine =
  shown.join(" · ").toUpperCase() + (remaining > 0 ? ` · +${remaining} MORE` : "");

async function loadFonts() {
  try {
    const dir = join(process.cwd(), "src", "assets", "fonts");
    const [display, mono] = await Promise.all([
      readFile(join(dir, "archivo-expanded-800.ttf")),
      readFile(join(dir, "martian-mono-500.ttf")),
    ]);
    return [
      { name: DISPLAY, data: display, weight: 800 as const, style: "normal" as const },
      { name: MONO, data: mono, weight: 500 as const, style: "normal" as const },
    ];
  } catch (error) {
    console.error("[opengraph-image] brand fonts unavailable, falling back", error);
    return undefined;
  }
}

/** The three-blade flame mark, same geometry as ui/docket-fallback-art.tsx. */
function FlameMark() {
  const blade =
    "M0 -34C6 -18 16 -10 16 6C16 22 4 32 0 34C-4 32 -16 22 -16 6C-16 -10 -6 -18 0 -34Z";
  return (
    <svg width="104" height="110" viewBox="0 0 80 80" style={{ marginLeft: 22, marginBottom: 10 }}>
      <g fill={FLAME}>
        <path opacity="0.7" transform="translate(13,54) scale(0.38)" d={blade} />
        <path opacity="0.7" transform="translate(67,54) scale(0.38)" d={blade} />
        <path transform="translate(40,42) scale(0.66)" d={blade} />
      </g>
    </svg>
  );
}

export default async function OpengraphImage() {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "60px 72px",
          fontFamily: MONO,
          position: "relative",
        }}
      >
        {/* Drawing-sheet frame — one hairline, offset from the trim edge. */}
        <div
          style={{
            position: "absolute",
            top: 26,
            left: 26,
            right: 26,
            bottom: 26,
            border: `1px solid ${COPPER}`,
            opacity: 0.5,
            display: "flex",
          }}
        />

        {/* Header row — spec-sheet metadata */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 17,
            letterSpacing: 3,
            color: COPPER_BRIGHT,
          }}
        >
          <div style={{ display: "flex" }}>MECHANICAL · ELECTRICAL · PLUMBING</div>
          <div style={{ display: "flex", color: STEEL_DIM }}>TAMWORTH · STAFFORDSHIRE</div>
        </div>

        {/* Wordmark block */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div
              style={{
                display: "flex",
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 134,
                letterSpacing: -2,
                lineHeight: 1,
                color: PAPER,
              }}
            >
              MARMION
            </div>
            <FlameMark />
          </div>

          <div style={{ display: "flex", width: "100%", height: 1, background: COPPER, marginTop: 24 }} />

          <div style={{ display: "flex", marginTop: 24, fontSize: 27, letterSpacing: 11, color: PAPER }}>
            BUILDING SERVICES
          </div>
        </div>

        {/* Coverage line */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 16,
            letterSpacing: 2,
            color: STEEL_DIM,
          }}
        >
          <div style={{ display: "flex" }}>{coverageLine}</div>
          <div style={{ display: "flex", color: COPPER_BRIGHT }}>COMMERCIAL / DOMESTIC</div>
        </div>
      </div>
    ),
    { ...size, ...(fonts ? { fonts } : {}) }
  );
}
