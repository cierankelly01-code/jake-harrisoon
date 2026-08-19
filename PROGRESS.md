# Progress

Tracking against the master brief's own §19 Build Order. This pass delivered **Phase 1 — "The
Pitch"** in full.

## Phase 1 — THE PITCH ✅ (this pass)

- [x] Design system: tokens, fonts, Docket/Placeholder/MonoStat primitives, motion (reveal
      system, hero breathing gradient), zero-shadow / 2px-radius / copper-hairline layout rules
- [x] Homepage in both Commercial ⇄ Domestic toggle states, no reload, cookie-persisted,
      commercial default — all 13 sections from §8.1
- [x] `/capability` with gated, server-generated branded PDF and email capture → lead
- [x] `/tenders` — full ITT/PQQ intake, file upload, director notification, auto-reply with
      capability PDF attached, idempotency key against double-submits
- [x] `/boiler-quote` — 8-step wizard, partial-save-per-step abandonment capture, typed pricing
      config, photo upload, 3-tier price bands, PDF output
- [x] `/care-plans` — 3 tiers, Stripe Checkout wiring (dynamic price_data, no dashboard Price
      objects to maintain)
- [x] `/prices` — published pricing table structure (figures pending — see `CONTENT_NEEDED.md`)
- [x] Deliverable docs: `CONTENT_NEEDED.md`, `CLIENT_ASSETS_NEEDED.md`, `HANDOFF.md`,
      `.env.example`, this file

Deployed to: **local dev only in this pass** — no staging host was set up (no Coolify/hosting
access in this session). Deploying to a live staging URL is the next concrete step before
Phase 2, per the brief's "never present localhost" instruction.

## Phase 2 — not started

All other commercial/domestic/landlord service pages, `/accreditations`, `/compliance`,
`/team`, `/projects`, `/areas`, `/about`, `/contact`, `/emergency`, `/guides`, `/careers`.

## Phase 3 — not started

`/ops` director dashboard (leads pipeline, tender tracker, contract register, compliance
document library, quote requests, job/project CMS, care plan calendar, review request loop),
`/portal` client portal, all scheduled automation engines from §11 (quote abandonment nudges,
review requests, renewal reminders, PPM/contract/compliance/tender-deadline alerts), Stripe
webhook handling for subscription lifecycle, finance calculator (feature-flagged off pending
FCA status per §9.2), `/partners`.

## Phase 4 — not started

Full schema.org JSON-LD rollout (FAQPage schema is live on the homepage FAQ; the rest — 
LocalBusiness, Service, BreadcrumbList, Article — are Phase 4), OG image generation, a full
Lighthouse/WCAG pass, analytics conversion tracking, `GOOGLE_BUSINESS_PROFILE.md`,
`BRAND_GUIDELINES.md`, `ACCREDITATION_ROADMAP.md`, training walkthroughs.

## Self-review status

A fresh-eyes review pass (screenshots + independent `code-reviewer` agent against the badman
rubric) was planned for this session but the Chrome browser extension was not connected, so no
live screenshots could be captured. Build/lint/type-check are all clean (see below); the visual
gauntlet is outstanding and should be the first thing run once a browser is available.

## Build health

- `npm run build` — clean, all 6 routes compile
- `npm run lint` — clean
- TypeScript strict, zero `any`, zero `@ts-ignore`
- RLS enabled + deny-by-default on all 5 Phase 1 tables (`supabase/migrations/0001_phase1_schema.sql`);
  not yet verified against a live Supabase project with an anon client (no project provisioned
  in this session — verification steps are in the migration file's comments)
