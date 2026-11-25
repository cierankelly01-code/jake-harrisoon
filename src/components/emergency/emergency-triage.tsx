"use client";

import Link from "next/link";
import { phoneLink } from "@/lib/content/contact-links";
import { track } from "@/lib/analytics";

/**
 * Emergency triage: "no heat / leak / no hot water" → what to do right now,
 * straight into booking. The highest-intent traffic on the site had no
 * dedicated path before this — someone with water coming through a ceiling
 * was landing on the same homepage as someone comparing care plans.
 *
 * Deliberately NOT gated behind any pending client fact (CONTENT_NEEDED.md):
 * every step below is generic, industry-standard safety guidance, not a
 * claim about Hartson specifically, and every CTA resolves through the same
 * contact-links.ts fallback chain as the rest of the site. The one phone
 * number on this page that isn't routed through that fallback is the
 * National Gas Emergency Service — a nationwide, publicly published number,
 * not a business fact that could be wrong or unconfirmed.
 *
 * <details>/<summary> throughout: works with JS disabled (every step is
 * readable either way, just not collapsed), and is keyboard-operable with
 * no extra work — native disclosure semantics, same pattern as faq.tsx.
 */

type Scenario = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  steps: string[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "leak",
    eyebrow: "Leak",
    title: "Water escaping — a pipe, a tank, a radiator.",
    summary: "Stop the water first. Everything else can wait a few minutes.",
    steps: [
      "Turn off the stopcock — usually under the kitchen sink, or wherever the mains supply enters the property. Turn it clockwise.",
      "If water is near sockets, switches or the fuse board, turn off the electrics at the consumer unit.",
      "Catch what you can and move anything valuable out of the way.",
      "Photograph the damage before you start mopping up — it's useful for any insurance claim.",
    ],
  },
  {
    id: "no-heat",
    eyebrow: "No heat",
    title: "Heating not coming on, or not getting warm.",
    summary: "Three checks take under a minute and often explain it.",
    steps: [
      "Check the boiler pressure gauge — most systems need 1–1.5 bar. Below that, boilers often lock out. (Check your boiler's manual for how to top up; if you're not sure, don't guess — call us instead.)",
      "Check the room thermostat is actually calling for heat, and that any timer or programmer is set correctly.",
      "Check the boiler display for a fault code and note it down — it saves time when you call.",
      "Check the stopcock and any zone valves are open, not shut.",
    ],
  },
  {
    id: "no-hot-water",
    eyebrow: "No hot water",
    title: "Heating's fine, but no hot water.",
    summary: "Usually a smaller fault than no heat at all.",
    steps: [
      "Check the boiler pressure gauge (same as for no heat, above).",
      "If you have a hot water cylinder, check the cylinder thermostat and immersion switch.",
      "Check the boiler display for a fault code.",
      "Run a hot tap for a minute — sometimes it's just air in the system after a top-up.",
    ],
  },
];

export function EmergencyTriage() {
  const phone = phoneLink();

  return (
    <>
      {/* Always visible, never collapsed — the one scenario where making
          someone click to reveal safety information would be a real harm.
          0800 111 999 is the National Gas Emergency Service: nationwide,
          free, 24 hours, run by the gas network — not Hartson, and not
          something CONTENT_NEEDED.md tracks, because it isn't our number to
          confirm or a claim about our business. */}
      <section
        aria-labelledby="gas-emergency-heading"
        className="grain relative"
        style={{ background: "var(--ink)" }}
      >
        <div
          className="relative z-10 mx-auto max-w-[100rem] px-6"
          style={{ paddingTop: "var(--space-section-dense)", paddingBottom: "var(--space-section-dense)" }}
        >
          <span className="font-mono-label" style={{ color: "var(--amber)" }}>
            Smell gas?
          </span>
          <h1
            id="gas-emergency-heading"
            className="font-display mt-4 max-w-[24ch] text-3xl sm:text-4xl"
            style={{ color: "var(--paper)" }}
          >
            Leave the property. Call the gas emergency line. Do it now.
          </h1>
          <ol
            className="mt-8 grid max-w-[52rem] gap-4 sm:grid-cols-2"
            style={{ color: "var(--paper)" }}
          >
            {[
              "Turn off the gas at the meter, if you can reach it safely.",
              "Do not use light switches, doorbells, lighters or any naked flame.",
              "Open doors and windows on your way out.",
              "Leave, then call 0800 111 999 — free, 24 hours, National Gas Emergency Service.",
            ].map((step, index) => (
              <li key={step} className="flex gap-3 text-sm sm:text-base">
                <span className="font-mono shrink-0" style={{ color: "var(--amber)" }}>
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <a
            href="tel:0800111999"
            onClick={() => track("cta_click", { location: "emergency", action: "gas_emergency_call" })}
            className="btn mt-8"
            style={{ background: "var(--amber)", color: "var(--ink)" }}
          >
            Call 0800 111 999
          </a>
          <p className="mt-3 max-w-[46ch] text-sm" style={{ color: "var(--steel-dim)" }}>
            That&apos;s the National Gas Emergency Service, not us — it&apos;s the right first call for
            a gas smell anywhere in the UK. Once they&apos;ve confirmed it&apos;s safe, come back here
            if you&apos;d like us to take a look.
          </p>
        </div>
      </section>

      {/* Everything else — the other three scenarios someone lands here for. */}
      <section
        aria-labelledby="triage-heading"
        className="mx-auto max-w-[100rem] px-6"
        style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
      >
        <div className="grid gap-7 sm:gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="section-index font-mono-label" data-index="00" style={{ color: "var(--copper-ink)" }}>
              Right now
            </span>
            <h2 id="triage-heading" className="font-display mt-4 text-3xl" style={{ color: "var(--ink)" }}>
              What&apos;s actually happening?
            </h2>
            <p className="mt-5 max-w-[40ch] text-sm" style={{ color: "var(--steel)" }}>
              Pick the one that matches. Each has what to check before you call — some of it fixes
              itself, and the rest saves time once you&apos;re through to us.
            </p>
          </div>

          <div className="lg:col-span-8">
            {SCENARIOS.map((scenario) => (
              <details
                key={scenario.id}
                name="marmion-emergency"
                className="group border-b"
                style={{ borderColor: "var(--border-hairline)" }}
                onToggle={(event) => {
                  if ((event.currentTarget as HTMLDetailsElement).open) {
                    track("emergency_scenario_open", { scenario: scenario.id });
                  }
                }}
              >
                <summary className="flex items-start justify-between gap-6 py-5">
                  <span>
                    <span className="font-mono-label block" style={{ color: "var(--copper-ink)" }}>
                      {scenario.eyebrow}
                    </span>
                    <h3 className="font-display mt-2 text-xl leading-snug" style={{ color: "var(--ink)" }}>
                      {scenario.title}
                    </h3>
                    <span className="mt-1 block text-sm" style={{ color: "var(--steel)" }}>
                      {scenario.summary}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1.5 shrink-0 transition-transform group-open:rotate-45"
                    style={{ color: "var(--copper-ink)", transitionDuration: "var(--duration-transition)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                </summary>
                <div className="accordion-panel">
                  <div>
                    <ol className="max-w-[56ch] pb-8 pr-10">
                      {scenario.steps.map((step, index) => (
                        <li key={step} className="flex gap-3 border-t py-3 text-sm" style={{ borderColor: "var(--border-hairline)", color: "var(--steel)" }}>
                          <span className="font-mono shrink-0" style={{ color: "var(--copper-ink)" }}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Close: straight into booking. Two-hour arrival window and no
          callout fee on quoted work are the same facts already stated on
          the homepage services grid — restated here, not invented here. */}
      <section
        aria-labelledby="emergency-cta-heading"
        className="border-t band-green"
        style={{ background: "var(--flame)", borderColor: "var(--border-hairline-dark)" }}
      >
        <div
          className="mx-auto flex max-w-[100rem] flex-col items-start gap-6 px-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ paddingTop: "var(--space-section-dense)", paddingBottom: "var(--space-section-dense)" }}
        >
          <div>
            {/* Near-black on the green band, not white: white on `--flame`
                measures 2.0:1 and axe failed both of these as serious
                contrast violations. `--ink` on `--flame` is 9.9:1. */}
            <h2 id="emergency-cta-heading" className="font-display max-w-[22ch] text-2xl sm:text-3xl" style={{ color: "var(--ink)" }}>
              Done the checks? Get someone out.
            </h2>
            <p className="mt-3 max-w-[42ch] text-sm" style={{ color: "var(--ink)" }}>
              Two-hour arrival windows, and we ring when we leave the job before yours. No callout fee
              on work you&apos;ve accepted a price for.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={phone.href}
              onClick={() => track("cta_click", { location: "emergency", action: "primary" })}
              className="btn"
              style={{ background: "var(--ink)", color: "var(--paper)" }}
            >
              {phone.isDirect ? `Call ${phone.label}` : "Request a callback"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
