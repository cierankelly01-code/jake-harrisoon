"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile widget.
 *
 * The server guard (`lib/security/guard.ts`) has always verified a
 * `turnstileToken` field, but nothing on the client ever rendered a widget or
 * produced one. That was invisible only because `verifyTurnstile()` stubs to
 * "pass" while no keys are configured — the first deploy with real keys would
 * have made all four public forms fail with "Verification failed. Please try
 * again." and no way for the user to recover. The privacy notice also states
 * as fact that Turnstile runs on submission, so the widget has to exist for
 * that to be true.
 *
 * Renders nothing when no site key is set, which keeps the forms working
 * locally and in any environment where Turnstile is not yet configured —
 * exactly matching the server's own stub behaviour.
 *
 * `data-response-field-name` makes Turnstile write its token into a hidden
 * input named `turnstileToken`, which is the field the guard reads, so no
 * extra state plumbing is needed on our side.
 */

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

export function TurnstileWidget({ theme = "auto" }: { theme?: "light" | "dark" | "auto" }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siteKey) return;
    if (document.querySelector(`script[src^="${SCRIPT_SRC}"]`)) return;

    const script = document.createElement("script");
    script.src = `${SCRIPT_SRC}?render=explicit`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    // Deliberately not removed on unmount: the script is shared by every form
    // on the site, and re-adding it on each mount would re-download it.
  }, [siteKey]);

  useEffect(() => {
    if (!siteKey) return;
    const node = mountRef.current;
    if (!node) return;

    let widgetId: string | undefined;
    let cancelled = false;

    const render = () => {
      if (cancelled) return;
      const turnstile = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (!turnstile) {
        window.setTimeout(render, 150);
        return;
      }
      if (node.childElementCount > 0) return;
      widgetId = turnstile.render(node, {
        sitekey: siteKey,
        theme,
        "response-field-name": "turnstileToken",
      });
    };

    render();
    return () => {
      cancelled = true;
      const turnstile = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (widgetId && turnstile?.remove) turnstile.remove(widgetId);
    };
  }, [siteKey, theme]);

  if (!siteKey) return null;

  return (
    <div className="turnstile-mount">
      <div ref={mountRef} />
      <noscript>
        <p className="text-sm" style={{ color: "var(--steel)" }}>
          This form needs JavaScript enabled to verify the submission. If you would rather not
          enable it, call us instead.
        </p>
      </noscript>
    </div>
  );
}

type TurnstileApi = {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      "response-field-name"?: string;
    }
  ) => string;
  remove?: (widgetId: string) => void;
};
