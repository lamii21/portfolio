"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { type Project } from "@/data/projects";
import { ease, duration, viewport } from "@/lib/motion";

// ── Section navigation config ─────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: "cs-context",    label: "Context" },
  { id: "cs-arch",       label: "Architecture" },
  { id: "cs-tech",       label: "Technical Choices" },
  { id: "cs-timeline",   label: "Timeline" },
  { id: "cs-challenges", label: "Challenges" },
  { id: "cs-impact",     label: "Impact" },
  { id: "cs-learned",    label: "What I Learned" },
] as const;

// ── Motion helpers ─────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.slow, ease: ease.out } },
};

// ── Main component ────────────────────────────────────────────────────────────

interface CaseStudyViewProps {
  project: Project;
  allProjects: Project[];
}

export function CaseStudyView({ project, allProjects }: CaseStudyViewProps) {
  const [activeSection, setActiveSection] = useState<string>("cs-context");
  const reduced = useReducedMotion();

  const cs = project.caseStudy;

  // Scroll spy — track which section is in the viewport
  useEffect(() => {
    const els = NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Prev / next project navigation
  const idx = allProjects.findIndex((p) => p.id === project.id);
  const prev = allProjects[idx - 1] ?? null;
  const next = allProjects[idx + 1] ?? null;

  return (
    <div className="min-h-screen" style={{ background: "var(--srf-0)" }}>

      {/* ── Top navigation bar ─────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-50 border-b"
        style={{ background: "var(--srf-0)", borderColor: "var(--brd)" }}
      >
        <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)] h-14 flex items-center justify-between">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:text-accent"
            style={{ color: "var(--txt-muted)" }}
          >
            <ArrowLeft size={15} strokeWidth={1.75} aria-hidden="true" />
            Back to work
          </Link>
          <span
            className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium hidden sm:block"
            style={{ fontSize: "10px", color: "var(--txt-subtle)" }}
          >
            {project.category} · {project.year}
          </span>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)] pt-16 pb-12 lg:pt-20 lg:pb-16">

        {/* Category + year pill row */}
        <motion.div
          className="flex flex-wrap items-center gap-3 mb-6"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          {project.category.split(" · ").map((tag) => (
            <span
              key={tag}
              className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium px-3 py-1 rounded-full border"
              style={{ borderColor: "var(--brd)", color: "var(--txt-subtle)", fontSize: "10px" }}
            >
              {tag}
            </span>
          ))}
          <span
            className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium"
            style={{ color: "var(--txt-subtle)", fontSize: "10px" }}
          >
            {project.year}
          </span>
        </motion.div>

        {/* Title */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            className="font-serif text-foreground leading-[0.94] tracking-[-0.04em]"
            style={{ fontSize: "clamp(2.75rem, 6vw, 5.5rem)" }}
            initial={reduced ? false : { y: "105%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08, duration: duration.deliberate, ease: ease.out }}
          >
            {project.title}
          </motion.h1>
        </div>

        {/* System tagline */}
        <motion.p
          className="font-serif italic max-w-2xl mb-10"
          style={{ fontSize: "clamp(1rem, 1.9vw, 1.3rem)", color: "var(--txt-muted)" }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          {project.system}
        </motion.p>

        {/* Impact chips */}
        {cs && (
          <motion.div
            className="flex flex-wrap gap-3"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            {cs.impact.map(({ metric, description }) => (
              <div
                key={metric}
                className="flex items-baseline gap-2 px-4 py-2.5 rounded-xl border"
                style={{ background: "var(--srf-1)", borderColor: "var(--brd)" }}
              >
                <span
                  className="font-serif font-medium"
                  style={{ fontSize: "clamp(1rem, 1.8vw, 1.25rem)", color: "var(--acc)" }}
                >
                  {metric}
                </span>
                <span
                  className="font-light leading-tight"
                  style={{ fontSize: "11px", color: "var(--txt-subtle)" }}
                >
                  {description}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Divider */}
      <div
        className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)]"
      >
        <div className="h-px" style={{ background: "var(--brd)" }} />
      </div>

      {/* ── Main content + sticky nav ──────────────────────────────────── */}
      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)] py-16">
        <div className="flex gap-16 xl:gap-24">

          {/* Sticky side navigation (desktop only) */}
          <aside className="hidden lg:block shrink-0 w-44">
            <nav className="sticky top-24 space-y-1">
              <p
                className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium mb-4"
                style={{ fontSize: "9px", color: "var(--txt-subtle)" }}
              >
                Contents
              </p>
              {NAV_SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="flex items-center gap-2.5 py-1.5 text-sm font-light transition-all duration-200 group"
                  style={{
                    color: activeSection === id ? "var(--acc)" : "var(--txt-subtle)",
                    fontSize: "13px",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  <span
                    className="shrink-0 h-px transition-all duration-300"
                    style={{
                      width: activeSection === id ? 20 : 10,
                      background: activeSection === id ? "var(--acc)" : "var(--brd-strong)",
                    }}
                    aria-hidden="true"
                  />
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-20 lg:space-y-28">

            {/* ── Section 1: Context ──────────────────────────────────── */}
            <section id="cs-context" aria-label="Context and objectives">
              <SectionHeading number="01" title="Context" />

              {cs ? (
                <>
                  <motion.p
                    className="leading-[1.88] font-light mb-10"
                    style={{ fontSize: "clamp(1rem, 1.5vw, 1.1rem)", color: "var(--txt-muted)" }}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                  >
                    {cs.context}
                  </motion.p>

                  <div>
                    <p
                      className="text-[var(--text-overline)] uppercase tracking-[0.22em] font-medium text-accent mb-5"
                      style={{ fontSize: "10px" }}
                    >
                      Objectives
                    </p>
                    <ul className="space-y-3">
                      {cs.objectives.map((obj, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start gap-3 font-light leading-relaxed"
                          style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)", color: "var(--txt-muted)" }}
                          initial={reduced ? false : { opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.07, duration: duration.slow, ease: ease.out }}
                          viewport={viewport}
                        >
                          <span
                            className="mt-2 shrink-0 w-1 h-1 rounded-full"
                            style={{ background: "var(--acc)" }}
                            aria-hidden="true"
                          />
                          {obj}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Honest note if available */}
                  {project.honest && (
                    <motion.aside
                      className="mt-10 py-5 pl-6 rounded-r-lg"
                      style={{
                        borderLeft: "2px solid var(--acc)",
                        background: "linear-gradient(90deg, rgba(183,110,121,0.04) 0%, transparent 80%)",
                      }}
                      initial={reduced ? false : { clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                      whileInView={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                      transition={{ delay: 0.2, duration: duration.deliberate, ease: ease.out }}
                      viewport={{ once: true, amount: 0.5 }}
                    >
                      <p
                        className="font-serif italic leading-relaxed"
                        style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)", color: "var(--txt-muted)" }}
                      >
                        {project.honest}
                      </p>
                    </motion.aside>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground font-light leading-[1.85]">{project.system}</p>
              )}
            </section>

            {/* ── Section 2: Architecture ─────────────────────────────── */}
            <section id="cs-arch" aria-label="System architecture">
              <SectionHeading number="02" title="Architecture" />
              <ArchitectureDiagram project={project} />
              {project.architecture && (
                <p
                  className="mt-6 font-mono leading-relaxed"
                  style={{ fontSize: "12px", color: "var(--txt-subtle)" }}
                >
                  ⌥ {project.architecture}
                </p>
              )}
            </section>

            {/* ── Section 3: Technical Choices ────────────────────────── */}
            {cs && (
              <section id="cs-tech" aria-label="Technical choices">
                <SectionHeading number="03" title="Technical Choices" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cs.techChoices.map((choice, i) => (
                    <motion.div
                      key={choice.name}
                      className="p-5 rounded-xl border"
                      style={{ background: "var(--srf-1)", borderColor: "var(--brd)" }}
                      initial={reduced ? false : { opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: duration.slow, ease: ease.out }}
                      viewport={viewport}
                    >
                      <p
                        className="font-medium mb-2"
                        style={{ fontSize: "13px", color: "var(--acc)" }}
                      >
                        {choice.name}
                      </p>
                      <p
                        className="font-light leading-relaxed"
                        style={{ fontSize: "13px", color: "var(--txt-muted)" }}
                      >
                        {choice.reason}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Section 4: Timeline ──────────────────────────────────── */}
            {cs && (
              <section id="cs-timeline" aria-label="Project timeline">
                <SectionHeading number="04" title="Timeline" />
                <div className="relative">
                  {/* Vertical line */}
                  <div
                    className="absolute left-[7px] top-2 bottom-2 w-px"
                    style={{ background: "var(--brd)" }}
                    aria-hidden="true"
                  />
                  <div className="space-y-8">
                    {cs.timeline.map((item, i) => (
                      <motion.div
                        key={item.milestone}
                        className="relative flex gap-6 pl-8"
                        initial={reduced ? false : { opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.09, duration: duration.slow, ease: ease.out }}
                        viewport={viewport}
                      >
                        {/* Node */}
                        <div
                          className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                          style={{
                            borderColor: "var(--acc)",
                            background: "var(--srf-0)",
                          }}
                          aria-hidden="true"
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "var(--acc)" }}
                          />
                        </div>

                        <div className="flex-1 pb-2">
                          <div className="flex flex-wrap items-baseline gap-3 mb-1.5">
                            <h3
                              className="font-serif text-foreground"
                              style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)" }}
                            >
                              {item.milestone}
                            </h3>
                            <span
                              className="text-[var(--text-overline)] uppercase tracking-[0.14em] font-medium px-2 py-0.5 rounded-md"
                              style={{
                                fontSize: "9px",
                                color: "var(--acc)",
                                background: "rgba(183,110,121,0.08)",
                              }}
                            >
                              {item.duration}
                            </span>
                          </div>
                          <p
                            className="font-light leading-relaxed"
                            style={{ fontSize: "13.5px", color: "var(--txt-muted)" }}
                          >
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── Section 5: Challenges ───────────────────────────────── */}
            {cs && (
              <section id="cs-challenges" aria-label="Challenges and solutions">
                <SectionHeading number="05" title="Challenges" />
                <div className="space-y-5">
                  {cs.challenges.map((c, i) => (
                    <motion.div
                      key={c.title}
                      className="rounded-2xl border overflow-hidden"
                      style={{ borderColor: "var(--brd)" }}
                      initial={reduced ? false : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: duration.slow, ease: ease.out }}
                      viewport={viewport}
                    >
                      {/* Challenge header */}
                      <div
                        className="px-6 py-4 border-b"
                        style={{ background: "var(--srf-1)", borderColor: "var(--brd)" }}
                      >
                        <h3
                          className="font-serif text-foreground"
                          style={{ fontSize: "clamp(1rem, 1.5vw, 1.1rem)" }}
                        >
                          {c.title}
                        </h3>
                      </div>

                      {/* Body + solution */}
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ "--tw-divide-opacity": "1", borderColor: "var(--brd)" } as React.CSSProperties}>
                        <div className="px-6 py-5">
                          <p
                            className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium mb-3 text-accent"
                            style={{ fontSize: "9px" }}
                          >
                            Problem
                          </p>
                          <p
                            className="font-light leading-[1.78]"
                            style={{ fontSize: "13.5px", color: "var(--txt-muted)" }}
                          >
                            {c.body}
                          </p>
                        </div>
                        <div className="px-6 py-5" style={{ background: "rgba(183,110,121,0.025)" }}>
                          <p
                            className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium mb-3"
                            style={{ fontSize: "9px", color: "rgb(34,197,94)" }}
                          >
                            Solution
                          </p>
                          <p
                            className="font-light leading-[1.78]"
                            style={{ fontSize: "13.5px", color: "var(--txt-muted)" }}
                          >
                            {c.solution}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Section 6: Impact ───────────────────────────────────── */}
            {cs && (
              <section id="cs-impact" aria-label="Results and impact">
                <SectionHeading number="06" title="Impact" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {cs.impact.map(({ metric, description }, i) => (
                    <motion.div
                      key={metric}
                      className="p-6 rounded-2xl border text-center"
                      style={{ background: "var(--srf-1)", borderColor: "var(--brd)" }}
                      initial={reduced ? false : { opacity: 0, scale: 0.93 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1, duration: duration.slow, ease: ease.out }}
                      viewport={viewport}
                    >
                      <div
                        className="font-serif font-medium mb-2 leading-tight"
                        style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: "var(--acc)" }}
                      >
                        {metric}
                      </div>
                      <p
                        className="font-light leading-snug"
                        style={{ fontSize: "12.5px", color: "var(--txt-subtle)" }}
                      >
                        {description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Section 7: What I Learned ───────────────────────────── */}
            {cs && (
              <section id="cs-learned" aria-label="What I learned">
                <SectionHeading number="07" title="What I Learned" />
                <div className="space-y-8">
                  {cs.learned.map((item, i) => (
                    <motion.div
                      key={item.title}
                      className="flex gap-5"
                      initial={reduced ? false : { opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: duration.slow, ease: ease.out }}
                      viewport={viewport}
                    >
                      <div
                        className="shrink-0 font-serif italic"
                        style={{
                          fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                          color: "rgba(183,110,121,0.18)",
                          lineHeight: 1,
                          minWidth: "2.5rem",
                        }}
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <h3
                          className="font-serif text-foreground mb-2"
                          style={{ fontSize: "clamp(1rem, 1.5vw, 1.1rem)" }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="font-light leading-[1.85]"
                          style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)", color: "var(--txt-muted)" }}
                        >
                          {item.body}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Tech stack */}
                <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--brd)" }}>
                  <p
                    className="text-[var(--text-overline)] uppercase tracking-[0.22em] font-medium text-accent mb-5"
                    style={{ fontSize: "10px" }}
                  >
                    Technologies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center px-3 py-1.5 rounded-full border uppercase tracking-[0.13em] font-medium"
                        style={{
                          fontSize: "10px",
                          borderColor: "var(--brd)",
                          color: "var(--txt-muted)",
                          background: "var(--srf-1)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Source link */}
                  {project.repo && (
                    <div className="mt-6">
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:text-accent"
                        style={{ color: "var(--txt-muted)" }}
                        aria-label={`View ${project.title} source on GitHub`}
                      >
                        View on GitHub
                        <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </div>
              </section>
            )}

          </div>
        </div>
      </div>

      {/* ── Footer navigation ──────────────────────────────────────────── */}
      <div
        className="border-t mt-8"
        style={{ borderColor: "var(--brd)" }}
      >
        <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)] py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

            {prev ? (
              <Link
                href={`/work/${prev.id}`}
                className="group flex items-center gap-3 transition-colors duration-200 hover:text-accent"
                style={{ color: "var(--txt-muted)" }}
              >
                <ArrowLeft
                  size={16}
                  strokeWidth={1.5}
                  className="transition-transform duration-200 group-hover:-translate-x-1"
                  aria-hidden="true"
                />
                <div>
                  <p
                    className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium mb-0.5"
                    style={{ fontSize: "9px", color: "var(--txt-subtle)" }}
                  >
                    Previous
                  </p>
                  <span className="font-serif" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)" }}>
                    {prev.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            <Link
              href="/#work"
              className="text-sm font-medium transition-colors duration-200 hover:text-accent"
              style={{ color: "var(--txt-subtle)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              All work
            </Link>

            {next ? (
              <Link
                href={`/work/${next.id}`}
                className="group flex items-center gap-3 text-right sm:text-right transition-colors duration-200 hover:text-accent"
                style={{ color: "var(--txt-muted)" }}
              >
                <div>
                  <p
                    className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium mb-0.5"
                    style={{ fontSize: "9px", color: "var(--txt-subtle)" }}
                  >
                    Next
                  </p>
                  <span className="font-serif" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)" }}>
                    {next.title}
                  </span>
                </div>
                <ArrowLeft
                  size={16}
                  strokeWidth={1.5}
                  className="rotate-180 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

// ── Section heading component ─────────────────────────────────────────────────

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span
        className="font-serif italic shrink-0 select-none"
        style={{ fontSize: "clamp(0.85rem, 1.2vw, 1rem)", color: "var(--txt-subtle)" }}
        aria-hidden="true"
      >
        {number}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--brd)" }} aria-hidden="true" />
      <h2
        className="font-serif text-foreground shrink-0"
        style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)" }}
      >
        {title}
      </h2>
    </div>
  );
}

// ── Architecture diagrams ─────────────────────────────────────────────────────
// One SVG diagram per project — detailed system architecture.

function ArchitectureDiagram({ project }: { project: Project }) {
  const id = project.id;

  const containerStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    borderRadius: "1rem",
    border: "1px solid var(--brd)",
    background: "var(--srf-1)",
    aspectRatio: "16 / 7",
  };

  const BG = (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(183,110,121,0.07) 0%, transparent 70%)",
      }}
    />
  );

  const dotGrid = (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.18,
        backgroundImage: "radial-gradient(circle, rgba(183,110,121,0.6) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 80%)",
      }}
    />
  );

  // ── HandyMath ── React → JWT → Django → ORM → PostgreSQL + entities
  if (id === "handymath") {
    return (
      <div style={containerStyle} aria-hidden="true">
        {BG}{dotGrid}
        <svg viewBox="0 0 700 240" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="hm-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--acc)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--acc)" stopOpacity="0.1" />
            </linearGradient>
            <filter id="hm-glow"><feGaussianBlur stdDeviation="3" in="SourceGraphic" result="b" /><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* Connection lines */}
          <line x1="110" y1="110" x2="178" y2="110" stroke="url(#hm-grad)" strokeWidth="1.5" strokeDasharray="5 4"/>
          <line x1="110" y1="110" x2="178" y2="110" stroke="var(--acc)" strokeWidth="0" />
          <text x="143" y="104" textAnchor="middle" fontSize="8" fill="var(--txt-subtle)" fontFamily="monospace">JWT</text>

          <line x1="258" y1="110" x2="330" y2="110" stroke="url(#hm-grad)" strokeWidth="1.5" strokeDasharray="5 4"/>

          <line x1="410" y1="110" x2="478" y2="110" stroke="url(#hm-grad)" strokeWidth="1.5" strokeDasharray="5 4"/>
          <text x="443" y="104" textAnchor="middle" fontSize="8" fill="var(--txt-subtle)" fontFamily="monospace">ORM</text>

          {/* Vertical to entities */}
          <line x1="570" y1="150" x2="570" y2="175" stroke="rgba(183,110,121,0.25)" strokeWidth="1" strokeDasharray="3 3"/>
          <line x1="460" y1="182" x2="680" y2="182" stroke="rgba(183,110,121,0.15)" strokeWidth="1"/>

          {/* React node */}
          <rect x="20" y="82" width="90" height="56" rx="10" fill="rgba(183,110,121,0.06)" stroke="rgba(183,110,121,0.28)" strokeWidth="1"/>
          <text x="65" y="106" textAnchor="middle" fontSize="11" fill="var(--acc)" fontFamily="monospace">⚛</text>
          <text x="65" y="122" textAnchor="middle" fontSize="8.5" fill="var(--txt)" fontFamily="inherit">React</text>
          <text x="65" y="133" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">Client</text>

          {/* Django API node — center, highlighted */}
          <rect x="178" y="72" width="80" height="76" rx="10" fill="rgba(183,110,121,0.11)" stroke="var(--acc)" strokeWidth="1.5" filter="url(#hm-glow)"/>
          <text x="218" y="98" textAnchor="middle" fontSize="9" fill="var(--acc)" fontFamily="monospace" fontWeight="700">API</text>
          <text x="218" y="112" textAnchor="middle" fontSize="8" fill="var(--txt)" fontFamily="inherit">Django REST</text>
          <text x="218" y="124" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">Auth · Views</text>
          <text x="218" y="135" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">Serializers</text>

          {/* Django ORM badge */}
          <rect x="308" y="90" width="102" height="40" rx="8" fill="rgba(183,110,121,0.06)" stroke="rgba(183,110,121,0.22)" strokeWidth="1"/>
          <text x="359" y="107" textAnchor="middle" fontSize="8" fill="var(--acc)" fontFamily="monospace">Django ORM</text>
          <text x="359" y="121" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">Models · Migrations</text>

          {/* PostgreSQL node */}
          <rect x="478" y="82" width="90" height="56" rx="10" fill="rgba(183,110,121,0.06)" stroke="rgba(183,110,121,0.28)" strokeWidth="1"/>
          <text x="523" y="106" textAnchor="middle" fontSize="10" fill="var(--acc)" fontFamily="monospace">🗄</text>
          <text x="523" y="120" textAnchor="middle" fontSize="8.5" fill="var(--txt)" fontFamily="inherit">PostgreSQL</text>
          <text x="523" y="132" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">Progress Schema</text>

          {/* Entity boxes */}
          {[
            { x: 458, label: "User", cols: "id · email" },
            { x: 548, label: "Progress", cols: "score · date" },
            { x: 638, label: "Exercise", cols: "topic · level" },
          ].map(({ x, label, cols }) => (
            <g key={label}>
              <rect x={x} y={184} width={80} height={36} rx="5" fill="rgba(183,110,121,0.05)" stroke="rgba(183,110,121,0.18)" strokeWidth="0.8"/>
              <text x={x + 40} y={199} textAnchor="middle" fontSize="7.5" fill="var(--txt)" fontFamily="inherit" fontWeight="500">{label}</text>
              <text x={x + 40} y={212} textAnchor="middle" fontSize="6.5" fill="var(--txt-subtle)" fontFamily="monospace">{cols}</text>
            </g>
          ))}

          {/* Animated flow dots */}
          <circle r="2.5" fill="var(--acc)" opacity="0.75">
            <animateMotion dur="2.8s" repeatCount="indefinite"><mpath href="#hm-path1"/></animateMotion>
          </circle>
          <path id="hm-path1" d="M110,110 L178,110" fill="none"/>
          <circle r="2.5" fill="var(--acc)" opacity="0.75">
            <animateMotion dur="2.8s" begin="0.9s" repeatCount="indefinite"><mpath href="#hm-path2"/></animateMotion>
          </circle>
          <path id="hm-path2" d="M258,110 L330,110" fill="none"/>
          <circle r="2.5" fill="var(--acc)" opacity="0.75">
            <animateMotion dur="2.8s" begin="1.8s" repeatCount="indefinite"><mpath href="#hm-path3"/></animateMotion>
          </circle>
          <path id="hm-path3" d="M410,110 L478,110" fill="none"/>

          <text x="20" y="30" fontSize="8" fill="var(--txt-subtle)" fontFamily="monospace" opacity="0.6">System Architecture · HandyMath</text>
        </svg>
      </div>
    );
  }

  // ── FlowForge ETL ── CSV → Validate → Pandas → SQLAlchemy → FastAPI
  if (id === "flowforge-etl") {
    return (
      <div style={containerStyle} aria-hidden="true">
        {BG}{dotGrid}
        <svg viewBox="0 0 700 240" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="ff-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--acc)" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="var(--acc)" stopOpacity="0.1"/>
            </linearGradient>
          </defs>

          {/* Pipeline stages */}
          {[
            { x: 20,  icon: "📂", label: "RAW",      sub: "CSV / files",   hi: false },
            { x: 150, icon: "✓",  label: "VALIDATE",  sub: "Schema check",  hi: false },
            { x: 285, icon: "⚡", label: "TRANSFORM", sub: "Pandas",        hi: true  },
            { x: 420, icon: "🗄", label: "PERSIST",   sub: "SQLAlchemy",    hi: false },
            { x: 555, icon: "🔌", label: "EXPOSE",    sub: "FastAPI",       hi: false },
          ].map(({ x, icon, label, sub, hi }, i) => (
            <g key={i}>
              <rect x={x} y={75} width={100} height={72} rx="10"
                fill={hi ? "rgba(183,110,121,0.12)" : "rgba(183,110,121,0.05)"}
                stroke={hi ? "var(--acc)" : "rgba(183,110,121,0.25)"}
                strokeWidth={hi ? "1.5" : "0.8"}/>
              <text x={x + 50} y={100} textAnchor="middle" fontSize="16" fontFamily="inherit">{icon}</text>
              <text x={x + 50} y={116} textAnchor="middle" fontSize="8" fill="var(--txt)" fontFamily="inherit" fontWeight={hi ? "600" : "400"}>{label}</text>
              <text x={x + 50} y={128} textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="monospace">{sub}</text>
            </g>
          ))}

          {/* Arrows between stages */}
          {[120, 250, 385, 520].map((x) => (
            <g key={x}>
              <line x1={x} y1="111" x2={x + 30} y2="111" stroke="url(#ff-grad)" strokeWidth="1.3" strokeDasharray="4 3"/>
              <polygon points={`${x+30},107 ${x+38},111 ${x+30},115`} fill="rgba(183,110,121,0.4)"/>
            </g>
          ))}

          {/* Rejection path from validate */}
          <line x1="200" y1="147" x2="200" y2="190" stroke="rgba(183,110,121,0.3)" strokeWidth="1" strokeDasharray="4 3"/>
          <rect x="155" y="190" width="90" height="30" rx="5" fill="rgba(183,110,121,0.06)" stroke="rgba(183,110,121,0.2)" strokeWidth="0.8"/>
          <text x="200" y="207" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="monospace">Error log</text>
          <text x="200" y="217" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">Reject + alert</text>
          <text x="213" y="157" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">✕ invalid</text>

          {/* Animated flow dot */}
          <circle r="3" fill="var(--acc)" opacity="0.8">
            <animateMotion dur="3.5s" repeatCount="indefinite">
              <mpath href="#ff-main-path"/>
            </animateMotion>
          </circle>
          <path id="ff-main-path" d="M20,111 L655,111" fill="none"/>

          <text x="20" y="32" fontSize="8" fill="var(--txt-subtle)" fontFamily="monospace" opacity="0.6">Pipeline Architecture · FlowForge ETL</text>
          <text x="20" y="44" fontSize="7" fill="var(--txt-subtle)" fontFamily="monospace" opacity="0.5">Each layer validated before the next is built</text>
        </svg>
      </div>
    );
  }

  // ── Darlbanat ── Web UI → ASP.NET Core → EF → SQL Server + entities
  if (id === "darlbanat") {
    return (
      <div style={containerStyle} aria-hidden="true">
        {BG}{dotGrid}
        <svg viewBox="0 0 700 240" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="db-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--acc)" stopOpacity="0.45"/>
              <stop offset="100%" stopColor="var(--acc)" stopOpacity="0.1"/>
            </linearGradient>
            <filter id="db-glow"><feGaussianBlur stdDeviation="3" in="SourceGraphic" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* Web UI */}
          <rect x="20" y="82" width="90" height="56" rx="10" fill="rgba(183,110,121,0.06)" stroke="rgba(183,110,121,0.25)" strokeWidth="1"/>
          <text x="65" y="106" textAnchor="middle" fontSize="12" fill="var(--acc)" fontFamily="monospace">🖥</text>
          <text x="65" y="120" textAnchor="middle" fontSize="8.5" fill="var(--txt)" fontFamily="inherit">Web UI</text>
          <text x="65" y="131" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">Browser</text>

          <line x1="110" y1="110" x2="178" y2="110" stroke="url(#db-grad)" strokeWidth="1.5" strokeDasharray="5 4"/>

          {/* ASP.NET Core */}
          <rect x="178" y="68" width="92" height="84" rx="10" fill="rgba(183,110,121,0.11)" stroke="var(--acc)" strokeWidth="1.5" filter="url(#db-glow)"/>
          <text x="224" y="94" textAnchor="middle" fontSize="8" fill="var(--acc)" fontFamily="monospace" fontWeight="700">ASP.NET Core</text>
          <text x="224" y="107" textAnchor="middle" fontSize="7.5" fill="var(--txt)" fontFamily="inherit">Orders API</text>
          <text x="224" y="119" textAnchor="middle" fontSize="7.5" fill="var(--txt)" fontFamily="inherit">Inventory API</text>
          <text x="224" y="131" textAnchor="middle" fontSize="7.5" fill="var(--txt)" fontFamily="inherit">Reports API</text>
          <text x="224" y="143" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">Auth middleware</text>

          <line x1="270" y1="110" x2="340" y2="110" stroke="url(#db-grad)" strokeWidth="1.5" strokeDasharray="5 4"/>

          {/* Entity Framework */}
          <rect x="340" y="86" width="108" height="48" rx="8" fill="rgba(183,110,121,0.07)" stroke="rgba(183,110,121,0.3)" strokeWidth="1"/>
          <text x="394" y="108" textAnchor="middle" fontSize="8" fill="var(--acc)" fontFamily="monospace">Entity Framework</text>
          <text x="394" y="121" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">Code-first · Migrations</text>
          <text x="394" y="127" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">Type-safe queries</text>

          <line x1="448" y1="110" x2="518" y2="110" stroke="url(#db-grad)" strokeWidth="1.5" strokeDasharray="5 4"/>

          {/* SQL Server */}
          <rect x="518" y="82" width="90" height="56" rx="10" fill="rgba(183,110,121,0.06)" stroke="rgba(183,110,121,0.25)" strokeWidth="1"/>
          <text x="563" y="106" textAnchor="middle" fontSize="10" fill="var(--acc)" fontFamily="monospace">🗄</text>
          <text x="563" y="120" textAnchor="middle" fontSize="8.5" fill="var(--txt)" fontFamily="inherit">SQL Server</text>
          <text x="563" y="131" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">Transactions</text>

          {/* Entity diagram below */}
          <line x1="563" y1="138" x2="563" y2="170" stroke="rgba(183,110,121,0.2)" strokeWidth="1" strokeDasharray="3 3"/>
          {[
            { x: 430, label: "Order",     sub: "id · date" },
            { x: 525, label: "LineItem",  sub: "qty · price" },
            { x: 620, label: "MenuItem",  sub: "name · stock" },
          ].map(({ x, label, sub }) => (
            <g key={label}>
              <rect x={x} y={172} width={80} height={36} rx="5" fill="rgba(183,110,121,0.05)" stroke="rgba(183,110,121,0.18)" strokeWidth="0.8"/>
              <text x={x + 40} y={187} textAnchor="middle" fontSize="7.5" fill="var(--txt)" fontFamily="inherit" fontWeight="500">{label}</text>
              <text x={x + 40} y={200} textAnchor="middle" fontSize="6.5" fill="var(--txt-subtle)" fontFamily="monospace">{sub}</text>
            </g>
          ))}
          <line x1="430" y1="190" x2="700" y2="190" stroke="rgba(183,110,121,0.12)" strokeWidth="0.8"/>

          <circle r="2.5" fill="var(--acc)" opacity="0.75">
            <animateMotion dur="3s" repeatCount="indefinite"><mpath href="#db-path"/></animateMotion>
          </circle>
          <path id="db-path" d="M110,110 L448,110" fill="none"/>

          <text x="20" y="32" fontSize="8" fill="var(--txt-subtle)" fontFamily="monospace" opacity="0.6">System Architecture · Darlbanat</text>
        </svg>
      </div>
    );
  }

  // ── Nacim² ── SSR + CSR split
  if (id === "nacim2") {
    return (
      <div style={containerStyle} aria-hidden="true">
        {BG}{dotGrid}
        <svg viewBox="0 0 700 240" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="nc-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--acc)" stopOpacity="0.45"/>
              <stop offset="100%" stopColor="var(--acc)" stopOpacity="0.1"/>
            </linearGradient>
            <filter id="nc-glow"><feGaussianBlur stdDeviation="3" in="SourceGraphic" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* Browser */}
          <rect x="20" y="72" width="90" height="96" rx="10" fill="rgba(183,110,121,0.06)" stroke="rgba(183,110,121,0.25)" strokeWidth="1"/>
          <text x="65" y="100" textAnchor="middle" fontSize="12" fill="var(--acc)" fontFamily="monospace">🌐</text>
          <text x="65" y="116" textAnchor="middle" fontSize="8.5" fill="var(--txt)" fontFamily="inherit">Browser</text>
          <line x1="30" y1="128" x2="100" y2="128" stroke="rgba(183,110,121,0.2)" strokeWidth="0.7"/>
          <text x="65" y="142" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">Filter state</text>
          <text x="65" y="154" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">URL params</text>
          <text x="65" y="162" textAnchor="middle" fontSize="7" fill="var(--acc)" fontFamily="monospace">?zone=agdal</text>

          {/* SSR arrow (top) */}
          <line x1="110" y1="92" x2="195" y2="92" stroke="url(#nc-grad)" strokeWidth="1.3" strokeDasharray="5 4"/>
          <text x="152" y="86" textAnchor="middle" fontSize="8" fill="var(--txt-subtle)" fontFamily="monospace">SSR</text>

          {/* CSR arrow (bottom) — going other direction to show it stays in browser */}
          <line x1="110" y1="148" x2="195" y2="148" stroke="rgba(183,110,121,0.25)" strokeWidth="1.2" strokeDasharray="4 4"/>
          <text x="152" y="162" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">client filter</text>

          {/* Next.js Server */}
          <rect x="195" y="60" width="100" height="110" rx="10" fill="rgba(183,110,121,0.11)" stroke="var(--acc)" strokeWidth="1.5" filter="url(#nc-glow)"/>
          <text x="245" y="85" textAnchor="middle" fontSize="8" fill="var(--acc)" fontFamily="monospace" fontWeight="700">Next.js</text>
          <text x="245" y="99" textAnchor="middle" fontSize="7.5" fill="var(--txt)" fontFamily="inherit">Server-side render</text>
          <text x="245" y="111" textAnchor="middle" fontSize="7.5" fill="var(--txt)" fontFamily="inherit">Full HTML output</text>
          <line x1="205" y1="120" x2="285" y2="120" stroke="rgba(183,110,121,0.2)" strokeWidth="0.7"/>
          <text x="245" y="134" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">TypeScript</text>
          <text x="245" y="146" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">Type-safe props</text>
          <text x="245" y="162" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="monospace">compile-time errors</text>

          <line x1="295" y1="105" x2="375" y2="105" stroke="url(#nc-grad)" strokeWidth="1.3" strokeDasharray="5 4"/>

          {/* Prisma */}
          <rect x="375" y="82" width="95" height="46" rx="8" fill="rgba(183,110,121,0.07)" stroke="rgba(183,110,121,0.28)" strokeWidth="1"/>
          <text x="422" y="102" textAnchor="middle" fontSize="8" fill="var(--acc)" fontFamily="monospace">Prisma ORM</text>
          <text x="422" y="115" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">Schema-first · TS types</text>
          <text x="422" y="123" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">Auto-migrations</text>

          <line x1="470" y1="105" x2="545" y2="105" stroke="url(#nc-grad)" strokeWidth="1.3" strokeDasharray="5 4"/>

          {/* PostgreSQL */}
          <rect x="545" y="82" width="90" height="46" rx="8" fill="rgba(183,110,121,0.06)" stroke="rgba(183,110,121,0.25)" strokeWidth="1"/>
          <text x="590" y="102" textAnchor="middle" fontSize="8.5" fill="var(--txt)" fontFamily="inherit">PostgreSQL</text>
          <text x="590" y="115" textAnchor="middle" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="inherit">Listings schema</text>
          <text x="590" y="123" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="monospace">zone · prix · surface</text>

          <circle r="2.5" fill="var(--acc)" opacity="0.8">
            <animateMotion dur="2.8s" repeatCount="indefinite"><mpath href="#nc-path"/></animateMotion>
          </circle>
          <path id="nc-path" d="M110,92 L545,105" fill="none"/>

          <text x="20" y="30" fontSize="8" fill="var(--txt-subtle)" fontFamily="monospace" opacity="0.6">System Architecture · Nacim²</text>
          <text x="20" y="42" fontSize="7" fill="var(--txt-subtle)" fontFamily="monospace" opacity="0.5">SSR for initial load · CSR for filter state · URL-reflected</text>
        </svg>
      </div>
    );
  }

  // ── Yazaki ── Excel → Detect → Parse → Transform → Validate → Power BI
  if (id === "yazaki") {
    return (
      <div style={containerStyle} aria-hidden="true">
        {BG}{dotGrid}
        <svg viewBox="0 0 700 240" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="yz-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--acc)" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="var(--acc)" stopOpacity="0.1"/>
            </linearGradient>
            <filter id="yz-glow"><feGaussianBlur stdDeviation="3" in="SourceGraphic" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* Excel BOM */}
          <rect x="15" y="85" width="78" height="50" rx="8" fill="rgba(183,110,121,0.05)" stroke="rgba(183,110,121,0.22)" strokeWidth="0.9"/>
          <text x="54" y="108" textAnchor="middle" fontSize="12" fontFamily="inherit">📊</text>
          <text x="54" y="122" textAnchor="middle" fontSize="7.5" fill="var(--txt)" fontFamily="inherit">Excel BOM</text>
          <text x="54" y="130" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">Various formats</text>

          <line x1="93" y1="110" x2="128" y2="110" stroke="url(#yz-grad)" strokeWidth="1.3" strokeDasharray="4 3"/>

          {/* Format detector */}
          <rect x="128" y="76" width="88" height="68" rx="8" fill="rgba(183,110,121,0.08)" stroke="rgba(183,110,121,0.28)" strokeWidth="1"/>
          <text x="172" y="99" textAnchor="middle" fontSize="7.5" fill="var(--acc)" fontFamily="monospace" fontWeight="600">DETECT</text>
          <text x="172" y="112" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">v1 format</text>
          <text x="172" y="122" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">v2 format</text>
          <text x="172" y="132" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">v3 format</text>

          <line x1="216" y1="110" x2="258" y2="110" stroke="url(#yz-grad)" strokeWidth="1.3" strokeDasharray="4 3"/>

          {/* openpyxl parser */}
          <rect x="258" y="76" width="92" height="68" rx="8" fill="rgba(183,110,121,0.11)" stroke="var(--acc)" strokeWidth="1.5" filter="url(#yz-glow)"/>
          <text x="304" y="99" textAnchor="middle" fontSize="7.5" fill="var(--acc)" fontFamily="monospace" fontWeight="700">openpyxl</text>
          <text x="304" y="112" textAnchor="middle" fontSize="7" fill="var(--txt)" fontFamily="inherit">Cell-level read</text>
          <text x="304" y="122" textAnchor="middle" fontSize="7" fill="var(--txt)" fontFamily="inherit">Merged cell</text>
          <text x="304" y="132" textAnchor="middle" fontSize="7" fill="var(--txt)" fontFamily="inherit">handling</text>

          <line x1="350" y1="110" x2="393" y2="110" stroke="url(#yz-grad)" strokeWidth="1.3" strokeDasharray="4 3"/>

          {/* Pandas transform */}
          <rect x="393" y="85" width="88" height="50" rx="8" fill="rgba(183,110,121,0.07)" stroke="rgba(183,110,121,0.25)" strokeWidth="1"/>
          <text x="437" y="107" textAnchor="middle" fontSize="7.5" fill="var(--acc)" fontFamily="monospace">Pandas</text>
          <text x="437" y="119" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">Restructure tree</text>
          <text x="437" y="128" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">Flatten to tabular</text>

          <line x1="481" y1="110" x2="522" y2="110" stroke="url(#yz-grad)" strokeWidth="1.3" strokeDasharray="4 3"/>

          {/* Validator */}
          <rect x="522" y="85" width="80" height="50" rx="8" fill="rgba(34,197,94,0.07)" stroke="rgba(34,197,94,0.3)" strokeWidth="1"/>
          <text x="562" y="107" textAnchor="middle" fontSize="7.5" fill="rgb(34,197,94)" fontFamily="monospace">VALIDATE</text>
          <text x="562" y="119" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">Schema check</text>
          <text x="562" y="128" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="inherit">Fail loudly</text>

          <line x1="602" y1="110" x2="638" y2="110" stroke="url(#yz-grad)" strokeWidth="1.3" strokeDasharray="4 3"/>

          {/* Power BI output */}
          <rect x="638" y="85" width="50" height="50" rx="8" fill="rgba(183,110,121,0.05)" stroke="rgba(183,110,121,0.2)" strokeWidth="0.8"/>
          <text x="663" y="107" textAnchor="middle" fontSize="10" fontFamily="inherit">📈</text>
          <text x="663" y="120" textAnchor="middle" fontSize="7" fill="var(--txt)" fontFamily="inherit">Power BI</text>

          {/* Before/after metrics */}
          <text x="320" y="175" textAnchor="middle" fontSize="8.5" fill="var(--txt-subtle)" fontFamily="inherit">Before: 8 hours manual</text>
          <text x="430" y="175" textAnchor="middle" fontSize="8.5" fill="var(--acc)" fontFamily="inherit">After: 4 minutes automated</text>
          <text x="370" y="192" textAnchor="middle" fontSize="8" fill="var(--txt-subtle)" fontFamily="monospace" opacity="0.7">↓ 99.2% reduction</text>

          <circle r="2.5" fill="var(--acc)" opacity="0.8">
            <animateMotion dur="4s" repeatCount="indefinite"><mpath href="#yz-path"/></animateMotion>
          </circle>
          <path id="yz-path" d="M93,110 L638,110" fill="none"/>

          <text x="15" y="32" fontSize="8" fill="var(--txt-subtle)" fontFamily="monospace" opacity="0.6">Processing Pipeline · Yazaki BOM Automation</text>
        </svg>
      </div>
    );
  }

  // ── FinTech Predict ── CSV → Preprocessing → Scaler → Window → LSTM → MC Dropout → Output
  if (id === "fintech-predict") {
    return (
      <div style={containerStyle} aria-hidden="true">
        {BG}{dotGrid}
        <svg viewBox="0 0 700 240" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="ft-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--acc)" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="var(--acc)" stopOpacity="0.1"/>
            </linearGradient>
            <filter id="ft-glow"><feGaussianBlur stdDeviation="3" in="SourceGraphic" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* Stage boxes */}
          {[
            { x: 10,  label: "CSV",      sub: "Price data",     icon: "📄", hi: false, w: 68 },
            { x: 92,  label: "Pandas",   sub: "Preprocess",     icon: "🧹", hi: false, w: 78 },
            { x: 184, label: "Scaler",   sub: "MinMax\n(train only)", icon: "⚖", hi: false, w: 88 },
            { x: 286, label: "Window",   sub: "60 timesteps",   icon: "🪟", hi: false, w: 78 },
            { x: 378, label: "LSTM",     sub: "2-layer + drop", icon: "🧠", hi: true,  w: 78 },
            { x: 470, label: "MC Drop",  sub: "×100 inference", icon: "🎲", hi: false, w: 78 },
            { x: 562, label: "Output",   sub: "Confidence band",icon: "📊", hi: false, w: 78 },
          ].map(({ x, label, sub, icon, hi, w }) => (
            <g key={label}>
              <rect x={x} y={75} width={w} height={62} rx="8"
                fill={hi ? "rgba(183,110,121,0.12)" : "rgba(183,110,121,0.05)"}
                stroke={hi ? "var(--acc)" : "rgba(183,110,121,0.22)"}
                strokeWidth={hi ? "1.5" : "0.8"}
                filter={hi ? "url(#ft-glow)" : undefined}
              />
              <text x={x + w/2} y={95} textAnchor="middle" fontSize="13" fontFamily="inherit">{icon}</text>
              <text x={x + w/2} y={110} textAnchor="middle" fontSize="7.5" fill={hi ? "var(--acc)" : "var(--txt)"} fontFamily={hi ? "monospace" : "inherit"} fontWeight={hi ? "700" : "400"}>{label}</text>
              <text x={x + w/2} y={123} textAnchor="middle" fontSize="6.5" fill="var(--txt-subtle)" fontFamily="monospace">{sub.replace("\\n", " ")}</text>
            </g>
          ))}

          {/* Arrows */}
          {[78, 170, 272, 364, 456, 548].map((x, i) => (
            <line key={i} x1={x} y1="106" x2={x + 14} y2="106" stroke="url(#ft-grad)" strokeWidth="1.2" strokeDasharray="3 3"/>
          ))}

          {/* Train/test boundary line */}
          <line x1="286" y1="60" x2="286" y2="155" stroke="rgba(183,110,121,0.35)" strokeWidth="1" strokeDasharray="4 3"/>
          <text x="280" y="54" textAnchor="end" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="monospace">train</text>
          <text x="292" y="54" fontSize="7.5" fill="var(--txt-subtle)" fontFamily="monospace">predict</text>

          {/* Scaler note — "fit on train only" */}
          <line x1="228" y1="137" x2="228" y2="163" stroke="rgba(183,110,121,0.25)" strokeWidth="0.9" strokeDasharray="3 3"/>
          <rect x="163" y="163" width="130" height="22" rx="4" fill="rgba(183,110,121,0.06)" stroke="rgba(183,110,121,0.18)" strokeWidth="0.7"/>
          <text x="228" y="177" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="monospace">fit on train → apply to test</text>

          {/* MC dropout note */}
          <line x1="509" y1="137" x2="509" y2="163" stroke="rgba(183,110,121,0.25)" strokeWidth="0.9" strokeDasharray="3 3"/>
          <rect x="444" y="163" width="130" height="22" rx="4" fill="rgba(183,110,121,0.06)" stroke="rgba(183,110,121,0.18)" strokeWidth="0.7"/>
          <text x="509" y="177" textAnchor="middle" fontSize="7" fill="var(--txt-subtle)" fontFamily="monospace">spread = uncertainty estimate</text>

          <circle r="2.5" fill="var(--acc)" opacity="0.8">
            <animateMotion dur="4.5s" repeatCount="indefinite"><mpath href="#ft-path"/></animateMotion>
          </circle>
          <path id="ft-path" d="M10,106 L640,106" fill="none"/>

          <text x="10" y="30" fontSize="8" fill="var(--txt-subtle)" fontFamily="monospace" opacity="0.6">ML Pipeline · FinTech Predict</text>
          <text x="10" y="42" fontSize="7" fill="var(--txt-subtle)" fontFamily="monospace" opacity="0.5">Transparency over performance — every step inspectable</text>
        </svg>
      </div>
    );
  }

  // Fallback
  return (
    <div style={containerStyle} aria-hidden="true">
      {BG}{dotGrid}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <span style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--txt-subtle)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {project.id}
        </span>
      </div>
    </div>
  );
}
