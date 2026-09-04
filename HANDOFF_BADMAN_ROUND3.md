# BADMAN round 3 — handoff

Written mid-pass, 4 September 2026, so this can be picked up in VS Code.
Branch: `phase-1/design-system-and-pitch`. **Nothing is committed** — all work
below is uncommitted in the working tree.

---

## Where the loop actually stands

The BADMAN protocol's ship gate is **reviewer total ≥85 with no category below
7**. It has not passed.

| Round | Score | Reviewer |
| --- | --- | --- |
| 1 | 40 / 100 | independent design critic |
| 2 | 68 / 100 | independent design critic |
| **3** | **48 / 100** | independent design critic (fresh, harsher) |

Round 3 scoring **lower than round 2 is not a regression in the site** — it is a
different reviewer with a different bar. Round 2's findings were never written
down before that session ran out of tokens, which is why round 3 was re-baselined
from scratch. Treat 48 as the honest current number.

### Round 3 scorecard

| # | Category | Score | Verdict |
| --- | --- | --- | --- |
| 1 | Distinctiveness | 4 | Well-executed instance of the template AI defaults to. |
| 2 | Typography | 6 | Real clamp scale, undone by an 8-line mobile H1. |
| 3 | Colour discipline | 7 | Genuinely disciplined, contrast-verified. |
| 4 | Layout rhythm | 3 | 13.3 desktop / 19.5 mobile viewports; one 3,420px section for 197 words. |
| 5 | Motion quality | 5 | One competent effect used 24 times, plus a scrolljack. |
| 6 | Copy sharpness | 8 | The best thing on the site by a distance. |
| 7 | Proof placement | 1 | No photos, reviews, accreditations or phone number; 11 TBC chips on the homepage. |
| 8 | Mobile experience | 3 | No usable CTA above the fold; audience switch invisible. |
| 9 | Detail density | 6 | Real craft in a11y and SVG; token and dead-code sloppiness. |
| 10 | Performance / a11y | 5 | A11y strong; hydration mismatch on every page load. |

Six categories under 7. The gate needs all ten at 7+ and a total of 85.

---

## What I changed this session (all verified, all uncommitted)

### Fixed — confirmed by measurement

**S9 · Hydration mismatch on every page.** The inline head script added `.js` to
`<html>` before React hydrated, so server and client `className` differed and
every route logged a hydration error. Added `suppressHydrationWarning` to the
`<html>` element in `src/app/layout.tsx`. **Verified: 0 console errors across all
10 routes** (was 10/10 failing).

**Docket header overflow at 768px and landscape phone.** Two `white-space:
nowrap` spans inside a `flex-wrap` header could not break at the `·` separator,
pushing the document 41px wider than the viewport at 768 and 27px at 812
landscape. This was a regression introduced by commit `a063aef` ("fix Docket
header mid-word wrap"). Each atom now stays unbroken while the line may wrap at
the separator — `src/components/ui/docket.tsx`. **Verified: zero horizontal
overflow at 320 / 375 / 768 / 1440 across 7 pages.**

Note: `PROGRESS.md` currently claims "Zero horizontal overflow across 10 pages ×
3 widths". That claim was false when I found it. It is true again now.

**Production build was broken.** `npm run build` failed with
`Cannot find module for page: /privacy`. Cause: `next dev` and `next build` share
`.next`. `next.config.ts` now takes an optional `NEXT_DIST_DIR`, so you can build
without killing the dev server:

```bash
NEXT_DIST_DIR=.next-build npm run build
```

`.next-build/` is gitignored. **Verified: clean build, 17 routes.**

**S4 · Mobile hero (was: no CTA above the fold, zero-width audience toggle).**
- Added a `--text-hero` clamp (34px → 96px) used only by the hero H1. At 375 the
  headline went from **45.6px / 8 lines / 343px** to **35.9px / 6 lines / 203px**.
- Tightened hero padding and sub-copy on phones only; desktop untouched.
- **The Commercial/Domestic toggle rendered at width 0 below 640px** — it existed
  only inside the hamburger drawer. It now has its own full-width strip directly
  under the nav on phones (`src/components/layout/site-header.tsx`), with a
  `block` variant added to `DivisionToggle`. The drawer copy is hidden below `sm`
  so two live toggles for one piece of state are never on screen together.
- **Verified at 375×812: primary CTA bottom edge at 688px (fold is 812) — fully
  visible, was off-screen. Toggle 335×46, and clicking it switches the H1.**

**S3 + S7 · Layout rhythm.**
- Process story cut from `100 + 4×70 = 380vh` to `50 + 4×40 = 210vh` —
  **3,420px → 1,890px**. Kept as the site's one showstopper rather than deleted
  (see rebuttals below).
- `--space-section` reduced (desktop 160px → 128px, still inside BADMAN's
  96–160px rule) and a new `--space-section-dense` token applied deliberately to
  commitments, FAQ and the comparison table, so the page has somewhere to speed
  up. Every homepage section previously used identical top and bottom padding —
  that *was* the metronome.
- Mobile-only gap compression across five home sections; docket art `16/9 →
  5/2` and founder art `4/3 → 16/9` on phones only.
- **Verified: desktop 11,967px → 9,859px (13.3 → 11 viewports), tallest:shortest
  ratio 1.2:1 → 3.38:1. Mobile 15,648 → 14,856px (19.3 → 18.3 viewports).**

**S8 · Motion.** Fixed a real bug: `STAGGER_BUDGET` used
`index < BUDGET ? index : 0`, so grids of more than six ran 1-2-3-4-5-6 and then
dumped every remaining sibling simultaneously. Now a modulo, so the cadence
continues. Added `.reveal--lead` and `.reveal--panel` variants so a heading, a
pricing card and body prose no longer arrive identically; applied `--panel` to
dockets and founder cards.

**S10 · Native form controls on `/tenders`.** The select, date and file inputs
rendered OS-default chrome inside a fully art-directed dark form — on the page
whose entire purpose is capturing an ITT. Added `.field-select` (custom copper
chevron), `.field-date` (recoloured picker glyph) and a real drag-and-drop
`FileDropField` (`src/components/forms/file-drop-field.tsx`) showing accepted
formats, the selected filename and size, with client-side size rejection. It
wraps a genuine `<input type="file">`, so it still submits, still works via
keyboard, and the server still re-validates. Swept the codebase — no other
unstyled native controls remain.

**S11 · Token and dead-code sloppiness.** `--rule` was consumed by `.hero-proof`
but never declared in `:root` (it only worked because the hero passed it inline —
any second use would render borderless): now declared. Removed the unused
`--font-archivo-wdth-normal`.

**S1 / S5 / proof placement · The TBC chips.** This is the biggest change and the
one to review most carefully.

The brief (§17) forbids inventing facts, and that stays. But *not inventing* a
fact and *advertising its absence in an amber warning triangle* are two different
decisions, and only the first is required. The site was showing **11 chips on the
homepage, 12 on `/capability`, 12 on `/prices`, 9 on `/contact`, and 4 in the
footer of every single page**.

`FactOrPlaceholder` now takes a `missing` mode — `"omit"` (new default),
`"fallback"`, or `"chip"` — and a new `PlaceholderMarker` renders a `hidden`
element that keeps the full audit trail. **The existing sweep still works
unchanged:**

```js
document.querySelectorAll('[data-placeholder]')
```

Applied so that:
- Footer statutory rows appear only once their fact exists.
- `MonoStat` omits a stat with no number instead of captioning a warning triangle.
- `/capability` contact list renders only routes that work; accreditations copy
  keeps every fact but no longer leads with a bolded "None held yet."
- `/prices` drops the Price **column** entirely until prices exist — the job list
  is useful, a column of eight amber triangles is not.
- `/contact` "Direct lines" lists only live routes.
- FAQ answers read as prose again instead of breaking mid-sentence for a chip.
- Hero Gas Safe cell says something true and useful ("Check any engineer's ID")
  instead of showing a customer a chip in the hero.

**Verified: visible chips 11 → 0 on the homepage, and 0 on `/capability`,
`/prices`, `/contact`, `/tenders`, `/care-plans`. Hidden audit markers preserved
(10, 12, 12, 9, 4, 4 respectively).**

I also caught and fixed a bug I introduced doing this: on `/prices` the marker
rendered a `<span>` as a direct child of `<tr>`, which is invalid HTML and threw
a hydration error. Markers now sit outside the table. Re-verified clean.

### Deliberately NOT done — rebuttals, per the protocol

**S1 "Do not ship `/capability`" and S5 "`noindex` `/prices`".** Both are page-level
deletions/deindexing, which is scope reduction and therefore your call, not mine.
I addressed the *substance* — neither page now displays its own emptiness — while
leaving both shipped. **If you want the reviewer's version, say so and it's a
ten-minute change.** My own view: `/prices` is a reasonable `noindex` candidate
until real figures land, because it will otherwise rank for price-intent queries
and deliver nothing.

**S6 "Delete the outlined footer wordmark and the marquee."** Not done — see the
Not Started list; this is part of the distinctiveness rebuild, which is a design
decision I did not want to make unilaterally mid-pass.

**S3 "Collapse the process story to a non-pinned 600px row."** Partially rebutted.
BADMAN mandates exactly one signature interactive moment per site, and this is
it — deleting the pin leaves the site with no showstopper at all. I cut it by 45%
instead. The reviewer's "~2,400px of empty black" observation is partly an
artifact of full-page screenshot capture on a `position: sticky` element; that is
not what a scrolling user sees. If it still reads as too expensive at 210vh, the
next move is a horizontal stepper, not a further trim.

**Legal-page chips on `/privacy` and `/terms` (4 each, still visible).** Kept
deliberately. These are statutory identity disclosures on compliance pages;
hiding a pending ICO registration or registered office from a reader or regulator
is worse than showing it is outstanding. This is the one context where the gap
itself is the information.

**`next/image` dead branch in `docket.tsx`.** Kept. It is the documented receiving
surface for the photography in `CLIENT_ASSETS_NEEDED.md` — deleting it means
rebuilding it when photos arrive.

---

## Not started — the work remaining to reach the gate

Ranked by likely score impact.

1. **S2 · Zero `tel:` and zero `mailto:` links on the entire site.** *This is a
   client blocker, not a code task, and it is worth more than everything else on
   this list combined.* There is no phone number anywhere in
   `src/lib/content/business.ts`. A boiler contractor with no phone number cannot
   score above ~3 on proof placement no matter what is done to the design. The
   reviewer's advice is right: **buy a divert number today.** Everything is
   already wired — `src/lib/content/contact-links.ts` returns a real dialler link
   the moment `business.phoneMain` is non-null, and the sticky mobile call bar
   and header will light up automatically.
2. **S7 · Mobile length.** Still 18.3 viewports. Padding and gaps have been
   squeezed about as far as they go; the remaining win is structural — the
   homepage has 11 sections and on a phone that is inherently long. Merging or
   cutting sections is scope work and needs your sign-off.
3. **S6 · Distinctiveness (4/10).** The reviewer's suggestion is the strongest
   idea in the whole report and I'd endorse it: `docket-fallback-art.tsx`
   (seeded four-variant pipe schematics with sheet numbers) is the one genuinely
   original asset here, and it is currently used as an *apology* for missing
   photography. Promote the technical-drawing language to the identity — hero,
   section dividers, coverage map, PDF covers — and drop the outlined footer
   wordmark and the logo marquee, which are the two most template-legible
   elements on the page.
4. **S8 · Reduce reveal targets from 24 to ~8.** The variants and the stagger bug
   are done; culling the count is not.
5. **Commercial division has no URL.** Pre-existing, still the biggest
   architectural gap — see `DESIGN_SYSTEM.md` §10 for the recommended fix and why
   prop-drilling does not work. Half the site has no search surface.
6. **No tests in the repo.** The £400 pricing defect found in the last pass was
   pure logic. `calculateQuote` and the `movingLocation` derivation are the two
   highest-value units to cover.
7. **CLS 0.077 on the homepage** (budget is 0.1 — passing, but close).
8. Re-run the gauntlet and send to a **fresh** reviewer instance. Never reuse a
   reviewer that has already scored the site.

---

## How to pick this up

```bash
npm run dev
```

Build without stopping the dev server:

```bash
NEXT_DIST_DIR=.next-build npm run build
```

Current health: **`tsc --noEmit` clean · production build clean, 17 routes · zero
console errors on all routes · zero horizontal overflow at 320/375/768/1440.**

### Verification scripts

Throwaway Playwright scripts used for every measurement quoted above are in the
session scratchpad. They are worth keeping — copy them into the repo if you want
them to survive:

```
C:\Users\user\AppData\Local\Temp\claude\C--Users-user-Desktop-PLUM-WEB\47f81457-8d15-410b-ab5d-fa74dfdf12bd\scratchpad\
  shot.js      21 full-page screenshots, 7 pages × 3 widths (before/ and after/)
  gauntlet.js  JS-off, overflow sweep, console errors, heading outline, a11y basics
  bisect.js    finds which element widens the document, by hiding and re-measuring
  sections.js  per-section heights + viewport count + tallest:shortest ratio
  stress3.js   content stress test with culprit bisect
  final.js     chip count + console + overflow regression check
  fold.js      mobile fold: H1 lines, CTA visibility, toggle width
```

They need `npx playwright` and use `channel: 'chrome'` (your installed Chrome —
no browser download required).

### Files touched this session

```
next.config.ts                              NEXT_DIST_DIR support
.gitignore                                  .next-build/
src/app/globals.css                          --rule, --text-hero, --space-section-dense,
                                             .field-select/.field-date/.field-drop,
                                             .reveal--lead/.reveal--panel
src/app/layout.tsx                           suppressHydrationWarning
src/app/capability/page.tsx                  DIRECT_CONTACTS, accreditations copy
src/app/prices/page.tsx                      conditional Price column
src/app/contact/page.tsx                     DIRECT_LINES
src/app/privacy/page.tsx                     prose fix
src/app/terms/page.tsx                       prose fix
src/components/ui/placeholder.tsx            PlaceholderMarker + missing modes
src/components/ui/mono-stat.tsx              omit empty stats
src/components/ui/docket.tsx                 header wrap fix, mobile art, reveal--panel
src/components/ui/reveal-init.tsx            stagger modulo fix
src/components/layout/site-header.tsx        mobile division strip, drawer offset
src/components/layout/site-footer.tsx        DISCLOSURES
src/components/division/division-toggle.tsx  block variant
src/components/home/hero.tsx                 mobile fold, Gas Safe cell
src/components/home/process-story.tsx        380vh → 210vh
src/components/home/faq.tsx                  prose not chips, dense rhythm
src/components/home/founders.tsx             reveal--panel, mobile art/gaps
src/components/home/standards.tsx            mobile gaps
src/components/home/service-area-map.tsx     mobile gaps
src/components/home/final-cta.tsx            mobile gaps
src/components/plugins/comparison-table.tsx  dense rhythm
src/components/forms/tender-enquiry-form.tsx styled select/date + FileDropField
src/components/forms/file-drop-field.tsx     NEW
```

### One correction to make to the existing docs

`PROGRESS.md` still says "`npm run build` — clean, all 6 routes compile" and
"Zero horizontal overflow across 10 pages × 3 widths". Both were false at the
start of this session (17 routes now, and the build was broken). Both are true
again — but `PROGRESS.md` has not been updated with any of this session's work,
because the pass was stopped part-way. Worth a rewrite before the next round.
