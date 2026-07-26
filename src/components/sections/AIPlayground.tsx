"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, RotateCcw, ChevronRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ease, duration } from "@/lib/motion";

// ─────────────────────────────────────────────────────────────────────────────
// Interactive pipeline visualizations — all based on real projects.
// No AI API calls. These are visual simulations of actual work done.
// ─────────────────────────────────────────────────────────────────────────────

const DEMOS = [
  {
    id: "etl",
    label: "ETL Pipeline",
    project: "FlowForge",
    description: "Watch raw industrial data flow through the transformation pipeline.",
    steps: [
      {
        id: "raw",
        label: "Raw Input",
        code: `# 3 rows with issues
sensor_id,timestamp,value
S001,2024-01-15,42.7
S002,null,999999
S003,2024-01-15,abc`,
        status: "dirty" as const,
        note: "3 rows — 2 bad",
      },
      {
        id: "clean",
        label: "Transform",
        code: `df = df.dropna(subset=["sensor_id","timestamp"])
df["timestamp"] = pd.to_datetime(df["timestamp"])
df["value"] = pd.to_numeric(df["value"], errors="coerce")
df = df[df["value"].between(-1e6, 1e6)]`,
        status: "processing" as const,
        note: "Validating...",
      },
      {
        id: "output",
        label: "Clean Output",
        code: `# 1 valid row
sensor_id,timestamp,value
S001,2024-01-15 00:00:00,42.7

# Dropped: S002 (null timestamp)
# Dropped: S003 (non-numeric value)`,
        status: "clean" as const,
        note: "1 row — validated",
      },
    ],
  },
  {
    id: "lstm",
    label: "LSTM Sequences",
    project: "FinTech Predict",
    description: "See how raw price data becomes LSTM input sequences.",
    steps: [
      {
        id: "prices",
        label: "Price Series",
        code: `# 5 days of closing prices (scaled)
prices = [0.42, 0.45, 0.44, 0.47, 0.50,
          0.48, 0.51, 0.53, 0.49, 0.52,
          ...]  # 200 timesteps total

# Normalized via MinMaxScaler
scaler = MinMaxScaler()
scaled = scaler.fit_transform(prices)`,
        status: "dirty" as const,
        note: "200 timesteps",
      },
      {
        id: "sequences",
        label: "Windowing",
        code: `window = 60  # 60 timesteps per sequence

X, y = [], []
for i in range(window, len(scaled)):
    X.append(scaled[i - window : i])
    y.append(scaled[i, 0])

# Shape: (140, 60, 1)
X = np.array(X)
y = np.array(y)`,
        status: "processing" as const,
        note: "Windowing...",
      },
      {
        id: "model-input",
        label: "Model Ready",
        code: `# LSTM sees sequences, not raw prices
# Input:  (140, 60, 1) → 140 samples,
#          60 timesteps, 1 feature
# Output: (140, 1)     → 140 targets

model = build_model(window=60, n_features=1)
model.fit(X_train, y_train, epochs=50)`,
        status: "clean" as const,
        note: "140 sequences",
      },
    ],
  },
  {
    id: "bom",
    label: "BOM Parser",
    project: "Yazaki",
    description: "Raw Excel BOM → clean DataFrame — the 8h → 4min automation.",
    steps: [
      {
        id: "excel",
        label: "Excel Input",
        code: `# Raw BOM (inconsistent formatting)
Row 1: [Title row — merged cells]
Row 2: [Headers — sometimes shifted]
Row 3: P-1001 | Cable harness | ... | 24
Row 4: None  | (sub-component)| ... | 2
Row 5: P-1002 | Connector     | ... | 8`,
        status: "dirty" as const,
        note: "~400 rows, messy",
      },
      {
        id: "parse",
        label: "Defensive Parse",
        code: `for row in ws.iter_rows(min_row=3, values_only=True):
    if row[0] is None:
        continue  # skip sub-components
    rows.append({
        "part_number": str(row[0]).strip(),
        "description": row[1] or "",
        "qty": float(row[3]) if row[3] else 0,
    })`,
        status: "processing" as const,
        note: "Parsing rows...",
      },
      {
        id: "dataframe",
        label: "Clean DataFrame",
        code: `   part_number     description    qty
0  P-1001     Cable harness   24.0
1  P-1002     Connector        8.0
2  P-1003     Terminal pin    48.0

# 8h manual → 4min automated
# Handles every edge-case format seen`,
        status: "clean" as const,
        note: "4 min runtime",
      },
    ],
  },
] as const;

type StepStatus = "dirty" | "processing" | "clean";

const STATUS_COLOR: Record<StepStatus, string> = {
  dirty:      "#D4A76A",
  processing: "#82B4D4",
  clean:      "#6BA878",
};

// ─────────────────────────────────────────────────────────────────────────────

export function AIPlayground() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [running, setRunning] = useState(false);
  const reduced = useReducedMotion();

  const demo = DEMOS[activeDemo];

  const runPipeline = useCallback(() => {
    if (running) return;
    setActiveStep(0);
    setRunning(true);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    if (activeStep >= demo.steps.length - 1) {
      setRunning(false);
      return;
    }
    const id = setTimeout(() => setActiveStep((s) => s + 1), reduced ? 0 : 900);
    return () => clearTimeout(id);
  }, [running, activeStep, demo.steps.length, reduced]);

  const reset = () => {
    setRunning(false);
    setActiveStep(0);
  };

  const currentStep = demo.steps[activeStep];

  return (
    <section
      id="playground"
      aria-label="AI Pipeline Playground"
      className="py-[var(--section-py)] relative overflow-hidden"
      style={{ background: "#0C0A08", color: "#E8E4DE" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(130,180,212,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[var(--content-max)] mx-auto px-[var(--section-px)] relative z-10">

        {/* Header */}
        <div className="flex items-center gap-6 mb-16">
          <motion.span
            className="text-[var(--text-overline)] uppercase tracking-[0.22em] font-medium shrink-0"
            style={{ color: "#C97F89" }}
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: ease.out }}
            viewport={{ once: true, amount: 0.5 }}
          >
            AI Playground
          </motion.span>
          <motion.div
            className="flex-1 h-px origin-left"
            style={{ background: "rgba(201,127,137,0.18)" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.12 }}
            viewport={{ once: true, amount: 0.5 }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 items-start">

          {/* Left: Demo selector */}
          <div>
            <p
              className="font-serif italic mb-8"
              style={{
                fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
                color: "#9A9087",
                lineHeight: 1.55,
              }}
            >
              Interactive simulations of three real pipelines. Select one, then run.
            </p>

            <div className="space-y-3">
              {DEMOS.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => { setActiveDemo(i); reset(); }}
                  aria-pressed={activeDemo === i}
                  className="w-full text-left rounded-xl p-4 border transition-all duration-300"
                  style={{
                    background: activeDemo === i ? "rgba(201,127,137,0.07)" : "transparent",
                    borderColor: activeDemo === i ? "rgba(201,127,137,0.28)" : "rgba(201,127,137,0.10)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-sm font-medium"
                      style={{ color: activeDemo === i ? "#C97F89" : "#9A9087" }}
                    >
                      {d.label}
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-[0.14em] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(201,127,137,0.08)",
                        color: "#7A7068",
                        fontFamily: "ui-monospace, monospace",
                      }}
                    >
                      {d.project}
                    </span>
                  </div>
                  <p className="text-[12px]" style={{ color: "#5A5248" }}>
                    {d.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={runPipeline}
                disabled={running}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  background: running ? "rgba(107,168,120,0.12)" : "rgba(107,168,120,0.15)",
                  color: "#6BA878",
                  border: "1px solid rgba(107,168,120,0.25)",
                  opacity: running ? 0.6 : 1,
                }}
              >
                <Play size={13} />
                {running ? "Running..." : "Run Pipeline"}
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  background: "rgba(201,127,137,0.08)",
                  color: "#7A7068",
                  border: "1px solid rgba(201,127,137,0.12)",
                }}
              >
                <RotateCcw size={13} />
                Reset
              </button>
            </div>
          </div>

          {/* Right: Pipeline visualizer */}
          <div>

            {/* Step navigator */}
            <div className="flex items-center gap-0 mb-6 overflow-x-auto">
              {demo.steps.map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => { setActiveStep(i); setRunning(false); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
                    style={{
                      background: activeStep === i ? "rgba(201,127,137,0.10)" : "transparent",
                      color: activeStep === i ? "#C97F89" : "#5A5248",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{ background: activeStep >= i ? STATUS_COLOR[step.status] : "#2A2620" }}
                    />
                    <span className="whitespace-nowrap">{step.label}</span>
                  </button>
                  {i < demo.steps.length - 1 && (
                    <ChevronRight size={12} style={{ color: "#2A2620", flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>

            {/* Code panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeDemo}-${activeStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: ease.out }}
                className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${STATUS_COLOR[currentStep.status]}22` }}
              >
                {/* Titlebar */}
                <div
                  className="flex items-center justify-between px-4 py-3 border-b"
                  style={{
                    background: "#0D0B08",
                    borderColor: "#1A1612",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: STATUS_COLOR[currentStep.status] }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{ color: STATUS_COLOR[currentStep.status], fontFamily: "ui-monospace, monospace" }}
                    >
                      {currentStep.label}
                    </span>
                  </div>
                  <span
                    className="text-[10px] uppercase tracking-[0.14em] font-medium"
                    style={{ color: "#4A4440", fontFamily: "ui-monospace, monospace" }}
                  >
                    {currentStep.note}
                  </span>
                </div>

                {/* Code content */}
                <pre
                  className="p-5 overflow-x-auto"
                  style={{
                    background: "#080604",
                    fontFamily: "ui-monospace, monospace",
                    fontSize: "0.72rem",
                    lineHeight: 1.7,
                    color: "#8A8078",
                    margin: 0,
                  }}
                >
                  {currentStep.code}
                </pre>
              </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            <div
              className="mt-4 h-0.5 rounded-full overflow-hidden"
              style={{ background: "#1A1612" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: STATUS_COLOR[currentStep.status],
                  width: "100%",
                  transformOrigin: "left center",
                }}
                animate={{ scaleX: (activeStep + 1) / demo.steps.length }}
                transition={{ duration: 0.4, ease: ease.out }}
              />
            </div>
            <p
              className="mt-2 text-[11px]"
              style={{ color: "#4A4440", fontFamily: "ui-monospace, monospace" }}
            >
              Step {activeStep + 1} / {demo.steps.length}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
