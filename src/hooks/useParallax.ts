"use client";

import { useRef } from "react";
import {
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";

/**
 * Scroll-driven parallax hook.
 * Attach `ref` to the scroll container (the section or a wrapper div).
 * `y` is a spring-smoothed MotionValue you can pass to `style={{ y }}`.
 *
 * @param factor - displacement factor. 0.15 = subtle; 0.35 = dramatic.
 *                 Positive → element moves DOWN as user scrolls down (feels closer).
 *                 Negative → element moves UP (feels further away, layered behind).
 */
export function useParallax(
  factor = 0.18
): { ref: React.RefObject<HTMLDivElement | null>; y: MotionValue<string> } {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yRaw = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `${factor * 100}%`]
  );

  const y = useSpring(yRaw, { stiffness: 45, damping: 18, restDelta: 0.001 });

  return { ref, y };
}
