import { MonoStat } from "@/components/ui/mono-stat";
import { business } from "@/lib/content/business";

/** Honest numbers only — placeholder anything unconfirmed. §8.1.4 */
export function CapabilitySnapshot() {
  return (
    <section
      className="mx-auto max-w-6xl px-6"
      style={{ paddingTop: "var(--space-section-mobile)", paddingBottom: "var(--space-section-mobile)" }}
    >
      <span className="font-mono-label" style={{ color: "var(--copper)" }}>
        Capability
      </span>
      <div className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
        <MonoStat label="Sectors served" value="12" />
        <MonoStat label="Contracts live" value={null} />
        <MonoStat label="Sites maintained" value={null} />
        <MonoStat label="Response SLA" value={business.responseSla} />
        <MonoStat label="Coverage radius" value={`${business.coverage.length} towns`} />
      </div>
    </section>
  );
}
