import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/lib/content/business";
import { Placeholder } from "@/components/ui/placeholder";
import { LegalShell, LegalSection, LegalList, Term } from "@/components/legal/legal-shell";
import { COMMERCIAL_ENABLED } from "@/lib/division-shared";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms on which Hartson Heating provides this website, including how instant boiler quotes, published prices, care plans and tender enquiries work.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "3 September 2026";

const CONTENTS = [
  { id: "who", label: "Who these terms are from" },
  { id: "what-this-site-is", label: "What this website is, and is not" },
  { id: "instant-quote", label: "The instant boiler quote" },
  { id: "published-prices", label: "Published prices" },
  { id: "care-plans", label: "Care plans and payments" },
  { id: "tenders", label: "Tender and PQQ enquiries" },
  { id: "your-side", label: "Your side of the bargain" },
  { id: "ip", label: "Content and intellectual property" },
  { id: "liability", label: "Liability" },
  { id: "consumers", label: "If you are a consumer" },
  { id: "complaints", label: "Complaints" },
  { id: "law", label: "Governing law and changes" },
];

export default function TermsPage() {
  return (
    <LegalShell
      eyebrow="Terms of use"
      title="The rules this site runs on."
      intro="Short, and in English. These terms cover the website itself — the contract for any actual work is agreed separately, in writing, before we start."
      lastUpdated={LAST_UPDATED}
      contents={CONTENTS}
    >
      {/* 01 */}
      <LegalSection id="who" index={1} title="Who these terms are from">
        <p>
          This website is operated by{" "}
          <Term>{business.legalEntity ?? business.tradingName}</Term>
          {!business.legalEntity && <Placeholder label="REGISTERED COMPANY NAME" compact />}, based
          in {business.base}. In these terms, &ldquo;we&rdquo;,
          &ldquo;us&rdquo; and &ldquo;our&rdquo; mean that company, and &ldquo;you&rdquo; means
          anyone using the site.
        </p>
        <dl className="mt-2 grid gap-3">
          {[
            { label: "Registered office", node: <Placeholder label="REGISTERED OFFICE" /> },
            { label: "Company number", node: <Placeholder label="COMPANY NUMBER" /> },
            { label: "VAT number", node: <Placeholder label="VAT NUMBER" /> },
            { label: "Contact", node: <Placeholder label="GENERAL EMAIL" /> },
          ].map(({ label, node }) => (
            <div
              key={label}
              className="flex flex-col gap-2 border-b pb-3 sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              <dt className="font-mono-label" style={{ color: "var(--steel)" }}>
                {label}
              </dt>
              <dd>{node}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm">
          Using this site means you accept these terms. If you do not accept them, please do not
          use the site.
        </p>
      </LegalSection>

      {/* 02 */}
      <LegalSection id="what-this-site-is" index={2} title="What this website is, and is not">
        <p>
          This site describes what we do and lets you start an enquiry. Nothing on it is a
          contractual offer, and nothing on it is professional advice about your particular
          building, boiler or installation. Gas, electrical and heating work is safety-critical
          and site-specific; a web page cannot assess your property.
        </p>
        <p>
          We work hard to keep the information here accurate and current, but we do not guarantee
          that every page is free of error or omission, or that the site will always be available.
          Where a fact is still being confirmed it is marked on the page rather than guessed at —
          if you see an amber marker, that detail genuinely is outstanding.
        </p>
      </LegalSection>

      {/* 03 */}
      <LegalSection id="instant-quote" index={3} title="The instant boiler quote">
        <p>
          The{" "}
          <Link href="/boiler-quote" className="link-draw" style={{ color: "var(--copper-ink)" }}>
            instant boiler quote
          </Link>{" "}
          calculates a price from the answers you give. It is designed to be realistic rather than
          optimistic, and it is the number we work from — but it is an{" "}
          <Term>estimate based on your description</Term>, not a fixed contract price.
        </p>
        <LegalList
          items={[
            <>
              The price assumes your answers are accurate. If the property, system or access turn
              out to be materially different, the price changes.
            </>,
            <>
              It becomes a firm price once we have confirmed the job — by survey, photographs or a
              conversation — and confirmed that in writing to you.
            </>,
            <>
              If something we find on site changes the price, you hear about it{" "}
              <Term>before we start</Term>, not on the invoice afterwards.
            </>,
            <>
              A quote is valid for the period stated on it. After that, prices of materials move
              and we would need to re-quote.
            </>,
            <>
              As explained in our{" "}
              <Link href="/privacy" className="link-draw" style={{ color: "var(--copper-ink)" }}>
                privacy notice
              </Link>
              , the wizard saves your answers step by step, so a phone number entered part-way
              through is stored even if you do not finish.
            </>,
          ]}
        />
      </LegalSection>

      {/* 04 */}
      <LegalSection id="published-prices" index={4} title="Published prices">
        <p>
          The prices on our{" "}
          <Link href="/prices" className="link-draw" style={{ color: "var(--copper-ink)" }}>
            prices page
          </Link>{" "}
          are for straightforward jobs of the kind described, during normal working hours, within
          our coverage area. They are published so you are not left guessing — but a job stops
          being straightforward the moment it involves something the description does not cover.
          If yours is not straightforward, we will tell you before we start, not after.
        </p>
        <p className="text-sm">
          Prices may be updated from time to time. The price that applies is the one we confirm to
          you in writing for your job.
        </p>
      </LegalSection>

      {/* 05 */}
      <LegalSection id="care-plans" index={5} title="Care plans and payments">
        <p>
          Care plans are monthly subscriptions. Payment is taken by <Term>Stripe</Term> on
          Stripe&apos;s own secure checkout — we never see or hold your card details. Signing up
          starts a recurring payment which continues until it is cancelled.
        </p>
        <LegalList
          items={[
            <>
              What each plan includes is set out on the{" "}
              <Link href="/care-plans" className="link-draw" style={{ color: "var(--copper-ink)" }}>
                care plans page
              </Link>
              . Anything outside that scope is chargeable at our normal rates, quoted first.
            </>,
            <>
              Plans cover the property and appliance registered to them. They are not transferable
              to a different property without telling us.
            </>,
            <>
              A plan does not replace the manufacturer&apos;s warranty on a boiler, and it does not
              cover a system that was already failing when the plan started.
            </>,
            <>
              <Term>There is no minimum term and no exit fee.</Term> You can cancel at any time
              with one month&apos;s notice, and there is no excess to pay on a claim.
            </>,
            <>
              <Term>Cover starts 14 days after your first payment.</Term> That waiting period
              exists so a plan cannot be taken out on an appliance that has already failed, which
              is what keeps the price where it is for everyone else. Servicing is unaffected and
              can be booked straight away.
            </>,
            <>
              A pre-existing fault, an appliance over 15 years old or beyond economic repair, and
              damage rather than wear are all outside cover. These are set out in full, in plain
              words, on the{" "}
              <Link href="/care-plans" className="link-draw" style={{ color: "var(--copper-ink)" }}>
                care plans page
              </Link>{" "}
              — not buried here.
            </>,
            <>
              We give <Term>30 days&apos; written notice</Term> before any price change, and you
              can cancel within that period without notice or charge.
            </>,
          ]}
        />
      </LegalSection>

      {/* 06 */}
      <LegalSection id="tenders" index={6} title="Tender and PQQ enquiries">
        <p>
          {/* /tenders redirects to `/` while the commercial division is
              switched off (division-shared.ts) — a live link here would
              bounce a reader straight to the homepage mid-clause. The
              clause itself stays: it's a real legal process even while the
              nav to reach it is off. */}
          Submitting an ITT, specification or PQQ through the{" "}
          {COMMERCIAL_ENABLED ? (
            <Link href="/tenders" className="link-draw" style={{ color: "var(--copper-ink)" }}>
              tender form
            </Link>
          ) : (
            "tender form"
          )}{" "}
          places no obligation on either side. We may decline to tender, and you are under no
          obligation to appoint us.
        </p>
        <p>
          Documents you send us are treated as confidential and used only to price and respond to
          your enquiry. We do not circulate them, and we do not share them with other contractors.
          If your organisation requires a signed non-disclosure agreement before documents are
          exchanged, say so and we will sign one first.
        </p>
      </LegalSection>

      {/* 07 */}
      <LegalSection id="your-side" index={7} title="Your side of the bargain">
        <LegalList
          items={[
            <>
              Give us accurate information. A quote built on a wrong answer is a wrong quote, and
              on gas work an inaccurate description can be a safety issue.
            </>,
            <>
              Only upload files you have the right to share, and do not upload anything malicious.
            </>,
            <>
              Do not attempt to interfere with the site, its forms or its infrastructure, or use it
              to send automated or bulk submissions.
            </>,
            <>
              Do not use this site or its content to scrape contact details or build marketing
              lists.
            </>,
          ]}
        />
      </LegalSection>

      {/* 08 */}
      <LegalSection id="ip" index={8} title="Content and intellectual property">
        <p>
          The text, design, drawings, code and images on this site belong to us or our licensors.
          You are welcome to read it, print it, and quote it with attribution — that is what it is
          for. You may not republish it wholesale as your own, or use our name or marks in a way
          that suggests an association that does not exist.
        </p>
      </LegalSection>

      {/* 09 */}
      <LegalSection id="liability" index={9} title="Liability">
        <p>
          Nothing in these terms limits or excludes our liability for death or personal injury
          caused by our negligence, for fraud or fraudulent misrepresentation, or for anything else
          that cannot lawfully be limited — and none of it affects your statutory rights as a
          consumer.
        </p>
        <p>
          Subject to that: this website is provided as it is. We are not liable for loss arising
          from reliance on general information published here, as opposed to a written quotation or
          specification issued to you for your job. Where you are a business, we exclude liability
          for indirect or consequential loss, loss of profit, and loss of business opportunity
          arising from use of the site.
        </p>
        <p className="text-sm">
          Liability for work we actually carry out is governed by the contract for that work and by
          our insurance, not by this page.
        </p>
      </LegalSection>

      {/* 10 */}
      <LegalSection id="consumers" index={10} title="If you are a consumer">
        <p>
          Where you engage us as a consumer rather than a business, you have rights under the
          Consumer Rights Act 2015 — including that our work will be carried out with reasonable
          care and skill — and these terms do not reduce them.
        </p>
        <p>
          Where a contract is agreed away from our premises or at a distance, the Consumer
          Contracts (Information, Cancellation and Additional Charges) Regulations 2013 normally
          give you <Term>14 days to cancel</Term>. If you ask us in writing to start work inside
          that period and we do, you may be asked to pay for what has already been done. Your
          cancellation rights are set out in full in the paperwork issued with your quote.
        </p>
      </LegalSection>

      {/* 11 */}
      <LegalSection id="complaints" index={11} title="Complaints">
        <p>
          If something is wrong, tell us and we will put it right. Contact us through the{" "}
          <Link href="/contact" className="link-draw" style={{ color: "var(--copper-ink)" }}>
            contact page
          </Link>
          .
        </p>
        <p>This is what happens when you do:</p>
        <LegalList
          items={[
            <>
              <Term>Within one working day</Term> we acknowledge your complaint in writing and tell
              you who is dealing with it. That is a named person, not a reference number.
            </>,
            <>
              <Term>Within five working days</Term> we either put it right or write to you with what
              we have found, what we propose to do, and by when.
            </>,
            <>
              If you are not satisfied with that answer, it is <Term>escalated to a director</Term>
              , who will respond within a further five working days. Both directors are on the
              tools, so this is not an appeal to someone who has never seen your job.
            </>,
            <>
              If we still cannot resolve it between us, gas work can be raised with the{" "}
              <Term>Gas Safe Register</Term>, and we will co-operate fully with any investigation.
              If your work was arranged through a main contractor or letting agent, their own
              contractual dispute process applies alongside this one.
            </>,
          ]}
        />
        <p className="text-sm">
          Nothing in this section affects your statutory rights under the Consumer Rights Act 2015.
        </p>
      </LegalSection>

      {/* 12 */}
      <LegalSection id="law" index={12} title="Governing law and changes">
        <p>
          These terms are governed by the law of England and Wales, and the courts of England and
          Wales have jurisdiction over any dispute. If you live in Scotland or Northern Ireland,
          you may also bring proceedings in your own courts.
        </p>
        <p>
          We may update these terms. The version that applies to you is the one published when you
          used the site, and the date at the top tells you when it last changed.
        </p>
        <p className="text-sm">
          Last updated {LAST_UPDATED}. See also our{" "}
          <Link href="/privacy" className="link-draw" style={{ color: "var(--copper-ink)" }}>
            privacy notice
          </Link>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
