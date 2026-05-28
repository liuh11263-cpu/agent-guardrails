"use client";

import { Filter, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { DebugCaseCard } from "@/lib/content";

const difficultyLabels: Record<string, string> = {
  beginner: "入门",
  intermediate: "进阶",
  advanced: "高级"
};

function unique(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export function DebugExplorer({ cases }: { cases: DebugCaseCard[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [tag, setTag] = useState("全部");
  const [difficulty, setDifficulty] = useState("全部");

  const categories = useMemo(
    () => ["全部", ...unique(cases.map((item) => item.category))],
    [cases]
  );
  const tags = useMemo(
    () => ["全部", ...unique(cases.flatMap((item) => item.tags))],
    [cases]
  );
  const difficulties = useMemo(
    () => ["全部", ...unique(cases.map((item) => item.difficulty))],
    [cases]
  );

  const filteredCases = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return cases.filter((item) => {
      const haystack = [
        item.title,
        item.summary,
        item.category,
        item.tags.join(" "),
        item.tool.join(" ")
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!normalizedQuery || haystack.includes(normalizedQuery)) &&
        (category === "全部" || item.category === category) &&
        (tag === "全部" || item.tags.includes(tag)) &&
        (difficulty === "全部" || item.difficulty === difficulty)
      );
    });
  }, [cases, category, difficulty, query, tag]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedCategory = params.get("category");
    const selectedQuery = params.get("query");

    if (selectedCategory && categories.includes(selectedCategory)) {
      setCategory(selectedCategory);
    }

    if (selectedQuery) {
      setQuery(selectedQuery);
    }
  }, [categories]);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
      <aside className="h-fit rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-4 lg:sticky lg:top-[252px] lg:max-h-[calc(100vh-17rem)] lg:overflow-auto">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--text-main)]">
          <Filter size={16} />
          筛选 Debug Case
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[var(--text-muted)]">
              关键词
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-[var(--border-soft)] bg-[var(--app-bg-soft)] px-3 py-2">
              <Search size={16} className="text-[var(--text-subtle)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索报错、工具、工作流"
                className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-subtle)]"
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[var(--text-muted)]">
              分类
            </span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-lg border border-[var(--border-soft)] bg-[var(--surface-raised)] px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-blue-400"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[var(--text-muted)]">
              标签
            </span>
            <select
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              className="w-full rounded-lg border border-[var(--border-soft)] bg-[var(--surface-raised)] px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-blue-400"
            >
              {tags.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[var(--text-muted)]">
              难度
            </span>
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              className="w-full rounded-lg border border-[var(--border-soft)] bg-[var(--surface-raised)] px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-blue-400"
            >
              {difficulties.map((item) => (
                <option key={item} value={item}>
                  {item === "全部" ? item : difficultyLabels[item] ?? item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </aside>
      <section className="min-w-0">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--accent)]">
              共 {filteredCases.length} 个案例
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-[var(--text-main)]">
              Debug Case
            </h2>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            每个案例都包含修复步骤、代码块和可复制 Prompt。
          </p>
        </div>
        <div className="grid gap-4">
          {filteredCases.map((item) => (
            <Link
              key={item.slug}
              href={`/debug/${item.slug}`}
              className="group rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-5 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)]"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                  {item.category}
                </span>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {difficultyLabels[item.difficulty] ?? item.difficulty}
                </span>
                <span className="text-xs text-[var(--text-subtle)]">
                  更新于 {item.updatedAt}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-main)] transition group-hover:text-[var(--accent)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                {item.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.slice(0, 5).map((tagItem) => (
                  <span
                    key={tagItem}
                    className="rounded-md bg-[var(--app-bg-soft)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]"
                  >
                    {tagItem}
                  </span>
                ))}
              </div>
            </Link>
          ))}
          {!filteredCases.length && (
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--text-muted)]">
              没有匹配的案例，试试放宽分类或关键词。
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
