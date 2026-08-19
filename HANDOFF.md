# Handoff

Written for two people who are not developers. This covers what's built in this Phase 1 pass —
see `PROGRESS.md` for what's still to come.

## Running it locally

```
npm install
npm run dev
```

Open http://localhost:3000. Nothing needs to be configured for the site to work — every
integration (Supabase, Resend, Stripe, Turnstile) runs in "stub" mode until real credentials are
added to `.env.local` (copy `.env.example` to start). Stubbed actions still work end-to-end —
forms submit successfully, PDFs generate and download — they just log what *would* have
happened to the terminal instead of calling a live service.

## Editing boiler quote prices

Open `src/lib/quote/pricing.ts`. Three things to change:

- `BASE_PRICE_LOW` / `BASE_PRICE_HIGH` — the starting range for a straightforward like-for-like
  combi swap.
- `COMPLEXITY_UPLIFT` — how much extra each starting-point system type adds (a back boiler
  strip-out costs more than swapping one combi for another).
- `TIER_MULTIPLIER` — how much cheaper the Budget tier is and how much more the Premium tier
  costs, as a multiplier on the base+uplift figure.

No other file needs to change — every price shown on `/boiler-quote`, in the emailed PDF, and in
the internal notification email reads from this one file.

## Editing care plan prices

Open `src/lib/care-plans/tiers.ts`. Change `monthlyPriceGbp` on any tier. Stripe Checkout builds
the subscription price dynamically from this number every time someone signs up — there's
nothing to keep in sync in the Stripe dashboard.

## Editing domestic prices (`/prices`)

Open `src/lib/content/domestic-prices.ts`. Replace `price: null` with a string like `"£85"` for
each job. It stops showing the amber placeholder chip the moment a real value is added.

## Editing business facts (Gas Safe number, insurance values, phone, etc.)

Open `src/lib/content/business.ts`. Every field that currently reads `null` shows as an amber
placeholder chip everywhere it appears on the site — header, footer, homepage, capability
statement PDF. Replace `null` with the real value (as a string) and every instance updates
automatically. Full list of what's outstanding is in `CONTENT_NEEDED.md`.

## Responding to a tender

`/tenders` submissions currently email both the tenders address and the general address (see
`business.emailTenders` / `business.emailGeneral` — set these first) with the enquiry detail and
the ITT/specification document attached if one was uploaded. A capability statement PDF is
auto-attached to the confirmation email sent back to the enquirer. The tender tracker with
deadline countdowns (`/ops`) is a Phase 3 module — until it ships, treat the email as the record.

## Fonts

Archivo Expanded (display), Instrument Sans (body) and Martian Mono (numerals/labels) are all
loaded via `next/font/google` and self-hosted at build time — see `src/lib/fonts.ts`. Archivo
isn't a separate "Expanded" family on Google Fonts; it's a variable font with a real width axis
(`wdth`, 62–125), so the expanded look comes from dialling that axis to its wide end via the
`--font-archivo-wdth-expanded` token in `globals.css` and the `.font-display` utility class. No
fallback substitution was needed.

## PDF fonts

The capability statement and boiler quote PDFs (`src/lib/pdf/*.tsx`, via `@react-pdf/renderer`)
currently use the built-in Helvetica family, not the brand fonts. `@react-pdf/renderer` needs
actual `.ttf` files registered via `Font.register()` — it can't reference the Google Fonts
loaded for the website. Once real brand font files are available (or exported from Google
Fonts), register them at the top of each PDF document file and swap the `fontFamily` values in
the `StyleSheet`.

## Rate limiting

`src/lib/security/rate-limit.ts` is an in-memory limiter — fine for a single Coolify container.
If this ever runs across multiple instances, swap the `Map` for Redis `INCR`+`EXPIRE`; the call
sites (`isRateLimited(key, limit, windowMs)`) don't need to change.

## What's stubbed vs. live

Check `src/lib/env.ts` — each `isXConfigured()` function is the single source of truth for
whether an integration is live. Everything downstream branches on these, so turning on a real
integration is purely an environment-variable change, never a code change.

## Known accepted risk

`npm audit` reports 3 high-severity advisories, all inside `next@15`'s own bundled `postcss`/
`sharp` build-time dependencies (source-map disclosure and libvips CVEs) — not runtime code paths
a site visitor can reach. The only fix available is `next@16`, which the brief pins against
(§3: "Next.js 15"). Revisit when Next 15 gets a patch release, or when the client explicitly
signs off on moving to Next 16.
