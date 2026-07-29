"use client";

import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  Target,
  Search,
  Layers,
  Zap,
  Hammer,
  Rocket,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ease, duration, stagger, spring, viewportEarly, accordionTransition } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

// ── Step data ──────────────────────────────────────────────────────────────────
// All examples are drawn from real projects — nothing invented.

const STEPS = [
  {
    id:    "problem",
    num:   "01",
    label: "Problem",
    Icon:  Target,
    short: "State the real constraint, not the symptom on the surface.",
    detail:
      "I don't open an editor until the problem fits in one sentence — not 'users want X' but 'the system can't do Y without Z breaking.' That sentence changes everything downstream: what to build, in what order, and what to leave out.",
    example:
      "HandyMath: the problem wasn't 'students need exercises.' It was 'progress state has no native place in the data model.' One sentence. Different schema, different interface.",
  },
  {
    id:    "research",
    num:   "02",
    label: "Research",
    Icon:  Search,
    short: "Understand the domain before choosing the technology.",
    detail:
      "Every system lives inside a domain with its own vocabulary, constraints, and failure modes. Reading domain documentation before technical documentation consistently saves weeks of building the wrong thing correctly.",
    example:
      "Yazaki: two days studying BOM manufacturing logic before writing any Python. The automation that came out of it handled edge cases no one had documented — because I'd read the domain, not just the library docs.",
  },
  {
    id:    "architecture",
    num:   "03",
    label: "Architecture",
    Icon:  Layers,
    short: "Design the data model. The schema is the real design document.",
    detail:
      "If the schema is wrong, the API is wrong, and the UI is wrong. I design the database structure before sketching any interface — the entities, their relationships, and the queries the application will need to run efficiently.",
    example:
      "Darlbanat: modeled orders, inventory, and reports in SQL before writing a single endpoint. The interface emerged from what the schema could express — not from what the client originally sketched on paper.",
  },
  {
    id:    "prototype",
    num:   "04",
    label: "Prototype",
    Icon:  Zap,
    short: "Build the riskiest assumption first, not the easiest feature.",
    detail:
      "A prototype isn't a minimal version of the app — it's a test of a specific uncertainty. I identify the assumption most likely to invalidate the whole design, and I build that one first to know what I'm actually dealing with.",
    example:
      "FlowForge ETL: I built the transformation layer before ingestion or the API. If pandas couldn't handle the industrial dataset's edge cases cleanly, nothing else in the pipeline would have mattered.",
  },
  {
    id:    "build",
    num:   "05",
    label: "Build",
    Icon:  Hammer,
    short: "Layer by layer. One clear responsibility per module.",
    detail:
      "I build from the data model outward: schema → ORM → API → client. Each layer depends only on the one below it. I validate each layer against real inputs before moving up — no skipping, no borrowing from layers that aren't ready.",
    example:
      "HandyMath: Django models → serializers → API views → React. I tested every endpoint against a REST client before writing a single hook. The frontend never had to guess what the API could give it.",
  },
  {
    id:    "deploy",
    num:   "06",
    label: "Deploy",
    Icon:  Rocket,
    short: "Ship something real. Staging is not production.",
    detail:
      "Deployment reveals assumptions you didn't know you were making. Configuration that runs locally fails in production for specific, learnable reasons. I deploy early and treat every production failure as information, not a setback.",
    example:
      "HandyMath's first deployment: a missing environment variable in the production config that didn't exist locally. Found it in 20 minutes, fixed permanently, documented. Wouldn't have found it any other way.",
  },
  {
    id:    "iterate",
    num:   "07",
    label: "Iterate",
    Icon:  RefreshCw,
    short: "Break version one and learn exactly what it couldn't handle.",
    detail:
      "The first version of anything is a hypothesis. I use it until it breaks, then I understand precisely why it broke. That understanding becomes version two — which is always cleaner. But only if you actually ran version one in a real environment.",
    example:
      "HandyMath v1 schema: rebuilt in week three because the original design had no place for progress state across sessions. The rebuild took two days and produced a significantly cleaner model. The honest mistake was worth it.",
  },
] as const;

type Step = typeof STEPS[number];

// ── Section ───────────────────────────────────────────────────────────────────

export function HowIThink() {
  const [active, setActive] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Scroll-driven line — grows from 0% to 100% as section passes through viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.88", "end 0.18"],
  });
  const rawH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const lineHeight = useSpring(rawH, spring.scrollLine);

  function toggle(id: string) {
    setActive((prev) => (prev === id ? null : id));
  }

  return (
    <section
      id="process"
      aria-label="How I think"
      className="py-[var(--section-py)] relative isolate"
    >
      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)]">

        {/* ── Section header ──────────────────────────────────────────────── */}
        <SectionLabel label="How I Think" className="mb-5" asHeading />

        {/* ── Section intro ────────────────────────────────────────────────── */}
        <motion.p
          className="font-serif italic mb-16 lg:mb-20"
          style={{ fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)", color: "var(--txt-muted)" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: duration.slow, ease: ease.out }}
          viewport={{ once: true, amount: 0.5 }}
        >
          Every solution I've shipped followed this sequence. Not always quickly, but always in this order.
        </motion.p>

        {/* ── Timeline ─────────────────────────────────────────────────────── */}
        <div ref={containerRef} className="relative">

          {/* Background static line */}
          <div
            className="absolute left-[0.75rem] lg:left-1/2 top-2 bottom-2 w-px -translate-x-1/2 pointer-events-none"
            style={{ background: "var(--brd)" }}
            aria-hidden="true"
          />

          {/* Animated accent overlay line */}
          {!prefersReduced && (
            <motion.div
              className="absolute left-[0.75rem] lg:left-1/2 top-2 w-px -translate-x-1/2 pointer-events-none origin-top"
              style={{
                height: lineHeight,
                background: "linear-gradient(to bottom, var(--acc), rgba(183,110,121,0.3))",
                boxShadow: "0 0 8px rgba(183,110,121,0.3)",
              }}
              aria-hidden="true"
            />
          )}

          {/* Steps */}
          <div className="space-y-0">
            {STEPS.map((step, i) => {
              const isLeft = i % 2 === 0;
              const isActive = active === step.id;

              return (
                <StepRow
                  key={step.id}
                  step={step}
                  index={i}
                  isLeft={isLeft}
                  isActive={isActive}
                  onToggle={() => toggle(step.id)}
                  prefersReduced={!!prefersReduced}
                />
              );
            })}
          </div>

        </div>

        {/* ── Bottom note ──────────────────────────────────────────────────── */}
        <motion.p
          className="mt-16 lg:mt-20 text-center font-serif italic"
          style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)", color: "var(--txt-subtle)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: duration.slow, ease: ease.out }}
          viewport={{ once: true, amount: 0.8 }}
        >
          Click any step to see how it played out in practice.
        </motion.p>

      </div>
    </section>
  );
}

// ── Step row ──────────────────────────────────────────────────────────────────
// Handles the alternating left/right layout.
//   Mobile (all screens below lg):  dot on left | card on right
//   Desktop (lg+):                  card left | dot center | card right (alternating)

interface StepRowProps {
  step: Step;
  index: number;
  isLeft: boolean;
  isActive: boolean;
  onToggle: () => void;
  prefersReduced: boolean;
}

function StepRow({
  step, index, isLeft, isActive, onToggle, prefersReduced,
}: StepRowProps) {
  return (
    <motion.div
      className="grid grid-cols-[1.5rem_1fr] lg:grid-cols-[1fr_4rem_1fr] pb-10 lg:pb-12"
      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * stagger.xs,
        duration: duration.slow,
        ease: ease.out,
      }}
      viewport={viewportEarly}
    >
      {/* ── Desktop LEFT column ──────────────────────────────────── */}
      <div className="hidden lg:flex items-start justify-end pr-8">
        {isLeft ? (
          <div className="w-full max-w-[432px]">
            <StepCard step={step} isActive={isActive} onToggle={onToggle} />
          </div>
        ) : (
          /* Empty spacer for odd steps */
          <div className="w-full" aria-hidden="true" />
        )}
      </div>

      {/* ── CENTER dot column ────────────────────────────────────── */}
      <div className="flex flex-col items-center pt-[0.35rem]">
        <StepDot step={step} isActive={isActive} />
      </div>

      {/* ── RIGHT column (desktop odd) / ALL cards on mobile ─────── */}
      <div className="pl-4 lg:pl-8 flex items-start">
        {/* Mobile: always show card in this column */}
        <div className="lg:hidden w-full">
          <StepCard step={step} isActive={isActive} onToggle={onToggle} />
        </div>
        {/* Desktop: only show here for odd steps */}
        {!isLeft && (
          <div className="hidden lg:flex w-full max-w-[432px]">
            <StepCard step={step} isActive={isActive} onToggle={onToggle} />
          </div>
        )}
        {/* Desktop: empty spacer for even steps */}
        {isLeft && (
          <div className="hidden lg:block w-full" aria-hidden="true" />
        )}
      </div>
    </motion.div>
  );
}

// ── Step dot ──────────────────────────────────────────────────────────────────

function StepDot({ step, isActive }: { step: Step; isActive: boolean }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 24, height: 24 }}>
      {/* Outer pulse ring — active only */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ border: "1.5px solid rgba(183,110,121,0.45)", inset: -5 }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.3, ease: ease.out }}
          />
        )}
      </AnimatePresence>

      {/* Dot */}
      <motion.div
        className="rounded-full flex items-center justify-center relative z-10"
        animate={{
          width:  isActive ? 20 : 12,
          height: isActive ? 20 : 12,
          background: isActive ? "var(--acc)" : "var(--srf-1)",
          borderColor: isActive ? "var(--acc)" : "rgba(183,110,121,0.4)",
          boxShadow: isActive
            ? "0 0 14px rgba(183,110,121,0.55), 0 0 4px rgba(183,110,121,0.4)"
            : "none",
        }}
        style={{ border: "1.5px solid rgba(183,110,121,0.4)" }}
        transition={{ duration: 0.25, ease: ease.out }}
      >
        {isActive && (
          <motion.div
            className="rounded-full"
            style={{ width: 5, height: 5, background: "#fff" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, ease: ease.gentle }}
          />
        )}
      </motion.div>
    </div>
  );
}

// ── Step card ─────────────────────────────────────────────────────────────────

interface StepCardProps {
  step: Step;
  isActive: boolean;
  onToggle: () => void;
}

function StepCard({ step, isActive, onToggle }: StepCardProps) {
  const { Icon } = step;

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className={cn(
        "card-gradient-border w-full text-left rounded-2xl",
        "transition-shadow duration-300",
      )}
      style={{
        padding: "1.25rem 1.375rem",
        boxShadow: isActive
          ? "0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(183,110,121,0.08)"
          : "none",
      }}
      whileHover={{ y: -3, transition: spring.snappy }}
      aria-expanded={isActive}
      aria-controls={`step-panel-${step.id}`}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 mb-3">
        {/* Icon badge */}
        <div
          className="flex items-center justify-center rounded-xl shrink-0"
          style={{
            width: 36,
            height: 36,
            background: isActive
              ? "rgba(183,110,121,0.15)"
              : "rgba(183,110,121,0.08)",
            color: "var(--acc)",
            transition: "background 0.25s",
          }}
        >
          <Icon size={15} strokeWidth={1.75} />
        </div>

        {/* Number + title + chevron */}
        <div className="flex-1 min-w-0 pt-[1px]">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span
              className="font-medium tabular-nums"
              style={{
                fontSize: "var(--text-overline)",
                color: isActive ? "var(--acc)" : "var(--txt-subtle)",
                transition: "color 0.25s",
              }}
            >
              {step.num}
            </span>
            <motion.span
              animate={{ rotate: isActive ? 180 : 0 }}
              transition={{ duration: 0.3, ease: ease.out }}
              style={{ color: "var(--txt-subtle)", display: "flex" }}
            >
              <ChevronDown size={13} strokeWidth={1.75} />
            </motion.span>
          </div>
          <h3
            className="font-serif text-foreground leading-tight"
            style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.2rem)" }}
          >
            {step.label}
          </h3>
        </div>
      </div>

      {/* ── Short description ──────────────────────────────────── */}
      <p
        className="font-light leading-relaxed"
        style={{
          fontSize: "clamp(0.8125rem, 1.2vw, 0.875rem)",
          color: "var(--txt-muted)",
        }}
      >
        {step.short}
      </p>

      {/* ── Expanded content ───────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            key="expanded"
            id={`step-panel-${step.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={accordionTransition}
            style={{ overflow: "hidden" }}
          >
            <div className="pt-4 mt-3" style={{ borderTop: "1px solid var(--brd)" }}>
              {/* Detail */}
              <p
                className="font-light leading-[1.78] mb-4"
                style={{
                  fontSize: "clamp(0.8125rem, 1.15vw, 0.875rem)",
                  color: "var(--txt-muted)",
                }}
              >
                {step.detail}
              </p>

              {/* Real example callout */}
              {step.example && (
                <div
                  className="rounded-lg pl-4 pr-3 py-3"
                  style={{
                    background: "rgba(183,110,121,0.04)",
                    borderLeft: "2px solid rgba(183,110,121,0.32)",
                  }}
                >
                  <p
                    className="uppercase tracking-[0.2em] font-medium text-accent mb-1.5"
                    style={{ fontSize: "8.5px" }}
                  >
                    From practice
                  </p>
                  <p
                    className="font-light leading-[1.72] font-serif italic"
                    style={{
                      fontSize: "clamp(0.8rem, 1.1vw, 0.85rem)",
                      color: "var(--txt-muted)",
                    }}
                  >
                    {step.example}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
