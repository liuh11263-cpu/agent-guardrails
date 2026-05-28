---
title: "Codex 运行测试误入 Watch 模式导致进程挂死"
slug: "codex-test-watch-mode-hang"
category: "Claude Code / Codex"
tags: ["Codex", "Jest", "Vitest", "Test Runner"]
difficulty: "intermediate"
error_type: "hanging_process / watch_mode"
tool: ["Codex"]
seo_keywords: ["Codex 测试挂死", "Jest watch mode Codex", "Vitest run mode"]
status: "published"
created_at: "2026-05-28"
updated_at: "2026-05-28"
summary: "让 Codex 固定使用一次性测试命令并识别 watch 模式，避免终端进程不退出造成假卡死和上下文浪费。"
---

## 适用场景
Codex 自动验证改动时直接执行 `npm test`，而项目的测试脚本实际进入 Jest、Vitest、Playwright UI 或 watch 模式。终端没有退出，Agent 以为测试还在运行，反复等待、轮询、重试，最终浪费大量时间和 Token。

## 修复步骤
1. 先检查测试脚本，不要盲跑：
   `cat package.json`
2. 如果是 Jest，优先使用一次性命令：
   `npx jest --runInBand --watch=false`
3. 如果是 Vitest，使用 run 模式：
   `npx vitest run`
4. 如果是 React Scripts，禁用交互 watch：
   `CI=true npm test -- --watchAll=false`
5. 如果测试已经挂住，先停止当前会话中的测试进程，再记录原因，不要再次运行同一个命令。
6. 把可复用命令写进 `package.json`：
   `"test:ci": "vitest run"` 或 `"test:ci": "jest --runInBand --watch=false"`

## 约束
- Codex 不得在无人值守验证中运行默认 `npm test`，除非已确认它会自动退出。
- 不得通过反复开新终端解决挂死问题，必须先定位是否 watch 模式。
- 不得把超时当成测试失败直接改业务代码，先修正测试运行方式。

## 验证方法
- 运行 `npm run test:ci` 后进程自动退出，并返回明确的 pass/fail 结果。
- 终端中不再出现 `Watch Usage`、`press h to show help`、`waiting for file changes` 等交互提示。
