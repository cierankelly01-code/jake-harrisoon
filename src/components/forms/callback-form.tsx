"use client";

import { useActionState, useId, useState } from "react";
import { requestCallback, type CallbackState } from "@/app/contact/actions";
import { CALLBACK_TIMES, CALLBACK_TOPICS } from "@/lib/validation/callback";
import { TurnstileWidget } from "@/components/security/turnstile-widget";
import { Tick } from "@/components/ui/icons";

const initialState: CallbackState = { status: "idle" };

/**
 * The callback request. Until a phone number is confirmed this is the main
 * way a visitor reaches a human, so it is short: name, number, postcode,
 * what it's about, when to ring.
 */
export function CallbackForm({ defaultTopic }: { defaultTopic?: string }) {
  const [state, formAction, pending] = useActionState(requestCallback, initialState);
  const [idempotencyKey] = useState(() =>
    typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now())
  );
  const id = useId();
  const errors = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div className="card card--soft p-8" role="status">
        <span className="tick tick--success" aria-hidden="true" style={{ width: "2.5rem", height: "2.5rem" }}>
          <Tick size={18} />
        </span>
        <p className="font-display mt-4 text-2xl" style={{ color: "var(--ink)" }}>
          Got it — we&rsquo;ll ring you back.
        </p>
        <p className="mt-2 text-base" style={{ color: "var(--steel)" }}>
          One of the two directors will call at the time you asked for. If it&rsquo;s a gas smell,
          leave the property and call the National Gas Emergency Service on 0800 111 999 first.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="card p-6 sm:p-8" noValidate>
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
      <div aria-hidden="true" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}>
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <h2 className="font-display text-2xl" style={{ color: "var(--ink)" }}>
        Request a callback
      </h2>
      <p className="mt-2 text-sm" style={{ color: "var(--steel)" }}>
        Takes thirty seconds. We ring back at the time you pick.
      </p>

      {state.status === "error" && state.message && (
        <p className="mt-4 rounded-xl px-4 py-3 text-sm font-medium" role="alert" style={{ background: "var(--amber-tint)", color: "var(--amber-ink)" }}>
          {state.message}
        </p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id={`${id}-name`} label="Your name" error={errors.name}>
          <input id={`${id}-name`} name="name" type="text" autoComplete="name" required className="field" aria-invalid={!!errors.name || undefined} />
        </Field>
        <Field id={`${id}-phone`} label="Phone number" error={errors.phone}>
          <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel" required className="field" aria-invalid={!!errors.phone || undefined} />
        </Field>
        <Field id={`${id}-postcode`} label="Postcode" error={errors.postcode}>
          <input id={`${id}-postcode`} name="postcode" type="text" autoComplete="postal-code" required className="field uppercase" aria-invalid={!!errors.postcode || undefined} />
        </Field>
        <Field id={`${id}-time`} label="Best time to ring" error={errors.bestTime}>
          <select id={`${id}-time`} name="bestTime" required className="field field-select" defaultValue="asap">
            {CALLBACK_TIMES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id={`${id}-topic`} label="What's it about?" error={errors.topic} className="sm:col-span-2">
          <select id={`${id}-topic`} name="topic" required className="field field-select" defaultValue={defaultTopic ?? "new_boiler"}>
            {CALLBACK_TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id={`${id}-message`} label="Anything we should know? (optional)" error={errors.message} className="sm:col-span-2">
          <textarea id={`${id}-message`} name="message" rows={3} className="field" style={{ minHeight: "6rem" }} />
        </Field>
      </div>

      <TurnstileWidget />

      <button type="submit" className="btn btn--primary btn--lg mt-6 w-full sm:w-auto" disabled={pending} aria-disabled={pending}>
        {pending ? "Sending…" : "Request my callback"}
      </button>
      <p className="mt-3 text-xs" style={{ color: "var(--steel)" }}>
        Your details go to the two directors and nobody else. See our{" "}
        <a href="/privacy" className="link-draw font-semibold" style={{ color: "var(--copper-ink)" }}>
          privacy notice
        </a>
        .
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--ink)" }}>
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs font-medium" style={{ color: "var(--amber-ink)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
