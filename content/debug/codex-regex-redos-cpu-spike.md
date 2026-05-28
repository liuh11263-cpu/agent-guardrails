---
title: "Codex 生成灾难性正则导致 ReDoS 和 CPU 跑满"
slug: "codex-regex-redos-cpu-spike"
category: "Claude Code / Codex"
tags: ["Codex", "Regex", "ReDoS", "Security"]
difficulty: "advanced"
error_type: "redos / catastrophic_backtracking"
tool: ["Codex"]
seo_keywords: ["Codex ReDoS", "AI 生成正则 CPU 跑满", "catastrophic backtracking regex"]
status: "published"
created_at: "2026-05-28"
updated_at: "2026-05-28"
summary: "在 Codex 生成复杂正则后加入恶意输入基准测试，防止灾难性回溯拖死本地服务和测试进程。"
---

## 适用场景
Codex 为日志解析、Markdown 提取、URL 校验、HTML 片段匹配、表单校验生成了复杂正则，包含嵌套量词如 `(.*)+`、`(.+)*`、`(a|aa)+`、多层可选分组。短输入正常，长输入或恶意输入会让 Node/Python 进程 CPU 飙高，测试卡住，Agent 误以为是框架问题继续乱改。

## 修复步骤
1. 先定位新增或修改过的正则：
   `rg "new RegExp|/.*\\+.*\\*/|match\\(|replace\\(|split\\(" app lib src tests`
2. 检查是否存在嵌套量词、贪婪 `.*` 夹在复杂分组中、重复 alternation 前缀。
3. 把“全能正则”拆成两段：先用简单边界切分，再用小正则校验局部字段。
4. 给正则加最坏输入测试，例如超长非匹配字符串、重复前缀、缺失闭合符号。
5. 在 Node 中做毫秒级基准：
   `node -e "const re=/YOUR_REGEX/; const s='a'.repeat(50000)+'!'; const t=Date.now(); console.log(re.test(s), Date.now()-t)"`
6. 对用户可控输入设置长度上限，例如先 `slice(0, 5000)`，再进入解析流程。

## 约束
- Codex 不得用一个巨大正则同时解析嵌套结构、转义字符和业务语义。
- 不得只用正常样例验证正则，必须包含长字符串非匹配用例。
- 不得为了解决卡死简单提高测试超时时间，必须先证明正则复杂度可控。

## 验证方法
- 恶意输入基准在本机稳定低于 100ms，且测试进程自动退出。
- `npm run test` 或 `npm run test:ci` 不再卡在字符串解析相关用例，CPU 不持续满载。
