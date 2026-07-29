"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Route-level animation wrapper.
 * Unlike layout.tsx (persists), template.tsx re-mounts on every navigation —
 * triggering the entrance animation on every route change.
 *
 * Entrance: y: 18 → 0, opacity: 0 → 1, blur: 3px → 0.
 * This matches the CSS ::view-transition-new(root) animation in globals.css.
 * On browsers without View Transitions support, this JS animation fires.
 * On browsers with View Transitions, the CSS takes priority.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(3px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
