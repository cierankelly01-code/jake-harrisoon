# DESIGN.md — Hartson Heating, green and black

Written 25 November 2026. Supersedes the navy "High-street clear" direction
in `DESIGN_SYSTEM.md` for colour only; the type scale, spacing and component
conventions there still stand.

## Subject

Jake and Harrison, two Gas Safe registered engineers who own the business
50/50, based in Tamworth. Domestic only (the commercial division was switched
off on the client's instruction, Nov 2026). They do what a full plumbing and
heating firm does: emergencies, boiler installation, servicing and gas safety,
central heating, plumbing repairs, bathrooms.

Reference the client sent: **rygroup.co.uk**. What he wants from it is the
*feel* — one strong brand colour flooding the page, enormous confident type,
and three obvious things to tap. What we are deliberately not copying is
listed under "Steelman" below.

## The hero's most characteristic real element

Not a boiler. The **two names**. RY Group's whole pitch is scale — a big
faceless team, 152 reviews, award badges. Jake and Harrison cannot win that
fight and should not try. Their advantage is the opposite: you know which two
people own the company, and one of them turns up. That is the thing the
design should make unmissable.

## One-line direction

**Night shift.** Near-black canvas, one electric green, type set big and
tight, three actions and nothing else above the fold — a firm that answers
the phone at 11pm and tells you the price before it starts.

## Tokens

Set in `src/app/globals.css`. Ratios measured, not eyeballed
(WCAG 2.2 AA needs 4.5:1 body, 3:1 for UI and focus).

| Token | Value | Role | Measured |
|---|---|---|---|
| `--ink` | `#0b0f0d` | near-black, green cast | 19.3:1 on paper |
| `--slate` | `#151c18` | raised dark surface | — |
| `--slate-deep` | `#050806` | deepest black | — |
| `--paper` | `#ffffff` | page background | — |
| `--paper-raised` | `#f1f4f1` | card surface | — |
| `--flame` | `#2fd37a` | the action green | black on it 9.9:1 |
| `--flame-deep` | `#0b5c33` | dark green panel | white on it 8.1:1 |
| `--flame-glow` | `#1e9e5a` | focus ring | 3.5:1 paper / 5.6:1 ink |
| `--flame-pale` | `#a8f0c6` | text on `--flame-deep` | 6.2:1 |
| `--flame-tint` | `#e6f8ee` | light green wash | — |
| `--copper-ink` | `#0a6b3a` | eyebrow on light | 6.6:1 |
| `--copper-bright` | `#57e093` | eyebrow on dark | 11.5:1 |
| `--steel` | `#55605a` | secondary on light | 6.6:1 |
| `--steel-dim` | `#a6b3ac` | secondary on dark | 8.9:1 |
| `--success` | `#11764b` | confirmations | 5.7:1 |

Rule, same as the navy build: **green is the action colour and nothing else.**
Amber stays reserved for emergency and unconfirmed-fact chips.

The near-black is not `#000`. It carries a faint green cast so the two brand
colours read as one family, and pure black on a screen at night is harsh.

Type: Figtree, unchanged — 800 for headlines with tight tracking, 400/500 for
body. One family, weight contrast. No second display face.

Radii, spacing, easing: unchanged from `DESIGN_SYSTEM.md`.

## Wireframe — 375 first

```
┌─────────────────────────────┐
│ ●marmion            [≡]     │  black header, green dot
├─────────────────────────────┤
│                             │
│  TAMWORTH · GAS SAFE        │  green eyebrow
│                             │
│  Heating sorted.            │  48px, 800, tight
│  By the two people          │  white on near-black
│  who own the firm.          │
│                             │
│  Jake and Harrison. No      │  --steel-dim
│  call centre, no sub-       │
│  contractors.               │
│                             │
│  ┌───────────────────────┐  │
│  │  Emergency — call now │  │  green fill, black text
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  Get a fixed price  → │  │  outline, white
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  Book a service     → │  │  outline, white
│  └───────────────────────┘  │
│                             │
│  Tamworth · Lichfield ·     │  small, --steel-dim
│  Sutton Coldfield +12       │
├─────────────────────────────┤
│  WHAT DO YOU NEED?          │  white section
│  ┌──────────┐ ┌──────────┐  │
│  │ Boiler   │ │ Something│  │  2-up on mobile,
│  │ install  │ │ broken   │  │  4-up at 1440
│  └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐  │
│  │ Service &│ │ Plumbing │  │
│  │ safety   │ │ & baths  │  │
│  └──────────┘ └──────────┘  │
├─────────────────────────────┤
│  Everything we do  (6 rows) │
├─────────────────────────────┤
│  The price we quote is the  │  --flame-deep panel
│  price you pay.             │
├─────────────────────────────┤
│  How it works (3 steps)     │
│  Meet Jake & Harrison       │
│  Areas we cover             │
│  FAQ                        │
│  Final CTA                  │
└─────────────────────────────┘
```

## One signature moment

The **need router** ("What do you need?"). Four large cards, each a real
`<a>`, each with a one-line plain-English answer to "is this me?". On hover
or focus the card lifts 2px and its icon tile flips to the green fill — one
transform, one colour, 240ms, `--ease-enter`. Nothing else on the page moves
on its own.

It works with JavaScript off: they are links, not a widget. No carousel —
RY Group's sliders hide three quarters of their own content on a phone and
need a working pointer to escape.

**Correction to "one signature moment":** the site also runs a sitewide
scroll-reveal (`reveal-init.tsx`) on about fourteen homepage targets. It
predates this direction, it respects `prefers-reduced-motion`, and it is
well built — but it means the claim that nothing else moves on its own was
never true. Noted rather than removed; if Jake finds the page busy, that is
the first thing to turn off.

## AI-tell check

- [x] No purple-to-blue gradient, no glassmorphism, no floating blobs
- [x] No stock photography — only the client-supplied cutaway render
- [x] No invented reviews, star ratings, counters or "trusted by" logos
- [x] No "Elevate / Seamless / Unlock / Empower" in any heading
- [x] No emoji as iconography
- [x] Asymmetric hero, not a centred-everything template
- [x] Real numbers or an honest blank — never a plausible-looking placeholder
- [x] One accent colour, used only for actions

## Steelman

**The case against this direction:** a near-black homepage is a gamble for a
domestic trade. The homeowner Jake wants is a 45-year-old with a cold house,
and black-and-green is the palette of gaming chairs, protein brands and
crypto — it can read as "slick marketing outfit" at exactly the moment
someone is deciding whether to let two strangers into their home. RY Group's
orange is warm and municipal; it looks like a utility, which is why it works.

**Why we are doing it anyway:** the client chose the colours, and the risk is
in the *execution*, not the hue. We spend the black only on the hero and one
mid-page panel, keep every content section on white, and put the two owners'
names in the first sentence. That buys the confidence of the dark brand
without the coldness. If Jake comes back and says it feels hard, the fix is
one token (`--ink` → a deep green `#0d2a1c`) and not a rebuild.

**What we are deliberately not copying from RY Group:** the hero carousel
(hides content, poor on mobile), the chat widget (nobody mans it), the cookie
wall over the fold, "award winning" (we have no award to point at), and the
Google rating block (Jake has no reviews yet — an empty or faked one is worse
than none).
