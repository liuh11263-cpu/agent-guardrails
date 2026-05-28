"use client";

import { Github, Star, TerminalSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { getBookmarkHelpText } from "@/lib/bookmark";

const navItems = [
  { href: "/", label: "首页 / Home" },
  { href: "/docs", label: "使用指南 / Docs" },
  { href: "/debug", label: "Debug 库" },
  { href: "/prompts", label: "Prompt 库" },
  { href: "/skills", label: "Skill 库" },
  { href: "/categories", label: "分类 / Categories" }
];

export function Header() {
  const pathname = usePathname();
  const [bookmarkMessage, setBookmarkMessage] = useState("");

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
    script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
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

  function handleBookmark() {
    const message = getBookmarkHelpText(window.navigator.platform);
    setBookmarkMessage(message);
    window.setTimeout(() => setBookmarkMessage(""), 2600);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--nav-border)] bg-[var(--nav-bg)] text-[var(--nav-text)] shadow-sm">
      <div className="flex min-h-[68px] w-full items-center justify-between gap-3 px-4 lg:gap-5 lg:px-6">
        <Link href="/" className="flex min-w-[180px] items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-950/30">
            <TerminalSquare size={23} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold leading-5 text-[var(--nav-text)]">
              Agent Guardrails / Debug 手册
            </span>
            <span className="hidden text-xs text-[var(--nav-muted)] sm:block">
              Prompt / Skill Archive
            </span>
          </span>
        </Link>
        <nav className="flex flex-1 items-center justify-end gap-1 overflow-x-auto md:gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-lg px-2.5 py-2 text-xs font-semibold transition md:px-4 md:text-sm ${
                isActive(item.href)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                  : "text-[var(--nav-muted)] hover:bg-[var(--app-bg-soft)] hover:text-[var(--nav-text)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden min-w-[260px] flex-1 items-center justify-end gap-3 lg:flex">
          <ThemeToggle />
          <div id="gtranslate_wrapper" className="flex items-center min-h-[38px]"></div>
          <div className="relative">
            <button
              type="button"
              onClick={handleBookmark}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-2 text-sm font-semibold text-[var(--nav-text)] hover:bg-[var(--app-bg-soft)]"
              aria-label="收藏本站"
            >
              <Star size={16} />
              收藏
            </button>
            <span
              aria-live="polite"
              className={`absolute right-0 top-[calc(100%+8px)] w-max max-w-[260px] rounded-lg border border-[var(--border-soft)] bg-[var(--surface-raised)] px-3 py-2 text-xs font-medium text-[var(--text-muted)] shadow-lg transition ${
                bookmarkMessage
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0"
              }`}
            >
              {bookmarkMessage}
            </span>
          </div>
          <a
            href="https://github.com/liuh11263-cpu/agent-guardrails"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-2 text-sm font-semibold text-[var(--nav-text)] hover:bg-[var(--app-bg-soft)]"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={16} />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
