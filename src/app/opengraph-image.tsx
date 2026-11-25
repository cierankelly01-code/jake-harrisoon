import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { business } from "@/lib/content/business";
import { COMMERCIAL_ENABLED } from "@/lib/division-shared";
import { FROM_PRICE_GBP } from "@/lib/quote/pricing";

/**
 * The share card, treated as an ad: one plain promise, the from-price, and
 * where we are. Fonts are the same Figtree the site uses; if the files are
 * missing the renderer falls back to its default sans rather than failing.
 */
export const alt = COMMERCIAL_ENABLED
  ? "Hartson Heating — mechanical, electrical and plumbing contractor, Tamworth, Staffordshire"
  : "Hartson Heating — fixed-price boiler installation, Tamworth, Staffordshire";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0b0f0d";
const FLAME = "#2fd37a";
const STEEL_DIM = "#a6b3ac";
const FONT = "Figtree";

async function loadFonts() {
  try {
    const dir = join(process.cwd(), "src", "assets", "fonts");
    const [bold, medium] = await Promise.all([readFile(join(dir, "figtree-800.woff")), readFile(join(dir, "figtree-500.woff"))]);
    return [
      { name: FONT, data: bold, weight: 800 as const, style: "normal" as const },
      { name: FONT, data: medium, weight: 500 as const, style: "normal" as const },
    ];
  } catch (error) {
    console.error("[opengraph-image] brand fonts unavailable, falling back", error);
    return undefined;
  }
}

export default async function OpengraphImage() {
  const fonts = await loadFonts();
  const headline = COMMERCIAL_ENABLED
    ? "Mechanical contracting with the paperwork done first."
    : "New boiler installation at a fixed price.";
  const sub = COMMERCIAL_ENABLED
    ? "PQQ documentation back within 24 hours · RAMS before every mobilisation"
    : `From £${FROM_PRICE_GBP.toLocaleString("en-GB")} fully fitted · Gas Safe registered · Price fixed before we start`;

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
          padding: "64px 72px",
          fontFamily: FONT,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -160,
            top: -160,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: FLAME,
            opacity: 0.22,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: FLAME,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="26" height="30" viewBox="0 0 18 20" fill="none">
              <path
                d="M9 1c1 3.2 4.8 5 4.8 9.6A4.8 4.8 0 019 15.4a4.8 4.8 0 01-4.8-4.8C4.2 7.4 6.6 6.3 6.6 3.6 7.6 4.6 8 5.6 8 6.6 8.6 5 9 3.2 9 1z"
                fill="#fff"
              />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>Hartson</div>
            <div style={{ display: "flex", fontSize: 15, fontWeight: 500, color: STEEL_DIM, letterSpacing: 3 }}>
              HEATING
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, color: "#fff", lineHeight: 1.02, letterSpacing: -2 }}>
            {headline}
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 26, fontWeight: 500, color: STEEL_DIM }}>{sub}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 500, color: STEEL_DIM }}>
          <div style={{ display: "flex" }}>Based in {business.base}</div>
          <div style={{ display: "flex" }}>{business.coverage.length} towns across the West Midlands</div>
        </div>
      </div>
    ),
    { ...size, ...(fonts ? { fonts } : {}) }
  );
}
