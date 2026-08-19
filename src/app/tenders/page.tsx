import type { Metadata } from "next";
import { TenderEnquiryForm } from "@/components/forms/tender-enquiry-form";

export const metadata: Metadata = {
  title: "Tenders & PQQ Enquiries",
  description:
    "Submit an ITT, specification or PQQ enquiry to Marmion Building Services. We return completed PQQ documentation within 24 hours.",
};

export default function TendersPage() {
  return (
    <div style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <section
        className="mx-auto max-w-3xl px-6"
        style={{ paddingTop: "var(--space-section-mobile)", paddingBottom: "var(--space-section-mobile)" }}
      >
        <span className="font-mono-label" style={{ color: "var(--copper)" }}>
          Tender &amp; PQQ enquiry
        </span>
        <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl">
          Send us the ITT.
        </h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "var(--steel-dim)" }}>
          This goes straight to both directors, flagged by deadline. We return completed PQQ
          documentation within 24 hours — most small contractors take a fortnight.
        </p>

        <div className="mt-10">
          <TenderEnquiryForm />
        </div>
      </section>
    </div>
  );
}
