"use client";

import React, { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { type Project, featuredProject, catalogProjects } from "@/data/projects";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useCursor } from "@/hooks/useCursorContext";
import { cn } from "@/lib/utils";
import { ease, duration, stagger, spring, viewport, viewportEarly } from "@/lib/motion";

// ── Section ───────────────────────────────────────────────────────────────────

export function Projects() {
  return (
    <section
      id="work"
      aria-label="Work"
      className="relative isolate py-[var(--section-py)]"
    >
      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)]">
        <SectionHeader />
        <FeaturedCase />
        <MoreSection />
      </div>
    </section>
  );
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader() {
  return (
    <motion.div
      className="flex items-center gap-6 mb-16 lg:mb-20"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow, ease: ease.out }}
      viewport={{ once: true, amount: 0.5 }}
    >
      <span className="text-[var(--text-overline)] uppercase tracking-[0.22em] text-accent font-medium shrink-0">
        Featured Work
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--brd)" }} />
      <span
        className="shrink-0 font-serif italic"
        style={{ fontSize: "var(--text-overline)", color: "var(--txt-subtle)" }}
      >
        01 / 0{1}
      </span>
    </motion.div>
  );
}

// ── Featured case study ───────────────────────────────────────────────────────

function FeaturedCase() {
  const p = featuredProject;

  const STORY_BLOCKS = [
    { label: "Problem",       text: p.problem      },
    { label: "Solution",      text: p.solution     },
    { label: "Architecture",  text: p.architecture },
  ] as const;

  return (
    <div className="mb-24 lg:mb-32">

      {/* Top meta */}
      <motion.div
        className="flex flex-wrap items-center gap-3 mb-7"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.slow, ease: ease.out }}
        viewport={viewport}
      >
        {p.category.split(" · ").map((tag) => (
          <span
            key={tag}
            className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium px-3 py-1 rounded-full border"
            style={{ borderColor: "var(--brd)", color: "var(--txt-subtle)" }}
          >
            {tag}
          </span>
        ))}
        <span
          className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium"
          style={{ color: "var(--txt-subtle)" }}
        >
          {p.year}
        </span>
        {p.metrics && (
          <span
            className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium text-accent"
          >
            · {p.metrics}
          </span>
        )}
      </motion.div>

      {/* Title */}
      <div className="overflow-hidden mb-4">
        <motion.h2
          className="font-serif text-foreground leading-[0.94] tracking-[-0.04em]"
          style={{ fontSize: "clamp(2.75rem, 6vw, 5.25rem)" }}
          initial={{ y: "105%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05, duration: duration.deliberate, ease: ease.out }}
          viewport={viewport}
        >
          {p.title}
        </motion.h2>
      </div>

      {/* Tagline */}
      <motion.p
        className="font-serif italic mb-10 lg:mb-12"
        style={{ fontSize: "clamp(1.05rem, 1.9vw, 1.35rem)", color: "var(--txt-muted)" }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: duration.slow, ease: ease.out }}
        viewport={viewport}
      >
        "The same mind made every layer."
      </motion.p>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[54fr_46fr] gap-14 xl:gap-20 items-start">

        {/* Left: story */}
        <div>
          {/* Wipe divider */}
          <motion.div
            className="h-px mb-10 origin-left"
            style={{ background: "var(--brd)" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.85, ease: ease.out }}
            viewport={{ once: true, amount: 0.8 }}
          />

          {/* Story blocks */}
          <div className="space-y-10 mb-10">
            {STORY_BLOCKS.map(({ label, text }, i) => text && (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * stagger.sm, duration: duration.slow, ease: ease.out }}
                viewport={viewportEarly}
              >
                <div className="flex items-center gap-4 mb-3">
                  <motion.div
                    className="h-px w-10 origin-left"
                    style={{ background: "linear-gradient(90deg, var(--acc), var(--acc-light))" }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: i * stagger.sm + 0.1, duration: 0.5, ease: ease.out }}
                    viewport={viewportEarly}
                  />
                  <h3 className="text-[var(--text-overline)] uppercase tracking-[0.22em] font-medium text-accent">
                    {label}
                  </h3>
                </div>
                <p
                  className="text-foreground leading-[1.85] font-light"
                  style={{ fontSize: "clamp(0.9375rem, 1.35vw, 1.05rem)" }}
                >
                  {text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Honest note */}
          {p.honest && (
            <motion.aside
              className="py-5 pl-6 mb-10 rounded-r-lg"
              style={{
                borderLeft: "2px solid var(--acc)",
                background: "linear-gradient(90deg, rgba(183,110,121,0.05) 0%, transparent 80%)",
              }}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: duration.slow, ease: ease.out }}
              viewport={{ once: true, amount: 0.6 }}
            >
              <p
                className="font-serif italic leading-relaxed"
                style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)", color: "var(--txt-muted)" }}
              >
                {p.honest}
              </p>
            </motion.aside>
          )}

          {/* Divider */}
          <div className="h-px mb-8" style={{ background: "var(--brd)" }} />

          {/* Tech + links */}
          <motion.div
            className="flex flex-wrap items-center justify-between gap-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.out }}
            viewport={viewport}
          >
            <div className="flex flex-wrap gap-2">
              {p.tech.map((t, i) => (
                <motion.span
                  key={t}
                  className="inline-flex items-center px-3 py-1.5 rounded-full border uppercase tracking-[0.13em] font-medium"
                  style={{
                    fontSize: "var(--text-overline)",
                    borderColor: "var(--brd)",
                    color: "var(--txt-muted)",
                    background: "var(--srf-1)",
                  }}
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: duration.base, ease: ease.gentle }}
                  viewport={viewport}
                >
                  {t}
                </motion.span>
              ))}
            </div>
            {p.repo && (
              <MagneticButton
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${p.title} on GitHub`}
              >
                View on GitHub
                <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
              </MagneticButton>
            )}
          </motion.div>
        </div>

        {/* Right: architecture visual */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 32, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: duration.cinematic, ease: ease.out, delay: 0.15 }}
          viewport={viewportEarly}
        >
          <FeaturedVisual />

          {/* Floating metric chips */}
          <motion.div
            className="absolute -top-4 -right-2 lg:-right-6 flex items-center gap-1.5 px-3.5 py-2 rounded-full border shadow-sm"
            style={{ background: "var(--srf-1)", borderColor: "var(--brd)" }}
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.45, ease: ease.gentle }}
            viewport={{ once: true }}
          >
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span
                className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full opacity-55"
                style={{ background: "rgb(34,197,94)" }}
              />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "rgb(34,197,94)" }} />
            </span>
            <span className="text-[9px] uppercase tracking-[0.18em] font-medium whitespace-nowrap" style={{ color: "var(--txt-muted)" }}>
              Solo build
            </span>
          </motion.div>

          <motion.div
            className="absolute -bottom-3 -left-2 lg:-left-6 flex items-center px-3.5 py-2 rounded-full border shadow-sm"
            style={{ background: "var(--srf-1)", borderColor: "var(--brd)" }}
            initial={{ opacity: 0, scale: 0.8, y: -8 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.45, ease: ease.gentle }}
            viewport={{ once: true }}
          >
            <span className="text-[9px] uppercase tracking-[0.18em] font-medium whitespace-nowrap" style={{ color: "var(--txt-muted)" }}>
              4 months · Full deployment
            </span>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}

// ── Featured architecture visual ──────────────────────────────────────────────
// Abstract system diagram: React → Django API → PostgreSQL

function FeaturedVisual() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        border: "1px solid var(--brd)",
        background: "var(--srf-1)",
        aspectRatio: "4 / 3",
      }}
      aria-hidden="true"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(183,110,121,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.25,
          backgroundImage: "radial-gradient(circle, rgba(183,110,121,0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Defs */}
        <defs>
          <linearGradient id="conn-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--acc)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--acc)" stopOpacity="0.15" />
          </linearGradient>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="3" in="SourceGraphic" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        <line x1="115" y1="150" x2="168" y2="150" stroke="url(#conn-grad)" strokeWidth="1.5" strokeDasharray="5 4" />
        <line x1="232" y1="150" x2="285" y2="150" stroke="url(#conn-grad)" strokeWidth="1.5" strokeDasharray="5 4" />

        {/* Vertical connection — API to DB */}
        <line x1="200" y1="190" x2="200" y2="225" stroke="rgba(183,110,121,0.2)" strokeWidth="1" strokeDasharray="3 4" />

        {/* React node */}
        <rect x="30" y="124" width="85" height="52" rx="10"
          fill="rgba(183,110,121,0.06)" stroke="rgba(183,110,121,0.3)" strokeWidth="1" />
        <text x="72" y="145" textAnchor="middle" fontSize="9" fill="var(--acc)" fontFamily="monospace" fontWeight="600">⚛</text>
        <text x="72" y="160" textAnchor="middle" fontSize="8.5" fill="var(--txt)" fontFamily="inherit">React</text>
        <text x="72" y="172" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">Client Layer</text>

        {/* Django API node — center, elevated */}
        <rect x="155" y="114" width="90" height="72" rx="10"
          fill="rgba(183,110,121,0.10)" stroke="var(--acc)" strokeWidth="1.5"
          filter="url(#node-glow)" />
        <text x="200" y="138" textAnchor="middle" fontSize="9" fill="var(--acc)" fontFamily="monospace" fontWeight="700">API</text>
        <text x="200" y="152" textAnchor="middle" fontSize="8.5" fill="var(--txt)" fontFamily="inherit">Django REST</text>
        <text x="200" y="164" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">Auth · Routing</text>
        <text x="200" y="176" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">Serialization</text>

        {/* PostgreSQL node */}
        <rect x="285" y="124" width="85" height="52" rx="10"
          fill="rgba(183,110,121,0.06)" stroke="rgba(183,110,121,0.3)" strokeWidth="1" />
        <text x="327" y="145" textAnchor="middle" fontSize="8" fill="var(--acc)" fontFamily="monospace">🗄</text>
        <text x="327" y="160" textAnchor="middle" fontSize="8.5" fill="var(--txt)" fontFamily="inherit">PostgreSQL</text>
        <text x="327" y="172" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">Progress Schema</text>

        {/* ORM badge below API */}
        <rect x="168" y="228" width="64" height="22" rx="6"
          fill="rgba(183,110,121,0.06)" stroke="rgba(183,110,121,0.2)" strokeWidth="1" />
        <text x="200" y="243" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">Django ORM</text>

        {/* Flow labels on arrows */}
        <text x="141" y="144" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="monospace">fetch</text>
        <text x="258" y="144" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="monospace">query</text>

        {/* Animated flow dot on left arrow */}
        <circle r="2.5" fill="var(--acc)" opacity="0.7">
          <animateMotion dur="2.4s" repeatCount="indefinite">
            <mpath href="#left-path" />
          </animateMotion>
        </circle>
        <path id="left-path" d="M115,150 L168,150" fill="none" />

        {/* Animated flow dot on right arrow */}
        <circle r="2.5" fill="var(--acc)" opacity="0.7">
          <animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite">
            <mpath href="#right-path" />
          </animateMotion>
        </circle>
        <path id="right-path" d="M232,150 L285,150" fill="none" />

        {/* Corner label */}
        <text x="20" y="28" fontSize="8" fill="var(--txt-subtle)" fontFamily="monospace" opacity="0.6">System Architecture</text>
        <text x="20" y="40" fontSize="7" fill="var(--txt-subtle)" fontFamily="monospace" opacity="0.5">HandyMath · Full-Stack</text>
      </svg>
    </div>
  );
}

// ── More projects section ──────────────────────────────────────────────────────

function MoreSection() {
  return (
    <>
      {/* Header */}
      <motion.div
        className="flex items-center gap-6 mb-10"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.slow, ease: ease.out }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <span className="text-[var(--text-overline)] uppercase tracking-[0.22em] text-accent font-medium shrink-0">
          More Work
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--brd)" }} />
        <span
          className="shrink-0 font-serif italic"
          style={{ fontSize: "var(--text-overline)", color: "var(--txt-subtle)" }}
        >
          {catalogProjects.length} projects
        </span>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
        {catalogProjects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </>
  );
}

// ── Catalog project card ───────────────────────────────────────────────────────

interface CardProps {
  project: Project;
  index: number;
}

function ProjectCard({ project, index }: CardProps) {
  const { setMode } = useCursor();
  const prefersReduced = useReducedMotion();

  // 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 380, damping: 30 });
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 380, damping: 30 });

  // Cursor shimmer
  const shimmerLeft = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const shimmerTop  = useTransform(mouseY, [-0.5, 0.5], [0, 100]);
  const shimmerBg   = useMotionTemplate`radial-gradient(circle at ${shimmerLeft}% ${shimmerTop}%, rgba(183,110,121,0.10) 0%, transparent 52%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5);
  }
  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    setMode("default");
  }

  const hasProblem = !!project.problem;

  return (
    <motion.article
      className={cn(
        "card-gradient-border",
        "group relative flex flex-col rounded-2xl overflow-hidden",
      )}
      style={prefersReduced ? {} : { transformPerspective: 900, rotateX, rotateY }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * stagger.xs, duration: duration.slow, ease: ease.out }}
      viewport={viewportEarly}
      whileHover={{ y: -5, transition: spring.snappy }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setMode("project")}
    >
      {/* Shimmer overlay */}
      {!prefersReduced && (
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-600 rounded-2xl z-10"
          style={{ background: shimmerBg }}
          aria-hidden="true"
        />
      )}

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-6 lg:p-7">

        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-5 relative z-10">
          <div className="min-w-0">
            <p
              className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium mb-1 truncate"
              style={{ color: "var(--txt-subtle)" }}
            >
              {project.category}
            </p>
            <h3
              className="font-serif text-foreground leading-tight"
              style={{ fontSize: "clamp(1.125rem, 1.8vw, 1.35rem)" }}
            >
              {project.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            <span
              className="text-[var(--text-overline)] font-medium tabular-nums"
              style={{ color: "var(--txt-subtle)" }}
            >
              {project.year}
            </span>
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-6 h-6 rounded-full border text-[var(--txt-subtle)] hover:border-[var(--acc)] hover:text-accent transition-colors duration-200"
                style={{ borderColor: "var(--brd)" }}
                aria-label={`View ${project.title} on GitHub`}
                onClick={(e) => e.stopPropagation()}
              >
                <ArrowUpRight size={11} strokeWidth={1.75} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {/* Abstract visual preview */}
        <div className="relative mb-5 overflow-hidden rounded-xl" style={{ height: 148 }}>
          <ProjectVisual id={project.id} />
        </div>

        {/* System description */}
        <p
          className="text-muted-foreground font-light leading-relaxed mb-4 relative z-10 flex-1"
          style={{ fontSize: "clamp(0.875rem, 1.2vw, 0.9375rem)" }}
        >
          {project.system}
        </p>

        {/* Impact metric */}
        {project.metrics && (
          <p
            className="text-[var(--text-overline)] uppercase tracking-[0.16em] font-medium text-accent mb-4 relative z-10"
          >
            {project.metrics}
          </p>
        )}

        {/* Tech pills */}
        <div
          className="pt-4 border-t flex flex-wrap gap-1.5 relative z-10"
          style={{ borderColor: "var(--brd)" }}
        >
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="inline-flex items-center px-2.5 py-[3px] rounded-md border uppercase tracking-[0.09em] font-medium"
              style={{
                fontSize: "8.5px",
                color: "var(--txt-muted)",
                borderColor: "var(--brd)",
                background: "var(--srf-0)",
              }}
            >
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span
              className="inline-flex items-center px-2 py-[3px] rounded-md font-medium"
              style={{ fontSize: "8.5px", color: "var(--txt-subtle)", background: "var(--srf-0)" }}
            >
              +{project.tech.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* ── Hover story overlay ───────────────────────────────────────── */}
      {hasProblem && (
        <div
          className="absolute inset-x-0 bottom-0 z-20 translate-y-full group-hover:translate-y-0"
          style={{
            transition: "transform 0.48s cubic-bezier(0.22,1,0.36,1)",
            height: "52%",
            background: "var(--glass-bg)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            borderTop: "1px solid var(--glass-brd)",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {project.problem && (
            <div>
              <p
                className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium text-accent mb-1"
              >
                Problem
              </p>
              <p
                className="font-light leading-snug"
                style={{ fontSize: "12px", color: "var(--txt-muted)" }}
              >
                {project.problem.length > 120
                  ? project.problem.slice(0, 120) + "…"
                  : project.problem}
              </p>
            </div>
          )}
          {project.solution && (
            <div>
              <p
                className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium text-accent mb-1"
              >
                Solution
              </p>
              <p
                className="font-light leading-snug"
                style={{ fontSize: "12px", color: "var(--txt-muted)" }}
              >
                {project.solution.length > 100
                  ? project.solution.slice(0, 100) + "…"
                  : project.solution}
              </p>
            </div>
          )}
          {project.architecture && (
            <p
              className="font-mono text-[10px] leading-snug mt-auto pt-2"
              style={{ color: "var(--txt-subtle)", borderTop: "1px solid var(--brd)" }}
            >
              ⌥ {project.architecture}
            </p>
          )}
        </div>
      )}
    </motion.article>
  );
}

// ── Abstract project visuals ───────────────────────────────────────────────────
// SVG-based abstract representations — never fake screenshots.

function ProjectVisual({ id }: { id: string }) {
  const BG = (
    <div
      className="absolute inset-0"
      style={{ background: "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(183,110,121,0.07) 0%, transparent 70%)" }}
    />
  );

  const base = "absolute inset-0 w-full h-full";

  if (id === "darlbanat") {
    return (
      <div className="absolute inset-0" style={{ background: "var(--srf-1)" }} aria-hidden="true">
        {BG}
        <svg viewBox="0 0 320 148" className={base}>
          {/* Table header */}
          <rect x="20" y="20" width="280" height="22" rx="4" fill="rgba(183,110,121,0.12)" stroke="rgba(183,110,121,0.25)" strokeWidth="0.8" />
          <text x="36" y="34" fontSize="7" fill="var(--acc)" fontFamily="monospace" fontWeight="700">ORDER</text>
          <text x="96" y="34" fontSize="7" fill="var(--acc)" fontFamily="monospace" fontWeight="700">ITEM</text>
          <text x="180" y="34" fontSize="7" fill="var(--acc)" fontFamily="monospace" fontWeight="700">STATUS</text>
          <text x="250" y="34" fontSize="7" fill="var(--acc)" fontFamily="monospace" fontWeight="700">TOTAL</text>
          {/* Rows */}
          {[
            { y: 55,  id: "#4821", item: "Tagine · 2×", status: "Done",    total: "240 MAD", hi: false },
            { y: 76,  id: "#4822", item: "Couscous · 1×", status: "Prep",  total: "85 MAD",  hi: true  },
            { y: 97,  id: "#4823", item: "Mint Tea · 4×", status: "Sent",  total: "60 MAD",  hi: false },
            { y: 118, id: "#4824", item: "Mechoui · 1×", status: "New",    total: "320 MAD", hi: false },
          ].map(({ y, id: oid, item, status, total, hi }) => (
            <g key={y}>
              {hi && <rect x="20" y={y - 12} width="280" height="18" rx="3" fill="rgba(183,110,121,0.07)" />}
              <text x="36" y={y} fontSize="7" fill="var(--txt-muted)" fontFamily="monospace">{oid}</text>
              <text x="96" y={y} fontSize="7" fill={hi ? "var(--txt)" : "var(--txt-subtle)"} fontFamily="inherit">{item}</text>
              <rect x="178" y={y - 10} width="38" height="13" rx="4"
                fill={status === "Done" ? "rgba(34,197,94,0.12)" : status === "New" ? "rgba(183,110,121,0.14)" : "rgba(234,179,8,0.12)"}
                stroke={status === "Done" ? "rgba(34,197,94,0.3)" : status === "New" ? "rgba(183,110,121,0.3)" : "rgba(234,179,8,0.3)"}
                strokeWidth="0.6" />
              <text x="197" y={y} textAnchor="middle" fontSize="6.5"
                fill={status === "Done" ? "rgb(34,197,94)" : status === "New" ? "var(--acc)" : "rgb(202,138,4)"}
                fontFamily="inherit">{status}</text>
              <text x="250" y={y} fontSize="7" fill="var(--txt-subtle)" fontFamily="monospace">{total}</text>
            </g>
          ))}
          <line x1="20" y1="130" x2="300" y2="130" stroke="rgba(183,110,121,0.1)" strokeWidth="0.6" />
        </svg>
      </div>
    );
  }

  if (id === "flowforge-etl") {
    return (
      <div className="absolute inset-0" style={{ background: "var(--srf-1)" }} aria-hidden="true">
        {BG}
        <svg viewBox="0 0 320 148" className={base}>
          <defs>
            <linearGradient id="flow-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--acc)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--acc)" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {/* Pipeline nodes */}
          {[
            { x: 24,  label: "RAW",       sub: "CSV files",   icon: "📂" },
            { x: 97,  label: "TRANSFORM", sub: "Pandas",      icon: "⚡" },
            { x: 184, label: "STORE",     sub: "SQLAlchemy",  icon: "🗄" },
            { x: 257, label: "EXPOSE",    sub: "FastAPI",     icon: "🔌" },
          ].map(({ x, label, sub, icon }, i) => (
            <g key={i}>
              <rect x={x} y="45" width="55" height="58" rx="8"
                fill={i === 1 || i === 2 ? "rgba(183,110,121,0.10)" : "rgba(183,110,121,0.05)"}
                stroke={i === 1 ? "var(--acc)" : "rgba(183,110,121,0.25)"}
                strokeWidth={i === 1 ? "1.2" : "0.8"} />
              <text x={x + 27} y="66" textAnchor="middle" fontSize="14" fontFamily="inherit">{icon}</text>
              <text x={x + 27} y="82" textAnchor="middle" fontSize="7" fill="var(--txt)" fontFamily="inherit" fontWeight={i === 1 ? "600" : "400"}>{label}</text>
              <text x={x + 27} y="94" textAnchor="middle" fontSize="6.5" fill="var(--txt-subtle)" fontFamily="monospace">{sub}</text>
            </g>
          ))}
          {/* Arrows */}
          {[79, 152, 239].map((x) => (
            <g key={x}>
              <line x1={x} y1="74" x2={x + 18} y2="74" stroke="url(#flow-grad)" strokeWidth="1.2" strokeDasharray="4 3" />
              <polygon points={`${x + 18},70 ${x + 25},74 ${x + 18},78`} fill="rgba(183,110,121,0.4)" />
            </g>
          ))}
          {/* Animated dot */}
          <circle r="2.5" fill="var(--acc)" opacity="0.8">
            <animateMotion dur="3s" repeatCount="indefinite">
              <mpath href="#pipeline-path" />
            </animateMotion>
          </circle>
          <path id="pipeline-path" d="M24,74 L312,74" fill="none" />
          {/* Labels */}
          <text x="160" y="128" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="monospace" opacity="0.7">
            Automated · Zero manual steps
          </text>
        </svg>
      </div>
    );
  }

  if (id === "nacim2") {
    return (
      <div className="absolute inset-0" style={{ background: "var(--srf-1)" }} aria-hidden="true">
        {BG}
        <svg viewBox="0 0 320 148" className={base}>
          {/* Search bar */}
          <rect x="20" y="16" width="280" height="20" rx="6" fill="rgba(183,110,121,0.05)" stroke="rgba(183,110,121,0.2)" strokeWidth="0.8" />
          <text x="35" y="29" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">🔍  Search land in Rabat…</text>
          {/* Property cards grid 3×2 */}
          {[
            { x: 20,  y: 48, hi: false },
            { x: 120, y: 48, hi: true  },
            { x: 220, y: 48, hi: false },
            { x: 20,  y: 98, hi: false },
            { x: 120, y: 98, hi: false },
            { x: 220, y: 98, hi: false },
          ].map(({ x, y, hi }, i) => (
            <g key={i}>
              <rect x={x} y={y} width="90" height="44" rx="6"
                fill={hi ? "rgba(183,110,121,0.10)" : "rgba(183,110,121,0.04)"}
                stroke={hi ? "var(--acc)" : "rgba(183,110,121,0.18)"}
                strokeWidth={hi ? "1.2" : "0.7"} />
              {/* Land icon */}
              <rect x={x + 6} y={y + 6} width="20" height="14" rx="2" fill={hi ? "rgba(183,110,121,0.25)" : "rgba(183,110,121,0.1)"} />
              <text x={x + 16} y={y + 17} textAnchor="middle" fontSize="9" fontFamily="inherit">🏡</text>
              <rect x={x + 32} y={y + 8} width="45" height="4" rx="2" fill="rgba(183,110,121,0.12)" />
              <rect x={x + 32} y={y + 16} width="30" height="3" rx="1.5" fill="rgba(183,110,121,0.08)" />
              <rect x={x + 32} y={y + 23} width="38" height="3" rx="1.5" fill="rgba(183,110,121,0.08)" />
              <text x={x + 8} y={y + 40} fontSize="6" fill={hi ? "var(--acc)" : "var(--txt-subtle)"} fontFamily="monospace">
                {hi ? "✓ Selected" : `${120 + i * 35}m²`}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  if (id === "yazaki") {
    return (
      <div className="absolute inset-0" style={{ background: "var(--srf-1)" }} aria-hidden="true">
        {BG}
        <svg viewBox="0 0 320 148" className={base}>
          <text x="20" y="28" fontSize="8.5" fill="var(--txt-subtle)" fontFamily="inherit">Weekly BOM Processing Time</text>
          {/* Before bar */}
          <text x="20" y="56" fontSize="7.5" fill="var(--txt-muted)" fontFamily="inherit">Before</text>
          <rect x="20" y="62" width="248" height="22" rx="5" fill="rgba(183,110,121,0.08)" stroke="rgba(183,110,121,0.2)" strokeWidth="0.8" />
          <rect x="20" y="62" width="248" height="22" rx="5" fill="rgba(183,110,121,0.18)" />
          <text x="275" y="77" fontSize="9" fill="var(--txt-muted)" fontFamily="monospace" fontWeight="700">8h</text>
          {/* After bar */}
          <text x="20" y="106" fontSize="7.5" fill="var(--txt-muted)" fontFamily="inherit">After</text>
          <rect x="20" y="112" width="248" height="22" rx="5" fill="rgba(183,110,121,0.04)" stroke="rgba(183,110,121,0.15)" strokeWidth="0.8" />
          <rect x="20" y="112" width="9" height="22" rx="5" fill="var(--acc)" />
          <text x="275" y="127" fontSize="9" fill="var(--acc)" fontFamily="monospace" fontWeight="700">4m</text>
          {/* Delta label */}
          <text x="160" y="95" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit" opacity="0.8">
            ↓ 99.2% reduction
          </text>
        </svg>
      </div>
    );
  }

  if (id === "fintech-predict") {
    return (
      <div className="absolute inset-0" style={{ background: "var(--srf-1)" }} aria-hidden="true">
        {BG}
        <svg viewBox="0 0 320 148" className={base}>
          {/* Axes */}
          <line x1="30" y1="20" x2="30" y2="120" stroke="rgba(183,110,121,0.2)" strokeWidth="0.8" />
          <line x1="30" y1="120" x2="300" y2="120" stroke="rgba(183,110,121,0.2)" strokeWidth="0.8" />
          {/* Grid lines */}
          {[40, 60, 80, 100].map((y) => (
            <line key={y} x1="30" y1={y} x2="300" y2={y} stroke="rgba(183,110,121,0.07)" strokeWidth="0.6" strokeDasharray="4 4" />
          ))}
          {/* Confidence band */}
          <path
            d="M30,95 C60,88 90,72 120,70 C150,68 180,58 210,50 C240,42 270,35 300,30 L300,60 C270,65 240,70 210,75 C180,78 150,84 120,92 C90,98 60,105 30,108 Z"
            fill="rgba(183,110,121,0.10)"
          />
          {/* Main forecast line */}
          <path
            d="M30,95 C60,88 90,72 120,70 C150,68 180,58 210,50 C240,42 270,35 300,30"
            fill="none" stroke="var(--acc)" strokeWidth="1.8" strokeLinecap="round"
          />
          {/* Prediction boundary */}
          <line x1="210" y1="20" x2="210" y2="120" stroke="rgba(183,110,121,0.35)" strokeWidth="1" strokeDasharray="4 3" />
          <text x="213" y="30" fontSize="6.5" fill="var(--txt-subtle)" fontFamily="monospace">Predict →</text>
          {/* Axis labels */}
          <text x="20" y="128" fontSize="6.5" fill="var(--txt-subtle)" fontFamily="monospace">t=0</text>
          <text x="284" y="128" fontSize="6.5" fill="var(--txt-subtle)" fontFamily="monospace">t=n</text>
          <text x="14" y="52" fontSize="6.5" fill="var(--txt-subtle)" fontFamily="monospace" transform="rotate(-90 14,52)">price</text>
          <text x="60" y="140" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit" opacity="0.7">LSTM · Keras · Confidence band</text>
        </svg>
      </div>
    );
  }

  // Default fallback (shouldn't be reached for known IDs)
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: "var(--srf-1)" }}
      aria-hidden="true"
    >
      {BG}
      <span className="text-[var(--txt-subtle)] font-mono text-xs uppercase tracking-widest">
        {id}
      </span>
    </div>
  );
}
