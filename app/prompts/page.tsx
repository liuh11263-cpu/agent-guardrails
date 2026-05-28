import type { Metadata } from "next";

import { PromptArchive } from "@/components/PromptArchive";
import { getDebugCaseCards, getPromptItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Prompt 模板库",
  description:
    "按 Debug、Refactor、RAG、Agent、Claude Code、Codex、Review 等工程任务归档的 Prompt 实战库。"
};

export const dynamic = "force-static";

export default function PromptsPage() {
  const prompts = getPromptItems();
  const cases = getDebugCaseCards();

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[var(--app-bg)] px-5 py-8 text-[var(--text-main)] lg:px-6">
      <div className="sticky top-[68px] z-30 mb-6 border-b border-[var(--border-soft)] bg-[var(--app-bg)] pb-6 pt-2">
        <p className="text-sm font-semibold text-[var(--accent)]">
          Prompt 提示词模板库
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--text-main)]">
          Prompt 是一句可复制指令
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-muted)]">
          它不是提示词大全，而是可以直接交给 Claude Code / Codex 的工程动作。
          如果一个 Prompt 需要多轮步骤、输入约束和验证标准，就应沉淀成 Skill。
        </p>
      </div>
      <PromptArchive prompts={prompts} cases={cases} />
    </main>
  );
}
