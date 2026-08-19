import { business } from "@/lib/content/business";

const ROADMAP_TARGETS = [
  "SSIP (CHAS / SafeContractor / Constructionline)",
  "Constructionline Gold",
  "Gas Safe commercial",
  "WaterSafe",
  "F-Gas",
  "G3 unvented",
];

/** Only ever render accreditations the business actually holds — see §17. */
export function AccreditationWall() {
  const hasHeld = business.accreditationsHeld.length > 0;

  return (
    <section
      className="mx-auto max-w-6xl px-6"
      style={{ paddingBottom: "var(--space-section-mobile)" }}
    >
      <span className="font-mono-label" style={{ color: "var(--copper)" }}>
        Accreditations
      </span>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="border p-6" style={{ borderColor: "var(--border-hairline)", borderRadius: "var(--radius)" }}>
          <span className="font-mono-label" style={{ color: "var(--steel)" }}>
            Held
          </span>
          <p className="mt-3 text-sm" style={{ color: "var(--steel)" }}>
            {hasHeld ? business.accreditationsHeld.join(" · ") : "None recorded yet — see ACCREDITATION_ROADMAP.md."}
          </p>
        </div>
        <div className="border p-6" style={{ borderColor: "var(--border-hairline)", borderRadius: "var(--radius)" }}>
          <span className="font-mono-label" style={{ color: "var(--steel)" }}>
            In progress
          </span>
          <p className="mt-3 text-sm" style={{ color: "var(--steel)" }}>
            {ROADMAP_TARGETS.join(" · ")}
          </p>
        </div>
      </div>
    </section>
  );
}
