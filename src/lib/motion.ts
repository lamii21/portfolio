/**
 * Motion Design System — single source of truth for all animation values.
 *
 * Rules:
 *  1. Import from here. Never define easing, duration, or spring values inline.
 *  2. Prefer named variants over ad-hoc initial/animate objects.
 *  3. Every animation must respect useReducedMotion at the call site.
 *
 * Vocabulary:
 *  ease    — cubic-bezier curves
 *  duration — timing scale in seconds
 *  stagger  — delay increment between sibling elements
 *  spring   — physics presets for interactive elements
 *  viewport — IntersectionObserver thresholds
 *  variants — reusable Framer Motion variant maps
 */

// ── Easing curves ─────────────────────────────────────────────────────────────

export const ease = {
  /** Primary reveal curve. Expo out — fast start, long deliberate tail. */
  out:    [0.22, 1, 0.36, 1]   as [number, number, number, number],
  /** Exit animations only. Never for entrances. */
  in:     [0.64, 0, 0.78, 0]   as [number, number, number, number],
  /** Page-level transitions — symmetric breathe. Never for scroll reveals. */
  inOut:  [0.65, 0, 0.35, 1]   as [number, number, number, number],
  /** Slight overshoot. Badges, chips, playful tactile elements. */
  gentle: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  /** Opacity-only fades. Never for position or scale. */
  linear: [0, 0, 1, 1]          as [number, number, number, number],
} as const;

// ── Duration scale ────────────────────────────────────────────────────────────
// Named so intent is clear at the call site.

export const duration = {
  instant:    0,
  micro:      0.12, // Focus rings, colour swaps
  fast:       0.20, // Icon transitions, badges, chevron rotations
  base:       0.32, // Accordions, hover feedback, small reveals
  slow:       0.55, // Card reveals, secondary heading entrances
  deliberate: 0.80, // Primary section entrances, hero elements
  cinematic:  1.20, // Featured work, signature moments
  epic:       2.0,  // Preloader only — one use per visit
} as const;

// ── Stagger delay scale ───────────────────────────────────────────────────────

export const stagger = {
  xs:   0.05,
  sm:   0.08,
  base: 0.12,
  lg:   0.20,
} as const;

// ── Spring physics presets ────────────────────────────────────────────────────

export const spring = {
  /** Buttons, tags, small UI presses */
  snappy:     { type: "spring" as const, stiffness: 500, damping: 35 },
  /** Magnetic elements, CTAs */
  responsive: { type: "spring" as const, stiffness: 220, damping: 24 },
  /** 3D card tilt — Projects section */
  tiltCard:   { type: "spring" as const, stiffness: 380, damping: 30 },
  /** 3D avatar tilt — HeroScene */
  tilt:       { type: "spring" as const, stiffness: 140, damping: 20 },
  /** Cursor orbit ring — trails with deliberate lag */
  orbit:      { type: "spring" as const, stiffness: 200, damping: 22 },
  /** Ambient floating elements */
  float:      { type: "spring" as const, stiffness: 60,  damping: 18 },
  /** Cursor dot — near-instant, sub-frame response */
  cursorDot:  { stiffness: 800, damping: 50 },
  /** Scroll-driven decorative line (HowIThink, Timeline) */
  scrollLine: { stiffness: 65, damping: 21 },
} as const;

// ── Viewport defaults ─────────────────────────────────────────────────────────

/** Default. Triggers when ~15% of element is visible. */
export const viewport      = { once: true, amount: 0.15 } as const;
/** Tall elements or content that appears early in scroll. */
export const viewportEarly = { once: true, amount: 0.08 } as const;
/** Headings and labels that need more context before animating. */
export const viewportFar   = { once: true, amount: 0.45 } as const;
/** "Above the fold" confirmation — nearly fully visible. */
export const viewportFull  = { once: true, amount: 0.80 } as const;

// ── Scroll reveal variants ────────────────────────────────────────────────────
// Usage: variants={fadeUp} custom={delaySeconds} initial="hidden" whileInView="visible"

/** Standard scroll reveal. y: 24 → 0, opacity 0 → 1. */
export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: duration.slow, ease: ease.out, delay },
  }),
};

/** Fade from left — content slides in from x: +24. */
export const fadeLeft = {
  hidden:  { opacity: 0, x: 24 },
  visible: (delay = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: duration.slow, ease: ease.out, delay },
  }),
};

/** Fade from right — content slides in from x: −24. */
export const fadeRight = {
  hidden:  { opacity: 0, x: -24 },
  visible: (delay = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: duration.slow, ease: ease.out, delay },
  }),
};

/** Opacity only. Use for overlays, backgrounds, text without motion. */
export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: duration.slow, ease: ease.linear, delay },
  }),
};

/** Scale reveal — cards, modals, contained elements. */
export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: (delay = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: duration.slow, ease: ease.out, delay },
  }),
};

/** Chip/badge pop-in — scale with gentle bounce. Tech pills, labels. */
export const chipReveal = {
  hidden:  { opacity: 0, scale: 0.8, y: 6 },
  visible: (delay = 0) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { duration: duration.base, ease: ease.gentle, delay },
  }),
};

/** Horizontal wipe — section backgrounds, featured elements. */
export const wipeIn = {
  hidden:  { clipPath: "inset(0 100% 0 0)" },
  visible: (delay = 0) => ({
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: duration.deliberate, ease: ease.out, delay },
  }),
};

/** Clip reveal — content rises from a bottom clip. Headlines, cards, images. */
export const clipReveal = {
  hidden:  { clipPath: "inset(0 0 100% 0)", opacity: 0, y: 8 },
  visible: (delay = 0) => ({
    clipPath: "inset(0 0 0% 0)", opacity: 1, y: 0,
    transition: { duration: duration.deliberate, ease: ease.out, delay },
  }),
};

// ── Stagger system ────────────────────────────────────────────────────────────

/**
 * Stagger container — apply to a list wrapper.
 * Children using any variant will stagger automatically.
 */
export const staggerContainer = {
  hidden: {},
  visible: (delayChildren = 0) => ({
    transition: { staggerChildren: stagger.xs, delayChildren },
  }),
};

/** Standard stagger child. Use on children of staggerContainer. */
export const staggerItem = {
  hidden:  { opacity: 0, y: 18 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: duration.slow, ease: ease.out },
  },
};

/** Alias — preserved for backward compatibility. */
export const staggerChild = staggerItem;

// ── Accordion / disclosure transition ────────────────────────────────────────
// Usage (inside AnimatePresence):
//   <motion.div initial="closed" animate="open" exit="closed"
//               variants={accordionVariants} style={{ overflow: "hidden" }}>

export const accordionVariants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: duration.base, ease: ease.out },
  },
  open: {
    height: "auto" as "auto",
    opacity: 1,
    transition: { duration: duration.base, ease: ease.out },
  },
};

/** Shared transition for inline accordion (initial/animate/exit pattern). */
export const accordionTransition = { duration: duration.base, ease: ease.out };

// ── Hover interactions ────────────────────────────────────────────────────────
// Pass to whileHover. Always guard with: reduced ? {} : hoverLift

/** Subtle lift — small cards, secondary interactive elements. */
export const hoverLift   = { y: -4 } as const;
/** Pronounced lift — large cards, project tiles. */
export const hoverLiftLg = { y: -6 } as const;
/** Scale pulse — tab buttons, icon badges. */
export const hoverScale  = { scale: 1.03 } as const;
/** Tap confirmation. */
export const tapScale    = { scale: 0.97 } as const;

// ── Floating decorative elements ─────────────────────────────────────────────

/**
 * Infinite float loop for ambient / decorative elements.
 * Guard at call site: reduced ? {} : floating(...)
 */
export const floating = (amplitude = 14, durationSec = 6, delaySec = 0) => ({
  y: [0, -amplitude, 0],
  transition: {
    duration: durationSec,
    ease: "easeInOut" as const,
    repeat: Infinity,
    delay: delaySec,
  },
});

/** Alias — preserved for backward compatibility. */
export const floatAnim = floating;

// ── Page transition ───────────────────────────────────────────────────────────

export const pageVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: ease.out } },
  exit:    { opacity: 0, transition: { duration: 0.25, ease: ease.in } },
};

// ── Premium Awwwards-level reveal variants ────────────────────────────────────

/**
 * Slide + mask reveal — content rises from a bottom clip WITH a y offset.
 * More cinematic than plain clipReveal. For section headlines, card content.
 */
export const slideMask = {
  hidden:  { clipPath: "inset(0 0 100% 0)", y: 12, opacity: 0 },
  visible: (delay = 0) => ({
    clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1,
    transition: { duration: duration.cinematic, ease: ease.out, delay },
  }),
};

/**
 * Glass reveal — opacity + blur transition. For glass cards, overlay panels.
 * Simulate depth-of-field materialisation.
 */
export const glassReveal = {
  hidden:  { opacity: 0, filter: "blur(8px)", scale: 0.97 },
  visible: (delay = 0) => ({
    opacity: 1, filter: "blur(0px)", scale: 1,
    transition: { duration: duration.deliberate, ease: ease.out, delay },
  }),
};

/**
 * Depth reveal — element rises from below WITH perspective scale.
 * Implies the element is on a closer z-plane emerging toward the viewer.
 */
export const depthReveal = {
  hidden:  { opacity: 0, y: 32, scale: 0.92, filter: "blur(4px)" },
  visible: (delay = 0) => ({
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: duration.deliberate, ease: ease.out, delay },
  }),
};

/**
 * Horizontal line draw — element reveals left to right via clip-path.
 * For decorative lines, underlines, section dividers.
 * Shorter and snappier than wipeIn.
 */
export const lineDraw = {
  hidden:  { clipPath: "inset(0 100% 0 0)", opacity: 0.6 },
  visible: (delay = 0) => ({
    clipPath: "inset(0 0% 0 0)", opacity: 1,
    transition: { duration: duration.slow, ease: ease.out, delay },
  }),
};

/**
 * Parallax stagger — for groups where each child should float in from
 * a different depth (y offset increases per item).
 * Apply to children: custom={index * 0.1} where 0.1 is delay per item.
 */
export const depthStagger = {
  hidden: {},
  visible: (delay = 0) => ({
    transition: { staggerChildren: stagger.sm, delayChildren: delay },
  }),
};

export const depthChild = {
  hidden:  { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: duration.slow, ease: ease.out },
  },
};
