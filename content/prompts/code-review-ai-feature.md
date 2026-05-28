---
title: "AI 功能代码审查 Prompt"
slug: "code-review-ai-feature"
category: "Review Prompts"
scenario: "当 AI 功能完成后，需要优先检查行为风险、错误处理、测试缺口和 Prompt/工具边界。"
models:
  - Claude Code
  - Codex
linked_debug:
  - function-calling-json-parse-failed
  - rag-low-relevance-recall
---

```text
请用代码审查视角检查这个 AI 功能。

请优先找：
1. 会导致用户请求失败的 bug。
2. 模型返回异常、JSON 解析、超时、限流时的处理缺口。
3. Prompt 注入、敏感信息泄露和工具越权风险。
4. RAG / Agent / Function Calling 的边界条件。
5. 缺失的测试和最小复现用例。

请先列 findings，按严重程度排序，并给出文件路径、原因和建议修复。
```
