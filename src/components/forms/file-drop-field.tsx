"use client";

import { useId, useRef, useState } from "react";

/**
 * "Attach the ITT" is the entire point of the tenders page, and it was a
 * browser-default `Choose file  No file chosen` control sitting in the middle
 * of an art-directed dark form. This is the same input — a real
 * `<input type="file">`, so it submits with the form, works without any of
 * this component's JavaScript, and keeps native keyboard and a11y behaviour —
 * with a drop target and a filename readout drawn on top of it.
 *
 * The input stays in the layout (opacity 0, covering the zone) rather than
 * being replaced by a button, so clicking anywhere in the zone opens the
 * picker with no click forwarding and no focus juggling.
 */
export function FileDropField({
  label,
  name,
  accept,
  hint,
  maxBytes,
}: {
  label: string;
  name: string;
  accept: string;
  hint: string;
  /** Rejected client-side for a fast answer; the server re-checks regardless. */
  maxBytes: number;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readable = (bytes: number) =>
    bytes >= 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.max(1, Math.round(bytes / 1024))} KB`;

  const adopt = (file: File | undefined) => {
    if (!file) {
      setFileName(null);
      setFileSize(0);
      setError(null);
      return;
    }
    if (file.size > maxBytes) {
      setError(`${file.name} is ${readable(file.size)} — the limit is ${readable(maxBytes)}.`);
      setFileName(null);
      setFileSize(0);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setError(null);
    setFileName(file.name);
    setFileSize(file.size);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
        {label}
      </span>

      <div
        className="field-drop relative"
        data-dragging={dragging ? "true" : "false"}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const dropped = event.dataTransfer.files?.[0];
          if (!dropped || !inputRef.current) return;
          // Hand the dropped file to the real input so the form submits it.
          const transfer = new DataTransfer();
          transfer.items.add(dropped);
          inputRef.current.files = transfer.files;
          adopt(dropped);
        }}
      >
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          accept={accept}
          aria-describedby={`${id}-hint`}
          onChange={(event) => adopt(event.target.files?.[0])}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <label
          htmlFor={id}
          className="pointer-events-none flex flex-col items-start gap-1 px-4 py-5"
        >
          <span className="font-mono-label" style={{ color: "var(--copper-bright)" }}>
            {fileName ? "File attached" : "Drop a file here, or choose one"}
          </span>
          <span className="text-sm" style={{ color: "var(--paper)", overflowWrap: "anywhere" }}>
            {fileName ? `${fileName} · ${readable(fileSize)}` : hint}
          </span>
        </label>
      </div>

      <p
        id={`${id}-hint`}
        role={error ? "alert" : undefined}
        className="font-mono-label"
        style={{ color: error ? "var(--amber)" : "var(--steel-dim)" }}
      >
        {error ?? `Optional · ${accept.replaceAll(".", "").toUpperCase()} · up to ${readable(maxBytes)}`}
      </p>
    </div>
  );
}
