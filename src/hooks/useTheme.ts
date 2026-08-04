"use client";

import { useState, useEffect } from "react";

/**
 * Theme hook — reads and toggles dark mode.
 *
 * Strategy:
 *  - The blocking script in layout.tsx sets the initial .dark class on <html>
 *    before React hydrates, preventing FOUC.
 *  - This hook syncs React state with the DOM state on mount,
 *    then handles subsequent toggles via classList + localStorage.
 *
 * Hydration note: initializing isDark to false (light) on the server is safe.
 * The CSS .dark class controls the visual — the React state only drives the
 * toggle button icon. useEffect syncs them immediately after mount.
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  // Sync React state with the actual DOM class on mount
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage blocked (incognito / strict settings) — fail silently
    }
  };

  return { isDark, toggle };
}


