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
 */
export function Placeholder({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono-label align-middle"
      style={{
        borderColor: "var(--amber)",
        color: "var(--amber)",
        background: "var(--ink)",
        borderRadius: "var(--radius)",
        letterSpacing: "0.08em",
      }}
      role="note"
      aria-label={`Placeholder: ${label} not yet confirmed`}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" fill="none">
        <path d="M5 0L10 10H0L5 0Z" fill="currentColor" fillOpacity="0.9" />
      </svg>
      PLACEHOLDER: {label}
    </span>
  );
}

/** Renders `value` if present, otherwise the amber placeholder chip. */
export function FactOrPlaceholder({
  value,
  label,
}: {
  value: string | null | undefined;
  label: string;
}) {
  if (value) return <>{value}</>;
  return <Placeholder label={label} />;
}
