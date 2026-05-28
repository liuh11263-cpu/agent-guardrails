import {
  ArrowRight,
  ClipboardCheck,
  FileCode2,
  Search,
  SlidersHorizontal,
  Workflow,
  Wrench
} from "lucide-react";
import Link from "next/link";

import { HomeSearch } from "@/components/HomeSearch";
import { getDebugCaseCards, getPromptItems, getSkillItems } from "@/lib/content";

const usageSteps = [
  {
    icon: Search,
    title: "输入你的问题",
    text: "搜索报错、场景、工具名或工作流。"
  },
  {
    icon: SlidersHorizontal,
    title: "选择类型",
    text: "Prompt、Debug、Skill 分别对应不同执行单元。"
  },
  {
    icon: Wrench,
    title: "复制模板",
    text: "把对应模板交给 Claude Code / Codex。"
  },
  {
    icon: ClipboardCheck,
    title: "验证结果",
    text: "按验证步骤检查测试、构建和复现路径。"
  }
];

export const dynamic = "force-static";

export default function HomePage() {
  const cases = getDebugCaseCards();
  const prompts = getPromptItems();
  const skills = getSkillItems();

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[var(--app-bg)] text-[var(--text-main)]">
      <section className="border-b border-[var(--border-soft)] bg-[var(--surface-raised)]">
        <div className="mx-auto flex min-h-[520px] max-w-5xl flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
          <p className="mb-4 text-sm font-semibold text-[var(--accent)]">
            AI 工程解决方案库
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-[var(--text-main)] sm:text-5xl lg:text-6xl">
            找一个可执行解决方案
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
            大模型 Agent 时代，开发者不需要阅读长篇大论，而是需要一个可以直接复制、执行并闭环验证的工程方案。
            Prompt 是一句指令，Debug 是一个问题解法，Skill 是一套可复用工作流。
          </p>
          <div className="mt-8 w-full max-w-4xl">
            <HomeSearch cases={cases} prompts={prompts} skills={skills} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-8 lg:grid-cols-3 lg:px-8">
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)]">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border-soft)] px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-[var(--accent)]">
                热门 Debug Case
              </p>
              <h2 className="mt-1 text-xl font-semibold text-[var(--text-main)]">
                高频 AI 工程问题
              </h2>
            </div>
            <Link
              href="/debug"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]"
            >
              查看全部 <ArrowRight size={15} />
            </Link>
          </div>
          <div className="divide-y divide-[var(--border-soft)]">
            {cases.slice(0, 5).map((item) => (
              <Link
                key={item.slug}
                href={`/debug/${item.slug}`}
                className="block px-5 py-4 transition hover:bg-[var(--app-bg-soft)]"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                    {item.category}
                  </span>
                  <span className="text-xs text-[var(--text-subtle)]">
                    更新于 {item.updatedAt}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[var(--text-main)]">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">
                  {item.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)]">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border-soft)] px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-[var(--accent)]">
                精选 Prompt
              </p>
              <h2 className="mt-1 text-xl font-semibold text-[var(--text-main)]">
                可复用工程模板
              </h2>
            </div>
            <Link
              href="/prompts"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]"
            >
              查看全部 <ArrowRight size={15} />
            </Link>
          </div>
          <div className="divide-y divide-[var(--border-soft)] p-3">
            {prompts.slice(0, 6).map((prompt) => (
              <Link
                key={prompt.slug}
                href={`/prompts?query=${encodeURIComponent(prompt.title)}`}
                className="flex items-start gap-3 rounded-xl px-3 py-3 transition hover:bg-[var(--app-bg-soft)]"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                  <FileCode2 size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[var(--text-main)]">
                    {prompt.title}
                  </span>
                  <span className="mt-1 block line-clamp-2 text-xs leading-5 text-[var(--text-muted)]">
                    {prompt.scenario}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </aside>

        <aside className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)]">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border-soft)] px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-[var(--accent)]">
                精选 Skill
              </p>
              <h2 className="mt-1 text-xl font-semibold text-[var(--text-main)]">
                可复用工作流
              </h2>
            </div>
            <Link
              href="/skills"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]"
            >
              查看全部 <ArrowRight size={15} />
            </Link>
          </div>
          <div className="divide-y divide-[var(--border-soft)] p-3">
            {skills.slice(0, 6).map((skill) => (
              <Link
                key={skill.slug}
                href={`/skills?query=${encodeURIComponent(skill.title)}`}
                className="flex items-start gap-3 rounded-xl px-3 py-3 transition hover:bg-[var(--app-bg-soft)]"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Workflow size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[var(--text-main)]">
                    {skill.title}
                  </span>
                  <span className="mt-1 block line-clamp-2 text-xs leading-5 text-[var(--text-muted)]">
                    {skill.domain} · {skill.summary}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-10 lg:px-8">
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-soft)] pb-4 mb-5">
            <h2 className="text-xl font-semibold text-[var(--text-main)]">
              怎么使用本站
            </h2>
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              阅读详细使用与 Agent 对接指南 <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {usageSteps.map((step) => (
              <div key={step.title} className="rounded-xl bg-[var(--app-bg-soft)] p-4">
                <step.icon className="text-[var(--accent)]" size={22} />
                <h3 className="mt-3 text-sm font-semibold text-[var(--text-main)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
