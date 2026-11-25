/**
 * Every fact here is either a value the brief confirmed, or `null`.
 * `null` means "do not invent this" — it must render through <Placeholder>,
 * never as prose. See CONTENT_NEEDED.md for the collection list and §17 of
 * the master brief for why this file is written this way.
 */

export const business = {
  /** Trading name as it appears on the vans Jake sent (27 Oct): "HARTSON
   *  HEATING", with the strapline "Warmer homes. Better living." Spelling
   *  taken from the artwork, not from dictation — confirm before launch. */
  tradingName: "Hartson Heating",
  strapline: "Warmer homes. Better living.",
  /** The registered company name is NOT the trading name until Companies
   *  House says so. Was auto-filled as "Hartson Heating Ltd" during the
   *  rename from Marmion; that was an invention and has been reverted to
   *  null. Legal pages name the data controller, so a guess here is a
   *  misrepresentation, not a typo. */
  legalEntity: null as string | null,
  divisions: {
    commercial: "Hartson Commercial",
    domestic: "Hartson Domestic",
  },
  directors: [
    { firstName: "Jake", surname: null as string | null, qualification: "Gas Safe registered engineer" },
    { firstName: "Harrison", surname: null as string | null, qualification: "Gas Safe registered engineer" },
  ],
  ownership: "50/50",
  base: "Tamworth, Staffordshire",
  /**
   * The towns the two-hour arrival window is actually promised in. The
   * homepage used to claim "we keep the area small so a two-hour arrival
   * window is something we can actually keep" directly above a list
   * containing Birmingham, Solihull and Coventry — Coventry is roughly 30
   * miles from Tamworth, and a local reading that stops believing the
   * window. These are the ones inside it; everything else in `coverage`
   * is still served, just not on that promise.
   *
   * Drive times have not been checked against a routing API — this split
   * is by distance from Tamworth and needs the directors' sign-off.
   */
  coverageCore: [
    "Tamworth",
    "Lichfield",
    "Polesworth",
    "Kingsbury",
    "Atherstone",
    "Coleshill",
    "Burntwood",
  ],
  coverage: [
    "Tamworth",
    "Lichfield",
    "Sutton Coldfield",
    "Birmingham",
    "Solihull",
    "Coventry",
    "Atherstone",
    "Nuneaton",
    "Coleshill",
    "Cannock",
    "Walsall",
    "Burton",
    "Polesworth",
    "Kingsbury",
    "Burntwood",
  ],

  // Legal / registration facts — never invent, see §17
  gasSafeNumber: null as string | null,
  companyNumber: null as string | null,
  vatNumber: null as string | null,
  utrCisStatus: null as string | null,
  registeredOffice: null as string | null,

  // Contact
  phoneMain: null as string | null,
  phoneOutOfHours: null as string | null,
  emailGeneral: null as string | null,
  emailTenders: null as string | null,

  // Trading history
  established: null as string | null,

  // Insurance
  publicLiability: null as string | null,
  employersLiability: null as string | null,
  professionalIndemnity: null as string | null,
  contractWorksInsurance: null as string | null,

  // Capacity — apparatus, not headcount inflation. See master brief §1.
  engineerCount: null as string | null,
  vehicleCount: null as string | null,

  // Accreditations
  accreditationsHeld: [] as string[],
  accreditationsPending: [] as string[],
  manufacturerAccreditations: [] as string[],

  // Service commitments
  outOfHoursCover: null as string | null,
  responseSla: null as string | null,
} as const;

export type Business = typeof business;
