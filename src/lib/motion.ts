/**
 * Motion system — single source of truth for all animation values.
 * Import from here. Never define easing, duration, or spring values inline.
 */

// ── Easing curves ─────────────────────────────────────────────────────────────

export const ease = {
  /** Default. Expo out — fast start, long deliberate tail. Use for reveals. */
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  /** Exit animations only. Never for entrances. */
  in: [0.64, 0, 0.78, 0] as [number, number, number, number],
  /** Page-level transitions. Never for scroll reveals. */
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  /** Slight overshoot. Playful, tactile elements only. */
  gentle: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  /** Opacity fades only. Never for position or scale. */
  linear: [0, 0, 1, 1] as [number, number, number, number],
} as const;

// ── Duration scale ────────────────────────────────────────────────────────────

export const duration = {
  instant:    0,
  fast:       0.15,  // Color, border, focus ring transitions
  base:       0.30,  // Button hover, icon swap, tag appearance
  slow:       0.55,  // Card reveals, secondary heading entrances
  deliberate: 0.80,  // Primary section entrances, hero elements
  cinematic:  1.20,  // Featured work, signature moments
  epic:       2.0,   // Preloader only — one use per visit
} as const;

// ── Stagger delay scale ───────────────────────────────────────────────────────

export const stagger = {
  xs:   0.05,
  sm:   0.10,
  base: 0.15,
  lg:   0.25,
  xl:   0.40,
} as const;

// ── Spring physics presets ────────────────────────────────────────────────────

export const spring = {
  /** Buttons, tags, small UI elements */
  snappy: { type: "spring" as const, stiffness: 500, damping: 35 },
  /** Magnetic elements, CTAs */
  responsive: { type: "spring" as const, stiffness: 220, damping: 24 },
  /** 3D card tilt */
  tilt: { type: "spring" as const, stiffness: 140, damping: 20 },
  /** Cursor orbit ring — trails with deliberate lag */
  orbit: { type: "spring" as const, stiffness: 120, damping: 16 },
  /** Ambient floating elements */
  float: { type: "spring" as const, stiffness: 60, damping: 18 },
} as const;

// ── Shared animation variants ─────────────────────────────────────────────────

/** Standard scroll-triggered reveal. y: 28px → 0, opacity 0 → 1. */
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.out, delay },
  }),
};

/** Opacity only — no position shift. Use for overlays, backgrounds. */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: duration.slow, ease: ease.linear, delay },
  }),
};

/** Scale reveal — cards, modals, contained elements. */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: duration.slow, ease: ease.out, delay },
  }),
};

/** Horizontal wipe — for section backgrounds and featured elements. */
export const wipeIn = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: (delay = 0) => ({
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: duration.deliberate, ease: ease.out, delay },
  }),
};

/**
 * Clip reveal — content rises from a bottom clip.
 * Best on block-level elements: cards, images, headlines.
 * Works with `custom={delaySeconds}` on the motion element.
 */
export const clipReveal = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0, y: 8 },
  visible: (delay = 0) => ({
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    y: 0,
    transition: { duration: duration.deliberate, ease: ease.out, delay },
  }),
};

/**
 * Stagger container — apply to a list wrapper.
 * Children that use `fadeUp`, `clipReveal`, etc. as `variants` will stagger.
 */
export const staggerContainer = {
  hidden: {},
  visible: (delayChildren = 0) => ({
    transition: {
      staggerChildren: stagger.xs,
      delayChildren,
    },
  }),
};

/**
 * Child variant for stagger lists.
 * Use on children of a `staggerContainer` parent.
 */
export const staggerChild = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.out },
  },
};

/**
 * Page-level transition — used in Providers for route changes.
 * Single-page: fires on initial mount only.
 */
export const pageVariant = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.4, ease: ease.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25, ease: ease.in },
  },
};

/**
 * Floating decorative elements (ambient orbs, quote marks, etc.)
 * Pass to `animate` on a `motion.div` with `repeat: Infinity`.
 */
export const floatAnim = (amplitude = 14, durationSec = 6, delaySec = 0) => ({
  y: [0, -amplitude, 0],
  transition: {
    duration: durationSec,
    ease: "easeInOut" as const,
    repeat: Infinity,
    delay: delaySec,
  },
});

// ── Viewport defaults ─────────────────────────────────────────────────────────

/** Default viewport config for whileInView animations. */
export const viewport = {
  once: true,
  amount: 0.2,
} as const;

/** Tighter threshold — use when content is tall or partially visible is enough. */
export const viewportEarly = {
  once: true,
  amount: 0.1,
} as const;
