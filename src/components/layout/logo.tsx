/**
 * Wordmark. A small flame mark sits before the name.
 *
 * The tile keeps the brand green on both light and dark surfaces — it is the
 * one place the accent colour is allowed to appear without being an action,
 * because a logo is not a button. The flame itself is near-black rather than
 * white: white on `--flame` measures 2.0:1 and vanished at small sizes, while
 * `--ink` on `--flame` is 9.9:1 and reads as a cut-out.
 */
export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-[10px]"
        style={{ background: "var(--flame)", color: "var(--ink)" }}
        aria-hidden="true"
      >
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
          <path
            d="M9 1c1 3.2 4.8 5 4.8 9.6A4.8 4.8 0 019 15.4a4.8 4.8 0 01-4.8-4.8C4.2 7.4 6.6 6.3 6.6 3.6 7.6 4.6 8 5.6 8 6.6 8.6 5 9 3.2 9 1z"
            fill="currentColor"
          />
          <path d="M9 18.5c-2.3 0-3.7-1-3.7-1s1.4-1 3.7-1 3.7 1 3.7 1-1.4 1-3.7 1z" fill="currentColor" opacity="0.7" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className="font-display text-[1.35rem] tracking-[-0.03em]"
          style={{ color: onDark ? "#fff" : "var(--ink)" }}
        >
          Hartson
        </span>
        <span
          className="mt-0.5 text-[0.75rem] font-semibold uppercase tracking-[0.09em]"
          style={{ color: onDark ? "var(--steel-dim)" : "var(--steel)" }}
        >
          Heating
        </span>
      </span>
    </span>
  );
}
