"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { staggerContainer, staggerChild, clipReveal, viewport } from "@/lib/motion";

// ─────────────────────────────────────────────────────────────────────────────
// DATA  (all skills confirmed from shipped projects)
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "frontend",
    label: "Frontend",
    accent: "rgba(130,180,212,1)",
    bg: "rgba(130,180,212,0.07)",
    brd: "rgba(130,180,212,0.18)",
    skills: [
      { name: "React",         status: "daily"   },
      { name: "Next.js",       status: "daily"   },
      { name: "TypeScript",    status: "daily"   },
      { name: "Tailwind CSS",  status: "daily"   },
      { name: "Framer Motion", status: "shipped" },
      { name: "HTML / CSS",    status: "daily"   },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    accent: "rgba(107,168,120,1)",
    bg: "rgba(107,168,120,0.07)",
    brd: "rgba(107,168,120,0.18)",
    skills: [
      { name: "Python",       status: "daily"   },
      { name: "Django",       status: "shipped" },
      { name: "FastAPI",      status: "shipped" },
      { name: "C# / ASP.NET", status: "shipped" },
      { name: "REST APIs",    status: "daily"   },
      { name: "Node.js",      status: "learning"},
    ],
  },
  {
    id: "data",
    label: "Database",
    accent: "rgba(212,167,106,1)",
    bg: "rgba(212,167,106,0.07)",
    brd: "rgba(212,167,106,0.18)",
    skills: [
      { name: "PostgreSQL",        status: "shipped" },
      { name: "SQL Server",        status: "shipped" },
      { name: "SQLAlchemy",        status: "shipped" },
      { name: "Prisma ORM",        status: "shipped" },
      { name: "Entity Framework",  status: "shipped" },
      { name: "SQLite",            status: "shipped" },
    ],
  },
  {
    id: "aiml",
    label: "AI / ML",
    accent: "rgba(183,110,121,1)",
    bg: "rgba(183,110,121,0.07)",
    brd: "rgba(183,110,121,0.18)",
    skills: [
      { name: "Pandas",           status: "shipped" },
      { name: "TensorFlow/Keras", status: "shipped" },
      { name: "Scikit-learn",     status: "shipped" },
      { name: "NumPy",            status: "shipped" },
      { name: "openpyxl",         status: "shipped" },
      { name: "Matplotlib",       status: "shipped" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    accent: "rgba(180,155,212,1)",
    bg: "rgba(180,155,212,0.07)",
    brd: "rgba(180,155,212,0.18)",
    skills: [
      { name: "Git / GitHub", status: "daily"   },
      { name: "Power BI",     status: "shipped" },
      { name: "Postman",      status: "daily"   },
      { name: "VS Code",      status: "daily"   },
      { name: "Linux",        status: "learning"},
      { name: "Docker",       status: "learning"},
    ],
  },
] as const;

type SkillStatus = "daily" | "shipped" | "learning";

const STATUS_META: Record<SkillStatus, { label: string; dot: string }> = {
  daily:    { label: "Daily use",  dot: "#6BA878" },
  shipped:  { label: "Shipped",    dot: "#82B4D4" },
  learning: { label: "Learning",   dot: "#D4A76A" },
};

// ─────────────────────────────────────────────────────────────────────────────

export function TechStack() {
  const [active, setActive] = useState<string>("frontend");
  const reduced = useReducedMotion();

  const current = CATEGORIES.find((c) => c.id === active) ?? CATEGORIES[0];

  return (
    <section
      id="stack"
      aria-label="Tech stack"
      className="py-[var(--section-py)] relative overflow-hidden"
      style={{ background: "var(--srf-1)" }}
    >
      {/* Subtle dot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(var(--txt) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)] relative z-10">

        <SectionLabel label="Tech Stack" asHeading />

        {/* Category tabs */}
        <motion.div
          role="tablist"
          aria-label="Skill categories"
          className="flex flex-wrap gap-2 mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              id={`tab-${cat.id}`}
              role="tab"
              aria-selected={active === cat.id}
              aria-controls={`panel-${cat.id}`}
              variants={staggerChild}
              onClick={() => setActive(cat.id)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border"
              style={{
                background: active === cat.id ? cat.bg : "transparent",
                borderColor: active === cat.id ? cat.brd : "var(--brd)",
                color: active === cat.id ? cat.accent : "var(--txt-muted)",
              }}
              whileHover={reduced ? {} : { scale: 1.03 }}
              whileTap={reduced ? {} : { scale: 0.97 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <motion.div
          key={active}
          id={`panel-${active}`}
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {current.skills.map((skill) => {
            const meta = STATUS_META[skill.status as SkillStatus];
            return (
              <motion.div
                key={skill.name}
                variants={staggerChild}
                className="relative group rounded-xl p-4 border transition-all duration-300 cursor-default"
                style={{
                  background: "var(--srf-0)",
                  borderColor: "var(--brd)",
                }}
                whileHover={reduced ? {} : {
                  y: -4,
                  borderColor: current.brd,
                  background: current.bg,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full mb-3"
                  style={{ background: meta.dot }}
                />
                <p
                  className="text-sm font-medium text-foreground leading-tight mb-1"
                >
                  {skill.name}
                </p>
                <p
                  className="text-[10px] uppercase tracking-[0.14em] font-medium"
                  style={{ color: "var(--txt-subtle)" }}
                >
                  {meta.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Legend */}
        <motion.div
          className="flex flex-wrap gap-6 mt-10"
          variants={clipReveal}
          custom={0.1}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {(Object.entries(STATUS_META) as [SkillStatus, { label: string; dot: string }][]).map(([key, meta]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: meta.dot }} />
              <span
                className="text-[11px] uppercase tracking-[0.14em] font-medium"
                style={{ color: "var(--txt-subtle)" }}
              >
                {meta.label}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
