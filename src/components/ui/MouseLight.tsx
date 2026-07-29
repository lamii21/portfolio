"use client";

import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useEffect, useState } from "react";

/**
 * Global mouse spotlight — the signature ambient effect of Linear, Apple, Stripe.
 *
 * Two concentric radial gradients track the cursor with spring lag:
 *   Outer (800px): warm accent glow — very subtle, creates an atmospheric "warmth"
 *   Inner (320px): tighter hot point — follows slightly faster, adds depth
 *
 * Rendered only on pointer-capable (non-touch) devices.
 * All transforms are on the GPU compositor — no layout triggered.
 * z-index sits between page content and grain overlay.
 */
export function MouseLight() {
  const reduced = useReducedMotion();
  const { x, y } = useMousePosition();
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    setIsPointer(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }, []);

  // Outer spotlight — slow, atmospheric spring
  const outerX = useSpring(x, { stiffness: 55, damping: 28, mass: 0.6 });
  const outerY = useSpring(y, { stiffness: 55, damping: 28, mass: 0.6 });

  // Inner hot point — snappier spring
  const innerX = useSpring(x, { stiffness: 120, damping: 30, mass: 0.4 });
  const innerY = useSpring(y, { stiffness: 120, damping: 30, mass: 0.4 });

  // Centre-offset transforms (keep cursor at gradient centre)
  const ox = useTransform(outerX, v => v - 400);
  const oy = useTransform(outerY, v => v - 400);
  const ix = useTransform(innerX, v => v - 160);
  const iy = useTransform(innerY, v => v - 160);

  if (!isPointer || reduced) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9985,
        overflow: "hidden",
      }}
    >
      {/* Outer warm spotlight */}
      <motion.div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          x: ox,
          y: oy,
          background:
            "radial-gradient(circle at center, rgba(183,110,121,0.058) 0%, rgba(183,110,121,0.022) 40%, transparent 70%)",
          willChange: "transform",
          mixBlendMode: "normal",
        }}
      />
      {/* Inner hot point — tighter, slightly more opaque */}
      <motion.div
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          x: ix,
          y: iy,
          background:
            "radial-gradient(circle at center, rgba(183,110,121,0.045) 0%, transparent 65%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
