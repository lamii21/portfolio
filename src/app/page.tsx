/**
 * Page composition — narrative blueprint:
 *
 * Act I   — Identity      Who is she? (Hero, Story, Timeline)
 * Act II  — Method        How does she work? (Approach, HowIThink, DesignProcess)
 * Act III — Proof         What has she built? (Projects, Labs, OpenSource, Achievements)
 * Act IV  — Depth         How deep does the stack go? (TechStack, AISection, AIPlayground)
 * Act V   — Credentials   What does she know and hold? (Certifications)
 * Act VI  — Now           Where is she now? (CurrentFocus, Contact)
 */

// ── Critical-path imports (above the fold — must hydrate immediately) ─────────
import dynamic             from "next/dynamic";
import { Navbar }          from "@/components/Navbar";
import { Hero }            from "@/components/sections/Hero";

// ── Below-fold sections — code-split into separate lazy chunks ─────────────────
// SSG pre-renders full HTML so ssr:true keeps content crawlable; the JS bundle
// is deferred and only loaded when the browser reaches that section.
const Story         = dynamic(() => import("@/components/sections/Story").then(m => m.Story));
const Timeline      = dynamic(() => import("@/components/sections/Timeline").then(m => m.Timeline));
const Approach      = dynamic(() => import("@/components/sections/Approach").then(m => m.Approach));
const HowIThink     = dynamic(() => import("@/components/sections/HowIThink").then(m => m.HowIThink));
const DesignProcess = dynamic(() => import("@/components/sections/DesignProcess").then(m => m.DesignProcess));
const Projects      = dynamic(() => import("@/components/sections/Projects").then(m => m.Projects));
const Labs          = dynamic(() => import("@/components/sections/Labs").then(m => m.Labs));
const OpenSource    = dynamic(() => import("@/components/sections/OpenSource").then(m => m.OpenSource));
const Achievements  = dynamic(() => import("@/components/sections/Achievements").then(m => m.Achievements));
const TechStack     = dynamic(() => import("@/components/sections/TechStack").then(m => m.TechStack));
// AISection contains Three.js (178 KB gz) — dynamic import keeps it out of the initial bundle
const AISection     = dynamic(() => import("@/components/sections/AISection").then(m => m.AISection));
const AIPlayground  = dynamic(() => import("@/components/sections/AIPlayground").then(m => m.AIPlayground));
const Certifications = dynamic(() => import("@/components/sections/Certifications").then(m => m.Certifications));
const CurrentFocus  = dynamic(() => import("@/components/sections/CurrentFocus").then(m => m.CurrentFocus));
const Contact       = dynamic(() => import("@/components/sections/Contact").then(m => m.Contact));
const Footer        = dynamic(() => import("@/components/sections/Footer").then(m => m.Footer));

export default function Home() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="flex min-h-screen flex-col overflow-x-hidden">

        {/* ── Act I: Identity ──────────────────────────────────────────────── */}
        <Hero />
        <Story />
        <Timeline />

        {/* ── Act II: Method ───────────────────────────────────────────────── */}
        <Approach />
        <HowIThink />
        <DesignProcess />

        {/* ── Act III: Proof ───────────────────────────────────────────────── */}
        <Projects />
        <Labs />
        <OpenSource />
        <Achievements />

        {/* ── Act IV: Depth ────────────────────────────────────────────────── */}
        <TechStack />
        <AISection />
        <AIPlayground />

        {/* ── Act V: Credentials ───────────────────────────────────────────── */}
        <Certifications />

        {/* ── Act VI: Now ──────────────────────────────────────────────────── */}
        <CurrentFocus />
        <Contact />
        <Footer />

      </main>
    </>
  );
}
