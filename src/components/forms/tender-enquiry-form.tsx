"use client";

import { useActionState, useId, useState } from "react";
import { submitTenderEnquiry, type TenderActionState } from "@/app/tenders/actions";
import { TurnstileWidget } from "@/components/security/turnstile-widget";
import { FileDropField } from "@/components/forms/file-drop-field";

const initialState: TenderActionState = { status: "idle" };

const inputStyle = {
  borderColor: "var(--border-hairline-dark)",
  background: "var(--ink)",
  color: "var(--paper)",
  borderRadius: "var(--radius)",
} as const;

export function TenderEnquiryForm() {
  const [state, formAction, pending] = useActionState(submitTenderEnquiry, initialState);
  const [idempotencyKey] = useState(() =>
    typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now())
  );

  if (state.status === "success") {
    return (
      <div
        className="border p-8"
        style={{ borderColor: "var(--flame-glow)", borderRadius: "var(--radius)", background: "var(--slate)" }}
      >
        <p className="font-display text-xl" style={{ color: "var(--paper)" }}>
          Enquiry received.
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--steel-dim)" }}>
          We return completed PQQ documentation within 24 hours. A copy of our capability
          statement is on its way to your inbox now.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
      {/* Honeypot — out of the layout entirely so it cannot be seen, tabbed
          to, or announced. */}
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
        <label htmlFor="tender-website">Leave this field empty</label>
        <input id="tender-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="font-mono-label mb-2 sm:col-span-2" style={{ color: "var(--copper-bright)" }}>
          Organisation
        </legend>
        <TextField label="Organisation" name="organisation" required />
        <TextField label="Contact name" name="contactName" required />
        <TextField label="Role" name="contactRole" />
        <TextField label="Email" name="email" type="email" required />
        <TextField label="Phone" name="phone" type="tel" />
        <TextField label="Sector" name="sector" />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="font-mono-label mb-2 sm:col-span-2" style={{ color: "var(--copper-bright)" }}>
          Contract
        </legend>
        <SelectField
          label="Contract type"
          name="contractType"
          required
          options={[
            { value: "ppm", label: "PPM" },
            { value: "reactive", label: "Reactive" },
            { value: "installation", label: "Installation" },
            { value: "framework", label: "Framework" },
            { value: "one_off", label: "One-off project" },
          ]}
        />
        <TextField label="Number of sites" name="siteCount" type="number" />
        <TextField label="Estimated value band" name="valueBand" placeholder="e.g. £50k–£100k pa" />
        <TextField label="Contract term (months)" name="termMonths" type="number" />
        <TextField label="Tender deadline" name="deadline" type="date" />
        <TextField label="Framework name" name="frameworkName" />
        <TextField label="Current provider" name="currentProvider" />
        <CheckboxField label="PQQ required" name="pqqRequired" />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="font-mono-label mb-2" style={{ color: "var(--copper-bright)" }}>
          Documents
        </legend>
        <FileDropField
          label="ITT / specification"
          name="document"
          accept=".pdf,.doc,.docx"
          hint="Drag the tender pack straight in, or click to browse."
          maxBytes={10 * 1024 * 1024}
        />
        <label className="flex flex-col gap-1.5">
          <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
            Additional detail
          </span>
          <textarea name="message" rows={4} className="border px-3 py-2" style={inputStyle} />
        </label>
      </fieldset>

      <TurnstileWidget theme="dark" />

      <button
        type="submit"
        disabled={pending}
        className="font-mono-label self-start px-6 py-3.5 disabled:opacity-60"
        style={{ background: "var(--flame)", color: "var(--ink)", borderRadius: "var(--radius)" }}
      >
        {pending ? "Submitting…" : "Submit tender enquiry"}
      </button>

      <p role="status" className="text-sm" style={{ color: state.status === "error" ? "var(--amber)" : "var(--steel-dim)" }}>
        {state.status === "error" ? state.message : "We return completed PQQ documentation within 24 hours."}
      </p>
    </form>
  );
}

function TextField({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
        {label}
        {required ? " *" : ""}
      </span>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={`border px-3 py-2 ${type === "date" ? "field-date" : ""}`}
        style={inputStyle}
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  required = false,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
        {label}
        {required ? " *" : ""}
      </span>
      <select
        id={id}
        name={name}
        required={required}
        className="field-select border px-3 py-2"
        style={inputStyle}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({ label, name }: { label: string; name: string }) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex items-center gap-2">
      <input id={id} name={name} type="checkbox" className="h-4 w-4" />
      <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
        {label}
      </span>
    </label>
  );
}
