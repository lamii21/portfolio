"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCursor } from "@/hooks/useCursorContext";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  primary?: boolean;
  className?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
  disabled?: boolean;
  download?: string | boolean;
}

export function MagneticButton({
  href,
  onClick,
  children,
  primary = false,
  className,
  target,
  rel,
  disabled,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const { setMode } = useCursor();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, spring.responsive);
  const springY = useSpring(y, spring.responsive);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };

  const onMouseEnter = () => setMode("link");

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
    setMode("default");
  };

  const baseClass = cn(
    "inline-flex items-center justify-center gap-2",
    "px-7 py-3.5 rounded-full select-none",
    "text-[var(--text-body-sm)] font-medium tracking-[0.015em]",
    "transition-colors duration-200 outline-none",
    "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
    primary
      ? "bg-foreground text-background hover:bg-accent"
      : "border border-[var(--brd-strong)] text-foreground hover:border-accent hover:text-accent",
    disabled && "opacity-40 pointer-events-none",
    className
  );

  const motionShared = {
    style: { x: springX, y: springY },
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
    whileHover: { scale: 1.04 },
    whileTap: { scale: 0.97 },
    transition: spring.snappy,
    className: baseClass,
    ...rest,
  };

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        {...motionShared}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...motionShared}
    >
      {children}
    </motion.button>
  );
}
