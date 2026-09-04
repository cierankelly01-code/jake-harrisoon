import { PlaceholderMarker } from "./placeholder";

/**
 * The signature numerals pattern: a mono uppercase label above a large
 * mono value. Used for insurance values, SLAs, contract counts, prices,
 * postcodes, warranty years — anything that should read like a job docket.
 */
export function MonoStat({
  label,
  value,
  tone = "light",
}: {
  label: string;
  value: string | null;
  tone?: "light" | "dark";
}) {
  const muted = tone === "dark" ? "var(--steel-dim)" : "var(--steel)";
  const strong = tone === "dark" ? "var(--paper)" : "var(--ink)";

  // A stat with no number is not a stat. Rendering the label above an amber
  // "TBC" badge turned the /capability key-figures grid — the first thing a
  // PQQ scorer reads — into five warning triangles. The grid now shows only
  // the figures that exist and closes up around the ones that don't.
  if (!value) return <PlaceholderMarker label={label} />;

  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono-label" style={{ color: muted }}>
        {label}
      </span>
      <span
        className="font-mono text-2xl tabular-nums"
        style={{ color: strong }}
      >
        {value}
      </span>
    </div>
  );
}
