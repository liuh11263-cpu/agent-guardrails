import type { Metadata } from "next";
import Link from "next/link";

import { getDebugCaseCards, getPromptItems, getSkillItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "最新",
  description: "查看最新更新的 AI 工程 Prompt、Debug Case 与 Skill 工作流。"
};

export default function LatestPage() {
  const cases = getDebugCaseCards();
  const prompts = getPromptItems();
  const skills = getSkillItems();

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[var(--app-bg)] px-5 py-8 text-[var(--text-main)] lg:px-8">
      <div className="mb-7 border-b border-[var(--border-soft)] pb-6">
        <p className="text-sm font-semibold text-[var(--accent)]">Latest</p>
        <h1 className="mt-2 text-3xl font-semibold">最新更新</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
          最新页独立展示最近入库的 Prompt、Debug Case 和 Skill，避免首页变成内容门户。
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)]">
          <div className="border-b border-[var(--border-soft)] px-5 py-4">
            <h2 className="text-lg font-semibold">Debug Case</h2>
          </div>
          <div className="divide-y divide-[var(--border-soft)]">
            {cases.map((item) => (
              <Link
                key={item.slug}
                href={`/debug/${item.slug}`}
                className="block px-5 py-4 transition hover:bg-[var(--app-bg-soft)]"
              >
                <span className="rounded-md bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                  {item.category}
                </span>
                <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                  {item.summary}
                </p>
                <p className="mt-2 text-xs text-[var(--text-subtle)]">
                  更新于 {item.updatedAt}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)]">
          <div className="border-b border-[var(--border-soft)] px-5 py-4">
            <h2 className="text-lg font-semibold">Prompt</h2>
          </div>
          <div className="divide-y divide-[var(--border-soft)]">
            {prompts.map((prompt) => (
              <Link
                key={prompt.slug}
                href={`/prompts?query=${encodeURIComponent(prompt.title)}`}
                className="block px-5 py-4 transition hover:bg-[var(--app-bg-soft)]"
              >
                <span className="rounded-md bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                  {prompt.category}
                </span>
                <h3 className="mt-3 text-sm font-semibold">{prompt.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-muted)]">
                  {prompt.scenario}
                </p>
              </Link>
            ))}
          </div>
        </aside>

        <aside className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)]">
          <div className="border-b border-[var(--border-soft)] px-5 py-4">
            <h2 className="text-lg font-semibold">Skill</h2>
          </div>
          <div className="divide-y divide-[var(--border-soft)]">
            {skills.map((skill) => (
              <Link
                key={skill.slug}
                href={`/skills?query=${encodeURIComponent(skill.title)}`}
                className="block px-5 py-4 transition hover:bg-[var(--app-bg-soft)]"
              >
                <span className="rounded-md bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                  {skill.category} · {skill.domain}
                </span>
                <h3 className="mt-3 text-sm font-semibold">{skill.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-muted)]">
                  {skill.summary}
                </p>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
