# Progress

Tracking against the master brief's own §19 Build Order.

## Commercial division switched off — 5 September 2026

Client request: focus on domestic only "for right now." **Temporary, not a
deletion** — every commercial-specific thing (the division toggle,
`/commercial`, `/capability`, `/tenders`, every `COMMERCIAL_*` copy branch
across the codebase) is still in the repo, just switched off behind one
constant. Flip `COMMERCIAL_ENABLED` back to `true` in
`src/lib/division-shared.ts` and it all comes back — no rebuild, no
un-deleting anything.

What changes while it's off: those four routes 307-redirect to `/`
(`middleware.ts`); `/` always renders domestic content regardless of any
stale division cookie (`lib/division.ts`); the header/footer/contact/terms
pages drop every commercial link and the toggle itself; the sitemap,
default page title, and the OG share card all lead with domestic framing
instead of "mechanical, electrical & plumbing contractor." Full detail in
that commit's message (`git log --grep="domestic-only"`).

Found and fixed two real, pre-existing bugs while verifying this: the
footer's statutory title-block grid showed a solid rust-brown fill in an
empty cell at the 768px breakpoint (5 items don't divide evenly into 3
columns — a filler cell now catches it), and the homepage ticker strip cut
a word off mid-way at 375px with no visual cue it was scrollable (given
the same scroll-fade treatment already built for the comparison table,
generalised into a shared `.scroll-fade-x` CSS class with a `--dark`
variant).

## Round 3 & 4 (BADMAN protocol) — 4 September 2026

Two more passes since round 2's 68/100. Full detail lives in git history (each
round is several commits, not one) and `HANDOFF_BADMAN_ROUND3.md`; this is the
summary.

**Round 3** (re-baselined at 48/100 by a fresh reviewer under stricter rules —
see the note in `HANDOFF_BADMAN_ROUND3.md` on why a lower number than round 2
is not a regression): fixed a hydration mismatch on every route, a mobile hero
that pushed the primary CTA off the fold, a division toggle that rendered at
width 0 below 640px, cut the process-story showstopper from 380vh to 210vh,
fixed a motion stagger bug, styled the native form controls on `/tenders`, and
replaced 11+ visible "TBC" placeholder chips sitewide with either an omitted
field or a hidden audit marker — see `src/components/ui/placeholder.tsx`.

**Round 4** (this pass — not yet re-scored by a fresh reviewer as this file is
being written; see the top of git log / ask for the current number):
- A fresh reviewer found a real bug: the sitewide reveal-on-scroll system
  could get 10 of 14 targets permanently stuck at `opacity:0` when a large
  instant scroll (fast fling, repeated Page Down, back-navigation) crossed an
  element's IntersectionObserver threshold in a single frame. Fixed with a
  scroll-triggered safety net in `reveal-init.tsx` — see that file's comments.
- Killed the two most template-legible elements on the page (both named in
  the round 3 rebuttals as not-yet-done): the outlined giant footer wordmark
  (replaced with the statutory disclosure row restyled as a drawing title
  block) and the homepage ticker's infinite-scroll marquee (replaced with a
  static, horizontally-scrollable spec-sheet index strip).
- Merged the homepage's Standards and Founders sections into one (user
  picked this from three proposed mobile-length fixes) — desktop 10.9 → 10.6
  viewports, mobile 18.2 → 17.4.
- Cut sitewide reveal-animation targets from 14 to 8 (motion-cookbook's
  ~6-per-viewport-entry rule) by revealing a list once instead of per-row.
- **Gave the commercial division a real URL** — `/commercial` and
  `/domestic`, DESIGN_SYSTEM.md §10's recommended fix, previously the
  single biggest architectural gap (half the site had no search surface).
- **Added the first tests in the repo** — vitest, `calculateQuote` and the
  `movingLocation` derivation (13 tests) — see "Still open" below, this was
  outstanding since round 1's £400 pricing bug.
- **New feature**: `/emergency` — a triage flow for gas smell / leak / no
  heat / no hot water, user-picked from four proposed options. Gas smell gets
  an always-visible safety banner routing to the National Gas Emergency
  Service; the other three are keyboard-operable, JS-optional `<details>`
  panels with do-this-now steps, closing on the existing arrival-window
  promise and routing into `/boiler-quote` or the contact-links fallback.

## Design & conversion pass (BADMAN protocol) — 3–4 September 2026

The outstanding fresh-eyes **visual** review noted at the bottom of this file finally ran, and
it did not go well: an independent design critic, given no build context, scored the site
**40/100** and called it "a well-typeset placeholder". The full findings and what was done about
each are below. Everything on that list is now either fixed or explicitly rebutted.

### What the review found, and what changed

**The proof layer was empty and said so.** Three consecutive homepage sections read "nothing here
yet" — recent work, reviews, accreditations held — plus a stats row that was 3/5 TBC. Those
sections are **removed**, not restyled. In their place sit four things that are true on day one:
a numbered schedule of commitments, a four-stage process story, the published standards the work
is done to, and the two named directors. New content lives in `src/lib/content/promises.ts`.

**Every phone CTA dialled nothing.** `tel:`, `mailto:` and `wa.me/` were all rendered with no
number after the colon — the primary conversion path for a local trade did not exist. All contact
affordances now resolve through `src/lib/content/contact-links.ts`, which returns a real dialler
link when a number exists and routes to `/contact` when it does not. Added a sticky mobile
call bar and a real mobile nav drawer, neither of which existed.

**Internal artefacts had leaked into public copy.** "See ACCREDITATION_ROADMAP.md" (a file that
was never written), "see CONTENT_NEEDED.md", "TENDER WEAPON" as a page eyebrow, and raw route
paths as body text. All removed. `/capability` also headed a list "Qualifications held" that
listed five accreditations the business does not hold — corrected to "working towards".

**The quote wizard was the worst of it.** It validated nothing (you could walk all eight steps
answering nothing), failed silently on submit, showed its honeypot field to real customers, and
labelled the phone input "Phone (any number here is saved immediately, even if you stop)". It
also rendered the postcode/phone panel *and* the final contact form on the same screen, asking
for both twice. Rewritten: per-step validation with a focused error summary, explicit labels and
`autocomplete` on every field, the duplicate panel removed, the honeypot taken out of the layout,
and the abandonment-capture disclosure rewritten as an honest note under the form with a link to
`/privacy`.

**`/prices` was headlined "Real prices" above eight TBC chips.** It now leads on *how* pricing
works and routes to the instant quote, and turns back into a price list automatically via
`HAS_PUBLISHED_PRICES` once real figures land.

**`/care-plans` took a recurring card payment with no terms.** Added exclusions, terms at a
glance, and a purchase-anxiety FAQ; gave the middle tier centre stage and a "most chosen" badge;
fixed excluded-feature rows that were 2.42:1 (failing AA outright).

**`/tenders` asked for 13 fields and a file upload while giving nothing.** Added the evidence
column — what comes back and when, and how a contract runs. Removed "most small contractors take
a fortnight", an unsupported swipe at unnamed competitors.

### What was added

- **Art direction executed, not just specified.** Fluid `clamp()` type throughout (no font-size
  media queries anywhere), a fluid section-spacing token — `--space-section-desktop` had been
  defined and then never used, so every section on every page was running at the 72px mobile
  value at all widths — and a deliberate light/dark section rhythm.
- **A showstopper.** `process-story.tsx`: a pinned scroll story drawing a heating system stage by
  stage, with the blue flame lighting only at commissioning. Desktop only; degrades to a stacked
  list on phones; no-JS and reduced-motion both land on the complete static drawing.
- **Expensive details** beyond the two that existed: grain, blueprint grid, section index
  numbers, animated link underlines, a scroll-driven progress rail, a marquee, odometer counters,
  a print stylesheet, and hover states on everything interactive (there were none on the nav,
  the dockets, or the footer).
- **Launch ops**: sitemap, robots (AI crawlers explicitly allowed, reversible in one line), a
  designed OG image, a custom 404 in the drawing-register conceit, `/contact`, `/privacy`,
  `/terms`, `llms.txt`, a favicon set, and `Plumber` LocalBusiness JSON-LD carrying only real
  data. Analytics goes through one swappable `track()` wrapper; no third-party script ships, so
  no cookie banner is needed yet.
- **`DESIGN_SYSTEM.md`** — the handover pack: tokens, contrast pairs, section rhythm, the
  showstopper's rules, the plugin list, the event map, and the honesty rules that must not be
  "fixed".

### Verified, not assumed

- Zero horizontal overflow across 10 pages × 3 widths (375 / 768 / 1440), plus 320px and
  landscape phone.
- Content stress test: 40-character unbreakable words in every heading, card and table cell at
  320px — no overflow. (It failed this before `overflow-wrap: anywhere`.)
- **Zero WCAG AA contrast failures** across all 10 pages in both division states, measured
  programmatically. Round one found 27 on `/care-plans` alone.
- Mobile drawer: focus moves in, Escape closes, body scroll locks and unlocks, focus returns.
- JS-off: the server HTML carries no `.js` class, so no reveal element is ever trapped invisible;
  all four process stages, six `<details>` accordions and every CTA are real HTML.
- Heading outline reads as a table of contents; one `h1`; skip link; all images have `alt`.

### Round two, and the code review

A second independent design critic scored the rebuilt site **68/100** — up from
40, but short of the 85 gate. In parallel an independent code reviewer went
through the diff and found five defects that neither `tsc` nor `eslint` could
see, because every one was a wiring or logic error rather than a type error.
Those mattered more than the design findings:

- **Every completed boiler quote was overcharged by £400.** The relocation
  uplift was derived from `boilerLocation !== targetLocation`, and the rewrite
  had told people to leave the target blank if the boiler was staying put — so
  `"Airing cupboard" !== ""` made the flag true for essentially every customer.
  Fixed and verified end-to-end: the same input now returns £1,850–£2,400
  (base price, no uplift) instead of £2,250–£2,800.
- **All four public forms would have hard-failed the day Turnstile keys were
  configured.** The server guard has always verified a `turnstileToken`, but no
  component ever rendered a widget or produced one — invisible only because
  verification stubs to "pass" while unconfigured. The widget now exists and is
  wired into all four forms.
- **Abandonment capture was dead.** Moving postcode and phone onto the final
  screen meant `saveQuoteStep` — only ever called from `next()`, which never
  runs on the last step — could not carry a phone number, so the lead upsert
  could never fire. Restored via capture on blur, and verified: the autosave
  payload now contains the phone number.
- **The step autosave was rate-limited mid-wizard.** Seven saves against a
  five-per-minute IP-keyed limit silently dropped the photo upload and the
  urgency answer, and behind CGNAT it throttled whoever happened to be second.
  Now keyed per quote id with a limit that fits the whole wizard.
- **Client validation accepted values the server schema rejects.**
  `Number.isFinite` where the schema requires `.int()`, so "3.5" passed the
  client, failed server-side, and killed every later save for that visitor
  with nothing shown on screen.

Also fixed from that review: nineteen literal `PLACEHOLDER: FIELD_NAME` tokens
rendering in public copy including the privacy notice; a flash of un-hidden
content on every page load; an IntersectionObserver that never released
unmounted targets; a counter whose animation frame outlived its component;
focus not returning to the menu trigger on Safari; AI crawlers being granted
the paths the `*` rule blocks; nulls rendering as prose ("Public liability of
confirmed on request"); invalid `<dl>`/`<details>` markup; and the copyright
year freezing at build time.

The retention schedule and complaints procedure are now written out in full,
rather than placeheld — they were policy decisions, not facts pending at
Companies House.

### Still open

- ~~The Commercial division has no URL~~ — **done in round 4**: `/commercial`
  and `/domestic`, see `DESIGN_SYSTEM.md` §10.
- **`/prices` still publishes no prices.** Every label that pointed at it now
  reads "How we price" and the page leads on method, so nothing promises what
  it cannot deliver — but the page is thin until real figures are signed off.
- ~~There are no tests in the repo~~ — **`calculateQuote` and
  `movingLocation` are covered as of round 4** (`src/lib/quote/pricing.test.ts`,
  `npm test`). Nothing else in the repo has coverage yet — the quote wizard's
  step validation and the postcode-coverage check are the next highest-value
  units.
- The boiler-quote wizard does not work with JavaScript disabled (see
  `DESIGN_SYSTEM.md` §11).
- **ICO registration** is a legal requirement already triggered — the wizard is processing
  personal data today. Raised in `CONTENT_NEEDED.md`.
- Company number and registered office in the footer are a Companies Act 2006 disclosure
  requirement, not a nice-to-have.
- No photography; dockets and director cards render drawn technical artwork until it exists.

---

## Phase 1 — THE PITCH ✅

- [x] Design system: tokens, fonts, Docket/Placeholder/MonoStat primitives, motion (reveal
      system, hero breathing gradient), zero-shadow / 2px-radius / copper-hairline layout rules
- [x] Homepage in both Commercial ⇄ Domestic toggle states, no reload, cookie-persisted,
      commercial default — restructured in the design pass above; the section list no longer
      matches §8.1 one-for-one, and the reasons are documented there
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
`/team`, `/projects`, `/areas`, `/about`, `/guides`, `/careers`.
(`/contact` and `/emergency` were both pulled forward into the design pass — several CTAs fall
back to `/contact` when the phone number is unconfirmed, and `/emergency` is round 4's new
triage-flow feature, so both had to exist already.)

## Phase 3 — not started

`/ops` director dashboard (leads pipeline, tender tracker, contract register, compliance
document library, quote requests, job/project CMS, care plan calendar, review request loop),
`/portal` client portal, all scheduled automation engines from §11 (quote abandonment nudges,
review requests, renewal reminders, PPM/contract/compliance/tender-deadline alerts), Stripe
webhook handling for subscription lifecycle, finance calculator (feature-flagged off pending
FCA status per §9.2), `/partners`.

## Phase 4 — partly delivered in the design pass

Done: FAQPage **and** `Plumber`/LocalBusiness JSON-LD, OG image generation, sitemap, robots,
llms.txt, favicon set, custom 404, the analytics event map behind a swappable `track()` wrapper,
and a measured WCAG AA contrast pass (zero failures across all 10 pages, both division states).

Still Phase 4: Service / BreadcrumbList / Article schema, a full Lighthouse run against a
production build on real hosting, wiring an actual analytics provider to `track()`,
`GOOGLE_BUSINESS_PROFILE.md`, `BRAND_GUIDELINES.md`, training walkthroughs. There is no
`ACCREDITATION_ROADMAP.md` and no need for one — the target list lives in `ROADMAP_TARGETS` in
`src/components/home/standards.tsx`, and the dangling reference to that filename had leaked onto
the live site as body copy.

## Self-review status

The fresh-eyes **visual** review that was outstanding has now run twice — see the design pass at
the top of this file. Round one scored 40/100 with 31 findings.

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

- `npm run build` — clean, 20 routes compile (`NEXT_DIST_DIR=.next-build npm run build`
  if `next dev` is also running — see next.config.ts)
- `npm run lint` — clean (runs as part of `next build` too)
- `npm test` — 13/13 passing (vitest; `calculateQuote` and `deriveMovingLocation`)
- TypeScript strict, zero `any`, zero `@ts-ignore`
- RLS enabled + deny-by-default on all 5 Phase 1 tables (`supabase/migrations/0001_phase1_schema.sql`);
  not yet verified against a live Supabase project with an anon client (no project provisioned
  in this session — verification steps are in the migration file's comments)
