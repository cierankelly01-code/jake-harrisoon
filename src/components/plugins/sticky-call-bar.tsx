"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useDivision } from "@/components/division/division-provider";
import { phoneLink } from "@/lib/content/contact-links";
import { track } from "@/lib/analytics";

/**
 * Mobile-only bottom bar: call, WhatsApp, quote. Slides in after the
 * visitor has scrolled past the hero, `inert` while off-screen so its links
 * leave the tab order.
 */
export function StickyCallBar() {
  const [visible, setVisible] = useState(false);
  const { division } = useDivision();
  const pathname = usePathname();
  const phone = phoneLink();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDomestic = division !== "commercial";
  const quoteHref = division === "commercial" ? "/tenders" : "/boiler-quote";
  const quoteLabel = division === "commercial" ? "Tender enquiry" : "Get my fixed price";

  // The quote and contact pages are the destinations; a bar pointing at the
  // page you are already on just steals viewport.
  if (pathname === "/boiler-quote" || pathname === "/contact" || pathname === "/tenders") return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      inert={!visible}
      aria-hidden={!visible}
      style={{
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderTop: "1px solid var(--border-hairline)",
        boxShadow: "0 -8px 24px -16px rgba(11,15,13,0.25)",
        padding: "0.5rem 0.75rem calc(0.5rem + env(safe-area-inset-bottom))",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        visibility: visible ? "visible" : "hidden",
        transition: visible
          ? "transform var(--duration-transition) var(--ease-enter), visibility 0s"
          : "transform var(--duration-transition) var(--ease-enter), visibility 0s var(--duration-transition)",
      }}
    >
      {/* Three slots, not two. On a phone at 11pm this bar is often the
          only thing on screen, and it had no route to /emergency at all —
          the best page on the site was unreachable from the one control
          that is always visible. Amber, because emergency is the only
          thing amber is allowed to mean on this site. */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: isDomestic ? "auto 1fr 1.2fr" : "1fr 1.35fr",
        }}
      >
        {isDomestic && (
          <Link
            href="/emergency"
            onClick={() => track("cta_click", { location: "sticky_bar", action: "emergency" })}
            className="btn btn--sm btn--bar"
            style={{
              background: "var(--amber-tint)",
              color: "var(--amber-ink)",
              fontWeight: 700,
            }}
          >
            Emergency
          </Link>
        )}
        <Link
          href={phone.href}
          onClick={() => track("cta_click", { location: "sticky_bar", action: "call" })}
          className="btn btn--ghost btn--sm btn--bar"
        >
          {phone.isDirect && (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 1h3l1.5 4L5.5 6.5a10 10 0 004 4L11 9l4 1.5v3a1.5 1.5 0 01-1.7 1.5A13.5 13.5 0 011.1 2.7 1.5 1.5 0 012.6 1H3z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {phone.isDirect ? "Call us" : "Request a callback"}
        </Link>
        <Link
          href={quoteHref}
          onClick={() => track("cta_click", { location: "sticky_bar", action: "quote" })}
          className="btn btn--primary btn--sm btn--bar"
        >
          {quoteLabel}
        </Link>
      </div>
    </div>
  );
}
