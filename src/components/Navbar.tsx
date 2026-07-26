"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import { Moon, Sun, Menu, X } from "lucide-react";
import { navItems, siteConfig } from "@/data/site";
import { ScrambleText } from "@/components/ScrambleText";
import { useCursor } from "@/hooks/useCursorContext";
import { useTheme } from "@/hooks/useTheme";
import { ease, duration, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ── Scroll-state hook (local — navbar-specific) ───────────────────────────────

function useScrolled(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    handler(); // run immediately on mount
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Navbar() {
  const { isDark, toggle } = useTheme();
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { setMode } = useCursor();

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close mobile menu on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Move focus to close button when menu opens (keyboard/AT trap entry)
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (mobileOpen) {
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    }
  }, [mobileOpen]);

  return (
    <>
      {/* ── Scroll progress bar ─────────────────────────────────────────── */}
      {/* z-[200] — above the navbar (z-[100]) and mobile overlay (z-[150]) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[200] pointer-events-none"
        style={{
          scaleX,
          background: "linear-gradient(90deg, var(--acc), var(--acc-light))",
        }}
      />

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] h-16 will-change-transform",
          "transition-[background-color,border-color,box-shadow] duration-500",
          scrolled
            ? "bg-background/85 backdrop-blur-[14px] border-b border-border/50 shadow-sm shadow-foreground/[0.04]"
            : "bg-transparent border-b border-transparent"
        )}
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: duration.deliberate,
          ease: ease.out,
          delay: 0.15,
        }}
      >
        <nav
          className="h-full max-w-[var(--content-max)] mx-auto px-[var(--section-px)] flex items-center justify-between"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* ── Logo ──────────────────────────────────────────────────── */}
          <Link
            href="/"
            className="font-serif text-[1.0625rem] leading-none text-foreground hover:text-accent transition-colors duration-200"
            aria-label={`${siteConfig.name} — home`}
            onMouseEnter={() => setMode("link")}
            onMouseLeave={() => setMode("default")}
          >
            {/* Desktop: full name. Mobile: first name only. */}
            <span className="hidden sm:inline">{siteConfig.name}</span>
            <span className="sm:hidden">Lamiae</span>
          </Link>

          {/* ── Desktop nav ───────────────────────────────────────────── */}
          <ul className="hidden md:flex items-center gap-8 list-none p-0 m-0">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="relative group text-[var(--text-overline)] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors duration-200"
                  onMouseEnter={() => {
                    setHovered(item.label);
                    setMode("link");
                  }}
                  onMouseLeave={() => {
                    setHovered(null);
                    setMode("default");
                  }}
                >
                  <ScrambleText
                    text={item.label}
                    isHovered={hovered === item.label}
                  />
                  {/* Accent underline — slides left to right on hover */}
                  <span
                    className="absolute -bottom-px left-0 h-px bg-accent transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] w-0 group-hover:w-full"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}

            {/* Theme toggle */}
            <li>
              <ThemeToggle isDark={isDark} toggle={toggle} />
            </li>
          </ul>

          {/* ── Mobile controls ───────────────────────────────────────── */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle isDark={isDark} toggle={toggle} />
            <button
              onClick={() => setMobileOpen(true)}
              className="w-8 h-8 flex items-center justify-center text-foreground hover:text-accent transition-colors duration-200"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              <Menu size={18} strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ── Mobile overlay ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-nav-title"
            className="fixed inset-0 z-[150] flex flex-col bg-background"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: duration.slow, ease: ease.out }}
          >
            {/* Close row */}
            <div className="flex items-center justify-between h-16 px-[var(--section-px)] border-b border-border/30">
              <span id="mobile-nav-title" className="font-serif text-[1.0625rem] text-foreground">
                {siteConfig.name}
              </span>
              <button
                ref={closeButtonRef}
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-foreground hover:text-accent transition-colors duration-200"
                aria-label="Close navigation menu"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Nav items — large serif, staggered in */}
            <nav
              className="flex-1 flex flex-col justify-center px-[var(--section-px)] gap-1"
              aria-label="Mobile navigation"
            >
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: duration.slow,
                    ease: ease.out,
                    delay: i * stagger.sm + 0.08,
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block font-serif text-[clamp(2.5rem,9vw,3.5rem)] leading-[1.1] text-foreground hover:text-accent transition-colors duration-200 py-3"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Footer meta */}
            <motion.div
              className="px-[var(--section-px)] py-8 text-[var(--text-overline)] uppercase tracking-[0.18em] text-muted-foreground/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: navItems.length * stagger.sm + 0.15,
                duration: duration.slow,
              }}
            >
              {siteConfig.location}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── ThemeToggle (extracted to keep Navbar readable) ───────────────────────────

function ThemeToggle({
  isDark,
  toggle,
}: {
  isDark: boolean;
  toggle: () => void;
}) {
  return (
    <button
      onClick={toggle}
      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-full"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
            transition={{ duration: 0.18, ease: ease.out }}
            style={{ display: "flex" }}
          >
            <Sun size={15} strokeWidth={1.5} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: 90, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.7 }}
            transition={{ duration: 0.18, ease: ease.out }}
            style={{ display: "flex" }}
          >
            <Moon size={15} strokeWidth={1.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
