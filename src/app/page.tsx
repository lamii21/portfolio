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

// ── Sections ──────────────────────────────────────────────────────────────────
import { Navbar }         from "@/components/Navbar";
import { Hero }           from "@/components/sections/Hero";
import { Story }          from "@/components/sections/Story";
import { Timeline }       from "@/components/sections/Timeline";
import { Approach }       from "@/components/sections/Approach";
import { HowIThink }      from "@/components/sections/HowIThink";
import { DesignProcess }  from "@/components/sections/DesignProcess";
import { Projects }       from "@/components/sections/Projects";
import { Labs }           from "@/components/sections/Labs";
import { OpenSource }     from "@/components/sections/OpenSource";
import { Achievements }   from "@/components/sections/Achievements";
import { TechStack }      from "@/components/sections/TechStack";
import { AISection }      from "@/components/sections/AISection";
import { AIPlayground }   from "@/components/sections/AIPlayground";
import { Certifications } from "@/components/sections/Certifications";
import { CurrentFocus }   from "@/components/sections/CurrentFocus";
import { Contact }        from "@/components/sections/Contact";
import { Footer }         from "@/components/sections/Footer";

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
