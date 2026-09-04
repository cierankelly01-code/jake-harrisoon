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

## Insurance (`src/lib/content/business.ts`) — appears on `/capability` and in the FAQ

- [ ] Public liability value (brief suggests ~£5m for commercial work — confirm actual)
- [ ] Employers' liability value (statutory minimum £10m — confirm actual)
- [ ] Professional indemnity value
- [ ] Contract works insurance value

## Accreditations (`src/lib/content/business.ts`, homepage "Standards" section, `/capability`)

- [ ] Accreditations currently held, with registration numbers. Currently empty, and nothing is
      rendered as "held" until this list has entries. The target list lives in
      `ROADMAP_TARGETS` in `src/components/home/standards.tsx` — there is no separate
      `ACCREDITATION_ROADMAP.md`, and an earlier version of this file referred to one that had
      never been written, which then leaked onto the live site as body copy.
- [ ] Accreditations in progress
- [ ] Manufacturer accreditations (Worcester Bosch, Vaillant, etc.)

## Service commitments (`src/lib/content/business.ts`) — homepage FAQ, `/capability`

- [ ] Out-of-hours cover description (e.g. "24hr rota" or "next working day")
- [ ] Response SLA (e.g. "4 hours")

## `/prices` (`src/lib/content/domestic-prices.ts`)

- [ ] Real prices for all 8 listed jobs — this page's entire value proposition is that the
      numbers are genuine, so none of these should ever be a guess.

      While this list is empty the page changes its own headline: it leads on *how* pricing
      works and routes to the instant quote, rather than promising "real prices" above a table
      of TBC chips. `HAS_PUBLISHED_PRICES` in that file drives the switch, so filling in even
      one price starts turning it back into a price list. Nothing else needs editing.

## Pricing logic — review, not blank placeholders

- [ ] `src/lib/quote/pricing.ts` — base combi swap price band, complexity uplifts by current
      system type, tier multipliers. Currently starter figures for a working demo; needs
      director sign-off before going live.
- [ ] `src/lib/care-plans/tiers.ts` — monthly price for Service/Cover/Complete tiers. Same
      caveat.

## Homepage — numbers with no source yet

- [ ] "Contracts live" and "sites maintained" — there is no source for either, so rather than
      render two more blank stats the homepage no longer has a stats row at all. The proof
      sections that replaced it (commitments, process, standards, the two named directors) are
      all true on day one. Add these back as a stat row once `/ops` exists and can supply real
      counts; do not hand-type them.

## Legal pages (`/privacy`, `/terms`) — must be closed before launch

These are the placeholders on the two legal pages. Unlike the ones above, several are not facts
to be looked up but decisions the directors have to make, and both pages carry a visible banner
saying they have not yet been reviewed by a solicitor. **That review is a launch blocker.**

- [ ] ICO registration number — the business must register with the Information Commissioner's
      Office (a legal requirement once it processes personal data, and it already does through
      the boiler-quote wizard). Registration is an online form and an annual fee.
      Renders on `/privacy` §1.
- [ ] Data hosting regions — which region the Supabase project is provisioned in, and whether
      any processor stores data outside the UK. Determines what `/privacy` §6 has to say about
      international transfers. Decide the region *before* the project holds real data; moving it
      later means a migration.
- [ ] Retention schedule — how long enquiries, quotes, abandoned partial quotes and uploaded
      photographs are kept. A written schedule is a UK GDPR expectation. Renders on `/privacy` §8.
- [ ] Care plan terms — notice period, minimum term, exclusions, first-service waiting period.
      Renders on `/terms` §5 and should also be issued with the welcome email.
- [ ] Complaints procedure — acknowledgement times, escalation to a director, and which
      alternative dispute resolution scheme applies. Renders on `/terms` §11, and the footer
      already lists "Complaints procedure" as a page that does not exist yet.
- [ ] Registered office, company number, VAT number and general email also render on both legal
      pages — they are the same items listed under "Legal / registration" and "Contact" above,
      so filling `business.ts` closes them here too.

## Not fabricated, by design — add via `/ops` once it exists (Phase 3)

Inventing these would be worse than leaving them out (§17). They previously rendered as three
consecutive "nothing here yet" panels in the middle of the homepage, which read as an apology
and cost more credibility than the missing content did. Those sections have been **removed**
rather than restyled, and the work they were doing is now carried by proof that is real on day
one — the commitments schedule, the process story, the standards section and the two named
directors. Reinstate them as real content, not as empty frames:

- Recent projects / recent work — no real jobs logged yet. Add once the first job is logged,
  with a real photograph, job reference, location and warranty.
- Reviews (domestic) / client references (commercial) — none published yet. Collect via a direct
  Google review link after the first completed jobs; never seed with anything invented.
- Photography — see `CLIENT_ASSETS_NEEDED.md`. Until it exists, dockets render generated
  technical drawings (`DocketFallbackArt`, four seeded variants) and the directors render drawn
  competency cards. **Do not substitute stock photography**: it is the single fastest way to make
  the site look like every other trade template.
