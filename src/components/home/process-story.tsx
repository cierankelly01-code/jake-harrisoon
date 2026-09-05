"use client";

import { useEffect, useRef, useState } from "react";
import { useDivision } from "@/components/division/division-provider";
import { COMMERCIAL_PROCESS, DOMESTIC_PROCESS, type ProcessStage } from "@/lib/content/promises";
import { track } from "@/lib/analytics";

/**
 * ★ THE SHOWSTOPPER — one signature interactive moment for the whole site.
 *
 * A pinned scroll story (motion-cookbook §3) in which a heating system is
 * drawn stage by stage as you scroll: surveyed, priced, installed, handed
 * over. It is the site's only large animated moment, deliberately — the
 * restraint everywhere else is what lets this land.
 *
 * It is also doing conversion work rather than decoration. "Process — three
 * or four steps" is the section of the local-service blueprint that kills
 * fear of the unknown, and it is the strongest proof available to a firm
 * with no published reviews yet: exactly what happens, in order.
 *
 * Discipline:
 * - Discrete states, never continuous scrubbing — smooth on weak devices.
 * - transform/opacity/stroke-dashoffset only. No layout reads on scroll.
 * - Pinning is desktop-only. On phones it degrades to a plain stacked list;
 *   hijacking touch scroll is worse than having no effect at all.
 * - No JS and reduced-motion both land on the same static state: every stage
 *   visible, drawing complete.
 * - The SVG is hand-drawn inline in-palette: no library, no stock imagery.
 */

const PIN_BREAKPOINT = "(min-width: 1024px)";

export function ProcessStory() {
  const { division } = useDivision();
  const stages = division === "commercial" ? COMMERCIAL_PROCESS : DOMESTIC_PROCESS;
  const isCommercial = division === "commercial";

  const wrapperRef = useRef<HTMLDivElement>(null);
  // Starts at the LAST stage, not the first. With no JS, with reduced motion,
  // or on a phone, this is the state that renders — and the docstring above
  // promises the drawing is complete there. Starting at 0 shipped a frozen
  // survey sketch with no flame, no certificate and no priced schedule to
  // exactly the readers who would never see it animate. `apply()` resets it
  // to 0 the moment pinning actually takes over.
  const [step, setStep] = useState(stages.length - 1);
  const [pinned, setPinned] = useState(false);
  const lastTracked = useRef(-1);

  useEffect(() => {
    const media = window.matchMedia(PIN_BREAKPOINT);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      const active = media.matches && !reduced.matches;
      setPinned(active);
      // Pinned: rewind to stage one so the story can play. Not pinned: the
      // complete drawing, which is also the server-rendered default.
      setStep(active ? 0 : stages.length - 1);
    };

    apply();
    media.addEventListener("change", apply);
    reduced.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
      reduced.removeEventListener("change", apply);
    };
  }, [stages.length]);

  useEffect(() => {
    if (!pinned) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let frame = 0;
    let onScreen = false;

    const measure = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      setStep(Math.min(stages.length - 1, Math.floor(progress * stages.length)));
    };

    // A plain scroll listener misses any scroll that does not emit an event —
    // an in-page anchor jump, a browser scroll restore on reload, a
    // programmatic scrollTo. Those all leave the story frozen on stage one
    // while the reader is looking at stage four. So the position is sampled
    // once per frame, but only while the section is actually on screen: the
    // observer stops the loop dead the moment it leaves, so this costs
    // nothing for the rest of the page.
    const tick = () => {
      if (!onScreen) {
        frame = 0;
        return;
      }
      measure();
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !frame) frame = requestAnimationFrame(tick);
      },
      { threshold: 0 }
    );
    observer.observe(wrapper);
    measure();

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pinned, stages.length]);

  useEffect(() => {
    if (!pinned || step === lastTracked.current) return;
    lastTracked.current = step;
    track("process_stage", { stage: stages[step]?.ref ?? String(step) });
  }, [step, pinned, stages]);

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="grain relative"
      /* Test hooks, deliberately kept. This component's state is otherwise
         only observable through crossfading opacities, which browser tooling
         reports unreliably mid-transition — these two attributes are how the
         story's behaviour is actually verifiable from outside React. */
      data-step={step}
      data-pinned={pinned ? "true" : "false"}
      style={{ background: "var(--ink)", color: "var(--paper)" }}
    >
      <div
        ref={wrapperRef}
        /* Scroll cost per word is the whole argument here. At 100vh lead-in
           plus 70vh per stage this ran 380vh (3,420px on a laptop) — 28% of
           the homepage for 197 words, and the single biggest reason the page
           read as 13 viewports long. 50 + 40/stage is 210vh: each stage still
           gets ~360px of scroll to register its change, and the section gives
           back roughly 1,400px. */
        style={pinned ? { height: `${50 + stages.length * 40}vh` } : undefined}
      >
        <div
          className="relative z-10 mx-auto max-w-[100rem] px-6"
          style={
            pinned
              ? {
                  position: "sticky",
                  top: 0,
                  minHeight: "100dvh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  paddingTop: "var(--space-section-tight)",
                  paddingBottom: "var(--space-section-tight)",
                }
              : {
                  paddingTop: "var(--space-section)",
                  paddingBottom: "var(--space-section)",
                }
          }
        >
          <header className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="section-index font-mono-label" data-index="03" style={{ color: "var(--copper-bright)" }}>
                How the work runs
              </span>
              <h2 id="process-heading" className="font-display mt-4 max-w-[20ch] text-3xl">
                {isCommercial
                  ? "Nothing starts until the paperwork is with you."
                  : "Nothing gets fitted until the price is agreed."}
              </h2>
            </div>
            <p className="max-w-[38ch] text-sm" style={{ color: "var(--steel-dim)" }}>
              {isCommercial
                ? "Four stages from ITT to certification. Every one of them produces a document you keep."
                : "Four stages from first look to handover. You know the price at stage two and it does not change after that."}
            </p>
          </header>

          <div className="mt-10 grid gap-px lg:grid-cols-12" style={{ background: "var(--border-hairline-dark)" }}>
            {/* Stage copy */}
            <div className="lg:col-span-5" style={{ background: "var(--ink)" }}>
              {pinned ? (
                // All four stages occupy the same grid cell, so the box sizes
                // itself to the tallest one. The previous version stacked them
                // with position:absolute inside a fixed min-height, which meant
                // a magic number that the longest stage quietly overflowed by
                // 14px at 1024px.
                <div className="grid p-8">
                  {stages.map((stage, index) => (
                    <StageCopy key={stage.ref} stage={stage} active={index === step} stacked />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col">
                  {stages.map((stage) => (
                    <div key={stage.ref} className="border-b p-8 last:border-b-0" style={{ borderColor: "var(--border-hairline-dark)" }}>
                      <StageCopy stage={stage} active />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Schematic */}
            <div className="p-6 lg:col-span-7 lg:p-8" style={{ background: "var(--slate-deep)" }}>
              <SystemSchematic step={step} commercial={isCommercial} />
            </div>
          </div>

          {/* Progress rail. Desktop (lg) only, matching PIN_BREAKPOINT — CSS,
              not the JS `pinned` state, so there's no hydration flash on the
              desktop viewports it's for. Below lg (and under reduced
              motion) every stage already renders as its own full-width,
              fully-titled block above, so the rail would be pure decoration
              there rather than a real progress indicator — and at 4 equal
              columns in under 400px, decoration is all it could be: a fresh
              reviewer found it truncating to unreadable fragments like
              "01ENQ…" on a 375px phone, confirmed pixel-for-pixel. */}
          <ol
            className="mt-8 hidden gap-px lg:grid"
            style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))`, background: "var(--border-hairline-dark)" }}
          >
            {stages.map((stage, index) => {
              const done = pinned ? index <= step : true;
              return (
                <li
                  key={stage.ref}
                  aria-current={pinned && index === step ? "step" : undefined}
                  className="font-mono-label flex items-center gap-2 px-3 py-3"
                  style={{
                    background: "var(--ink)",
                    /* --steel is a light-surface colour: on --ink it is 2.98:1
                       and fails AA. Un-reached stages use --steel-dim (8.9:1)
                       and are distinguished from reached ones by the flame
                       rule above them, not by contrast alone. */
                    color: done ? "var(--paper)" : "var(--steel-dim)",
                    borderTop: `2px solid ${done ? "var(--flame-glow)" : "transparent"}`,
                    transition: "color var(--duration-transition) var(--ease-mech), border-color var(--duration-transition) var(--ease-mech)",
                  }}
                >
                  <span style={{ color: done ? "var(--copper-bright)" : "var(--steel-dim)" }}>{stage.ref}</span>
                  <span className="truncate">{stage.title}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function StageCopy({
  stage,
  active,
  stacked = false,
}: {
  stage: ProcessStage;
  active: boolean;
  /** Share one grid cell with the other stages, crossfading between them. */
  stacked?: boolean;
}) {
  return (
    <div
      aria-hidden={stacked && !active}
      style={{
        ...(stacked
          ? {
              gridArea: "1 / 1",
              pointerEvents: active ? "auto" : "none",
              alignSelf: "start",
            }
          : {}),
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(10px)",
        transition: "opacity var(--duration-transition) var(--ease-mech), transform var(--duration-transition) var(--ease-mech)",
      }}
    >
      <span className="font-mono-label" style={{ color: "var(--copper-bright)" }}>
        Stage {stage.ref}
      </span>
      <h3 className="font-display mt-3 text-2xl">{stage.title}</h3>
      <p className="mt-2 text-sm" style={{ color: "var(--steel-dim)" }}>
        {stage.summary}
      </p>
      <ul className="mt-5 flex flex-col gap-2.5">
        {stage.detail.map((line) => (
          <li key={line} className="flex gap-3 text-sm" style={{ color: "var(--paper)" }}>
            <span aria-hidden="true" style={{ color: "var(--flame-glow)", flexShrink: 0 }}>
              —
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The drawing. One schematic, four states:
 *   0 survey    — dashed outlines and dimension lines only, nothing committed
 *   1 price     — the schedule panel fills in, items priced
 *   2 install   — pipe runs draw in solid, plant fills
 *   3 handover  — flame lit, certificate stamped, everything solid
 *
 * Drawn at a fixed 720×460 viewBox and scaled, so the line weights stay
 * consistent at every width.
 */
function SystemSchematic({ step, commercial }: { step: number; commercial: boolean }) {
  const drawn = (from: number) => (step >= from ? 1 : 0);
  const pipeStyle = (from: number) => ({
    strokeDasharray: 460,
    strokeDashoffset: step >= from ? 0 : 460,
    transition: "stroke-dashoffset 900ms var(--ease-mech), stroke 400ms linear",
  });

  return (
    <svg
      viewBox="0 0 720 460"
      className="h-auto w-full"
      role="img"
      aria-label={
        commercial
          ? "Schematic of a commercial plant room: boiler plant, flow and return pipework, cylinder and emitters, with survey dimensions and a priced schedule."
          : "Schematic of a domestic heating system: boiler, flue, gas supply, flow and return pipework, cylinder and radiators, with survey dimensions and a priced schedule."
      }
    >
      <defs>
        <marker id="dim-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0 0L6 3L0 6z" fill="var(--copper-bright)" />
        </marker>
      </defs>

      {/* Wall / floor datum */}
      <line x1="40" y1="404" x2="680" y2="404" stroke="var(--copper)" strokeWidth="1" opacity="0.7" />
      <line x1="60" y1="46" x2="60" y2="404" stroke="var(--copper)" strokeWidth="1" opacity="0.35" />

      {/* Dimension lines — survey stage, then they fade back but stay faintly visible */}
      <g
        style={{
          opacity: step === 0 ? 1 : 0.28,
          transition: "opacity 500ms var(--ease-mech)",
        }}
      >
        <line x1="96" y1="34" x2="248" y2="34" stroke="var(--copper-bright)" strokeWidth="1" markerStart="url(#dim-arrow)" markerEnd="url(#dim-arrow)" />
        <text x="172" y="26" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="14" fill="var(--copper-bright)">
          MEASURED
        </text>
        <line x1="672" y1="120" x2="672" y2="300" stroke="var(--copper-bright)" strokeWidth="1" markerStart="url(#dim-arrow)" markerEnd="url(#dim-arrow)" />
        <text x="666" y="216" textAnchor="end" fontFamily="var(--font-mono)" fontSize="14" fill="var(--copper-bright)">
          FLOW RATE
        </text>
      </g>

      {/* Flue */}
      <path
        d="M172 120 L172 62"
        stroke={step >= 2 ? "var(--steel-dim)" : "var(--steel)"}
        strokeWidth="8"
        strokeDasharray={step >= 2 ? "0" : "6 6"}
        style={{ transition: "stroke 500ms linear" }}
      />

      {/* Boiler / plant unit */}
      <rect
        x="96"
        y="120"
        width="152"
        height="180"
        fill={step >= 2 ? "var(--slate)" : "transparent"}
        stroke={step >= 1 ? "var(--paper)" : "var(--steel)"}
        strokeWidth="1.5"
        strokeDasharray={step >= 1 ? "0" : "7 6"}
        style={{ transition: "fill 600ms linear, stroke 500ms linear" }}
      />
      <text x="106" y="142" fontFamily="var(--font-mono)" fontSize="14" fill="var(--steel-dim)" letterSpacing="1">
        {commercial ? "PLANT" : "BOILER"}
      </text>

      {/* Burner flame — lights only at handover. The brand's whole idea in one
          detail: blue flame = correct combustion = the job done properly. */}
      <g style={{ opacity: drawn(3), transition: "opacity 700ms var(--ease-mech)" }}>
        <path
          d="M172 268 C150 246 166 232 172 216 C178 232 194 246 172 268 Z"
          fill="var(--flame-glow)"
        />
        <path d="M172 262 C160 248 168 240 172 232 C176 240 184 248 172 262 Z" fill="var(--paper)" opacity="0.85" />
        <text x="172" y="292" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fill="var(--flame-glow)" letterSpacing="1">
          COMMISSIONED
        </text>
      </g>

      {/* Gas supply */}
      <path
        d="M60 340 L96 340 L96 300"
        fill="none"
        stroke="var(--copper-bright)"
        strokeWidth="3"
        style={pipeStyle(2)}
      />
      <text x="62" y="332" fontFamily="var(--font-mono)" fontSize="13" fill="var(--copper-bright)" letterSpacing="1">
        GAS
      </text>

      {/* Flow pipe */}
      <path
        d="M248 168 L360 168 L360 108 L600 108"
        fill="none"
        stroke="var(--flame-glow)"
        strokeWidth="3"
        style={pipeStyle(2)}
      />
      {/* Return pipe */}
      <path
        d="M248 252 L320 252 L320 344 L600 344"
        fill="none"
        stroke="var(--steel-dim)"
        strokeWidth="3"
        style={pipeStyle(2)}
      />

      {/* Cylinder */}
      <g>
        <rect
          x="404"
          y="180"
          width="72"
          height="140"
          rx="2"
          fill={step >= 2 ? "var(--slate)" : "transparent"}
          stroke={step >= 1 ? "var(--paper)" : "var(--steel)"}
          strokeWidth="1.5"
          strokeDasharray={step >= 1 ? "0" : "7 6"}
          style={{ transition: "fill 600ms linear, stroke 500ms linear" }}
        />
        <text x="440" y="340" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fill="var(--steel-dim)" letterSpacing="1">
          CYLINDER
        </text>
      </g>

      {/* Emitters */}
      {[
        { x: 560, y: 84, label: commercial ? "AHU" : "RAD 01" },
        { x: 560, y: 320, label: commercial ? "FCU" : "RAD 02" },
      ].map((emitter) => (
        <g key={emitter.label}>
          <rect
            x={emitter.x}
            y={emitter.y}
            width="88"
            height="48"
            fill={step >= 2 ? "var(--slate)" : "transparent"}
            stroke={step >= 1 ? "var(--paper)" : "var(--steel)"}
            strokeWidth="1.5"
            strokeDasharray={step >= 1 ? "0" : "7 6"}
            style={{ transition: "fill 600ms linear, stroke 500ms linear" }}
          />
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={emitter.x + 14 + i * 20}
              y1={emitter.y + 8}
              x2={emitter.x + 14 + i * 20}
              y2={emitter.y + 40}
              stroke="var(--steel-dim)"
              strokeWidth="1"
              opacity={drawn(2)}
              style={{ transition: "opacity 600ms linear" }}
            />
          ))}
          <text
            x={emitter.x + 44}
            y={emitter.y - 8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="13"
            fill="var(--steel-dim)"
            letterSpacing="1"
          >
            {emitter.label}
          </text>
        </g>
      ))}

      {/* Priced schedule panel — appears at stage 02 */}
      <g style={{ opacity: drawn(1), transition: "opacity 600ms var(--ease-mech)" }}>
        <rect x="96" y="330" width="248" height="58" fill="var(--ink)" stroke="var(--border-hairline-dark)" strokeWidth="1" />
        <text x="108" y="350" fontFamily="var(--font-mono)" fontSize="13" fill="var(--copper-bright)" letterSpacing="1">
          {commercial ? "SCHEDULE OF RATES" : "FIXED PRICE"}
        </text>
        <text x="108" y="370" fontFamily="var(--font-mono)" fontSize="13" fill="var(--paper)" letterSpacing="1">
          {commercial ? "AGREED — PPM + REACTIVE" : "AGREED — PARTS, LABOUR, FLUSH"}
        </text>
        <text x="108" y="382" fontFamily="var(--font-mono)" fontSize="12" fill="var(--steel-dim)" letterSpacing="1">
          {step >= 3 ? "LOCKED · WORK COMPLETE" : "LOCKED · DOES NOT MOVE"}
        </text>
      </g>

      {/* Certificate stamp — handover */}
      <g style={{ opacity: drawn(3), transition: "opacity 700ms var(--ease-mech)" }}>
        <rect
          x="470"
          y="382"
          width="180"
          height="44"
          fill="none"
          stroke="var(--flame-glow)"
          strokeWidth="1.5"
          transform="rotate(-3 560 404)"
        />
        <text
          x="560"
          y="400"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="14"
          fill="var(--flame-glow)"
          letterSpacing="1.5"
          transform="rotate(-3 560 404)"
        >
          {commercial ? "CERTIFICATES" : "BENCHMARK"}
        </text>
        <text
          x="560"
          y="416"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="12"
          fill="var(--steel-dim)"
          letterSpacing="1.5"
          transform="rotate(-3 560 404)"
        >
          {commercial ? "ISSUED ON COMPLETION" : "COMPLETED & REGISTERED"}
        </text>
      </g>
    </svg>
  );
}
