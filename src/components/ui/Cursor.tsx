"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useCursor } from "@/hooks/useCursorContext";
import { spring, ease } from "@/lib/motion";

/**
 * Orbit Cursor — premium edition.
 *
 * Three-layer architecture:
 *   Trail   — 4 trailing ghost dots with decaying stiffness → the "comet tail"
 *   Dot     — 5px, accent color, near-instant response
 *   Ring    — context-aware morphing ring with spring lag (the orbital mechanic)
 *
 * New modes vs v1:
 *   project  → ring expands + "VIEW" label rotates in
 *   view     → ring expands + "OPEN" label (for external links)
 *   text     → dot inverts colour (white on dark bg via mix-blend-mode: difference)
 *   portrait → dashed outer ring (unchanged)
 *
 * All transforms are on the GPU compositor (transform + opacity only).
 * pointer-events: none globally — never interferes with interaction.
 */

type RingConfig = {
  size:    number;
  radius:  string;
  opacity: number;
  filled?: boolean;
};

const RING: Record<string, RingConfig> = {
  default: { size: 22, radius: "50%", opacity: 0.40 },
  link:    { size: 16, radius: "5px", opacity: 0.70 },
  project: { size: 44, radius: "50%", opacity: 0.70, filled: true },
  view:    { size: 44, radius: "50%", opacity: 0.70, filled: true },
  portrait:{ size: 22, radius: "50%", opacity: 0.50 },
  text:    { size: 28, radius: "50%", opacity: 0.30 },
};

const TRAIL_SPRINGS = [
  { stiffness: 220, damping: 26 }, // #1 — closest
  { stiffness: 170, damping: 24 }, // #2
  { stiffness: 130, damping: 22 }, // #3
  { stiffness: 100, damping: 20 }, // #4 — farthest
] as const;

export function Cursor() {
  const { mode } = useCursor();
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Dot — direct, no spring: follows the real cursor with zero lag
  const dotX = mouseX;
  const dotY = mouseY;

  // Ring — deliberate orbital lag
  const ringX = useSpring(mouseX, spring.orbit);
  const ringY = useSpring(mouseY, spring.orbit);

  // Trail springs — decreasing stiffness = increasing lag = comet tail
  const t1x = useSpring(mouseX, TRAIL_SPRINGS[0]);
  const t1y = useSpring(mouseY, TRAIL_SPRINGS[0]);
  const t2x = useSpring(mouseX, TRAIL_SPRINGS[1]);
  const t2y = useSpring(mouseY, TRAIL_SPRINGS[1]);
  const t3x = useSpring(mouseX, TRAIL_SPRINGS[2]);
  const t3y = useSpring(mouseY, TRAIL_SPRINGS[2]);
  const t4x = useSpring(mouseX, TRAIL_SPRINGS[3]);
  const t4y = useSpring(mouseY, TRAIL_SPRINGS[3]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsTouch(!mq.matches);
    if (!mq.matches) return;

    const onMove  = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); setVisible(true); };
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

  const ring = RING[mode] ?? RING.default;
  const isExpanded = mode === "project" || mode === "view";
  const isText = mode === "text";
  const label = mode === "view" ? "OPEN" : "VIEW";

  const trailDots = [
    { x: t1x, y: t1y, opacity: 0.20 },
    { x: t2x, y: t2y, opacity: 0.14 },
    { x: t3x, y: t3y, opacity: 0.09 },
    { x: t4x, y: t4y, opacity: 0.05 },
  ];

  return (
    <div aria-hidden="true" role="presentation">

      {/* ── Trail — comet tail ─────────────────────────────────────────── */}
      {trailDots.map((td, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 pointer-events-none"
          style={{
            zIndex: 9994 - i,
            x: td.x,
            y: td.y,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{ opacity: visible && !isExpanded ? td.opacity : 0 }}
          transition={{ duration: 0.1 }}
        >
          <div
            className="rounded-full bg-accent"
            style={{ width: 3, height: 3 }}
          />
        </motion.div>
      ))}

      {/* ── Dot ─────────────────────────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.08 }}
      >
        <motion.div
          className="rounded-full"
          style={{
            width: 5,
            height: 5,
            background: isText ? "var(--txt)" : "var(--acc)",
            mixBlendMode: isText ? "difference" : "normal",
          }}
          animate={{ scale: isExpanded ? 0 : isText ? 1.6 : 1 }}
          transition={{ duration: 0.22, ease: ease.out }}
        />
      </motion.div>

      {/* ── Ring ─────────────────────────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? ring.opacity : 0 }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          className="relative flex items-center justify-center border border-accent"
          style={{ width: 22, height: 22, overflow: "hidden" }}
          animate={{
            scale:           ring.size / 22,
            borderRadius:    ring.radius,
            backgroundColor: ring.filled ? "rgba(183,110,121,0.14)" : "transparent",
          }}
          transition={{ duration: 0.28, ease: ease.out }}
        >
          {/* VIEW / OPEN label — appears only in project/view modes */}
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                key={mode}
                className="absolute text-accent font-medium"
                style={{
                  fontSize: 8,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-inter)",
                  whiteSpace: "nowrap",
                }}
                initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                animate={{ opacity: 1, scale: 1,   rotate: 0 }}
                exit={{    opacity: 0, scale: 0.6,  rotate: 8 }}
                transition={{ duration: 0.22, ease: ease.out }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* ── Portrait outer dashed ring ────────────────────────────────────── */}
      <AnimatePresence>
        {mode === "portrait" && (
          <motion.div
            className="fixed top-0 left-0 z-[9997] pointer-events-none"
            style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.22, scale: 1 }}
            exit={{    opacity: 0, scale: 0.7 }}
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
