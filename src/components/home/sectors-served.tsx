export const SECTORS = [
  "Main contractors",
  "Housing associations",
  "Local authority",
  "Healthcare",
  "Education",
  "Hospitality",
  "Retail",
  "Offices",
  "Care homes",
  "Leisure",
  "Industrial",
  "Letting agents",
];

export function SectorsServed() {
  return (
    <section
      className="mx-auto max-w-6xl px-6"
      style={{ paddingBottom: "var(--space-section-mobile)" }}
    >
      <span className="font-mono-label" style={{ color: "var(--copper)" }}>
        Sectors served
      </span>
      <div className="mt-6 grid grid-cols-2 gap-px border sm:grid-cols-4" style={{ borderColor: "var(--border-hairline)", background: "var(--border-hairline)" }}>
        {SECTORS.map((sector) => (
          <div
            key={sector}
            className="px-4 py-6 font-mono-label"
            style={{ background: "var(--surface)", color: "var(--steel)" }}
          >
            {sector}
          </div>
        ))}
      </div>
    </section>
  );
}
