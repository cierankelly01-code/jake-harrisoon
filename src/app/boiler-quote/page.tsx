import type { Metadata } from "next";
import { QuoteWizard } from "@/components/quote/quote-wizard";
import { DOMESTIC_PROMISES } from "@/lib/content/promises";
import { Tick } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Get a Fixed Boiler Price",
  description:
    "Answer eight quick questions and get a fixed-price range for a new boiler in about two minutes. No calls, no home visit, no obligation.",
};

export default function BoilerQuotePage() {
  return (
    <div className="container-x section--tight">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="order-2 lg:order-1 lg:col-span-5">
          <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
            New boiler quote
          </span>
          <h1 className="font-display mt-3" style={{ fontSize: "var(--text-3xl)", color: "var(--ink)" }}>
            Your boiler price, in about two minutes.
          </h1>
          <p className="mt-4 max-w-[44ch] text-base" style={{ color: "var(--steel)" }}>
            {/* Was "you'll see three price bands straight away". Step 8 asks
                for name, email, postcode and phone and then emails the
                bands — so the page was promising the one thing the flow
                does not do, on a site that sells "no salesperson, nothing
                hidden". Either the bands show on screen ungated or the copy
                says what actually happens; this is the copy fix. */}
            Eight quick questions, then we email your three price bands. The fixed price is
            confirmed after a free survey and doesn&rsquo;t move once it is.
          </p>

          <ul className="ticks mt-8 hidden lg:flex">
            {DOMESTIC_PROMISES.map((promise) => (
              <li key={promise.id}>
                <span className="tick" aria-hidden="true">
                  <Tick />
                </span>
                <span>
                  <span className="block font-semibold" style={{ color: "var(--ink)" }}>
                    {promise.title}
                  </span>
                  <span className="block text-sm" style={{ color: "var(--steel)" }}>
                    {promise.proof}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-7">
          <div className="card p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
            <QuoteWizard />
          </div>
        </div>
      </div>
    </div>
  );
}
