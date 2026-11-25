"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { DivisionToggle } from "@/components/division/division-toggle";
import { useDivision } from "@/components/division/division-provider";
import { phoneLink } from "@/lib/content/contact-links";
import { HAS_PUBLISHED_PRICES } from "@/lib/content/domestic-prices";
import { COMMERCIAL_ENABLED } from "@/lib/division-shared";
import { track } from "@/lib/analytics";
import { Logo } from "@/components/layout/logo";

const PRICES_LABEL = HAS_PUBLISHED_PRICES ? "Prices" : "How we price";

const NAV_BY_DIVISION = {
  commercial: [
    { href: "/capability", label: "Capability" },
    { href: "/tenders", label: "Tenders" },
    { href: "/care-plans", label: "Care plans" },
    { href: "/contact", label: "Contact" },
  ],
  domestic: [
    { href: "/boiler-quote", label: "New boilers" },
    { href: "/care-plans", label: "Care plans" },
    { href: "/prices", label: PRICES_LABEL },
    { href: "/contact", label: "Contact" },
  ],
} as const;

const ALL_LINKS = [
  { href: "/boiler-quote", label: "New boilers" },
  { href: "/care-plans", label: "Care plans" },
  { href: "/prices", label: PRICES_LABEL },
  ...(COMMERCIAL_ENABLED
    ? [
        { href: "/capability", label: "Capability" },
        { href: "/tenders", label: "Tenders & PQQ" },
      ]
    : []),
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
  const isDomestic = division === "domestic";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Drawer: lock scroll, trap focus, ESC closes, focus returns to trigger.
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
      // Safari doesn't focus buttons on click, so activeElement may be <body>.
      const restoreTo =
        previouslyFocused instanceof HTMLElement && previouslyFocused !== document.body
          ? previouslyFocused
          : trigger;
      restoreTo?.focus?.();
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50">
      <nav
        aria-label="Primary"
        className="relative"
        style={{
          background: "rgba(11,15,13,0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: scrolled
            ? "var(--shadow-nav)"
            : "0 1px 0 var(--border-hairline-dark)",
          transition: "box-shadow var(--duration-transition) var(--ease-enter)",
        }}
      >
        <div
          className="container-x flex items-center justify-between gap-4"
          style={{ height: "var(--header-height)" }}
        >
          <Link href="/" aria-label="Hartson Heating — home" className="shrink-0">
            <Logo onDark />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_BY_DIVISION[division].map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className="whitespace-nowrap rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors"
                  style={{
                    color: active ? "var(--flame)" : "var(--paper)",
                    background: active ? "rgba(47,211,122,0.14)" : "transparent",
                    transitionDuration: "var(--duration-micro)",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            {isDomestic && (
              <Link
                href="/emergency"
                aria-current={pathname === "/emergency" ? "page" : undefined}
                className="whitespace-nowrap rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors"
                style={{
                  color: "var(--amber)",
                  background:
                    pathname === "/emergency" ? "rgba(245,165,36,0.16)" : "transparent",
                }}
              >
                Emergency
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {COMMERCIAL_ENABLED && (
              <div className="hidden sm:block">
                <DivisionToggle tone="light" />
              </div>
            )}
            {phone.isDirect && (
              <Link
                href={phone.href}
                className="btn btn--ghost btn--sm hidden whitespace-nowrap xl:inline-flex"
                onClick={() => track("cta_click", { location: "header", action: "call" })}
              >
                <PhoneIcon />
                {phone.label}
              </Link>
            )}
            <Link
              href={isDomestic ? "/boiler-quote" : "/tenders"}
              className="btn btn--primary btn--sm hidden whitespace-nowrap sm:inline-flex"
              onClick={() => track("cta_click", { location: "header", action: "primary" })}
            >
              {isDomestic ? "Get my fixed price" : "Tender enquiry"}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
              style={{ background: "rgba(255,255,255,0.1)", color: "var(--paper)" }}
            >
              <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true" fill="none">
                <path
                  d={menuOpen ? "M2 1l14 12M16 1L2 13" : "M0 1h18M0 7h18M0 13h18"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>

      </nav>

      {COMMERCIAL_ENABLED && (
        <div
          className="sm:hidden"
          style={{
            background: "var(--ink)",
            borderBottom: "1px solid var(--border-hairline-dark)",
          }}
        >
          <div className="px-5 py-1.5">
            <DivisionToggle tone="light" block />
          </div>
        </div>
      )}

      {menuOpen && (
        <div
          className={`fixed inset-0 z-40 lg:hidden ${
            COMMERCIAL_ENABLED
              ? "top-[calc(var(--header-height)+2.75rem)] sm:top-[var(--header-height)]"
              : "top-[var(--header-height)]"
          }`}
          /* 0.8, not 0.6. At 0.6 the hero's outline buttons showed through
             below the drawer's own buttons and briefly read as four. */
          style={{ background: "rgba(5,8,6,0.8)" }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            id="mobile-menu"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="relative max-h-full overflow-y-auto px-5 pb-8 pt-4"
            style={{
              background: "var(--ink)",
              borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
              overscrollBehavior: "contain",
              paddingBottom: "calc(2rem + env(safe-area-inset-bottom))",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-col">
              {ALL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className="font-display flex items-center justify-between border-b py-4 text-xl"
                  style={{
                    color: "var(--paper)",
                    borderColor: "var(--border-hairline-dark)",
                  }}
                >
                  {link.label}
                  <Chevron />
                </Link>
              ))}
              {isDomestic && (
                <Link
                  href="/emergency"
                  aria-current={pathname === "/emergency" ? "page" : undefined}
                  className="font-display flex items-center justify-between py-4 text-xl"
                  style={{ color: "var(--amber)" }}
                >
                  Emergency plumbing
                  <Chevron />
                </Link>
              )}
            </div>

            {COMMERCIAL_ENABLED && (
              <div className="mt-6 hidden flex-col gap-3 sm:flex">
                <span className="font-mono-label" style={{ color: "var(--steel)" }}>
                  Division
                </span>
                <DivisionToggle tone="light" />
              </div>
            )}

            <div className="mt-6 grid gap-3">
              <Link href={isDomestic ? "/boiler-quote" : "/tenders"} className="btn btn--primary">
                {isDomestic ? "Get my fixed price" : "Submit a tender enquiry"}
              </Link>
              <Link href={phone.href} className="btn btn--secondary-dark">
                {phone.isDirect && <PhoneIcon />}
                {phone.isDirect ? `Call ${phone.label}` : "Request a callback"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 1h3l1.5 4L5.5 6.5a10 10 0 004 4L11 9l4 1.5v3a1.5 1.5 0 01-1.7 1.5A13.5 13.5 0 011.1 2.7 1.5 1.5 0 012.6 1H3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Chevron() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true" style={{ color: "var(--steel-dim)" }}>
      <path d="M2 2l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
