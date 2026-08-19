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

A fresh-eyes **visual** review pass (screenshots + independent reviewer against the badman
design rubric) was planned for this session but the Chrome browser extension was not connected,
so no live screenshots could be captured. That's still outstanding and should be the first thing
run once a browser is available.

A fresh-eyes **code** review did run (independent `code-reviewer` agent, no build context) and
found real issues, all fixed in this pass:
- `saveQuoteStep` (boiler-quote step autosave) had no rate limit, honeypot, or server-side file
  validation — now goes through the same `protectFormSubmission` guard as every other action,
  and `uploadToStorage` enforces a size/MIME allow-list server-side regardless of what the client
  claims.
- The wizard re-uploaded the same photo on every step after it was attached (client-side state
  bug) — fixed, and `completed_step` is now an explicit value the client sends rather than
  inferred from which form fields happened to be present.
- The postcode/coverage check compared a postcode against town *names* and could never match —
  replaced with a real postcode-area check (`lib/content/coverage-postcodes.ts`).
- User-supplied text was interpolated into internal/customer email HTML unescaped — added
  `escapeHtml()` and applied it everywhere a form field reaches an email template.
- Care plan signup had no honeypot/Turnstile (the other three forms did) — normalised all four
  actions onto one shared `protectFormSubmission` guard so this can't drift again.
- Admin notification emails silently fell back to a fake `@marmion.example` address when
  `business.emailGeneral`/`emailTenders` aren't set yet — replaced with `notifyDirectors()`,
  which refuses to send (and logs loudly) rather than mailing a domain that doesn't exist.
- `--steel` (4.27:1) and `--amber` on `--paper` (2.19:1) both failed WCAG AA for text — darkened
  `--steel`, added an `--amber-ink` token for warning/error text on light surfaces, and gave the
  `Placeholder` chip a fixed dark background so it's never rendered on an unpredictable surface.
- Accessibility gaps specific to the boiler-quote wizard (the one flow that hadn't had the same
  care as the tender/capability forms): added `role="radiogroup"`/`aria-checked` to the option
  grids, `fieldset`/`legend` structure, `role="progressbar"` on the step indicator, and
  focus-to-heading on every step change.
- Fixed a `window.location.href` assignment during render (care-plans redirect) — moved to
  `useEffect`; and the Stripe success/cancel redirect now actually renders a confirmation/
  cancellation message instead of being silently dropped.

Full findings (including two accepted-as-is style suggestions) are in the agent's report; nothing
was silently waved through.

## Build health

- `npm run build` — clean, all 6 routes compile
- `npm run lint` — clean
- TypeScript strict, zero `any`, zero `@ts-ignore`
- RLS enabled + deny-by-default on all 5 Phase 1 tables (`supabase/migrations/0001_phase1_schema.sql`);
  not yet verified against a live Supabase project with an anon client (no project provisioned
  in this session — verification steps are in the migration file's comments)
