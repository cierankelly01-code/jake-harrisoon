/**
 * Shared between the client wizard and the server validation schema.
 * Kept in its own file with no zod import so the client bundle
 * (quote-wizard.tsx) doesn't pull zod's runtime in just to read this
 * array — see lib/validation/boiler-quote.ts, which re-exports this for
 * server-side use.
 */
export const QUOTE_STEP_IDS = [
  "property",
  "bathrooms",
  "system",
  "location",
  "fuel",
  "photo",
  "urgency",
  "contact_details",
] as const;
