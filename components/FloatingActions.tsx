"use client";

import { ArrowUp, MessageCircle, QrCode } from "lucide-react";

export function FloatingActions() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <aside
      className="fixed bottom-4 right-4 z-50 flex w-[118px] flex-col items-stretch gap-2 sm:bottom-5 sm:right-5 sm:w-32"
      aria-label="页面快捷操作"
    >
      <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-raised)] p-2 text-center shadow-xl shadow-slate-900/10">
        <div className="mx-auto flex aspect-square w-full items-center justify-center rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--app-bg-soft)] text-[var(--text-subtle)]">
          <QrCode size={36} />
        </div>
        <div className="mt-2 flex items-center justify-center gap-1 text-xs font-semibold text-[var(--text-main)]">
          <MessageCircle size={13} />
          微信群
        </div>
        <p className="mt-1 text-[11px] leading-4 text-[var(--text-muted)]">
          二维码推广位
        </p>
      </div>
      <button
        type="button"
        onClick={scrollToTop}
        className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-[var(--border-soft)] bg-blue-600 px-3 text-sm font-semibold text-white shadow-xl shadow-blue-950/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-label="一键回到顶部"
      >
        <ArrowUp size={17} />
        顶部
      </button>
    </aside>
  );
}
