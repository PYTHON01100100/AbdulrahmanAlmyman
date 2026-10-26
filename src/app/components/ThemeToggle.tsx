"use client";

import { useEffect, useState } from "react";

// Cycle order. The button always names the NEXT theme.
export const THEMES = ["light", "dark", "neon", "akira", "cyberpunk", "gits"] as const;
type Theme = (typeof THEMES)[number];

const isTheme = (value: unknown): value is Theme =>
  typeof value === "string" && (THEMES as readonly string[]).includes(value);

const nextTheme = (theme: Theme): Theme =>
  THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];

export default function ThemeToggle() {
  // The inline script in layout.tsx has already set data-theme before paint;
  // this only syncs the button label with it.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(isTheme(current) ? current : "light");
  }, []);

  const toggle = () => {
    const next = nextTheme(theme);
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable */
    }
  };

  const next = nextTheme(theme);
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      className="nier-box nier-toggle fixed top-4 right-4 z-[60] px-3 py-1 text-xs sm:text-sm cursor-pointer select-none"
    >
      {`[ ${next.toUpperCase()} ]`}
    </button>
  );
}
