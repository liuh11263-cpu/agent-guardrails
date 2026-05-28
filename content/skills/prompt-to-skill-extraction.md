---
title: "Prompt 沉淀为 Skill"
slug: "prompt-to-skill-extraction"
type: "Skill"
category: "知识沉淀"
summary: "把一句好用 Prompt 变成可复用工作流，补齐触发条件、步骤、验证和输出格式。"
use_case: "当一个 Prompt 被重复使用 3 次以上，或者需要跨项目稳定复现时使用。"
source_name: "Agent skill repositories"
source_url: "https://github.com/chriscox/agent-skills"
tags:
  - Prompt
  - Skill
  - Workflow
  - Knowledge Base
steps:
  - "识别 Prompt 的真实触发场景。"
  - "拆出输入、步骤、约束、输出和验证条件。"
  - "补充错误处理和边界情况。"
  - "写成 SKILL.md 或站内 Skill 卡片。"
  - "用一个真实任务回放验证。"
verification:
  - "同类任务不用重新解释流程。"
  - "输出格式稳定。"
  - "有明确验证步骤。"
---

## 可复制工作流
```text
请把下面这个 Prompt 沉淀成一个可复用 Skill。

请输出：
1. 适用场景。
2. 输入材料。
3. 分步流程。
4. 约束和禁止事项。
5. 验证方法。
6. 可直接保存的 SKILL.md 草稿。
```

## 抓取方法
从 GitHub 抓 Skill 时，遇到只有一句 prompt 的内容，应归到 Prompt；只有当它包含触发条件、分步流程和验收方法时，才归到 Skill。
