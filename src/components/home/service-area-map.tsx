import { business } from "@/lib/content/business";

/**
 * A simple, honest map: Tamworth in the middle, the towns we cover around
 * it. Positions are approximate relative bearings, not survey data.
 */
const NODES: { name: string; x: number; y: number }[] = [
  { name: "Burton", x: 320, y: 58 },
  { name: "Cannock", x: 96, y: 250 },
  { name: "Burntwood", x: 196, y: 190 },
  { name: "Lichfield", x: 288, y: 142 },
  { name: "Walsall", x: 140, y: 330 },
  { name: "Tamworth", x: 372, y: 214 },
  { name: "Polesworth", x: 470, y: 158 },
  { name: "Kingsbury", x: 436, y: 288 },
  { name: "Atherstone", x: 548, y: 250 },
  { name: "Nuneaton", x: 588, y: 306 },
  { name: "Coleshill", x: 396, y: 348 },
  { name: "Sutton Coldfield", x: 292, y: 372 },
  { name: "Birmingham", x: 214, y: 424 },
  { name: "Solihull", x: 336, y: 442 },
  { name: "Coventry", x: 520, y: 424 },
];

const VIEW_W = 700;
const VIEW_H = 500;
const FLIP_X = 400;

export function ServiceAreaMap() {
  const hub = NODES.find((n) => n.name === "Tamworth") ?? NODES[0];
  const hubTown = business.base.split(",")[0];

  return (
    <section aria-labelledby="coverage-heading" className="section--tight" style={{ background: "var(--paper-raised)" }}>
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-5">
          <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
            Where we work
          </span>
          <h2 id="coverage-heading" className="font-display mt-3 text-3xl" style={{ color: "var(--ink)" }}>
            {business.coverageCore.length} towns same-day,{" "}
            {business.coverage.length - business.coverageCore.length} more booked in.
          </h2>
          <p className="mt-4 text-base" style={{ color: "var(--steel)" }}>
            The two-hour arrival window is a promise we only make where we can keep it. These are
            the towns inside it:
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {business.coverageCore.map((town) => (
              <li key={town} className="chip" style={{ background: "#fff" }}>
                {town}
              </li>
            ))}
          </ul>

          {/* Everything else we cover, stated separately. Listing Coventry
              and Birmingham under a two-hour promise was a claim we cannot
              keep — they are ~30 and ~20 miles out. They are still served;
              the window just is not promised with them. */}
          <p className="mt-6 text-base" style={{ color: "var(--steel)" }}>
            We also work across{" "}
            {business.coverage
              .filter((town) => !(business.coverageCore as readonly string[]).includes(town))
              .join(", ")
              .replace(/, ([^,]*)$/, " and $1")}
            , booked in rather than same-day. Just outside all of it? Ask anyway and we&rsquo;ll
            tell you straight.
          </p>
        </div>

        <div className="card reveal-wipe hidden overflow-hidden md:block lg:col-span-7" style={{ background: "#fff" }}>
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-auto w-full"
            role="img"
            aria-label={`Map of the service area, centred on ${hubTown}, covering ${business.coverage.join(", ")}.`}
          >
            <circle cx={hub.x} cy={hub.y} r="230" fill="var(--flame-tint)" opacity="0.7" />
            <circle cx={hub.x} cy={hub.y} r="150" fill="var(--flame-tint)" />
            {NODES.filter((n) => n.name !== "Tamworth").map((n) => (
              <line key={n.name} x1={hub.x} y1={hub.y} x2={n.x} y2={n.y} stroke="var(--flame)" strokeWidth="1.5" opacity="0.18" />
            ))}
            {NODES.map((n) => {
              const isHub = n.name === "Tamworth";
              const flip = n.x > FLIP_X && !isHub;
              return (
                <g key={n.name}>
                  <circle cx={n.x} cy={n.y} r={isHub ? 9 : 5} fill={isHub ? "var(--flame)" : "#fff"} stroke="var(--flame)" strokeWidth="2" />
                  <text
                    x={isHub ? n.x : flip ? n.x - 12 : n.x + 12}
                    y={n.y + (isHub ? -14 : 4)}
                    textAnchor={isHub ? "middle" : flip ? "end" : "start"}
                    fontFamily="var(--font-body)"
                    fontSize={isHub ? 16 : 14}
                    fontWeight={isHub ? 800 : 600}
                    fill="var(--ink)"
                  >
                    {n.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
