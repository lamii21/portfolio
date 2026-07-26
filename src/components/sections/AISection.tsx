"use client";

import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import {
  Brain,
  Zap,
  Database,
  GitBranch,
  Eye,
  Bot,
  FileText,
  Cpu,
  ChevronRight,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// PALETTE — forced dark, section-scoped
// ─────────────────────────────────────────────────────────────────────────────

const P = {
  bg:      "#0C0A08",
  surface: "rgba(26, 22, 16, 0.90)",
  brd:     "rgba(201,127,137,0.14)",
  brdHov:  "rgba(201,127,137,0.32)",
  acc:     "#C97F89",
  accDim:  "rgba(201,127,137,0.10)",
  accGlow: "rgba(201,127,137,0.22)",
  txt:     "#E8E4DE",
  muted:   "#7A7068",
  subtle:  "#4A4440",
  green:   "#6BA878",
  blue:    "#82B4D4",
  gold:    "#D4A76A",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// PYTHON SYNTAX TOKENIZER
// ─────────────────────────────────────────────────────────────────────────────

type TokType = "kw" | "str" | "cmt" | "num" | "fn" | "deco" | "def";
type Token   = { t: TokType; v: string };

const KW = new Set([
  "import","from","def","return","if","else","for","in","not","and","or",
  "class","with","as","None","True","False","try","except","pass","while",
  "break","lambda","yield","is","del","raise","global",
]);

function tokenize(code: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  const n = code.length;

  while (i < n) {
    const ch = code[i];

    if (ch === "#") {
      let j = i + 1;
      while (j < n && code[j] !== "\n") j++;
      out.push({ t: "cmt", v: code.slice(i, j) });
      i = j;
      continue;
    }

    if (ch === "@") {
      let j = i + 1;
      while (j < n && /[\w.]/.test(code[j])) j++;
      out.push({ t: "deco", v: code.slice(i, j) });
      i = j;
      continue;
    }

    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < n && code[j] !== ch && code[j] !== "\n") {
        if (code[j] === "\\") j++;
        j++;
      }
      out.push({ t: "str", v: code.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    if (/\d/.test(ch)) {
      let j = i;
      while (j < n && /[\d._e]/.test(code[j])) j++;
      out.push({ t: "num", v: code.slice(i, j) });
      i = j;
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let j = i;
      while (j < n && /[\w]/.test(code[j])) j++;
      const word = code.slice(i, j);
      let k = j;
      while (k < n && code[k] === " ") k++;
      const t: TokType = KW.has(word) ? "kw" : code[k] === "(" ? "fn" : "def";
      out.push({ t, v: word });
      i = j;
      continue;
    }

    out.push({ t: "def", v: ch });
    i++;
  }

  return out;
}

const TOK_CLR: Record<TokType, string> = {
  kw:   P.acc,
  str:  P.green,
  cmt:  P.subtle,
  num:  P.gold,
  fn:   P.blue,
  deco: "#B89BD4",
  def:  P.muted,
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const SNIPPETS = [
  {
    label: "FlowForge ETL",
    file: "transform.py",
    code: `# FlowForge ETL — transform layer
import pandas as pd
from sqlalchemy.orm import Session

def transform_batch(
    df: pd.DataFrame,
    session: Session
) -> pd.DataFrame:
    df = df.dropna(subset=["sensor_id", "timestamp"])
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    df = df[df["value"].between(-1e6, 1e6)]
    df = df.sort_values("timestamp").reset_index(drop=True)
    return df`,
  },
  {
    label: "Yazaki BOM Parser",
    file: "bom_parser.py",
    code: `# Yazaki Internship — BOM processor
import openpyxl
import pandas as pd

def parse_bom(path: str) -> pd.DataFrame:
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb.active
    rows = []
    for row in ws.iter_rows(min_row=3, values_only=True):
        if row[0] is None:
            continue
        rows.append({
            "part_number": str(row[0]).strip(),
            "description": row[1] or "",
            "qty": float(row[3]) if row[3] else 0,
        })
    return pd.DataFrame(rows)`,
  },
  {
    label: "FinTech LSTM",
    file: "model.py",
    code: `# FinTech Predict — sequence model
import numpy as np
from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout

def build_sequences(data: np.ndarray, window: int = 60):
    X, y = [], []
    for i in range(window, len(data)):
        X.append(data[i - window : i])
        y.append(data[i, 0])
    return np.array(X), np.array(y)

def build_model(window: int, n_features: int) -> Sequential:
    return Sequential([
        LSTM(64, return_sequences=True,
             input_shape=(window, n_features)),
        Dropout(0.2),
        LSTM(32),
        Dense(1),
    ])`,
  },
] as const;

const CAPABILITIES = [
  {
    icon: Database,
    title: "Python & Data",
    desc: "Pandas pipelines, openpyxl parsing, SQLAlchemy persistence, FastAPI endpoints. Used in 3 shipped projects.",
    pills: ["Python", "Pandas", "SQLAlchemy", "FastAPI", "openpyxl"],
    metric: "3 projects in production",
  },
  {
    icon: Brain,
    title: "Machine Learning",
    desc: "LSTM time-series forecasting, Scikit-learn preprocessing, Keras model design, evaluation and visualisation.",
    pills: ["TensorFlow/Keras", "Scikit-learn", "Matplotlib", "NumPy"],
    metric: "LSTM · forecasting pipeline",
  },
  {
    icon: Zap,
    title: "Industrial Automation",
    desc: "BOM processing at Yazaki: domain knowledge first, then automation. Manufacturing logic embedded in parsing logic.",
    pills: ["Python", "openpyxl", "Pandas", "Power BI"],
    metric: "8h → 4min per week",
  },
  {
    icon: GitBranch,
    title: "Data Pipelines",
    desc: "Ingest → transform → expose: FlowForge ETL built as a complete pipeline, each layer validated against the previous.",
    pills: ["ETL", "FastAPI", "SQLAlchemy", "Pandas"],
    metric: "Zero manual steps",
  },
] as const;

const FRONTIER = [
  {
    icon: Bot,
    title: "LLM & Agents",
    desc: "Exploring prompt engineering, tool use, and agentic architectures. Following the literature actively.",
    status: "Actively studying",
  },
  {
    icon: Eye,
    title: "Computer Vision",
    desc: "Learning object detection and image classification fundamentals through hands-on experiments.",
    status: "Experimenting",
  },
  {
    icon: FileText,
    title: "OCR & Document AI",
    desc: "Prototyping document parsing automation — a natural extension of the BOM processing work at Yazaki.",
    status: "Prototyping",
  },
  {
    icon: Cpu,
    title: "MLOps",
    desc: "Building toward model deployment and monitoring. The engineering discipline around ML, not just the models.",
    status: "Building toward",
  },
] as const;

const METRICS = [
  { value: "8h → 4min", label: "BOM processing at Yazaki", sub: "per weekly cycle" },
  { value: "3",         label: "Python projects shipped",  sub: "FlowForge · Yazaki · FinTech" },
  { value: "0",         label: "Manual steps",             sub: "in the ETL pipeline" },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// NEURAL CANVAS — Three.js particle network
// ─────────────────────────────────────────────────────────────────────────────

function NeuralCanvas({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current || reduced) return;

    let raf: number;
    let disposed = false;

    (async () => {
      const THREE = await import("three");
      if (disposed || !ref.current) return;

      const canvas = ref.current;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.setSize(W, H);

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
      camera.position.z = 100;

      // Particle positions
      const COUNT = 72;
      const pos   = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * 90;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 90;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
      }

      const ptGeo = new THREE.BufferGeometry();
      ptGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const ptMat = new THREE.PointsMaterial({
        size:        1.4,
        color:       new THREE.Color("#C97F89"),
        transparent: true,
        opacity:     0.75,
      });
      const points = new THREE.Points(ptGeo, ptMat);

      // Connection lines between nearby nodes
      const linePts: number[] = [];
      const THRESH = 26;
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = pos[i*3]   - pos[j*3];
          const dy = pos[i*3+1] - pos[j*3+1];
          const dz = pos[i*3+2] - pos[j*3+2];
          if (Math.sqrt(dx*dx + dy*dy + dz*dz) < THRESH) {
            linePts.push(pos[i*3], pos[i*3+1], pos[i*3+2]);
            linePts.push(pos[j*3], pos[j*3+1], pos[j*3+2]);
          }
        }
      }
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePts), 3));
      const lineMat = new THREE.LineBasicMaterial({
        color:       new THREE.Color("#C97F89"),
        transparent: true,
        opacity:     0.10,
      });
      const lines = new THREE.LineSegments(lineGeo, lineMat);

      const group = new THREE.Group();
      group.add(points, lines);
      scene.add(group);

      let t = 0;
      const tick = () => {
        if (disposed) return;
        raf = requestAnimationFrame(tick);
        t += 0.0008;
        group.rotation.y = t;
        group.rotation.x = Math.sin(t * 0.7) * 0.08;
        renderer.render(scene, camera);
      };
      tick();

      const onResize = () => {
        if (!ref.current || disposed) return;
        const W2 = ref.current.offsetWidth;
        const H2 = ref.current.offsetHeight;
        camera.aspect = W2 / H2;
        camera.updateProjectionMatrix();
        renderer.setSize(W2, H2);
      };
      window.addEventListener("resize", onResize);

      // Store cleanup on canvas element
      (canvas as HTMLCanvasElement & { __cleanup?: () => void }).__cleanup = () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(raf);
        renderer.dispose();
        ptGeo.dispose();
        ptMat.dispose();
        lineGeo.dispose();
        lineMat.dispose();
      };
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      const c = ref.current as (HTMLCanvasElement & { __cleanup?: () => void }) | null;
      c?.__cleanup?.();
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.38,
        pointerEvents: "none",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HIGHLIGHTED CODE
// ─────────────────────────────────────────────────────────────────────────────

function HighlightedCode({ code }: { code: string }) {
  const tokens = useMemo(() => tokenize(code), [code]);
  return (
    <code style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.72rem", lineHeight: 1.7 }}>
      {tokens.map((tok, idx) => (
        <span key={idx} style={{ color: TOK_CLR[tok.t] }}>{tok.v}</span>
      ))}
    </code>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CODE TERMINAL
// ─────────────────────────────────────────────────────────────────────────────

function CodeTerminal() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion() ?? false;

  // Auto-cycle every 5 s
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setActive((a) => (a + 1) % SNIPPETS.length), 5000);
    return () => clearInterval(id);
  }, [reduced]);

  const snippet = SNIPPETS[active];

  return (
    <div
      style={{
        background: "#080604",
        border: `1px solid ${P.brd}`,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* Titlebar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          borderBottom: `1px solid ${P.subtle}22`,
          background: "#0D0B08",
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3A3530" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3A3530" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3A3530" }} />
        <span style={{ marginLeft: 8, color: P.muted, fontSize: "0.68rem", fontFamily: "monospace" }}>
          {snippet.file}
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${P.subtle}22`, padding: "0 14px" }}>
        {SNIPPETS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setActive(i)}
            style={{
              padding: "7px 12px",
              fontSize: "0.68rem",
              fontFamily: "monospace",
              color: i === active ? P.acc : P.subtle,
              borderBottom: i === active ? `1.5px solid ${P.acc}` : "1.5px solid transparent",
              background: "none",
              border: "none",
              borderBottomWidth: 1.5,
              borderBottomStyle: "solid",
              borderBottomColor: i === active ? P.acc : "transparent",
              cursor: "pointer",
              transition: "color 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Code body */}
      <div style={{ padding: "16px 20px", minHeight: 260, position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.pre
            key={active}
            initial={reduced ? {} : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? {} : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            style={{ margin: 0, overflowX: "auto" }}
          >
            <HighlightedCode code={snippet.code} />
          </motion.pre>
        </AnimatePresence>

        {/* Blinking cursor */}
        <motion.span
          animate={reduced ? {} : { opacity: [1, 0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          style={{
            display: "inline-block",
            width: 6,
            height: 13,
            background: P.acc,
            verticalAlign: "text-bottom",
            marginLeft: 2,
            borderRadius: 1,
          }}
        />
      </div>

      {/* Progress dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          padding: "10px 14px",
          borderTop: `1px solid ${P.subtle}22`,
        }}
      >
        {SNIPPETS.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setActive(i)}
            animate={{ opacity: i === active ? 1 : 0.3, scale: i === active ? 1 : 0.8 }}
            style={{
              width: i === active ? 18 : 6,
              height: 6,
              borderRadius: 3,
              background: P.acc,
              border: "none",
              cursor: "pointer",
              transition: "width 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CAPABILITY CARD
// ─────────────────────────────────────────────────────────────────────────────

function CapabilityCard({
  cap,
  delay,
  inView,
}: {
  cap: (typeof CAPABILITIES)[number];
  delay: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion() ?? false;
  const Icon = cap.icon;

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `rgba(201,127,137,0.06)` : P.surface,
        border: `1px solid ${hovered ? P.brdHov : P.brd}`,
        borderRadius: 12,
        padding: "20px 22px",
        transition: "background 0.3s, border-color 0.3s, transform 0.3s",
        transform: hovered && !reduced ? "translateY(-3px)" : "none",
        cursor: "default",
      }}
    >
      {/* Icon + metric row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 9,
            background: hovered ? P.accGlow : P.accDim,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.3s",
            flexShrink: 0,
          }}
        >
          <Icon size={18} color={P.acc} />
        </div>
        <span
          style={{
            fontSize: "0.65rem",
            fontFamily: "monospace",
            color: P.green,
            background: "rgba(107,168,120,0.10)",
            padding: "3px 8px",
            borderRadius: 20,
            border: "1px solid rgba(107,168,120,0.20)",
            whiteSpace: "nowrap",
          }}
        >
          {cap.metric}
        </span>
      </div>

      <h3 style={{ color: P.txt, fontSize: "0.95rem", fontWeight: 600, marginBottom: 8, fontFamily: "inherit" }}>
        {cap.title}
      </h3>
      <p style={{ color: P.muted, fontSize: "0.78rem", lineHeight: 1.6, marginBottom: 14 }}>
        {cap.desc}
      </p>

      {/* Tech pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {cap.pills.map((p) => (
          <span
            key={p}
            style={{
              fontSize: "0.62rem",
              fontFamily: "monospace",
              color: P.muted,
              background: P.accDim,
              border: `1px solid ${P.brd}`,
              padding: "2px 7px",
              borderRadius: 4,
            }}
          >
            {p}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FRONTIER CARD
// ─────────────────────────────────────────────────────────────────────────────

function FrontierCard({
  item,
  delay,
  inView,
}: {
  item: (typeof FRONTIER)[number];
  delay: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion() ?? false;
  const Icon = item.icon;

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? P.accDim : "transparent",
        border: `1px dashed ${hovered ? P.brdHov : P.brd}`,
        borderRadius: 12,
        padding: "20px 20px",
        transition: "background 0.3s, border-color 0.3s",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Icon size={16} color={P.muted} />
        <h3 style={{ color: P.txt, fontSize: "0.88rem", fontWeight: 600, fontFamily: "inherit" }}>
          {item.title}
        </h3>
      </div>
      <p style={{ color: P.muted, fontSize: "0.76rem", lineHeight: 1.6, marginBottom: 12 }}>
        {item.desc}
      </p>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontSize: "0.62rem",
          fontFamily: "monospace",
          color: P.gold,
          background: "rgba(212,167,106,0.08)",
          border: "1px solid rgba(212,167,106,0.18)",
          padding: "2px 8px",
          borderRadius: 20,
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: P.gold,
            animation: reduced ? "none" : "pulse 2s ease-in-out infinite",
          }}
        />
        {item.status}
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────────────────────

export function AISection() {
  const reduced    = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="ai"
      aria-label="AI skills and capabilities"
      ref={sectionRef}
      style={{
        position: "relative",
        overflow: "hidden",
        background: P.bg,
        padding: "var(--section-py) var(--section-px)",
      }}
    >
      {/* Three.js neural background */}
      <NeuralCanvas reduced={reduced} />

      {/* Radial glow center */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${P.accGlow}, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "var(--content-max)",
          margin: "0 auto",
        }}
      >

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "clamp(3rem,6vw,5rem)" }}>
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: -12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: "0.68rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: P.acc,
              fontFamily: "monospace",
              marginBottom: 18,
              padding: "4px 12px",
              borderRadius: 20,
              border: `1px solid ${P.brd}`,
            }}
          >
            <Brain size={11} />
            AI &amp; Python
          </motion.div>

          <motion.h2
            initial={reduced ? {} : { opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "var(--text-h2)",
              color: P.txt,
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            Where Python Meets AI
          </motion.h2>

          <motion.p
            initial={reduced ? {} : { opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.16 }}
            style={{ color: P.muted, fontSize: "var(--text-body-xl)", maxWidth: 560, margin: "0 auto", lineHeight: 1.65 }}
          >
            What I have shipped, the stack behind it, and what I'm building toward.
          </motion.p>
        </div>

        {/* ── Main grid: capabilities + terminal ─────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
            gap: "clamp(2rem,4vw,3.5rem)",
            marginBottom: "clamp(3rem,6vw,5rem)",
            alignItems: "start",
          }}
        >
          {/* Left — capability cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {CAPABILITIES.map((cap, i) => (
              <CapabilityCard key={cap.title} cap={cap} delay={0.12 + i * 0.1} inView={inView} />
            ))}
          </div>

          {/* Right — code terminal */}
          <motion.div
            initial={reduced ? {} : { opacity: 0, x: 28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Label */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: P.acc, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Code from real projects
              </span>
              <ChevronRight size={11} color={P.acc} />
            </div>
            <CodeTerminal />
          </motion.div>
        </div>

        {/* ── Metrics strip ────────────────────────────────────────────────── */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            background: P.brd,
            borderRadius: 14,
            overflow: "hidden",
            marginBottom: "clamp(3rem,6vw,5rem)",
            border: `1px solid ${P.brd}`,
          }}
        >
          {METRICS.map((m) => (
            <div
              key={m.label}
              style={{ background: P.bg, padding: "24px 28px", textAlign: "center" }}
            >
              <div
                style={{
                  fontSize: "clamp(1.5rem,3vw,2.4rem)",
                  fontWeight: 700,
                  color: P.acc,
                  fontFamily: "ui-monospace, monospace",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {m.value}
              </div>
              <div style={{ color: P.txt, fontSize: "0.78rem", fontWeight: 500, marginBottom: 3 }}>
                {m.label}
              </div>
              <div style={{ color: P.muted, fontSize: "0.66rem", fontFamily: "monospace" }}>
                {m.sub}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Frontier ─────────────────────────────────────────────────────── */}
        <div>
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}
          >
            <span
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: P.muted,
                fontFamily: "monospace",
              }}
            >
              Learning frontier
            </span>
            <div style={{ flex: 1, height: 1, background: P.brd }} />
            <span style={{ color: P.subtle, fontSize: "0.62rem", fontFamily: "monospace" }}>
              Not yet shipped · In progress
            </span>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: 12,
            }}
          >
            {FRONTIER.map((item, i) => (
              <FrontierCard key={item.title} item={item} delay={0.44 + i * 0.08} inView={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
