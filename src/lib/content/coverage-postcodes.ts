/**
 * Postcode-area coverage check for the boiler quote wizard. This replaces
 * a broken comparison that matched postcode characters against town
 * *names* (which can never match — town names and postcode letters are
 * unrelated strings).
 *
 * This is deliberately coarse: it checks the postcode AREA (the letters
 * before the first digit, e.g. "B" from "B77 5EF") against the areas the
 * brief's coverage towns actually sit in, not a precise per-district
 * boundary. It's a soft "let the visitor know early" nudge, not a hard
 * gate — the wizard always lets them continue regardless, and a director
 * confirms properly on the follow-up call. Tamworth/Lichfield/Sutton
 * Coldfield/Birmingham/Solihull/Coleshill/Polesworth/Kingsbury are all in
 * the B or WS postcode areas; Coventry/Nuneaton/Atherstone in CV;
 * Cannock/Walsall/Burntwood in WS; Burton upon Trent in DE.
 */
const COVERED_POSTCODE_AREAS = ["B", "WS", "CV", "DE"];

export function isPostcodeLikelyInCoverage(rawPostcode: string): boolean {
  const match = rawPostcode.trim().toUpperCase().match(/^([A-Z]{1,2})\d/);
  if (!match) return true; // can't parse yet (still typing) — don't warn prematurely
  return COVERED_POSTCODE_AREAS.includes(match[1]);
}
