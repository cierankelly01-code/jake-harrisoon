"use client";

import Link from "next/link";
import { useDivision } from "@/components/division/division-provider";
import { COMMERCIAL_PROCESS, DOMESTIC_PROCESS } from "@/lib/content/promises";
import { Arrow, Tick } from "@/components/ui/icons";
import { track } from "@/lib/analytics";

const DOMESTIC_STEPS = [
  {
    n: "1",
    title: "Get a price online",
    body: "Answer a few questions about your home and we email your fixed-price range. About two minutes, no home visit needed.",
  },
  {
    n: "2",
    title: "We confirm it in writing",
    body: "A quick survey checks the flue, gas supply and pipework, then you get one written price. It covers everything and it doesn't move.",
  },
  {
    n: "3",
    title: "We fit it, usually in a day",
    body: "The engineer who quoted turns up in a two-hour window, fits the boiler, shows you the controls and registers the warranty before leaving.",
  },
];

const COMMERCIAL_STEPS = COMMERCIAL_PROCESS.slice(0, 3).map((stage, i) => ({
  n: String(i + 1),
  title: stage.title,
  body: stage.summary,
}));

export function HowItWorks() {
  const { division } = useDivision();
  const isDomestic = division === "domestic";
  const steps = isDomestic ? DOMESTIC_STEPS : COMMERCIAL_STEPS;
  const installDay = isDomestic ? DOMESTIC_PROCESS.slice(2) : COMMERCIAL_PROCESS.slice(2);

  return (
    <section aria-labelledby="how-heading" className="container-x section">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-5">
          <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
            How it works
          </span>
          <h2 id="how-heading" className="font-display mt-3 text-3xl" style={{ color: "var(--ink)" }}>
            {isDomestic ? "Three steps from first look to fitted boiler." : "How a contract gets started."}
          </h2>

          <ol className="mt-8 flex flex-col gap-6">
            {steps.map((step) => (
              <li key={step.n} className="flex gap-4">
                <span
                  className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base"
                  style={{ background: "var(--flame)", color: "var(--ink)" }}
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <div>
                  <h3 className="font-display text-lg" style={{ color: "var(--ink)" }}>
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--steel)" }}>
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <Link
            href={isDomestic ? "/boiler-quote" : "/tenders"}
            onClick={() => track("cta_click", { location: "how_it_works", action: "primary" })}
            className="btn btn--primary mt-9"
          >
            {isDomestic ? "Get my fixed price" : "Submit a tender enquiry"}
            <Arrow />
          </Link>
        </div>

        <div className="lg:col-span-7">
          {/* Collapsed by default. This is good, specific content — it is
              also ~700px of boiler-install detail on a 375 screen, sitting
              in the middle of a homepage that offers four different routes,
              three of which are not installs. A native <details> keeps it
              one tap away, keeps every word in the HTML for crawlers, and
              needs no JavaScript. */}
          <details className="card card--soft group p-6 sm:p-8">
            <summary className="flex cursor-pointer items-center justify-between gap-4">
              <span>
                <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
                  {isDomestic ? "What happens on the day" : "Mobilisation and delivery"}
                </span>
                <span className="mt-3 block text-sm" style={{ color: "var(--steel)" }}>
                  {isDomestic
                    ? "This is the job, in order."
                    : "Paperwork lands before people do, and certificates follow as each task completes."}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 transition-transform group-open:rotate-45"
                style={{
                  color: "var(--copper-ink)",
                  transitionDuration: "var(--duration-transition)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
            </summary>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {installDay.map((stage) => (
                <div key={stage.ref}>
                  <h3 className="font-display text-base" style={{ color: "var(--ink)" }}>
                    {stage.title}
                  </h3>
                  <ul className="ticks mt-3">
                    {stage.detail.map((line) => (
                      <li key={line}>
                        <span className="tick" aria-hidden="true">
                          <Tick />
                        </span>
                        <span className="text-sm" style={{ color: "var(--ink)" }}>
                          {line}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
