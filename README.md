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

- `DESIGN_SYSTEM.md` — **read this before touching the front end.** Tokens, the
  contrast pairs that matter, section rhythm, the showstopper's rules, the plugin list,
  the analytics event map, and the honesty rules that must not be "fixed"
- `PROGRESS.md` — what's built, what's next, mapped to the brief's own build order
- `HANDOFF.md` — how to edit prices, business facts, and everything a non-developer needs
- `CONTENT_NEEDED.md` — every fact still needed from the client, grouped by page
- `CLIENT_ASSETS_NEEDED.md` — photography and documents still needed
- `supabase/migrations/` — database schema

## Design system

`src/app/globals.css` holds every design token (palette, type scale, spacing, motion) and is
the single place to re-skin the site. The signature component is the Docket
(`src/components/ui/docket.tsx`); the one signature interactive moment is the pinned process
story (`src/components/home/process-story.tsx`). See the master brief's §5 for the "Flame Test"
rationale behind the palette and the amber-is-emergency-only rule, and `DESIGN_SYSTEM.md` for
everything else.

## A warning about facts

Most of `src/lib/content/business.ts` is deliberately `null`, and those nulls render as amber
"to be confirmed" chips. **Do not fill them in with plausible values.** Two of the worst bugs
this project has had came from working around that rule rather than with it — see
`DESIGN_SYSTEM.md` §7.
