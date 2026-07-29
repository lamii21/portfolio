"use client";

/**
 * Reveal — scroll-triggered entrance wrapper.
 *
 * Wraps any content in a motion.div that animates when it enters the viewport.
 * Respects prefers-reduced-motion: when reduced is true, element is instantly
 * visible without any animation.
 *
 * Usage:
 *   <Reveal>...</Reveal>                          // fadeUp, 0 delay
 *   <Reveal variant="fadeLeft" delay={0.15}>...</Reveal>
 *   <Reveal variant="scaleIn" amount={0.3}>...</Reveal>
 */

import { motion, useReducedMotion } from "framer-motion";
import {
  fadeUp, fadeIn, fadeLeft, fadeRight, scaleIn, clipReveal, wipeIn,
  viewport,
} from "@/lib/motion";
import type { ReactNode, CSSProperties } from "react";

export type RevealVariant =
  | "fadeUp"
  | "fadeIn"
  | "fadeLeft"
  | "fadeRight"
  | "scaleIn"
  | "clipReveal"
  | "wipeIn";

const VARIANTS = { fadeUp, fadeIn, fadeLeft, fadeRight, scaleIn, clipReveal, wipeIn } as const;

interface RevealProps {
  children: ReactNode;
  /** Which entrance animation to use. Default: fadeUp. */
  variant?: RevealVariant;
  /** Delay in seconds before the animation starts. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  /** Fraction of element visible before triggering. Default: 0.15. */
  amount?: number;
  /** Whether the animation fires only once. Default: true. */
  once?: boolean;
}

export function Reveal({
  children,
  variant = "fadeUp",
  delay = 0,
  className,
  style,
  amount = viewport.amount,
  once = viewport.once,
}: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      variants={VARIANTS[variant]}
      custom={delay}
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}
