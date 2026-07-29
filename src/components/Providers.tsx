"use client";

import dynamic from "next/dynamic";
import { CursorProvider } from "@/hooks/useCursorContext";
import { Cursor }      from "@/components/ui/Cursor";
import { MouseLight }  from "@/components/ui/MouseLight";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// WebGL ambient canvas — lazy-loaded so it never blocks the critical path
const WebGLCanvas = dynamic(
  () => import("@/components/WebGLCanvas").then(m => m.WebGLCanvas),
  { ssr: false }
);

/**
 * Global client-side provider wrapper.
 *
 * Layer stack (z-index, low → high):
 *   9983  WebGL ambient noise canvas (very subtle overlay)
 *   9985  MouseLight spotlight (radial gradient tracking cursor)
 *   9997  Portrait outer ring (cursor extra layer)
 *   9998  Grain texture (CSS body::before)
 *   9999  Cursor dot
 *
 * Page entry fade (0.35s) fires once on initial hydration.
 * Per-route transitions are handled by template.tsx.
 */
export function Providers({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <CursorProvider>
      {/* ── Fixed global effects (pointer-events: none) ─── */}
      <Cursor />
      <MouseLight />
      <WebGLCanvas />

      {/* ── Initial hydration fade — fires once ───────────── */}
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
