"use client";

import Image from "next/image";
import Link from "next/link";
import { useDivision } from "@/components/division/division-provider";
import { business } from "@/lib/content/business";
import { phoneLink } from "@/lib/content/contact-links";
import { FROM_PRICE_GBP, FROM_MONTHLY_GBP } from "@/lib/quote/pricing";
import { track } from "@/lib/analytics";
import { QuickPrice } from "@/components/home/quick-price";
import { Arrow, Tick } from "@/components/ui/icons";

const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;

const COPY = {
  domestic: {
    headline: "New boiler installation at a fixed price.",
    sub: `Get a price online in about two minutes — no salesperson, no home visit needed. Fitted by Gas Safe registered engineers based in ${business.base.split(",")[0]}.`,
    primary: { label: "Get my fixed price", href: "/boiler-quote" },
    ticks: [
      "The price we quote is the price you pay",
      "Fitted by our own Gas Safe registered engineers",
      "Two-hour arrival windows, and we ring ahead",
    ],
  },
  commercial: {
    headline: "Mechanical contracting with the paperwork done first.",
    sub: "PPM and reactive cover from a single site to a multi-site portfolio across the West Midlands. Send the ITT and completed PQQ documentation comes back within 24 hours.",
    primary: { label: "Get the capability statement", href: "/capability" },
    ticks: [
      "PQQ documentation back within 24 hours",
      "RAMS issued before every mobilisation",
      "One contract, one renewal date, one set of certificates",
    ],
  },
} as const;

export function Hero() {
  const { division } = useDivision();
  const copy = COPY[division];
  const phone = phoneLink();
  const isDomestic = division === "domestic";

  return (
    <section className="relative overflow-hidden" style={{ background: "var(--paper)" }}>
      <div className="container-x pt-6 sm:pt-12 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Copy */}
          <div className="lg:col-span-6">
            <h1
              className="font-display font-display-xl"
              style={{ fontSize: "var(--text-hero)", color: "var(--ink)" }}
            >
              {copy.headline}
            </h1>
            <p className="mt-4 max-w-[50ch] text-base sm:mt-5 sm:text-lg" style={{ color: "var(--steel)" }}>
              {copy.sub}
            </p>

            {isDomestic && (
              <p className="mt-5 text-base" style={{ color: "var(--ink)" }}>
                New boilers from <strong className="tnum">{gbp(FROM_PRICE_GBP)}</strong> or from{" "}
                <strong className="tnum">£{FROM_MONTHLY_GBP} a month</strong>
                <span style={{ color: "var(--steel)" }}>, fully fitted.*</span>
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3 sm:mt-7">
              <Link
                href={copy.primary.href}
                onClick={() => track("cta_click", { location: "hero", action: "primary" })}
                className="btn btn--primary btn--lg"
              >
                {copy.primary.label}
                <Arrow />
              </Link>
              <Link
                href={phone.href}
                onClick={() => track("cta_click", { location: "hero", action: "call" })}
                className="btn btn--secondary btn--lg"
              >
                {phone.isDirect ? `Call ${phone.label}` : "Request a callback"}
              </Link>
            </div>

            <ul className="ticks mt-8">
              {copy.ticks.map((tick) => (
                <li key={tick}>
                  <span className="tick" aria-hidden="true">
                    <Tick />
                  </span>
                  <span className="font-medium" style={{ color: "var(--ink)" }}>
                    {tick}
                  </span>
                </li>
              ))}
            </ul>

            {isDomestic && (
              <p className="mt-6 text-sm" style={{ color: "var(--steel)" }}>
                Boiler broken down, or a leak?{" "}
                <Link href="/emergency" className="link-draw font-semibold" style={{ color: "var(--amber-ink)" }}>
                  Emergency help →
                </Link>
              </p>
            )}
          </div>

          {/* Visual */}
          <div className="lg:col-span-6">
            <div
              className="relative overflow-hidden"
              style={{
                background: "var(--slate-deep)",
                borderRadius: "var(--radius-lg)",
                aspectRatio: "4 / 3",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(70% 60% at 50% 40%, rgba(47,211,122,0.22) 0%, rgba(47,211,122,0) 70%)",
                }}
              />
              <Image
                src="/home-cutaway.webp"
                alt="Cutaway illustration of a two-storey house showing the boiler, hot water cylinder and pipework"
                width={1400}
                height={933}
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ mixBlendMode: "lighten", transform: "scale(1.04)" }}
              />
            </div>
          </div>
        </div>

        {isDomestic && (
          <p className="mt-6 text-xs" style={{ color: "var(--steel)" }}>
            *Indicative, based on a like-for-like combi swap. Your fixed price is confirmed in writing after a
            survey and does not change afterwards.
          </p>
        )}
      </div>

      {isDomestic && (
        <div className="container-x pt-10 sm:pt-14">
          <QuickPrice />
        </div>
      )}
    </section>
  );
}

