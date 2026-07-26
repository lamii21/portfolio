"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FlaskConical, ExternalLink, ChevronRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { staggerContainer, staggerChild, ease, duration, viewport } from "@/lib/motion";

// ─────────────────────────────────────────────────────────────────────────────
// Labs = smaller experiments, prototypes, explorations — honestly framed.
// These are adjacent to the main projects, or sub-experiments within them.
// ─────────────────────────────────────────────────────────────────────────────

const EXPERIMENTS = [
  {
    id: "sql-schema",
    tag: "Database",
    title: "Schema-first design",
    status: "Pattern",
    body: "Every project starts with a relational diagram. Not an ORM model — an actual ER diagram that answers: what are the entities, what are the relationships, and what queries need to be fast? Built this discipline by watching what happened when I skipped it (HandyMath v1 schema rebuild).",
    tech: ["PostgreSQL", "Entity Relationship", "Normalization"],
    color: "#D4A76A",
  },
  {
    id: "api-first",
    tag: "Architecture",
    title: "API contract before code",
    status: "Pattern",
    body: "I define the REST contract — endpoints, request/response shapes, status codes — before writing a single controller. Then I test the API surface before building the client. The client should never be surprised by what the API can give it.",
    tech: ["Postman", "OpenAPI", "REST"],
    color: "#82B4D4",
  },
  {
    id: "bom-edge-cases",
    tag: "Automation",
    title: "Defensive BOM parsing",
    status: "Shipped",
    body: "The Yazaki BOM parser broke on edge cases in the Excel formatting during v1. The fix was to enumerate every variant of the file structure I'd seen, then write a parser that handled all of them defensively. v2 processed every file format without exception.",
    tech: ["openpyxl", "Python", "Defensive parsing"],
    color: "#C97F89",
  },
  {
    id: "lstm-window",
    tag: "ML",
    title: "LSTM sequence window sizing",
    status: "Explored",
    body: "The window size in LSTM sequence preparation is a design decision, not a hyperparameter to tune blindly. Too short: no long-range dependency capture. Too long: noisy. Explored this systematically in FinTech Predict before settling on 60 timesteps.",
    tech: ["Keras", "NumPy", "Time Series"],
    color: "#6BA878",
  },
  {
    id: "next-ssr",
    tag: "Frontend",
    title: "SSR vs CSR tradeoffs",
    status: "Applied",
    body: "Nacim² property listings need SSR for initial load performance and SEO — server renders the full listing page. Client manages filter state without extra API calls. Learned: SSR is a tool for specific situations, not a default mode.",
    tech: ["Next.js", "React", "Server Components"],
    color: "#B49BD4",
  },
  {
    id: "pipeline-layers",
    tag: "Data",
    title: "Pipeline layer validation",
    status: "Pattern",
    body: "In FlowForge, I validate each pipeline layer against the previous before building the next one: transformation validated against raw input, API output validated against transformation. The anti-pattern is skipping validation between layers and debugging at the surface.",
    tech: ["Pandas", "FastAPI", "SQLAlchemy"],
    color: "#C97F89",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────

export function Labs() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const reduced = useReducedMotion();

  return (
    <section
      id="labs"
      aria-label="Labs and experiments"
      className="py-[var(--section-py)] relative"
      style={{ background: "var(--srf-1)" }}
    >
      {/* Monospace grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(var(--txt) 1px, transparent 1px), linear-gradient(90deg, var(--txt) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)] relative z-10">

        <div className="flex items-start justify-between mb-5 flex-wrap gap-4">
          <SectionLabel label="Labs" className="mb-0 flex-1" asHeading />
          <span
            className="text-[11px] uppercase tracking-[0.16em] font-medium px-3 py-1.5 rounded-full border"
            style={{
              color: "var(--txt-subtle)",
              borderColor: "var(--brd)",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            Patterns · Experiments · Techniques
          </span>
        </div>

        <motion.p
          className="font-serif italic mb-12"
          style={{
            fontSize: "clamp(1rem, 1.5vw, 1.1rem)",
            color: "var(--txt-muted)",
            lineHeight: 1.65,
          }}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, ease: ease.out }}
          viewport={viewport}
        >
          Things I've tested, patterns I've developed, and design decisions I've documented
          while building the six projects above.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {EXPERIMENTS.map((exp) => (
            <motion.button
              key={exp.id}
              variants={staggerChild}
              onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
              className="text-left rounded-xl border p-5 transition-all duration-300 group"
              style={{
                background: expanded === exp.id ? exp.color + "0A" : "var(--srf-0)",
                borderColor: expanded === exp.id ? exp.color + "38" : "var(--brd)",
              }}
              whileHover={reduced ? {} : { y: -2 }}
              aria-expanded={expanded === exp.id}
              aria-controls={`lab-panel-${exp.id}`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span
                    className="inline-block text-[10px] uppercase tracking-[0.14em] font-medium px-2 py-0.5 rounded-full mb-2"
                    style={{
                      background: exp.color + "14",
                      color: exp.color,
                      fontFamily: "ui-monospace, monospace",
                    }}
                  >
                    {exp.tag}
                  </span>
                  <h3
                    className="font-serif text-foreground leading-tight"
                    style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)" }}
                  >
                    {exp.title}
                  </h3>
                </div>
                <motion.span
                  animate={reduced ? {} : { rotate: expanded === exp.id ? 90 : 0 }}
                  transition={{ duration: 0.25, ease: ease.out }}
                  style={{ color: "var(--txt-subtle)", flexShrink: 0, marginTop: 2 }}
                >
                  <ChevronRight size={14} />
                </motion.span>
              </div>

              {/* Expanded body */}
              <AnimatePresence initial={false}>
                {expanded === exp.id && (
                  <motion.div
                    id={`lab-panel-${exp.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: ease.out }}
                    style={{ overflow: "hidden" }}
                  >
                    <p
                      className="font-light leading-[1.75] mb-4"
                      style={{
                        fontSize: "clamp(0.8rem, 1.1vw, 0.85rem)",
                        color: "var(--txt-muted)",
                      }}
                    >
                      {exp.body}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-md border"
                          style={{
                            fontFamily: "ui-monospace, monospace",
                            color: "var(--txt-subtle)",
                            borderColor: "var(--brd)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status chip */}
              {expanded !== exp.id && (
                <span
                  className="text-[10px] uppercase tracking-[0.12em] font-medium"
                  style={{ color: "var(--txt-subtle)", fontFamily: "ui-monospace, monospace" }}
                >
                  {exp.status}
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
