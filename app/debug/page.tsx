import type { Metadata } from "next";

import { DebugExplorer } from "@/components/DebugExplorer";
import { getDebugCaseCards } from "@/lib/content";

export const metadata: Metadata = {
  title: "Debug Case 列表",
  description:
    "按分类、标签、难度和关键词搜索 AI 应用工程 Debug Case。"
};

export const dynamic = "force-static";

export default function DebugPage() {
  const cases = getDebugCaseCards();

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[var(--app-bg)] px-5 py-8 text-[var(--text-main)] lg:px-6">
      <div className="sticky top-[68px] z-30 mb-6 border-b border-[var(--border-soft)] bg-[var(--app-bg)] pb-6 pt-2">
        <p className="text-sm font-semibold text-[var(--accent)]">
          Debug 调试案例库
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--text-main)]">
          搜索和筛选 AI 工程问题
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-muted)]">
          Debug 是一个具体问题解法。用关键词、分类、标签和难度快速定位案例，
          复制修复步骤和验证命令给 Claude Code / Codex 执行。
        </p>
      </div>
      <DebugExplorer cases={cases} />
    </main>
  );
}
