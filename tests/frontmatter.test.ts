import test from "node:test";
import assert from "node:assert/strict";

import {
  extractFirstFencedCode,
  parseFrontmatter,
  parseMarkdownSections
} from "../lib/markdown";

test("parseFrontmatter reads scalar fields, arrays, and markdown body", () => {
  const source = `---
title: "FastAPI 调用大模型接口返回 422 怎么办？"
slug: "fastapi-llm-api-422-pydantic-validation-error"
category: "FastAPI"
tags:
  - FastAPI
  - Pydantic
difficulty: "beginner"
created_at: "2026-05-27"
---

## 适用场景
请求体字段和 Pydantic 模型不一致。
`;

  const parsed = parseFrontmatter(source);

  assert.equal(parsed.data.title, "FastAPI 调用大模型接口返回 422 怎么办？");
  assert.equal(parsed.data.slug, "fastapi-llm-api-422-pydantic-validation-error");
  assert.deepEqual(parsed.data.tags, ["FastAPI", "Pydantic"]);
  assert.equal(parsed.body.trim().startsWith("## 适用场景"), true);
});

test("parseMarkdownSections splits second-level headings and extracts prompt code", () => {
  const body = `## 报错现象
API 返回 422。

## 给 Claude Code / Codex 的 Debug Prompt
\`\`\`text
请检查 FastAPI 请求体和 Pydantic schema 的字段差异。
\`\`\`

## 相关问题
- JSON 序列化失败
`;

  const sections = parseMarkdownSections(body);
  const promptSection = sections.find((section) => section.title.includes("Prompt"));

  assert.equal(sections.length, 3);
  assert.equal(sections[0].title, "报错现象");
  assert.equal(
    extractFirstFencedCode(promptSection?.content ?? ""),
    "请检查 FastAPI 请求体和 Pydantic schema 的字段差异。"
  );
});
