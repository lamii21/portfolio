"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Type, Layers, Zap, Smartphone, Eye } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { staggerContainer, staggerChild, ease, duration, viewport, accordionTransition } from "@/lib/motion";

// ─────────────────────────────────────────────────────────────────────────────
// "The Interface Layer" — how I approach UI/UX within full-stack work.
// Not claiming to be a designer. Claiming to think deliberately about the
// interface, because I'm the one who built both sides of it.
// ─────────────────────────────────────────────────────────────────────────────

const PRINCIPLES = [
  {
    icon: Layers,
    title: "Schema shapes the interface.",
    num: "01",
    body: "The data model determines what the UI can ask for. I design the schema first, which means the interface is never reaching for data that doesn't exist — and never hiding data the schema could express.",
    example: "Darlbanat: the order-status field in the SQL schema became the status badge in the interface, not the other way around.",
    color: "#82B4D4",
  },
  {
    icon: Type,
    title: "Typography does the work.",
    num: "02",
    body: "Hierarchy in a UI should come from type scale and weight, not from decorative elements. If you need icons, borders, and color to communicate hierarchy, the type isn't doing its job.",
    example: "This portfolio: two typefaces (Playfair Display + Inter), a strict scale from CSS custom properties, no decorative headlines.",
    color: "#C97F89",
  },
  {
    icon: Zap,
    title: "Animation has a reason.",
    num: "03",
    body: "Every animation in this portfolio has a purpose: reveal (showing content entering), feedback (showing state change), or atmosphere (adding depth without adding noise). If I can't state the reason, the animation gets removed.",
    example: "The scroll-driven timeline line in How I Think: it tracks reading progress. The magnetic buttons: they signal interactivity before the user clicks.",
    color: "#6BA878",
  },
  {
    icon: Smartphone,
    title: "Mobile is the constraint.",
    num: "04",
    body: "I design for mobile first — not because desktop doesn't matter, but because mobile constraints produce better layouts. If something works at 320px, it works at 1440px. The reverse is rarely true.",
    example: "Nacim²: the property grid redesigned on mobile first, then expanded to desktop. The filter panel had to collapse gracefully on small screens before it could be elegant on large ones.",
    color: "#D4A76A",
  },
  {
    icon: Eye,
    title: "Honest empty states.",
    num: "05",
    body: "An interface that pretends nothing can go wrong is worse than one that tells you what's missing. Empty states, loading states, and error states are part of the design — not afterthoughts.",
    example: "HandyMath: the exercise list shows a genuine empty state with context when a student has no progress yet — not a spinner that never resolves.",
    color: "#B49BD4",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────

export function DesignProcess() {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();

  return (
    <section
      id="craft"
      aria-label="Interface design process"
      className="py-[var(--section-py)] relative overflow-hidden"
    >
      {/* Subtle warm gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 50% 70% at 0% 50%, rgba(183,110,121,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)]">

        <SectionLabel label="Design Process" />

        {/* Intro */}
        <div className="mb-16 max-w-2xl">
          <SplitText
            as="h2"
            className="font-serif italic text-foreground mb-5"
            style={{
              fontSize: "clamp(1.45rem, 2.8vw, 2.2rem)",
              lineHeight: 1.22,
              letterSpacing: "-0.02em",
            }}
            delay={0.05}
            wordStagger={0.05}
            amount={0.3}
          >
            How I think about the interface.
          </SplitText>
          <motion.p
            className="font-light leading-[1.82]"
            style={{ fontSize: "clamp(0.9375rem, 1.4vw, 1.0625rem)", color: "var(--txt-muted)" }}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: duration.slow, ease: ease.out }}
            viewport={viewport}
          >
            I'm not a designer. I'm a software engineer who builds the interface because I built
            the API it talks to. These are the principles that keep it honest.
          </motion.p>
        </div>

        {/* Principles */}
        <motion.div
          className="space-y-0"
          style={{ borderBottom: "1px solid var(--brd)" }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            const isOpen = active === p.num;

            return (
              <motion.div
                key={p.num}
                variants={staggerChild}
                className="group"
                style={{ borderTop: "1px solid var(--brd)" }}
              >
                <button
                  className="w-full text-left flex items-start gap-6 py-8 lg:py-10 transition-colors duration-300 hover:bg-[var(--srf-1)]"
                  onClick={() => setActive(isOpen ? null : p.num)}
                  aria-expanded={isOpen}
                  aria-controls={`design-principle-${p.num}`}
                >
                  {/* Left accent bar */}
                  <span
                    className="absolute left-0 top-0 bottom-0 w-0.5 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ background: p.color }}
                    aria-hidden="true"
                  />

                  {/* Number */}
                  <span
                    className="shrink-0 font-mono text-xs font-medium mt-1"
                    style={{ color: "var(--txt-subtle)", minWidth: "2rem" }}
                  >
                    {p.num}
                  </span>

                  {/* Icon */}
                  <div
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300"
                    style={{
                      background: isOpen ? p.color + "1A" : "transparent",
                      color: isOpen ? p.color : "var(--txt-subtle)",
                    }}
                  >
                    <Icon size={16} strokeWidth={1.75} />
                  </div>

                  {/* Title */}
                  <h3
                    className="flex-1 font-serif italic text-foreground leading-tight"
                    style={{ fontSize: "clamp(1.05rem, 1.8vw, 1.35rem)" }}
                  >
                    {p.title}
                  </h3>

                  {/* Chevron */}
                  <motion.span
                    animate={reduced ? {} : { rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.25, ease: ease.out }}
                    className="shrink-0 mt-1"
                    style={{ color: "var(--txt-subtle)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.span>
                </button>

                {/* Expanded detail */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                  <motion.div
                    id={`design-principle-${p.num}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={accordionTransition}
                    style={{ overflow: "hidden" }}
                  >
                  <div
                    className="pr-8 pb-8 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6"
                    style={{ paddingLeft: "calc(2rem + 2rem + 2.5rem + 1.5rem)" }}
                  >
                    <p
                      className="font-light leading-[1.78]"
                      style={{ fontSize: "clamp(0.875rem, 1.3vw, 0.9375rem)", color: "var(--txt-muted)" }}
                    >
                      {p.body}
                    </p>
                    <aside
                      className="pl-4 py-3"
                      style={{ borderLeft: `2px solid ${p.color}55` }}
                    >
                      <p
                        className="uppercase tracking-[0.18em] font-medium mb-1.5"
                        style={{ fontSize: "8.5px", color: p.color }}
                      >
                        In practice
                      </p>
                      <p
                        className="font-serif italic font-light leading-[1.7]"
                        style={{ fontSize: "0.8125rem", color: "var(--txt-muted)" }}
                      >
                        {p.example}
                      </p>
                    </aside>
                  </div>
                  </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
