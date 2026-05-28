---
title: "GitHub 高星 Skill 抓取方法"
slug: "github-skill-harvest-pipeline"
type: "Skill"
category: "资料抓取"
summary: "从 GitHub 高星 Skill / workflow 仓库抓取、清洗、归类并入库的可复用方法。"
use_case: "需要持续扩充 Skill 库，但不想把低质量 prompt 混进工作流库时使用。"
source_name: "awesome-claude-code / awesome-agent-skills"
source_url: "https://github.com/subinium/awesome-claude-code"
tags:
  - GitHub
  - Crawling
  - Curation
  - Skill Library
steps:
  - "用 GitHub Search 找 topic:skills、agent-skills、claude-code、codex、workflow。"
  - "按 stars、recent update、README 结构筛选候选仓库。"
  - "抓取 README、SKILL.md、commands、agents、workflows 目录。"
  - "抽取 trigger、steps、inputs、outputs、verification、safety 六类字段。"
  - "去重后按 Prompt / Debug / Skill 三类归档。"
verification:
  - "每条 Skill 至少有 4 个步骤。"
  - "每条 Skill 至少有 1 个验证条件。"
  - "保留 source_url，方便回查。"
---

## 可复制工作流
```text
请帮我从 GitHub 高星 Skill / workflow 仓库抓取可入库内容。

筛选标准：
1. 只收可复用工作流，不收单句 prompt。
2. 必须包含触发场景、步骤、输出格式或验证方法。
3. 保留 source_url、source_name、tags。
4. 归类为 Prompt / Debug / Skill：
   - Prompt：一句可复制指令。
   - Debug：一个具体问题的解法。
   - Skill：一套可复用工作流。

输出 JSON 数组，每条包含 title、slug、category、summary、use_case、steps、verification、source_url。
```

## 实际抓取建议
优先抓 `SKILL.md`、`.claude/commands`、`agents`、`workflows`、`README` 中结构化的小节。遇到 star 很高但没有验证步骤的内容，先放入待审核队列。
