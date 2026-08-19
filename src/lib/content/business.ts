/**
 * Every fact here is either a value the brief confirmed, or `null`.
 * `null` means "do not invent this" — it must render through <Placeholder>,
 * never as prose. See CONTENT_NEEDED.md for the collection list and §17 of
 * the master brief for why this file is written this way.
 */

export const business = {
  tradingName: "Marmion",
  legalEntity: "Marmion Building Services Ltd",
  divisions: {
    commercial: "Marmion Commercial",
    domestic: "Marmion Domestic",
  },
  directors: [
    { firstName: "Jake", surname: null as string | null, qualification: "Gas Safe registered engineer" },
    { firstName: "Harrison", surname: null as string | null, qualification: "Gas Safe registered engineer" },
  ],
  ownership: "50/50",
  base: "Tamworth, Staffordshire",
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
