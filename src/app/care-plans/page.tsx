import type { Metadata } from "next";
import Link from "next/link";
import { CarePlansSection } from "@/components/care-plans/care-plans-section";

export const metadata: Metadata = {
  title: "Care Plans",
  description:
    "Annual service, gas safety certificate, breakdown cover and priority callout on one monthly payment. Cancel any time, no minimum term.",
};

/**
 * A page that takes a recurring card payment has to say what it does not
 * cover. This version adds the three things that were missing and that any
 * buyer looks for before subscribing: what is excluded, what the terms are,
 * and the questions people actually ask before handing over a card.
 */
const EXCLUSIONS = [
  {
    title: "The first 14 days",
    detail:
      "Cover starts 14 days after your first payment. It stops people signing up with a boiler that has already failed — which is what keeps the price where it is for everyone else.",
  },
  {
    title: "Pre-existing faults",
    detail:
      "A fault we have already told you about, or one found at the first service, is quoted separately. We will always tell you before any work starts what is covered and what is not.",
  },
  {
    title: "Boilers over 15 years old, or beyond economic repair",
    detail:
      "We will still service them, but breakdown cover is not available once parts are no longer made. We tell you this at sign-up rather than at the point of claim.",
  },
  {
    title: "Damage, not wear",
    detail:
      "Frost damage to an unlagged system, work by somebody else, and anything your home insurance covers instead.",
  },
];

const TERMS = [
  { label: "Minimum term", value: "None" },
  { label: "Cancellation", value: "Any time, one month's notice" },
  { label: "Exit fee", value: "None" },
  { label: "Excess per claim", value: "None" },
  { label: "Payment", value: "Monthly by card, via Stripe" },
  { label: "Price changes", value: "30 days' written notice" },
];

const FAQ = [
  {
    q: "What happens at the annual service?",
    a: "We book it — you do not have to remember. A Gas Safe registered engineer services the boiler, checks the gas soundness and working pressure, and leaves you the paperwork. On Cover and Complete, the gas safety certificate is issued at the same visit.",
  },
  {
    q: "How fast is a priority callout, really?",
    a: "Cover gets you a 24-hour response and Complete gets you same-day, both within our normal coverage area. If we cannot hit that, we tell you when we can rather than leaving you guessing.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes, in either direction, from the next payment. Moving up takes effect after 14 days, the same as a new plan, so the wait applies to the extra cover rather than to everything.",
  },
  {
    q: "What if I move house?",
    a: "Tell us and we will move the plan with you if the new address is in our coverage area. If it is not, we cancel it with no exit fee.",
  },
  {
    q: "Is this insurance?",
    a: "No. It is a service and repair plan from us directly, not a regulated insurance product, which is why there is no excess and no claims process — you ring us and we come out.",
  },
];

export default async function CarePlansPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; cancelled?: string }>;
}) {
  const { success, cancelled } = await searchParams;

  return (
    <>
      <section
        className="grain relative"
        style={{ background: "var(--ink)", color: "var(--paper)" }}
      >
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
              Care plans
            </span>
            <h1 className="font-display font-display-xl mt-5 text-4xl">
              One monthly payment. No surprise call-out bills.
            </h1>
            <p className="mt-6 max-w-[48ch] text-lg" style={{ color: "var(--steel-dim)" }}>
              Annual service, gas safety certificate, breakdown cover and priority callout. Pick the
              level that matches how much you want to think about your boiler.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-6 self-end lg:col-span-5">
            {TERMS.slice(0, 4).map((term) => (
              <div key={term.label}>
                <dt className="font-mono-label" style={{ color: "var(--steel-dim)" }}>
                  {term.label}
                </dt>
                <dd className="font-display mt-1 text-lg">{term.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div
        className="mx-auto max-w-[100rem] px-6"
        style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
      >
        {success && (
          <div
            className="mb-10 border-l-2 py-4 pl-5"
            style={{ borderColor: "var(--flame)", background: "var(--paper-raised)", color: "var(--ink)" }}
            role="status"
          >
            You&rsquo;re signed up. A confirmation is on its way to your email, and we will be in touch
            to book the first service.
          </div>
        )}
        {cancelled && (
          <div
            className="mb-10 border-l-2 py-4 pl-5"
            style={{ borderColor: "var(--border-hairline)", background: "var(--paper-raised)", color: "var(--ink)" }}
            role="status"
          >
            Checkout was cancelled and no payment was taken. Pick a plan below whenever you&rsquo;re ready.
          </div>
        )}

        <CarePlansSection />

        {/* What's not covered */}
        <section aria-labelledby="exclusions-heading" style={{ marginTop: "var(--space-section)" }}>
          <span className="section-index font-mono-label" data-index="01" style={{ color: "var(--copper-ink)" }}>
            What is not covered
          </span>
          <h2 id="exclusions-heading" className="font-display mt-4 max-w-[24ch] text-3xl" style={{ color: "var(--ink)" }}>
            The exclusions, up front rather than in the small print.
          </h2>
          <p className="mt-5 max-w-[52ch] text-base" style={{ color: "var(--steel)" }}>
            Every plan like this has limits. Ours are on this page rather than four clicks away,
            because finding them out at the point of a breakdown is how people end up hating their
            cover provider.
          </p>

          <div className="mt-10 grid gap-px md:grid-cols-2" style={{ background: "var(--border-hairline)" }}>
            {EXCLUSIONS.map((item, index) => (
              <div
                key={item.title}
                className="reveal p-6 md:p-8"
                style={{ background: "var(--surface)", ["--reveal-delay" as string]: String(index) }}
              >
                <h3 className="font-display text-xl" style={{ color: "var(--ink)" }}>
                  {item.title}
                </h3>
                <p className="mt-3 text-base" style={{ color: "var(--steel)" }}>
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Terms at a glance */}
        <section aria-labelledby="terms-heading" style={{ marginTop: "var(--space-section)" }}>
          <span className="section-index font-mono-label" data-index="02" style={{ color: "var(--copper-ink)" }}>
            Terms
          </span>
          <h2 id="terms-heading" className="font-display mt-4 text-3xl" style={{ color: "var(--ink)" }}>
            The whole agreement, in six lines.
          </h2>
          <dl
            className="mt-10 grid gap-px border sm:grid-cols-2 lg:grid-cols-3"
            style={{ background: "var(--border-hairline)", borderColor: "var(--border-hairline)", borderRadius: "var(--radius)" }}
          >
            {TERMS.map((term) => (
              <div key={term.label} className="p-6" style={{ background: "var(--surface)" }}>
                <dt className="font-mono-label" style={{ color: "var(--steel)" }}>
                  {term.label}
                </dt>
                <dd className="font-display mt-1.5 text-xl" style={{ color: "var(--ink)" }}>
                  {term.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 max-w-[60ch] text-sm" style={{ color: "var(--steel)" }}>
            Full written terms are issued with your confirmation email before the first payment is
            taken. See also our{" "}
            <Link href="/terms" className="link-draw" style={{ color: "var(--ink)" }}>
              terms of service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="link-draw" style={{ color: "var(--ink)" }}>
              privacy notice
            </Link>
            .
          </p>
        </section>

        {/* FAQ */}
        <section aria-labelledby="care-faq-heading" style={{ marginTop: "var(--space-section)" }}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: FAQ.map((item) => ({
                  "@type": "Question",
                  name: item.q,
                  acceptedAnswer: { "@type": "Answer", text: item.a },
                })),
              }),
            }}
          />
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="section-index font-mono-label" data-index="03" style={{ color: "var(--copper-ink)" }}>
                Questions
              </span>
              <h2 id="care-faq-heading" className="font-display mt-4 text-3xl" style={{ color: "var(--ink)" }}>
                Before you hand over a card.
              </h2>
            </div>
            <dl className="lg:col-span-8">
              {FAQ.map((item) => (
                <details key={item.q} name="care-faq" className="group border-b" style={{ borderColor: "var(--border-hairline)" }}>
                  <summary className="flex items-start justify-between gap-6 py-5">
                    <dt className="font-display text-xl leading-snug" style={{ color: "var(--ink)" }}>
                      {item.q}
                    </dt>
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
                      <dd className="max-w-[62ch] pb-6 pr-10 text-base" style={{ color: "var(--steel)" }}>
                        {item.a}
                      </dd>
                    </div>
                  </div>
                </details>
              ))}
            </dl>
          </div>
        </section>
      </div>
    </>
  );
}
