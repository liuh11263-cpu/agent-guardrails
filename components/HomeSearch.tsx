"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { DebugCaseCard, PromptItem, SkillItem } from "@/lib/content";

type SearchMode = "prompt" | "debug" | "skill";
type HomeMatch = {
  href: string;
  eyebrow: string;
  title: string;
  summary: string;
};

export function HomeSearch({
  cases,
  prompts,
  skills
}: {
  cases: DebugCaseCard[];
  prompts: PromptItem[];
  skills: SkillItem[];
}) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("debug");
  const normalizedQuery = query.trim().toLowerCase();

  const matches = useMemo(() => {
    const includesQuery = (values: string[]) =>
      !normalizedQuery || values.join(" ").toLowerCase().includes(normalizedQuery);

    const debugMatches: HomeMatch[] = cases
      .filter((item) =>
        includesQuery([
          item.title,
          item.summary,
          item.category,
          item.tags.join(" "),
          item.tool.join(" ")
        ])
      )
      .map((item) => ({
        href: `/debug/${item.slug}`,
        eyebrow: "Debug",
        title: item.title,
        summary: `${item.category} · ${item.summary}`
      }));

    const promptMatches: HomeMatch[] = prompts
      .filter((item) =>
        includesQuery([
          item.title,
          item.category,
          item.scenario,
          item.models.join(" "),
          item.prompt
        ])
      )
      .map((item) => ({
        href: `/prompts?query=${encodeURIComponent(item.title)}`,
        eyebrow: "Prompt",
        title: item.title,
        summary: `${item.category} · ${item.scenario}`
      }));

    const skillMatches: HomeMatch[] = skills
      .filter((item) =>
        includesQuery([
          item.title,
          item.category,
          item.domain,
          item.summary,
          item.use_case,
          item.trigger_keywords.join(" "),
          item.source_name,
          item.steps.join(" ")
        ])
      )
      .map((item) => ({
        href: `/skills?query=${encodeURIComponent(item.title)}`,
        eyebrow: "Skill",
        title: item.title,
        summary: `${item.domain} · ${item.summary}`
      }));

    const source =
      mode === "prompt"
        ? promptMatches
        : mode === "skill"
        ? skillMatches
        : debugMatches;

    return source.slice(0, normalizedQuery ? 6 : 4);
  }, [cases, mode, normalizedQuery, prompts, skills]);

  const searchHref =
    mode === "prompt"
      ? `/prompts${normalizedQuery ? `?query=${encodeURIComponent(query)}` : ""}`
      : mode === "skill"
      ? `/skills${normalizedQuery ? `?query=${encodeURIComponent(query)}` : ""}`
      : `/debug${normalizedQuery ? `?query=${encodeURIComponent(query)}` : ""}`;

  const modes = [
    { id: "prompt", label: "Prompt" },
    { id: "debug", label: "Debug" },
    { id: "skill", label: "Skill" }
  ] as const;

  return (
    <div className="relative">
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-2 shadow-sm">
        <Search className="ml-2 shrink-0 text-[var(--text-subtle)]" size={22} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索报错、场景或工作流"
          className="h-12 w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-subtle)] sm:text-base"
        />
        <Link
          href={searchHref}
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
        >
          <Search size={16} />
          搜索
        </Link>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="inline-flex rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-1">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                mode === item.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:bg-[var(--app-bg-soft)] hover:text-[var(--text-main)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-center text-sm leading-6 text-[var(--text-muted)]">
        1. 输入你的问题  2. 选择类型  3. 复制对应模板给 Claude Code / Codex  4. 按验证步骤检查结果
      </p>

      {query.trim() && (
        <div className="absolute left-0 right-0 top-[70px] z-20 grid gap-2 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-raised)] p-2 shadow-xl">
          {matches.map((item) => (
            <Link
              key={`${item.eyebrow}-${item.title}`}
              href={item.href}
              className="group flex items-center justify-between gap-4 rounded-md px-3 py-3 transition hover:bg-[var(--app-bg-soft)]"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[var(--text-main)]">
                  {item.title}
                </span>
                <span className="mt-1 block truncate text-xs text-[var(--text-muted)]">
                  {item.eyebrow} · {item.summary}
                </span>
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 text-slate-400 transition group-hover:text-blue-600"
              />
            </Link>
          ))}
          {!matches.length && (
            <div className="rounded-md px-4 py-5 text-center text-sm text-[var(--text-muted)]">
              暂未匹配到内容，可以换一个关键词或切换类型。
            </div>
          )}
        </div>
      )}
    </div>
  );
}
