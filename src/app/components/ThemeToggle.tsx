"use client";

import { useEffect, useRef, useState } from "react";

// Registered themes. To add one: append it here, add its CSS variables in
// globals.css and its name to the list in the inline script in layout.tsx.
export const THEMES = [
  { id: "light", label: "YoRHa Light" },
  { id: "dark", label: "YoRHa Dark" },
  { id: "neon", label: "Hacking Neon" },
  { id: "lain", label: "Copland OS Navi" },
  { id: "evangelion", label: "NERV MAGI Cluster" },
  { id: "mgs1", label: "CODEC Chassis" },
  { id: "gruvbox", label: "Retro Groove" },
  { id: "catppuccin", label: "Catppuccin Mocha" },
  { id: "ubuntu", label: "Canonical Shell" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

const isTheme = (value: unknown): value is ThemeId =>
  THEMES.some((theme) => theme.id === value);

export default function ThemeToggle() {
  // The inline script in layout.tsx sets data-theme before first paint;
  // this only syncs the menu with it.
  const [theme, setTheme] = useState<ThemeId>("light");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(isTheme(current) ? current : "light");
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (id: ThemeId) => {
    document.documentElement.dataset.theme = id;
    setTheme(id);
    setOpen(false);
    try {
      localStorage.setItem("theme", id);
    } catch {
      /* storage unavailable */
    }
  };

  const index = THEMES.findIndex((t) => t.id === theme);
  return (
    <div ref={rootRef} className="fixed top-4 right-4 z-[70] text-xs sm:text-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose a theme"
        className="nier-box nier-toggle px-3 py-1 cursor-pointer select-none"
      >
        [ THEME {String(index + 1).padStart(2, "0")} ]
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Themes"
          className="nier-box theme-menu absolute right-0 mt-2 w-60 py-1"
        >
          {THEMES.map((t, i) => (
            <li key={t.id} role="option" aria-selected={t.id === theme}>
              <button
                type="button"
                onClick={() => choose(t.id)}
                className="nier-row flex w-full items-center gap-2 px-3 py-1 text-left cursor-pointer"
              >
                <span className="text-terminal-comment">
                  {String(i + 1).padStart(2, "0")} //
                </span>
                <span className="grow">{t.label}</span>
                {t.id === theme && <span aria-hidden="true">◆</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
