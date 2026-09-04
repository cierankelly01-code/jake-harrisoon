import { business } from "@/lib/content/business";
import { SITE_URL } from "@/lib/site";

/**
 * LocalBusiness JSON-LD, emitted sitewide from the root layout.
 *
 * ── THE RULE THIS FILE OBEYS ─────────────────────────────────────────────
 * Structured data is a machine-readable claim made to Google, Bing and
 * every AI answer engine. Faking a rating, an address or an accreditation
 * here is not a white lie — it is a manual-action risk with Google, and
 * for a Gas Safe trade it is a claim about safety credentials. So this
 * file emits ONLY facts that exist in `src/lib/content/business.ts`.
 *
 * Everything conditional below is spread in with `...(x ? {…} : {})`, which
 * means: fill the value into `business.ts` and the property appears in the
 * schema automatically on the next build, with no edit here. Specifically —
 *
 *   telephone        ← business.phoneMain
 *   email            ← business.emailGeneral
 *   address.street   ← business.registeredOffice
 *   vatID            ← business.vatNumber
 *   identifier       ← business.companyNumber
 *   foundingDate     ← business.established
 *   openingHours     ← business.outOfHoursCover / a real rota (see below)
 *
 * Deliberately absent, and NOT to be added without the underlying fact:
 *   geo              — needs a surveyed lat/long for the real premises.
 *   openingHoursSpecification — needs confirmed trading hours. Guessing
 *                      "Mo-Fr 08:00-17:00" tells Google to send someone to
 *                      a closed door.
 *   priceRange       — "££" is meaningless; /prices carries real numbers.
 *   aggregateRating  — MUST NOT be emitted until real, verifiable reviews
 *                      exist and are displayed on the page. Self-serving
 *                      review markup is an explicit Google policy breach.
 *   hasCredential    — no accreditation is claimed while
 *                      business.accreditationsHeld is empty.
 * ─────────────────────────────────────────────────────────────────────────
 */

// business.base is "Tamworth, Staffordshire" — split rather than re-typed so
// the schema stays in step if the base ever moves.
const [baseLocality, baseRegion] = business.base.split(",").map((part) => part.trim());

export function LocalBusinessSchema() {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    // Plumber is a LocalBusiness subtype; additionalType widens it to the
    // mechanical/electrical contracting side without inventing a second entity.
    "@type": "Plumber",
    "@id": `${SITE_URL}/#business`,
    additionalType: "https://schema.org/HVACBusiness",
    name: "Marmion Building Services",
    alternateName: business.tradingName,
    legalName: business.legalEntity,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    description:
      "Mechanical, electrical and plumbing contractor based in Tamworth, Staffordshire. Commercial contracting, planned preventative maintenance and statutory compliance, plus domestic plumbing, heating and boiler installation across the West Midlands.",

    // Base location. Only the locality, region and country are asserted —
    // all three are confirmed facts. streetAddress and postalCode are
    // withheld until business.registeredOffice is filled in.
    address: {
      "@type": "PostalAddress",
      addressLocality: baseLocality,
      addressRegion: baseRegion,
      addressCountry: "GB",
      ...(business.registeredOffice ? { streetAddress: business.registeredOffice } : {}),
    },

    // A service-area business: the towns actually covered, from one list.
    areaServed: business.coverage.map((town) => ({
      "@type": "City",
      name: town,
      containedInPlace: { "@type": "Country", name: "United Kingdom" },
    })),

    // The two divisions, as the services they actually are.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Marmion Building Services — divisions",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: business.divisions.commercial,
            serviceType: "Commercial mechanical, electrical and plumbing contracting",
            description:
              "Mechanical contracting, planned preventative maintenance and statutory compliance for commercial buildings, including tender and PQQ responses.",
            provider: { "@id": `${SITE_URL}/#business` },
            areaServed: business.coverage.map((town) => ({ "@type": "City", name: town })),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: business.divisions.domestic,
            serviceType: "Domestic plumbing, heating and boiler installation",
            description:
              "Boiler installation and replacement, servicing, gas safety certificates, plumbing repairs and annual care plans for homes.",
            provider: { "@id": `${SITE_URL}/#business` },
            areaServed: business.coverage.map((town) => ({ "@type": "City", name: town })),
          },
        },
      ],
    },

    // ── Conditional facts: each appears automatically once business.ts has it.
    ...(business.phoneMain ? { telephone: business.phoneMain } : {}),
    ...(business.emailGeneral ? { email: business.emailGeneral } : {}),
    ...(business.vatNumber ? { vatID: business.vatNumber } : {}),
    ...(business.established ? { foundingDate: business.established } : {}),
    ...(business.companyNumber
      ? {
          identifier: {
            "@type": "PropertyValue",
            name: "Companies House company number",
            value: business.companyNumber,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      // Escaping `<` closes the only XSS vector a JSON-LD block has (a "</script>"
      // sequence inside a string value). Every value here is a build-time constant,
      // but the guard costs nothing and survives someone pasting user data in later.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}
