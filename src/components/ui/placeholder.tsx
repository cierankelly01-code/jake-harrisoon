/**
 * Renders a visible, unmissable marker for any fact the brief forbids
 * inventing (§17 of the master build prompt). Never render a guessed
 * value in its place — render this instead, and log the gap in
 * CONTENT_NEEDED.md.
 *
 * Always rendered on a fixed dark chip background (not the surrounding
 * page background) so amber-on-dark contrast (8.17:1) holds regardless
 * of whether the chip sits on a light or dark section — amber text
 * directly on --paper only reaches 2.19:1, well below AA.
 *
 * `compact` renders a short "TBC" badge instead of repeating
 * "PLACEHOLDER: LABEL" in full — use it wherever a mono label already
 * sits right next to the chip (MonoStat, the utility bar, footer NAP
 * lines) so a stat grid doesn't turn into a wall of wrapped amber text.
 * The full label is still present as the title/aria-label either way —
 * nothing here removes the audit trail, it just stops repeating it on
 * screen where context already supplies it.
 */
export function Placeholder({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap border px-2 py-0.5 font-mono-label align-middle"
      style={{
        borderColor: "var(--amber)",
        color: "var(--amber)",
        background: "var(--ink)",
        borderRadius: "var(--radius)",
        letterSpacing: "0.08em",
      }}
      role="note"
      title={`Placeholder: ${label} not yet confirmed`}
      aria-label={`Placeholder: ${label} not yet confirmed`}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" fill="none" style={{ flexShrink: 0 }}>
        <path d="M5 0L10 10H0L5 0Z" fill="currentColor" fillOpacity="0.9" />
      </svg>
      {compact ? "TBC" : `PLACEHOLDER: ${label}`}
    </span>
  );
}

/** Renders `value` if present, otherwise the amber placeholder chip. */
export function FactOrPlaceholder({
  value,
  label,
  compact = false,
}: {
  value: string | null | undefined;
  label: string;
  compact?: boolean;
}) {
  if (value) return <>{value}</>;
  return <Placeholder label={label} compact={compact} />;
}
