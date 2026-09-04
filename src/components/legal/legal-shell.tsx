import type { ReactNode } from "react";

/**
 * Shared chrome for /privacy and /terms so the two never drift apart.
 *
 * Legal pages on trade sites are usually a wall of unformatted generator
 * output, which is exactly why nobody reads them — and an unread privacy
 * notice does not discharge the UK GDPR transparency duty (Art. 12: the
 * information must be "concise, transparent, intelligible and easily
 * accessible", in "clear and plain language"). So these are set as
 * readable documents in the site's own typography: a numbered contents
 * block, sheet-numbered sections, short paragraphs, one idea each.
 */

export function LegalShell({
  eyebrow,
  title,
  intro,
  lastUpdated,
  contents,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdated: string;
  contents: { id: string; label: string }[];
  children: ReactNode;
}) {
  return (
    <div
      className="mx-auto max-w-3xl px-6"
      style={{ paddingTop: "var(--space-section-mobile)", paddingBottom: "var(--space-section-mobile)" }}
    >
      <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
        {eyebrow}
      </span>
      <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl" style={{ color: "var(--ink)" }}>
        {title}
      </h1>
      <p className="mt-5 text-lg" style={{ color: "var(--steel)" }}>
        {intro}
      </p>

      <div
        className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-y py-4 font-mono-label"
        style={{ borderColor: "var(--border-hairline)", color: "var(--steel)" }}
      >
        <span>Last updated {lastUpdated}</span>
        <span>Version 1.0 — pre-launch draft</span>
      </div>

      {/* The one thing a client must not miss about this document. */}
      <div
        className="mt-6 border p-5"
        style={{
          borderColor: "var(--amber-ink)",
          borderRadius: "var(--radius)",
          background: "var(--paper-raised)",
        }}
        role="note"
      >
        <p className="font-mono-label" style={{ color: "var(--amber-ink)" }}>
          Not yet reviewed by a solicitor
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--steel)" }}>
          This document was drafted to describe accurately what this website actually does with
          data, and it is written to be understood rather than to be defensive. It has{" "}
          <strong style={{ color: "var(--ink)" }}>not</strong> been reviewed by a qualified
          solicitor and must be before the site goes live. Anywhere a registration detail is
          still outstanding it is marked below rather than guessed at.
        </p>
      </div>

      <nav aria-label="Contents" className="mt-12">
        <h2 className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
          Contents
        </h2>
        <ol className="mt-4 border-t" style={{ borderColor: "var(--border-hairline)" }}>
          {contents.map(({ id, label }, i) => (
            <li key={id} className="border-b" style={{ borderColor: "var(--border-hairline)" }}>
              <a href={`#${id}`} className="flex items-baseline gap-4 py-3 text-sm">
                <span className="font-mono-label tabular-nums" style={{ color: "var(--copper-ink)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="link-draw" style={{ color: "var(--ink)" }}>
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-4">{children}</div>
    </div>
  );
}

export function LegalSection({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-14 scroll-mt-28">
      <div className="section-index" data-index={String(index).padStart(2, "0")}>
        <h2 className="font-display text-2xl md:text-3xl" style={{ color: "var(--ink)" }}>
          {title}
        </h2>
      </div>
      <div
        className="mt-5 flex flex-col gap-4 text-base leading-relaxed"
        style={{ color: "var(--steel)" }}
      >
        {children}
      </div>
    </section>
  );
}

/** Bulleted list in the site's register style — hairline rules, no dots. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="border-t" style={{ borderColor: "var(--border-hairline)" }}>
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-4 border-b py-3 text-sm"
          style={{ borderColor: "var(--border-hairline)" }}
        >
          <span
            className="font-mono-label shrink-0 tabular-nums"
            style={{ color: "var(--copper-ink)" }}
            aria-hidden="true"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Emphasised inline term, used for data categories and third-party names. */
export function Term({ children }: { children: ReactNode }) {
  return <strong style={{ color: "var(--ink)", fontWeight: 500 }}>{children}</strong>;
}
