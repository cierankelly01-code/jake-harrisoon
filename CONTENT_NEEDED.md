# Content needed

Every item below renders as a visible amber `[PLACEHOLDER: LABEL]` chip somewhere on the live
site, or (for the two pricing config files) as a code comment marked "STARTER figures — not
confirmed". Nothing on this list has been guessed at or invented — see §17 of the master brief.
Fill in `src/lib/content/business.ts` and the two pricing files below, and every chip disappears
automatically; nothing else needs to change.

## Legal / registration (`src/lib/content/business.ts`)

- [ ] Gas Safe registration number (both directors' individual numbers, plus the business's)
- [ ] Companies House company number
- [ ] VAT number (or confirmation the business isn't VAT registered)
- [ ] UTR / CIS status
- [ ] Registered office address
- [ ] Director surnames (Jake and Harrison — currently first-name only per the brief)

## Contact (`src/lib/content/business.ts`) — appears in header, footer, every form confirmation

- [ ] Main phone number
- [ ] Out-of-hours phone number
- [ ] General email address
- [ ] Dedicated tenders email address (`tenders@...` — signals a real process, see §2)

## Trading history & capacity (`src/lib/content/business.ts`)

- [ ] Year established
- [ ] Engineer count (honest number, including subcontract — apparatus not headcount inflation, see §1)
- [ ] Vehicle count

## Insurance (`src/lib/content/business.ts`) — appears on homepage credibility bar, `/capability`

- [ ] Public liability value (brief suggests ~£5m for commercial work — confirm actual)
- [ ] Employers' liability value (statutory minimum £10m — confirm actual)
- [ ] Professional indemnity value
- [ ] Contract works insurance value

## Accreditations (`src/lib/content/business.ts`, homepage accreditation wall, `/capability`)

- [ ] Accreditations currently held, with registration numbers (currently empty — nothing is
      rendered as "held" until this list has entries; see `ACCREDITATION_ROADMAP.md` for the
      target list and priority order)
- [ ] Accreditations in progress
- [ ] Manufacturer accreditations (Worcester Bosch, Vaillant, etc.)

## Service commitments (`src/lib/content/business.ts`) — homepage credibility bar

- [ ] Out-of-hours cover description (e.g. "24hr rota" or "next working day")
- [ ] Response SLA (e.g. "4 hours")

## `/prices` (`src/lib/content/domestic-prices.ts`)

- [ ] Real prices for all 8 listed jobs — this page's entire value proposition is that the
      numbers are genuine, so none of these should ever be a guess.

## Pricing logic — review, not blank placeholders

- [ ] `src/lib/quote/pricing.ts` — base combi swap price band, complexity uplifts by current
      system type, tier multipliers. Currently starter figures for a working demo; needs
      director sign-off before going live.
- [ ] `src/lib/care-plans/tiers.ts` — monthly price for Service/Cover/Complete tiers. Same
      caveat.

## Homepage — numbers with no source yet

- [ ] "Contracts live" and "sites maintained" stats in the capability snapshot section
      (`src/components/home/capability-snapshot.tsx`) — left blank rather than guessed.

## Not fabricated, by design — populate via `/ops` once it exists (Phase 3)

These render as honest empty states, not placeholders, because inventing them would be worse
than leaving them out (§17):
- Recent projects / recent work (homepage) — no real jobs logged yet
- Reviews (domestic) / client references (commercial) — none published yet
