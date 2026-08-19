"use client";

import { useDivision } from "@/components/division/division-provider";
import { business } from "@/lib/content/business";

const plOrConfirm = (v: string | null) => v ?? "confirmed on request";

function buildFaq(division: "commercial" | "domestic") {
  if (division === "commercial") {
    return [
      {
        q: "What insurance do you carry?",
        a: `Public liability of ${plOrConfirm(business.publicLiability)} and employers' liability of ${plOrConfirm(business.employersLiability)}. Certificates are available on request.`,
      },
      {
        q: "What's your typical mobilisation time?",
        a: "Mobilisation timescale is agreed per contract at PQQ stage and confirmed in writing before works commence.",
      },
      {
        q: "Do you subcontract work?",
        a: "Where we do, it's through a vetted subcontract network with controlled vetting criteria — see /team for how that's managed.",
      },
      {
        q: "What's your out-of-hours cover?",
        a: plOrConfirm(business.outOfHoursCover),
      },
      {
        q: "How quickly do you turn around a PQQ?",
        a: "Send us the ITT. We return completed PQQ documentation within 24 hours.",
      },
    ];
  }
  return [
    {
      q: "Will the price change once you're on site?",
      a: "No. We quote before we start and the price doesn't move, unless you ask us to change the scope.",
    },
    {
      q: "Is there a callout fee?",
      a: "Not on quoted work.",
      },
    {
      q: "How quickly can someone come out?",
      a: `Two-hour arrival windows, and we ring when we leave the last job. Response SLA: ${plOrConfirm(business.responseSla)}.`,
    },
    {
      q: "Are your engineers subcontracted?",
      a: "No — Gas Safe registered engineers, not subcontracted.",
    },
    {
      q: "What's your Gas Safe registration number?",
      a: plOrConfirm(business.gasSafeNumber),
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
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section
      className="mx-auto max-w-4xl px-6"
      style={{ paddingBottom: "var(--space-section-mobile)" }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <span className="font-mono-label" style={{ color: "var(--copper)" }}>
        Questions
      </span>
      <dl className="mt-6 flex flex-col">
        {items.map((item) => (
          <div key={item.q} className="hairline py-5" style={{ borderColor: "var(--border-hairline)" }}>
            <dt className="font-display text-lg" style={{ color: "var(--ink)" }}>
              {item.q}
            </dt>
            <dd className="mt-2 text-sm" style={{ color: "var(--steel)" }}>
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
