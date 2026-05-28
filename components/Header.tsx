"use client";

import { Github, TerminalSquare, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/docs", label: "使用指南" },
  { href: "/debug", label: "Debug 库" },
  { href: "/prompts", label: "Prompt 库" },
  { href: "/skills", label: "Skill 库" },
  { href: "/categories", label: "分类" }
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    (window as any).gtranslateSettings = {
      default_language: "zh-CN",
      languages: ["zh-CN", "en"],
      wrapper_selector: "#gtranslate_wrapper",
      flag_size: 16,
      horizontal_position: "inline",
      inline_layout: "text_flags",
      alt_flags: { en: "usa" }
    };

    const script = document.createElement("script");
    script.src = "https://cdn.gtranslate.net/widgets/latest/dropdown.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="gtranslate"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="relative sticky top-0 z-40 border-b border-[var(--nav-border)] bg-[var(--nav-bg)] text-[var(--nav-text)] shadow-sm">
      <div className="flex min-h-[68px] w-full items-center justify-between gap-3 px-3 sm:px-4 lg:gap-5 lg:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-950/30">
            <TerminalSquare size={23} />
          </span>
          <span className="min-w-0 pr-1">
            <span className="block truncate text-sm font-semibold leading-5 text-[var(--nav-text)] sm:text-base">
              Agent Guardrails 调试手册
            </span>
            <span className="hidden text-[10px] text-[var(--nav-muted)] sm:block">
              Prompt / Skill 实战库
            </span>
          </span>
        </Link>
        <nav className="hidden lg:flex flex-1 items-center justify-end gap-1.5 md:gap-2 px-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition md:px-3 md:text-sm ${
                isActive(item.href)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                  : "text-[var(--nav-muted)] hover:bg-[var(--app-bg-soft)] hover:text-[var(--nav-text)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <ThemeToggle />
          <div id="gtranslate_wrapper" className="flex items-center min-h-[38px] scale-90 sm:scale-100 origin-right"></div>
          <a
            href="https://github.com/liuh11263-cpu/agent-guardrails"
            className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-soft)] bg-[var(--surface-raised)] px-2.5 text-xs font-semibold text-[var(--nav-text)] transition hover:bg-[var(--app-bg-soft)] sm:px-3 sm:text-sm"
            target="_blank"
            rel="noreferrer"
            aria-label="查看 GitHub 仓库"
          >
            <Github size={15} />
            <span className="hidden md:inline">GitHub</span>
          </a>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-soft)] bg-[var(--surface-raised)] text-[var(--nav-text)] hover:bg-[var(--app-bg-soft)] lg:hidden"
            aria-label="切换菜单"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-[68px] z-40 border-b border-[var(--nav-border)] bg-[var(--nav-bg)] px-4 py-3 shadow-lg lg:hidden animate-slide-down">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block rounded-lg px-3.5 py-2.5 text-sm font-semibold transition ${
                  isActive(item.href)
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                    : "text-[var(--nav-muted)] hover:bg-[var(--app-bg-soft)] hover:text-[var(--nav-text)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* 移动端专属 GitHub 链接（在极小屏 sm 以下显示） */}
            <a
              href="https://github.com/liuh11263-cpu/agent-guardrails"
              onClick={() => setIsMenuOpen(false)}
              className="flex sm:hidden items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-[var(--nav-muted)] hover:bg-[var(--app-bg-soft)] hover:text-[var(--nav-text)] transition"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={16} />
              <span>GitHub 仓库</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
