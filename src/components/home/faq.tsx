"use client";

import { useDivision } from "@/components/division/division-provider";
import { business } from "@/lib/content/business";
import { PlaceholderMarker } from "@/components/ui/placeholder";
import { track } from "@/lib/analytics";

/**
 * An unconfirmed fact must render as a placeholder chip, never as prose —
 * `business.ts` says so at the top of the file. Substituting the words
 * "confirmed on request" produced sentences like "Public liability of
 * confirmed on request and employers' liability of confirmed on request", and
 * made the entire answer to "What's your Gas Safe registration number?" the
 * phrase "confirmed on request". In a procurement context that reads as an
 * insurance claim rather than a gap.
 *
 * Answers are therefore built as nodes, not strings, so a missing value can
 * render the amber chip inline. The JSON-LD copy still needs plain text, so
 * each entry carries a separate `plain` form for the structured data.
 */
type FaqItem = { q: string; a: React.ReactNode; plain: string };

const CHIP_TEXT = "to be confirmed";

/**
 * PLUGIN — FAQ accordion, built on <details>/<summary> so it keeps working
 * (and stays keyboard operable and screen-reader correct) with JavaScript
 * off. Height animates via the grid-template-rows trick rather than a
 * measured max-height.
 *
 * Question order is deliberate: the anxiety questions come first. For a
 * homeowner that is "will the price change"; for a buyer it is insurance and
 * turnaround. Nobody's first question is about company history.
 */
function buildFaq(division: "commercial" | "domestic"): FaqItem[] {
  // Prose, not a warning triangle. An FAQ answer is a sentence a person
  // reads; dropping an amber chip into the middle of one broke the sentence
  // and advertised the gap. The gap stays tracked via PlaceholderMarker.
  const chip = (value: string | null, label: string) =>
    value ?? (
      <>
        {CHIP_TEXT}
        <PlaceholderMarker label={label} />
      </>
    );
  const plain = (value: string | null) => value ?? CHIP_TEXT;

  if (division === "commercial") {
    return [
      {
        q: "How quickly do you turn around a PQQ?",
        a: "Send us the ITT and completed PQQ documentation comes back within 24 hours. If anything in it needs clarifying, we raise it in writing before pricing rather than after award.",
        plain:
          "Send us the ITT and completed PQQ documentation comes back within 24 hours. If anything in it needs clarifying, we raise it in writing before pricing rather than after award.",
      },
      {
        q: "What insurance do you carry?",
        a: (
          <>
            Public liability {chip(business.publicLiability, "PUBLIC LIABILITY")} and employers&rsquo;
            liability {chip(business.employersLiability, "EMPLOYERS LIABILITY")}. Certificates are
            issued with the PQQ pack and are available on request at any time.
          </>
        ),
        plain: `Public liability ${plain(business.publicLiability)} and employers' liability ${plain(business.employersLiability)}. Certificates are issued with the PQQ pack and are available on request at any time.`,
      },
      {
        q: "Do you subcontract work?",
        a: "Where a package goes out, it goes to a vetted subcontractor against controlled criteria, and it stays our responsibility on your contract. You hold one contract with one accountable party.",
        plain:
          "Where a package goes out, it goes to a vetted subcontractor against controlled criteria, and it stays our responsibility on your contract. You hold one contract with one accountable party.",
      },
      {
        q: "What's your typical mobilisation time?",
        a: "Agreed per contract at PQQ stage and confirmed in writing before works commence. RAMS are issued to your site team ahead of the first visit, every mobilisation rather than only the first.",
        plain:
          "Agreed per contract at PQQ stage and confirmed in writing before works commence. RAMS are issued to your site team ahead of the first visit, every mobilisation rather than only the first.",
      },
      {
        q: "What's your out-of-hours cover?",
        a: (
          <>
            Out-of-hours cover {chip(business.outOfHoursCover, "OUT OF HOURS COVER")}. It is confirmed
            in writing per contract at PQQ stage, alongside the reactive and out-of-hours rates.
          </>
        ),
        plain: `Out-of-hours cover ${plain(business.outOfHoursCover)}. It is confirmed in writing per contract at PQQ stage, alongside the reactive and out-of-hours rates.`,
      },
      {
        q: "Which statutory work can you bundle into one contract?",
        a: "CP12 gas safety inspection, L8 Legionella monitoring, RPZ backflow testing and G3 unvented servicing run to one annual schedule with a single renewal date, so nothing quietly lapses between suppliers.",
        plain:
          "CP12 gas safety inspection, L8 Legionella monitoring, RPZ backflow testing and G3 unvented servicing run to one annual schedule with a single renewal date, so nothing quietly lapses between suppliers.",
      },
    ];
  }
  return [
    {
      q: "Will the price change once you're on site?",
      a: "No. You get a fixed written price before an engineer starts and it does not move — not for parts, not for time, not for what we find behind the old boiler. The only thing that changes it is you changing the scope, in writing.",
      plain:
        "No. You get a fixed written price before an engineer starts and it does not move — not for parts, not for time, not for what we find behind the old boiler. The only thing that changes it is you changing the scope, in writing.",
    },
    {
      q: "Is there a callout fee?",
      a: "Not on quoted work. Coming out to price the job costs you nothing, and there is no assessment fee and no charge for the quote itself.",
      plain:
        "Not on quoted work. Coming out to price the job costs you nothing, and there is no assessment fee and no charge for the quote itself.",
    },
    {
      q: "How quickly can someone come out?",
      a: (
        <>
          Two-hour arrival windows, and we ring when we leave the job before yours so you are not
          sat waiting on a guess. Our published response SLA is{" "}
          {chip(business.responseSla, "RESPONSE SLA")}.
        </>
      ),
      plain: `Two-hour arrival windows, and we ring when we leave the job before yours so you are not sat waiting on a guess. Our published response SLA is ${plain(business.responseSla)}.`,
    },
    {
      q: "Are your engineers subcontracted?",
      a: "No. The Gas Safe registered engineer who quotes your job is the one who turns up to do it. Both directors are registered engineers and both are still on the tools.",
      plain:
        "No. The Gas Safe registered engineer who quotes your job is the one who turns up to do it. Both directors are registered engineers and both are still on the tools.",
    },
    {
      q: "What's included when you fit a boiler?",
      a: "Boiler, parts, labour, flue, controls and making good, plus the system cleanse and inhibitor, all stated on the quote rather than added afterwards. We commission it, complete the benchmark record and register the manufacturer warranty for you the same day.",
      plain:
        "Boiler, parts, labour, flue, controls and making good, plus the system cleanse and inhibitor, all stated on the quote rather than added afterwards. We commission it, complete the benchmark record and register the manufacturer warranty for you the same day.",
    },
    {
      q: "What's your Gas Safe registration number?",
      a: (
        <>
          Our registration number is {chip(business.gasSafeNumber, "GAS SAFE NUMBER")}. Every Gas
          Safe engineer carries an ID card with their own licence number on it — ask to see it at
          the door, and check it at gassaferegister.co.uk. You should do that with any engineer,
          not just us.
        </>
      ),
      plain: `Our registration number is ${plain(business.gasSafeNumber)}. Every Gas Safe engineer carries an ID card with their own licence number on it — ask to see it at the door, and check it at gassaferegister.co.uk. You should do that with any engineer, not just us.`,
    },
  ];
}

export function Faq() {
  const { division } = useDivision();
  const items = buildFaq(division);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      // `plain`, not `a` — the visible answer is a React node so a chip can
      // render inline, and JSON-LD needs text.
      acceptedAnswer: { "@type": "Answer", text: item.plain },
    })),
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="mx-auto max-w-[100rem] px-6"
      style={{ paddingTop: "var(--space-section-dense)", paddingBottom: "var(--space-section-dense)" }}
    >
      {/* `<` is escaped so a stray angle bracket in an answer can never close
          the script tag early — same guard the LocalBusiness schema applies. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="grid gap-6 sm:gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <span className="section-index font-mono-label" data-index="08" style={{ color: "var(--copper-ink)" }}>
            Questions
          </span>
          <h2 id="faq-heading" className="font-display mt-4 text-3xl" style={{ color: "var(--ink)" }}>
            {division === "commercial"
              ? "What buyers ask before they shortlist us."
              : "What people ask before they book us."}
          </h2>
          <p className="mt-5 max-w-[38ch] text-sm" style={{ color: "var(--steel)" }}>
            Anything not answered here gets a straight answer on the phone. We would rather tell you
            something you do not want to hear now than on the day.
          </p>
        </div>

        {/* Not a <dl>: a <details> is not valid inside one, and wrapping a
            <dt> in a <summary> means neither the list nor the term semantics
            reach assistive tech. The disclosure semantics that <details> gives
            for free are worth more here than a definition list that browsers
            were not actually conveying. */}
        <div className="lg:col-span-8">
          {items.map((item) => (
            <details
              key={item.q}
              name="marmion-faq"
              className="group border-b"
              style={{ borderColor: "var(--border-hairline)" }}
              onToggle={(event) => {
                if ((event.currentTarget as HTMLDetailsElement).open) {
                  track("faq_open", { question: item.q });
                }
              }}
            >
              <summary className="flex items-start justify-between gap-6 py-5">
                <h3 className="font-display text-xl leading-snug" style={{ color: "var(--ink)" }}>
                  {item.q}
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-1.5 shrink-0 transition-transform group-open:rotate-45"
                  style={{ color: "var(--copper-ink)", transitionDuration: "var(--duration-transition)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              </summary>
              <div className="accordion-panel">
                <div>
                  <p className="max-w-[62ch] pb-6 pr-10 text-base" style={{ color: "var(--steel)" }}>
                    {item.a}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
