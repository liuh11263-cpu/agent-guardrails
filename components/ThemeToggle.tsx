"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("ai-debug-theme") as Theme | null;
    const preferred: Theme =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    setTheme(preferred);
    applyTheme(preferred);
  }, []);

  function updateTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem("ai-debug-theme", nextTheme);
  }

  return (
    <div className="flex h-9 items-center rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-1">
      <button
        type="button"
        onClick={() => updateTheme("light")}
        className={`flex h-7 w-8 items-center justify-center rounded-md transition ${
          theme === "light"
            ? "bg-[var(--app-bg-soft)] text-[var(--text-main)] shadow-sm"
            : "text-[var(--text-subtle)] hover:text-[var(--text-main)]"
        }`}
        aria-label="切换到日光模式"
      >
        <Sun size={16} />
      </button>
      <button
        type="button"
        onClick={() => updateTheme("dark")}
        className={`flex h-7 w-8 items-center justify-center rounded-md transition ${
          theme === "dark"
            ? "bg-[var(--app-bg-soft)] text-[var(--text-main)] shadow-sm"
            : "text-[var(--text-subtle)] hover:text-[var(--text-main)]"
        }`}
        aria-label="切换到黑夜模式"
      >
        <Moon size={16} />
      </button>
    </div>
  );
}
