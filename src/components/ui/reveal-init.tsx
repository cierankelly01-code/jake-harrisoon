"use client";

import { useEffect } from "react";

/**
 * Motion cookbook §12: never animate more than ~6 things per viewport entry.
 * The per-step delay itself lives in CSS (`--reveal-delay` multiplied by 80ms
 * in globals.css) so the timing stays in one place with the transition.
 */
const STAGGER_BUDGET = 6;

/**
 * Mounted once in the root layout. Adds `.js` to <html> (so reveal classes
 * only hide content when script has actually run — no invisible content on a
 * JS-off render) and drives the single scroll-reveal system used sitewide.
 *
 * A MutationObserver picks up nodes added after mount, which matters here:
 * switching the Commercial/Domestic division re-renders whole sections, and
 * without this their fresh `.reveal` nodes would stay permanently hidden.
 */
export function RevealInit() {
  useEffect(() => {
    // `.js` is added by an inline script in the document head so it lands
    // before first paint — see app/layout.tsx. This is a belt-and-braces
    // repeat for any environment where that script did not run.
    document.documentElement.classList.add("js");

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const SELECTOR = ".reveal, .reveal-wipe";

    const observer = new IntersectionObserver(
      (entries) => {
        let staggerIndex = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          // Past the budget, elements land instantly rather than queueing up
          // a long cascade — everything animating means nothing is noticed.
          // Modulo, not a reset. The previous `index < BUDGET ? index : 0`
          // ran 1-2-3-4-5-6 and then dumped every remaining sibling at delay
          // 0 simultaneously — visible as a stutter in the services grid.
          // Wrapping keeps the cadence going for grids of any length while
          // still capping the longest wait at six steps.
          const step = staggerIndex % STAGGER_BUDGET;
          el.style.setProperty("--reveal-delay", String(step));
          el.classList.add("is-visible");
          observer.unobserve(el);
          staggerIndex++;
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const observe = (el: Element) => {
      if (el.classList.contains("is-visible")) return;
      observer.observe(el);
    };

    document.querySelectorAll(SELECTOR).forEach(observe);

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(SELECTOR)) observe(node);
          node.querySelectorAll?.(SELECTOR).forEach(observe);
        }
        // Release anything unmounted before it ever intersected. An
        // IntersectionObserver holds a strong reference to its targets, and
        // switching the Commercial/Domestic division re-renders whole
        // sections — so without this the observed set grows every toggle for
        // the lifetime of the page.
        for (const node of record.removedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(SELECTOR)) observer.unobserve(node);
          node.querySelectorAll?.(SELECTOR).forEach((el) => observer.unobserve(el));
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    // Elements already in view on load should not wait for a scroll event.
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll(SELECTOR).forEach(observe);
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
