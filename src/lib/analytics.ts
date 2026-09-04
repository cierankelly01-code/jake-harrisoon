/**
 * One vendor-agnostic wrapper so the analytics provider is a one-line swap
 * and every call site stays identical. Nothing here loads a third-party
 * script: the site currently ships zero trackers, which is also why it
 * currently needs no cookie banner. When a provider is chosen, wire it up in
 * `send()` only.
 *
 * Privacy-first providers (Plausible, Fathom) are the default recommendation
 * — they need no consent banner for EU/UK traffic under PECR because they
 * set no cookies and store no personal data. Choosing GA4 instead means
 * adding a consent gate before this ever fires. See HANDOFF.md.
 */

export type TrackEvent =
  /** Any primary/secondary CTA. props: { location, action } */
  | "cta_click"
  /** Division switcher used. props: { to } */
  | "division_switch"
  /** Quote wizard progress. props: { step, stepId } */
  | "quote_step"
  /** Quote wizard submitted. props: { total } */
  | "quote_complete"
  /** Partial quote captured on abandonment. props: { step } */
  | "quote_partial"
  /** Care plan checkout started. props: { tier } */
  | "care_plan_checkout"
  /** Capability statement requested. props: {} */
  | "capability_download"
  /** Tender enquiry submitted. props: {} */
  | "tender_enquiry"
  /** FAQ item opened. props: { question } */
  | "faq_open"
  /** Process story advanced to a stage. props: { stage } */
  | "process_stage";

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    plausible?: (name: string, options?: { props?: Props }) => void;
    gtag?: (command: string, name: string, props?: Props) => void;
    dataLayer?: unknown[];
  }
}

function send(name: string, props?: Props) {
  if (typeof window === "undefined") return;

  if (typeof window.plausible === "function") {
    window.plausible(name, props ? { props } : undefined);
    return;
  }
  if (typeof window.gtag === "function") {
    window.gtag("event", name, props);
    return;
  }
  if (process.env.NODE_ENV === "development") {
    console.debug("[track]", name, props ?? {});
  }
}

export function track(event: TrackEvent, props?: Props) {
  send(event, props);
}

/**
 * A/B hooks without a $300/month tool: assign once per browser, read the
 * bucket with `variant("hero_headline")`, and branch on it in the component.
 * Stamp the winning copy into the source once a test concludes.
 */
export function variant(testName: string, buckets: readonly string[] = ["a", "b"]): string {
  if (typeof window === "undefined") return buckets[0];
  const key = `mbs:ab:${testName}`;
  try {
    const stored = window.localStorage.getItem(key);
    if (stored && buckets.includes(stored)) return stored;
    const assigned = buckets[Math.floor(Math.random() * buckets.length)];
    window.localStorage.setItem(key, assigned);
    return assigned;
  } catch {
    return buckets[0];
  }
}
