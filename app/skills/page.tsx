import type { Metadata } from "next";

import { SkillArchive } from "@/components/SkillArchive";
import { getSkillItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Skill 工作流库",
  description:
    "可复用 AI 工程工作流库，收录开发流程、GitHub PR、代码审查、RAG 评估和 Skill 抓取方法。"
};

export const dynamic = "force-static";

export default function SkillsPage() {
  const skills = getSkillItems();

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[var(--app-bg)] px-5 py-8 text-[var(--text-main)] lg:px-6">
      <div className="sticky top-[68px] z-30 mb-6 border-b border-[var(--border-soft)] bg-[var(--app-bg)] pb-6 pt-2">
        <p className="text-sm font-semibold text-[var(--accent)]">
          Skill 工作流规约库
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--text-main)]">
          Skill 是一套可复用工作流
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-muted)]">
          Prompt 是一句可复制指令，Debug 是一个具体问题解法，Skill 是带触发场景、
          执行步骤和验证标准的工作流。这里优先沉淀能交给 Claude Code / Codex
          反复执行的流程。
        </p>
      </div>
      <SkillArchive skills={skills} />
    </main>
  );
}
