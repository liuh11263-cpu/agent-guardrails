---
title: "Codex 触发沙箱权限拒绝后反复改错路径"
slug: "codex-sandbox-permission-denied-loop"
category: "Claude Code / Codex"
tags: ["Codex", "Sandbox", "Shell", "Permissions"]
difficulty: "intermediate"
error_type: "permission_denied / sandbox_restriction"
tool: ["Codex"]
seo_keywords: ["Codex permission denied", "Codex sandbox denied", "AI Agent 权限拒绝"]
status: "published"
created_at: "2026-05-28"
updated_at: "2026-05-28"
summary: "把权限拒绝和真实代码错误区分开，避免 Codex 为了绕过沙箱去改配置、改路径或写无关脚本。"
---

## 适用场景
Codex 试图写入系统目录、全局缓存、父级仓库、`/usr/local`、`~/.config`、Docker volume、浏览器配置或受限项目外路径时，命令返回 `Permission denied`、`Operation not permitted`、`sandbox denied`。危险点在于 Agent 可能误判为项目配置错误，然后开始改 package、构建脚本或路径常量。

## 修复步骤
1. 先确认当前工作目录和可写边界：
   `pwd`
   `git status --short`
2. 让 Codex 复述失败命令、目标路径、报错原文，判断是权限问题还是代码问题。
3. 如果必须写缓存或临时文件，改到项目内 `.tmp/`、`tmp/` 或系统允许的临时目录。
4. 如果必须访问项目外资源，让人类明确批准，再执行一次最小命令，不要批量升级权限。
5. 对依赖安装失败，区分网络失败、权限失败和 lockfile 冲突：
   `npm config get cache`
   `npm ci --dry-run`
6. 修复后把脚本中的绝对路径替换为相对路径或环境变量，例如 `process.env.CACHE_DIR ?? ".tmp/cache"`。

## 约束
- Codex 不得为绕过权限拒绝而使用 `sudo`、全局安装或修改系统目录。
- 不得把 `Permission denied` 当成 TypeScript、Next.js、Python 代码错误来修业务逻辑。
- 不得在未确认可写范围前创建、移动或删除项目外文件。

## 验证方法
- 失败命令改为项目内路径后可重复执行，退出码为 0。
- `git status --short` 只出现预期项目文件变更，没有系统配置、全局缓存或无关生成物。
