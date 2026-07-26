"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { spring } from "@/lib/motion";

// ── Tech card orbit data ──────────────────────────────────────────────────────
// Six cards placed at clock positions around the avatar.
// px/py = parallax factors (direction + strength, ±1 scale).

const TECH_CARDS = [
  {
    id: "react",
    icon: "⚛",
    label: "React",
    sub: "v18",
    style: { top: "1%",  left: "40%"  } as React.CSSProperties,
    float: { y: [0, -10, 0] as number[], dur: 4.5, delay: 0.0 },
    px: 0.0,  py: 0.55,
  },
  {
    id: "nextjs",
    icon: "▲",
    label: "Next.js",
    sub: "v15",
    style: { top: "16%", right: "-3%" } as React.CSSProperties,
    float: { y: [0, -8,  0] as number[], dur: 5.0, delay: 0.8 },
    px: -0.5, py: 0.3,
  },
  {
    id: "typescript",
    icon: "TS",
    label: "TypeScript",
    sub: "v5",
    style: { top: "55%", right: "-5%" } as React.CSSProperties,
    float: { y: [0, -9,  0] as number[], dur: 4.8, delay: 1.5 },
    px: -0.5, py: -0.3,
  },
  {
    id: "django",
    icon: "🌿",
    label: "Django",
    sub: "v5",
    style: { bottom: "1%", left: "38%" } as React.CSSProperties,
    float: { y: [0, -7,  0] as number[], dur: 4.2, delay: 2.2 },
    px: 0.0,  py: -0.55,
  },
  {
    id: "python",
    icon: "🐍",
    label: "Python",
    sub: "3.12",
    style: { top: "55%", left: "-5%"  } as React.CSSProperties,
    float: { y: [0, -11, 0] as number[], dur: 5.2, delay: 1.1 },
    px: 0.5,  py: -0.3,
  },
  {
    id: "sql",
    icon: "🗄",
    label: "SQL",
    sub: "Postgres",
    style: { top: "16%", left: "-3%"  } as React.CSSProperties,
    float: { y: [0, -8,  0] as number[], dur: 4.6, delay: 0.4 },
    px: 0.5,  py: 0.3,
  },
] as const;

// ── Floating particles ────────────────────────────────────────────────────────

const PARTICLES = [
  { x: 12, y: 16, s: 2.5, dur: 3.8, d: 0.0 },
  { x: 88, y: 10, s: 2.0, dur: 4.2, d: 0.7 },
  { x:  5, y: 62, s: 3.0, dur: 3.5, d: 1.3 },
  { x: 94, y: 68, s: 2.0, dur: 4.8, d: 0.9 },
  { x: 46, y:  3, s: 2.5, dur: 4.0, d: 1.9 },
  { x: 54, y: 97, s: 2.0, dur: 3.6, d: 2.3 },
  { x: 20, y: 82, s: 1.5, dur: 5.0, d: 0.4 },
  { x: 80, y: 80, s: 2.0, dur: 3.9, d: 1.6 },
  { x: 16, y: 36, s: 1.5, dur: 3.7, d: 2.0 },
  { x: 84, y: 38, s: 2.5, dur: 4.5, d: 0.2 },
  { x: 33, y:  7, s: 2.0, dur: 4.1, d: 1.1 },
  { x: 67, y:  7, s: 1.5, dur: 3.4, d: 0.6 },
  { x: 28, y: 50, s: 1.5, dur: 4.3, d: 1.8 },
  { x: 72, y: 50, s: 2.0, dur: 3.8, d: 0.3 },
  { x: 50, y: 12, s: 1.5, dur: 4.7, d: 2.5 },
  { x: 50, y: 88, s: 1.5, dur: 4.0, d: 1.4 },
] as const;

// ── Bokeh depth spheres ───────────────────────────────────────────────────────
// Large, heavily-blurred orbs float very slowly behind the scene to create
// a photography-style depth-of-field atmosphere.

const BOKEH = [
  { x: 18, y: 22, size: 190, opacity: 0.06, dur: 20, delay: 0  },
  { x: 76, y: 67, size: 225, opacity: 0.04, dur: 25, delay: 5  },
  { x: 57, y: 11, size: 155, opacity: 0.05, dur: 17, delay: 9  },
] as const;

// ── SVG connection line endpoints ─────────────────────────────────────────────
// ViewBox "0 0 100 112" — avatar center ≈ (50, 49)
// Endpoints match the six card clock positions.

const CONN_LINES = [
  { x2: 44,  y2: 5,   animDelay: "0.0s", animDur: "2.4s" },  // react   12 o'clock
  { x2: 97,  y2: 20,  animDelay: "0.4s", animDur: "2.6s" },  // nextjs   2 o'clock
  { x2: 100, y2: 60,  animDelay: "0.8s", animDur: "2.2s" },  // ts       4 o'clock
  { x2: 43,  y2: 108, animDelay: "1.2s", animDur: "2.5s" },  // django   6 o'clock
  { x2:  0,  y2: 60,  animDelay: "1.6s", animDur: "2.3s" },  // python   8 o'clock
  { x2:  3,  y2: 20,  animDelay: "2.0s", animDur: "2.1s" },  // sql     10 o'clock
] as const;

// ── Main component ─────────────────────────────────────────────────────────────

export function HeroScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const animated = !prefersReduced;

  // Mouse tracking — normalized [0,1] relative to scene
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!animated) return;
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top)  / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  // Avatar 3D tilt from mouse
  const rawRotY = useTransform(mouseX, [0, 1], [-12, 12]);
  const rawRotX = useTransform(mouseY, [0, 1], [8, -8]);
  const avatarRotY = useSpring(rawRotY, spring.tilt);
  const avatarRotX = useSpring(rawRotX, spring.tilt);

  // Dynamic glow follows cursor
  const glowLeft = useTransform(mouseX, [0, 1], [25, 75]);
  const glowTop  = useTransform(mouseY, [0, 1], [25, 75]);
  const glowBg   = useMotionTemplate`radial-gradient(circle at ${glowLeft}% ${glowTop}%, rgba(183,110,121,0.28) 0%, rgba(183,110,121,0.08) 45%, transparent 70%)`;

  return (
    <div
      ref={sceneRef}
      className="relative select-none"
      style={{ width: "min(560px, 90vw)", aspectRatio: "1 / 1.12" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      {/* Dot grid */}
      <DotGrid />

      {/* Warm ambient glow — breathes slowly when animated */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 72% 65% at 50% 47%, rgba(183,110,121,0.14) 0%, transparent 70%)",
          filter: "blur(12px)",
        }}
        animate={animated ? { scale: [1, 1.07, 1], opacity: [0.7, 1, 0.7] } : {}}
        transition={animated ? { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 } : {}}
      />

      {/* Bokeh depth spheres — behind connection lines */}
      {animated && <BokehSpheres />}

      {/* Mouse-driven dynamic glow */}
      {animated && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: glowBg }}
        />
      )}

      {/* SVG connection lines — data pulses from avatar to each card */}
      <ConnectionLines animated={animated} />

      {/* 3D perspective orbital rings */}
      <OrbitalRings animated={animated} />

      {/* Floating particles */}
      {animated && <Particles />}

      {/* Avatar — the scene centerpiece */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AvatarCore
          rotateX={avatarRotX}
          rotateY={avatarRotY}
          animated={animated}
        />
      </div>

      {/* Tech stack floating cards */}
      <TechCards mouseX={mouseX} mouseY={mouseY} animated={animated} />
    </div>
  );
}

// ── Dot grid ──────────────────────────────────────────────────────────────────

function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: 0.16,
        backgroundImage:
          "radial-gradient(circle, rgba(183,110,121,0.65) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage:
          "radial-gradient(ellipse 82% 82% at 50% 50%, black 20%, transparent 78%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 82% 82% at 50% 50%, black 20%, transparent 78%)",
      }}
    />
  );
}

// ── Bokeh depth spheres ───────────────────────────────────────────────────────
// Large, out-of-focus blurred orbs floating slowly create a photography
// depth-of-field atmosphere behind the orbital rings.

function BokehSpheres() {
  return (
    <>
      {BOKEH.map(({ x, y, size, opacity, dur, delay }, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}px`,
            height: `${size}px`,
            marginLeft: -(size / 2),
            marginTop: -(size / 2),
            background:
              "radial-gradient(circle, rgba(183,110,121,0.85) 0%, rgba(183,110,121,0.18) 55%, transparent 75%)",
            filter: `blur(${Math.round(size * 0.23)}px)`,
            opacity,
            willChange: "transform",
          }}
          animate={{ y: [0, -20, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
        />
      ))}
    </>
  );
}

// ── SVG connection lines ──────────────────────────────────────────────────────
// Thin dashed lines flow from avatar center to each tech card.
// CSS line-flow animation drives stroke-dashoffset on compositor.

function ConnectionLines({ animated }: { animated: boolean }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 112"
      preserveAspectRatio="none"
      style={{ overflow: "visible" }}
    >
      {CONN_LINES.map(({ x2, y2, animDelay, animDur }, i) => (
        <line
          key={i}
          x1="50" y1="49"
          x2={x2} y2={y2}
          stroke="var(--acc)"
          strokeWidth="0.45"
          strokeDasharray="3 8"
          opacity="0.2"
          style={
            animated
              ? {
                  animation: `line-flow ${animDur} linear infinite`,
                  animationDelay: animDelay,
                }
              : undefined
          }
        />
      ))}
    </svg>
  );
}

// ── Orbital ring system ───────────────────────────────────────────────────────
// Three rings on different 3D planes — perspective on the parent creates
// the elliptical orbit illusion as each ring rotates in its tilted plane.
//
// Structure per ring:
//   centering-wrapper (absolute inset-0, flex center)
//   └── tilt-div (static rotateX + rotateZ via CSS transform)
//       └── spin-div (CSS animation: orbit-cw / orbit-ccw)
//           └── svg circle

interface OrbRingProps {
  size: string;
  tilt: string;
  duration: number;
  dir: "cw" | "ccw";
  strokeColor: string;
  strokeWidth: number;
  dash?: string;
  gradId?: string;
  filterId?: string;
  dotSize: number;
  dotOpacity: number;
  animated: boolean;
}

function OrbRing({
  size, tilt, duration, dir,
  strokeColor, strokeWidth, dash,
  gradId, filterId, dotSize, dotOpacity,
  animated,
}: OrbRingProps) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: size, aspectRatio: "1", transform: tilt, flexShrink: 0 }}>
        {/* will-change hints the GPU compositor to promote this to its own layer */}
        <div
          style={{
            width: "100%",
            height: "100%",
            animation: animated ? `orbit-${dir} ${duration}s linear infinite` : "none",
            willChange: animated ? "transform" : "auto",
          }}
        >
          <svg
            viewBox="0 0 100 100"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
          >
            {(gradId || filterId) && (
              <defs>
                {gradId && (
                  <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%"   stopColor="var(--acc)" stopOpacity="0.55" />
                    <stop offset="40%"  stopColor="var(--acc)" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="var(--acc)" stopOpacity="0.55" />
                  </linearGradient>
                )}
                {filterId && (
                  <filter id={filterId} x="-120%" y="-120%" width="340%" height="340%">
                    <feGaussianBlur stdDeviation="1.8" in="SourceGraphic" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                )}
              </defs>
            )}
            <circle
              cx="50" cy="50" r="48"
              fill="none"
              stroke={gradId ? `url(#${gradId})` : strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={dash}
            />
            {/* Orbital dot — bloom glow via SVG feGaussianBlur filter */}
            <circle
              cx="50" cy="2"
              r={dotSize}
              fill="var(--acc)"
              opacity={dotOpacity}
              filter={filterId ? `url(#${filterId})` : undefined}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function OrbitalRings({ animated }: { animated: boolean }) {
  return (
    // perspective creates the 3D rendering context for child rotateX transforms
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ perspective: "800px" }}
    >
      {/* Ring 1 — outer, near-horizontal (orbit floor plane) */}
      <OrbRing
        size="91%"
        tilt="rotateX(-68deg)"
        duration={32}
        dir="cw"
        strokeColor=""
        strokeWidth={0.7}
        dash="8 14"
        gradId="ring-grad-outer"
        filterId="dot-glow-outer"
        dotSize={2.8}
        dotOpacity={0.75}
        animated={animated}
      />

      {/* Ring 2 — middle, tilted at 45° with 30° in-plane rotation */}
      <OrbRing
        size="70%"
        tilt="rotateX(-52deg) rotateZ(30deg)"
        duration={22}
        dir="ccw"
        strokeColor="rgba(183,110,121,0.30)"
        strokeWidth={0.65}
        filterId="dot-glow-mid"
        dotSize={2.2}
        dotOpacity={0.85}
        animated={animated}
      />

      {/* Ring 3 — inner, steep tilt with twist */}
      <OrbRing
        size="51%"
        tilt="rotateX(-74deg) rotateZ(-20deg)"
        duration={16}
        dir="cw"
        strokeColor="rgba(183,110,121,0.18)"
        strokeWidth={1.0}
        dash="4 10"
        filterId="dot-glow-inner"
        dotSize={1.8}
        dotOpacity={0.5}
        animated={animated}
      />
    </div>
  );
}

// ── Avatar core ───────────────────────────────────────────────────────────────

interface AvatarCoreProps {
  rotateX: ReturnType<typeof useSpring>;
  rotateY: ReturnType<typeof useSpring>;
  animated: boolean;
}

function AvatarCore({ rotateX, rotateY, animated }: AvatarCoreProps) {
  return (
    <motion.div
      className="relative"
      style={animated ? { transformPerspective: 1000, rotateX, rotateY } : {}}
      animate={animated ? { y: [0, -14, 0] } : {}}
      transition={animated ? { duration: 6.5, repeat: Infinity, ease: "easeInOut" } : {}}
    >
      {/* Deep glow halo — responds to float animation */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "-36px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 56%, rgba(183,110,121,0.40) 0%, rgba(183,110,121,0.12) 50%, transparent 72%)",
          filter: "blur(24px)",
          zIndex: -1,
        }}
      />

      {/* Avatar blob */}
      <motion.div
        className="relative overflow-hidden"
        style={{
          width: "clamp(200px, 24vw, 300px)",
          aspectRatio: "3 / 4",
          borderRadius: "44% 56% 52% 48% / 46% 46% 54% 54%",
          background:
            "radial-gradient(ellipse at 40% 30%, #3A1A22 0%, #1A0D10 60%, #0D0608 100%)",
          boxShadow: [
            "0 0 0 1px rgba(183,110,121,0.28)",
            "0 0 52px rgba(183,110,121,0.22)",
            "0 20px 72px rgba(0,0,0,0.60)",
            "inset 0 1px 0 rgba(255,255,255,0.06)",
          ].join(", "),
        }}
        whileHover={animated ? { scale: 1.025, transition: spring.snappy } : {}}
      >
        <Image
          src="/lamiae-avatar.png"
          alt="Lamiae El Jabri — Software Engineer"
          fill
          priority
          sizes="(max-width: 768px) 200px, (max-width: 1280px) 250px, 300px"
          className="object-cover"
          style={{ objectPosition: "58% center" }}
        />

        {/* Crown gradient — warm rose at crown */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 38% at 50% 0%, rgba(183,110,121,0.30) 0%, transparent 65%)",
          }}
        />

        {/* Holographic scan line — sweeps top→bottom then jumps back */}
        {animated && (
          <motion.div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 5%, rgba(183,110,121,0.55) 40%, rgba(201,127,137,0.70) 50%, rgba(183,110,121,0.55) 60%, transparent 95%)",
            }}
            initial={{ top: "12%" }}
            animate={{ top: ["12%", "82%", "82%", "12%"] }}
            transition={{
              duration: 2.8,
              times: [0, 0.45, 0.82, 1],
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 3.8,
            }}
          />
        )}
      </motion.div>

      {/* Rim accent ring — matches blob shape */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "44% 56% 52% 48% / 46% 46% 54% 54%",
          border: "1px solid rgba(183,110,121,0.22)",
        }}
      />

      {/* Available chip — top-right */}
      <motion.div
        className="absolute -top-4 -right-3 sm:-right-6 hidden sm:flex"
        initial={{ opacity: 0, scale: 0.7, y: 10 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.0, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div
          className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 shadow-md"
          style={{ background: "var(--srf-1)", borderColor: "var(--brd)" }}
        >
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span
              className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full opacity-55"
              style={{ background: "rgb(34,197,94)" }}
            />
            <span
              className="relative inline-flex rounded-full h-1.5 w-1.5"
              style={{ background: "rgb(34,197,94)" }}
            />
          </span>
          <span
            className="text-[9px] uppercase tracking-[0.18em] font-medium whitespace-nowrap"
            style={{ color: "var(--txt-muted)" }}
          >
            Available
          </span>
        </div>
      </motion.div>

      {/* School chip — bottom-left */}
      <motion.div
        className="absolute -bottom-4 -left-2 sm:-left-8 hidden sm:flex"
        initial={{ opacity: 0, scale: 0.7, y: -10 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div
          className="flex items-center rounded-full border px-3 py-1.5 shadow-md"
          style={{ background: "var(--srf-1)", borderColor: "var(--brd)" }}
        >
          <span
            className="text-[9px] uppercase tracking-[0.18em] font-medium whitespace-nowrap"
            style={{ color: "var(--txt-muted)" }}
          >
            EMSI · 2027
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Particles ─────────────────────────────────────────────────────────────────

function Particles() {
  return (
    <>
      {PARTICLES.map(({ x, y, s, dur, d }, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full pointer-events-none${i >= 8 ? " hidden lg:block" : ""}`}
          style={{
            left:   `${x}%`,
            top:    `${y}%`,
            width:  `${s}px`,
            height: `${s}px`,
            background:
              i % 4 === 0 ? "var(--acc)"
              : i % 4 === 1 ? "var(--acc-light)"
              : "var(--txt-subtle)",
          }}
          animate={{
            y:       [0, -(s * 4), 0],
            opacity: [0.30, 0.80, 0.30],
            scale:   [1, 1.4, 1],
          }}
          transition={{
            duration: dur,
            repeat:   Infinity,
            ease:     "easeInOut",
            delay:    d,
          }}
        />
      ))}
    </>
  );
}

// ── Tech cards ────────────────────────────────────────────────────────────────

interface TechCardsProps {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  animated: boolean;
}

function TechCards({ mouseX, mouseY, animated }: TechCardsProps) {
  return (
    <>
      {TECH_CARDS.map((card) => (
        <FloatingCard
          key={card.id}
          {...card}
          mouseX={mouseX}
          mouseY={mouseY}
          animated={animated}
        />
      ))}
    </>
  );
}

interface FloatingCardProps {
  id: string;
  icon: string;
  label: string;
  sub: string;
  style: React.CSSProperties;
  float: { y: number[]; dur: number; delay: number };
  px: number;
  py: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  animated: boolean;
}

function FloatingCard({
  icon, label, sub, style, float, px, py, mouseX, mouseY, animated,
}: FloatingCardProps) {
  const cardX = useSpring(
    useTransform(mouseX, [0, 1], [px * -18, px * 18]),
    spring.float
  );
  const cardY = useSpring(
    useTransform(mouseY, [0, 1], [py * -14, py * 14]),
    spring.float
  );

  const isText = label === "TypeScript"; // renders "TS" text, not emoji

  return (
    <motion.div
      className="absolute pointer-events-none hidden lg:flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl"
      style={{
        ...style,
        background: "var(--glass-bg)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid var(--glass-brd)",
        boxShadow: [
          "0 4px 24px rgba(0,0,0,0.09)",
          "0 1px 4px rgba(0,0,0,0.05)",
          "inset 0 1px 0 rgba(255,255,255,0.07)",
        ].join(", "),
        x: animated ? cardX : 0,
      }}
      animate={animated ? { y: float.y } : {}}
      transition={
        animated
          ? { duration: float.dur, repeat: Infinity, ease: "easeInOut", delay: float.delay }
          : {}
      }
      initial={{ opacity: 0, scale: 0.82 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Icon badge */}
      <div
        className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
        style={{
          background: "rgba(183,110,121,0.12)",
          color: "var(--acc)",
          fontSize: isText ? "8px" : "13px",
          fontFamily: isText ? "var(--font-inter)" : "inherit",
          fontWeight: isText ? 700 : "normal",
          letterSpacing: isText ? "0.04em" : "normal",
        }}
      >
        {icon}
      </div>

      {/* Label + version */}
      <div className="flex flex-col gap-[3px]">
        <span
          className="font-medium whitespace-nowrap leading-none"
          style={{ fontSize: "10px", color: "var(--txt)" }}
        >
          {label}
        </span>
        <span
          className="whitespace-nowrap leading-none"
          style={{ fontSize: "9px", color: "var(--txt-subtle)" }}
        >
          {sub}
        </span>
      </div>
    </motion.div>
  );
}
