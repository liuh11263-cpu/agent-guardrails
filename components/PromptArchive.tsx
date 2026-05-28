"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CopyPromptButton } from "@/components/CopyPrompt";
import type { DebugCaseCard, PromptItem } from "@/lib/content";

const categoryOrder = [
  "Debug Prompts",
  "Refactor Prompts",
  "RAG Prompts",
  "Agent Prompts",
  "Claude Code Prompts",
  "Codex Prompts",
  "WeChat Mini Program Prompts",
  "SEO Content Prompts",
  "Review Prompts"
];

export function PromptArchive({
  prompts,
  cases
}: {
  prompts: PromptItem[];
  cases: DebugCaseCard[];
}) {
  const [category, setCategory] = useState("全部");
  const [query, setQuery] = useState("");

  const caseMap = useMemo(
    () => new Map(cases.map((item) => [item.slug, item])),
    [cases]
  );

  const categories = ["全部", ...categoryOrder];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPrompts = prompts.filter((item) => {
    const haystack = [
      item.title,
      item.category,
      item.scenario,
      item.models.join(" "),
      item.prompt
    ]
      .join(" ")
      .toLowerCase();

    return (
      (category === "全部" || item.category === category) &&
      (!normalizedQuery || haystack.includes(normalizedQuery))
    );
  });

  useEffect(() => {
    const selectedQuery = new URLSearchParams(window.location.search).get(
      "query"
    );

    if (selectedQuery) {
      setQuery(selectedQuery);
    }
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
      <aside className="h-fit rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-4 lg:sticky lg:top-[252px] lg:max-h-[calc(100vh-17rem)] lg:overflow-auto">
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-[var(--border-soft)] bg-[var(--app-bg-soft)] px-3 py-2">
          <Search size={16} className="text-[var(--text-subtle)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索 Prompt 场景"
            className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-subtle)]"
          />
        </div>
        <div className="grid gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                category === item
                  ? "border-[var(--border-strong)] bg-[var(--app-bg-soft)] font-semibold text-[var(--text-main)]"
                  : "border-[var(--border-soft)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--app-bg-soft)] hover:text-[var(--text-main)]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </aside>
      <section className="min-w-0">
        <div className="mb-4">
          <p className="text-sm font-semibold text-[var(--accent)]">
            {filteredPrompts.length} 个可复用 Prompt
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-[var(--text-main)]">
            按工程任务归档
          </h2>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredPrompts.map((item) => (
            <article
              key={item.slug}
              className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-5"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                  {item.category}
                </span>
                {item.models.slice(0, 2).map((model) => (
                  <span
                    key={model}
                    className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                  >
                    {model}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-main)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                {item.scenario}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.linkedDebug.map((slug) => {
                  const linked = caseMap.get(slug);
                  if (!linked) return null;

                  return (
                    <Link
                      key={slug}
                      href={`/debug/${slug}`}
                      className="rounded-md border border-[var(--border-soft)] px-2 py-1 text-xs text-[var(--text-muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
                    >
                      {linked.title}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--border-soft)] pt-4">
                <span className="text-xs text-[var(--text-subtle)]">
                  可复制到 Claude Code / Codex
                </span>
                <CopyPromptButton text={item.prompt} label="复制 Prompt" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
