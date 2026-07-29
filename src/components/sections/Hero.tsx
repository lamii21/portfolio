"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroScene } from "@/components/sections/HeroScene";
import { ArrowUpRight, Download } from "lucide-react";
import { ScrambleIn } from "@/components/ScrambleIn";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { siteConfig } from "@/data/site";

const TECH = ["React", "Next.js", "TypeScript", "Python", "Django", "SQL"];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const [scrambleTrigger, setScrambleTrigger] = useState(false);

  useEffect(() => {
    // Reduced-motion: show everything immediately, skip GSAP timeline
    if (prefersReduced) {
      setScrambleTrigger(true);
      return;
    }

    // GSAP is loaded lazily — keeps it out of the initial JS bundle
    let cleanup: (() => void) | undefined;

    import("gsap").then(({ default: gsap }) => {
      const ctx = gsap.context(() => {
        // ── Initial states ─────────────────────────────────────────────────────
        gsap.set(".h-badge",    { opacity: 0, y: -14, scale: 0.9 });
        gsap.set(".h-line",     { opacity: 0, y: 56 });
        gsap.set(".h-rule",     { scaleX: 0, transformOrigin: "left center" });
        gsap.set(".h-thesis",   { opacity: 0, y: 18 });
        gsap.set(".h-identity", { opacity: 0, y: 14 });
        gsap.set(".h-ctas",     { opacity: 0, y: 24 });
        gsap.set(".h-chips",    { opacity: 0 });
        gsap.set(".h-scene",    { opacity: 0, x: 44, scale: 0.93 });
        gsap.set(".h-scroll",   { opacity: 0 });

        // ── Cinematic entry timeline ───────────────────────────────────────────
        const tl = gsap.timeline({ delay: 0.2 });

        tl
          // Status badge drops in
          .to(".h-badge", {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6, ease: "back.out(1.4)",
          })
          // Headline lines rise with stagger (expo.out = fast start, long tail)
          .to(".h-line", {
            opacity: 1, y: 0,
            duration: 0.82, ease: "expo.out", stagger: 0.1,
          }, "-=0.25")
          // Fire ScrambleIn as lines begin rising
          .call(() => setScrambleTrigger(true), [], "<+=0.05")
          // Accent rule draws left-to-right
          .to(".h-rule", { scaleX: 1, duration: 0.7, ease: "power3.out" }, "-=0.45")
          // Supporting text cascades in
          .to(".h-thesis",   { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, "-=0.5")
          .to(".h-identity", { opacity: 1, y: 0, duration: 0.5,  ease: "power2.out" }, "-=0.38")
          .to(".h-ctas",     { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, "-=0.38")
          .to(".h-chips",    { opacity: 1,         duration: 0.4                     }, "-=0.3")
          .to(".h-scroll",   { opacity: 1,         duration: 0.6, ease: "power1.out" }, "-=0.1");

        // Scene swoops in from the right, independent of the text timeline
        gsap.to(".h-scene", {
          opacity: 1, x: 0, scale: 1,
          duration: 1.2, ease: "expo.out", delay: 0.35,
        });
      }, sectionRef);

      cleanup = () => ctx.revert();
    });

    return () => cleanup?.();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Introduction"
      className="relative isolate min-h-screen flex flex-col justify-center pt-16 overflow-hidden"
    >
      {/* ── Ambient background orbs — CSS-animated, zero JS ───────────────── */}
      <div
        className="absolute pointer-events-none -z-10"
        style={{
          top: "8%", right: "4%",
          width: "min(720px, 90vw)", height: "min(720px, 90vw)",
          background: "radial-gradient(ellipse at center, rgba(183,110,121,0.09) 0%, rgba(183,110,121,0.03) 48%, transparent 72%)",
          filter: "blur(64px)",
          animation: prefersReduced ? "none" : "orb-drift-a 20s ease-in-out infinite",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute pointer-events-none -z-10"
        style={{
          top: "3%", left: "0%",
          width: "min(380px, 44vw)", height: "min(380px, 44vw)",
          background: "radial-gradient(ellipse at center, rgba(183,110,121,0.05) 0%, transparent 72%)",
          filter: "blur(52px)",
          animation: prefersReduced ? "none" : "orb-drift-b 26s ease-in-out infinite",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute pointer-events-none -z-10"
        style={{
          bottom: "12%", left: "16%",
          width: "min(520px, 62vw)", height: "min(520px, 62vw)",
          background: "radial-gradient(ellipse at center, rgba(183,110,121,0.04) 0%, transparent 68%)",
          filter: "blur(72px)",
          animation: prefersReduced ? "none" : "orb-drift-c 22s ease-in-out infinite 2s",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)] w-full">
        <div
          className="grid grid-cols-1 lg:grid-cols-[52fr_48fr] xl:grid-cols-[54fr_46fr] gap-12 xl:gap-20 items-center py-24 lg:min-h-[calc(100vh-4rem)]"
          style={{ alignContent: "center" }}
        >
          {/* ── Left: Typographic statement ───────────────────────────────── */}
          <div className="flex flex-col gap-7 lg:gap-8">

            {/* Glassmorphism status badge */}
            <div
              className="h-badge inline-flex items-center gap-2.5 self-start px-4 py-2 rounded-full border"
              style={{
                background: "var(--glass-bg)",
                borderColor: "var(--glass-brd)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span
                  className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full opacity-60"
                  style={{ background: "rgb(34,197,94)" }}
                />
                <span
                  className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{ background: "rgb(34,197,94)" }}
                />
              </span>
              <span
                className="text-[10px] uppercase tracking-[0.22em] font-medium"
                style={{ color: "var(--txt-subtle)" }}
              >
                Open to work · {siteConfig.location}
              </span>
            </div>

            {/* Display headline — GSAP position + ScrambleIn text */}
            <h1 aria-label="I build from both ends.">
              <div
                className="h-line block font-serif"
                style={{
                  fontSize: "clamp(3.75rem, 6.5vw, 7rem)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.92,
                }}
              >
                <ScrambleIn
                  text="I build"
                  triggered={scrambleTrigger}
                  delay={0}
                  speed={1.1}
                  className="text-foreground"
                />
              </div>
              <div
                className="h-line block font-serif"
                style={{
                  fontSize: "clamp(3.75rem, 6.5vw, 7rem)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.92,
                }}
              >
                <ScrambleIn
                  text="from both"
                  triggered={scrambleTrigger}
                  delay={100}
                  speed={1.1}
                  className="text-foreground"
                />
              </div>
              <div
                className="h-line block font-serif italic"
                style={{
                  fontSize: "clamp(3.75rem, 6.5vw, 7rem)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.08,
                }}
              >
                <ScrambleIn
                  text="ends."
                  triggered={scrambleTrigger}
                  delay={200}
                  speed={1.1}
                  className="text-accent"
                />
              </div>
            </h1>

            {/* Gradient accent rule — draws left-to-right */}
            <div
              className="h-rule h-px w-24 origin-left"
              style={{
                background: "linear-gradient(90deg, var(--acc), var(--acc-light), transparent)",
              }}
            />

            {/* Sub-thesis */}
            <p
              className="h-thesis font-serif italic leading-snug"
              style={{
                fontSize: "clamp(1rem, 1.7vw, 1.25rem)",
                color: "var(--txt-muted)",
              }}
            >
              I built the schema, the API, and the interface. Six projects. Solo.
            </p>

            {/* Identity context */}
            <p
              className="h-identity text-[var(--text-overline)] uppercase tracking-[0.2em] font-medium"
              style={{ color: "var(--txt-subtle)" }}
            >
              {siteConfig.role} · EMSI · Class of {siteConfig.yearOfGraduation}
            </p>

            {/* CTA cluster */}
            <div className="h-ctas flex flex-wrap items-center gap-3.5">
              <MagneticButton
                href="#contact"
                primary
                aria-label="Get in touch with Lamiae"
              >
                Say Hello
                <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
              </MagneticButton>
              <MagneticButton href="#work" aria-label="View selected work">
                View My Work
              </MagneticButton>
              <MagneticButton
                href={siteConfig.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download Lamiae's resume (PDF)"
                download
              >
                <Download size={14} strokeWidth={1.75} aria-hidden="true" />
                CV
              </MagneticButton>
            </div>

            {/* Tech stack pill badges */}
            <div className="h-chips flex flex-wrap gap-2">
              {TECH.map((t) => (
                <span
                  key={t}
                  className="text-[10px] uppercase tracking-[0.13em] font-medium px-3 py-[5px] rounded-full border"
                  style={{
                    color: "var(--txt-subtle)",
                    borderColor: "var(--brd)",
                    background: "var(--srf-1)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

          </div>

          {/* ── Right: Orbital avatar scene ───────────────────────────────── */}
          <div className="h-scene flex justify-center lg:justify-end w-full">
            <HeroScene />
          </div>

        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────────────────── */}
      <div
        className="h-scroll absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2.5"
        aria-hidden="true"
      >
        <span
          className="text-[9px] uppercase tracking-[0.28em]"
          style={{ color: "var(--txt-subtle)" }}
        >
          Scroll
        </span>
        <div className="relative w-px h-10 overflow-hidden">
          {!prefersReduced && (
          <motion.div
            className="absolute inset-0 w-full"
            style={{
              background: "linear-gradient(to bottom, var(--txt-muted), transparent)",
            }}
            animate={{ y: ["-100%", "100%"] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.35,
            }}
          />
        )}
        </div>
      </div>

    </section>
  );
}
