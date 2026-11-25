# Design system & front-end handover

Everything visual on this site is driven from one file. If you want to re-skin
it, change `src/app/globals.css` and nothing else.

> **Round 5 (17 September 2026): full front-end redesign.** The client
> reviewed the Neo-Industrial build (rounds 1–4) and rejected it as "too
> AI-y" — the mono labels, drawing-sheet numbering, exposed hairlines and
> clever copy read as generated. The benchmark they gave is boxt.co.uk: a
> clean, friendly, consumer boiler site. Sections 1–5 below describe the
> new direction; everything from §6 on is unchanged.

---

## 1. Art direction

**High-street clear.** The site should read like a well-run local firm's
shop front: plain words, clear prices, rounded cards, lots of white. It
borrows BOXT's *structure* (hero with price anchor + tick list, boiler types,
why-us, three steps, engineers, pricing tiers, FAQ) and differs on the one
thing BOXT can't claim — two named owners who quote and fit the work
themselves — plus an instant estimator on the homepage instead of a gated
questionnaire.

| | |
|---|---|
| Type | **Figtree only.** 800 for display (tracking −0.02/−0.03em), 400/500/600 for body and UI. No second family, no monospace anywhere. |
| Colour | Navy `--ink` for headings and dark panels, white page, warm grey `--paper-raised` bands, **flame blue `--flame` for every action and nothing else**. Amber is reserved for emergency, warnings and unconfirmed-fact chips. |
| Radius | 16px cards, 12px buttons/fields, 24px hero and CTA panels, pills for chips |
| Shadows | None at rest. One soft shadow on hover (`--shadow-card`) and on the two "lifted" cards (estimator, quote wizard). |
| Motion | Gentle rise-and-fade reveals (`--ease-enter`, 520ms), 150–260ms hover transitions. No marquees, no pinned scroll stories, no infinite loops. |

The token **names** from the previous build were kept so every inner page
kept rendering; only their values changed. So `--copper` is now the light
border grey, `--copper-ink` the blue eyebrow colour, and `.font-mono-label`
is a bold sans eyebrow, not monospace. `.section-index` no longer prints a
number and `.grain` / `.blueprint-grid` are no-ops.

---

## 2. Tokens

All in `:root` in `src/app/globals.css`, mirrored into Tailwind via
`@theme inline`. Component classes (`.btn`, `.card`, `.chip`, `.tick`,
`.field`, `.seg`) live in `@layer components` so Tailwind utilities such as
`hidden md:inline-flex` still win over them — an unlayered `.btn { display }`
once leaked two desktop buttons into the phone header.

**Contrast pairs** (all verified AA):

| Token | Use on | Ratio |
|---|---|---|
| `--steel` | Secondary text on white | 6.4:1 |
| `--steel-dim` | Secondary text on `--ink` | 8:1 |
| `--copper-ink` | Eyebrow labels on white | 6.4:1 |
| `--flame` | White text on it (buttons) | 5.2:1 |
| `--amber-ink` | Warning text on white | 5.5:1 |
| `--amber` | Warning text on `--ink` only | 8:1 |

**Type** is fluid via `clamp()`. **Space:** `--space-section` (64→128px) for
sections, `--space-section-tight` for secondary ones. Layout width is
`--container` (76rem) via `.container-x`.

---

## 3. Homepage order

```
Hero + instant estimate   headline, from-price, ticks, client's cutaway render; estimator card below
Boiler types              combi / system / regular with line drawings
What's included           three things usually charged as extras
How it works              three steps + "what happens on the day" checklist
Engineers                 the two directors + the standards the work is done to
Comparison                Marmion vs common trade practice (stacks to cards on phones)
Care plans                three tiers with real prices from lib/care-plans/tiers.ts
Coverage                  town chips; radial map on md+ only
FAQ                       <details> accordion, FAQPage JSON-LD
Final CTA                 navy panel
```

Removed in this round: sectors ticker, commitments grid, the pinned
process-story showstopper, standards/founders dark section, the Docket card
and its generated art, the drawing-register 404, the outlined OG card.

---

## 4. The one interactive moment

`src/components/home/quick-price.tsx`. Four taps (property, current boiler,
bedrooms, bathrooms) run the real `calculateQuote` engine in the browser and
show the fitted range plus the recommended size. "Get my fixed price" writes
the answers into the wizard's own localStorage key and the wizard opens on
the first unanswered step with a one-line "we've kept your answers" note.
Without JS the button is a plain link to `/boiler-quote`.

Note for the directors: only *current boiler type* changes the price bands
in `lib/quote/pricing.ts`; bedrooms and bathrooms change the recommended kW.
If size should also move the price, that's a pricing-config decision, not a
front-end one.

---

## 5. Plugins

| Plugin | File | Notes |
|---|---|---|
| Sticky call bar | `components/plugins/sticky-call-bar.tsx` | Mobile, two actions (callback / quote), hidden on `/boiler-quote` and `/contact`, `inert` while off-screen. Becomes a real `tel:` button the day `business.phoneMain` is set. |
| Callback form | `components/forms/callback-form.tsx` + `app/contact/actions.ts` | Name, phone, postcode, topic, best time. Turnstile + honeypot + rate limit via `guard.ts`; writes a `leads` row (type `general`, or `emergency` for breakdown/leak) and emails the directors. |
| Comparison table | `components/plugins/comparison-table.tsx` | Table on md+, cards below. Names no competitor. |
| FAQ accordion | `components/home/faq.tsx` | Native `<details>`; questions whose answer would be "to be confirmed" are reworded rather than shown with a chip. |
| Pricing tiers | `components/care-plans/care-plans-section.tsx` | "Recommended" badge, never "most chosen" — there is no customer data to support that yet. |
| Quote wizard | `components/quote/quote-wizard.tsx` | Location step is now chips; result screen ends on "Book my free survey" with the PDF demoted to a text link. |

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
- [ ] Real photographs of Jake and Harrison (and a van, and a fitted
      boiler) for the "Who turns up" cards and, ideally, the hero. Never
      substitute stock photography. The cutaway render in `public/` was
      supplied by the client; a real photo would convert harder.
- [ ] Three real reviews with name, town and month, and a Google rating,
      for the space under the hero.
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
