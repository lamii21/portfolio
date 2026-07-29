"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CursorMode =
  | "default"   // Dot + orbiting ring
  | "link"      // Ring morphs to rounded square
  | "project"   // Ring expands with VIEW label — focused reading
  | "portrait"  // Dashed measurement ring appears
  | "text"      // Inverted dot for text hovers (mix-blend-mode: difference)
  | "view";     // Expanded ring + OPEN label for external links / CTAs

interface CursorContextValue {
  mode: CursorMode;
  setMode: (mode: CursorMode) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const CursorContext = createContext<CursorContextValue>({
  mode: "default",
  setMode: () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function CursorProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<CursorMode>("default");
  return (
    <CursorContext.Provider value={{ mode, setMode }}>
      {children}
    </CursorContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useCursor() {
  return useContext(CursorContext);
}
