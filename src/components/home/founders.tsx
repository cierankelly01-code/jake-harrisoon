import { business } from "@/lib/content/business";
import { FactOrPlaceholder } from "@/components/ui/placeholder";

/**
 * Team faces and names — the local-service blueprint's trust section for
 * anyone letting a stranger into their home or onto their site.
 *
 * There is no photography yet (see CLIENT_ASSETS_NEEDED.md), and a stock
 * photo of a generic smiling engineer would be worse than nothing: it is the
 * single fastest way to look like every other trade template on the internet.
 * So each director gets a drawn competency-card instead — the same object a
 * Gas Safe engineer hands you on the doorstep — which is honest, in the art
 * direction, and swaps to a real photograph the day one exists.
 *
 * Folded into Standards (standards.tsx) as one merged section rather than
 * two — "borrowed credibility" and "who turns up" are both trust content
 * back-to-back, and mobile length was a named priority. This file now
 * exports the pieces Standards assembles: the name-formatter and the card
 * grid itself, with no section/heading of its own.
 */
/** "Jake and Harrison", "Jake, Harrison and Sam", "Jake". */
export function formatDirectorNames(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export function DirectorCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6">
      {business.directors.map((director, index) => (
        <CompetencyCard
          key={director.firstName}
          firstName={director.firstName}
          surname={director.surname}
          qualification={director.qualification}
          index={index}
        />
      ))}
    </div>
  );
}

function CompetencyCard({
  firstName,
  surname,
  qualification,
  index,
}: {
  firstName: string;
  surname: string | null;
  qualification: string;
  index: number;
}) {
  return (
    <article
      className="reveal reveal--panel flex flex-col border"
      style={{
        borderColor: "var(--border-hairline-dark)",
        borderRadius: "var(--radius)",
        // Elevated-surface token, not --ink: the merged Standards section
        // this now lives inside is itself --ink, so the card needs to sit
        // visibly above its own background rather than disappear into it.
        background: "var(--slate)",
        ["--reveal-delay" as string]: String(index),
      }}
    >
      <header
        className="font-mono-label flex items-center justify-between border-b px-3 py-2 sm:px-4 sm:py-3"
        style={{ borderColor: "var(--border-hairline-dark)", color: "var(--steel-dim)" }}
      >
        <span>DIR {String(index + 1).padStart(2, "0")}</span>
        <span style={{ color: "var(--copper-bright)" }}>Gas Safe</span>
      </header>

      {/* Drawn portrait plate — a competency card, not a stock headshot. */}
      <div className="grain relative aspect-[4/3] overflow-hidden" style={{ background: "var(--slate-deep)" }}>
        <svg viewBox="0 0 320 240" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <pattern id={`hatch-${index}`} width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="var(--copper)" strokeWidth="1" opacity="0.25" />
            </pattern>
          </defs>
          <rect width="320" height="240" fill={`url(#hatch-${index})`} />
          <circle cx="160" cy="104" r="46" fill="none" stroke="var(--copper-bright)" strokeWidth="1.5" />
          <text
            x="160"
            y="120"
            textAnchor="middle"
            fontFamily="var(--font-display)"
            fontSize="44"
            fontWeight="700"
            fill="var(--paper)"
            letterSpacing="-1"
          >
            {firstName.charAt(0)}
          </text>
          <line x1="40" y1="176" x2="280" y2="176" stroke="var(--copper)" strokeWidth="1" opacity="0.6" />
          <text x="40" y="198" fontFamily="var(--font-mono)" fontSize="11" fill="var(--steel-dim)" letterSpacing="1.4">
            PHOTOGRAPH PENDING
          </text>
        </svg>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-3 py-3 sm:gap-2 sm:px-4 sm:py-5">
        <h3 className="font-display text-lg sm:text-xl" style={{ color: "var(--paper)" }}>
          {firstName}{" "}
          <span className="align-middle">
            <FactOrPlaceholder value={surname} label={`${firstName.toUpperCase()} SURNAME`} compact />
          </span>
        </h3>
        <p className="text-xs sm:text-sm" style={{ color: "var(--steel-dim)" }}>
          {qualification}. Co-owner, on the tools.
        </p>
      </div>
    </article>
  );
}
