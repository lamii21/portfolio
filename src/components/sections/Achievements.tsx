"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { staggerContainer, staggerChild, ease, accordionTransition } from "@/lib/motion";

// ─────────────────────────────────────────────────────────────────────────────
// All metrics are real, sourced directly from project descriptions.
// ─────────────────────────────────────────────────────────────────────────────

const METRICS = [
  {
    value: "8h → 4min",
    label: "BOM Processing Time",
    context: "Yazaki Internship",
    detail: "Python automation script reduced the weekly BOM processing cycle from ~8 hours of manual Excel work to under 4 minutes. Domain knowledge before automation.",
    accent: true,
  },
  {
    value: "4 months",
    label: "Solo Full-Stack Build",
    context: "HandyMath",
    detail: "Designed the schema, built the Django REST API, built the React frontend, deployed — alone. The only way to understand every layer is to build every layer.",
    accent: false,
  },
  {
    value: "0",
    label: "Manual Steps in Pipeline",
    context: "FlowForge ETL",
    detail: "Ingest → transform → expose. Every step automated. The FastAPI layer makes the output queryable by any downstream tool without human intervention.",
    accent: false,
  },
  {
    value: "6",
    label: "Projects Shipped",
    context: "2023 – 2024",
    detail: "HandyMath, FlowForge, Darlbanat, Nacim², Yazaki automation, FinTech Predict. Each one crossed the full stack: schema, API, interface, deployment.",
    accent: false,
  },
  {
    value: "5",
    label: "Languages / Runtimes",
    context: "Production use",
    detail: "Python, TypeScript, C#, SQL, JavaScript — each used in at least one shipped project. Not for breadth as a signal, but because the problem dictated the tool.",
    accent: false,
  },
  {
    value: "1",
    label: "Internship",
    context: "Industrial sector",
    detail: "Yazaki — a global automotive wire-harness manufacturer. Real domain, real constraints, real stakeholders. The script had to handle every edge case in the file format.",
    accent: false,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────

export function Achievements() {
  const reduced = useReducedMotion();

  return (
    <section
      id="achievements"
      aria-label="Achievements and metrics"
      className="py-[var(--section-py)] relative overflow-hidden"
      style={{ background: "var(--srf-0)" }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(183,110,121,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)]">

        <SectionLabel label="Achievements" />

        <div className="mb-12">
          <SplitText
            as="h2"
            className="font-serif italic text-foreground"
            style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)", lineHeight: 1.2 }}
            delay={0.05}
            wordStagger={0.06}
            amount={0.4}
          >
            Numbers that came from real work.
          </SplitText>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {METRICS.map((m) => (
            <AchievementCard key={m.label} metric={m} reduced={!!reduced} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface AchievementCardProps {
  metric: (typeof METRICS)[number];
  reduced: boolean;
}

function AchievementCard({ metric, reduced }: AchievementCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={staggerChild}
      className="relative rounded-2xl p-6 border transition-all duration-400 cursor-default group overflow-hidden"
      style={{
        background: metric.accent
          ? "linear-gradient(135deg, rgba(183,110,121,0.08) 0%, rgba(183,110,121,0.03) 100%)"
          : "var(--srf-1)",
        borderColor: metric.accent ? "rgba(183,110,121,0.24)" : "var(--brd)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={reduced ? {} : { y: -4 }}
      transition={{ duration: 0.3, ease: ease.out }}
    >
      {/* Accent glow on hover */}
      {metric.accent && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-400"
          style={{
            background: "radial-gradient(ellipse at center, rgba(183,110,121,0.10) 0%, transparent 70%)",
            opacity: hovered ? 1 : 0,
          }}
        />
      )}

      {/* Context tag */}
      <span
        className="inline-block text-[10px] uppercase tracking-[0.16em] font-medium px-2.5 py-0.5 rounded-full mb-4"
        style={{
          background: metric.accent ? "rgba(183,110,121,0.12)" : "rgba(183,110,121,0.06)",
          color: "var(--acc)",
        }}
      >
        {metric.context}
      </span>

      {/* Big metric value */}
      <div
        className="font-serif italic leading-none mb-2"
        style={{
          fontSize: "clamp(2rem, 4vw, 3rem)",
          color: metric.accent ? "var(--acc)" : "var(--txt)",
          letterSpacing: "-0.03em",
        }}
      >
        {metric.value}
      </div>

      {/* Label */}
      <p
        className="font-medium mb-3"
        style={{ fontSize: "clamp(0.875rem, 1.3vw, 1rem)", color: "var(--txt)" }}
      >
        {metric.label}
      </p>

      {/* Detail — reveals smoothly on hover; always visible with reduced motion */}
      <AnimatePresence initial={false}>
        {(hovered || reduced) && (
          <motion.p
            key="detail"
            className="font-light leading-[1.75]"
            style={{ overflow: "hidden", fontSize: "0.8125rem", color: "var(--txt-muted)" }}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? {} : { height: 0, opacity: 0 }}
            transition={accordionTransition}
          >
            {metric.detail}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
