"use client";

/**
 * Float — ambient looping float for decorative elements.
 *
 * Translates the element vertically in a smooth infinite loop.
 * Stops completely when prefers-reduced-motion is enabled.
 *
 * Usage:
 *   <Float amplitude={14} duration={7} delay={0}>
 *     <span>decorative element</span>
 *   </Float>
 */

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface FloatProps {
  children: ReactNode;
  /** Pixel distance to travel upward. Default: 14. */
  amplitude?: number;
  /** Full cycle duration in seconds. Default: 6. */
  duration?: number;
  /** Initial delay before the loop starts. Default: 0. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

export function Float({
  children,
  amplitude = 14,
  duration = 6,
  delay = 0,
  className,
  style,
}: FloatProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      animate={reduced ? {} : { y: [0, -amplitude, 0] }}
      transition={{
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
