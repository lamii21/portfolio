"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import {
  staggerContainer,
  ease,
  duration,
  viewportEarly,
} from "@/lib/motion";

const PRINCIPLES = [
  {
    number: "01",
    title: "Systems, not layers.",
    body: "Frontend, backend, database — they're not separate jobs. I trace the user's request from the UI all the way down and back up. The architecture only makes sense when you've walked the whole path.",
  },
  {
    number: "02",
    title: "Read before you write.",
    body: "Before touching any codebase, I read it. The patterns, the naming choices, the edge cases that never made it to the docs — they're in there. Writing before reading creates a second system that fights the first.",
  },
  {
    number: "03",
    title: "Debug the seam.",
    body: "When something breaks, I look at the integration boundary first. Not the component, not the function — the contract between them. Most failures happen where two things assumed different things about each other.",
  },
  {
    number: "04",
    title: "Ship, then improve.",
    body: "Working software with known limitations beats perfect architecture that doesn't exist yet. The real edge cases only appear in production. I ship early, measure honestly, and iterate with real data.",
  },
] as const;

// Per-row variants: clip wipes up from the bottom edge then y settles
const rowVariants = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0, y: 6 },
  visible: (i: number) => ({
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.deliberate,
      ease: ease.out,
      delay: i * 0.09,
    },
  }),
};

export function Approach() {
  const reduced = useReducedMotion();

  return (
    <section
      id="approach"
      aria-label="Engineering approach"
      className="py-[var(--section-py)]"
    >
      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)]">

        <SectionLabel label="Approach" asHeading />

        {/* Principles list */}
        <motion.div
          style={{ borderBottom: "1px solid var(--brd)" }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportEarly}
        >
          {PRINCIPLES.map(({ number, title, body }, i) => (
            <motion.div
              key={number}
              className="group relative flex items-start gap-6 lg:gap-8 py-10 lg:py-12 pl-0 transition-colors duration-300 hover:bg-[var(--srf-1)]"
              style={{ borderTop: "1px solid var(--brd)" }}
              variants={rowVariants}
              custom={i}
            >
              {/* Sliding accent bar — left edge, appears on hover */}
              <span
                className="absolute left-0 top-0 bottom-0 w-0.5 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ background: "var(--acc)" }}
                aria-hidden="true"
              />

              {/* Number — floats slightly upward on hover */}
              <motion.span
                className="shrink-0 font-serif italic leading-none select-none"
                style={{
                  fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)",
                  minWidth: "3.25rem",
                  marginTop: "0.2em",
                  color: "var(--txt-subtle)",
                }}
                whileHover={reduced ? {} : { y: -3, color: "var(--acc)" }}
                transition={{ duration: duration.base, ease: ease.out }}
                aria-hidden="true"
              >
                {number}
              </motion.span>

              {/* Title + Body */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(16rem,22rem)_1fr] gap-3 lg:gap-16">
                <h3
                  className="font-serif italic text-foreground leading-tight"
                  style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-muted-foreground leading-[1.82] font-light"
                  style={{ fontSize: "clamp(0.9375rem, 1.4vw, 1.0625rem)" }}
                >
                  {body}
                </p>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
