import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyPromptBlock } from "@/components/CopyPrompt";
import { MarkdownContent } from "@/components/MarkdownContent";
import { getDebugCaseBySlug, getDebugCases } from "@/lib/content";

type PageProps = {
  params: {
    slug: string;
  };
};

const promptTitlePattern = /debug prompt|可复制 prompt/i;

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getDebugCases().map((item) => ({
    slug: item.slug
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const item = getDebugCaseBySlug(params.slug);

  if (!item) {
    return {
      title: "Debug Case 未找到"
    };
  }

  return {
    title: item.title,
    description: item.summary,
    keywords: item.seoKeywords
  };
}

export default function DebugDetailPage({ params }: PageProps) {
  const item = getDebugCaseBySlug(params.slug);

  if (!item) notFound();

  const related = getDebugCases().filter((candidate) =>
    item.related.includes(candidate.slug)
  );

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[var(--app-bg)] px-5 py-8 text-[var(--text-main)] lg:px-6">
      <div className="mb-8 text-sm text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--accent)]">
          首页
        </Link>
        <span className="mx-2">/</span>
        <Link href="/debug" className="hover:text-[var(--accent)]">
          Debug库
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--text-main)]">{item.category}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <article>
          <div className="mb-6 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-md bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                {item.category}
              </span>
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {item.difficulty}
              </span>
              <span className="rounded-md bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                {item.status}
              </span>
            </div>
            <h1 className="text-3xl font-semibold leading-tight text-[var(--text-main)]">
              {item.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-[var(--text-muted)]">
              {item.summary}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.tool.map((tool) => (
                <span
                  key={tool}
                  className="rounded-md bg-[var(--app-bg-soft)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]"
                >
                  {tool}
                </span>
              ))}
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[var(--app-bg-soft)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-[var(--text-subtle)]">
              创建于 {item.createdAt} · 更新于 {item.updatedAt}
            </p>
          </div>

          <div className="space-y-5">
            {item.sections.map((section) => {
              if (promptTitlePattern.test(section.title)) {
                return (
                  <CopyPromptBlock
                    key={section.title}
                    title={section.title}
                    prompt={item.prompt}
                  />
                );
              }

              return (
                <section
                  key={section.title}
                  className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-6"
                >
                  <h2 className="mb-4 text-xl font-semibold text-[var(--text-main)]">
                    {section.title}
                  </h2>
                  <MarkdownContent markdown={section.content} />
                </section>
              );
            })}
          </div>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-5">
            <h2 className="text-sm font-semibold text-[var(--text-main)]">快速复制</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              详情正文里的 Prompt 区块适合直接复制给 Claude Code、Codex 或团队内部
              Debug Bot。
            </p>
          </section>

          <section className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-5">
            <h2 className="text-sm font-semibold text-[var(--text-main)]">SEO 关键词</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.seoKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-5">
            <h2 className="text-sm font-semibold text-[var(--text-main)]">相关案例</h2>
            <div className="mt-3 grid gap-2">
              {related.map((candidate) => (
                <Link
                  key={candidate.slug}
                  href={`/debug/${candidate.slug}`}
                  className="rounded-lg border border-[var(--border-soft)] bg-[var(--app-bg-soft)] px-3 py-3 text-sm text-[var(--text-muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
                >
                  {candidate.title}
                </Link>
              ))}
              {!related.length && (
                <p className="text-sm text-slate-500">暂无相关案例。</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
