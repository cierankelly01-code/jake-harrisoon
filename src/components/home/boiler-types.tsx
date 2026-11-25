import Link from "next/link";
import { Arrow } from "@/components/ui/icons";

/**
 * The three boiler types in plain words, each with a simple line drawing.
 * Every card goes to the same quote — the wizard asks which system you have.
 */
const TYPES = [
  {
    key: "combi",
    name: "Combi boilers",
    blurb:
      "Heating and hot water from one wall-hung unit, no tank or cylinder. The right choice for most flats and houses with one bathroom.",
    fit: "Best for: 1–3 bedrooms, one bathroom",
    art: <CombiArt />,
  },
  {
    key: "system",
    name: "System boilers",
    blurb:
      "Works with a hot water cylinder, so several taps and showers can run at once without the pressure dropping.",
    fit: "Best for: bigger homes, two or more bathrooms",
    art: <SystemArt />,
  },
  {
    key: "regular",
    name: "Regular boilers",
    blurb:
      "The traditional set-up with a cylinder and loft tanks. Usually the simplest swap if that is what you already have.",
    fit: "Best for: older homes, low mains pressure",
    art: <RegularArt />,
  },
];

export function BoilerTypes() {
  return (
    <section aria-labelledby="types-heading" className="container-x section">
      <div className="max-w-[60ch]">
        <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
          New boilers
        </span>
        <h2 id="types-heading" className="font-display mt-3 text-3xl" style={{ color: "var(--ink)" }}>
          Which boiler do you need?
        </h2>
        <p className="mt-4 text-base" style={{ color: "var(--steel)" }}>
          Most people swap like for like. If you&rsquo;re thinking of changing type, we&rsquo;ll tell you
          at the survey whether it&rsquo;s worth it before you spend anything.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {TYPES.map((type, index) => (
          <Link
            key={type.key}
            href="/boiler-quote"
            className="card reveal reveal--panel flex flex-col overflow-hidden"
            style={{ ["--reveal-delay" as string]: String(index) }}
          >
            <div
              className="flex h-32 items-end justify-center px-6 pt-6 md:h-44"
              style={{ background: "var(--paper-raised)" }}
              aria-hidden="true"
            >
              {type.art}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-xl" style={{ color: "var(--ink)" }}>
                {type.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: "var(--steel)" }}>
                {type.blurb}
              </p>
              <p className="mt-4 text-xs font-semibold" style={{ color: "var(--copper-ink)" }}>
                {type.fit}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold" style={{ color: "var(--copper-ink)" }}>
                Get a {type.key} boiler price
                <Arrow />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

const stroke = { stroke: "var(--ink)", strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Flame({ x, y }: { x: number; y: number }) {
  return (
    <path
      transform={`translate(${x} ${y})`}
      d="M0 -12c2 4 6 6 6 11a6 6 0 01-12 0c0-3 2-4 2-7 1 1 2 2 2 3 1-2 2-4 2-7z"
      fill="var(--flame)"
    />
  );
}

function Boiler({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="76" height="96" rx="8" {...stroke} />
      <rect x="0" y="66" width="76" height="30" rx="8" {...stroke} />
      <line x1="0" y1="66" x2="76" y2="66" {...stroke} />
      <circle cx="58" cy="81" r="6" {...stroke} />
      <circle cx="16" cy="81" r="2.5" fill="var(--ink)" />
      <circle cx="26" cy="81" r="2.5" fill="var(--ink)" />
      <Flame x={38} y={40} />
      <line x1="14" y1="96" x2="14" y2="118" {...stroke} />
      <line x1="30" y1="96" x2="30" y2="118" {...stroke} />
      <line x1="46" y1="96" x2="46" y2="118" {...stroke} />
      <line x1="62" y1="96" x2="62" y2="118" {...stroke} />
    </g>
  );
}

function Cylinder({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="54" height="104" rx="18" {...stroke} />
      <line x1="0" y1="26" x2="54" y2="26" {...stroke} opacity="0.35" />
      <line x1="0" y1="78" x2="54" y2="78" {...stroke} opacity="0.35" />
      <circle cx="27" cy="52" r="5" fill="var(--flame)" />
    </g>
  );
}

function Tank({ x, y, w = 60 }: { x: number; y: number; w?: number }) {
  return <rect x={x} y={y} width={w} height="26" rx="6" {...stroke} />;
}

function CombiArt() {
  return (
    <svg viewBox="0 0 160 150" className="h-full w-auto" aria-hidden="true">
      <Boiler x={42} y={14} />
    </svg>
  );
}

function SystemArt() {
  return (
    <svg viewBox="0 0 200 150" className="h-full w-auto" aria-hidden="true">
      <Boiler x={20} y={14} />
      <Cylinder x={128} y={28} />
      <path d="M96 60h20a6 6 0 016 6v10" {...stroke} />
    </svg>
  );
}

function RegularArt() {
  return (
    <svg viewBox="0 0 230 150" className="h-full w-auto" aria-hidden="true">
      <Tank x={132} y={6} w={44} />
      <Tank x={132} y={40} w={70} />
      <Boiler x={20} y={30} />
      <Cylinder x={150} y={78} />
      <path d="M96 84h34a6 6 0 016 6v6" {...stroke} />
      <path d="M154 66v12" {...stroke} />
    </svg>
  );
}
