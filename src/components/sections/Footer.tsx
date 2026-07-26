"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { siteConfig, navItems } from "@/data/site";
import { staggerContainer, staggerChild, ease, duration } from "@/lib/motion";

export function Footer() {
  const year = new Date().getFullYear();
  const reduced = useReducedMotion();

  return (
    <footer
      className="border-t py-10 lg:py-12 overflow-hidden"
      style={{ borderColor: "var(--brd)" }}
      role="contentinfo"
    >
      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)]">
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >

          {/* Identity — clip wipe from left */}
          <motion.div
            className="space-y-1"
            variants={staggerChild}
          >
            <p className="font-serif text-foreground">
              {siteConfig.name}
            </p>
            <p
              className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium"
              style={{ color: "var(--txt-subtle)" }}
            >
              {siteConfig.role} · {siteConfig.location}
            </p>
          </motion.div>

          {/* Nav links — staggered */}
          <nav aria-label="Footer navigation" className="flex items-center gap-6">
            {navItems.map((item) => (
              <motion.div key={item.label} variants={staggerChild}>
                <Link
                  href={item.href}
                  className="group relative text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium transition-colors duration-200 hover:text-accent"
                  style={{ color: "var(--txt-subtle)" }}
                >
                  {item.label}
                  {/* Animated underline on hover */}
                  <span
                    className="absolute -bottom-px left-0 h-px bg-accent w-0 group-hover:w-full transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Copyright */}
          <motion.p
            className="text-[var(--text-overline)] uppercase tracking-[0.18em] font-medium"
            style={{ color: "var(--txt-subtle)" }}
            variants={staggerChild}
          >
            © {year}
          </motion.p>

        </motion.div>
      </div>
    </footer>
  );
}
