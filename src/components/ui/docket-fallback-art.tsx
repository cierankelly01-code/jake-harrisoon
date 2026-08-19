/**
 * Generated fallback for a Docket with no photography yet. Reads as a
 * technical drawing, not a stock-photo stand-in — a grid of pipe-run
 * style lines with the flame mark, in the commercial dark palette.
 * Never swap this for stock photography; swap it for a real photo.
 */
export function DocketFallbackArt({ variant }: { variant: "domestic" | "commercial" }) {
  const stroke = variant === "commercial" ? "var(--flame-glow)" : "var(--copper)";
  return (
    <svg
      viewBox="0 0 640 360"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="640" height="360" fill="var(--ink)" />
      <g opacity="0.35" stroke={stroke} strokeWidth="1">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 80} y1="0" x2={i * 80} y2="360" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 90} x2="640" y2={i * 90} />
        ))}
      </g>
      <g stroke="var(--flame)" strokeWidth="2" fill="none" opacity="0.9">
        <path d="M80 280 H240 V160 H400" />
        <path d="M400 160 V90 H560" />
        <circle cx="80" cy="280" r="5" fill="var(--flame)" />
        <circle cx="560" cy="90" r="5" fill="var(--flame)" />
      </g>
      {/* Three-blade flame mark */}
      <g transform="translate(300,190) scale(1.1)">
        <path
          d="M0 -34C6 -18 16 -10 16 6C16 22 4 32 0 34C-4 32 -16 22 -16 6C-16 -10 -6 -18 0 -34Z"
          fill="var(--flame)"
          opacity="0.85"
        />
      </g>
    </svg>
  );
}
