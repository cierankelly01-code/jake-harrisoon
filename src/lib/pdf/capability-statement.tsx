import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { business } from "@/lib/content/business";

/**
 * Branded capability-statement PDF, structured on the Docket layout
 * (mono metadata under mono labels, copper hairlines). Uses the built-in
 * Helvetica family for now — @react-pdf/renderer needs TTF files
 * registered via Font.register() to use Archivo/Instrument Sans/Martian
 * Mono, and those aren't available as static files until real brand
 * assets are exported. See HANDOFF.md "PDF fonts" for the follow-up.
 */

const INK = "#0B0E14";
const FLAME = "#1F5FE0";
const COPPER = "#A6613C";
const STEEL = "#6B7684";
const PAPER = "#F7F6F3";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", color: INK, backgroundColor: PAPER },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  wordmark: { fontFamily: "Helvetica-Bold", fontSize: 20, letterSpacing: 1 },
  subWordmark: { fontSize: 8, letterSpacing: 2, color: COPPER, marginTop: 2 },
  docType: { fontSize: 9, letterSpacing: 2, color: STEEL, textAlign: "right" },
  h1: { fontFamily: "Helvetica-Bold", fontSize: 22, marginBottom: 4 },
  rule: { borderBottomWidth: 1, borderBottomColor: COPPER, marginVertical: 10 },
  sectionLabel: { fontSize: 9, letterSpacing: 2, color: STEEL, marginBottom: 6, marginTop: 16 },
  body: { fontSize: 10, lineHeight: 1.5 },
  statRow: { flexDirection: "row", marginTop: 8, gap: 16 },
  statBlock: { flexGrow: 1 },
  statLabel: { fontSize: 7, letterSpacing: 1.5, color: STEEL },
  statValue: { fontFamily: "Helvetica-Bold", fontSize: 12, marginTop: 2, color: FLAME },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, fontSize: 8, color: STEEL },
});

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBlock}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export function CapabilityStatementDocument() {
  const ph = (v: string | null) => v ?? "PLACEHOLDER — CONFIRM BEFORE ISSUING";
  return (
    <Document title="Marmion Building Services — Capability Statement">
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.wordmark}>MARMION</Text>
            <Text style={styles.subWordmark}>BUILDING SERVICES</Text>
          </View>
          <Text style={styles.docType}>CAPABILITY STATEMENT</Text>
        </View>

        <Text style={styles.h1}>Mechanical, electrical and plumbing contracting</Text>
        <Text style={styles.body}>
          {business.legalEntity} — Commercial and Domestic divisions, based in {business.base}.
          Directed by {business.directors.map((d) => d.firstName).join(" and ")}, both Gas Safe
          registered engineers, {business.ownership}.
        </Text>

        <View style={styles.rule} />

        <Text style={styles.sectionLabel}>KEY FACTS</Text>
        <View style={styles.statRow}>
          <Stat label="RESPONSE SLA" value={ph(business.responseSla)} />
          <Stat label="PUBLIC LIABILITY" value={ph(business.publicLiability)} />
          <Stat label="EMPLOYERS LIABILITY" value={ph(business.employersLiability)} />
        </View>
        <View style={styles.statRow}>
          <Stat label="GAS SAFE NO." value={ph(business.gasSafeNumber)} />
          <Stat label="OUT-OF-HOURS COVER" value={ph(business.outOfHoursCover)} />
          <Stat label="COVERAGE" value={`${business.coverage.length} areas, West Midlands`} />
        </View>

        <Text style={styles.sectionLabel}>SERVICES</Text>
        <Text style={styles.body}>
          PPM and reactive maintenance contracts · mechanical installation and plant room work ·
          commercial boiler installation and servicing · Legionella / L8 monitoring · gas safety
          (CP12) · backflow / RPZ testing · washroom and kitchen plumbing fit-outs · void property
          works · Section 20 planned works · statutory compliance packages.
        </Text>

        <Text style={styles.sectionLabel}>ACCREDITATIONS</Text>
        <Text style={styles.body}>
          {business.accreditationsHeld.length > 0
            ? business.accreditationsHeld.join(", ")
            : "Accreditation roadmap in progress — see ACCREDITATION_ROADMAP.md. Confirmed accreditation numbers will replace this line before any statement is issued externally."}
        </Text>

        <Text style={styles.sectionLabel}>CONTACT</Text>
        <Text style={styles.body}>
          Tenders: {ph(business.emailTenders)} · General: {ph(business.emailGeneral)} · Tel:{" "}
          {ph(business.phoneMain)}
        </Text>

        <Text style={styles.footer}>
          {business.legalEntity} · Company No. {ph(business.companyNumber)} · VAT No.{" "}
          {ph(business.vatNumber)} · This document contains placeholder facts and must not be
          issued to a live tender until every PLACEHOLDER field above is replaced with a
          confirmed, evidenceable value.
        </Text>
      </Page>
    </Document>
  );
}
