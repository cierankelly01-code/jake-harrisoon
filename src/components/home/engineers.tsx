"use client";

import { useDivision } from "@/components/division/division-provider";
import { business } from "@/lib/content/business";
import { PlaceholderMarker } from "@/components/ui/placeholder";
import { COMMERCIAL_STANDARDS, DOMESTIC_STANDARDS } from "@/lib/content/promises";

/**
 * The two directors, by name. No stock photo, no invented biography — a
 * photo slot appears the day a real one exists (business.ts). The standards
 * strip beneath describes the published standards the work is done to,
 * never a claim to hold a registration.
 */
export function Engineers() {
  const { division } = useDivision();
  const standards = division === "commercial" ? COMMERCIAL_STANDARDS : DOMESTIC_STANDARDS;

  return (
    <section aria-labelledby="engineers-heading" className="container-x section">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <span className="font-mono-label" style={{ color: "var(--copper-ink)" }}>
            Who turns up
          </span>
          <h2 id="engineers-heading" className="font-display mt-3 text-3xl" style={{ color: "var(--ink)" }}>
            Two engineers who own the company and still do the work.
          </h2>
          <p className="mt-4 text-base" style={{ color: "var(--steel)" }}>
            Hartson is owned {business.ownership} by Jake and Harrison. Both are Gas Safe registered, both
            are on the tools every day, and the person who quotes your job is the person who does it. No
            call centre, no sales team, no subcontractors.
          </p>
          <p className="mt-4 text-sm" style={{ color: "var(--steel)" }}>
            Every Gas Safe engineer carries an ID card. Ask to see ours at the door and check it at{" "}
            <a
              href="https://www.gassaferegister.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw font-semibold"
              style={{ color: "var(--copper-ink)" }}
            >
              gassaferegister.co.uk
            </a>
            . You should do that with anyone.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="grid gap-4 sm:grid-cols-2">
            {business.directors.map((director, index) => (
              <article
                key={director.firstName}
                className="card reveal reveal--panel flex flex-col gap-5 p-6"
                style={{ ["--reveal-delay" as string]: String(index) }}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-display text-2xl" style={{ color: "var(--ink)" }}>
                      {director.firstName}
                      {director.surname ? ` ${director.surname}` : <PlaceholderMarker label="DIRECTOR SURNAME" />}
                    </h3>
                    <p className="text-sm" style={{ color: "var(--steel)" }}>
                      Director · {director.qualification}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="chip chip--accent">Gas Safe registered</span>
                  <span className="chip">On the tools</span>
                  <span className="chip">Quotes and fits</span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 card card--soft p-6">
            <span className="font-mono-label" style={{ color: "var(--steel)" }}>
              The standards the work is done to
            </span>
            <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {standards.map((standard) => (
                <div key={standard.code} className="flex gap-3">
                  <dt className="font-display shrink-0 text-sm" style={{ color: "var(--ink)", minWidth: "5.5rem" }}>
                    {standard.code}
                  </dt>
                  <dd className="text-sm" style={{ color: "var(--steel)" }}>
                    <span className="font-semibold" style={{ color: "var(--ink)" }}>
                      {standard.name}.
                    </span>{" "}
                    {standard.what}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
