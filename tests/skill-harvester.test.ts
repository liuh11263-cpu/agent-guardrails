import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  classifySkill,
  dedupeSkills,
  generateCopyContent,
  normalizeSkill,
  scoreSkill
} = require("../scripts/skill-harvester/lib/skill-pipeline.js");

test("classifySkill distinguishes Prompt, Debug, and Skill", () => {
  assert.equal(
    classifySkill({
      title: "一句代码审查 Prompt",
      copy_content: "请审查这段代码并给出问题。"
    }),
    "Prompt"
  );

  assert.equal(
    classifySkill({
      title: "FastAPI 422 报错排查",
      use_case: "接口返回 422 validation error",
      steps: ["检查请求体", "对齐 Pydantic schema"],
      verification: ["curl 返回 200"]
    }),
    "Debug"
  );

  assert.equal(
    classifySkill({
      title: "PRD 到页面 UX 重构工作流",
      use_case: "需要把产品需求变成页面改版方案",
      inputs: ["PRD", "页面截图"],
      steps: ["识别用户任务", "重构信息架构", "输出验收标准"],
      output_format: ["问题判断", "页面方案"],
      verification: ["关键路径可完成"]
    }),
    "Skill"
  );
});

test("normalizeSkill scores complete reusable workflows highly and generates executable copy content", () => {
  const normalized = normalizeSkill({
    title: "RAG 检索评估闭环",
    domain: "RAG",
    summary: "构建评估集并调优召回质量。",
    use_case: "RAG 结果相关性低时使用。",
    inputs: ["查询样例", "期望命中文档"],
    steps: ["固定评估集", "记录当前召回", "单变量调参", "回归验证"],
    output_format: ["命中率变化", "失败样例"],
    constraints: ["每次只改一个变量"],
    verification: ["同一评估集指标提升"],
    source_name: "local seed",
    source_url: "local:data/imports/rag.md",
    source_type: "local",
    tags: ["RAG", "评估"],
    tooling: ["ChatGPT", "Codex"]
  });

  assert.equal(normalized.category, "Skill");
  assert.equal(scoreSkill(normalized).score, 5);
  assert.equal(normalized.quality_score, 5);
  assert.match(normalized.copy_content, /你是一个【RAG】方向的 AI 工作流执行助手/);
  assert.match(normalized.copy_content, /【请在这里粘贴你的具体问题/);
  assert.match(normalized.copy_content, /同一评估集指标提升/);
});

test("dedupeSkills keeps approved manual records over repeated harvested records", () => {
  const approved = normalizeSkill({
    title: "GitHub Issue 到 PR 执行流",
    slug: "github-issue-to-pr",
    domain: "AI 编程",
    summary: "把 issue 变成可审查 PR。",
    use_case: "处理 GitHub issue。",
    inputs: ["issue 链接"],
    steps: ["读取 issue", "写测试", "实现", "开 PR"],
    output_format: ["PR 摘要"],
    constraints: ["不覆盖用户改动"],
    verification: ["测试通过"],
    source_name: "manual",
    source_url: "https://example.com/workflow",
    source_type: "manual",
    approved: true
  });

  const harvested = normalizeSkill({
    ...approved,
    summary: "来自抓取的新描述。",
    source_type: "github",
    approved: false
  });

  const deduped = dedupeSkills([harvested, approved]);

  assert.equal(deduped.length, 1);
  assert.equal(deduped[0].approved, true);
  assert.equal(deduped[0].summary, "把 issue 变成可审查 PR。");
});
