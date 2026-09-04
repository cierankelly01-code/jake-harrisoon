"use client";

import { useActionState, useEffect, useRef } from "react";
import { downloadCapabilityStatement, type CapabilityActionState } from "@/app/capability/actions";
import { TurnstileWidget } from "@/components/security/turnstile-widget";

const initialState: CapabilityActionState = { status: "idle" };

function base64ToBlob(base64: string, mime: string) {
  const bytes = atob(base64);
  const array = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) array[i] = bytes.charCodeAt(i);
  return new Blob([array], { type: mime });
}

export function CapabilityDownloadForm() {
  const [state, formAction, pending] = useActionState(downloadCapabilityStatement, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success" && state.pdfBase64) {
      const blob = base64ToBlob(state.pdfBase64, "application/pdf");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "marmion-capability-statement.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-4 border p-6"
      style={{ borderColor: "var(--border-hairline-dark)", background: "var(--slate)", borderRadius: "var(--radius)" }}
      aria-describedby="capability-form-status"
    >
      {/* Honeypot — taken out of the layout entirely so it cannot be seen,
          tabbed to, or announced. */}
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
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <h2 className="font-display text-xl" style={{ color: "var(--paper)" }}>
          Download the capability statement
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--steel-dim)" }}>
          Two fields. The PDF downloads immediately — no waiting on an email to arrive.
        </p>
      </div>

      {/* Five fields to download a PDF is friction with no payoff: role,
          organisation and sector were all optional and none of them gate the
          document. Only the two we genuinely need to send a copy remain. */}
      <div className="grid gap-4">
        <Field label="Name" name="name" autoComplete="name" required />
        <Field label="Work email" name="email" type="email" autoComplete="email" required />
        <Field label="Organisation" name="organisation" autoComplete="organization" />
      </div>

      <TurnstileWidget theme="dark" />

      <button type="submit" disabled={pending} className="btn btn--primary">
        {pending ? "Preparing PDF…" : "Download capability statement"}
      </button>

      <p id="capability-form-status" role="status" className="text-sm" style={{ color: "var(--steel-dim)" }}>
        {state.status === "error" && <span style={{ color: "var(--amber)" }} role="alert">{state.message}</span>}
        {state.status === "success" && "Your download has started. We've also emailed a copy."}
        {state.status === "idle" && "PDF downloads instantly. We'll also email you a copy."}
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  const id = `capability-${name}`;
  return (
    <div>
      <label htmlFor={id} className="font-mono-label block" style={{ color: "var(--steel-dim)" }}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-1.5 w-full border px-3 py-2.5"
        style={{
          borderColor: "var(--border-hairline-dark)",
          background: "var(--ink)",
          color: "var(--paper)",
          borderRadius: "var(--radius)",
        }}
      />
    </div>
  );
}
