/**
 * PROMISES, PROCESS AND STANDARDS
 *
 * Nothing in this file is a fact about the business — those all live in
 * `business.ts` and stay `null` until confirmed (see CONTENT_NEEDED.md).
 * What lives here is the other kind of proof a business has on day one,
 * before it has reviews, case studies or accreditation certificates:
 *
 *   1. Commitments it makes. Every promise below is already published
 *      elsewhere in this build (hero copy, credibility bar, FAQ) — this file
 *      only names and packages them so they can carry weight instead of
 *      being scattered one-liners. Wording still needs director sign-off.
 *   2. Process specificity. Describing exactly what happens on a job is
 *      truthful, checkable, and the strongest proof available to a new firm.
 *   3. Borrowed credibility — the published standards the work is done to.
 *      These describe the standard itself, never a claim to hold an
 *      accreditation. Anything the business must actually be registered for
 *      stays in `business.accreditationsHeld` and renders only once real.
 */

export type Promise_ = {
  id: string;
  title: string;
  detail: string;
  /** The thing that makes it checkable rather than a slogan. */
  proof: string;
};

/** Domestic — the homeowner's four fears, answered. */
export const DOMESTIC_PROMISES: Promise_[] = [
  {
    id: "price",
    title: "The price we quote is the price you pay",
    detail:
      "You get a fixed written price before an engineer starts. It does not move afterwards — not for parts, not for time, not for what we find behind the old boiler.",
    proof: "The only thing that changes a quoted price is you changing the scope, in writing.",
  },
  {
    id: "engineers",
    title: "Our engineers, not a subcontractor",
    detail:
      "The Gas Safe registered engineer who quotes your job is the one who turns up to do it. We do not sell leads on and we do not send a stranger.",
    proof: "Both directors are on the tools and Gas Safe registered.",
  },
  {
    id: "arrival",
    title: "Two-hour arrival windows",
    detail:
      "Not “sometime Tuesday”. A two-hour window, and a phone call when we leave the job before yours so you are not sat waiting on a guess.",
    proof: "We call ahead every time. If we are going to miss the window, you hear it from us first.",
  },
  {
    id: "callout",
    title: "No callout fee on quoted work",
    detail:
      "Coming out to price the job costs you nothing. You only pay when you have accepted a written price and we have done the work.",
    proof: "No callout charge, no “assessment fee”, no charge for the quote itself.",
  },
];

/** Commercial — the buyer's four procurement fears, answered. */
export const COMMERCIAL_PROMISES: Promise_[] = [
  {
    id: "pqq",
    title: "PQQ documentation back within 24 hours",
    detail:
      "Send the ITT and you get completed pre-qualification documentation the next working day, not a promise to “get something over” at the end of the week.",
    proof: "24 hours from receipt of the ITT, in writing.",
  },
  {
    id: "rams",
    title: "RAMS issued before every mobilisation",
    detail:
      "Risk assessments and method statements are with your site team before anyone arrives — every mobilisation, not just the first one.",
    proof: "Nobody sets foot on your site without the paperwork already in your hands.",
  },
  {
    id: "subcontract",
    title: "Vetted subcontract network only",
    detail:
      "Where a package goes out, it goes to a vetted subcontractor against controlled criteria, and it stays our responsibility on your contract.",
    proof: "You hold one contract with one accountable party, whoever holds the spanner.",
  },
  {
    id: "compliance",
    title: "Statutory compliance bundled, not bolted on",
    detail:
      "CP12, L8 Legionella monitoring, RPZ testing and G3 servicing run to one annual schedule with one renewal date, so nothing quietly lapses.",
    proof: "One schedule, one renewal date, one set of certificates.",
  },
];

/* -------------------------------------------------------------------------- */

export type ProcessStage = {
  /** Sheet-number style index, in keeping with the drawing-office language. */
  ref: string;
  title: string;
  summary: string;
  /** Bullets are deliberately concrete — specificity is the proof. */
  detail: string[];
};

/** Domestic — a boiler replacement, start to finish. */
export const DOMESTIC_PROCESS: ProcessStage[] = [
  {
    ref: "01",
    title: "Survey",
    summary: "We look at the actual system before anyone quotes a number.",
    detail: [
      "Existing boiler, flue route and gas supply checked on site",
      "Radiator count and cylinder arrangement recorded",
      "Mains pressure and flow rate measured, not assumed",
      "Anything that will make the job harder is found now, not on fitting day",
    ],
  },
  {
    ref: "02",
    title: "Fixed price",
    summary: "One written price covering everything the survey found.",
    detail: [
      "Boiler, parts, labour, flue, controls and making good — all in",
      "System filter and chemical flush stated on the quote, not bolted on later",
      "Warranty length and what registers it written on the same page",
      "The price stands unless you change what you have asked for",
    ],
  },
  {
    ref: "03",
    title: "Install",
    summary: "Gas Safe registered engineers, one job at a time.",
    detail: [
      "Old appliance isolated, drained and removed",
      "System cleansed and inhibited before the new boiler goes on it",
      "Gas soundness and working pressure tested and recorded",
      "Floors covered, waste taken away, kettle used sparingly",
    ],
  },
  {
    ref: "04",
    title: "Handover",
    summary: "Commissioned, documented and registered before we leave.",
    detail: [
      "Boiler commissioned and the benchmark record completed",
      "Controls set up and shown to you, not left in a manual",
      "Warranty registered with the manufacturer by us",
      "Paperwork and certificates emailed the same day",
    ],
  },
];

/** Commercial — how a contract is mobilised. */
export const COMMERCIAL_PROCESS: ProcessStage[] = [
  {
    ref: "01",
    title: "Enquiry & PQQ",
    summary: "ITT in, completed pre-qualification documentation back within 24 hours.",
    detail: [
      "Scope, sites and asset list reviewed against current capacity",
      "Insurance, health-and-safety and competence evidence returned in your format",
      "Clarifications raised in writing before pricing, not after award",
      "One named point of contact from this stage onwards",
    ],
  },
  {
    ref: "02",
    title: "Survey & pricing",
    summary: "Assets surveyed on site so the schedule prices reality.",
    detail: [
      "Plant condition and asset register verified against the tender documents",
      "PPM frequencies mapped to statutory requirement, not to a template",
      "Reactive rates and out-of-hours rates agreed up front",
      "Exclusions stated plainly rather than buried",
    ],
  },
  {
    ref: "03",
    title: "Mobilisation",
    summary: "Paperwork lands before people do.",
    detail: [
      "RAMS issued to your site team ahead of the first visit",
      "Permit and induction requirements confirmed per site",
      "Access, key-holding and escalation route agreed in writing",
      "Planned schedule issued for the full contract year",
    ],
  },
  {
    ref: "04",
    title: "Delivery & reporting",
    summary: "Certificates and asset records, on schedule, without chasing.",
    detail: [
      "Statutory certification issued as each task completes",
      "Remedials quoted separately and never self-instructed",
      "Asset register kept current across the contract term",
      "One annual renewal date so nothing lapses unnoticed",
    ],
  },
];

/* -------------------------------------------------------------------------- */

export type Standard = {
  code: string;
  name: string;
  what: string;
};

/**
 * Published standards the work is carried out to. These describe the
 * standard, not a claim to hold a registration — anything requiring
 * registration renders only from `business.accreditationsHeld`.
 */
export const DOMESTIC_STANDARDS: Standard[] = [
  { code: "CP12", name: "Landlord gas safety record", what: "Annual gas safety check and certificate for let property." },
  { code: "G3", name: "Unvented hot water", what: "Required competence for unvented cylinder work and its annual service." },
  { code: "BS 7593", name: "System water quality", what: "Cleansing, inhibitor dosing and filtration when a boiler is replaced." },
  { code: "Benchmark", name: "Commissioning record", what: "The record most manufacturers require before a warranty is valid." },
];

export const COMMERCIAL_STANDARDS: Standard[] = [
  { code: "L8 / HSG274", name: "Legionella control", what: "Monitoring, temperature records and written scheme for water systems." },
  { code: "RPZ", name: "Backflow prevention", what: "Annual testing of reduced-pressure-zone valves on the incoming main." },
  { code: "CP12", name: "Non-domestic gas safety", what: "Gas safety inspection and certification across commercial plant." },
  { code: "G3", name: "Unvented hot water", what: "Required competence for unvented cylinder work and its annual service." },
];

/* -------------------------------------------------------------------------- */

/**
 * The comparison table. Every left-hand column entry is a commitment made
 * elsewhere on this site; the right-hand column describes common practice in
 * the trade generally and names no competitor.
 */
export const COMPARISON_ROWS: { point: string; us: string; typical: string }[] = [
  { point: "Price after survey", us: "Fixed in writing, does not move", typical: "“From” price, adjusted on the day" },
  { point: "Who does the work", us: "Our Gas Safe registered engineers", typical: "Lead sold on to a subcontractor" },
  { point: "Arrival time", us: "Two-hour window, call before we set off", typical: "“Morning” or “afternoon”" },
  { point: "Callout on quoted work", us: "None", typical: "Charged, sometimes non-refundable" },
  { point: "System cleanse on a new boiler", us: "Stated on the quote", typical: "Priced as an extra afterwards" },
  { point: "Warranty registration", us: "Registered by us, same day", typical: "Left for the customer to do" },
];
