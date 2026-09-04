import type { Metadata } from "next";
import Link from "next/link";
import { TenderEnquiryForm } from "@/components/forms/tender-enquiry-form";
import { COMMERCIAL_PROCESS } from "@/lib/content/promises";
import { business } from "@/lib/content/business";

export const metadata: Metadata = {
  title: "Tenders & PQQ Enquiries",
  description:
    "Submit an ITT, specification or PQQ enquiry to Marmion Building Services. Completed PQQ documentation returned within 24 hours.",
};

/**
 * This was a bare 13-field form, including a file upload, with nothing given
 * before a great deal was asked — the highest-value conversion on the site
 * and the least supported. The form now sits beside the evidence a buyer
 * needs to justify filling it in: what happens next, on what timescale, and
 * what they get back.
 *
 * The claim "most small contractors take a fortnight" has been removed. It
 * was an unsupported swipe at unnamed competitors on a page that carried no
 * evidence of its own, which is exactly the kind of line a procurement lead
 * discounts the whole page for.
 */
const WHAT_YOU_GET = [
  {
    ref: "01",
    title: "Acknowledgement the same working day",
    detail: "A named contact, not a ticket number, and confirmation of the deadline we are working to.",
  },
  {
    ref: "02",
    title: "Completed PQQ documentation within 24 hours",
    detail: "Returned in your format, with insurance and competence evidence attached.",
  },
  {
    ref: "03",
    title: "Clarifications raised in writing before we price",
    detail: "Anything ambiguous in the documents comes back to you before pricing, not after award.",
  },
  {
    ref: "04",
    title: "A priced submission you can compare like for like",
    detail: "Exclusions stated plainly, reactive and out-of-hours rates agreed up front.",
  },
];

export default function TendersPage() {
  return (
    <div style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <section className="grain relative border-b" style={{ borderColor: "var(--border-hairline-dark)" }}>
        <div
          aria-hidden="true"
          className="blueprint-grid pointer-events-none absolute inset-0"
          style={{ opacity: 0.4 }}
        />
        <div
          className="relative z-10 mx-auto grid max-w-[100rem] gap-10 px-6 lg:grid-cols-12"
          style={{ paddingTop: "var(--space-section-tight)", paddingBottom: "var(--space-section-tight)" }}
        >
          <div className="lg:col-span-7">
            <span className="font-mono-label" style={{ color: "var(--copper-bright)" }}>
              Tender &amp; PQQ enquiry
            </span>
            <h1 className="font-display font-display-xl mt-5 text-4xl">Send us the ITT.</h1>
            <p className="mt-6 max-w-[48ch] text-lg" style={{ color: "var(--steel-dim)" }}>
              It goes straight to both directors, flagged by deadline. Completed PQQ documentation
              comes back within 24 hours, with a named point of contact from that moment on.
            </p>
            <p className="mt-5 max-w-[48ch] text-base" style={{ color: "var(--steel-dim)" }}>
              Not ready to send documents yet? The{" "}
              <Link href="/capability" className="link-draw" style={{ color: "var(--paper)" }}>
                capability statement
              </Link>{" "}
              covers services, coverage and insurance schedule, and downloads instantly.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-6 self-end lg:col-span-5">
            <div>
              <dt className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
                PQQ turnaround
              </dt>
              <dd className="font-display mt-1 text-xl">24 hours</dd>
            </div>
            <div>
              <dt className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
                RAMS
              </dt>
              <dd className="font-display mt-1 text-xl">Before every mobilisation</dd>
            </div>
            <div>
              <dt className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
                Based
              </dt>
              <dd className="font-display mt-1 text-xl">{business.base}</dd>
            </div>
            <div>
              <dt className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
                Coverage
              </dt>
              <dd className="font-display mt-1 text-xl">{business.coverage.length} towns</dd>
            </div>
          </dl>
        </div>
      </section>

      <section
        className="mx-auto max-w-[100rem] px-6"
        style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Evidence column — given before the form asks. */}
          <div className="flex flex-col gap-12 lg:col-span-5">
            <div>
              <span className="section-index font-mono-label" data-index="01" style={{ color: "var(--copper-bright)" }}>
                What you get back
              </span>
              <h2 className="font-display mt-4 text-2xl">Four things, in this order.</h2>
              <ol className="mt-8 flex flex-col">
                {WHAT_YOU_GET.map((item) => (
                  <li
                    key={item.ref}
                    className="reveal border-t py-5"
                    style={{ borderColor: "var(--border-hairline-dark)" }}
                  >
                    <div className="flex gap-4">
                      <span className="font-mono-label pt-1" style={{ color: "var(--copper-bright)" }}>
                        {item.ref}
                      </span>
                      <div>
                        <h3 className="font-display text-lg">{item.title}</h3>
                        <p className="mt-1.5 text-sm" style={{ color: "var(--steel-dim)" }}>
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <span className="section-index font-mono-label" data-index="02" style={{ color: "var(--copper-bright)" }}>
                How a contract runs
              </span>
              <h2 className="font-display mt-4 text-2xl">From enquiry to certification.</h2>
              <ol className="mt-8 grid gap-px" style={{ background: "var(--border-hairline-dark)" }}>
                {COMMERCIAL_PROCESS.map((stage) => (
                  <li key={stage.ref} className="p-5" style={{ background: "var(--ink)" }}>
                    <span className="font-mono-label" style={{ color: "var(--copper-bright)" }}>
                      {stage.ref}
                    </span>
                    <h3 className="font-display mt-2 text-lg">{stage.title}</h3>
                    <p className="mt-1.5 text-sm" style={{ color: "var(--steel-dim)" }}>
                      {stage.summary}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div
              className="border p-6 md:p-8"
              style={{
                borderColor: "var(--border-hairline-dark)",
                borderRadius: "var(--radius)",
                background: "var(--slate-deep)",
              }}
            >
              <h2 className="font-display text-2xl">Send the documents</h2>
              <p className="mt-2 max-w-[52ch] text-sm" style={{ color: "var(--steel-dim)" }}>
                Attach the ITT, specification or asset schedule. Anything you cannot attach here, we
                will arrange to receive once we have acknowledged the enquiry.
              </p>
              <div className="mt-8">
                <TenderEnquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
