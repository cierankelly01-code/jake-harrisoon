import { business } from "@/lib/content/business";

/**
 * Hand-built schematic — not a literal geographic projection, and
 * deliberately not a Google Maps iframe (§8.1.10). Tamworth sits at the
 * hub with every covered town wired off it, mono-labelled, echoing the
 * pipe-run motif from the Docket fallback art.
 */
const NODES: { name: string; x: number; y: number }[] = [
  { name: "Cannock", x: 90, y: 260 },
  { name: "Walsall", x: 150, y: 330 },
  { name: "Burntwood", x: 210, y: 200 },
  { name: "Lichfield", x: 300, y: 150 },
  { name: "Tamworth", x: 380, y: 210 }, // hub
  { name: "Polesworth", x: 470, y: 160 },
  { name: "Kingsbury", x: 430, y: 280 },
  { name: "Atherstone", x: 540, y: 220 },
  { name: "Nuneaton", x: 590, y: 300 },
  { name: "Coleshill", x: 400, y: 340 },
  { name: "Sutton Coldfield", x: 300, y: 360 },
  { name: "Birmingham", x: 230, y: 420 },
  { name: "Solihull", x: 340, y: 440 },
  { name: "Coventry", x: 520, y: 420 },
  { name: "Burton", x: 320, y: 60 },
];

export function ServiceAreaMap() {
  const hub = NODES.find((n) => n.name === "Tamworth")!;

  return (
    <section
      className="mx-auto max-w-6xl px-6"
      style={{ paddingBottom: "var(--space-section-mobile)" }}
    >
      <span className="font-mono-label" style={{ color: "var(--copper)" }}>
        Coverage
      </span>
      <div
        className="mt-6 overflow-hidden border"
        style={{ borderColor: "var(--border-hairline-dark)", borderRadius: "var(--radius)", background: "var(--ink)" }}
      >
        <svg viewBox="0 0 640 480" className="h-auto w-full" role="img" aria-label={`Service area covering ${business.coverage.join(", ")}`}>
          {NODES.filter((n) => n.name !== "Tamworth").map((n) => (
            <line
              key={n.name}
              x1={hub.x}
              y1={hub.y}
              x2={n.x}
              y2={n.y}
              stroke="var(--copper)"
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
          {NODES.map((n) => (
            <g key={n.name}>
              <circle
                cx={n.x}
                cy={n.y}
                r={n.name === "Tamworth" ? 7 : 4}
                fill={n.name === "Tamworth" ? "var(--flame)" : "var(--flame-glow)"}
              />
              <text
                x={n.x + 10}
                y={n.y + 4}
                fontFamily="var(--font-mono)"
                fontSize="11"
                letterSpacing="0.05em"
                fill="var(--paper)"
              >
                {n.name.toUpperCase()}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
