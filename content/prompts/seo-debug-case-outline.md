---
title: "SEO Debug Case 内容生成 Prompt"
slug: "seo-debug-case-outline"
category: "SEO Content Prompts"
scenario: "当一个真实工程问题已经解决，需要把经验整理成可搜索、可复用的 Debug Case。"
models:
  - GPT-4.1
  - Claude
linked_debug:
  - rag-low-relevance-recall
  - comfyui-workflow-api-json-not-found
---

```text
请把这个真实工程问题整理成 SEO 友好的 Debug Case。

输入信息：
- 报错文本：
- 使用工具：
- 已确认根因：
- 最终修复：

请按模板输出：
## 适用场景
## 报错现象
## 根因解释
## 修复步骤
## 可复制代码 / 命令
## 给 Claude Code / Codex 的 Debug Prompt
## Prompt 使用方法
## 同类问题排查框架
## 相关问题

标题要包含用户会搜索的报错关键词。
```
