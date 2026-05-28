---
title: "Codex 多文件重构后产生幽灵引用"
slug: "codex-refactor-undefined-symbols"
category: "Claude Code / Codex"
tags: ["Codex", "TypeScript", "Refactor", "AST"]
difficulty: "advanced"
error_type: "undefined_symbol / broken_import"
tool: ["Codex"]
seo_keywords: ["Codex 多文件重构", "AI Agent 未定义符号", "Codex broken imports"]
status: "published"
created_at: "2026-05-28"
updated_at: "2026-05-28"
summary: "约束 Codex 在多文件重构前后用类型检查和引用搜索闭环，避免靠记忆改代码导致未定义符号和 Token 死循环。"
---

## 适用场景
当 Codex 被要求做组件拆分、函数迁移、目录改名、API 重命名、前后端字段对齐时，最容易出现“旧引用没删干净、新导出没补齐、默认导出和命名导出混用”的问题。典型现象是它修改了 5-20 个文件后，运行构建才发现一串 `Cannot find name`、`Module has no exported member`、`is not defined`，随后继续凭上下文猜测，越修越散。

## 修复步骤
1. 先让 Codex 建立引用地图，不允许直接改文件：
   `rg "OldName|oldName|old_path|from '@/old" app components lib pages src`
2. 对每个符号做“定义点 / 导入点 / 调用点”三列表，确认是否是重命名、迁移还是删除。
3. 修改时优先使用最小补丁：只改 import/export、调用签名和类型声明，不顺手重写业务逻辑。
4. 每轮改动后立刻运行静态验证：
   `npx tsc --noEmit`
   `npm run lint`
5. 如果报错超过 20 条，停止继续猜测，先按文件聚类错误：
   `npx tsc --noEmit --pretty false`
6. 最后用反向搜索确认旧符号清零：
   `rg "OldName|oldName|old_path|from '@/old" app components lib pages src`

## 约束
- Codex 不得在没有 `rg` 引用结果的情况下批量重命名符号。
- 不得为了解决类型错误随手加 `any`、空导出或兼容性假函数。
- 不得同时做目录迁移、业务逻辑重构 and UI 改版，必须拆成独立提交粒度。

## 验证方法
- `npx tsc --noEmit` 返回退出码 0，且没有 `Cannot find name`、`has no exported member`、`Cannot find module`。
- `rg` 搜不到旧符号或旧路径，页面/接口的关键路径手动打开后行为不变。
