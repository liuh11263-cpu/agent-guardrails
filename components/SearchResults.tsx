"use client";

import { FileCode2, Search, Workflow } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { DebugCaseCard, PromptItem, SkillItem } from "@/lib/content";

type SearchMode = "all" | "debug" | "prompt" | "skill";

function includesQuery(values: string[], query: string) {
  if (!query) return true;
  return values.join(" ").toLowerCase().includes(query);
}

export function SearchResults({
  cases,
  prompts,
  skills
}: {
  cases: DebugCaseCard[];
  prompts: PromptItem[];
  skills: SkillItem[];
}) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState<SearchMode>("all");
  const normalizedQuery = query.trim().toLowerCase();

  const debugResults = useMemo(
    () =>
      cases.filter((item) =>
        includesQuery(
          [
            item.title,
            item.summary,
            item.category,
            item.tags.join(" "),
            item.tool.join(" ")
          ],
          normalizedQuery
        )
      ),
    [cases, normalizedQuery]
  );

  const promptResults = useMemo(
    () =>
      prompts.filter((item) =>
        includesQuery(
          [
            item.title,
            item.category,
            item.scenario,
            item.models.join(" "),
            item.prompt
          ],
          normalizedQuery
        )
      ),
    [normalizedQuery, prompts]
  );

  const skillResults = useMemo(
    () =>
      skills.filter((item) =>
        includesQuery(
          [
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
          ],
          normalizedQuery
        )
      ),
    [normalizedQuery, skills]
  );

  const showDebug = mode === "all" || mode === "debug";
  const showPrompt = mode === "all" || mode === "prompt";
  const showSkill = mode === "all" || mode === "skill";
  const total =
    (showDebug ? debugResults.length : 0) +
    (showPrompt ? promptResults.length : 0) +
    (showSkill ? skillResults.length : 0);

  return (
    <div>
      <section className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-4">
        <div className="flex items-center gap-3 rounded-xl border border-[var(--border-soft)] bg-[var(--app-bg-soft)] px-4 py-3">
          <Search size={20} className="text-[var(--text-subtle)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索报错、场景或工作流..."
            className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-subtle)] sm:text-base"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            ["all", "全部"],
            ["prompt", "Prompt"],
            ["debug", "Debug 问题"],
            ["skill", "Skill 工作流"]
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id as SearchMode)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                mode === id
                  ? "bg-blue-600 text-white"
                  : "bg-[var(--app-bg-soft)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-6">
        <p className="text-sm font-semibold text-[var(--accent)]">
          共 {total} 条结果
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--text-main)]">
          搜索结果
        </h2>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {showDebug && (
          <section className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-lg font-semibold text-[var(--text-main)]">
                Debug Case
              </h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {debugResults.length} 条问题排查结果
              </p>
            </div>
            <div className="divide-y divide-[var(--border-soft)]">
              {debugResults.map((item) => (
                <Link
                  key={item.slug}
                  href={`/debug/${item.slug}`}
                  className="block px-5 py-4 transition hover:bg-[var(--app-bg-soft)]"
                >
                  <span className="rounded-md bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                    Debug
                  </span>
                  <h4 className="mt-3 text-base font-semibold text-[var(--text-main)]">
                    {item.title}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">
                    {item.summary}
                  </p>
                </Link>
              ))}
              {!debugResults.length && (
                <div className="px-5 py-8 text-sm text-[var(--text-muted)]">
                  没有匹配的 Debug Case。
                </div>
              )}
            </div>
          </section>
        )}

        {showPrompt && (
          <section className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-lg font-semibold text-[var(--text-main)]">
                Prompt 模板
              </h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {promptResults.length} 条 Prompt 结果
              </p>
            </div>
            <div className="divide-y divide-[var(--border-soft)]">
              {promptResults.map((item) => (
                <Link
                  key={item.slug}
                  href={`/prompts?query=${encodeURIComponent(item.title)}`}
                  className="flex gap-3 px-5 py-4 transition hover:bg-[var(--app-bg-soft)]"
                >
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                    <FileCode2 size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="rounded-md bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                      Prompt
                    </span>
                    <h4 className="mt-3 text-base font-semibold text-[var(--text-main)]">
                      {item.title}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">
                      {item.scenario}
                    </p>
                  </span>
                </Link>
              ))}
              {!promptResults.length && (
                <div className="px-5 py-8 text-sm text-[var(--text-muted)]">
                  没有匹配的 Prompt 模板。
                </div>
              )}
            </div>
          </section>
        )}

        {showSkill && (
          <section className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-lg font-semibold text-[var(--text-main)]">
                Skill 工作流
              </h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {skillResults.length} 套可复用流程
              </p>
            </div>
            <div className="divide-y divide-[var(--border-soft)]">
              {skillResults.map((item) => (
                <Link
                  key={item.slug}
                  href={`/skills?query=${encodeURIComponent(item.title)}`}
                  className="flex gap-3 px-5 py-4 transition hover:bg-[var(--app-bg-soft)]"
                >
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Workflow size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {item.category}
                    </span>
                    <h4 className="mt-3 text-base font-semibold text-[var(--text-main)]">
                      {item.title}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">
                      {item.domain} · {item.summary}
                    </p>
                  </span>
                </Link>
              ))}
              {!skillResults.length && (
                <div className="px-5 py-8 text-sm text-[var(--text-muted)]">
                  没有匹配的 Skill 工作流。
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
