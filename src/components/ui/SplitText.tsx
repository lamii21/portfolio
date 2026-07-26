"use client";

import { Fragment, useRef, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type TextTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div" | "blockquote";

interface SplitTextProps {
  children: string;
  as?: TextTag;
  className?: string;
  style?: CSSProperties;
  /** Base delay before the first word (seconds). */
  delay?: number;
  /** Delay between each consecutive word (seconds). */
  wordStagger?: number;
  /** InView threshold (0–1) before animation fires. */
  amount?: number;
  /** Only animate on first intersection. Recommended: true. */
  once?: boolean;
}

/**
 * Splits `children` into words, each clipped by an overflow:hidden wrapper
 * and revealed upward via a y-translate.  respects prefers-reduced-motion.
 *
 * `aria-label` on the outer element gives screen readers the full text;
 * the inner spans are aria-hidden so the text is never double-read.
 */
export function SplitText({
  children,
  as = "span",
  className,
  style,
  delay = 0,
  wordStagger = 0.048,
  amount = 0.15,
  once = true,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once, amount });
  const reduced = useReducedMotion();

  const words = children.split(" ");
  const El = as as React.ElementType;

  return (
    <El
      ref={ref}
      className={className}
      style={style}
      aria-label={children}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {/* Overflow-hidden clip container per word */}
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "bottom",
              lineHeight: "inherit",
            }}
          >
            <motion.span
              style={{ display: "inline-block" }}
              initial={reduced ? false : { y: "110%", opacity: 0 }}
              animate={inView || reduced ? { y: 0, opacity: 1 } : {}}
              transition={{
                duration: 0.72,
                ease: [0.22, 1, 0.36, 1],
                delay: delay + i * wordStagger,
              }}
            >
              {word}
            </motion.span>
          </span>
          {/* Word space between words, not inside the clip container */}
          {i < words.length - 1 && (
            <span aria-hidden="true" style={{ display: "inline-block", width: "0.25em" }} />
          )}
        </Fragment>
      ))}
    </El>
  );
}
