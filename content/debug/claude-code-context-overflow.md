---
title: "Claude Code 上下文溢出怎么办？"
slug: "claude-code-context-overflow"
category: "Claude Code / Codex"
tags:
  - Claude Code
  - Codex
  - Context
  - Prompt Workflow
difficulty: "intermediate"
error_type: "context_overflow"
tool:
  - Claude Code
  - Codex
  - Git
seo_keywords:
  - "Claude Code context overflow"
  - "Codex 上下文溢出"
  - "AI 编程上下文管理"
status: "reviewed"
summary: "长对话、过多文件和模糊任务会挤爆上下文，需要拆任务、写状态摘要并让 Agent 只读取相关文件。"
related:
  - function-calling-json-parse-failed
  - rag-low-relevance-recall
created_at: "2026-05-27"
updated_at: "2026-05-27"
---

## 适用场景
你在 Claude Code、Codex 或类似代码 Agent 中连续开发多个功能，开始出现遗忘需求、重复读取文件、误改无关模块或提示上下文超限。

## 报错现象
可能没有明确错误码，但会出现这些信号：

- Agent 忘记你刚刚确认的范围。
- 它开始复述旧计划，而不是执行当前任务。
- 它读取大量无关文件，回答变慢。
- 生成补丁时漏掉前面已经完成的约束。

## 根因解释
上下文窗口不是项目记忆库。长对话会把需求、代码片段、日志、失败尝试和中间讨论混在一起。当任务边界不清晰时，模型会试图保留所有线索，结果反而降低定位能力。

## 修复步骤
1. 立刻停止继续塞日志，先写一份 10 行以内的状态摘要。
2. 把任务拆成「当前必须完成」和「稍后处理」。
3. 明确允许读取的文件范围，例如 `app/debug/`、`lib/content.ts`。
4. 要求 Agent 在每次改动前说明将修改哪些文件。
5. 复杂任务新开线程或写入 `docs/` 里的实施计划。

## 可复制代码 / 命令
```bash
git status --short
rg "TODO|FIXME|context|prompt" app components lib content
npm run test
```

```text
当前状态摘要模板：
- 目标：
- 已完成：
- 当前失败：
- 相关文件：
- 不要修改：
- 下一步：
```

## 给 Claude Code / Codex 的 Debug Prompt
```text
我们需要从上下文溢出的对话中恢复工作状态。

请先不要修改文件。请根据当前仓库重新建立任务上下文：
1. 读取 README、package.json、最近相关目录和 git status。
2. 用 10 行以内总结项目目标、已完成内容、未完成内容。
3. 列出你认为必须读取的最小文件集合，并说明原因。
4. 提出下一步 3 个可验证动作。
5. 等我确认后再开始改代码。

输出格式：状态摘要 / 相关文件 / 风险 / 下一步。
```

## Prompt 使用方法
把它用于「对话已经变长但任务还没结束」的中场整理。它的重点不是继续生成代码，而是让 Agent 重新压缩上下文、减少无关读取。

## 同类问题排查框架
1. 需求混乱时先压缩，不要继续实现。
2. 文件太多时先列边界，不要全仓库扫描。
3. 计划太长时拆成可验证小步骤。
4. 状态不可信时让 Agent 重新读源文件，而不是相信记忆。

## 相关问题
- RAG 检索结果相关性很低怎么办？
- Function Calling 返回 JSON 解析失败怎么办？
