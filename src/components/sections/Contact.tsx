"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SectionLabel }   from "@/components/ui/SectionLabel";
import { SplitText }      from "@/components/ui/SplitText";
import { useParallax }    from "@/hooks/useParallax";
import { siteConfig } from "@/data/site";
import {
  staggerContainer,
  staggerChild,
  wipeIn,
  floatAnim,
  ease,
  duration,
  viewport,
} from "@/lib/motion";

const CURRENTLY = [
  { label: "Status",      value: "DDSI · EMSI"                                  },
  { label: "Class of",    value: siteConfig.yearOfGraduation                    },
  { label: "Seeking",     value: "AI Software Engineer · Full-Stack · SWE"      },
  { label: "Based",       value: siteConfig.location                            },
  { label: "Open to",     value: "On-site · Remote · Hybrid"                   },
] as const;

export function Contact() {
  const reduced = useReducedMotion();
  const { ref: sectionRef, y: orbY } = useParallax(-0.12);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="contact"
      aria-label="Contact"
      className="py-[var(--section-py)] relative isolate overflow-hidden"
    >
      {/* Ambient orb — parallax-driven */}
      <motion.div
        aria-hidden="true"
        className="absolute top-0 right-0 pointer-events-none -z-10"
        style={{
          y: reduced ? undefined : orbY,
          width: "min(500px, 60vw)",
          height: "min(500px, 60vw)",
          background:
            "radial-gradient(ellipse at center, rgba(183,110,121,0.05) 0%, transparent 65%)",
          filter: "blur(55px)",
          transform: "translate(20%, -20%)",
        }}
      />

      {/* Decorative floating accent circle */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-20 left-8 pointer-events-none -z-10 hidden lg:block"
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "1px solid rgba(183,110,121,0.10)",
        }}
        animate={reduced ? {} : floatAnim(16, 8, 1.2)}
      />

      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)]">

        <SectionLabel label="Contact" />

        {/* Display headline — word-by-word split reveal */}
        <SplitText
          as="h2"
          className="font-serif italic text-foreground leading-[0.98] tracking-[-0.03em] mb-16 lg:mb-20"
          style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
          delay={0.06}
          wordStagger={0.1}
          amount={0.4}
        >
          Let&apos;s talk.
        </SplitText>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 lg:gap-24 xl:gap-32">

          {/* Left: Currently */}
          <div>
            <motion.h3
              className="text-[var(--text-overline)] uppercase tracking-[0.22em] text-accent font-medium mb-8"
              initial={reduced ? false : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: duration.slow, ease: ease.out }}
              viewport={viewport}
            >
              Currently
            </motion.h3>

            <motion.dl
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {CURRENTLY.map(({ label, value }) => (
                <motion.div
                  key={label}
                  className="flex items-baseline gap-4"
                  variants={staggerChild}
                >
                  <dt
                    className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium shrink-0"
                    style={{ color: "var(--txt-subtle)", minWidth: "6rem" }}
                  >
                    {label}
                  </dt>
                  <dd className="text-foreground text-sm font-light leading-relaxed">
                    {value}
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>

          {/* Right: Get in touch */}
          <div>

            <motion.p
              className="leading-[1.82] font-light mb-10"
              style={{
                fontSize: "clamp(1rem, 1.55vw, 1.125rem)",
                color: "var(--txt-muted)",
              }}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.slow, ease: ease.out }}
              viewport={viewport}
            >
              If you're looking for an AI Software Engineer, Full-Stack Engineer, or SWE
              — I'm available from 2027 and I respond to every message.
              No cover letter needed. Tell me what you're building
              and I'll tell you how I'd approach it.
            </motion.p>

            {/* Email link — wipe reveal */}
            <motion.div
              variants={wipeIn}
              custom={0.1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <a
                href={`mailto:${siteConfig.email}`}
                className="group inline-flex items-end gap-3 text-foreground hover:text-accent transition-colors duration-300"
                aria-label={`Send an email to ${siteConfig.email}`}
              >
                <span className="relative inline-block">
                  <span
                    className="font-serif italic leading-none break-all"
                    style={{ fontSize: "clamp(1.2rem, 2.8vw, 2.25rem)" }}
                  >
                    {siteConfig.email}
                  </span>
                  {/* Animated underline */}
                  <span
                    className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ background: "var(--acc)" }}
                    aria-hidden="true"
                  />
                </span>
                <ArrowUpRight
                  size={20}
                  strokeWidth={1.5}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1 shrink-0"
                  aria-hidden="true"
                />
              </a>
            </motion.div>

            {/* Thin divider */}
            <motion.div
              className="h-px w-14 my-10 origin-left"
              style={{ background: "var(--brd-strong)" }}
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ delay: 0.20, duration: 0.6, ease: ease.out }}
              viewport={{ once: true, amount: 0.8 }}
            />

            {/* Social links — stagger */}
            <motion.div
              className="flex flex-wrap gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <motion.div variants={staggerChild}>
                <MagneticButton
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lamiae's LinkedIn profile (opens in a new tab)"
                >
                  LinkedIn
                  <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                </MagneticButton>
              </motion.div>

              <motion.div variants={staggerChild}>
                <MagneticButton
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lamiae's GitHub profile (opens in a new tab)"
                >
                  GitHub
                  <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                </MagneticButton>
              </motion.div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
