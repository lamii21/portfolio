"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Camera,
  Code2,
  Cpu,
  Box,
  ChevronDown,
  Check,
  AlertTriangle,
  Zap,
  GitBranch,
  Database,
  Layers,
  ExternalLink,
} from "lucide-react";
import { type Project } from "@/data/projects";
import {
  ease,
  duration,
  viewport,
  fadeUp,
  fadeIn,
  scaleIn,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";

// ── Static content ────────────────────────────────────────────────────────────

const PIPELINE_STEPS = [
  {
    id: "capture",
    icon: Camera,
    label: "Capture",
    sublabel: "OpenCV",
    color: "rgba(183,110,121,1)",
    bg: "rgba(183,110,121,0.10)",
    description:
      "The student photographs a handwritten or printed math problem. OpenCV applies adaptive thresholding, Gaussian blur, and morphological operations to produce a clean binary image ready for recognition.",
    tech: ["OpenCV", "Adaptive thresholding", "Gaussian blur", "Contour detection"],
    code: `# Preprocessing pipeline
gray   = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
blur   = cv2.GaussianBlur(gray, (5, 5), 0)
thresh = cv2.adaptiveThreshold(
    blur, 255,
    cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv2.THRESH_BINARY_INV, 11, 2
)`,
  },
  {
    id: "parse",
    icon: Code2,
    label: "Parse",
    sublabel: "OCR + Normalizer",
    color: "rgba(139,92,246,1)",
    bg: "rgba(139,92,246,0.10)",
    description:
      "Raw text is extracted from the preprocessed image and normalized through a 200+ symbol dictionary. Surface variants like 'JS', 'JavaScript', and 'ES6' collapse to canonical forms. Mathematical notation (∫, Σ, √) maps to SymPy-parseable strings.",
    tech: ["OCR engine", "Symbol normalization", "Math notation mapping", "Custom dictionary"],
    code: `# Canonical normalization
SYMBOL_MAP = {
    "∫": "Integral",
    "√": "sqrt",
    "²": "**2",
    "Σ": "Sum",
    ...
}
expr_str = normalize(raw_text, SYMBOL_MAP)`,
  },
  {
    id: "solve",
    icon: Cpu,
    label: "Solve",
    sublabel: "SymPy",
    color: "rgba(34,197,94,1)",
    bg: "rgba(34,197,94,0.08)",
    description:
      "SymPy parses the canonical expression into an expression tree and solves it symbolically — producing exact answers (1/3, not 0.333...) and step-by-step intermediate transformations that match what a student would write on paper.",
    tech: ["SymPy", "Expression trees", "Symbolic computation", "Step extraction"],
    code: `from sympy import symbols, solve, latex
x = symbols('x')
expr = sympify(expr_str)

# Step-by-step intermediate forms
steps = extract_solution_steps(expr)
result = solve(expr, x)
latex_result = latex(result)`,
  },
  {
    id: "visualize",
    icon: Box,
    label: "Visualize",
    sublabel: "Three.js",
    color: "rgba(251,146,60,1)",
    bg: "rgba(251,146,60,0.08)",
    description:
      "For functions and geometric problems, the result is rendered as an interactive 3D surface. The Three.js renderer is managed in a custom React hook — clean lifecycle, no GPU memory leaks, fully disposed on unmount.",
    tech: ["Three.js", "WebGL", "React hooks", "Custom useEffect lifecycle"],
    code: `// React hook — clean Three.js lifecycle
useEffect(() => {
  const renderer = new THREE.WebGLRenderer();
  const scene    = buildScene(parsedFn);
  mount.current.appendChild(renderer.domElement);
  return () => {
    scene.clear();
    renderer.dispose(); // GPU cleanup
  };
}, [parsedFn]);`,
  },
];

const ARCHITECTURE_LAYERS = [
  {
    label: "Frontend",
    sublabel: "React · TypeScript · Three.js",
    color: "rgba(183,110,121,0.12)",
    border: "rgba(183,110,121,0.4)",
    items: ["Camera Input", "Step Renderer", "3D Graph (Three.js)", "Progress Dashboard"],
  },
  {
    label: "API Gateway",
    sublabel: "Django REST · JWT",
    color: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.35)",
    items: ["Auth (JWT)", "Exercise Endpoints", "Solver Invocation", "Progress API"],
  },
  {
    label: "Processing",
    sublabel: "OpenCV · SymPy · Python",
    color: "rgba(34,197,94,0.06)",
    border: "rgba(34,197,94,0.3)",
    items: ["Image Preprocessor", "OCR + Normalizer", "SymPy Solver", "Step Extractor"],
  },
  {
    label: "Data",
    sublabel: "PostgreSQL · SQLite (dev)",
    color: "rgba(251,146,60,0.06)",
    border: "rgba(251,146,60,0.28)",
    items: ["User", "Exercise", "Progress", "SolverLog"],
  },
];

const BENCHMARKS = [
  {
    metric: "OCR accuracy — printed input",
    value: "~85–90%",
    note: "After full preprocessing pipeline",
    status: "good",
  },
  {
    metric: "OCR accuracy — handwritten input",
    value: "Lower — varies by handwriting",
    note: "Handwritten math is a known hard OCR target",
    status: "warn",
  },
  {
    metric: "SymPy solve time — polynomial",
    value: "À compléter",
    note: "Formal benchmarks not yet recorded",
    status: "todo",
  },
  {
    metric: "SymPy solve time — integral / ODE",
    value: "À compléter",
    note: "Formal benchmarks not yet recorded",
    status: "todo",
  },
  {
    metric: "API response time (end-to-end)",
    value: "À compléter",
    note: "Benchmark against test exercises needed",
    status: "todo",
  },
  {
    metric: "Three.js render — first frame",
    value: "À compléter",
    note: "Cold start vs. warm (renderer lifecycle)",
    status: "todo",
  },
  {
    metric: "Progress DB query (user history)",
    value: "O(1) on indexed join",
    note: "Progress table indexed on (user_id, exercise_id)",
    status: "good",
  },
  {
    metric: "Supported math domains",
    value: "Algebra, calculus, geometry",
    note: "No support yet for combinatorics or number theory",
    status: "good",
  },
];

const LIMITATIONS = [
  {
    title: "Handwritten math recognition accuracy",
    body: "Handwritten mathematical notation is one of the hardest OCR targets in existence. Symbols like ∫, Σ, and custom-drawn fractions have near-infinite stylistic variance. The current preprocessing pipeline improves accuracy on printed input to 85–90%; handwritten input is meaningfully lower. This is an inherent limitation of rule-based OCR — not a bug.",
    type: "technical" as const,
  },
  {
    title: "No async processing — solver blocks the request thread",
    body: "SymPy and OpenCV are both synchronous. A complex integral or ODE can hold the request thread for several seconds. In a concurrent classroom scenario with many students solving simultaneously, this creates latency. The correct fix is Celery + Redis for async task processing — not implemented yet.",
    type: "architecture" as const,
  },
  {
    title: "No mobile camera API — file upload only",
    body: "The OCR pipeline works, but the student interface uses a file-upload input rather than a direct camera stream. On mobile, the browser's file picker can open the camera, but the experience is not as fluid as a native camera flow would be.",
    type: "ux" as const,
  },
  {
    title: "Symbol set is curated, not comprehensive",
    body: "The normalization dictionary covers algebra, single and multivariable calculus, and standard geometry symbols. It does not cover combinatorics (C(n,k), P(n,k)), number theory (congruence notation), or advanced linear algebra notation. Problems outside the covered domain fail to parse.",
    type: "scope" as const,
  },
  {
    title: "Three.js renderer on every new expression — no scene caching",
    body: "Each new function triggers a full scene rebuild. For interactive graphing (drag the slider, watch the graph change in real time), scene caching with parameter-only updates would be more efficient. Not yet implemented.",
    type: "performance" as const,
  },
];

const ROADMAP = [
  {
    phase: "v1.1",
    label: "Async Solver",
    description:
      "Move SymPy and OCR calls to a Celery task queue backed by Redis. The API responds immediately with a task ID; the frontend polls for completion. Eliminates the blocking request pattern entirely.",
    status: "planned",
  },
  {
    phase: "v1.2",
    label: "Mobile Camera Stream",
    description:
      "Replace the file-upload input with a WebRTC camera stream in the browser. The student points the phone camera at the problem — no tap-to-capture required. Live preprocessing preview to confirm the image is readable before submitting.",
    status: "planned",
  },
  {
    phase: "v1.3",
    label: "Transformer-based Math OCR",
    description:
      "Replace the current rule-based OCR with a fine-tuned Vision Transformer (ViT) or Pix2Struct model trained on mathematical notation. The model learns spatial relationships between symbols that rule-based approaches miss.",
    status: "research",
  },
  {
    phase: "v2.0",
    label: "Adaptive Difficulty Engine",
    description:
      "Use the Progress table to infer the student's current mastery level per topic. Surface exercises at the correct difficulty automatically — not chosen by the student. Spaced repetition scheduling for exercises the student has partially mastered.",
    status: "research",
  },
  {
    phase: "v2.1",
    label: "Collaborative Sessions",
    description:
      "Shared problem-solving sessions where a teacher can assign a problem to all students simultaneously and watch solve progress in real time. WebSocket-based presence layer over the existing Progress model.",
    status: "concept",
  },
];

const FAQ = [
  {
    q: "Why SymPy instead of a numerical solver like NumPy or SciPy?",
    a: "Numerical solvers produce floating-point approximations — 0.33333... instead of 1/3, no intermediate steps. A student checking their algebra needs to see exact symbolic transformations that match what they would write on paper. SymPy produces exact answers and exposes the intermediate expression tree, which is what makes step-by-step explanation possible.",
  },
  {
    q: "Why OpenCV preprocessing instead of feeding the image directly to the OCR?",
    a: "Standard OCR engines are trained on printed text in standard fonts. Mathematical notation — especially handwritten symbols, fractions written vertically, and symbols like ∫ and Σ — sits far outside that distribution. Without preprocessing (binarization, noise removal, morphological operations to close symbol gaps), recognition accuracy on math problems drops to unusable levels.",
  },
  {
    q: "Why Django REST instead of FastAPI?",
    a: "Django's ORM has more mature primitives for the relational modeling required by the Progress table — a join table between User and Exercise with typed fields. At this scale, the difference in performance between Django REST and FastAPI is not the bottleneck. The ORM and the admin interface were worth the framework overhead.",
  },
  {
    q: "Why did you rebuild the Progress model at day 17?",
    a: "The first Progress model stored state as a field on the Exercise entity — wrong cardinality. Exercise is a shared resource; it cannot hold per-user state. When I tested the UI flow and found that two users couldn't both have different completion statuses on the same exercise, the schema problem became obvious. The rebuild took two days and produced a dramatically cleaner query structure.",
  },
  {
    q: "Could you replace the full pipeline with a multimodal LLM (GPT-4V, Claude)?",
    a: "Yes — and this would be the correct next architectural step for v3. A multimodal LLM can directly interpret a photograph of a handwritten math problem without an explicit OCR + parsing layer. The tradeoff: higher per-request cost, API dependency, and less control over intermediate steps. For a production system, the LLM approach is probably the right answer. For understanding the full pipeline, building each layer explicitly was the better learning experience.",
  },
  {
    q: "What math domains are currently supported?",
    a: "Algebra (single and multivariable), single-variable calculus (derivatives and definite integrals), and basic geometry (area, volume, coordinate geometry). The symbol normalization dictionary covers these domains. Combinatorics, number theory, statistics, and advanced linear algebra are outside the current scope.",
  },
  {
    q: "Is the Three.js renderer accessible?",
    a: "The 3D graph component is currently not accessible to screen reader users — it renders a WebGL canvas without an alt description or ARIA role. Adding aria-label with a text description of the rendered function, and a fallback 2D SVG plot for reduced-motion mode, are on the roadmap for v1.1.",
  },
];

const NAV_SECTIONS = [
  { id: "hm-pipeline", label: "Pipeline" },
  { id: "hm-arch",     label: "Architecture" },
  { id: "hm-how",      label: "How It Works" },
  { id: "hm-bench",    label: "Benchmarks" },
  { id: "hm-demo",     label: "Demo" },
  { id: "hm-limits",   label: "Limitations" },
  { id: "hm-roadmap",  label: "Roadmap" },
  { id: "hm-faq",      label: "FAQ" },
];

// ── Main component ────────────────────────────────────────────────────────────

interface HandyMathShowcaseProps {
  project: Project;
  allProjects: Project[];
}

export function HandyMathShowcase({ project, allProjects }: HandyMathShowcaseProps) {
  const [activeSection, setActiveSection] = useState("hm-pipeline");
  const [activeStep, setActiveStep]       = useState(0);
  const [openFaq, setOpenFaq]             = useState<number | null>(null);
  const reduced = useReducedMotion();

  // Scroll spy
  useEffect(() => {
    const els = NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: "-30% 0px -55% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const idx  = allProjects.findIndex((p) => p.id === project.id);
  const next = allProjects[idx + 1] ?? null;

  return (
    <div className="min-h-screen" style={{ background: "var(--srf-0)" }}>

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-50 border-b"
        style={{ background: "var(--srf-0)", borderColor: "var(--brd)" }}
      >
        <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)] h-14 flex items-center justify-between">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent"
            style={{ color: "var(--txt-muted)" }}
          >
            <ArrowLeft size={15} strokeWidth={1.75} aria-hidden />
            All work
          </Link>
          <span
            className="hidden sm:block uppercase tracking-[0.18em] font-medium"
            style={{ fontSize: "10px", color: "var(--txt-subtle)" }}
          >
            Education · AI · Full-Stack · 2023
          </span>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(183,110,121,0.06) 0%, transparent 55%)",
          borderBottom: "1px solid var(--brd)",
        }}
      >
        {/* Ambient orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: "-10%", right: "-5%",
            width: "min(700px,80vw)", height: "min(700px,80vw)",
            background: "radial-gradient(ellipse at center, rgba(183,110,121,0.08) 0%, transparent 68%)",
            filter: "blur(80px)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            bottom: "0", left: "10%",
            width: "min(400px,50vw)", height: "min(400px,50vw)",
            background: "radial-gradient(ellipse at center, rgba(139,92,246,0.06) 0%, transparent 68%)",
            filter: "blur(60px)",
          }}
        />

        <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)] pt-20 pb-16 lg:pt-28 lg:pb-20 relative">

          {/* Category pills */}
          <motion.div
            className="flex flex-wrap gap-2 mb-7"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            {["Education", "AI", "Computer Vision", "Full-Stack", "Solo Build"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase tracking-[0.18em] font-medium px-3 py-1 rounded-full border"
                style={{ borderColor: "var(--brd)", color: "var(--txt-subtle)" }}
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-start">
            <div>
              {/* Title */}
              <div className="overflow-hidden mb-4">
                <motion.h1
                  className="font-serif text-foreground leading-[0.92] tracking-[-0.04em]"
                  style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
                  initial={reduced ? false : { y: "105%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: duration.deliberate, ease: ease.out, delay: 0.08 }}
                >
                  HandyMath
                </motion.h1>
              </div>

              <motion.p
                className="font-serif italic max-w-xl mb-8"
                style={{ fontSize: "clamp(1rem, 1.8vw, 1.25rem)", color: "var(--txt-muted)" }}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.2}
              >
                A student photographs a math problem. The system reads it,
                solves it symbolically, explains every step, and renders
                the function in 3D. Solo build, 4 months.
              </motion.p>

              {/* Impact metrics */}
              <motion.div
                className="flex flex-wrap gap-3"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                custom={0.3}
              >
                {[
                  { v: "OCR → SymPy → 3D", label: "full pipeline" },
                  { v: "4 months",          label: "solo build" },
                  { v: "15+ endpoints",     label: "REST API" },
                  { v: "Python + React",    label: "full-stack" },
                ].map(({ v, label }) => (
                  <motion.div
                    key={v}
                    variants={staggerItem}
                    className="px-4 py-2.5 rounded-xl border flex items-baseline gap-2"
                    style={{ background: "var(--srf-1)", borderColor: "var(--brd)" }}
                  >
                    <span
                      className="font-serif font-medium"
                      style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)", color: "var(--acc)" }}
                    >
                      {v}
                    </span>
                    <span
                      className="font-light"
                      style={{ fontSize: "11px", color: "var(--txt-subtle)" }}
                    >
                      {label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Tech stack column */}
            <motion.div
              className="flex flex-col gap-2 lg:pt-2"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.4}
            >
              {[
                { name: "OpenCV", color: "rgba(139,92,246,0.12)", text: "rgba(139,92,246,1)" },
                { name: "SymPy", color: "rgba(34,197,94,0.10)", text: "rgb(34,197,94)" },
                { name: "Three.js", color: "rgba(251,146,60,0.10)", text: "rgba(251,146,60,1)" },
                { name: "Django REST", color: "rgba(183,110,121,0.10)", text: "var(--acc)" },
                { name: "React", color: "rgba(96,165,250,0.10)", text: "rgba(96,165,250,1)" },
                { name: "PostgreSQL", color: "rgba(34,197,94,0.08)", text: "rgb(34,197,94)" },
                { name: "JWT", color: "rgba(183,110,121,0.10)", text: "var(--acc)" },
              ].map((t) => (
                <span
                  key={t.name}
                  className="text-[10px] uppercase tracking-[0.13em] font-medium px-3 py-1.5 rounded-full text-center"
                  style={{ background: t.color, color: t.text }}
                >
                  {t.name}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)] py-16">
        <div className="flex gap-16 xl:gap-24">

          {/* Sticky nav */}
          <aside className="hidden lg:block shrink-0 w-44">
            <nav className="sticky top-24 space-y-1">
              <p
                className="uppercase tracking-[0.18em] font-medium mb-4"
                style={{ fontSize: "9px", color: "var(--txt-subtle)" }}
              >
                Contents
              </p>
              {NAV_SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="flex items-center gap-2.5 py-1.5 text-sm font-light transition-all duration-200"
                  style={{
                    color: activeSection === id ? "var(--acc)" : "var(--txt-subtle)",
                    fontSize: "13px",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  <span
                    className="shrink-0 h-px transition-all duration-300"
                    style={{
                      width: activeSection === id ? 20 : 10,
                      background: activeSection === id ? "var(--acc)" : "var(--brd-strong)",
                    }}
                    aria-hidden
                  />
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-24 lg:space-y-32">

            {/* ── Section: Pipeline ──────────────────────────────────────── */}
            <section id="hm-pipeline" aria-label="OCR to 3D pipeline">
              <ShowcaseHeading
                eyebrow="01"
                title="OCR → SymPy → 3D Pipeline"
                subtitle="Four distinct processing stages, each with its own failure mode. The pipeline is only as good as its weakest stage."
              />

              {/* Step selector */}
              <div className="flex overflow-x-auto gap-3 mb-8 pb-1">
                {PIPELINE_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const active = activeStep === i;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(i)}
                      className="flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-200"
                      style={{
                        background: active ? step.bg : "var(--srf-1)",
                        borderColor: active ? step.color : "var(--brd)",
                        color: active ? step.color : "var(--txt-subtle)",
                      }}
                    >
                      <Icon size={14} strokeWidth={1.75} aria-hidden />
                      <span className="text-sm font-medium whitespace-nowrap">{step.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Animated pipeline diagram */}
              <PipelineDiagram activeStep={activeStep} reduced={reduced ?? false} />

              {/* Active step detail */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: duration.base, ease: ease.out }}
                  className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {/* Description */}
                  <div
                    className="p-6 rounded-2xl border"
                    style={{ background: "var(--srf-1)", borderColor: "var(--brd)" }}
                  >
                    <p
                      className="uppercase tracking-[0.18em] font-medium mb-3"
                      style={{ fontSize: "9px", color: PIPELINE_STEPS[activeStep].color }}
                    >
                      {PIPELINE_STEPS[activeStep].sublabel}
                    </p>
                    <p
                      className="font-light leading-[1.78]"
                      style={{ fontSize: "13.5px", color: "var(--txt-muted)" }}
                    >
                      {PIPELINE_STEPS[activeStep].description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {PIPELINE_STEPS[activeStep].tech.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] uppercase tracking-[0.11em] font-medium px-2.5 py-1 rounded-full"
                          style={{
                            background: PIPELINE_STEPS[activeStep].bg,
                            color: PIPELINE_STEPS[activeStep].color,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Code snippet */}
                  <div
                    className="p-5 rounded-2xl border overflow-hidden"
                    style={{ background: "var(--srf-0)", borderColor: "var(--brd)" }}
                  >
                    <p
                      className="uppercase tracking-[0.18em] font-medium mb-3"
                      style={{ fontSize: "9px", color: "var(--txt-subtle)" }}
                    >
                      Code
                    </p>
                    <pre
                      className="font-mono overflow-x-auto"
                      style={{ fontSize: "11.5px", lineHeight: 1.7, color: "var(--txt-muted)" }}
                    >
                      <code>{PIPELINE_STEPS[activeStep].code}</code>
                    </pre>
                  </div>
                </motion.div>
              </AnimatePresence>
            </section>

            {/* ── Section: Architecture ──────────────────────────────────── */}
            <section id="hm-arch" aria-label="System architecture">
              <ShowcaseHeading
                eyebrow="02"
                title="System Architecture"
                subtitle="Four layers with distinct responsibilities. The schema shaped every other decision — the solver output format, the API contract, and the UI state model."
              />

              {/* Architecture layers */}
              <div className="space-y-3 mb-10">
                {ARCHITECTURE_LAYERS.map((layer, i) => (
                  <motion.div
                    key={layer.label}
                    className="rounded-2xl border p-5"
                    style={{ background: layer.color, borderColor: layer.border }}
                    initial={reduced ? false : { opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: duration.slow, ease: ease.out }}
                    viewport={viewport}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div>
                        <p
                          className="font-serif font-medium text-foreground"
                          style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)" }}
                        >
                          {layer.label}
                        </p>
                        <p
                          className="font-mono font-light"
                          style={{ fontSize: "11px", color: "var(--txt-subtle)" }}
                        >
                          {layer.sublabel}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {layer.items.map((item) => (
                          <span
                            key={item}
                            className="text-[10px] font-medium px-2.5 py-1 rounded-lg border"
                            style={{
                              borderColor: layer.border,
                              color: "var(--txt-muted)",
                              background: "var(--srf-0)",
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Arrow connectors between layers */}
                <div className="flex justify-center py-1">
                  <div className="flex flex-col items-center gap-1" aria-hidden>
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-px"
                        style={{ height: "8px", background: "var(--brd-strong)" }}
                      />
                    ))}
                    <div
                      style={{
                        width: 0, height: 0,
                        borderLeft: "4px solid transparent",
                        borderRight: "4px solid transparent",
                        borderTop: "6px solid var(--brd-strong)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Data flow note */}
              <motion.div
                className="py-4 pl-5 rounded-r-lg"
                style={{ borderLeft: "2px solid var(--acc)", background: "linear-gradient(90deg, rgba(183,110,121,0.04) 0%, transparent 80%)" }}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                custom={0}
              >
                <p
                  className="font-serif italic leading-relaxed"
                  style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)", color: "var(--txt-muted)" }}
                >
                  The relational schema — User → Progress → Exercise → SolverLog — was designed first.
                  Every API endpoint, UI state model, and solver output format is a consequence of the schema.
                  Not the other way around.
                </p>
              </motion.div>

              {/* DB schema cards */}
              <div className="mt-8">
                <p
                  className="uppercase tracking-[0.22em] font-medium mb-4"
                  style={{ fontSize: "10px", color: "var(--txt-subtle)" }}
                >
                  Core schema entities
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      name: "User", color: "rgba(183,110,121,0.35)",
                      fields: ["id (pk)", "email", "password_hash", "created_at"],
                    },
                    {
                      name: "Exercise", color: "rgba(139,92,246,0.35)",
                      fields: ["id (pk)", "topic", "difficulty", "equation_raw", "solution_steps"],
                    },
                    {
                      name: "Progress", color: "rgba(34,197,94,0.3)",
                      fields: ["id (pk)", "user_id (fk)", "exercise_id (fk)", "score", "attempt_count"],
                    },
                    {
                      name: "SolverLog", color: "rgba(251,146,60,0.28)",
                      fields: ["id (pk)", "exercise_id (fk)", "raw_ocr_text", "parsed_expr", "solver_output"],
                    },
                  ].map((entity, i) => (
                    <motion.div
                      key={entity.name}
                      className="rounded-xl border overflow-hidden"
                      style={{ borderColor: entity.color }}
                      initial={reduced ? false : { opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: duration.slow, ease: ease.out }}
                      viewport={viewport}
                    >
                      <div
                        className="px-3 py-2 border-b"
                        style={{ borderColor: entity.color, background: "var(--srf-1)" }}
                      >
                        <span className="font-mono font-medium text-accent" style={{ fontSize: "12px" }}>
                          {entity.name}
                        </span>
                      </div>
                      <div style={{ background: "var(--srf-0)" }}>
                        {entity.fields.map((f) => (
                          <div
                            key={f}
                            className="px-3 py-1.5 border-b last:border-0 font-mono"
                            style={{ fontSize: "11px", color: "var(--txt-subtle)", borderColor: "var(--brd)" }}
                          >
                            {f}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Section: How It Works ──────────────────────────────────── */}
            <section id="hm-how" aria-label="How the system works">
              <ShowcaseHeading
                eyebrow="03"
                title="How It Works"
                subtitle="The full request lifecycle — from camera shutter to rendered solution."
              />

              <div className="space-y-4">
                {[
                  {
                    n: "1",
                    title: "Student photographs the problem",
                    body: "Camera input or file upload. The image arrives at the Django API as a multipart form upload.",
                    icon: Camera,
                    color: "rgba(183,110,121,1)",
                  },
                  {
                    n: "2",
                    title: "OpenCV preprocesses the image",
                    body: "Adaptive thresholding binarizes the image. Gaussian blur removes noise. Morphological operations close gaps in symbol contours. The result is a clean binary image where mathematical symbols are high-contrast and the background is white.",
                    icon: Layers,
                    color: "rgba(139,92,246,1)",
                  },
                  {
                    n: "3",
                    title: "OCR extracts text, normalizer parses symbols",
                    body: "OCR converts the binary image to a string. The normalizer maps surface variants (∫, √, ², Σ) to SymPy-parseable canonical forms. Ambiguous readings surface a confirmation step to the student before solving.",
                    icon: Code2,
                    color: "rgba(96,165,250,1)",
                  },
                  {
                    n: "4",
                    title: "SymPy solves symbolically — exact answers and steps",
                    body: "SymPy parses the canonical string into an expression tree. The solver produces an exact symbolic answer and the intermediate transformation steps. No floating-point approximations.",
                    icon: Cpu,
                    color: "rgba(34,197,94,1)",
                  },
                  {
                    n: "5",
                    title: "Django REST API persists the result",
                    body: "The solve result is persisted to SolverLog. The Progress entry for this user × exercise pair is created or updated. The API returns the solution steps and, if the exercise is a function, the equation string for Three.js.",
                    icon: Database,
                    color: "rgba(251,146,60,1)",
                  },
                  {
                    n: "6",
                    title: "React renders steps — Three.js renders the 3D graph",
                    body: "The solution steps are displayed as sequential algebraic transformations — formatted to match what the student would write. If the problem is a function (f(x), surface), Three.js renders an interactive 3D graph the student can rotate and inspect.",
                    icon: Box,
                    color: "rgba(183,110,121,1)",
                  },
                ].map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.n}
                      className="flex gap-4 p-5 rounded-2xl border"
                      style={{ background: "var(--srf-1)", borderColor: "var(--brd)" }}
                      initial={reduced ? false : { opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: duration.slow, ease: ease.out }}
                      viewport={viewport}
                    >
                      <div
                        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                        style={{ background: `${step.color}15` }}
                      >
                        <Icon size={14} strokeWidth={1.75} style={{ color: step.color }} aria-hidden />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="font-mono text-xs"
                            style={{ color: step.color }}
                          >
                            {step.n}.
                          </span>
                          <h3
                            className="font-serif text-foreground"
                            style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)" }}
                          >
                            {step.title}
                          </h3>
                        </div>
                        <p
                          className="font-light leading-[1.75]"
                          style={{ fontSize: "13.5px", color: "var(--txt-muted)" }}
                        >
                          {step.body}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* ── Section: Benchmarks ────────────────────────────────────── */}
            <section id="hm-bench" aria-label="Performance benchmarks">
              <ShowcaseHeading
                eyebrow="04"
                title="Benchmarks &amp; Performance"
                subtitle="Honest measurement. Where real data exists, it is shown. Where it doesn't, the section is marked for completion rather than filled with fabricated numbers."
              />

              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--brd)" }}>
                {/* Table header */}
                <div
                  className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 border-b"
                  style={{ background: "var(--srf-1)", borderColor: "var(--brd)" }}
                >
                  <span className="text-[10px] uppercase tracking-[0.16em] font-medium" style={{ color: "var(--txt-subtle)" }}>Metric</span>
                  <span className="text-[10px] uppercase tracking-[0.16em] font-medium" style={{ color: "var(--txt-subtle)" }}>Value</span>
                  <span className="sr-only">Status</span>
                </div>

                {BENCHMARKS.map((row, i) => (
                  <motion.div
                    key={i}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 sm:gap-6 px-5 py-4 border-b last:border-0"
                    style={{ borderColor: "var(--brd)", background: i % 2 === 0 ? "var(--srf-0)" : "var(--srf-1)" }}
                    initial={reduced ? false : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: i * 0.04, duration: duration.slow }}
                    viewport={viewport}
                  >
                    <div>
                      <p className="font-light text-foreground" style={{ fontSize: "13.5px" }}>
                        {row.metric}
                      </p>
                      <p className="font-light mt-0.5" style={{ fontSize: "11.5px", color: "var(--txt-subtle)" }}>
                        {row.note}
                      </p>
                    </div>
                    <div className="flex items-start sm:items-center gap-2">
                      <span
                        className="font-mono font-medium whitespace-nowrap"
                        style={{
                          fontSize: "13px",
                          color:
                            row.status === "good" ? "rgb(34,197,94)" :
                            row.status === "warn" ? "rgb(251,146,60)" :
                            "var(--txt-subtle)",
                        }}
                      >
                        {row.value}
                      </span>
                      {row.status === "good" && <Check size={13} style={{ color: "rgb(34,197,94)", flexShrink: 0 }} aria-hidden />}
                      {row.status === "warn" && <AlertTriangle size={13} style={{ color: "rgb(251,146,60)", flexShrink: 0 }} aria-hidden />}
                      {row.status === "todo" && (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full uppercase font-medium"
                          style={{ fontSize: "8px", background: "rgba(183,110,121,0.10)", color: "var(--acc)", letterSpacing: "0.1em", borderWidth: "1px", borderStyle: "dashed", borderColor: "var(--acc)" }}
                        >
                          À compléter
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <p
                className="mt-4 font-light italic"
                style={{ fontSize: "12px", color: "var(--txt-subtle)" }}
              >
                Benchmarks marked &ldquo;À compléter&rdquo; require a formal test setup with a representative exercise set and timing instrumentation on the solver and preprocessing stages.
              </p>
            </section>

            {/* ── Section: Demo & Screenshots ────────────────────────────── */}
            <section id="hm-demo" aria-label="Demo and screenshots">
              <ShowcaseHeading
                eyebrow="05"
                title="Demo &amp; Screenshots"
                subtitle="Placeholder frames — to be filled with actual captures and a screen-recorded walkthrough of the full pipeline."
              />

              {/* Video placeholder */}
              <motion.div
                className="relative rounded-2xl border overflow-hidden mb-8"
                style={{ borderColor: "var(--brd)", aspectRatio: "16/9", background: "var(--srf-1)" }}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                custom={0}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center border-2"
                    style={{ borderColor: "var(--acc)", background: "rgba(183,110,121,0.08)" }}
                  >
                    <div
                      style={{
                        width: 0, height: 0,
                        borderTop: "9px solid transparent",
                        borderBottom: "9px solid transparent",
                        borderLeft: "16px solid var(--acc)",
                        marginLeft: "3px",
                      }}
                      aria-hidden
                    />
                  </div>
                  <div className="text-center">
                    <p
                      className="font-serif text-foreground mb-1"
                      style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)" }}
                    >
                      Full Pipeline Demo
                    </p>
                    <p
                      className="font-light"
                      style={{ fontSize: "12px", color: "var(--txt-subtle)" }}
                    >
                      Camera capture → OCR → SymPy solve → Three.js 3D render
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full uppercase font-medium"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.12em",
                      background: "rgba(183,110,121,0.10)",
                      color: "var(--acc)",
                      borderWidth: "1px",
                      borderStyle: "dashed",
                      borderColor: "var(--acc)",
                    }}
                  >
                    À compléter — screen recording needed
                  </span>
                </div>
                {/* Decorative grid */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: "linear-gradient(rgba(183,110,121,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(183,110,121,0.04) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                    opacity: 0.6,
                  }}
                  aria-hidden
                />
              </motion.div>

              {/* Screenshot grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "OCR Capture Flow", desc: "Student photographs equation → parsed expression shown for confirmation before solving" },
                  { label: "Step-by-Step Solver", desc: "SymPy solution rendered as sequential algebraic transformations — one step per row" },
                  { label: "Three.js 3D Graph", desc: "Interactive 3D surface — rotate, zoom, inspect — rendered from the solved function" },
                  { label: "Progress Dashboard", desc: "Per-topic completion rate, recent exercises, difficulty progression over time" },
                ].map((shot, i) => (
                  <motion.div
                    key={i}
                    className="rounded-xl border overflow-hidden"
                    style={{ borderColor: "var(--brd)" }}
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: duration.slow, ease: ease.out }}
                    viewport={viewport}
                  >
                    <div
                      className="relative flex flex-col items-center justify-center gap-3 aspect-video"
                      style={{ background: "var(--srf-1)" }}
                    >
                      <span style={{ fontSize: "24px", opacity: 0.35 }} aria-hidden>📸</span>
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full uppercase font-medium"
                        style={{
                          fontSize: "8px",
                          letterSpacing: "0.12em",
                          background: "rgba(183,110,121,0.08)",
                          color: "var(--acc)",
                          borderWidth: "1px",
                          borderStyle: "dashed",
                          borderColor: "var(--acc)",
                        }}
                      >
                        À compléter
                      </span>
                      {/* grid pattern */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          backgroundImage: "linear-gradient(rgba(183,110,121,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(183,110,121,0.04) 1px, transparent 1px)",
                          backgroundSize: "24px 24px",
                          opacity: 0.6,
                        }}
                        aria-hidden
                      />
                    </div>
                    <div
                      className="px-4 py-3 border-t"
                      style={{ background: "var(--srf-0)", borderColor: "var(--brd)" }}
                    >
                      <p className="font-medium mb-0.5" style={{ fontSize: "12px", color: "var(--txt-muted)" }}>
                        {shot.label}
                      </p>
                      <p className="font-light leading-snug" style={{ fontSize: "11.5px", color: "var(--txt-subtle)" }}>
                        {shot.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ── Section: Limitations ───────────────────────────────────── */}
            <section id="hm-limits" aria-label="Known limitations">
              <ShowcaseHeading
                eyebrow="06"
                title="Known Limitations"
                subtitle="This section exists because a project without documented limitations is either not understood or being misrepresented. These are real constraints, not polish opportunities."
              />

              <div className="space-y-4">
                {LIMITATIONS.map((lim, i) => (
                  <motion.div
                    key={i}
                    className="p-6 rounded-2xl border"
                    style={{ background: "var(--srf-1)", borderColor: "var(--brd)" }}
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: duration.slow, ease: ease.out }}
                    viewport={viewport}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <AlertTriangle
                        size={14}
                        strokeWidth={1.75}
                        className="mt-0.5 shrink-0"
                        style={{
                          color:
                            lim.type === "technical"    ? "var(--acc)" :
                            lim.type === "architecture" ? "rgba(139,92,246,0.9)" :
                            lim.type === "ux"           ? "rgba(251,146,60,0.9)" :
                            lim.type === "performance"  ? "rgba(34,197,94,0.9)" :
                                                          "var(--txt-subtle)",
                        }}
                        aria-hidden
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3
                            className="font-serif text-foreground"
                            style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)" }}
                          >
                            {lim.title}
                          </h3>
                          <span
                            className="uppercase tracking-[0.12em] font-medium px-2 py-0.5 rounded-md"
                            style={{ fontSize: "8px", background: "var(--srf-0)", color: "var(--txt-subtle)" }}
                          >
                            {lim.type}
                          </span>
                        </div>
                        <p
                          className="font-light leading-[1.78]"
                          style={{ fontSize: "13.5px", color: "var(--txt-muted)" }}
                        >
                          {lim.body}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ── Section: Roadmap ───────────────────────────────────────── */}
            <section id="hm-roadmap" aria-label="Future improvements">
              <ShowcaseHeading
                eyebrow="07"
                title="Roadmap"
                subtitle="Planned improvements — ordered by impact on the core use case, not by implementation complexity."
              />

              <div className="relative">
                <div
                  className="absolute left-[7px] top-2 bottom-2 w-px"
                  style={{ background: "var(--brd)" }}
                  aria-hidden
                />
                <div className="space-y-6">
                  {ROADMAP.map((item, i) => (
                    <motion.div
                      key={item.phase}
                      className="relative flex gap-6 pl-8"
                      initial={reduced ? false : { opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.09, duration: duration.slow, ease: ease.out }}
                      viewport={viewport}
                    >
                      {/* Node */}
                      <div
                        className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                        style={{
                          borderColor:
                            item.status === "planned"  ? "var(--acc)" :
                            item.status === "research" ? "rgba(139,92,246,0.8)" :
                                                         "var(--brd-strong)",
                          background: "var(--srf-0)",
                        }}
                        aria-hidden
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background:
                              item.status === "planned"  ? "var(--acc)" :
                              item.status === "research" ? "rgba(139,92,246,0.8)" :
                                                           "var(--brd-strong)",
                          }}
                        />
                      </div>

                      <div className="flex-1 pb-1">
                        <div className="flex flex-wrap items-baseline gap-3 mb-1.5">
                          <span
                            className="font-mono font-medium"
                            style={{ fontSize: "11px", color: "var(--acc)" }}
                          >
                            {item.phase}
                          </span>
                          <h3
                            className="font-serif text-foreground"
                            style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)" }}
                          >
                            {item.label}
                          </h3>
                          <span
                            className="uppercase tracking-[0.12em] font-medium px-2 py-0.5 rounded-md"
                            style={{
                              fontSize: "8px",
                              color:
                                item.status === "planned"  ? "rgb(34,197,94)" :
                                item.status === "research" ? "rgba(139,92,246,0.9)" :
                                                             "var(--txt-subtle)",
                              background:
                                item.status === "planned"  ? "rgba(34,197,94,0.08)" :
                                item.status === "research" ? "rgba(139,92,246,0.08)" :
                                                             "var(--srf-1)",
                            }}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p
                          className="font-light leading-relaxed"
                          style={{ fontSize: "13.5px", color: "var(--txt-muted)" }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Section: FAQ ───────────────────────────────────────────── */}
            <section id="hm-faq" aria-label="Frequently asked questions">
              <ShowcaseHeading
                eyebrow="08"
                title="Technical FAQ"
                subtitle="Questions a senior engineer or technical recruiter would ask — answered directly."
              />

              <div className="space-y-3">
                {FAQ.map((item, i) => (
                  <motion.div
                    key={i}
                    className="rounded-2xl border overflow-hidden"
                    style={{ borderColor: openFaq === i ? "rgba(183,110,121,0.5)" : "var(--brd)" }}
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: duration.slow, ease: ease.out }}
                    viewport={viewport}
                  >
                    <button
                      className="w-full flex items-start justify-between gap-4 px-6 py-4 text-left transition-colors duration-200"
                      style={{ background: openFaq === i ? "rgba(183,110,121,0.04)" : "var(--srf-1)" }}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                    >
                      <span
                        className="font-serif text-foreground leading-snug"
                        style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)" }}
                      >
                        {item.q}
                      </span>
                      <ChevronDown
                        size={16}
                        strokeWidth={1.75}
                        className="shrink-0 mt-0.5 transition-transform duration-200"
                        style={{
                          color: "var(--txt-subtle)",
                          transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                        aria-hidden
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {openFaq === i && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: duration.base, ease: ease.out }}
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            className="px-6 pb-5 border-t"
                            style={{ borderColor: "var(--brd)", background: "var(--srf-0)" }}
                          >
                            <p
                              className="font-light leading-[1.82] pt-4"
                              style={{ fontSize: "13.5px", color: "var(--txt-muted)" }}
                            >
                              {item.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ── GitHub link ────────────────────────────────────────────── */}
            <motion.div
              className="pt-4 pb-8 border-t flex flex-wrap items-center justify-between gap-4"
              style={{ borderColor: "var(--brd)" }}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              custom={0}
            >
              <div>
                <p
                  className="uppercase tracking-[0.2em] font-medium mb-1"
                  style={{ fontSize: "9px", color: "var(--txt-subtle)" }}
                >
                  Technologies
                </p>
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "Django REST", "Python", "JWT", "OpenCV", "SymPy", "Three.js", "PostgreSQL"].map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center px-3 py-1.5 rounded-full border uppercase tracking-[0.11em] font-medium"
                      style={{ fontSize: "10px", borderColor: "var(--brd)", color: "var(--txt-muted)", background: "var(--srf-1)" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href="https://github.com/lamii21"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent"
                style={{ color: "var(--txt-muted)" }}
                aria-label="View HandyMath source on GitHub"
              >
                <GitBranch size={14} strokeWidth={1.75} aria-hidden />
                GitHub
                <ExternalLink size={12} strokeWidth={1.75} aria-hidden />
              </a>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── Footer nav ───────────────────────────────────────────────────── */}
      <div className="border-t" style={{ borderColor: "var(--brd)" }}>
        <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)] py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <Link
              href="/#work"
              className="group flex items-center gap-3 transition-colors hover:text-accent"
              style={{ color: "var(--txt-muted)" }}
            >
              <ArrowLeft
                size={16}
                strokeWidth={1.5}
                className="transition-transform group-hover:-translate-x-1"
                aria-hidden
              />
              <div>
                <p className="uppercase tracking-[0.18em] font-medium mb-0.5" style={{ fontSize: "9px", color: "var(--txt-subtle)" }}>
                  Back
                </p>
                <span className="font-serif" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)" }}>
                  All work
                </span>
              </div>
            </Link>

            <Link
              href="/#work"
              className="text-sm font-medium transition-colors hover:text-accent uppercase tracking-[0.1em]"
              style={{ color: "var(--txt-subtle)", fontSize: "11px" }}
            >
              All projects
            </Link>

            {next && (
              <Link
                href={`/work/${next.id}`}
                className="group flex items-center gap-3 text-right transition-colors hover:text-accent"
                style={{ color: "var(--txt-muted)" }}
              >
                <div>
                  <p className="uppercase tracking-[0.18em] font-medium mb-0.5" style={{ fontSize: "9px", color: "var(--txt-subtle)" }}>
                    Next
                  </p>
                  <span className="font-serif" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)" }}>
                    {next.title}
                  </span>
                </div>
                <ArrowLeft
                  size={16}
                  strokeWidth={1.5}
                  className="rotate-180 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

// ── Pipeline Diagram SVG ──────────────────────────────────────────────────────

function PipelineDiagram({ activeStep, reduced }: { activeStep: number; reduced: boolean }) {
  const steps = [
    { label: "Camera", sub: "OpenCV",  cx: 70,  color: "rgba(183,110,121,1)" },
    { label: "Parse",  sub: "OCR",     cx: 215, color: "rgba(139,92,246,1)" },
    { label: "Solve",  sub: "SymPy",   cx: 360, color: "rgba(34,197,94,1)" },
    { label: "Render", sub: "Three.js",cx: 505, color: "rgba(251,146,60,1)" },
  ];

  return (
    <div
      className="relative rounded-2xl border overflow-hidden"
      style={{ borderColor: "var(--brd)", background: "var(--srf-1)" }}
    >
      {/* Dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.15,
          backgroundImage: "radial-gradient(circle, rgba(183,110,121,0.7) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 100% 100% at 50% 50%, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 50% 50%, black 40%, transparent 80%)",
        }}
      />

      <svg
        viewBox="0 0 580 120"
        aria-hidden
        style={{ width: "100%", display: "block" }}
      >
        {/* Connector lines */}
        {[0, 1, 2].map((i) => {
          const x1 = steps[i].cx + 38;
          const x2 = steps[i + 1].cx - 38;
          const active = activeStep > i;
          return (
            <g key={i}>
              <line
                x1={x1} y1={60} x2={x2} y2={60}
                stroke={active ? steps[i].color : "var(--brd)"}
                strokeWidth={1.5}
                strokeDasharray={active ? "0" : "4 3"}
                style={{ transition: reduced ? "none" : "stroke 0.4s ease, stroke-dasharray 0.4s ease" }}
              />
              {/* Arrow head */}
              <polygon
                points={`${x2},55 ${x2 + 8},60 ${x2},65`}
                fill={active ? steps[i + 1].color : "var(--brd)"}
                style={{ transition: reduced ? "none" : "fill 0.4s ease" }}
              />
            </g>
          );
        })}

        {/* Step nodes */}
        {steps.map((step, i) => {
          const active = activeStep === i;
          const done   = activeStep > i;
          return (
            <g
              key={step.label}
              style={{ cursor: "pointer" }}
            >
              {/* Outer ring (active glow) */}
              {active && !reduced && (
                <circle
                  cx={step.cx} cy={60} r={42}
                  fill="none"
                  stroke={step.color}
                  strokeWidth={1}
                  opacity={0.2}
                />
              )}
              {/* Main circle */}
              <circle
                cx={step.cx} cy={60} r={36}
                fill={active ? `${step.color}18` : done ? `${step.color}10` : "var(--srf-0)"}
                stroke={active || done ? step.color : "var(--brd)"}
                strokeWidth={active ? 1.8 : 1}
                style={{ transition: reduced ? "none" : "all 0.35s ease" }}
              />
              {/* Label */}
              <text
                x={step.cx} y={55}
                textAnchor="middle"
                fill={active || done ? step.color : "var(--txt-muted)"}
                fontSize={11}
                fontWeight={active ? 600 : 400}
                fontFamily="inherit"
                style={{ transition: reduced ? "none" : "fill 0.35s ease" }}
              >
                {step.label}
              </text>
              <text
                x={step.cx} y={70}
                textAnchor="middle"
                fill={active || done ? step.color : "var(--txt-subtle)"}
                fontSize={9}
                opacity={0.75}
                fontFamily="inherit"
                style={{ transition: reduced ? "none" : "fill 0.35s ease" }}
              >
                {step.sub}
              </text>
              {/* Done checkmark */}
              {done && (
                <text
                  x={step.cx + 26} y={38}
                  textAnchor="middle"
                  fill={step.color}
                  fontSize={10}
                  fontFamily="inherit"
                >
                  ✓
                </text>
              )}
            </g>
          );
        })}

        {/* Data flow label */}
        <text x={290} y={16} textAnchor="middle" fill="var(--txt-subtle)" fontSize={9} fontFamily="inherit" opacity={0.7}>
          click a stage to inspect
        </text>
      </svg>
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────

function ShowcaseHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-4">
        <span
          className="font-serif italic shrink-0"
          style={{ fontSize: "clamp(0.85rem, 1.2vw, 1rem)", color: "var(--txt-subtle)" }}
          aria-hidden
        >
          {eyebrow}
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--brd)" }} aria-hidden />
        <h2
          className="font-serif text-foreground shrink-0"
          style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)" }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
      {subtitle && (
        <p
          className="font-light leading-[1.75] max-w-2xl"
          style={{ fontSize: "13.5px", color: "var(--txt-subtle)" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
