"use client";

import { CursorProvider } from "@/hooks/useCursorContext";
import { Cursor } from "@/components/ui/Cursor";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Client-side provider wrapper.
 *
 * Adds a subtle page-entry fade (0.35s) that fires once on initial load.
 * The duration is short enough to not conflict with the Hero GSAP timeline
 * (which begins at delay: 0.2s), but eliminates the hard flash on hydration.
 */
export function Providers({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <CursorProvider>
      {/* Global fixed UI — pointer-events: none, z-index 9997–9999 */}
      <Cursor />

      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </CursorProvider>
  );
}
