"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { business } from "@/lib/content/business";
import { DivisionToggle } from "@/components/division/division-toggle";
import { useDivision } from "@/components/division/division-provider";
import { emailLink, phoneLink } from "@/lib/content/contact-links";
import { HAS_PUBLISHED_PRICES } from "@/lib/content/domestic-prices";

/**
 * The nav must not promise something the page cannot deliver. While
 * `domestic-prices.ts` holds no confirmed figures, `/prices` explains how
 * pricing works rather than listing prices, so the link says that. It becomes
 * "Prices" on its own the moment a real figure is signed off — one flag,
 * every label, no stale copy left behind.
 */
const PRICES_LABEL = HAS_PUBLISHED_PRICES ? "Prices" : "How we price";

/**
 * The navigation follows the division toggle. Previously it did not: a
 * homeowner who switched to Domestic still had "Capability" and "Tenders"
 * across the top, which is PQQ vocabulary aimed at somebody else entirely.
 * The other division's routes stay reachable from the footer and from the
 * toggle itself, so nothing is orphaned.
 */
const NAV_BY_DIVISION = {
  commercial: [
    { href: "/capability", label: "Capability" },
    { href: "/tenders", label: "Tenders" },
    { href: "/care-plans", label: "Care Plans" },
    { href: "/contact", label: "Contact" },
  ],
  domestic: [
    { href: "/boiler-quote", label: "Instant Quote" },
    { href: "/prices", label: PRICES_LABEL },
    { href: "/care-plans", label: "Care Plans" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

/** Everything, for the mobile drawer — one place, nothing hidden. */
const ALL_LINKS = [
  { href: "/boiler-quote", label: "Instant Quote" },
  { href: "/prices", label: PRICES_LABEL },
  { href: "/care-plans", label: "Care Plans" },
  { href: "/capability", label: "Capability" },
  { href: "/tenders", label: "Tenders & PQQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { division } = useDivision();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const phone = phoneLink();
  const email = emailLink();

  // Sticky nav: transparent-ish → solid with a hairline once past the fold edge,
  // and the utility strip rolls away to give the viewport back.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Drawer behaviour: lock the page, trap focus, ESC closes, focus returns.
  useEffect(() => {
    if (!menuOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const trigger = menuButtonRef.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      // Safari does not focus a <button> on click, so `document.activeElement`
      // is <body> there — truthy, and `body.focus()` is a no-op, which dropped
      // focus to the document root when the drawer closed. Fall through to the
      // trigger unless we captured a genuine focusable element.
      const restoreTo =
        previouslyFocused instanceof HTMLElement && previouslyFocused !== document.body
          ? previouslyFocused
          : trigger;
      restoreTo?.focus?.();
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility strip — desktop only, rolls away on scroll */}
      {/* `utility-strip` is hidden on short viewports as well as narrow ones —
          see globals.css. A landscape phone matches the `md` width breakpoint,
          so without the height query this strip plus the nav ate 27% of a
          375px-tall screen before a single word of content. */}
      <div
        /* lg, not md: at 768 the three items plus the coverage line do not fit
           on one line, and forcing them to wrap broke words mid-character.
           Below 1024 the same routes are in the drawer and the sticky call
           bar, so nothing is lost by hiding the strip. */
        className="utility-strip hidden overflow-hidden lg:block"
        style={{
          background: "var(--ink)",
          height: scrolled ? 0 : "2.125rem",
          transition: `height var(--duration-transition) var(--ease-mech)`,
        }}
      >
        <div
          className="mx-auto flex max-w-[100rem] items-center justify-between px-6 font-mono-label"
          style={{ height: "2.125rem", color: "var(--steel-dim)" }}
        >
          {/* Unconfirmed contact details resolve to a working route rather
              than three amber placeholder chips above the headline. The
              audit trail for those facts still renders in the footer and on
              /capability, where a warning chip is informative rather than
              the first thing a customer sees. */}
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span>TEL</span>
              <Link href={phone.href} className="link-draw" style={{ color: "var(--paper)" }}>
                {phone.isDirect ? phone.label : "Request a callback"}
              </Link>
            </span>
            <span className="flex items-center gap-2">
              <span>EMAIL</span>
              <Link href={email.href} className="link-draw" style={{ color: "var(--paper)" }}>
                {email.isDirect ? email.label : "Send an enquiry"}
              </Link>
            </span>
            {business.gasSafeNumber && (
              <span className="hidden items-center gap-2 lg:flex">
                <span>GAS SAFE</span>
                <span style={{ color: "var(--paper)" }}>{business.gasSafeNumber}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {business.accreditationsHeld.length > 0 ? (
              business.accreditationsHeld.map((a) => <span key={a}>{a}</span>)
            ) : (
              <span style={{ color: "var(--steel-dim)" }}>Covering {business.base}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav
        aria-label="Primary"
        className="relative border-b"
        style={{
          background: scrolled
            ? "color-mix(in srgb, var(--ink) 88%, transparent)"
            : "var(--surface-dark)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderColor: scrolled ? "var(--border-hairline-dark)" : "transparent",
          transition: `background-color var(--duration-transition) var(--ease-mech), border-color var(--duration-transition) var(--ease-mech)`,
        }}
      >
        <div
          className="mx-auto flex max-w-[100rem] items-center justify-between gap-4 px-6"
          style={{ height: "var(--header-height)" }}
        >
          <Link href="/" className="flex flex-col leading-none" aria-label="Marmion Building Services — home">
            <span className="font-display text-xl" style={{ color: "var(--paper)" }}>
              MARMION
            </span>
            <span
              className="font-mono-label mt-1"
              style={{ color: "var(--copper-bright)", letterSpacing: "0.18em" }}
            >
              BUILDING SERVICES
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV_BY_DIVISION[division].map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className="font-mono-label link-draw transition-colors hover:!text-paper"
                  style={{
                    color: active ? "var(--paper)" : "var(--steel-dim)",
                    transitionDuration: "var(--duration-micro)",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <DivisionToggle tone="dark" />
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="flex items-center gap-2 border px-3 font-mono-label lg:hidden"
              style={{
                height: "44px",
                borderColor: "var(--border-hairline-dark)",
                color: "var(--paper)",
                borderRadius: "var(--radius)",
              }}
            >
              <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden="true" fill="none">
                <path
                  d={menuOpen ? "M1 1L13 11M13 1L1 11" : "M0 1h14M0 6h14M0 11h14"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="hidden sm:inline">{menuOpen ? "Close" : "Menu"}</span>
              <span className="sr-only sm:hidden">
                {menuOpen ? "Close menu" : "Open menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Scroll progress — zero JS where scroll-driven animations are supported */}
        <div
          aria-hidden="true"
          className="scroll-progress absolute inset-x-0 bottom-0 h-px"
          style={{ background: "var(--flame-glow)" }}
        />
      </nav>

      {/* Phone-width audience switch. Below 640px there is no room for this in
          the action row beside the wordmark and the menu trigger, so it gets
          its own full-width strip rather than being buried in the drawer. */}
      <div
        className="sm:hidden"
        style={{
          background: "var(--surface-dark)",
          borderBottom: "1px solid var(--border-hairline-dark)",
        }}
      >
        <div className="px-5 py-1.5">
          <DivisionToggle tone="dark" block />
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-[calc(var(--header-height)+2.75rem)] z-40 sm:top-[var(--header-height)] lg:hidden"
          style={{ background: "color-mix(in srgb, var(--ink) 70%, transparent)" }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            id="mobile-menu"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="grain relative max-h-full overflow-y-auto border-b px-6 pb-10 pt-6"
            style={{
              background: "var(--ink)",
              borderColor: "var(--border-hairline-dark)",
              overscrollBehavior: "contain",
              paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom))",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative z-10 flex flex-col">
              <span className="font-mono-label" style={{ color: "var(--copper-bright)" }}>
                Menu
              </span>
              <div className="mt-4 flex flex-col">
                {ALL_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className="font-display border-b py-4 text-2xl"
                    style={{ color: "var(--paper)", borderColor: "var(--border-hairline-dark)" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Hidden below sm: at those widths the same control is already
                  on screen in the header strip above the drawer, and two live
                  toggles for one piece of state reads as a bug. */}
              <div className="mt-8 hidden flex-col gap-4 sm:flex">
                <span className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
                  Division
                </span>
                <DivisionToggle tone="dark" />
              </div>

              <Link href={phone.href} className="btn btn--primary mt-8">
                {phone.isDirect ? `Call ${phone.label}` : "Request a callback"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
