import type { Metadata } from "next";
import {
  Bot,
  Box,
  Braces,
  FileCode2,
  GitBranch,
  MoreHorizontal,
  Search,
  Sparkles,
  TerminalSquare,
  Workflow
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import {
  getAllCategories,
  getDebugCaseCards,
  getPromptItems,
  getSkillItems
} from "@/lib/content";

export const metadata: Metadata = {
  title: "分类",
  description: "按 Prompt、Debug、Skill 和技术栈分类浏览 AI 工程解决方案。"
};

const categoryIcons: Record<string, LucideIcon> = {
  "Claude Code / Codex": TerminalSquare,
  "FastAPI + LLM API": Sparkles,
  RAG: GitBranch,
  Agent: Bot,
  ComfyUI: Box,
  "Python 本地环境": Braces,
  "Prompt Engineering": FileCode2,
  "Skill Workflow": Workflow,
  开发流程: Workflow,
  "GitHub 工作流": GitBranch,
  代码审查: FileCode2,
  知识沉淀: Workflow,
  资料抓取: Search
};

export default function CategoriesPage() {
  const categories = getAllCategories();
  const cases = getDebugCaseCards();
  const prompts = getPromptItems();
  const skills = getSkillItems();

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[var(--app-bg)] px-5 py-8 text-[var(--text-main)] lg:px-8">
      <div className="mb-7 border-b border-[var(--border-soft)] pb-6">
        <p className="text-sm font-semibold text-[var(--accent)]">分类目录</p>
        <h1 className="mt-2 text-3xl font-semibold">按类型浏览</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
          分类页独立承载技术栈入口，首页只保留搜索工具与精选内容。
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const Icon = categoryIcons[category] ?? MoreHorizontal;
          const count =
            category === "Prompt Engineering"
              ? prompts.length
              : category === "Skill Workflow"
              ? skills.length
              : skills.some((item) => item.domain === category)
              ? skills.filter((item) => item.domain === category).length
              : cases.filter((item) => item.category === category).length;

          return (
            <Link
              key={category}
              href={
                category === "Prompt Engineering"
                  ? "/prompts"
                  : category === "Skill Workflow" ||
                    skills.some((item) => item.domain === category)
                  ? `/skills${
                      category === "Skill Workflow"
                        ? ""
                        : `?query=${encodeURIComponent(category)}`
                    }`
                  : `/debug?category=${encodeURIComponent(category)}`
              }
              className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-5 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <Icon size={22} />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{category}</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {count} 篇内容
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
