"use client";

import { CheckCircle2, GitBranch, Search, Workflow } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CopyPromptButton } from "@/components/CopyPrompt";
import type { SkillItem } from "@/lib/content";

const filters = [
  "全部",
  "Prompt",
  "Debug",
  "Skill",
  "AI 编程",
  "Agent",
  "RAG",
  "小程序",
  "内容创作",
  "产品设计",
  "资料抓取"
];

export function SkillArchive({ skills }: { skills: SkillItem[] }) {
  const [filter, setFilter] = useState("全部");
  const [query, setQuery] = useState("");

  const filteredSkills = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return skills.filter((item) => {
      const haystack = [
        item.title,
        item.category,
        item.domain,
        item.summary,
        item.use_case,
        item.tags.join(" "),
        item.trigger_keywords.join(" "),
        item.source_name,
        item.steps.join(" "),
        item.verification.join(" ")
      ]
        .join(" ")
        .toLowerCase();

      const matchesFilter =
        filter === "全部" ||
        item.category === filter ||
        item.domain === filter ||
        (filter === "小程序" && item.domain.includes("小程序"));

      return (
        matchesFilter &&
        (!normalizedQuery || haystack.includes(normalizedQuery))
      );
    });
  }, [filter, query, skills]);

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
            placeholder="搜索工作流"
            className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-subtle)]"
          />
        </div>
        <div className="grid gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                filter === item
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
            {filteredSkills.length} 套可复用工作流
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-[var(--text-main)]">
            按执行流程归档
          </h2>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredSkills.map((item) => (
            <article
              key={item.slug}
              className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-5"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                  <Workflow size={13} />
                  {item.category}
                </span>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {item.domain}
                </span>
                <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  质量 {item.quality_score}/5
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-main)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                {item.summary}
              </p>
              <p className="mt-3 rounded-lg bg-[var(--app-bg-soft)] px-3 py-2 text-sm leading-6 text-[var(--text-muted)]">
                {item.use_case}
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--text-main)]">
                    <GitBranch size={14} />
                    执行步骤
                  </div>
                  <ol className="space-y-2">
                    {item.steps.slice(0, 5).map((step, index) => (
                      <li
                        key={step}
                        className="flex gap-2 text-sm leading-6 text-[var(--text-muted)]"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--app-bg-soft)] text-xs font-semibold text-[var(--accent)]">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--text-main)]">
                    <CheckCircle2 size={14} />
                    验证标准
                  </div>
                  <ul className="space-y-2">
                    {item.verification.map((rule) => (
                      <li
                        key={rule}
                        className="flex gap-2 text-sm leading-6 text-[var(--text-muted)]"
                      >
                        <CheckCircle2
                          size={15}
                          className="mt-1 shrink-0 text-emerald-600"
                        />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-[var(--app-bg-soft)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-soft)] pt-4">
                <a
                  href={item.source_url.startsWith("http") ? item.source_url : "#"}
                  className="text-xs font-semibold text-[var(--accent)] hover:underline"
                  target={item.source_url.startsWith("http") ? "_blank" : undefined}
                  rel={item.source_url.startsWith("http") ? "noreferrer" : undefined}
                >
                  来源：{item.source_name}
                </a>
                <div className="flex flex-col items-end gap-1">
                  <CopyPromptButton
                    text={item.copy_content}
                    label="复制执行 Prompt"
                  />
                  <span className="max-w-[220px] text-right text-[11px] leading-4 text-[var(--text-subtle)]">
                    复制后粘贴给 ChatGPT / Claude Code / Codex，并替换【我的输入】。
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
