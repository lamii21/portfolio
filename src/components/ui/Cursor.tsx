"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useCursor } from "@/hooks/useCursorContext";
import { spring, ease } from "@/lib/motion";

/**
 * Orbit Cursor — the portfolio's signature interaction.
 *
 * Two elements:
 *   Dot  — 5px, accent color, follows cursor with near-instant response
 *   Ring — 22px, 1px accent border, trails the dot with spring lag
 *
 * The lag between dot and ring IS the orbital mechanic — no animation needed.
 * The ring chases the dot; the relationship between them creates the illusion
 * of a planet in orbit around a point.
 *
 * Context-aware morphing (via useCursor):
 *   default  → dot + round ring (22px)
 *   link     → dot + square ring (16px) — "this is interactive"
 *   project  → dot grows + ring expands (32px) — focused reading
 *   portrait → ring + additional dashed outer ring — measurement metaphor
 *
 * Rendered only on devices with hover capability (not touch).
 * pointer-events: none globally — never interferes with user interaction.
 */

type RingConfig = {
  size: number;
  radius: string;
  opacity: number;
};

const RING_CONFIG: Record<string, RingConfig> = {
  default: { size: 22, radius: "50%",  opacity: 0.4  },
  link:    { size: 16, radius: "5px",  opacity: 0.70 },
  project: { size: 32, radius: "50%",  opacity: 0.65 },
  portrait:{ size: 22, radius: "50%",  opacity: 0.50 },
};

export function Cursor() {
  const { mode } = useCursor();
  const [visible, setVisible] = useState(false);
  // SSR-safe: assume touch until the effect confirms otherwise
  const [isTouch, setIsTouch] = useState(true);

  // Raw mouse coordinates — set directly on mousemove
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Dot: near-instant (stiffness 800 = ~1 frame lag)
  const dotX = useSpring(mouseX, { stiffness: 800, damping: 50 });
  const dotY = useSpring(mouseY, { stiffness: 800, damping: 50 });

  // Ring: deliberate lag — this IS the orbital effect
  const ringX = useSpring(mouseX, spring.orbit);
  const ringY = useSpring(mouseY, spring.orbit);

  useEffect(() => {
    const hasHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    setIsTouch(!hasHover);
    if (!hasHover) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [mouseX, mouseY]);

  if (isTouch) return null;

  const ring = RING_CONFIG[mode] ?? RING_CONFIG.default;

  return (
    <div aria-hidden="true" role="presentation">
      {/* ── Dot ─────────────────────────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.08 }}
      >
        <motion.div
          className="rounded-full bg-accent"
          style={{ width: 5, height: 5 }}
          animate={{ scale: mode === "project" ? 1.4 : 1 }}
          transition={{ duration: 0.2, ease: ease.out }}
        />
      </motion.div>

      {/* ── Ring ─────────────────────────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ opacity: visible ? ring.opacity : 0 }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          className="border border-accent"
          style={{ width: 22, height: 22 }}
          animate={{
            scale:        ring.size / 22,
            borderRadius: ring.radius,
          }}
          transition={{ duration: 0.25, ease: ease.out }}
        />
      </motion.div>

      {/* ── Portrait measurement ring (extra dashed outer ring) ──────────── */}
      <AnimatePresence>
        {mode === "portrait" && (
          <motion.div
            className="fixed top-0 left-0 z-[9997] pointer-events-none"
            style={{
              x: ringX,
              y: ringY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.22, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25, ease: ease.out }}
          >
            <div
              className="rounded-full border border-dashed border-accent"
              style={{ width: 46, height: 46 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
