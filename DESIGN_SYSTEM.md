# Design system & front-end handover

Everything visual on this site is driven from one file. If you want to re-skin
it, change `src/app/globals.css` and nothing else.

---

## 1. Art direction

**Neo-Industrial.** The site should read like a drawing office: exposed
structure, hairline rules, spec-sheet metadata, mechanical motion. It should
never read like a template with a photo of a smiling engineer on it.

| | |
|---|---|
| Display | Archivo, dialled to the wide end of its `wdth` axis (125) — this is "Archivo Expanded" without loading a second family |
| Body | Instrument Sans |
| Spec / micro-labels | Martian Mono, uppercase, 0.14em tracking |
| Radius | **2px maximum, anywhere.** There are no rounded cards on this site |
| Shadows | None. Depth comes from hairline borders and surface shifts |
| Motion | Mechanical — `--ease-mech`, stepped and linear. Never springy |

**The colour rule.** Blue = correct combustion = the job done properly. Amber
= incomplete combustion = danger. Amber is reserved for emergency, expiry and
unconfirmed-fact contexts, and is **never** a CTA or decorative colour.

---

## 2. Tokens

All in `:root` in `src/app/globals.css`, mirrored into Tailwind via
`@theme inline`, so `bg-flame` and `var(--flame)` are the same value.

**Contrast pairs that matter** (all verified against WCAG AA):

| Token | Use on | Ratio |
|---|---|---|
| `--copper` | Borders and rules only | — |
| `--copper-ink` | Copper **text on `--paper`** | 5.26:1 |
| `--copper-bright` | Copper **text on `--ink`** | 6.9:1 |
| `--steel` | Secondary text on `--paper` | 5.99:1 |
| `--steel-dim` | Secondary text on `--ink` | 8.9:1 |
| `--amber` | Text/icons on `--ink` only | 8.17:1 |
| `--amber-ink` | Warning text on `--paper` | 5.08:1 |

Using `--copper` for text on paper is 4.46:1 and **fails AA** — that is why
`--copper-ink` exists. Same for `--steel-dim` on paper (2.42:1): don't.

**Type** is fluid via `clamp()`. There is not a single `font-size` media query
in the codebase. `--text-4xl` through `--text-6xl` scale with the viewport;
body sizes are fixed.

**Space.** `--space-section` (`clamp(4.5rem, 2.5rem + 6vw, 10rem)`) is the
section-padding token. Use it, not the fixed endpoints.

---

## 3. Layout rhythm

The homepage deliberately alternates light and dark so it has a pulse rather
than running as one continuous cream field:

```
Hero            dark    hook + day-one proof
Ticker          dark    what's covered — static spec-sheet index strip
Commitments     light   the named guarantee
Services        light   the offer
Process ★       dark    THE SHOWSTOPPER
Standards       dark    borrowed credibility + who turns up
Comparison      light   objection handling
Care plans      light   secondary offer (domestic only)
Coverage        light   local proof
FAQ             light   remaining objections
Final CTA       blue    close
```

Standards and Founders (the two named directors) were separate sections
through round 3; merged into one in round 4 (mobile ran 18+ viewports, and
they were back-to-back "credibility" content) — see standards.tsx. Nothing
was cut.

The homepage ticker used to be an infinite-scroll marquee — also round 4,
killed alongside the outlined footer wordmark as the two most
template-legible elements on the page. See sectors-served.tsx.

Sections announce their own index (`01`, `02`…) via the `.section-index`
class and a `data-index` attribute — drawing-sheet numbering.

---

## 4. The showstopper

`src/components/home/process-story.tsx` is the site's **one** signature
interactive moment. A pinned scroll story in which a heating system is drawn
stage by stage: surveyed, priced, installed, commissioned. The blue flame
lights only at the final stage — the brand's whole idea in one detail.

Rules it obeys, and that any change must keep:

- **Discrete states, never continuous scrubbing.** Smooth on weak devices.
- **Desktop only.** Below 1024px it degrades to a plain stacked list. Touch
  scroll is never hijacked.
- **Reduced motion and no-JS land on the same static state**: every stage
  visible, drawing complete.
- Position is sampled once per frame *only while the section is on screen*,
  via an IntersectionObserver that stops the loop dead when it leaves. A plain
  scroll listener was not enough: it misses anchor jumps and scroll restores,
  which left the story frozen on stage one while the reader looked at stage
  four.

Do not add a second big animated moment. The restraint everywhere else is what
makes this one land.

---

## 5. Plugins

Self-contained, token-driven, no dependencies.

| Plugin | File | Notes |
|---|---|---|
| Sticky call bar | `components/plugins/sticky-call-bar.tsx` | Mobile, bottom-anchored, appears after 560px of scroll, safe-area inset, `inert` while off-screen so its links leave the tab order |
| Turnstile widget | `components/security/turnstile-widget.tsx` | Renders nothing when no site key is set, matching the server's own stub. Writes into `turnstileToken`, which is the field `guard.ts` reads |
| Comparison table | `components/plugins/comparison-table.tsx` | Names no competitor; right column describes common trade practice |
| FAQ accordion | `components/home/faq.tsx` | `<details>`-based, works with JS off, emits FAQPage JSON-LD |
| Pricing table | `components/care-plans/care-plans-section.tsx` | 3 tiers, "Most chosen" badge on the middle tier, high anchor on Complete |
| Spec-sheet index strip | `components/home/sectors-served.tsx` | Static (round 4 — was an infinite-scroll marquee), single row, `overflow-x-auto` |
| Counter | `components/ui/counter.tsx` | Odometer roll-in. Never animates a placeholder |

---

## 6. Analytics event map

No third-party script ships today, which is also why the site currently needs
no cookie banner. `src/lib/analytics.ts` is the single wrapper — wire your
vendor up in `send()` and nothing else changes.

`cta_click` · `division_switch` · `quote_step` · `quote_complete` ·
`quote_partial` · `care_plan_checkout` · `capability_download` ·
`tender_enquiry` · `faq_open` · `process_stage`

Prefer Plausible or Fathom: no cookies, no personal data, no consent banner
needed for UK/EU traffic under PECR. Choosing GA4 instead means building a
consent gate before `track()` may fire.

`variant(testName)` in the same file gives you A/B bucketing with a
localStorage assignment and no third-party tool.

---

## 7. Two traps this codebase has already fallen into

**Placeholders must never print their own field name.** The `Placeholder`
component shows "To be confirmed" (or "TBC" compact) and carries the internal
label in `title`, `aria-label` and `data-placeholder`. An earlier version
printed `PLACEHOLDER: ICO REGISTRATION NUMBER` on screen, which put nineteen
developer tokens into public copy including the privacy notice. Sweep for them
with `document.querySelectorAll('[data-placeholder]')`, not by eye.

**A null must render as a chip, never as substituted prose.** Replacing a null
with a phrase produced "Public liability of confirmed on request and
employers' liability of confirmed on request" — a customer-facing insurance
claim in a procurement context. FAQ answers are therefore React nodes with a
separate `plain` string for the JSON-LD, so a chip can render inline.

## 8. Honesty rules (do not "fix" these)

This build deliberately refuses to invent facts. `src/lib/content/business.ts`
holds `null` for everything unconfirmed, and those render as amber placeholder
chips. See `CONTENT_NEEDED.md`.

Three deliberate design decisions follow from that:

1. **Contact affordances never link to a bare `tel:` or `mailto:`.** Every one
   goes through `src/lib/content/contact-links.ts`, which returns a real
   dialler link when a number exists and routes to `/contact` when it doesn't.
   A `tel:` with nothing after the colon is the most valuable control on a
   phone silently failing.
2. **`/prices` changes its own headline.** While `domestic-prices.ts` has no
   confirmed figures, the page leads on *how* pricing works and routes to the
   instant quote. It becomes a price list automatically the moment real
   numbers land — `HAS_PUBLISHED_PRICES` drives it.
3. **Accreditations render as held only from `business.accreditationsHeld`.**
   Everything else is labelled as being worked towards. The capability page
   previously headed a list "Qualifications held" when none were.

Proof that *is* real on day one lives in `src/lib/content/promises.ts`:
commitments, process detail, and the published standards the work is done to.
That file is what replaced three consecutive "nothing here yet" sections.

---

## 9. Before launch

- [ ] Fill in `business.ts` — every placeholder chip disappears on its own.
      The footer's company number and registered office are a **Companies Act
      2006 disclosure requirement**, not a nice-to-have.
- [ ] Directors sign off `lib/quote/pricing.ts` and `lib/care-plans/tiers.ts`.
      Both currently hold starter figures.
- [ ] Solicitor reviews `/privacy` and `/terms`.
- [ ] Real photography to replace `DocketFallbackArt` and the founders'
      competency cards. Never substitute stock photography — it is the single
      fastest way to look like every other trade site.
- [ ] Smoke test on a real phone, not devtools emulation.

## 10. Solved: the Commercial division has a real URL

**Round 4 status: done.** `/commercial` and `/domestic` are real, indexable
routes (`src/app/commercial/page.tsx`, `src/app/domestic/page.tsx`), each
with its own `generateMetadata`, both rendering `HomepageSections` (factored
out of `app/page.tsx` for exactly this) with the division forced server-side
regardless of the `marmion-division` cookie. `/` keeps its original
cookie-driven behaviour for a returning visitor, and its own
`generateMetadata` sets `canonical` dynamically to whichever of
`/commercial` or `/domestic` it resolved to render, so `/` and its default
division's dedicated URL are never competing duplicate-content pages. The
header's division toggle detects when it's on one of the two dedicated
routes and navigates (`router.push`) to the other instead of swapping
content under a URL that would then say the wrong thing — unchanged
everywhere else.

The mechanism that makes forcing the division possible without a second,
disagreeing `DivisionProvider`: `src/middleware.ts` stamps the resolved
pathname onto a request header, and `lib/division.ts`'s
`getInitialDivision()` reads it before falling back to the cookie. This is
the "real routes" option below (option 1) — the original write-up is kept
for context on why the alternative wasn't taken.

<details>
<summary>Original problem statement and options considered</summary>

The header toggle swaps the entire homepage — different `h1`, different hero,
different proof cells, different nav, different services. It is a substantial
second proposition. But it lived in a `marmion-division` cookie, so:

- `location.href` stayed `/` in both states.
- `<title>`, description and canonical were the same for both.
- The commercial homepage could not be linked to, shared, or indexed. For a
  firm chasing tender work, half the site had no search surface.
- The cookie persisted, so a domestic visitor who once tapped Commercial kept
  landing on the commercial homepage.

`/capability` and `/tenders` carried the commercial proposition and were
already indexed, so this was not invisible — but the commercial *homepage*
was.

**Options considered, in preference order:**

1. **Real routes** (taken). `/commercial` and `/domestic` as their own pages,
   each with its own `generateMetadata` (title, description, canonical),
   rendering the shared homepage sections with the division forced. `/` keeps
   the cookie-driven behaviour and canonicalises to whichever it renders.
   The only option that gives both propositions their own search surface.
2. **Middleware rewrite.** `/commercial` and `/domestic` rewrite to `/` and
   set the cookie. Twenty lines, makes both states shareable and keeps the
   header nav consistent — but both URLs serve identical metadata, so you must
   set a distinct canonical per path or Google will treat one as a duplicate
   and drop it. Not taken: option 1 was barely more work and needed no extra
   canonical bookkeeping.

</details>

Do not attempt this by prop-drilling a division override through the ten
homepage sections, or by wrapping just the page content in a second, nested
`DivisionProvider`. The header and footer share the *same* provider instance
as the page — all three live inside one `DivisionProvider` in the root
layout — so a nested override around only `{children}` leaves the header
reading the outer (cookie-driven) provider while the page reads the inner
(forced) one, and the nav disagrees with the page it's sitting above.

## 11. Known limitation

The boiler-quote wizard is a client-side multi-step form and does not work
with JavaScript disabled. Everything else on the site renders and every other
primary action (calling, the tender enquiry, navigation, the FAQ) works
without it. If JS-off quoting matters, the fix is a `<form>`-per-step server
round-trip, which is a rebuild rather than a patch.
