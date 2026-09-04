/**
 * Generated fallback for a Docket with no photography yet. Reads as a
 * technical drawing rather than a stock-photo stand-in. Never swap this for
 * stock photography; swap it for a real photo.
 *
 * Takes a `seed` so a grid of dockets does not repeat one identical drawing
 * four times over — each seed picks a different pipe run, a different valve
 * and fitting arrangement, and a different sheet number. Same visual
 * language, different drawing, which is how a real set of job sheets looks.
 */

type Run = { path: string; nodes: [number, number][]; label: string };

const RUNS: Run[] = [
  {
    path: "M72 292 H232 V168 H392 V96 H568",
    nodes: [
      [72, 292],
      [232, 168],
      [568, 96],
    ],
    label: "FLOW / RETURN",
  },
  {
    path: "M72 96 H196 V264 H352 V152 H568",
    nodes: [
      [196, 96],
      [352, 264],
      [568, 152],
    ],
    label: "PRIMARY CIRCUIT",
  },
  {
    path: "M72 200 H160 V72 H408 V296 H568",
    nodes: [
      [160, 200],
      [408, 72],
      [568, 296],
    ],
    label: "GAS SUPPLY",
  },
  {
    path: "M72 128 H288 V232 H456 V88 H568",
    nodes: [
      [288, 128],
      [456, 232],
      [568, 88],
    ],
    label: "COLD MAIN",
  },
];

export function DocketFallbackArt({
  variant,
  seed = 0,
}: {
  variant: "domestic" | "commercial";
  seed?: number;
}) {
  const run = RUNS[Math.abs(seed) % RUNS.length];
  const gridStroke = variant === "commercial" ? "var(--flame-glow)" : "var(--copper)";
  const gridOffset = (seed % 2) * 40;
  const sheet = `SHT ${String((Math.abs(seed) % RUNS.length) + 1).padStart(2, "0")}/04`;

  return (
    <svg
      viewBox="0 0 640 360"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="640" height="360" fill="var(--ink)" />

      <g opacity="0.3" stroke={gridStroke} strokeWidth="1">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 80 + gridOffset} y1="0" x2={i * 80 + gridOffset} y2="360" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 90} x2="640" y2={i * 90} />
        ))}
      </g>

      <g stroke="var(--flame)" strokeWidth="2" fill="none" opacity="0.9">
        <path d={run.path} />
        {run.nodes.map(([cx, cy], i) =>
          i % 2 === 0 ? (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="var(--flame)" />
          ) : (
            <rect key={`${cx}-${cy}`} x={cx - 5} y={cy - 5} width="10" height="10" fill="var(--flame)" />
          )
        )}
      </g>

      {/* Three-blade flame mark, positioned off the run so it never sits on a line. */}
      <g transform={`translate(${300 + (seed % 3) * 26},${186 - (seed % 2) * 22}) scale(1.1)`}>
        <path
          d="M0 -34C6 -18 16 -10 16 6C16 22 4 32 0 34C-4 32 -16 22 -16 6C-16 -10 -6 -18 0 -34Z"
          fill="var(--flame)"
          opacity="0.85"
        />
      </g>

      <text x="24" y="336" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.6" fill="var(--steel)">
        {run.label}
      </text>
      <text
        x="616"
        y="336"
        textAnchor="end"
        fontFamily="var(--font-mono)"
        fontSize="11"
        letterSpacing="1.6"
        fill="var(--steel)"
      >
        {sheet}
      </text>
    </svg>
  );
}
