"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { saveQuoteStep, completeQuote, type CompleteQuoteState } from "@/app/boiler-quote/actions";
import { QUOTE_STEP_IDS } from "@/lib/quote/step-ids";
import { isPostcodeLikelyInCoverage } from "@/lib/content/coverage-postcodes";

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

const inputStyle = {
  borderColor: "var(--border-hairline)",
  background: "var(--surface)",
  color: "var(--ink)",
  borderRadius: "var(--radius)",
} as const;

function OptionGrid({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className="border px-4 py-4 text-left font-mono-label transition-colors"
          style={{
            borderColor: value === opt.value ? "var(--flame)" : "var(--border-hairline)",
            background: value === opt.value ? "var(--flame)" : "var(--surface)",
            color: value === opt.value ? "var(--paper)" : "var(--ink)",
            borderRadius: "var(--radius)",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function QuoteWizard() {
  const [quoteId] = useState(() => {
    if (typeof window === "undefined") return "";
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return (JSON.parse(saved).quoteId as string) ?? crypto.randomUUID();
      } catch {
        return crypto.randomUUID();
      }
    }
    return crypto.randomUUID();
  });

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => {
    if (typeof window === "undefined") return EMPTY;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...EMPTY, ...JSON.parse(saved).answers };
      } catch {
        return EMPTY;
      }
    }
    return EMPTY;
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [contactState, contactAction, contactPending] = useActionState<CompleteQuoteState, FormData>(
    completeQuote,
    { status: "idle" }
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ quoteId, answers }));
  }, [quoteId, answers]);

  // Move focus to the new step's heading on every transition, and announce
  // it via the live region below — the panel swap otherwise leaves focus
  // stranded on the Next/Back button with nothing announced to AT.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (files) => setPhoto(files[0] ?? null),
  });

  function set<K extends keyof Answers>(key: K, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
  }

  function next() {
    const fd = new FormData();
    fd.set("quoteId", quoteId);
    fd.set("step", QUOTE_STEP_IDS[step]);
    Object.entries(answers).forEach(([k, v]) => v && fd.set(k, v));
    // Only attach the photo on the step it was captured — otherwise the
    // same file re-uploads (and re-appends to photo_urls) on every
    // subsequent step transition.
    if (step === PHOTO_STEP_INDEX && photo) {
      fd.set("photo", photo);
    }
    void saveQuoteStep(fd).then(() => {
      if (step === PHOTO_STEP_INDEX) setPhoto(null);
    });
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  const coverageMatch = isPostcodeLikelyInCoverage(answers.postcode);

  if (contactState.status === "success" && contactState.tiers) {
    return <QuoteResult tiers={contactState.tiers} pdfBase64={contactState.pdfBase64} />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-label="Quote progress"
        className="h-1 w-full"
        style={{ background: "var(--paper-raised)", borderRadius: "var(--radius)" }}
      >
        <div
          className="h-1 transition-all"
          style={{
            width: `${((step + 1) / TOTAL_STEPS) * 100}%`,
            background: "var(--flame)",
            borderRadius: "var(--radius)",
            transitionDuration: "var(--duration-transition)",
          }}
        />
      </div>
      <span className="font-mono-label" style={{ color: "var(--steel)" }} aria-live="polite">
        STEP {step + 1} OF {TOTAL_STEPS}
      </span>

      {step === 0 && (
        <Step title="What kind of property is it?" headingRef={headingRef}>
          <OptionGrid
            name="Property type"
            value={answers.propertyType}
            onChange={(v) => set("propertyType", v)}
            options={[
              { value: "flat", label: "Flat" },
              { value: "terraced", label: "Terraced" },
              { value: "semi_detached", label: "Semi-detached" },
              { value: "detached", label: "Detached" },
              { value: "bungalow", label: "Bungalow" },
            ]}
          />
          <label className="mt-6 flex flex-col gap-1.5">
            <span className="font-mono-label" style={{ color: "var(--steel)" }}>
              Bedrooms
            </span>
            <input
              type="number"
              min={1}
              max={10}
              value={answers.bedrooms}
              onChange={(e) => set("bedrooms", e.target.value)}
              className="w-32 border px-3 py-2"
              style={inputStyle}
            />
          </label>
        </Step>
      )}

      {step === 1 && (
        <Step title="Bathrooms and shower type" headingRef={headingRef}>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono-label" style={{ color: "var(--steel)" }}>
              Bathrooms
            </span>
            <input
              type="number"
              min={1}
              max={6}
              value={answers.bathrooms}
              onChange={(e) => set("bathrooms", e.target.value)}
              className="w-32 border px-3 py-2"
              style={inputStyle}
            />
          </label>
          <div className="mt-6">
            <OptionGrid
              name="Shower type"
              value={answers.showerType}
              onChange={(v) => set("showerType", v)}
              options={[
                { value: "electric", label: "Electric shower" },
                { value: "mixer", label: "Mixer shower" },
                { value: "power", label: "Power shower" },
                { value: "none", label: "No shower yet" },
              ]}
            />
          </div>
        </Step>
      )}

      {step === 2 && (
        <Step title="What's your current system?" headingRef={headingRef}>
          <OptionGrid
            name="Current system"
            value={answers.currentSystem}
            onChange={(v) => set("currentSystem", v)}
            options={[
              { value: "combi", label: "Combi" },
              { value: "system", label: "System" },
              { value: "regular", label: "Regular / heat only" },
              { value: "back_boiler", label: "Back boiler" },
              { value: "electric", label: "Electric heating" },
              { value: "none", label: "No boiler yet" },
            ]}
          />
        </Step>
      )}

      {step === 3 && (
        <Step title="Where's the boiler now, and where do you want it?" headingRef={headingRef}>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono-label" style={{ color: "var(--steel)" }}>
              Current location
            </span>
            <input
              value={answers.boilerLocation}
              onChange={(e) => set("boilerLocation", e.target.value)}
              placeholder="e.g. Airing cupboard"
              className="border px-3 py-2"
              style={inputStyle}
            />
          </label>
          <label className="mt-4 flex flex-col gap-1.5">
            <span className="font-mono-label" style={{ color: "var(--steel)" }}>
              Target location (if different)
            </span>
            <input
              value={answers.targetLocation}
              onChange={(e) => set("targetLocation", e.target.value)}
              placeholder="e.g. Kitchen cupboard"
              className="border px-3 py-2"
              style={inputStyle}
            />
          </label>
        </Step>
      )}

      {step === 4 && (
        <Step title="Fuel type" headingRef={headingRef}>
          <OptionGrid
            name="Fuel type"
            value={answers.fuelType}
            onChange={(v) => set("fuelType", v)}
            options={[
              { value: "mains_gas", label: "Mains gas" },
              { value: "lpg", label: "LPG" },
              { value: "electric", label: "Electric" },
              { value: "oil", label: "Oil" },
            ]}
          />
        </Step>
      )}

      {step === 5 && (
        <Step title="A photo of the boiler and the space around it (optional)" headingRef={headingRef}>
          <p className="mb-4 text-sm" style={{ color: "var(--steel)" }}>
            This cuts survey time dramatically — most jobs need one less visit.
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
            <input {...getInputProps()} />
            <span className="font-mono-label" style={{ color: "var(--steel)" }}>
              {photo ? photo.name : isDragActive ? "Drop it here" : "Drag a photo here, or click to choose one"}
            </span>
          </div>
        </Step>
      )}

      {step === 6 && (
        <Step title="How soon do you need this done?" headingRef={headingRef}>
          <OptionGrid
            name="Urgency"
            value={answers.urgency}
            onChange={(v) => set("urgency", v)}
            options={[
              { value: "emergency", label: "No heating / hot water now" },
              { value: "this_week", label: "This week" },
              { value: "this_month", label: "This month" },
              { value: "just_looking", label: "Just getting prices" },
            ]}
          />
        </Step>
      )}

      {step === 7 && (
        <Step title="Where are you, and how do we reach you?" headingRef={headingRef}>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono-label" style={{ color: "var(--steel)" }}>
              Postcode
            </span>
            <input
              value={answers.postcode}
              onChange={(e) => set("postcode", e.target.value)}
              className="border px-3 py-2 uppercase"
              style={inputStyle}
            />
          </label>
          {!coverageMatch && (
            <p className="mt-2 text-sm" style={{ color: "var(--amber-ink)" }} role="status">
              We may be outside easy reach of this postcode — we&apos;ll confirm when we call.
            </p>
          )}
          <label className="mt-4 flex flex-col gap-1.5">
            <span className="font-mono-label" style={{ color: "var(--steel)" }}>
              Phone (any number here is saved immediately, even if you stop)
            </span>
            <input
              type="tel"
              value={answers.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="border px-3 py-2"
              style={inputStyle}
            />
          </label>
        </Step>
      )}

      {step < TOTAL_STEPS - 1 ? (
        <div className="flex gap-3">
          {step > 0 && (
            <button type="button" onClick={back} className="font-mono-label border px-5 py-3" style={{ ...inputStyle }}>
              Back
            </button>
          )}
          <button
            type="button"
            onClick={next}
            className="font-mono-label px-6 py-3"
            style={{ background: "var(--flame)", color: "var(--paper)", borderRadius: "var(--radius)" }}
          >
            Next
          </button>
        </div>
      ) : (
        <FinalStep
          quoteId={quoteId}
          answers={answers}
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
    <fieldset className="reveal is-visible flex flex-col gap-2 border-0 p-0">
      <legend className="w-full">
        <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl outline-none" style={{ color: "var(--ink)" }}>
          {title}
        </h2>
      </legend>
      <div className="mt-4">{children}</div>
    </fieldset>
  );
}

function FinalStep({
  quoteId,
  answers,
  action,
  pending,
  errorMessage,
  onBack,
}: {
  quoteId: string;
  answers: Answers;
  action: (formData: FormData) => void;
  pending: boolean;
  errorMessage?: string;
  onBack: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <input type="hidden" name="quoteId" value={quoteId} />
      {Object.entries(answers).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      {/* Honeypot — visually hidden, not display:none */}
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
        <label htmlFor="quote-website">Leave this field empty</label>
        <input id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <h2 className="font-display text-2xl" style={{ color: "var(--ink)" }}>
        Last step — where should we send your price bands?
      </h2>
      <label className="flex flex-col gap-1.5">
        <span className="font-mono-label" style={{ color: "var(--steel)" }}>
          Name
        </span>
        <input name="name" required className="border px-3 py-2" style={inputStyle} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-mono-label" style={{ color: "var(--steel)" }}>
          Email
        </span>
        <input name="email" type="email" required className="border px-3 py-2" style={inputStyle} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-mono-label" style={{ color: "var(--steel)" }}>
          Phone
        </span>
        <input name="phone" type="tel" defaultValue={answers.phone} required className="border px-3 py-2" style={inputStyle} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-mono-label" style={{ color: "var(--steel)" }}>
          Postcode
        </span>
        <input name="postcode" defaultValue={answers.postcode} required className="border px-3 py-2 uppercase" style={inputStyle} />
      </label>

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="font-mono-label border px-5 py-3" style={inputStyle}>
          Back
        </button>
        <button
          type="submit"
          disabled={pending}
          className="font-mono-label px-6 py-3 disabled:opacity-60"
          style={{ background: "var(--flame)", color: "var(--paper)", borderRadius: "var(--radius)" }}
        >
          {pending ? "Calculating…" : "Get my price bands"}
        </button>
      </div>
      {errorMessage && (
        <p style={{ color: "var(--amber-ink)" }} role="alert">
          {errorMessage}
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
  tiers: { tier: string; label: string; boiler: string; priceLow: number; priceHigh: number; warrantyYears: number; monthlyOver60: number }[];
  pdfBase64?: string;
}) {
  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

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
      <h2 className="font-display text-3xl" style={{ color: "var(--ink)" }}>
        Your price bands
      </h2>
      <p style={{ color: "var(--steel)" }}>
        We&apos;ve emailed a copy too. A confirmed price is set after a free survey — this range
        never moves without your agreement.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.tier}
            className="border p-6"
            style={{
              borderColor: t.tier === "recommended" ? "var(--flame)" : "var(--border-hairline)",
              borderRadius: "var(--radius)",
              background: t.tier === "recommended" ? "var(--flame-deep)" : "var(--surface)",
              color: t.tier === "recommended" ? "var(--paper)" : "var(--ink)",
            }}
          >
            <span className="font-mono-label" style={{ color: t.tier === "recommended" ? "var(--flame-glow)" : "var(--steel)" }}>
              {t.label}
            </span>
            <p className="font-display mt-2 text-lg">{t.boiler}</p>
            <p className="font-mono mt-3 text-2xl tabular-nums">
              £{t.priceLow.toLocaleString()}–£{t.priceHigh.toLocaleString()}
            </p>
            <p className="font-mono-label mt-2" style={{ color: t.tier === "recommended" ? "var(--steel-dim)" : "var(--steel)" }}>
              {t.warrantyYears} YR WARRANTY · FROM £{t.monthlyOver60}/MO
            </p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={download}
        className="font-mono-label self-start px-6 py-3"
        style={{ background: "var(--flame)", color: "var(--paper)", borderRadius: "var(--radius)" }}
      >
        Download PDF
      </button>
    </div>
  );
}
