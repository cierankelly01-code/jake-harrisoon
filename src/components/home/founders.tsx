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
 */
/** "Jake and Harrison", "Jake, Harrison and Sam", "Jake". */
function formatNames(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export function Founders() {
  return (
    <section
      aria-labelledby="founders-heading"
      className="border-y"
      style={{ background: "var(--surface-raised)", borderColor: "var(--border-hairline)" }}
    >
      <div
        className="mx-auto max-w-[100rem] px-6"
        style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
      >
        <div className="grid gap-7 sm:gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="section-index font-mono-label" data-index="05" style={{ color: "var(--copper-ink)" }}>
              Who turns up
            </span>
            <h2 id="founders-heading" className="font-display mt-4 text-3xl" style={{ color: "var(--ink)" }}>
              Two engineers, not a call centre.
            </h2>
            <p className="mt-6 max-w-[46ch] text-lg" style={{ color: "var(--steel)" }}>
              {/* Built from the array rather than indexing [0] and [1], so
                  dropping or adding a director cannot throw on the homepage. */}
              {business.tradingName} is owned {business.ownership} by{" "}
              {formatNames(business.directors.map((d) => d.firstName))}, both Gas Safe registered
              engineers, both still on the tools.
            </p>
            <p className="mt-4 max-w-[46ch] text-base" style={{ color: "var(--steel)" }}>
              That is the whole reason the price does not move after the survey: the person who quoted
              your job is the person who has to do it. There is nobody to blame it on and nobody to
              hand it off to.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t pt-6" style={{ borderColor: "var(--border-hairline)" }}>
              <div>
                <dt className="font-mono-label" style={{ color: "var(--steel)" }}>
                  Ownership
                </dt>
                <dd className="font-display mt-1 text-xl" style={{ color: "var(--ink)" }}>
                  {business.ownership}
                </dd>
              </div>
              <div>
                <dt className="font-mono-label" style={{ color: "var(--steel)" }}>
                  Trading since
                </dt>
                <dd className="font-display mt-1 text-xl" style={{ color: "var(--ink)" }}>
                  <FactOrPlaceholder value={business.established} label="ESTABLISHED" compact />
                </dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
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
        </div>
      </div>
    </section>
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
        borderColor: "var(--border-hairline)",
        borderRadius: "var(--radius)",
        background: "var(--ink)",
        ["--reveal-delay" as string]: String(index),
      }}
    >
      <header
        className="font-mono-label flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: "var(--border-hairline-dark)", color: "var(--steel-dim)" }}
      >
        <span>Director {String(index + 1).padStart(2, "0")}</span>
        <span style={{ color: "var(--copper-bright)" }}>Gas Safe</span>
      </header>

      {/* Drawn portrait plate — a competency card, not a stock headshot. */}
      <div className="grain relative aspect-[16/9] overflow-hidden sm:aspect-[4/3]" style={{ background: "var(--slate-deep)" }}>
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

      <div className="flex flex-1 flex-col gap-2 px-4 py-5">
        <h3 className="font-display text-xl" style={{ color: "var(--paper)" }}>
          {firstName}{" "}
          <span className="align-middle">
            <FactOrPlaceholder value={surname} label={`${firstName.toUpperCase()} SURNAME`} compact />
          </span>
        </h3>
        <p className="text-sm" style={{ color: "var(--steel-dim)" }}>
          {qualification}. Co-owner, on the tools.
        </p>
      </div>
    </article>
  );
}
