"use client";

import { useActionState, useState } from "react";
import { CARE_PLANS, type CarePlanTier } from "@/lib/care-plans/tiers";
import { signUpForCarePlan, type CarePlanActionState } from "@/app/care-plans/actions";

const initialState: CarePlanActionState = { status: "idle" };

const inputStyle = {
  borderColor: "var(--border-hairline)",
  background: "var(--surface)",
  color: "var(--ink)",
  borderRadius: "var(--radius)",
} as const;

export function CarePlansSection() {
  const [selectedTier, setSelectedTier] = useState<CarePlanTier | null>(null);
  const [state, formAction, pending] = useActionState(signUpForCarePlan, initialState);

  if (state.status === "redirect" && state.url && typeof window !== "undefined") {
    window.location.href = state.url;
  }

  return (
    <div className="flex flex-col gap-16">
      <div className="grid gap-6 md:grid-cols-3">
        {CARE_PLANS.map((plan) => (
          <div
            key={plan.tier}
            className="flex flex-col border p-6"
            style={{ borderColor: "var(--border-hairline)", borderRadius: "var(--radius)", background: "var(--surface)" }}
          >
            <span className="font-mono-label" style={{ color: "var(--copper)" }}>
              {plan.name.toUpperCase()}
            </span>
            <p className="font-mono mt-3 text-3xl tabular-nums" style={{ color: "var(--ink)" }}>
              £{plan.monthlyPriceGbp}
              <span className="text-base" style={{ color: "var(--steel)" }}>
                /mo
              </span>
            </p>
            <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm">
              {plan.features.map((f) => (
                <li key={f.label} className="flex items-start gap-2" style={{ color: f.included ? "var(--ink)" : "var(--steel-dim)" }}>
                  <span aria-hidden="true">{f.included ? "✓" : "—"}</span>
                  <span>
                    {f.label}
                    {f.note ? ` (${f.note})` : ""}
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setSelectedTier(plan.tier)}
              className="font-mono-label mt-6 px-5 py-3"
              style={{
                background: selectedTier === plan.tier ? "var(--flame-deep)" : "var(--flame)",
                color: "var(--paper)",
                borderRadius: "var(--radius)",
              }}
            >
              {selectedTier === plan.tier ? "Selected" : "Choose plan"}
            </button>
          </div>
        ))}
      </div>

      {selectedTier && (
        <div
          id="care-plan-signup"
          className="border p-6"
          style={{ borderColor: "var(--border-hairline)", borderRadius: "var(--radius)", background: "var(--paper-raised)" }}
        >
          {state.status === "stub" ? (
            <p style={{ color: "var(--ink)" }}>{state.message ?? "Thanks — we've got your details."}</p>
          ) : (
            <form action={formAction} className="flex flex-col gap-4">
              <input type="hidden" name="tier" value={selectedTier} />
              <h3 className="font-display text-xl" style={{ color: "var(--ink)" }}>
                Sign up — {CARE_PLANS.find((p) => p.tier === selectedTier)?.name} plan
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" name="name" required />
                <Field label="Email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" required />
                <Field label="Postcode" name="postcode" required />
              </div>
              <Field label="Address" name="address" required />
              <button
                type="submit"
                disabled={pending}
                className="font-mono-label self-start px-6 py-3 disabled:opacity-60"
                style={{ background: "var(--flame)", color: "var(--paper)", borderRadius: "var(--radius)" }}
              >
                {pending ? "Redirecting to payment…" : "Continue to payment"}
              </button>
              {state.status === "error" && <p style={{ color: "var(--amber)" }}>{state.message}</p>}
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono-label" style={{ color: "var(--steel)" }}>
        {label}
        {required ? " *" : ""}
      </span>
      <input name={name} type={type} required={required} className="border px-3 py-2" style={inputStyle} />
    </label>
  );
}
