/**
 * Renders a visible, unmissable marker for any fact the brief forbids
 * inventing (§17 of the master build prompt). Never render a guessed value in
 * its place — render this instead, and log the gap in CONTENT_NEEDED.md.
 *
 * Always rendered on a fixed dark chip background (not the surrounding page
 * background) so amber-on-dark contrast (8.17:1) holds regardless of whether
 * the chip sits on a light or dark section — amber text directly on --paper
 * only reaches 2.19:1, well below AA.
 *
 * WHAT THE READER SEES
 * The chip says "To be confirmed", never the internal field name. It used to
 * print `PLACEHOLDER: ICO REGISTRATION NUMBER` in non-compact mode, which put
 * nineteen developer tokens into public copy — including the privacy notice
 * of a site that takes card payments. The internal label is still carried in
 * `title`, `aria-label` and a `data-placeholder` attribute, so the audit trail
 * survives in full and can still be swept for programmatically:
 *
 *     document.querySelectorAll('[data-placeholder]')
 *
 * `compact` renders a short "TBC" badge for use inline in a stat grid or a
 * table cell, where a mono label already sits right beside the chip and the
 * longer wording would wrap into a wall of amber text.
 */
export function Placeholder({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <span
      /* `whitespace-nowrap` suits the short badge; the longer form has to be
         allowed to wrap, or a narrow column pushes the layout wider than the
         viewport. */
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono-label align-middle ${
        compact ? "whitespace-nowrap" : ""
      }`}
      style={{
        borderColor: "var(--amber)",
        color: "var(--amber)",
        background: "var(--ink)",
        borderRadius: "var(--radius)",
        letterSpacing: "0.08em",
      }}
      role="note"
      data-placeholder={label}
      title={`${label} — not yet confirmed`}
      aria-label={`${label} — to be confirmed`}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" fill="none" style={{ flexShrink: 0 }}>
        <path d="M5 0L10 10H0L5 0Z" fill="currentColor" fillOpacity="0.9" />
      </svg>
      {compact ? "TBC" : "To be confirmed"}
    </span>
  );
}

/**
 * An audit marker that renders nothing a customer can see.
 *
 * Not inventing a missing fact and *advertising* that it is missing are two
 * different decisions, and the brief only requires the first. Eleven amber
 * warning triangles on the homepage — four in the footer of every page —
 * told every visitor the business could not name its own insurer, and read
 * as an unfinished site rather than an honest one.
 *
 * This keeps the full audit trail: the element is still in the DOM, still
 * carries `data-placeholder`, and is still found by the sweep the team runs:
 *
 *     document.querySelectorAll('[data-placeholder]')
 *
 * It is simply `hidden`, so nothing is claimed and nothing is confessed. Use
 * it wherever the surrounding copy can carry the gap on its own; keep the
 * visible `Placeholder` chip for internal/QA surfaces where the gap itself is
 * the information.
 */
export function PlaceholderMarker({ label }: { label: string }) {
  return <span hidden data-placeholder={label} data-placeholder-omitted="true" />;
}

/**
 * Renders `value` if present, otherwise a marker for the missing fact.
 *
 * `missing` picks what a reader sees when the value is absent:
 * - `"omit"` (default) — nothing visible; the fact simply isn't mentioned.
 * - `"fallback"` — the supplied `fallback` node, for when there is something
 *   true and useful to say in place of the fact.
 * - `"chip"` — the amber "To be confirmed" chip, for internal surfaces.
 */
export function FactOrPlaceholder({
  value,
  label,
  compact = false,
  missing = "omit",
  fallback = null,
}: {
  value: string | null | undefined;
  label: string;
  compact?: boolean;
  missing?: "omit" | "fallback" | "chip";
  fallback?: React.ReactNode;
}) {
  if (value) return <>{value}</>;
  if (missing === "chip") return <Placeholder label={label} compact={compact} />;
  if (missing === "fallback") {
    return (
      <>
        {fallback}
        <PlaceholderMarker label={label} />
      </>
    );
  }
  return <PlaceholderMarker label={label} />;
}
