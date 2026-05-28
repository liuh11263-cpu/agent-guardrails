---
title: "Claude Code 遇到 Git 冲突排查与重置"
slug: "claude-code-git-merge-conflict"
category: "Claude Code / Codex"
tags:
  - Claude Code
  - Git
  - Context Reset
  - Merge Conflict
difficulty: "intermediate"
error_type: "Git Conflict / Context Polluted"
tool:
  - Claude Code
  - Git
seo_keywords:
  - claude code git conflict
  - agent git merge reset
  - claude code resolve conflict
status: "published"
created_at: "2026-05-28"
updated_at: "2026-05-28"
summary: "在本地使用 Claude Code 自动开发时，若遇到分支冲突或 merge conflict 标志未清除，Agent 可能会因看不懂冲突标记而产生无限修复死循环，本 Case 提供一键退出及重置 SOP。"
related:
  - claude-code-context-reset
---

## 适用场景
在使用 Claude Code / Cursor 等自主型 Coding Agent 时，如果在执行 `git merge` 或 `git pull` 后代码库产生了未解决的冲突标记（如 `<<<<<<< HEAD`），Agent 往往无法识别这是 Git 机制产生的标记，而会将其误认为是代码中的语法错误或非法结构，并尝试“胡乱重写”这些文件，从而彻底搞砸整个代码库，并迅速吃空 Context 和 Token。

## 报错现象
Agent 控制台出现由于冲突导致的编译失败，或者 Agent 陷入死循环：
```text
SyntaxError: Unexpected token '<'
...
(Agent) Trying to resolve syntax errors in main.py...
(Agent) Rewriting main.py...
(Agent) Error persists. Rewriting again...
```

## 根因解释
1.  **无状态感知**：大部分 Agent 在执行任务时只关注当前文件树的代码，不会主动执行 `git status` 来感知当前是否处于 `MERGING` 或 `REBASING` 状态。
2.  **符号污染**：Git 冲突标记破坏了代码本身的 Abstract Syntax Tree (AST)，导致 Linter 或编译器疯狂报错，Agent 反复试图修复编译器报错，但它并不懂需要手动选择保留哪一个分支的代码，只会顺着标记继续制造更多非法代码。

## 修复步骤
当发现 Agent 陷入此类冲突死循环时，人类应当立即采取干预：

1.  **强行终止进程**：
    在终端按下 `Ctrl + C`，强行杀死当前 Claude Code 或 Agent 的执行进程，停止 Token 消耗。
2.  **放弃冲突或强退当前分支状态**：
    如果在 Merge 过程中：
    ```bash
    git merge --abort
    ```
    如果是普通的改动混乱，重置到最近一次 commit 状态：
    ```bash
    git checkout -- .
    git clean -fd
    ```
3.  **人类手动解决冲突**：
    用 IDE 打开冲突的文件，选择保留 Incoming 或 Current 改动，保存并提交：
    ```bash
    git add .
    git commit -m "chore: manually resolve merge conflicts"
    ```
4.  **对齐 Agent 状态并重新唤醒**：
    重启 Claude Code 后，发送[上下文重置 Prompt](file:///Users/leo/2生成内容/8AI网站/content/prompts/claude-code-context-reset.md)，强制其先运行 `git status` 确认当前工作区是干净的，再继续实现功能。

## 验证方法
*   运行 `git status`，输出中必须包含 `nothing to commit, working tree clean`。
*   运行编译或测试命令（如 `npm run test`），返回退出码为 0，没有因冲突标记产生的 SyntaxError。
