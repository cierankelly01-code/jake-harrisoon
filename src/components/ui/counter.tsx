"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Odometer number counter (motion-cookbook §7). Neo-Industrial motion is
 * mechanical, so this runs on an ease-out cubic rather than a spring.
 *
 * Fires once, on entering the viewport, and only when the value is a real
 * number — a placeholder never animates, because animating a "TBC" chip
 * would dress up the absence of a fact.
 *
 * Renders the final value in the server HTML, so with JavaScript off, or
 * with reduced motion, the number is simply there.
 */
export function Counter({
  to,
  suffix = "",
  className,
  style,
}: {
  to: number;
  suffix?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(to);
  const hasRun = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // A changed `to` starts a fresh count rather than being ignored.
    hasRun.current = false;
    setDisplay(to);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Tracked so the loop cannot outlive the component: without this, an
    // unmount mid-animation left up to 1.1s of frames calling setState on a
    // component that no longer exists.
    let frame = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || hasRun.current) continue;
          hasRun.current = true;
          observer.disconnect();

          const start = performance.now();
          const duration = 1100;
          const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(to * eased));
            frame = progress < 1 ? requestAnimationFrame(tick) : 0;
          };
          setDisplay(0);
          frame = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [to]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {display.toLocaleString("en-GB")}
      {suffix}
    </span>
  );
}
