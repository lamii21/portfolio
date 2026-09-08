"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { staggerContainer, staggerChild, ease, duration, viewportEarly, spring } from "@/lib/motion";

// ─────────────────────────────────────────────────────────────────────────────
// All events are factual — drawn from site config and project data.
// ─────────────────────────────────────────────────────────────────────────────

const EVENTS = [
  {
    year: "2022",
    label: "EMSI — Classes Préparatoires",
    title: "Les années prépa.",
    body: "Two years of intensive preparatory classes at EMSI, Casablanca — mathematics, physics, and the fundamentals before engineering begins. Learning how to learn under pressure.",
    tag: "Education",
    accent: false,
  },
  {
    year: "2024",
    label: "EMSI — Ingénierie Informatique et Réseaux",
    title: "Cycle ingénieur.",
    body: "Start of the engineering cycle — computer science and networks: systems, databases, algorithms, architecture. The year HandyMath and the first real projects were built.",
    tag: "Education",
    accent: false,
  },
  {
    year: "2025",
    label: "EMSI — DDSI",
    title: "Spécialisation DDSI.",
    body: "Développement Digital et Systèmes d'Information — software engineering specialization focused on full-stack development, AI integration, and information systems design.",
    tag: "Education",
    accent: false,
  },
  {
    year: "2023",
    label: "First Full-Stack Project",
    title: "HandyMath ships.",
    body: "Solo build: Django REST API, React frontend, PostgreSQL. Four months, one schema rebuild, one complete deployment. The first time a user request I wrote went all the way down to the database and back.",
    tag: "Project",
    accent: true,
  },
  {
    year: "2023",
    label: "First Pipeline",
    title: "FlowForge ETL.",
    body: "Python, Pandas, FastAPI, SQLAlchemy. Built an automated data ingestion and transformation pipeline. First time I thought about data flow as architecture, not just code.",
    tag: "Project",
    accent: false,
  },
  {
    year: "2024",
    label: "Client Work",
    title: "Riad Lbanat.",
    body: "Real client: a restaurant owner managing orders and inventory on paper. Built a full order management system in C#/ASP.NET Core — every transaction becomes a database row, inventory updates in real-time. Paper system retired the same day it went live.",
    tag: "Project",
    accent: false,
  },
  {
    year: "2024",
    label: "Nacim² — Freelance",
    title: "Real estate platform, independently built.",
    body: "Freelance project for a family real-estate business. Replaced static HTML listings with a dynamic, searchable Next.js platform — server-side rendering for SEO, client-side filtering over properties, URL-reflected filter state.",
    tag: "Project",
    accent: false,
  },
  {
    year: "2024",
    label: "EduAction",
    title: "Solidarity tutoring, built.",
    body: "Founded EduAction at EMSI — a community initiative connecting students who need academic support with peers who can provide it. Built to make tutoring accessible inside the school.",
    tag: "Community",
    accent: false,
  },
  {
    year: "2024",
    label: "Machine Learning",
    title: "NovaBank360.",
    body: "LSTM time-series forecasting model with a full preprocessing pipeline. TensorFlow/Keras, Scikit-learn, Pandas. The model is only as trustworthy as the pipeline that feeds it.",
    tag: "Project",
    accent: false,
  },
  {
    year: "2025",
    label: "Premier Stage — Yazaki Morocco",
    title: "8 hours → 4 minutes.",
    body: "First engineering internship at Yazaki Morocco, Kénitra — July–August 2025. Built FlowForge ETL: a Python automation pipeline (FastAPI + React) for BOM data processing — reducing the weekly manual cycle from 8 hours to under 4 minutes. Domain knowledge before any code.",
    tag: "Experience",
    accent: true,
  },
  {
    year: "2026",
    label: "Deuxième Stage — YZY DigiTech Technologies",
    title: "OrderHub. SaaS from the ground up.",
    body: "Full-stack internship at YZY DigiTech Technologies — ended September 1, 2026. Built OrderHub: a SaaS order management platform integrating multiple e-commerce stores via Google Apps Script, webhooks, and Supabase. First production SaaS architecture built under real business constraints.",
    tag: "Experience",
    accent: true,
  },
  {
    year: "2025",
    label: "This Portfolio",
    title: "Built for real.",
    body: "Next.js 16, React 19, TypeScript, Framer Motion, Three.js, GSAP. Not a template — written from scratch. Every animation considered. Every section honest.",
    tag: "Craft",
    accent: true,
  },
  {
    year: "2027",
    label: "Graduation",
    title: "First engineering role.",
    body: "Finishing the DDSI degree at EMSI. Open to AI Software Engineer, Full-Stack, and SWE roles. Ready to spend the next decade getting better at this.",
    tag: "Upcoming",
    accent: false,
  },
] as const;

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Education:  { bg: "rgba(130,180,212,0.10)", color: "#82B4D4" },
  Project:    { bg: "rgba(107,168,120,0.10)", color: "#6BA878" },
  Experience: { bg: "rgba(183,110,121,0.14)", color: "#C97F89" },
  Craft:      { bg: "rgba(180,155,212,0.10)", color: "#B49BD4" },
  Upcoming:   { bg: "rgba(212,167,106,0.10)", color: "#D4A76A" },
  Community:  { bg: "rgba(130,180,212,0.10)", color: "#82B4D4" },
};

// ─────────────────────────────────────────────────────────────────────────────

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.15"],
  });
  const rawH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const lineH = useSpring(rawH, spring.scrollLine);

  return (
    <section
      id="timeline"
      aria-label="Journey timeline"
      className="py-[var(--section-py)] relative overflow-hidden"
    >
      {/* Background ambient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 80%, rgba(183,110,121,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)]">

        <SectionLabel label="Timeline" asHeading />

        <div ref={containerRef} className="relative max-w-3xl mx-auto">

          {/* Static track */}
          <div
            aria-hidden="true"
            className="absolute left-5 lg:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: "var(--brd)" }}
          />

          {/* Scroll-driven accent overlay */}
          {!reduced && (
            <motion.div
              aria-hidden="true"
              className="absolute left-5 lg:left-1/2 top-0 w-px -translate-x-1/2 origin-top"
              style={{
                height: lineH,
                background:
                  "linear-gradient(to bottom, var(--acc), rgba(183,110,121,0.25))",
                boxShadow: "0 0 10px rgba(183,110,121,0.28)",
              }}
            />
          )}

          {/* Events */}
          <div className="space-y-0">
            {EVENTS.map((ev, i) => {
              const isLeft = i % 2 === 0;
              const tagStyle = TAG_COLORS[ev.tag] ?? TAG_COLORS.Project;

              return (
                <motion.div
                  key={ev.year + ev.title}
                  className="grid grid-cols-[2.5rem_1fr] lg:grid-cols-[1fr_2.5rem_1fr] pb-10 lg:pb-12"
                  initial={reduced ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.05 + i * 0.06,
                    duration: duration.slow,
                    ease: ease.out,
                  }}
                  viewport={viewportEarly}
                >
                  {/* Desktop left card */}
                  <div className="hidden lg:flex items-start justify-end pr-10 pt-1">
                    {isLeft ? <EventCard ev={ev} tagStyle={tagStyle} align="right" /> : null}
                  </div>

                  {/* Center dot */}
                  <div className="flex flex-col items-center pt-[0.4rem]">
                    <motion.div
                      className="relative z-10 flex items-center justify-center rounded-full"
                      style={{
                        width: 14,
                        height: 14,
                        background: ev.accent ? "var(--acc)" : "var(--srf-1)",
                        border: `1.5px solid ${ev.accent ? "var(--acc)" : "rgba(183,110,121,0.4)"}`,
                        boxShadow: ev.accent ? "0 0 12px rgba(183,110,121,0.5)" : "none",
                      }}
                      whileInView={reduced ? {} : { scale: [0.6, 1.15, 1] }}
                      transition={{ duration: 0.4, delay: 0.05 + i * 0.06, ease: ease.gentle }}
                      viewport={{ once: true }}
                    />
                  </div>

                  {/* Mobile card (always right) / Desktop right card */}
                  <div className="pl-5 lg:pl-10 flex items-start pt-1">
                    <div className="lg:hidden w-full">
                      <EventCard ev={ev} tagStyle={tagStyle} align="left" />
                    </div>
                    {!isLeft && (
                      <div className="hidden lg:block w-full">
                        <EventCard ev={ev} tagStyle={tagStyle} align="left" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface EventCardProps {
  ev: (typeof EVENTS)[number];
  tagStyle: { bg: string; color: string };
  align: "left" | "right";
}

function EventCard({ ev, tagStyle, align }: EventCardProps) {
  return (
    <div
      className="max-w-[380px]"
      style={{ textAlign: align === "right" ? "right" : "left" }}
    >
      {/* Year */}
      <span
        className="font-serif italic text-sm"
        style={{ color: "var(--acc)" }}
      >
        {ev.year}
      </span>

      {/* Tag */}
      <div
        className={`inline-flex items-center ml-3 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-[0.12em] font-medium`}
        style={{ background: tagStyle.bg, color: tagStyle.color }}
      >
        {ev.tag}
      </div>

      {/* Title */}
      <h3
        className="font-serif text-foreground leading-tight mt-2 mb-1.5"
        style={{ fontSize: "clamp(1rem, 1.6vw, 1.2rem)" }}
      >
        {ev.title}
      </h3>

      {/* Body */}
      <p
        className="font-light leading-[1.75]"
        style={{
          fontSize: "clamp(0.8125rem, 1.1vw, 0.875rem)",
          color: "var(--txt-muted)",
        }}
      >
        {ev.body}
      </p>
    </div>
  );
}
