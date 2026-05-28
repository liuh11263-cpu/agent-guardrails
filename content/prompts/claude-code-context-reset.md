---
title: "Claude Code 上下文重置 Prompt"
slug: "claude-code-context-reset"
category: "Claude Code Prompts"
scenario: "当长对话开始失焦，需要让 Claude Code 重新读取仓库并压缩当前任务状态。"
models:
  - Claude Code
linked_debug:
  - claude-code-context-overflow
---

```text
请先暂停实现，帮我重建当前仓库上下文。

步骤：
1. 读取 README、package.json、git status 和与当前任务最相关的目录。
2. 用 10 行以内总结目标、已完成、未完成和风险。
3. 列出下一步需要读取的最小文件集合。
4. 标出不要修改的文件或范围。
5. 等我确认后，再开始实现。
```
