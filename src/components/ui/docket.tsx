import Image from "next/image";
import Link from "next/link";
import { DocketFallbackArt } from "./docket-fallback-art";

type DocketMeta = { label: string; value: string };

type DocketImage = { src: string; alt: string };

export type DocketProps = {
  variant: "domestic" | "commercial";
  refCode: string;
  status: { label: string; value: string };
  title: string;
  description: string;
  meta: DocketMeta[]; // up to 4 columns
  tags?: string[]; // commercial footer row: "RAMS ISSUED · CP12 CURRENT · ..."
  image?: DocketImage | null; // null / omitted => generated fallback art
  className?: string;
  /** When set, the whole docket becomes one click target. */
  href?: string;
  /** Call-to-action text shown in the docket's footer when `href` is set. */
  action?: string;
  /** Stagger index for the sitewide reveal system. */
  revealIndex?: number;
};

/**
 * The Docket — signature element from the brand system. Two variants
 * (domestic job docket, commercial contract docket) sharing one shape:
 * ref + status, image band, title + description, mono metadata row,
 * optional commercial tag row. Hairline copper rules, zero shadows,
 * 2px max radius.
 */
export function Docket({
  variant,
  refCode,
  status,
  title,
  description,
  meta,
  tags,
  image,
  className,
  href,
  action,
  revealIndex = 0,
}: DocketProps) {
  const isCommercial = variant === "commercial";
  return (
    <article
      className={`docket reveal reveal--panel relative flex flex-col border ${href ? "docket--linked" : ""} ${className ?? ""}`}
      style={{
        borderColor: "var(--border-hairline)",
        borderRadius: "var(--radius)",
        background: isCommercial ? "var(--slate)" : "var(--surface)",
        ["--reveal-delay" as string]: String(revealIndex),
      }}
    >
      <header
        className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-3 font-mono-label"
        style={{
          color: isCommercial ? "var(--steel-dim)" : "var(--steel)",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        {/* Each atom stays unbroken, but the line may wrap at the separator.
            Blanket `nowrap` on the whole span pushed narrow dockets ~41px
            past the viewport at tablet widths. */}
        <span className="min-w-0">
          <span style={{ whiteSpace: "nowrap" }}>
            {isCommercial ? "CONTRACT REF" : "JOB REF"}
          </span>{" "}
          · <span style={{ whiteSpace: "nowrap" }}>{refCode}</span>
        </span>
        <span
          className="min-w-0"
          style={{
            color: status.value.toLowerCase().includes("ongoing")
              ? "var(--flame-glow)"
              : undefined,
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>{status.label}</span>{" "}
          <span style={{ whiteSpace: "nowrap" }}>{status.value}</span>
        </span>
      </header>

      <div className="docket__media aspect-[5/2] sm:aspect-[16/9] w-full overflow-hidden">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={640}
            height={360}
            className="h-full w-full object-cover"
            style={{ filter: "saturate(0.92) contrast(1.04)" }}
          />
        ) : (
          <DocketFallbackArt variant={variant} seed={revealIndex} />
        )}
      </div>

      <div
        className="px-4 py-4"
        style={{ borderBottom: "1px solid var(--border-hairline)" }}
      >
        <h3
          className="font-display text-lg leading-tight"
          style={{ color: isCommercial ? "var(--paper)" : "var(--ink)" }}
        >
          {href ? (
            <Link href={href} className="docket__link">
              <span className="absolute inset-0" aria-hidden="true" />
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        <p
          className="mt-2 text-sm"
          style={{ color: isCommercial ? "var(--steel-dim)" : "var(--steel)" }}
        >
          {description}
        </p>
      </div>

      <div
        className="grid flex-1 gap-3 px-4 py-4"
        style={{
          gridTemplateColumns: `repeat(${Math.min(meta.length, 4)}, minmax(0, 1fr))`,
          alignContent: "start",
          borderBottom: tags?.length || action ? "1px solid var(--border-hairline)" : undefined,
        }}
      >
        {meta.map((m) => (
          <div key={m.label} className="flex flex-col gap-1">
            <span
              className="font-mono-label"
              style={{ color: isCommercial ? "var(--steel-dim)" : "var(--steel)" }}
            >
              {m.label}
            </span>
            <span
              className="font-mono text-sm tabular-nums"
              style={{ color: isCommercial ? "var(--paper)" : "var(--ink)" }}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {tags && tags.length > 0 && (
        <div
          className="px-4 py-3 font-mono-label"
          style={{ color: "var(--flame-glow)" }}
          data-border-bottom={action ? "true" : undefined}
        >
          {tags.join(" · ")}
        </div>
      )}

      {action && (
        <div
          className="font-mono-label flex items-center justify-between px-4 py-3.5"
          style={{
            color: isCommercial ? "var(--paper)" : "var(--ink)",
            borderTop: tags?.length ? "1px solid var(--border-hairline)" : undefined,
          }}
        >
          {action}
          <span className="docket__arrow" aria-hidden="true">
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
        </div>
      )}
    </article>
  );
}
