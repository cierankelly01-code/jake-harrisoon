"use client";

import { useActionState, useCallback, useEffect, useId, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { saveQuoteStep, completeQuote, type CompleteQuoteState } from "@/app/boiler-quote/actions";
import { QUOTE_STEP_IDS } from "@/lib/quote/step-ids";
import { isPostcodeLikelyInCoverage } from "@/lib/content/coverage-postcodes";
import { TurnstileWidget } from "@/components/security/turnstile-widget";
import { track } from "@/lib/analytics";

type Answers = {
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  showerType: string;
  currentSystem: string;
  boilerLocation: string;
  targetLocation: string;
  fuelType: string;
  urgency: string;
  postcode: string;
  phone: string;
};

const EMPTY: Answers = {
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  showerType: "",
  currentSystem: "",
  boilerLocation: "",
  targetLocation: "",
  fuelType: "",
  urgency: "",
  postcode: "",
  phone: "",
};

const STORAGE_KEY = "marmion-boiler-quote";
const TOTAL_STEPS = QUOTE_STEP_IDS.length;
const PHOTO_STEP_INDEX = QUOTE_STEP_IDS.indexOf("photo");
const CONTACT_STEP_INDEX = TOTAL_STEPS - 1;

const inputStyle = {
  borderColor: "var(--border-hairline)",
  background: "var(--surface)",
  color: "var(--ink)",
  borderRadius: "var(--radius)",
} as const;

/**
 * Per-step validation. Previously `next()` advanced unconditionally, so it
 * was possible to walk all eight steps answering nothing at all and reach a
 * pricing engine with no inputs — which then failed on submit with nothing
 * shown to the user. Each step now states what it needs, in words, beside
 * the field that needs it.
 */
function validateStep(step: number, answers: Answers): Partial<Record<keyof Answers, string>> {
  const errors: Partial<Record<keyof Answers, string>> = {};
  const bedrooms = Number(answers.bedrooms);
  const bathrooms = Number(answers.bathrooms);

  switch (QUOTE_STEP_IDS[step]) {
    // `Number.isInteger`, not `isFinite`: the server schema requires whole
    // numbers, so "3.5" passed here, failed server-side, and — because every
    // later step re-sends the full answer set — silently killed every
    // subsequent autosave for that visitor with nothing shown on screen.
    case "property":
      if (!answers.propertyType) errors.propertyType = "Choose the type of property.";
      if (!answers.bedrooms) errors.bedrooms = "Tell us how many bedrooms.";
      else if (!Number.isInteger(bedrooms) || bedrooms < 1 || bedrooms > 10)
        errors.bedrooms = "Bedrooms should be a whole number between 1 and 10.";
      break;
    case "bathrooms":
      if (!answers.bathrooms) errors.bathrooms = "Tell us how many bathrooms.";
      else if (!Number.isInteger(bathrooms) || bathrooms < 1 || bathrooms > 6)
        errors.bathrooms = "Bathrooms should be a whole number between 1 and 6.";
      if (!answers.showerType) errors.showerType = "Choose the shower type.";
      break;
    case "system":
      if (!answers.currentSystem) errors.currentSystem = "Choose your current system.";
      break;
    case "location":
      if (!answers.boilerLocation.trim())
        errors.boilerLocation = "Tell us where the boiler is now — a rough description is fine.";
      break;
    case "fuel":
      if (!answers.fuelType) errors.fuelType = "Choose the fuel type.";
      break;
    case "urgency":
      if (!answers.urgency) errors.urgency = "Tell us how soon you need it done.";
      break;
    default:
      break;
  }
  return errors;
}

function OptionGrid({
  legend,
  options,
  value,
  onChange,
  errorId,
  invalid,
}: {
  legend: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  errorId?: string;
  invalid?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={legend}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? errorId : undefined}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className="quote-option font-mono-label min-h-[52px] border px-4 py-4 text-left"
            style={{
              borderColor: selected ? "var(--flame)" : invalid ? "var(--amber-ink)" : "var(--border-hairline)",
              background: selected ? "var(--flame)" : "var(--surface)",
              color: selected ? "var(--paper)" : "var(--ink)",
              borderRadius: "var(--radius)",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-sm" style={{ color: "var(--amber-ink)" }}>
      {/* An icon as well as colour — state is never conveyed by colour alone. */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
        <path d="M7 1L13.5 12.5H0.5L7 1Z" stroke="currentColor" strokeWidth="1.3" />
        <path d="M7 5.5v3M7 10.4v.6" stroke="currentColor" strokeWidth="1.3" />
      </svg>
      <span>{message}</span>
    </p>
  );
}

export function QuoteWizard() {
  /**
   * Saved state is restored in an effect, not in a `useState` initialiser.
   * The initialiser runs on the server too (where it returns EMPTY) and again
   * on the client (where it returns the saved answers), so a returning
   * visitor hydrated into a mismatch between the two renders.
   */
  const [quoteId, setQuoteId] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [restored, setRestored] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Answers, string>>>({});
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    let saved: { quoteId?: string; answers?: Partial<Answers> } | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch {
      saved = null;
    }

    setQuoteId(saved?.quoteId || crypto.randomUUID());

    const savedAnswers = saved?.answers;
    if (savedAnswers && Object.values(savedAnswers).some((v) => typeof v === "string" && v !== "")) {
      setAnswers({ ...EMPTY, ...savedAnswers });
      setRestored(true);
    }
  }, []);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const fieldId = useId();
  // Blur handlers fire outside React's render, so they need the latest answers
  // rather than the ones captured when the handler was created.
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const [contactState, contactAction, contactPending] = useActionState<CompleteQuoteState, FormData>(
    completeQuote,
    { status: "idle" }
  );

  useEffect(() => {
    // Skip the first pass, before the restore effect has produced an id —
    // otherwise it would immediately overwrite saved answers with EMPTY.
    if (!quoteId) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ quoteId, answers }));
    } catch {
      /* private browsing — the wizard still works, it just will not resume */
    }
  }, [quoteId, answers]);

  // Move focus to the new step's heading on every transition — the panel
  // swap otherwise leaves focus stranded on the Next button with nothing
  // announced to assistive technology. Not on first render, though: stealing
  // focus on load moves the reader past the page's own heading.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (files) => setPhoto(files[0] ?? null),
  });

  function set<K extends keyof Answers>(key: K, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    // Clear a field's error as soon as it is answered, rather than making the
    // reader press Next again to find out they fixed it.
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }

  /**
   * Pushes the answers so far to the server. This is the abandonment-capture
   * half of §9.1: the moment a phone number is present, a lead exists, even if
   * the visitor never reaches the final screen.
   *
   * It is called from two places — after each step, and on blur of the contact
   * step's phone and postcode. The second is not optional: moving those two
   * fields onto the final screen meant `saveQuoteStep` was only ever called
   * from `next()`, which never runs on the last step, so no payload ever
   * carried a phone number and the lead upsert could not fire at all. The
   * wizard and the privacy notice both promise this works.
   */
  const persist = useCallback(
    (stepId: string, answersNow: Answers, file?: File | null) => {
      const fd = new FormData();
      fd.set("quoteId", quoteId);
      fd.set("step", stepId);
      Object.entries(answersNow).forEach(([k, v]) => v && fd.set(k, v));
      if (file) fd.set("photo", file);

      // A failed autosave must never surface to the reader or throw — it is a
      // background convenience, not part of the flow they are in.
      return saveQuoteStep(fd).catch((error: unknown) => {
        if (process.env.NODE_ENV === "development") {
          console.debug("[quote] autosave failed", error);
        }
        return { ok: false };
      });
    },
    [quoteId]
  );

  function next() {
    const found = validateStep(step, answers);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setErrors({});

    // Only attach the photo on the step it was captured — otherwise the same
    // file re-uploads (and re-appends to photo_urls) on every later step.
    const file = step === PHOTO_STEP_INDEX ? photo : null;
    void persist(QUOTE_STEP_IDS[step], answers, file).then(() => {
      if (step === PHOTO_STEP_INDEX) setPhoto(null);
    });

    track("quote_step", { step: step + 1, stepId: QUOTE_STEP_IDS[step] });
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function back() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  function startOver() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* private mode — the in-memory reset below is enough */
    }
    setAnswers(EMPTY);
    setErrors({});
    setPhoto(null);
    setRestored(false);
    setStep(0);
  }

  if (contactState.status === "success" && contactState.tiers) {
    return <QuoteResult tiers={contactState.tiers} pdfBase64={contactState.pdfBase64} />;
  }

  const errorList = Object.values(errors).filter(Boolean) as string[];
  const eid = (name: string) => `${fieldId}-${name}-error`;

  return (
    <div className="flex flex-col gap-8">
      {/* The wizard restores saved answers silently, which is a pleasant
          surprise only if the reader knows it happened — otherwise a
          pre-filled form looks like someone else's data, and a half-answered
          step looks like a bug. */}
      {restored && (
        <div
          role="status"
          className="border-l-2 py-3 pl-4 text-sm"
          style={{ borderColor: "var(--flame)", background: "var(--surface)", color: "var(--ink)" }}
        >
          We&rsquo;ve brought back the answers you gave last time. Change anything that is out of
          date, or{" "}
          <button
            type="button"
            onClick={startOver}
            className="link-draw underline-offset-2"
            style={{ color: "var(--ink)", font: "inherit" }}
          >
            start again from scratch
          </button>
          .
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-label={`Step ${step + 1} of ${TOTAL_STEPS}`}
          className="h-1 w-full"
          style={{ background: "var(--paper-raised)", borderRadius: "var(--radius)" }}
        >
          <div
            className="h-1"
            style={{
              width: `${((step + 1) / TOTAL_STEPS) * 100}%`,
              background: "var(--flame)",
              borderRadius: "var(--radius)",
              transition: "width var(--duration-transition) var(--ease-mech)",
            }}
          />
        </div>
        <span className="font-mono-label" style={{ color: "var(--steel)" }} aria-live="polite">
          Step {step + 1} of {TOTAL_STEPS}
        </span>
      </div>

      {/* Error summary — focused and announced when Next is blocked. */}
      <div
        ref={errorRef}
        tabIndex={-1}
        role="alert"
        className="outline-none"
        style={{ display: errorList.length ? "block" : "none" }}
      >
        {errorList.length > 0 && (
          <div
            className="border-l-2 py-3 pl-4"
            style={{ borderColor: "var(--amber-ink)", background: "var(--surface-raised)" }}
          >
            <p className="font-mono-label" style={{ color: "var(--amber-ink)" }}>
              {errorList.length === 1 ? "One thing to fill in" : `${errorList.length} things to fill in`}
            </p>
            <ul className="mt-2 flex flex-col gap-1 text-sm" style={{ color: "var(--ink)" }}>
              {errorList.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {step === 0 && (
        <Step title="What kind of property is it?" headingRef={headingRef}>
          <OptionGrid
            legend="Property type"
            value={answers.propertyType}
            onChange={(v) => set("propertyType", v)}
            invalid={!!errors.propertyType}
            errorId={eid("propertyType")}
            options={[
              { value: "flat", label: "Flat" },
              { value: "terraced", label: "Terraced" },
              { value: "semi_detached", label: "Semi-detached" },
              { value: "detached", label: "Detached" },
              { value: "bungalow", label: "Bungalow" },
            ]}
          />
          <FieldError id={eid("propertyType")} message={errors.propertyType} />

          <div className="mt-6">
            <label htmlFor={`${fieldId}-bedrooms`} className="font-mono-label block" style={{ color: "var(--steel)" }}>
              Bedrooms
            </label>
            <input
              id={`${fieldId}-bedrooms`}
              type="number"
              inputMode="numeric"
              min={1}
              max={10}
              value={answers.bedrooms}
              onChange={(e) => set("bedrooms", e.target.value)}
              aria-invalid={!!errors.bedrooms || undefined}
              aria-describedby={errors.bedrooms ? eid("bedrooms") : undefined}
              className="mt-1.5 w-32 border px-3 py-2.5"
              style={inputStyle}
            />
            <FieldError id={eid("bedrooms")} message={errors.bedrooms} />
          </div>
        </Step>
      )}

      {step === 1 && (
        <Step title="Bathrooms and shower type" headingRef={headingRef}>
          <label htmlFor={`${fieldId}-bathrooms`} className="font-mono-label block" style={{ color: "var(--steel)" }}>
            Bathrooms
          </label>
          <input
            id={`${fieldId}-bathrooms`}
            type="number"
            inputMode="numeric"
            min={1}
            max={6}
            value={answers.bathrooms}
            onChange={(e) => set("bathrooms", e.target.value)}
            aria-invalid={!!errors.bathrooms || undefined}
            aria-describedby={errors.bathrooms ? eid("bathrooms") : undefined}
            className="mt-1.5 w-32 border px-3 py-2.5"
            style={inputStyle}
          />
          <FieldError id={eid("bathrooms")} message={errors.bathrooms} />

          <div className="mt-6">
            <OptionGrid
              legend="Shower type"
              value={answers.showerType}
              onChange={(v) => set("showerType", v)}
              invalid={!!errors.showerType}
              errorId={eid("showerType")}
              options={[
                { value: "electric", label: "Electric shower" },
                { value: "mixer", label: "Mixer shower" },
                { value: "power", label: "Power shower" },
                { value: "none", label: "No shower yet" },
              ]}
            />
            <FieldError id={eid("showerType")} message={errors.showerType} />
          </div>
        </Step>
      )}

      {step === 2 && (
        <Step title="What's your current system?" headingRef={headingRef}>
          <OptionGrid
            legend="Current system"
            value={answers.currentSystem}
            onChange={(v) => set("currentSystem", v)}
            invalid={!!errors.currentSystem}
            errorId={eid("currentSystem")}
            options={[
              { value: "combi", label: "Combi" },
              { value: "system", label: "System" },
              { value: "regular", label: "Regular / heat only" },
              { value: "back_boiler", label: "Back boiler" },
              { value: "electric", label: "Electric heating" },
              { value: "none", label: "No boiler yet" },
            ]}
          />
          <FieldError id={eid("currentSystem")} message={errors.currentSystem} />
          <p className="mt-4 text-sm" style={{ color: "var(--steel)" }}>
            Not sure? Pick the closest — we confirm it on the survey and the price is not fixed until
            we have.
          </p>
        </Step>
      )}

      {step === 3 && (
        <Step title="Where's the boiler now, and where do you want it?" headingRef={headingRef}>
          <label htmlFor={`${fieldId}-current-loc`} className="font-mono-label block" style={{ color: "var(--steel)" }}>
            Current location
          </label>
          <input
            id={`${fieldId}-current-loc`}
            value={answers.boilerLocation}
            onChange={(e) => set("boilerLocation", e.target.value)}
            placeholder="e.g. Airing cupboard"
            aria-invalid={!!errors.boilerLocation || undefined}
            aria-describedby={errors.boilerLocation ? eid("boilerLocation") : undefined}
            className="mt-1.5 w-full border px-3 py-2.5"
            style={inputStyle}
          />
          <FieldError id={eid("boilerLocation")} message={errors.boilerLocation} />

          <label
            htmlFor={`${fieldId}-target-loc`}
            className="font-mono-label mt-5 block"
            style={{ color: "var(--steel)" }}
          >
            Target location <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional)</span>
          </label>
          <input
            id={`${fieldId}-target-loc`}
            value={answers.targetLocation}
            onChange={(e) => set("targetLocation", e.target.value)}
            placeholder="e.g. Kitchen cupboard"
            className="mt-1.5 w-full border px-3 py-2.5"
            style={inputStyle}
          />
          <p className="mt-2 text-sm" style={{ color: "var(--steel)" }}>
            Leave this blank if it is staying where it is.
          </p>
        </Step>
      )}

      {step === 4 && (
        <Step title="Fuel type" headingRef={headingRef}>
          <OptionGrid
            legend="Fuel type"
            value={answers.fuelType}
            onChange={(v) => set("fuelType", v)}
            invalid={!!errors.fuelType}
            errorId={eid("fuelType")}
            options={[
              { value: "mains_gas", label: "Mains gas" },
              { value: "lpg", label: "LPG" },
              { value: "electric", label: "Electric" },
              { value: "oil", label: "Oil" },
            ]}
          />
          <FieldError id={eid("fuelType")} message={errors.fuelType} />
        </Step>
      )}

      {step === 5 && (
        <Step title="A photo of the boiler and the space around it" headingRef={headingRef}>
          <p className="mb-4 text-sm" style={{ color: "var(--steel)" }}>
            Optional, and it genuinely helps — a photo usually saves a survey visit, which means a
            firm price sooner. Skip it if you would rather not.
          </p>
          <div
            {...getRootProps()}
            className="flex cursor-pointer flex-col items-center justify-center border border-dashed px-6 py-12 text-center"
            style={{
              borderColor: isDragActive ? "var(--flame)" : "var(--border-hairline)",
              borderRadius: "var(--radius)",
              background: "var(--surface-raised)",
            }}
          >
            <input {...getInputProps()} aria-label="Choose a photo of the boiler" />
            <span className="font-mono-label" style={{ color: "var(--steel)" }}>
              {photo ? photo.name : isDragActive ? "Drop it here" : "Drag a photo here, or click to choose one"}
            </span>
          </div>
        </Step>
      )}

      {step === 6 && (
        <Step title="How soon do you need this done?" headingRef={headingRef}>
          <OptionGrid
            legend="Urgency"
            value={answers.urgency}
            onChange={(v) => set("urgency", v)}
            invalid={!!errors.urgency}
            errorId={eid("urgency")}
            options={[
              { value: "emergency", label: "No heating / hot water now" },
              { value: "this_week", label: "This week" },
              { value: "this_month", label: "This month" },
              { value: "just_looking", label: "Just getting prices" },
            ]}
          />
          <FieldError id={eid("urgency")} message={errors.urgency} />
        </Step>
      )}

      {step < CONTACT_STEP_INDEX ? (
        <div className="flex flex-wrap gap-3">
          {step > 0 && (
            <button type="button" onClick={back} className="btn btn--secondary">
              Back
            </button>
          )}
          <button type="button" onClick={next} className="btn btn--primary">
            {step === PHOTO_STEP_INDEX && !photo ? "Skip this step" : "Next"}
          </button>
        </div>
      ) : (
        <ContactStep
          quoteId={quoteId}
          answers={answers}
          headingRef={headingRef}
          fieldId={fieldId}
          onAnswerChange={set}
          onCapture={() => {
            track("quote_partial", { step: CONTACT_STEP_INDEX + 1 });
            void persist("contact_details", answersRef.current);
          }}
          action={contactAction}
          pending={contactPending}
          errorMessage={contactState.status === "error" ? contactState.message : undefined}
          onBack={back}
        />
      )}
    </div>
  );
}

function Step({
  title,
  headingRef,
  children,
}: {
  title: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl outline-none" style={{ color: "var(--ink)" }}>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/**
 * The final step. It previously rendered *alongside* the postcode/phone panel
 * — both were on screen at once, asking for the same two values twice — so
 * those fields now live here only.
 */
function ContactStep({
  quoteId,
  answers,
  headingRef,
  fieldId,
  onAnswerChange,
  onCapture,
  action,
  pending,
  errorMessage,
  onBack,
}: {
  quoteId: string;
  answers: Answers;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  fieldId: string;
  onAnswerChange: <K extends keyof Answers>(key: K, value: string) => void;
  /** Fired on blur of phone/postcode so an abandoned quote still leaves a lead. */
  onCapture: () => void;
  action: (formData: FormData) => void;
  pending: boolean;
  errorMessage?: string;
  onBack: () => void;
}) {
  const coverageMatch = isPostcodeLikelyInCoverage(answers.postcode);
  const hasPostcode = answers.postcode.trim().length >= 3;

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="quoteId" value={quoteId} />
      {Object.entries(answers).map(([k, v]) =>
        k === "postcode" || k === "phone" ? null : <input key={k} type="hidden" name={k} value={v} />
      )}

      {/* Honeypot. Taken out of the layout entirely and pushed off-canvas, so
          it cannot be seen, tabbed to, or read out — the previous version sat
          in normal flow with a visible label. */}
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
        <label htmlFor="quote-website">Leave this field empty</label>
        <input id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl outline-none" style={{ color: "var(--ink)" }}>
        Where should we send your price bands?
      </h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${fieldId}-name`} className="font-mono-label block" style={{ color: "var(--steel)" }}>
            Name
          </label>
          <input
            id={`${fieldId}-name`}
            name="name"
            required
            autoComplete="name"
            className="mt-1.5 w-full border px-3 py-2.5"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor={`${fieldId}-email`} className="font-mono-label block" style={{ color: "var(--steel)" }}>
            Email
          </label>
          <input
            id={`${fieldId}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            className="mt-1.5 w-full border px-3 py-2.5"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor={`${fieldId}-postcode`} className="font-mono-label block" style={{ color: "var(--steel)" }}>
            Postcode
          </label>
          <input
            id={`${fieldId}-postcode`}
            name="postcode"
            required
            autoComplete="postal-code"
            value={answers.postcode}
            onChange={(e) => onAnswerChange("postcode", e.target.value)}
            onBlur={onCapture}
            className="mt-1.5 w-full border px-3 py-2.5 uppercase"
            style={inputStyle}
          />
          {hasPostcode && !coverageMatch && (
            <p className="mt-2 text-sm" style={{ color: "var(--amber-ink)" }}>
              That looks like it may be outside our usual patch. Send it anyway — we will tell you
              straight away whether we can cover you properly.
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${fieldId}-phone`} className="font-mono-label block" style={{ color: "var(--steel)" }}>
            Phone
          </label>
          <input
            id={`${fieldId}-phone`}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            value={answers.phone}
            onChange={(e) => onAnswerChange("phone", e.target.value)}
            onBlur={onCapture}
            aria-describedby={`${fieldId}-phone-note`}
            className="mt-1.5 w-full border px-3 py-2.5"
            style={inputStyle}
          />
        </div>
      </div>

      {/* The wizard saves partial answers as you go so a half-finished quote
          can be picked up rather than lost. That is worth saying plainly —
          but as a note under the form, not as part of a field's own label,
          where it read like a warning shot. */}
      <p id={`${fieldId}-phone-note`} className="text-sm" style={{ color: "var(--steel)" }}>
        We save your answers as you go so you can pick this up where you left off, and so we can call
        you back if the form drops out. We use them for this quote and nothing else — see our{" "}
        <a href="/privacy" className="link-draw" style={{ color: "var(--ink)" }}>
          privacy notice
        </a>
        .
      </p>

      <TurnstileWidget theme="light" />

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onBack} className="btn btn--secondary">
          Back
        </button>
        <button type="submit" disabled={pending} className="btn btn--primary">
          {pending ? "Working it out…" : "Get my price bands"}
        </button>
      </div>
      <p className="font-mono-label" style={{ color: "var(--steel)" }}>
        No obligation · No callout fee on quoted work · Price bands emailed to you
      </p>

      {errorMessage && (
        <p className="flex items-start gap-2 text-sm" style={{ color: "var(--amber-ink)" }} role="alert">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
            <path d="M7 1L13.5 12.5H0.5L7 1Z" stroke="currentColor" strokeWidth="1.3" />
            <path d="M7 5.5v3M7 10.4v.6" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          <span>{errorMessage}</span>
        </p>
      )}
    </form>
  );
}

function base64ToBlob(base64: string, mime: string) {
  const bytes = atob(base64);
  const array = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) array[i] = bytes.charCodeAt(i);
  return new Blob([array], { type: mime });
}

function QuoteResult({
  tiers,
  pdfBase64,
}: {
  tiers: {
    tier: string;
    label: string;
    boiler: string;
    priceLow: number;
    priceHigh: number;
    warrantyYears: number;
    monthlyOver60: number;
  }[];
  pdfBase64?: string;
}) {
  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY);
    const total = tiers.find((t) => t.tier === "recommended")?.priceLow ?? tiers[0]?.priceLow ?? 0;
    track("quote_complete", { total });
  }, [tiers]);

  function download() {
    if (!pdfBase64) return;
    const blob = base64ToBlob(pdfBase64, "application/pdf");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "marmion-boiler-quote.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-3xl" style={{ color: "var(--ink)" }} tabIndex={-1}>
        Your price bands
      </h2>
      <p className="max-w-[58ch]" style={{ color: "var(--steel)" }}>
        A copy is on its way by email. These are bands, not the final figure: the fixed price is set
        after a free survey, and once it is set it does not move without your agreement.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map((t) => {
          const recommended = t.tier === "recommended";
          return (
            <div
              key={t.tier}
              className="relative flex flex-col border p-6"
              style={{
                borderColor: recommended ? "var(--flame)" : "var(--border-hairline)",
                borderWidth: recommended ? 2 : 1,
                borderRadius: "var(--radius)",
                background: recommended ? "var(--flame-deep)" : "var(--surface)",
                color: recommended ? "var(--paper)" : "var(--ink)",
              }}
            >
              {recommended && (
                <span
                  className="font-mono-label absolute -top-3 left-6 px-2 py-1"
                  style={{ background: "var(--flame)", color: "var(--paper)", borderRadius: "var(--radius)" }}
                >
                  Our pick
                </span>
              )}
              <span
                className="font-mono-label"
                style={{ color: recommended ? "var(--flame-pale)" : "var(--steel)" }}
              >
                {t.label}
              </span>
              <p className="font-display mt-2 text-lg">{t.boiler}</p>
              <p className="font-mono tnum mt-3 text-2xl">
                £{t.priceLow.toLocaleString("en-GB")}–£{t.priceHigh.toLocaleString("en-GB")}
              </p>
              <p
                className="font-mono-label mt-2"
                style={{ color: recommended ? "var(--steel-dim)" : "var(--steel)" }}
              >
                {t.warrantyYears} yr warranty · from £{t.monthlyOver60}/mo
              </p>
            </div>
          );
        })}
      </div>
      <button type="button" onClick={download} className="btn btn--primary self-start">
        Download PDF
      </button>
    </div>
  );
}
