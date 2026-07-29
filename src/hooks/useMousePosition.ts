"use client";

import { useEffect } from "react";
import { useMotionValue } from "framer-motion";

/**
 * Global mouse position as Framer Motion MotionValues.
 * Values are viewport-relative pixels. Updated via passive mousemove.
 * Use with useSpring/useTransform for GPU-composited effects.
 */
export function useMousePosition() {
  const x = useMotionValue(
    typeof window !== "undefined" ? window.innerWidth  / 2 : 0
  );
  const y = useMotionValue(
    typeof window !== "undefined" ? window.innerHeight / 2 : 0
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return { x, y };
}
