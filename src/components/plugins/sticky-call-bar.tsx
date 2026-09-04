"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDivision } from "@/components/division/division-provider";
import { phoneLink, whatsappLink } from "@/lib/content/contact-links";
import { track } from "@/lib/analytics";

/**
 * PLUGIN — sticky call bar (local-service blueprint, mobile).
 *
 * Bottom-anchored rather than top: on a phone the thumb is at the bottom of
 * the screen, and a top bar competes with the sticky nav for the scarcest
 * space on the page. Appears once the hero's own CTAs have scrolled away, so
 * it never duplicates a control already on screen.
 *
 * Contract: <5KB, no layout shift (fixed), 44px targets, safe-area inset for
 * gesture bars, reduced-motion drops the slide for a plain fade.
 */
export function StickyCallBar() {
  const [visible, setVisible] = useState(false);
  const { division } = useDivision();
  const phone = phoneLink();
  const whatsapp = whatsappLink();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const quoteHref = division === "commercial" ? "/tenders" : "/boiler-quote";
  const quoteLabel = division === "commercial" ? "Tender enquiry" : "Instant price";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t lg:hidden"
      /* Hidden with transform alone left three invisible links in the tab
         order on every page. `inert` removes them from focus and from the
         accessibility tree while the bar is off-screen, and `visibility`
         (transitioned after the slide, not with it) keeps it out of hit
         testing without killing the animation. */
      inert={!visible}
      aria-hidden={!visible}
      style={{
        background: "color-mix(in srgb, var(--ink) 94%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "var(--border-hairline-dark)",
        paddingBottom: "env(safe-area-inset-bottom)",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        visibility: visible ? "visible" : "hidden",
        transition: visible
          ? "transform var(--duration-transition) var(--ease-mech), visibility 0s"
          : "transform var(--duration-transition) var(--ease-mech), visibility 0s var(--duration-transition)",
      }}
    >
      <div className="grid grid-cols-3">
        <Link
          href={phone.href}
          onClick={() => track("cta_click", { location: "sticky_bar", action: "call" })}
          className="font-mono-label flex min-h-[52px] items-center justify-center gap-2 border-r"
          style={{ borderColor: "var(--border-hairline-dark)", color: "var(--paper)" }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 1h3l1.5 4L5.5 6.5a10 10 0 004 4L11 9l4 1.5v3a1.5 1.5 0 01-1.7 1.5A13.5 13.5 0 011.1 2.7 1.5 1.5 0 012.6 1H3z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
          {phone.isDirect ? "Call" : "Callback"}
        </Link>
        <Link
          href={whatsapp.href}
          onClick={() => track("cta_click", { location: "sticky_bar", action: "whatsapp" })}
          className="font-mono-label flex min-h-[52px] items-center justify-center border-r"
          style={{ borderColor: "var(--border-hairline-dark)", color: "var(--paper)" }}
        >
          {whatsapp.label}
        </Link>
        <Link
          href={quoteHref}
          onClick={() => track("cta_click", { location: "sticky_bar", action: "quote" })}
          className="font-mono-label flex min-h-[52px] items-center justify-center px-2 text-center"
          style={{ background: "var(--flame)", color: "var(--paper)" }}
        >
          {quoteLabel}
        </Link>
      </div>
    </div>
  );
}
