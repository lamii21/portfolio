"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText }    from "@/components/ui/SplitText";
import { useParallax }  from "@/hooks/useParallax";
import {
  staggerContainer,
  staggerChild,
  clipReveal,
  floatAnim,
  ease,
  duration,
  viewport,
} from "@/lib/motion";
import { siteConfig } from "@/data/site";

// Each line of the pull quote with optional accent colouring.
// Now reveals via SplitText (word-by-word lift) instead of ScrambleIn —
// ScrambleIn is already used in Hero; two scramble reveals would feel repetitive.
const QUOTE_LINES = [
  { text: "I don't stop at",      accent: false },
  { text: "the interface.",       accent: true  },
  { text: "I follow the problem", accent: false },
  { text: "wherever it goes.",    accent: false },
] as const;

const FACTS = [
  { label: "Program",  value: siteConfig.program },
  { label: "School",   value: "EMSI, Rabat" },
  { label: "Class of", value: siteConfig.yearOfGraduation },
  { label: "Open to",  value: "SWE · Full-Stack · Backend" },
] as const;

export function Story() {
  const reduced = useReducedMotion();
  const { ref: sectionRef, y: orbY } = useParallax(-0.14);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="story"
      aria-label="About Lamiae"
      className="py-[var(--section-py)] relative isolate overflow-hidden"
    >
      {/* Ambient orb — parallax-driven on scroll */}
      <motion.div
        aria-hidden="true"
        className="absolute top-0 left-0 pointer-events-none -z-10 hidden lg:block"
        style={{
          y: reduced ? undefined : orbY,
          width: "50%",
          height: "100%",
          background:
            "radial-gradient(ellipse 60% 50% at 20% 40%, rgba(183,110,121,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Decorative oversized quote mark — floats gently */}
      <motion.span
        aria-hidden="true"
        className="absolute -top-8 left-[calc(var(--section-px)+0.5rem)] font-serif leading-none pointer-events-none select-none text-accent/[0.07] hidden lg:block"
        style={{ fontSize: "10rem" }}
        animate={reduced ? {} : floatAnim(10, 9, 0)}
      >
        "
      </motion.span>

      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)]">

        <SectionLabel label="About" asHeading />

        {/* Two-column editorial layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[42fr_58fr] gap-16 lg:gap-20 xl:gap-28">

          {/* Left: pull quote + meta — sticky on desktop */}
          <div className="space-y-10 lg:sticky lg:top-[5.5rem] lg:self-start">

            {/* Pull quote — word-split reveal per line */}
            <div className="relative pl-2">
              <blockquote
                className="relative font-serif italic leading-[1.18] tracking-[-0.018em]"
                style={{ fontSize: "clamp(1.45rem, 2.8vw, 2.2rem)" }}
              >
                {QUOTE_LINES.map(({ text, accent }, i) => (
                  <SplitText
                    key={text}
                    as="span"
                    className={`block ${accent ? "text-accent" : "text-foreground"}`}
                    delay={i * 0.18}
                    wordStagger={0.055}
                    amount={0.3}
                  >
                    {text}
                  </SplitText>
                ))}
              </blockquote>
            </div>

            {/* Thin accent rule */}
            <motion.div
              className="w-10 h-px origin-left"
              style={{ background: "var(--brd-strong)" }}
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.7, ease: ease.out, delay: 0.55 }}
              viewport={{ once: true, amount: 0.5 }}
            />

            {/* Meta facts — stagger in */}
            <motion.dl
              className="space-y-3.5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {FACTS.map(({ label, value }) => (
                <motion.div
                  key={label}
                  className="flex items-baseline gap-4"
                  variants={staggerChild}
                >
                  <dt
                    className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium shrink-0"
                    style={{ color: "var(--txt-subtle)", minWidth: "5.5rem" }}
                  >
                    {label}
                  </dt>
                  <dd className="text-foreground text-sm font-light">{value}</dd>
                </motion.div>
              ))}
            </motion.dl>

          </div>

          {/* Right: narrative paragraphs */}
          <div className="space-y-7">

            <motion.p
              className="text-foreground leading-[1.82] font-light"
              style={{ fontSize: "clamp(1rem, 1.55vw, 1.125rem)" }}
              variants={clipReveal}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              Four years into a Software Engineering degree at{" "}
              <strong className="font-medium">EMSI</strong> — Génie Informatique —
              and the thing I keep coming back to is the seam. The moment a frontend
              request reaches the backend. The moment a query plan explains a three-second
              lag. The place where the system stops being abstract and starts being real.
            </motion.p>

            <motion.p
              className="text-foreground leading-[1.82] font-light"
              style={{ fontSize: "clamp(1rem, 1.55vw, 1.125rem)" }}
              variants={clipReveal}
              custom={0.1}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              I build with React and Next.js on the frontend, Django and Python on the
              backend. I've worked with SQL databases, built automation scripts, and
              touched machine learning pipelines in university and internship contexts —
              not because those are my target roles, but because I refuse to stop at the
              boundary of what I already know.
            </motion.p>

            <motion.p
              className="leading-[1.82] font-light"
              style={{
                fontSize: "clamp(1rem, 1.55vw, 1.125rem)",
                color: "var(--txt-muted)",
              }}
              variants={clipReveal}
              custom={0.2}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              I'm graduating in {siteConfig.yearOfGraduation} and looking for my first
              engineering role — Software Engineer, Full-Stack Developer, or Backend Developer.
              I learn fast, ask specific questions, and don't disappear when things get
              complicated.
            </motion.p>

            {/* Honest note — clip reveal + left accent border */}
            <motion.aside
              className="mt-2 py-5 pl-6 rounded-r-lg"
              style={{
                borderLeft: "2px solid var(--acc)",
                background:
                  "linear-gradient(90deg, rgba(183,110,121,0.04) 0%, transparent 80%)",
              }}
              initial={reduced ? false : { clipPath: "inset(0 100% 0 0)", opacity: 0 }}
              whileInView={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
              transition={{ delay: 0.32, duration: duration.deliberate, ease: ease.out }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <p
                className="font-serif italic leading-relaxed"
                style={{
                  fontSize: "clamp(0.9375rem, 1.4vw, 1.0625rem)",
                  color: "var(--txt-muted)",
                }}
              >
                Honest: I don't have years of professional production experience.
                What I have is four years of building things I actually cared about —
                and a clear picture of exactly where my gaps are.
              </p>
            </motion.aside>

          </div>

        </div>

      </div>
    </section>
  );
}
