---
title: "计划-测试-实现-验证闭环"
slug: "plan-tdd-verify-loop"
type: "Skill"
category: "开发流程"
summary: "把模糊需求拆成可执行计划、失败测试、最小实现和最终验证的一套可复用工作流。"
use_case: "需要让 Claude Code / Codex 稳定完成一个功能或修复，而不是只给一句提示词时使用。"
source_name: "Superpowers / community workflow"
source_url: "https://github.com/chriscox/agent-skills"
tags:
  - TDD
  - Verification
  - Codex
  - Claude Code
steps:
  - "确认目标和成功标准，写成 3-6 个可检查任务。"
  - "先写一个会失败的测试或最小验证脚本。"
  - "只实现让测试通过的最小代码。"
  - "运行相关测试、构建和原始问题复现路径。"
  - "输出改动摘要、验证证据和剩余风险。"
verification:
  - "测试先红后绿。"
  - "最终验证命令退出码为 0。"
  - "交付说明包含具体文件和验证结果。"
---

## 可复制工作流
```text
请按「计划-测试-实现-验证」闭环处理这个任务。

1. 先用 3-6 项列出可检查任务。
2. 在写实现前，补一个能暴露问题或约束行为的失败测试。
3. 只做让测试通过所需的最小改动。
4. 运行相关测试、构建和原始场景验证。
5. 最后输出：改动文件 / 验证命令 / 结果 / 剩余风险。
```

## 抓取来源时保留字段
从 GitHub 的 `SKILL.md` 或工作流文档里抽取：触发场景、步骤、验证命令、交付格式和安全约束。不要只抓标题，因为 Skill 的价值在步骤和验收条件。
