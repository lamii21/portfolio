"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SectionLabelProps {
  label: string;
  /** Extra Tailwind classes for the wrapper. Default bottom margin matches section rhythm. */
  className?: string;
  /**
   * When true, renders a visually-hidden <h2> for screen-reader heading navigation.
   * Use when the section has no other explicit heading element.
   */
  asHeading?: boolean;
}

export function SectionLabel({ label, className = "mb-16 lg:mb-20", asHeading = false }: SectionLabelProps) {
  const reduced = useReducedMotion();

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {asHeading && <h2 className="sr-only">{label}</h2>}
      <motion.span
        className="text-[var(--text-overline)] uppercase tracking-[0.22em] text-accent font-medium shrink-0"
        initial={reduced ? false : { opacity: 0, x: -14 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.5 }}
      >
        {label}
      </motion.span>

      <motion.div
        className="flex-1 h-px origin-left"
        style={{ background: "var(--brd)" }}
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        viewport={{ once: true, amount: 0.5 }}
      />
    </div>
  );
}
