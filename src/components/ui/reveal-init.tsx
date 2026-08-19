"use client";

import { useEffect } from "react";

/**
 * Mounted once in the root layout. Adds `.js` to <html> (so `.reveal`
 * only hides content when script has actually run — no invisible content
 * on a JS-off render) and drives the single scroll-reveal system used
 * sitewide: fade + rise 12px, staggered, once per element.
 */
export function RevealInit() {
  useEffect(() => {
    document.documentElement.classList.add("js");

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let staggerIndex = 0;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = staggerIndex * 60;
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-visible");
            observer.unobserve(el);
            staggerIndex++;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    const targets = document.querySelectorAll(".reveal");
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
