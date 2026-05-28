import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchResults } from "@/components/SearchResults";
import { getDebugCaseCards, getPromptItems, getSkillItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "搜索结果",
  description: "同时搜索 AI 工程 Prompt、Debug Case 和 Skill 工作流。"
};

export default function SearchPage() {
  const cases = getDebugCaseCards();
  const prompts = getPromptItems();
  const skills = getSkillItems();

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[var(--app-bg)] px-5 py-8 text-[var(--text-main)] lg:px-8">
      <div className="mb-7 border-b border-[var(--border-soft)] pb-6">
        <p className="text-sm font-semibold text-[var(--accent)]">Search</p>
        <h1 className="mt-2 text-3xl font-semibold">全部搜索结果</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
          这里会同时检索 Prompt、Debug Case 和 Skill 工作流，适合从一个关键词快速判断该复制一句指令、查看问题解法还是套用完整流程。
        </p>
      </div>
      <Suspense fallback={null}>
        <SearchResults cases={cases} prompts={prompts} skills={skills} />
      </Suspense>
    </main>
  );
}
