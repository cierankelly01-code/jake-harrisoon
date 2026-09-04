import { business } from "./business";

/**
 * The phone number, email address and WhatsApp number are all unconfirmed
 * (see CONTENT_NEEDED.md), and until they land, a `tel:` or `mailto:` with
 * nothing after the colon is a dead link — it opens an empty dialler, or
 * nothing at all, and on mobile that is the single most valuable control on
 * the page silently failing.
 *
 * So every contact affordance resolves through here. With a real number it
 * becomes a real `tel:` link; without one it points at a page that can
 * actually take the enquiry. Nothing on the site links to `tel:` directly.
 */

/** Keeps a leading "+" (valid in a `tel:` URI) and strips everything else. */
const telDigits = (value: string) => value.replace(/[^\d+]/g, "");

/**
 * wa.me takes a full international number in digits only — no "+", no spaces,
 * no leading zero. Handles the three ways a UK number is realistically typed:
 *   "01827 123456"    -> 441827123456
 *   "+44 1827 123456" -> 441827123456
 *   "44 1827 123456"  -> 441827123456
 */
function whatsappDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("44")) return digits;
  if (digits.startsWith("0")) return `44${digits.slice(1)}`;
  return `44${digits}`;
}

export type ContactLink = {
  href: string;
  /** True when this is a real dialler/mail link rather than the fallback. */
  isDirect: boolean;
  /** What to show the user. Never a fake number. */
  label: string;
};

export function phoneLink(fallbackHref = "/contact"): ContactLink {
  if (business.phoneMain) {
    return {
      href: `tel:${telDigits(business.phoneMain)}`,
      isDirect: true,
      label: business.phoneMain,
    };
  }
  return { href: fallbackHref, isDirect: false, label: "Request a callback" };
}

export function emailLink(
  which: "general" | "tenders" = "general",
  fallbackHref = "/contact"
): ContactLink {
  const address = which === "tenders" ? business.emailTenders ?? business.emailGeneral : business.emailGeneral;
  if (address) {
    return { href: `mailto:${address}`, isDirect: true, label: address };
  }
  return { href: fallbackHref, isDirect: false, label: "Send an enquiry" };
}

export function whatsappLink(fallbackHref = "/contact"): ContactLink {
  const number = business.phoneMain;
  if (number) {
    return {
      href: `https://wa.me/${whatsappDigits(number)}`,
      isDirect: true,
      label: "WhatsApp",
    };
  }
  return { href: fallbackHref, isDirect: false, label: "Message us" };
}
