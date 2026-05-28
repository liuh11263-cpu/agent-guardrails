"use client";

import { ArrowUp } from "lucide-react";

export function FloatingActions() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <aside
      className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5"
      aria-label="页面快捷操作"
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-soft)] bg-blue-600 text-white shadow-xl shadow-blue-950/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 sm:h-12 sm:w-12"
        aria-label="一键回到顶部"
      >
        <ArrowUp size={18} />
      </button>
    </aside>
  );
}
