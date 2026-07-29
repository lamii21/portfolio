"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Compass, BrainCircuit, Code2 } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { staggerContainer, staggerChild, floatAnim, ease, duration, viewport } from "@/lib/motion";

// ─────────────────────────────────────────────────────────────────────────────
// Present-tense, honest, first-person.
// ─────────────────────────────────────────────────────────────────────────────

const FOCUS_ITEMS = [
  {
    icon: Compass,
    title: "First Engineering Role",
    label: "Active search · 2027",
    body: "Actively looking for a Software Engineer, Full-Stack, or Backend role. I respond to every message. What I'm looking for: a team that debates architecture decisions, reviews code carefully, and cares how the system is built — not just that it ships.",
    color: "#C97F89",
    primary: true,
  },
  {
    icon: BrainCircuit,
    title: "AI / ML Depth",
    label: "Ongoing · Deliberate",
    body: "I've already built an LSTM forecasting model and an automated ETL pipeline — from scratch. What I'm extending: MLOps patterns, LLM integration, and what running a model in production actually requires versus training one in a notebook.",
    color: "#82B4D4",
    primary: false,
  },
  {
    icon: Code2,
    title: "Systems Thinking",
    label: "Through every project",
    body: "Every project I've shipped forced a systems decision — schema design, API contracts, pipeline layers. My current gap is the infrastructure layer above that: distributed systems, container orchestration, production observability. I've read about it. I want to build it.",
    color: "#6BA878",
    primary: false,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────

export function CurrentFocus() {
  const reduced = useReducedMotion();

  return (
    <section
      id="focus"
      aria-label="Current focus"
      className="py-[var(--section-py)] relative overflow-hidden"
    >
      {/* Pulsing ambient orb */}
      <motion.div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10"
        style={{
          width: "min(700px, 90vw)",
          height: "min(700px, 90vw)",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(183,110,121,0.04) 0%, transparent 68%)",
          filter: "blur(60px)",
        }}
        animate={reduced ? {} : floatAnim(20, 12)}
      />

      {/* Decorative ring */}
      <motion.div
        aria-hidden="true"
        className="absolute right-0 top-1/4 pointer-events-none -z-10 hidden lg:block"
        style={{
          width: 280,
          height: 280,
          borderRadius: "50%",
          border: "1px solid rgba(183,110,121,0.07)",
          transform: "translate(40%, 0)",
        }}
        animate={reduced ? {} : floatAnim(12, 10, 2)}
      />

      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)]">

        <SectionLabel label="Current Focus" />

        {/* Editorial statement */}
        <div className="mb-14 max-w-2xl">
          <SplitText
            as="h2"
            className="font-serif italic text-foreground"
            style={{
              fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
              lineHeight: 1.22,
              letterSpacing: "-0.02em",
            }}
            delay={0.05}
            wordStagger={0.055}
            amount={0.3}
          >
            Where my attention is right now.
          </SplitText>
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {FOCUS_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={staggerChild}
                className="group relative rounded-2xl p-7 border transition-all duration-300"
                style={{
                  background: item.primary
                    ? `linear-gradient(135deg, ${item.color}0D 0%, ${item.color}05 100%)`
                    : "var(--srf-1)",
                  borderColor: item.primary ? item.color + "36" : "var(--brd)",
                }}
                whileHover={reduced ? {} : {
                  y: -5,
                  borderColor: item.color + "55",
                }}
                transition={{ duration: 0.3, ease: ease.out }}
              >
                {/* Icon */}
                <motion.div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: item.color + "14", color: item.color }}
                  whileHover={reduced ? {} : { rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <Icon size={20} strokeWidth={1.75} />
                </motion.div>

                {/* Label */}
                <span
                  className="block text-[10px] uppercase tracking-[0.18em] font-medium mb-2"
                  style={{ color: item.color }}
                >
                  {item.label}
                </span>

                {/* Title */}
                <h3
                  className="font-serif text-foreground mb-3"
                  style={{ fontSize: "clamp(1.05rem, 1.7vw, 1.25rem)" }}
                >
                  {item.title}
                </h3>

                {/* Body */}
                <p
                  className="font-light leading-[1.78]"
                  style={{ fontSize: "0.875rem", color: "var(--txt-muted)" }}
                >
                  {item.body}
                </p>

                {/* Accent bar — slides in on hover */}
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 rounded-b-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ background: item.color }}
                  aria-hidden="true"
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Availability note */}
        <motion.div
          className="mt-12 flex items-center gap-4"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: duration.slow, ease: ease.out }}
          viewport={viewport}
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span
              className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full opacity-70"
              style={{ background: "rgb(34,197,94)" }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: "rgb(34,197,94)" }}
            />
          </span>
          <p
            className="text-sm font-light"
            style={{ color: "var(--txt-muted)" }}
          >
            Available from 2027 · On-site, remote, or hybrid · Responds to every message
          </p>
        </motion.div>

      </div>
    </section>
  );
}
