import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { QuoteTier } from "@/lib/quote/pricing";
import { business } from "@/lib/content/business";

const INK = "#0B0F0D";
const FLAME = "#0B5C33";
const COPPER = "#0A6B3A";
const STEEL = "#55605A";
const PAPER = "#F4F7F4";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", color: INK, backgroundColor: PAPER },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  wordmark: { fontFamily: "Helvetica-Bold", fontSize: 20, letterSpacing: 1 },
  subWordmark: { fontSize: 8, letterSpacing: 2, color: COPPER, marginTop: 2 },
  docType: { fontSize: 9, letterSpacing: 2, color: STEEL, textAlign: "right" },
  h1: { fontFamily: "Helvetica-Bold", fontSize: 20, marginBottom: 10 },
  rule: { borderBottomWidth: 1, borderBottomColor: COPPER, marginVertical: 10 },
  tierBlock: { borderWidth: 1, borderColor: COPPER, padding: 12, marginBottom: 10 },
  tierLabel: { fontSize: 8, letterSpacing: 2, color: STEEL },
  tierName: { fontFamily: "Helvetica-Bold", fontSize: 13, marginTop: 4 },
  tierPrice: { fontFamily: "Helvetica-Bold", fontSize: 16, color: FLAME, marginTop: 6 },
  tierMeta: { fontSize: 9, color: STEEL, marginTop: 4 },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, fontSize: 8, color: STEEL },
});

export function BoilerQuoteDocument({
  tiers,
  customerName,
  quoteRef,
}: {
  tiers: QuoteTier[];
  customerName: string;
  quoteRef: string;
}) {
  return (
    <Document title={`Hartson Boiler Quote — ${quoteRef}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.wordmark}>HARTSON</Text>
            <Text style={styles.subWordmark}>HEATING</Text>
          </View>
          <Text style={styles.docType}>BOILER QUOTE · {quoteRef}</Text>
        </View>

        <Text style={styles.h1}>Prepared for {customerName}</Text>
        <Text style={{ fontSize: 10, color: STEEL, marginBottom: 6 }}>
          Three price bands based on the answers given. This is an indicative range — a
          confirmed price is issued after a free survey, and never moves once agreed.
        </Text>

        <View style={styles.rule} />

        {tiers.map((t) => (
          <View key={t.tier} style={styles.tierBlock}>
            <Text style={styles.tierLabel}>{t.label}</Text>
            <Text style={styles.tierName}>{t.boiler}</Text>
            <Text style={styles.tierPrice}>
              £{t.priceLow.toLocaleString()} – £{t.priceHigh.toLocaleString()} fitted
            </Text>
            <Text style={styles.tierMeta}>
              {t.warrantyYears} year warranty · From £{t.monthlyOver60}/month over 60 months
            </Text>
          </View>
        ))}

        <Text style={styles.footer}>
          {/* Trading name, never a registered one. `business.legalEntity` is
              deliberately null; "Hartson Heating Ltd" was hardcoded here by
              the rename and is a company nobody has confirmed exists. This
              is a priced quotation, so that is a misrepresentation. */}
          {business.tradingName}. Indicative pricing only, generated{" "}
          {new Date().toLocaleDateString("en-GB")}.
          Subject to a free survey before any work begins.
        </Text>
      </Page>
    </Document>
  );
}
