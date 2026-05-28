---
title: "代码审查反馈修复闭环"
slug: "review-feedback-fix-loop"
type: "Skill"
category: "代码审查"
summary: "读取 review comment，判断是否成立，最小修复并回归验证的一套可复用工作流。"
use_case: "PR 被要求修改、CI 失败后需要同时处理评论和测试时使用。"
source_name: "GitHub review workflows"
source_url: "https://github.com/subinium/awesome-claude-code"
tags:
  - Code Review
  - GitHub
  - CI
  - Regression
steps:
  - "读取未解决 review comment 和失败检查。"
  - "区分必须修复、可讨论、误报三类。"
  - "为行为问题补测试，为样式问题做局部修正。"
  - "逐项验证评论已覆盖。"
  - "回复每条评论的处理方式和证据。"
verification:
  - "相关测试通过。"
  - "每条 actionable comment 都有对应处理。"
  - "没有顺手重构无关区域。"
---

## 可复制工作流
```text
请处理这个 PR 的 review feedback。

要求：
1. 先列出所有未解决评论和失败检查。
2. 判断每条反馈是否技术上成立。
3. 对成立的问题做最小修复，并补充或运行对应测试。
4. 对不成立的问题写清证据，不盲目改。
5. 最后输出每条评论的处理状态、改动文件和验证结果。
```

## 抓取方法
从高星仓库里抓 review skill 时，重点保留“先判断反馈是否成立”的规则。只会机械套改的 prompt 不算 Skill。
