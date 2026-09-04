import { business } from "@/lib/content/business";
import { Counter } from "@/components/ui/counter";

/**
 * Hand-built schematic — not a literal geographic projection, and
 * deliberately not a Google Maps iframe (§8.1.10). Tamworth sits at the hub
 * with every covered town wired off it, mono-labelled, echoing the pipe-run
 * motif from the Docket art.
 *
 * Labels flip to the inside of the frame for nodes on the right-hand half,
 * so nothing runs past the viewBox edge — the previous version clipped
 * NUNEATON and very nearly clipped ATHERSTONE at every width.
 *
 * Below ~640px the drawing is decorative and the named-town list carries the
 * information instead: 11px type inside a 720-wide viewBox is unreadable on
 * a phone, and the town names are what matters for local search anyway.
 */
const NODES: { name: string; x: number; y: number }[] = [
  { name: "Burton", x: 320, y: 58 },
  { name: "Cannock", x: 96, y: 250 },
  { name: "Burntwood", x: 196, y: 190 },
  { name: "Lichfield", x: 288, y: 142 },
  { name: "Walsall", x: 140, y: 330 },
  { name: "Tamworth", x: 372, y: 214 }, // hub
  { name: "Polesworth", x: 470, y: 158 },
  { name: "Kingsbury", x: 436, y: 288 },
  { name: "Atherstone", x: 548, y: 216 },
  { name: "Nuneaton", x: 588, y: 306 },
  { name: "Coleshill", x: 396, y: 348 },
  { name: "Sutton Coldfield", x: 292, y: 372 },
  { name: "Birmingham", x: 214, y: 424 },
  { name: "Solihull", x: 336, y: 442 },
  { name: "Coventry", x: 520, y: 424 },
];

const VIEW_W = 700;
const VIEW_H = 500;
/** Right of this, labels sit to the left of their node and read right-to-left. */
const FLIP_X = 400;

export function ServiceAreaMap() {
  // Falls back to the first node rather than asserting non-null: renaming the
  // hub town in NODES would otherwise crash the homepage at `hub.x`.
  const hub = NODES.find((n) => n.name === "Tamworth") ?? NODES[0];

  return (
    <section
      aria-labelledby="coverage-heading"
      className="mx-auto max-w-[100rem] px-6"
      style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
    >
      <div className="grid gap-6 sm:gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <span className="section-index font-mono-label" data-index="07" style={{ color: "var(--copper-ink)" }}>
            Coverage
          </span>
          <h2 id="coverage-heading" className="font-display mt-4 text-3xl" style={{ color: "var(--ink)" }}>
            <Counter to={business.coverage.length} /> towns, worked from one base.
          </h2>
          <p className="mt-5 max-w-[40ch] text-base" style={{ color: "var(--steel)" }}>
            Everything runs out of {business.base}. That is deliberate — it is what makes a two-hour
            arrival window a real commitment rather than an aspiration. If you are outside this list,
            ask anyway; we will tell you straight whether we can cover you properly.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {business.coverage.map((town) => (
              <li
                key={town}
                className="font-mono-label border px-3 py-2"
                style={{
                  borderColor: "var(--border-hairline)",
                  color: "var(--ink)",
                  borderRadius: "var(--radius)",
                }}
              >
                {town}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="reveal-wipe hidden overflow-hidden border sm:block lg:col-span-8"
          style={{
            borderColor: "var(--border-hairline-dark)",
            borderRadius: "var(--radius)",
            background: "var(--ink)",
          }}
        >
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-auto w-full"
            role="img"
            aria-label={`Schematic of the service area, centred on ${business.base}, covering ${business.coverage.join(", ")}.`}
          >
            {NODES.filter((n) => n.name !== "Tamworth").map((n) => (
              <line
                key={n.name}
                x1={hub.x}
                y1={hub.y}
                x2={n.x}
                y2={n.y}
                stroke="var(--copper)"
                strokeWidth="1"
                opacity="0.45"
              />
            ))}
            {NODES.map((n) => {
              const isHub = n.name === "Tamworth";
              const flip = n.x > FLIP_X && !isHub;
              return (
                <g key={n.name}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={isHub ? 7 : 4}
                    fill={isHub ? "var(--flame)" : "var(--flame-glow)"}
                  />
                  {isHub && (
                    <circle cx={n.x} cy={n.y} r="14" fill="none" stroke="var(--flame)" strokeWidth="1" opacity="0.6" />
                  )}
                  <text
                    x={flip ? n.x - 10 : n.x + 10}
                    y={n.y + 4}
                    textAnchor={flip ? "end" : "start"}
                    fontFamily="var(--font-mono)"
                    fontSize="14"
                    letterSpacing="0.05em"
                    fill={isHub ? "var(--paper)" : "var(--steel-dim)"}
                  >
                    {n.name.toUpperCase()}
                  </text>
                </g>
              );
            })}
            <text
              x="28"
              y={VIEW_H - 24}
              fontFamily="var(--font-mono)"
              fontSize="13"
              letterSpacing="0.14em"
              fill="var(--copper-bright)"
            >
              SCHEMATIC — NOT TO SCALE
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
