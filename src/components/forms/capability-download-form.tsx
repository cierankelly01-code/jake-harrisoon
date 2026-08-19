"use client";

import { useActionState, useEffect, useRef } from "react";
import { downloadCapabilityStatement, type CapabilityActionState } from "@/app/capability/actions";

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
      {/* Honeypot — visually hidden, not display:none, so it behaves the same for AT and bots */}
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Organisation" name="organisation" />
        <Field label="Email" name="email" type="email" required />
        <Field label="Role" name="role" />
      </div>
      <Field label="Sector" name="sector" />

      <button
        type="submit"
        disabled={pending}
        className="font-mono-label px-5 py-3 transition-opacity disabled:opacity-60"
        style={{ background: "var(--flame)", color: "var(--paper)", borderRadius: "var(--radius)" }}
      >
        {pending ? "Preparing PDF…" : "Download capability statement"}
      </button>

      <p id="capability-form-status" role="status" className="text-sm" style={{ color: "var(--steel-dim)" }}>
        {state.status === "error" && <span style={{ color: "var(--amber)" }}>{state.message}</span>}
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
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
        {label}
        {required ? " *" : ""}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={name === "email" ? "email" : "on"}
        className="border px-3 py-2"
        style={{
          borderColor: "var(--border-hairline-dark)",
          background: "var(--ink)",
          color: "var(--paper)",
          borderRadius: "var(--radius)",
        }}
      />
    </label>
  );
}
