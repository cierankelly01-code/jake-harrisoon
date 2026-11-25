"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateQuote, type CurrentSystem, type PropertyType } from "@/lib/quote/pricing";
import { track } from "@/lib/analytics";
import { Arrow } from "@/components/ui/icons";

/**
 * The homepage's one interactive moment: a four-tap estimate that runs the
 * real quote engine in the browser and hands the answers to the full wizard
 * (which restores them from the same localStorage key). No network, no JS
 * bundle beyond the pricing table, and without JS the button is a plain
 * link to /boiler-quote.
 */

const STORAGE_KEY = "marmion-boiler-quote";

const PROPERTY: { value: PropertyType; label: string }[] = [
  { value: "flat", label: "Flat" },
  { value: "terraced", label: "Terraced" },
  { value: "semi_detached", label: "Semi" },
  { value: "detached", label: "Detached" },
  { value: "bungalow", label: "Bungalow" },
];

const SYSTEMS: { value: CurrentSystem; label: string }[] = [
  { value: "combi", label: "Combi" },
  { value: "system", label: "System" },
  { value: "regular", label: "Regular" },
  { value: "back_boiler", label: "Back boiler" },
];

const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;

export function QuickPrice() {
  const router = useRouter();
  const [property, setProperty] = useState<PropertyType>("semi_detached");
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(1);
  const [system, setSystem] = useState<CurrentSystem>("combi");

  const tiers = useMemo(
    () => calculateQuote({ propertyType: property, bedrooms, bathrooms, currentSystem: system, movingLocation: false }),
    [property, bedrooms, bathrooms, system]
  );
  const recommended = tiers.find((t) => t.tier === "recommended") ?? tiers[1];
  const low = Math.min(...tiers.map((t) => t.priceLow));
  const high = Math.max(...tiers.map((t) => t.priceHigh));

  const continueToQuote = () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const saved = raw ? (JSON.parse(raw) as { quoteId?: string; answers?: Record<string, string> }) : {};
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          quoteId: saved.quoteId,
          answers: {
            ...(saved.answers ?? {}),
            propertyType: property,
            bedrooms: String(bedrooms),
            bathrooms: String(bathrooms),
            currentSystem: system,
          },
        })
      );
    } catch {
      /* private mode — the wizard just starts from scratch */
    }
    track("cta_click", { location: "quick_price", action: "continue" });
    router.push("/boiler-quote");
  };

  return (
    <div
      className="card relative overflow-hidden"
      style={{ boxShadow: "var(--shadow-card)", borderRadius: "var(--radius-lg)" }}
      aria-labelledby="quick-price-heading"
      role="region"
    >
      <div className="grid lg:grid-cols-12">
        <div className="p-6 sm:p-8 lg:col-span-8 lg:p-10">
          <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
            Instant estimate
          </span>
          <h2 id="quick-price-heading" className="font-display mt-2 text-2xl" style={{ color: "var(--ink)" }}>
            See roughly what a new boiler costs for your home
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--steel)" }}>
            Four quick taps, no details needed.
          </p>

          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <Group label="Property">
              {PROPERTY.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className="seg"
                  aria-pressed={property === p.value}
                  onClick={() => setProperty(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </Group>
            <Group label="Current boiler">
              {SYSTEMS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className="seg"
                  aria-pressed={system === s.value}
                  onClick={() => setSystem(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </Group>
            <Group label="Bedrooms">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="seg min-w-11"
                  aria-pressed={bedrooms === n}
                  onClick={() => setBedrooms(n)}
                >
                  {n === 5 ? "5+" : n}
                </button>
              ))}
            </Group>
            <Group label="Bathrooms">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="seg min-w-11"
                  aria-pressed={bathrooms === n}
                  onClick={() => setBathrooms(n)}
                >
                  {n === 3 ? "3+" : n}
                </button>
              ))}
            </Group>
          </div>
        </div>

        <div
          className="flex flex-col justify-between gap-6 p-6 sm:p-8 lg:col-span-4 lg:p-10"
          style={{ background: "var(--ink)", color: "#fff" }}
        >
          <div aria-live="polite">
            <span className="font-mono-label" style={{ color: "var(--copper-bright)" }}>
              Typical range, fully fitted
            </span>
            <p className="font-display mt-3 text-3xl tnum" key={`${low}-${high}`}>
              <span className="price-flip">
                {gbp(low)} – {gbp(high)}
              </span>
            </p>
            <p className="mt-3 text-sm" style={{ color: "var(--steel-dim)" }}>
              Suggested size for your home:{" "}
              <strong style={{ color: "#fff" }}>{recommended.kw}kW</strong>. The recommended option is the{" "}
              {recommended.boiler} at about{" "}
              <strong className="tnum" style={{ color: "#fff" }}>
                {gbp(recommended.priceLow)}–{gbp(recommended.priceHigh)}
              </strong>
              , with a {recommended.warrantyYears}-year warranty, or from{" "}
              <strong className="tnum" style={{ color: "#fff" }}>
                £{recommended.monthlyOver60}/month
              </strong>
              .
            </p>
          </div>
          <div>
            <a
              href="/boiler-quote"
              onClick={(event) => {
                event.preventDefault();
                continueToQuote();
              }}
              className="btn btn--primary w-full"
            >
              Get my fixed price
              <Arrow />
            </a>
            <p className="mt-3 text-center text-xs" style={{ color: "var(--steel-dim)" }}>
              A few more questions, about two minutes. No obligation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold" style={{ color: "var(--ink)" }}>
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}
