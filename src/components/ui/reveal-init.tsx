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
    let staggerIndex = 0;

    // Shared by the observer callback and the scroll safety-net below, so
    // both paths reveal through one function and share one stagger counter.
    const reveal = (el: HTMLElement) => {
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
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const observe = (el: Element) => {
      if (el.classList.contains("is-visible")) return;
      observer.observe(el);
    };

    document.querySelectorAll(SELECTOR).forEach(observe);

    // Safety net. A single large instant scroll delta — a fast trackpad
    // fling, repeated Page Down / spacebar, an anchor-link jump, scroll
    // restoration on back-navigation — can move an element across the
    // observer's entire threshold band between two animation frames. The
    // browser then never reports a crossing and the element is stuck at
    // opacity 0 forever (confirmed: a synthetic 600px-per-step scroll left
    // 10 of 14 reveal targets on the homepage permanently invisible). This
    // runs synchronously on the scroll event itself rather than deferring
    // to requestAnimationFrame: a background/unfocused tab can throttle rAF
    // to ~1/sec, which is slower than a fast scroll burst and reproduced
    // the exact same stuck-invisible state. A bounding-box read is cheap
    // enough sitewide (a handful of reveal targets, by design) to just do
    // on every scroll tick with a microtask coalesce, no frame dependency.
    let scheduled = false;
    let armed = false;
    const sweep = () => {
      scheduled = false;
      const targets = document.querySelectorAll(`${SELECTOR}:not(.is-visible)`);
      if (targets.length === 0) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        armed = false;
        return;
      }
      // Deliberately no lower bound on `rect.top` (no `rect.bottom > 0`
      // check): an element a large jump carried straight past the viewport
      // without ever intersecting it has, by definition, already been
      // scrolled past — revealing it immediately is correct, since there
      // was never a frame in which the user could see it pre-reveal anyway.
      const vh = window.innerHeight;
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.92) reveal(el as HTMLElement);
      });
    };
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      // queueMicrotask, not requestAnimationFrame: a backgrounded/unfocused
      // tab throttles rAF to roughly once a second, which is slower than a
      // fast scroll burst and left elements stuck exactly as an unpatched
      // observer miss would. A microtask still coalesces a burst of scroll
      // events into one sweep, but always runs before the next event loop
      // turn regardless of paint scheduling.
      queueMicrotask(sweep);
    };
    // Re-armable: the listeners remove themselves once nothing is left to
    // reveal, but the division toggle can add fresh hidden targets later.
    const armSweep = () => {
      if (armed) return;
      armed = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    };
    armSweep();

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(SELECTOR)) observe(node);
          node.querySelectorAll?.(SELECTOR).forEach(observe);
        }
        armSweep();
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
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
