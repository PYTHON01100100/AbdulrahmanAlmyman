"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "neon";

// Click order: light -> dark -> neon -> light. The button names the NEXT mode.
const NEXT: Record<Theme, Theme> = { light: "dark", dark: "neon", neon: "light" };

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark" || value === "neon";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(isTheme(current) ? current : "light");
  }, []);

  const toggle = () => {
    const next = NEXT[theme];
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable */
    }
  };

  const next = NEXT[theme];
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      className="nier-box nier-toggle fixed top-4 right-4 z-[60] px-3 py-1 text-xs sm:text-sm cursor-pointer select-none"
    >
      {`[ ${next.toUpperCase()} ]`}
    </button>
  );
}
