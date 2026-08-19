# Marmion Building Services

Lead-generation, tender-response and conversion platform for Marmion Building Services Ltd —
built to the master brief in `MARMION BUILDING SERVICES — MASTER BUILD PROMPT`.

## Stack

Next.js 15 (App Router) · TypeScript strict · Tailwind CSS v4 · Supabase (Postgres/Storage) ·
Resend · Stripe · Cloudflare Turnstile · `@react-pdf/renderer`.

## Getting started

```
npm install
npm run dev
```

See `.env.example` for the environment variables that switch each integration from "stub" mode
(logs instead of calling out) to live. Nothing needs to be configured to run and test the site
locally.

## Project docs

- `PROGRESS.md` — what's built, what's next, mapped to the brief's own build order
- `HANDOFF.md` — how to edit prices, business facts, and everything a non-developer needs
- `CONTENT_NEEDED.md` — every fact still needed from the client, grouped by page
- `CLIENT_ASSETS_NEEDED.md` — photography and documents still needed
- `supabase/migrations/` — database schema

## Design system

`src/app/globals.css` holds every design token (palette, type scale, spacing, motion). The
signature component is the Docket (`src/components/ui/docket.tsx`) — see the master brief's §5
for the "Flame Test" rationale behind the palette and the amber-is-emergency-only rule.
