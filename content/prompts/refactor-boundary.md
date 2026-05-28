---
title: "AI 应用重构边界识别 Prompt"
slug: "refactor-boundary"
category: "Refactor Prompts"
scenario: "当一个 AI 功能文件逐渐变成大杂烩，需要拆出内容解析、API 调用、状态管理和 UI 展示边界。"
models:
  - Claude Code
  - Codex
linked_debug:
  - claude-code-context-overflow
---

```text
请帮我识别这个 AI 应用模块的重构边界。

要求：
1. 先总结这个模块现在承担了哪些职责。
2. 标出最容易出错或最难测试的混合职责。
3. 提出 2 到 4 个小模块边界，每个模块说明输入、输出和依赖。
4. 给出不会改变用户行为的分步重构计划。
5. 每一步都要有验证方式。

请避免大规模重写，只做可回滚的小步重构。
```
