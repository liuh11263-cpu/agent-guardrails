import fs from "node:fs";
import path from "node:path";
import { cache as reactCache } from "react";

import {
  extractFirstFencedCode,
  parseFrontmatter,
  parseMarkdownSections,
  type MarkdownSection
} from "./markdown";

export type DebugCase = {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  difficulty: string;
  errorType: string;
  tool: string[];
  seoKeywords: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  summary: string;
  body: string;
  sections: MarkdownSection[];
  prompt: string;
  related: string[];
};

export type DebugCaseCard = Pick<
  DebugCase,
  | "title"
  | "slug"
  | "category"
  | "tags"
  | "difficulty"
  | "tool"
  | "updatedAt"
  | "summary"
>;

export type PromptItem = {
  title: string;
  slug: string;
  category: string;
  scenario: string;
  models: string[];
  linkedDebug: string[];
  body: string;
  prompt: string;
};

export type SkillItem = {
  id: string;
  title: string;
  slug: string;
  category: "Prompt" | "Debug" | "Skill";
  domain: string;
  summary: string;
  use_case: string;
  trigger_keywords: string[];
  inputs: string[];
  tags: string[];
  difficulty: string;
  tooling: string[];
  steps: string[];
  output_format: string[];
  constraints: string[];
  verification: string[];
  example_prompt: string;
  copy_content: string;
  source_name: string;
  source_url: string;
  source_type: string;
  quality_score: number;
  quality_reason: string;
  approved: boolean;
  recommended: boolean;
  created_at: string;
  updated_at: string;
};

const contentRoot = path.join(process.cwd(), "content");
const dataRoot = path.join(process.cwd(), "data");
const cache: typeof reactCache =
  typeof reactCache === "function" ? reactCache : ((fn) => fn);

export const primaryDebugCategories = [
  "Claude Code / Codex",
  "FastAPI + LLM API",
  "RAG",
  "Agent",
  "ComfyUI",
  "Python 本地环境",
  "Prompt Engineering",
  "Skill Workflow"
];

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" ? value : fallback;
}

function readMarkdownFiles(directory: string) {
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => path.join(directory, filename));
}

function getPromptFromSections(sections: MarkdownSection[]) {
  const promptSection = sections.find((section) =>
    /prompt/i.test(section.title)
  );
  return promptSection ? extractFirstFencedCode(promptSection.content) : "";
}

export const getDebugCases = cache((): DebugCase[] => {
  const files = readMarkdownFiles(path.join(contentRoot, "debug"));

  return files
    .map((file) => {
      const parsed = parseFrontmatter(fs.readFileSync(file, "utf8"));
      const sections = parseMarkdownSections(parsed.body);

      return {
        title: asString(parsed.data.title),
        slug: asString(parsed.data.slug, path.basename(file, ".md")),
        category: asString(parsed.data.category, "Uncategorized"),
        tags: asArray(parsed.data.tags),
        difficulty: asString(parsed.data.difficulty, "beginner"),
        errorType: asString(parsed.data.error_type),
        tool: asArray(parsed.data.tool),
        seoKeywords: asArray(parsed.data.seo_keywords),
        status: asString(parsed.data.status, "draft"),
        createdAt: asString(parsed.data.created_at),
        updatedAt: asString(parsed.data.updated_at),
        summary: asString(parsed.data.summary),
        body: parsed.body,
        sections,
        prompt: getPromptFromSections(sections),
        related: asArray(parsed.data.related)
      } satisfies DebugCase;
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
});

export function getDebugCaseBySlug(slug: string) {
  return getDebugCases().find((item) => item.slug === slug);
}

export function getDebugCaseCards(): DebugCaseCard[] {
  return getDebugCases().map(
    ({ title, slug, category, tags, difficulty, tool, updatedAt, summary }) => ({
      title,
      slug,
      category,
      tags,
      difficulty,
      tool,
      updatedAt,
      summary
    })
  );
}

export const getPromptItems = cache((): PromptItem[] => {
  const files = readMarkdownFiles(path.join(contentRoot, "prompts"));

  return files
    .map((file) => {
      const parsed = parseFrontmatter(fs.readFileSync(file, "utf8"));

      return {
        title: asString(parsed.data.title),
        slug: asString(parsed.data.slug, path.basename(file, ".md")),
        category: asString(parsed.data.category, "Debug Prompts"),
        scenario: asString(parsed.data.scenario),
        models: asArray(parsed.data.models),
        linkedDebug: asArray(parsed.data.linked_debug),
        body: parsed.body,
        prompt: extractFirstFencedCode(parsed.body)
      } satisfies PromptItem;
    })
    .sort((a, b) => a.category.localeCompare(b.category));
});

export const getSkillItems = cache((): SkillItem[] => {
  const approvedJsonPath = path.join(
    dataRoot,
    "processed",
    "skills-approved.json"
  );

  if (fs.existsSync(approvedJsonPath)) {
    const raw = JSON.parse(fs.readFileSync(approvedJsonPath, "utf8")) as unknown[];

    return raw
      .map((item) => item as Record<string, unknown>)
      .filter((item) => asBoolean(item.approved))
      .map((item) => ({
        id: asString(item.id),
        title: asString(item.title),
        slug: asString(item.slug),
        category: ["Prompt", "Debug", "Skill"].includes(asString(item.category))
          ? (asString(item.category) as SkillItem["category"])
          : "Skill",
        domain: asString(item.domain, "AI 编程"),
        summary: asString(item.summary),
        use_case: asString(item.use_case),
        trigger_keywords: asArray(item.trigger_keywords),
        inputs: asArray(item.inputs),
        tags: asArray(item.tags),
        difficulty: asString(item.difficulty, "intermediate"),
        tooling: asArray(item.tooling),
        steps: asArray(item.steps),
        output_format: asArray(item.output_format),
        constraints: asArray(item.constraints),
        verification: asArray(item.verification),
        example_prompt: asString(item.example_prompt),
        copy_content: asString(item.copy_content),
        source_name: asString(item.source_name),
        source_url: asString(item.source_url),
        source_type: asString(item.source_type, "manual"),
        quality_score: asNumber(item.quality_score, 1),
        quality_reason: asString(item.quality_reason),
        approved: asBoolean(item.approved),
        recommended: asBoolean(item.recommended),
        created_at: asString(item.created_at),
        updated_at: asString(item.updated_at)
      }))
      .sort((a, b) => b.quality_score - a.quality_score || a.title.localeCompare(b.title));
  }

  const files = readMarkdownFiles(path.join(contentRoot, "skills"));

  return files
    .map((file) => {
      const parsed = parseFrontmatter(fs.readFileSync(file, "utf8"));

      return {
        id: asString(parsed.data.slug, path.basename(file, ".md")),
        title: asString(parsed.data.title),
        slug: asString(parsed.data.slug, path.basename(file, ".md")),
        category: "Skill",
        domain: asString(parsed.data.category, "AI 编程"),
        summary: asString(parsed.data.summary),
        use_case: asString(parsed.data.use_case),
        trigger_keywords: asArray(parsed.data.tags),
        inputs: ["具体问题、目标、代码、日志或上下文"],
        tags: asArray(parsed.data.tags),
        difficulty: "intermediate",
        tooling: ["ChatGPT", "Claude Code", "Codex"],
        steps: asArray(parsed.data.steps),
        output_format: ["问题判断", "执行方案", "验证方法"],
        constraints: ["不要编造不存在的信息。"],
        verification: asArray(parsed.data.verification),
        example_prompt: "",
        copy_content: extractFirstFencedCode(parsed.body),
        source_name: asString(parsed.data.source_name),
        source_url: asString(parsed.data.source_url),
        source_type: "local",
        quality_score: 4,
        quality_reason: "旧版 Markdown Skill 兜底读取。",
        approved: true,
        recommended: true,
        created_at: "",
        updated_at: ""
      } satisfies SkillItem;
    })
    .sort((a, b) => a.domain.localeCompare(b.domain));
});

export function getAllCategories() {
  return Array.from(
    new Set([
      ...primaryDebugCategories,
      ...getDebugCases().map((item) => item.category),
      ...getSkillItems().map((item) => item.domain)
    ])
  );
}
