"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, BookOpen, Target, Clock } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { staggerContainer, staggerChild, clipReveal, viewport } from "@/lib/motion";

// ─────────────────────────────────────────────────────────────────────────────
// Honest framing: degree in progress + self-directed study.
// No external certifications are claimed — only what is factually true.
// ─────────────────────────────────────────────────────────────────────────────

const CREDENTIALS = [
  {
    icon: GraduationCap,
    title: "Génie Informatique",
    org: "EMSI — École Marocaine des Sciences de l'Ingénieur",
    status: "in-progress",
    statusLabel: "2022 – 2027",
    description:
      "5-year Software Engineering degree. Covers algorithms, systems, databases, networks, software architecture, and applied mathematics.",
    color: "#82B4D4",
  },
  {
    icon: BookOpen,
    title: "Machine Learning",
    org: "Self-directed · TensorFlow / Keras",
    status: "applied",
    statusLabel: "Applied in production",
    description:
      "LSTM time-series forecasting, Scikit-learn preprocessing, Keras model architecture — learned through building FinTech Predict, not through courses alone.",
    color: "#C97F89",
  },
  {
    icon: BookOpen,
    title: "Full-Stack Development",
    org: "Self-directed · Multiple stacks",
    status: "applied",
    statusLabel: "Applied in production",
    description:
      "Django + React + PostgreSQL, Next.js + Prisma, C# + Entity Framework + SQL Server. Learned by building 6 projects across 3 different stacks.",
    color: "#6BA878",
  },
  {
    icon: Target,
    title: "Cloud & DevOps",
    org: "Building toward",
    status: "building",
    statusLabel: "In progress",
    description:
      "Linux, Docker, and cloud infrastructure are the next layer. Actively working through Docker fundamentals; AWS/Azure exposure is the next deliberate step.",
    color: "#D4A76A",
  },
] as const;

type CredentialStatus = "in-progress" | "applied" | "building";

const STATUS_STYLE: Record<CredentialStatus, { bg: string; color: string; label: string }> = {
  "in-progress": { bg: "rgba(130,180,212,0.10)", color: "#82B4D4", label: "In progress" },
  applied:       { bg: "rgba(107,168,120,0.10)", color: "#6BA878", label: "Applied in projects" },
  building:      { bg: "rgba(212,167,106,0.10)", color: "#D4A76A", label: "Building toward" },
};

// ─────────────────────────────────────────────────────────────────────────────

export function Certifications() {
  const reduced = useReducedMotion();

  return (
    <section
      id="certifications"
      aria-label="Education and credentials"
      className="py-[var(--section-py)]"
      style={{ background: "var(--srf-1)" }}
    >
      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)]">

        <SectionLabel label="Credentials" asHeading />

        {/* Honest framing note */}
        <motion.p
          className="font-serif italic mb-12 max-w-xl"
          style={{
            fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
            color: "var(--txt-muted)",
            lineHeight: 1.65,
          }}
          variants={clipReveal}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          No certification badges yet — just a degree in progress and skills applied in real projects.
          The credentials that matter most are the ones you can point to in a codebase.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {CREDENTIALS.map((cred) => {
            const style = STATUS_STYLE[cred.status];
            const Icon = cred.icon;

            return (
              <motion.div
                key={cred.title}
                variants={staggerChild}
                className="rounded-2xl p-6 border transition-all duration-300 group"
                style={{
                  background: "var(--srf-0)",
                  borderColor: "var(--brd)",
                }}
                whileHover={reduced ? {} : { y: -3, borderColor: cred.color + "44" }}
              >
                {/* Icon + status row */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: cred.color + "14", color: cred.color }}
                  >
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  <span
                    className="text-[10px] uppercase tracking-[0.14em] font-medium px-2.5 py-1 rounded-full"
                    style={{ background: style.bg, color: style.color }}
                  >
                    {cred.statusLabel}
                  </span>
                </div>

                <h3
                  className="font-serif text-foreground mb-1"
                  style={{ fontSize: "clamp(1rem, 1.5vw, 1.15rem)" }}
                >
                  {cred.title}
                </h3>
                <p
                  className="text-[11px] uppercase tracking-[0.14em] font-medium mb-4"
                  style={{ color: "var(--txt-subtle)" }}
                >
                  {cred.org}
                </p>
                <p
                  className="font-light leading-[1.75]"
                  style={{ fontSize: "0.8125rem", color: "var(--txt-muted)" }}
                >
                  {cred.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
