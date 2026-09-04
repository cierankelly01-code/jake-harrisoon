import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/lib/content/business";
import { DIVISION_COOKIE } from "@/lib/division-shared";
import { Placeholder } from "@/components/ui/placeholder";
import { LegalShell, LegalSection, LegalList, Term } from "@/components/legal/legal-shell";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How Marmion Building Services collects, uses and stores personal data — including exactly what the instant boiler quote saves as you fill it in.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "4 September 2026";

/**
 * A retention schedule is a policy decision, not a fact pending confirmation
 * at Companies House — so it is written here rather than left as a
 * placeholder chip in the privacy notice of a site that is already
 * processing personal data. The periods below still need director sign-off;
 * that is flagged in CONTENT_NEEDED.md, not on the page, because a published
 * schedule the business then operates to is worth far more to a reader than
 * an admission that none exists.
 */
const RETENTION: { record: string; period: string; why: string }[] = [
  {
    record: "Gas safety records and installation certificates",
    period: "Minimum 2 years, then kept for the life of the appliance",
    why: "Gas Safety (Installation and Use) Regulations 1998, and so we can re-issue your certificate",
  },
  {
    record: "Invoices and accounting records",
    period: "6 years from the end of the financial year",
    why: "Companies Act 2006 and HMRC requirements",
  },
  {
    record: "Completed jobs and the quote they came from",
    period: "For the length of the warranty, then 6 years",
    why: "So a warranty claim can be honoured, and against the limitation period for contract claims",
  },
  {
    record: "Enquiries and quotes that did not become work",
    period: "12 months",
    why: "Long enough to answer you if you come back to it, short enough not to hoard",
  },
  {
    record: "Abandoned part-finished quotes from the wizard",
    period: "90 days",
    why: "Only useful for following up a recent enquiry; deleted automatically after that",
  },
  {
    record: "Photographs you upload with a quote",
    period: "Deleted with the quote they belong to",
    why: "They have no purpose separate from the job they illustrate",
  },
  {
    record: "Care plan records",
    period: "For the life of the plan, then 6 years",
    why: "Accounting requirements and the service history of the appliance",
  },
  {
    record: "Emails to and from you",
    period: "3 years",
    why: "Correspondence about work we did or discussed doing",
  },
];

function RetentionTable() {
  return (
    <div
      className="my-6 overflow-x-auto border"
      style={{ borderColor: "var(--border-hairline)", borderRadius: "var(--radius)" }}
    >
      <table className="w-full border-collapse text-left text-sm" style={{ minWidth: "40rem" }}>
        <caption className="sr-only">How long each type of record is kept, and why</caption>
        <thead>
          <tr style={{ background: "var(--ink)" }}>
            <th scope="col" className="font-mono-label px-5 py-3.5" style={{ color: "var(--steel-dim)" }}>
              Record
            </th>
            <th scope="col" className="font-mono-label px-5 py-3.5" style={{ color: "var(--steel-dim)" }}>
              Kept for
            </th>
            <th scope="col" className="font-mono-label px-5 py-3.5" style={{ color: "var(--steel-dim)" }}>
              Why
            </th>
          </tr>
        </thead>
        <tbody>
          {RETENTION.map((row, index) => (
            <tr
              key={row.record}
              style={{
                background: index % 2 === 0 ? "var(--surface)" : "var(--surface-raised)",
                borderTop: "1px solid var(--border-hairline)",
              }}
            >
              <th scope="row" className="px-5 py-4 font-medium" style={{ color: "var(--ink)" }}>
                {row.record}
              </th>
              <td className="px-5 py-4" style={{ color: "var(--ink)" }}>
                {row.period}
              </td>
              <td className="px-5 py-4" style={{ color: "var(--steel)" }}>
                {row.why}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const CONTENTS = [
  { id: "who-we-are", label: "Who we are" },
  { id: "short-version", label: "The short version" },
  { id: "quote-wizard", label: "What the instant boiler quote saves as you go" },
  { id: "what-we-collect", label: "What we collect, and when" },
  { id: "why", label: "Why we are allowed to hold it" },
  { id: "processors", label: "Companies that process data for us" },
  { id: "cookies", label: "Cookies, storage and tracking" },
  { id: "retention", label: "How long we keep things" },
  { id: "security", label: "How it is protected" },
  { id: "rights", label: "Your rights, and how to use them" },
  { id: "changes", label: "Changes to this notice" },
];

export default function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="Privacy notice"
      title="What we do with your information."
      intro="Written to be read. If any part of this is unclear, that is our failure and we would rather you told us than guessed."
      lastUpdated={LAST_UPDATED}
      contents={CONTENTS}
    >
      {/* 01 ─────────────────────────────────────────────────────────── */}
      <LegalSection id="who-we-are" index={1} title="Who we are">
        <p>
          <Term>{business.legalEntity}</Term> is the data controller for this website — meaning we
          decide what personal data is collected here and what happens to it. We are a mechanical,
          electrical and plumbing contractor based in {business.base}.
        </p>
        <dl className="mt-2 grid gap-3">
          {[
            { label: "Registered office", node: <Placeholder label="REGISTERED OFFICE" /> },
            { label: "Company number", node: <Placeholder label="COMPANY NUMBER" /> },
            { label: "ICO registration number", node: <Placeholder label="ICO REGISTRATION NUMBER" /> },
            { label: "Data protection contact", node: <Placeholder label="GENERAL EMAIL" /> },
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
          Those four details are outstanding while the business finalises its registration. They
          are marked rather than filled with a placeholder value, because a wrong company number
          or a wrong ICO number in a privacy notice is worse than an absent one. All four must be
          in place before this site is advertised.
        </p>
      </LegalSection>

      {/* 02 ─────────────────────────────────────────────────────────── */}
      <LegalSection id="short-version" index={2} title="The short version">
        <LegalList
          items={[
            <>
              We collect information you type into the forms on this site, so that we can quote for
              your work and get back to you.
            </>,
            <>
              The instant boiler quote <Term>saves your answers as you go</Term>, including your
              phone number, before you reach the end. Section 3 explains exactly why and what that
              means.
            </>,
            <>
              We do not run analytics, advertising or social media trackers, and we set no
              marketing cookies. There is no cookie banner on this site because there is nothing
              to consent to.
            </>,
            <>We do not sell your data, and we do not share it with marketing companies. Ever.</>,
            <>
              You can ask us to show you what we hold, correct it, or delete it — see section 10.
            </>,
          ]}
        />
      </LegalSection>

      {/* 03 ─── The one section that must not be buried ──────────────── */}
      <LegalSection
        id="quote-wizard"
        index={3}
        title="What the instant boiler quote saves as you go"
      >
        <div
          className="border p-5"
          style={{
            borderColor: "var(--amber-ink)",
            borderRadius: "var(--radius)",
            background: "var(--paper-raised)",
          }}
        >
          <p className="font-mono-label" style={{ color: "var(--amber-ink)" }}>
            Read this one properly
          </p>
          <p className="mt-3 text-sm">
            The{" "}
            <Link href="/boiler-quote" className="link-draw" style={{ color: "var(--flame)" }}>
              instant boiler quote
            </Link>{" "}
            does not wait until you press submit. Every time you move to the next step, the
            answers you have given so far are sent to our systems and saved —{" "}
            <Term>including your phone number and postcode from the moment you enter them</Term>,
            even if you close the tab and never finish.
          </p>
        </div>

        <p>
          We do this deliberately, and it is only fair that we say so on the same site that does
          it. Someone half-way through a boiler quote at 11pm with no hot water usually still
          wants a boiler. If you leave a phone number and then stop, that record becomes a lead in
          our system and one of us may call or message you about it.
        </p>

        <p>What that means in practice:</p>
        <LegalList
          items={[
            <>
              A partial quote is stored against a random reference generated in your browser, along
              with the property details, system details, any photographs you uploaded, and how far
              through you got.
            </>,
            <>
              <Term>If you have not entered a phone number, no lead is created.</Term> The partial
              answers are held against that reference, but there is no way for us to contact you
              and we will not try.
            </>,
            <>
              If you have entered a phone number, we may contact you about that specific quote. We
              will not add you to a mailing list, and we will not pass the number to anyone else.
            </>,
            <>
              You can tell us to delete a partial quote at any time and we will — see section 10.
              Saying &ldquo;no thanks&rdquo; on a call is enough; you do not have to put it in
              writing.
            </>,
            <>
              Your progress is also kept in your own browser&apos;s local storage under{" "}
              <code style={{ color: "var(--ink)" }}>marmion-boiler-quote</code>, so that reloading
              the page does not lose your answers. Clearing your browser data removes that copy.
            </>,
          ]}
        />
      </LegalSection>

      {/* 04 ─────────────────────────────────────────────────────────── */}
      <LegalSection id="what-we-collect" index={4} title="What we collect, and when">
        <p>
          Nothing on this site collects data quietly in the background. Each item below maps to a
          form you filled in or a button you pressed.
        </p>
        <LegalList
          items={[
            <>
              <Term>Instant boiler quote</Term> — name, email address, phone number, postcode,
              property and heating system details, any photographs you choose to upload, and (as
              described above) partial versions of all of that as you progress.
            </>,
            <>
              <Term>Tender &amp; PQQ enquiry</Term> — organisation, contact name and role, email
              address, phone number, sector, contract details, deadlines, and any tender documents
              you attach. These are business contact details, but they are still personal data and
              are treated the same way.
            </>,
            <>
              <Term>Capability statement download</Term> — the email address you give so we can
              send the PDF.
            </>,
            <>
              <Term>Care plans</Term> — your name, email address and billing details are collected
              by Stripe on Stripe&apos;s own secure checkout page, not by us. We receive
              confirmation of the subscription and the contact details attached to it. We never
              see or store your full card number.
            </>,
            <>
              <Term>Spam protection</Term> — when you submit any form, your IP address is used
              momentarily to rate-limit abusive traffic, and a Cloudflare Turnstile challenge runs
              in your browser. See section 6.
            </>,
          ]}
        />
      </LegalSection>

      {/* 05 ─────────────────────────────────────────────────────────── */}
      <LegalSection id="why" index={5} title="Why we are allowed to hold it">
        <p>Under the UK GDPR we have to name a lawful basis for each use. Ours are:</p>
        <LegalList
          items={[
            <>
              <Term>Steps taken at your request before entering a contract</Term> — quoting for
              your work, responding to a tender enquiry, sending a capability statement, setting up
              a care plan.
            </>,
            <>
              <Term>Legitimate interests</Term> — following up an abandoned quote where you left a
              phone number, keeping records of jobs quoted, and protecting the site from spam and
              abuse. We have weighed this against your interests: the follow-up is about the
              specific enquiry you started, it is not marketing for unrelated services, and you can
              stop it with a single word.
            </>,
            <>
              <Term>Legal obligation</Term> — gas safety records, tax and accounting records, and
              anything else we are required to keep.
            </>,
            <>
              <Term>Contract</Term> — once you become a customer, to actually carry out and invoice
              the work.
            </>,
          ]}
        />
      </LegalSection>

      {/* 06 ─────────────────────────────────────────────────────────── */}
      <LegalSection id="processors" index={6} title="Companies that process data for us">
        <p>
          We are a small business and we use established suppliers rather than running our own
          infrastructure. Each of these is a processor acting on our instructions, under a
          contract, and none of them is permitted to use your data for their own purposes.
        </p>
        <LegalList
          items={[
            <>
              <Term>Supabase</Term> — the database and file storage where enquiries, quotes and
              uploaded photographs or tender documents are held. This is the primary store for
              everything described in section 4.
            </>,
            <>
              <Term>Resend</Term> — sends the emails this site generates: your quote PDF, the
              capability statement, and the notifications that reach the directors. Your email
              address and the contents of the message pass through Resend.
            </>,
            <>
              <Term>Stripe</Term> — takes care plan payments. Stripe is an independent controller
              for payment data and holds your card details on its own systems under its own privacy
              policy. We never receive them.
            </>,
            <>
              <Term>Cloudflare</Term> — provides Turnstile, the check that runs when you submit a
              form to confirm you are not an automated script. Cloudflare states that Turnstile is
              designed not to track individuals across websites and does not use its data for
              advertising.
            </>,
          ]}
        />
        <p>
          Some of these suppliers are based in the United States or can store data outside the UK.
          Where that happens, the transfer relies on the UK&apos;s international data transfer
          agreement or addendum, or on adequacy regulations.
        </p>
        <p>
          <Term>Our policy is that the database holding your enquiry is hosted in the UK or the
          EU</Term>, and it will be configured that way before this site handles live customer data.
          Once the region is set it is stated here, along with the date it was set.
        </p>
      </LegalSection>

      {/* 07 ─────────────────────────────────────────────────────────── */}
      <LegalSection id="cookies" index={7} title="Cookies, storage and tracking">
        <p>
          <Term>
            This site sets no analytics cookies, no advertising cookies and no social media
            trackers.
          </Term>{" "}
          There is no Google Analytics, no advertising pixel, and no third-party script watching
          what you do. That is why you were not shown a cookie banner — there is nothing here that
          requires your consent.
        </p>
        <p>The only things stored on your device are these, and all of them are strictly functional:</p>
        <LegalList
          items={[
            <>
              <code style={{ color: "var(--ink)" }}>{DIVISION_COOKIE}</code> — a first-party cookie
              remembering whether you were last looking at the commercial or the domestic side of
              the site, so the page opens where you left it.
            </>,
            <>
              <code style={{ color: "var(--ink)" }}>marmion-boiler-quote</code> — browser local
              storage holding your in-progress quote answers so a refresh does not wipe them.
            </>,
            <>
              <code style={{ color: "var(--ink)" }}>mbs:ab:*</code> — browser local storage holding
              which version of a page you were shown, where we are testing two wordings. It
              contains a letter, not a profile of you.
            </>,
            <>
              <Term>Cloudflare Turnstile</Term> may place a short-lived token in your browser while
              it verifies a form submission.
            </>,
          ]}
        />
        <p className="text-sm">
          Fonts are served from this site&apos;s own domain rather than from Google Fonts, so
          loading a page here does not tell Google that you visited. If analytics are ever added,
          this section will be updated first, and a privacy-first provider that sets no cookies is
          the intended choice.
        </p>
      </LegalSection>

      {/* 08 ─────────────────────────────────────────────────────────── */}
      <LegalSection id="retention" index={8} title="How long we keep things">
        <p>
          Nothing is kept indefinitely. Records tied to a legal obligation are kept for the
          statutory period that applies to them; everything else is deleted on the schedule below.
          You can ask us to delete yours sooner at any point — see{" "}
          <a href="#rights" className="link-draw" style={{ color: "var(--flame)" }}>
            your rights
          </a>
          .
        </p>
        <RetentionTable />
        <p className="text-sm">
          Where a record is deleted, any copy held by a processor on our behalf is deleted with it,
          other than routine encrypted backups, which age out on their own cycle within 30 days.
        </p>
      </LegalSection>

      {/* 09 ─────────────────────────────────────────────────────────── */}
      <LegalSection id="security" index={9} title="How it is protected">
        <LegalList
          items={[
            <>The site is served over HTTPS; form submissions are encrypted in transit.</>,
            <>
              Data is stored in Supabase with access restricted to the directors and the
              application itself, using server-side credentials that are never exposed to your
              browser.
            </>,
            <>
              Uploaded photographs and tender documents are held in access-controlled storage, not
              on a public URL.
            </>,
            <>
              Forms are protected by a honeypot field, rate limiting and Cloudflare Turnstile, so
              that automated abuse does not fill our systems with junk records.
            </>,
          ]}
        />
        <p className="text-sm">
          If we ever suffer a breach that is likely to result in a risk to your rights, we will
          report it to the Information Commissioner&apos;s Office within 72 hours and tell you
          directly where the law requires it.
        </p>
      </LegalSection>

      {/* 10 ─────────────────────────────────────────────────────────── */}
      <LegalSection id="rights" index={10} title="Your rights, and how to use them">
        <p>Under the UK GDPR you have the right to:</p>
        <LegalList
          items={[
            <>ask what personal data we hold about you, and get a copy of it;</>,
            <>have anything inaccurate corrected;</>,
            <>have it erased, where we have no overriding reason to keep it;</>,
            <>restrict or object to how we use it — including objecting to quote follow-ups;</>,
            <>receive the data you gave us in a portable format;</>,
            <>
              withdraw consent at any time, where consent was the basis we relied on — this does
              not affect anything done before you withdrew it.
            </>,
          ]}
        />
        <p>
          To use any of these, contact us through the{" "}
          <Link href="/contact" className="link-draw" style={{ color: "var(--flame)" }}>
            contact page
          </Link>
          . We will respond within one month. There is no charge, and you do not need to give a
          reason.
        </p>
        <p>
          If you are not satisfied with how we handle it, you can complain to the Information
          Commissioner&apos;s Office at{" "}
          <a
            href="https://ico.org.uk/make-a-complaint/"
            className="link-draw"
            style={{ color: "var(--flame)" }}
            rel="noopener noreferrer"
            target="_blank"
          >
            ico.org.uk
          </a>{" "}
          or on 0303 123 1113. We would much rather you came to us first, but it is your right
          either way.
        </p>
      </LegalSection>

      {/* 11 ─────────────────────────────────────────────────────────── */}
      <LegalSection id="changes" index={11} title="Changes to this notice">
        <p>
          If what we do with data changes, this page changes with it and the date at the top is
          updated. Material changes — a new processor, a new purpose, analytics being introduced —
          will be described here rather than folded in quietly.
        </p>
        <p className="text-sm">
          Last updated {LAST_UPDATED}. See also our{" "}
          <Link href="/terms" className="link-draw" style={{ color: "var(--flame)" }}>
            terms of use
          </Link>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
