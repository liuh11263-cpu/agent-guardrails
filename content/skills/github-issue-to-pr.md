---
title: "GitHub Issue 到 PR 执行流"
slug: "github-issue-to-pr"
type: "Skill"
category: "GitHub 工作流"
summary: "把一个 issue 变成隔离分支、实现、测试、提交和 PR 的可复用工作流。"
use_case: "适合处理明确的 GitHub issue、bug 修复、文档更新或小功能开发。"
source_name: "GitHub Agentic Workflows / awesome indexes"
source_url: "https://github.com/github/gh-aw"
tags:
  - GitHub
  - PR
  - Worktree
  - CI
steps:
  - "读取 issue 目标、验收标准和相关链接。"
  - "检查当前分支和未提交改动，必要时创建隔离 worktree。"
  - "定位代码路径，写失败测试或复现脚本。"
  - "实现修复并运行测试、构建、lint。"
  - "提交改动，推送分支，创建 draft PR。"
verification:
  - "本地测试通过。"
  - "PR 描述包含 issue 链接和验证命令。"
  - "CI 状态已检查或明确说明未能检查。"
---

## 可复制工作流
```text
请把这个 GitHub issue 按工程流程处理成一个可审查 PR。

流程：
1. 总结 issue 的目标、边界和验收标准。
2. 检查仓库状态，避免覆盖已有改动。
3. 新建隔离分支或 worktree。
4. 写失败测试或复现步骤。
5. 实现最小修复。
6. 运行测试、构建和 lint。
7. 提交、推送并创建 draft PR。

输出 PR 摘要、验证命令、风险和后续建议。
```

## 抓取方法
抓 GitHub 高星工作流时，优先提取 issue triage、branch/worktree、test、commit、PR、CI 六个环节。没有验证环节的内容不要直接入库。
