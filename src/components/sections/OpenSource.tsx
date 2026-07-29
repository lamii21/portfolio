"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Github, GitFork, Star, ExternalLink } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { staggerContainer, staggerChild, wipeIn, viewport } from "@/lib/motion";
import { siteConfig } from "@/data/site";

// ─────────────────────────────────────────────────────────────────────────────
// Honest framing: all 6 project repos are public on GitHub.
// This section is about the code being accessible, not about OSS maintenance.
// ─────────────────────────────────────────────────────────────────────────────

const REPOS = [
  {
    name: "HandyMath",
    description: "Full-stack math education platform. Django REST, React, PostgreSQL.",
    stack: ["Django", "React", "PostgreSQL"],
    href: siteConfig.links.github,
    highlight: true,
  },
  {
    name: "FlowForge ETL",
    description: "Automated industrial data pipeline. Ingest → transform → expose via FastAPI.",
    stack: ["Python", "Pandas", "FastAPI"],
    href: siteConfig.links.github,
    highlight: false,
  },
  {
    name: "FinTech Predict",
    description: "LSTM forecasting model with a full preprocessing pipeline. Keras + Scikit-learn.",
    stack: ["TensorFlow", "Keras", "Scikit-learn"],
    href: siteConfig.links.github,
    highlight: false,
  },
  {
    name: "Darlbanat",
    description: "Restaurant management system for a real client. ASP.NET Core, SQL Server.",
    stack: ["C#", "ASP.NET", "SQL Server"],
    href: siteConfig.links.github,
    highlight: false,
  },
  {
    name: "Nacim²",
    description: "Real-estate listing platform. Next.js SSR + Prisma + PostgreSQL.",
    stack: ["Next.js", "Prisma", "TypeScript"],
    href: siteConfig.links.github,
    highlight: false,
  },
  {
    name: "Yazaki BOM Automation",
    description: "Python BOM parser. Domain knowledge first — automation second.",
    stack: ["Python", "openpyxl", "Pandas"],
    href: siteConfig.links.github,
    highlight: false,
  },
] as const;

const PRINCIPLES = [
  "Every project repository is public — the code is readable by anyone.",
  "Commit messages explain the why, not the what.",
  "Schemas, API contracts, and architecture decisions are documented inline.",
] as const;

// ─────────────────────────────────────────────────────────────────────────────

export function OpenSource() {
  const reduced = useReducedMotion();

  return (
    <section
      id="oss"
      aria-label="Open source and GitHub"
      className="py-[var(--section-py)] relative overflow-hidden"
      style={{ background: "#0C0A08", color: "#E8E4DE" }}
    >
      {/* Ambient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 80% 30%, rgba(201,127,137,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)] relative z-10">

        <SectionLabel
          label="Open Source"
          labelColor="#C97F89"
          ruleColor="rgba(201,127,137,0.18)"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-20">

          {/* Left: Statement + principles */}
          <div>
            <motion.div
              variants={wipeIn}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <div className="flex items-center gap-3 mb-6">
                <Github size={28} style={{ color: "#C97F89" }} />
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm transition-colors duration-200"
                  style={{ color: "#7A7068" }}
                >
                  github.com/lamii21
                  <ExternalLink size={11} className="inline ml-1.5" />
                </a>
              </div>

              <p
                className="font-serif italic leading-relaxed mb-8"
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)", color: "#E8E4DE", lineHeight: 1.42 }}
              >
                All six projects are public. The code is readable.
              </p>

              <p
                className="font-light leading-[1.78] mb-10"
                style={{ fontSize: "0.875rem", color: "#7A7068" }}
              >
                I don't have contributions to external open-source projects yet.
                What I do have is six public repositories where anyone can read the schema,
                the API layer, and the architecture decisions — and see exactly how I build.
              </p>
            </motion.div>

            {/* Principles */}
            <motion.ul
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {PRINCIPLES.map((p, i) => (
                <motion.li
                  key={i}
                  variants={staggerChild}
                  className="flex items-start gap-3"
                >
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: "#C97F89" }}
                  />
                  <span style={{ fontSize: "0.8125rem", color: "#7A7068", lineHeight: 1.7 }}>
                    {p}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Right: Repo grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {REPOS.map((repo) => (
              <motion.a
                key={repo.name}
                href={repo.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${repo.name} on GitHub`}
                variants={staggerChild}
                className="group rounded-xl p-4 border transition-all duration-300 block"
                style={{
                  background: repo.highlight ? "rgba(201,127,137,0.06)" : "rgba(26,22,16,0.8)",
                  borderColor: repo.highlight ? "rgba(201,127,137,0.22)" : "rgba(201,127,137,0.08)",
                }}
                whileHover={reduced ? {} : {
                  y: -3,
                  borderColor: "rgba(201,127,137,0.3)",
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className="font-mono font-medium text-sm transition-colors duration-200 group-hover:text-[#C97F89]"
                    style={{ color: "#E8E4DE" }}
                  >
                    {repo.name}
                  </h3>
                  <ExternalLink
                    size={11}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-0.5 shrink-0"
                    style={{ color: "#C97F89" }}
                  />
                </div>
                <p
                  className="text-[12px] leading-relaxed mb-3"
                  style={{ color: "#5A5248" }}
                >
                  {repo.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {repo.stack.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        fontFamily: "ui-monospace, monospace",
                        background: "rgba(201,127,137,0.08)",
                        color: "#7A7068",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.a>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
