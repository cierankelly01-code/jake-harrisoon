import Image from "next/image";
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
}: DocketProps) {
  const isCommercial = variant === "commercial";
  return (
    <article
      className={`border ${className ?? ""}`}
      style={{
        borderColor: "var(--border-hairline)",
        borderRadius: "var(--radius)",
        background: isCommercial ? "var(--slate)" : "var(--surface)",
      }}
    >
      <header
        className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-3 font-mono-label"
        style={{
          color: isCommercial ? "var(--steel-dim)" : "var(--steel)",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        <span style={{ whiteSpace: "nowrap" }}>
          {isCommercial ? "CONTRACT REF" : "JOB REF"} · {refCode}
        </span>
        <span
          style={{
            whiteSpace: "nowrap",
            color: status.value.toLowerCase().includes("ongoing")
              ? "var(--flame-glow)"
              : undefined,
          }}
        >
          {status.label} {status.value}
        </span>
      </header>

      <div className="aspect-[16/9] w-full overflow-hidden">
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
          <DocketFallbackArt variant={variant} />
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
          {title}
        </h3>
        <p
          className="mt-2 text-sm"
          style={{ color: isCommercial ? "var(--steel-dim)" : "var(--steel)" }}
        >
          {description}
        </p>
      </div>

      <div
        className="grid gap-3 px-4 py-4"
        style={{
          gridTemplateColumns: `repeat(${Math.min(meta.length, 4)}, minmax(0, 1fr))`,
          borderBottom: tags?.length ? "1px solid var(--border-hairline)" : undefined,
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
        >
          {tags.join(" · ")}
        </div>
      )}
    </article>
  );
}
