"use client";

/**
 * Stagger — sequential entrance for list-like content.
 *
 * <Stagger> triggers when it enters the viewport and automatically staggers
 * its <StaggerItem> children. Children can also use `variants={staggerItem}`
 * directly on motion elements for full control.
 *
 * Usage:
 *   <Stagger className="grid grid-cols-3 gap-4">
 *     <StaggerItem>...</StaggerItem>
 *     <StaggerItem>...</StaggerItem>
 *   </Stagger>
 *
 * Or with native motion elements:
 *   <Stagger>
 *     <motion.li variants={staggerItem}>...</motion.li>
 *   </Stagger>
 */

import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import type { ReactNode, CSSProperties } from "react";

interface StaggerProps {
  children: ReactNode;
  /** Delay before the first child starts animating. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  /** Fraction of container visible before triggering. Default: 0.1. */
  amount?: number;
  once?: boolean;
}

export function Stagger({
  children,
  delay = 0,
  className,
  style,
  amount = 0.1,
  once = true,
}: StaggerProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      variants={staggerContainer}
      custom={delay}
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Direct child of <Stagger>. Inherits stagger timing from parent. */
export function StaggerItem({ children, className, style }: StaggerItemProps) {
  return (
    <motion.div variants={staggerItem} className={className} style={style}>
      {children}
    </motion.div>
  );
}
