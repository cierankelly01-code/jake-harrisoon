"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { CARE_PLANS, CARE_PLAN_PRICES_CONFIRMED, type CarePlanTier } from "@/lib/care-plans/tiers";
import { Placeholder } from "@/components/ui/placeholder";
import { signUpForCarePlan, type CarePlanActionState } from "@/app/care-plans/actions";
import { TurnstileWidget } from "@/components/security/turnstile-widget";
import { track } from "@/lib/analytics";

const initialState: CarePlanActionState = { status: "idle" };

/**
 * PLUGIN — pricing table.
 *
 * Pricing psychology, applied honestly: three tiers, the middle one given
 * centre stage and a "most chosen" badge, with Complete acting as the high
 * anchor and Service as the deliberately thin option that makes Cover the
 * obvious read. No fake scarcity and no countdown — this is a subscription
 * to a plumber, and manufactured urgency on a recurring card payment is both
 * tacky and, in the UK, a regulatory problem.
 *
 * Excluded feature rows previously used --steel-dim on --paper, which is
 * 2.42:1 and fails AA outright. They now use --steel (5.99:1) and carry a
 * cross icon, so exclusion is never signalled by colour alone.
 */
const RECOMMENDED: CarePlanTier = "cover";

const inputStyle = {
  borderColor: "var(--border-hairline)",
  background: "var(--surface)",
  color: "var(--ink)",
  borderRadius: "var(--radius)",
} as const;

const TIER_PITCH: Record<CarePlanTier, string> = {
  service: "One service a year, booked by us.",
  cover: "The one we recommend: breakdowns are covered.",
  complete: "Boiler, heating, radiators and plumbing, all covered.",
};

const TIER_CTA: Record<CarePlanTier, string> = {
  service: "Choose Service",
  cover: "Choose Cover",
  complete: "Choose Complete",
};

export function CarePlansSection() {
  const [selectedTier, setSelectedTier] = useState<CarePlanTier | null>(null);
  const [state, formAction, pending] = useActionState(signUpForCarePlan, initialState);
  const signupRef = useRef<HTMLDivElement>(null);
  const fieldId = useId();

  useEffect(() => {
    if (state.status === "redirect" && state.url) {
      window.location.href = state.url;
    }
  }, [state]);

  // Choosing a plan used to change a button label and nothing else — the form
  // it revealed was below the fold, so it read as a dead button.
  useEffect(() => {
    if (!selectedTier) return;
    signupRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    signupRef.current?.focus({ preventScroll: true });
  }, [selectedTier]);

  return (
    <div className="flex flex-col gap-16">
      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        {CARE_PLANS.map((plan) => {
          const recommended = plan.tier === RECOMMENDED;
          const chosen = selectedTier === plan.tier;
          return (
            <div
              key={plan.tier}
              className="relative flex flex-col border p-6 lg:p-7"
              style={{
                borderColor: recommended ? "var(--flame)" : "var(--border-hairline)",
                borderWidth: recommended ? 2 : 1,
                borderRadius: "var(--radius)",
                background: recommended ? "var(--paper-raised)" : "var(--surface)",
              }}
            >
              {recommended && (
                <span
                  className="font-mono-label absolute -top-3 left-6 px-2.5 py-1"
                  style={{ background: "var(--flame)", color: "var(--ink)", borderRadius: "var(--radius)" }}
                >
                  Recommended
                </span>
              )}

              <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
                {plan.name}
              </span>
              {/* Same gate as the homepage teaser. These were publishing a
                  full tariff — £8/£14/£22 with VAT treatment, a £500 claim
                  cap and a payment processor — one click from a homepage
                  chip saying the prices were unconfirmed, on a site whose
                  /prices page says nothing is signed off yet. Either the
                  figures are real everywhere or nowhere. */}
              {CARE_PLAN_PRICES_CONFIRMED ? (
                <p className="font-mono tnum mt-3 text-3xl" style={{ color: "var(--ink)" }}>
                  £{plan.monthlyPriceGbp}
                  <span className="text-base" style={{ color: "var(--steel)" }}>
                    /month
                  </span>
                </p>
              ) : (
                <p className="mt-3">
                  <Placeholder label={`${plan.name.toUpperCase()} PLAN PRICE`} />
                </p>
              )}
              <p className="mt-3 min-h-[3rem] text-sm" style={{ color: "var(--steel)" }}>
                {TIER_PITCH[plan.tier]}
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3 border-t pt-6 text-sm" style={{ borderColor: "var(--border-hairline)" }}>
                {plan.features.map((f) => (
                  <li
                    key={f.label}
                    className="flex items-start gap-2.5"
                    style={{ color: f.included ? "var(--ink)" : "var(--steel)" }}
                  >
                    <span aria-hidden="true" className="mt-0.5 shrink-0">
                      {f.included ? (
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7.5L5.5 11L12 3.5" stroke="var(--flame)" strokeWidth="2" />
                        </svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                          <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      )}
                    </span>
                    <span>
                      <span className="sr-only">{f.included ? "Included: " : "Not included: "}</span>
                      {f.label}
                      {f.note ? ` (${f.note})` : ""}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => {
                  setSelectedTier(plan.tier);
                  track("care_plan_checkout", { tier: plan.tier });
                }}
                aria-pressed={chosen}
                className={`btn mt-7 w-full ${recommended || chosen ? "btn--primary" : "btn--secondary"}`}
              >
                {chosen ? "Selected — details below" : TIER_CTA[plan.tier]}
              </button>
            </div>
          );
        })}
      </div>

      <p className="font-mono-label -mt-10" style={{ color: "var(--steel)" }}>
        Cancel any time · No minimum term · No exit fee · Prices include VAT
      </p>

      {selectedTier && (
        <div
          id="care-plan-signup"
          ref={signupRef}
          tabIndex={-1}
          className="border p-6 outline-none md:p-8"
          style={{ borderColor: "var(--flame)", borderRadius: "var(--radius)", background: "var(--paper-raised)" }}
        >
          {state.status === "stub" ? (
            <p role="status" style={{ color: "var(--ink)" }}>
              {state.message ?? "Thanks — we've got your details."}
            </p>
          ) : (
            <form action={formAction} className="flex flex-col gap-5">
              <input type="hidden" name="tier" value={selectedTier} />

              {/* Honeypot — removed from the layout entirely so it cannot be
                  seen, tabbed to, or announced. */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                  clipPath: "inset(50%)",
                  whiteSpace: "nowrap",
                }}
              >
                <label htmlFor="care-plan-website">Leave this field empty</label>
                <input id="care-plan-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <h3 className="font-display text-xl" style={{ color: "var(--ink)" }}>
                  Set up the {CARE_PLANS.find((p) => p.tier === selectedTier)?.name} plan
                </h3>
                <p className="mt-2 text-sm" style={{ color: "var(--steel)" }}>
                  {CARE_PLAN_PRICES_CONFIRMED
                    ? `£${CARE_PLANS.find((p) => p.tier === selectedTier)?.monthlyPriceGbp} a month. `
                    : "We will confirm the monthly price with you before anything is set up. "}
                  Payment is taken by Stripe on the next screen — nothing is charged until you
                  confirm it there.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field id={`${fieldId}-name`} label="Name" name="name" autoComplete="name" required />
                <Field id={`${fieldId}-email`} label="Email" name="email" type="email" autoComplete="email" required />
                <Field id={`${fieldId}-phone`} label="Phone" name="phone" type="tel" autoComplete="tel" required />
                <Field
                  id={`${fieldId}-postcode`}
                  label="Postcode"
                  name="postcode"
                  autoComplete="postal-code"
                  required
                />
              </div>
              <Field
                id={`${fieldId}-address`}
                label="Address"
                name="address"
                autoComplete="street-address"
                required
              />

              <TurnstileWidget theme="light" />

              <div className="flex flex-wrap items-center gap-4">
                <button type="submit" disabled={pending} className="btn btn--primary">
                  {pending ? "Taking you to payment…" : "Continue to payment"}
                </button>
                <button type="button" onClick={() => setSelectedTier(null)} className="btn btn--secondary">
                  Change plan
                </button>
              </div>
              <p className="font-mono-label" style={{ color: "var(--steel)" }}>
                Secure payment by Stripe · Cancel any time · No card details are stored by us
              </p>

              {state.status === "error" && (
                <p className="flex items-start gap-2 text-sm" style={{ color: "var(--amber-ink)" }} role="alert">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
                    <path d="M7 1L13.5 12.5H0.5L7 1Z" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M7 5.5v3M7 10.4v.6" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                  <span>{state.message}</span>
                </p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  required = false,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="font-mono-label block" style={{ color: "var(--steel)" }}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="mt-1.5 w-full border px-3 py-2.5"
        style={inputStyle}
      />
    </div>
  );
}
