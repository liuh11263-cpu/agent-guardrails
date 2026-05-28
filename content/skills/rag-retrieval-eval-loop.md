---
title: "RAG 召回评估闭环"
slug: "rag-retrieval-eval-loop"
type: "Skill"
category: "RAG"
summary: "从低相关召回到样例集、指标、切分策略和回归测试的可复用 RAG 调优工作流。"
use_case: "适合 RAG 命中率低、答案引用不准、chunk 或 embedding 策略需要调整的场景。"
source_name: "RAG engineering workflows"
source_url: "https://github.com/subinium/awesome-claude-code"
tags:
  - RAG
  - Evaluation
  - Retrieval
  - Embedding
steps:
  - "收集 10-30 个真实查询和期望命中文档。"
  - "记录当前 top-k、分数、chunk、metadata 和答案引用。"
  - "分别测试切分、embedding、rerank、过滤条件。"
  - "选择单一变量改动，跑同一组查询回归。"
  - "输出命中率变化和失败样例。"
verification:
  - "有固定评估集。"
  - "每次只比较一个变量。"
  - "报告包含成功和失败样例。"
---

## 可复制工作流
```text
请按 RAG 召回评估闭环排查这个低相关问题。

1. 整理查询样例、期望文档和当前召回结果。
2. 固定 top-k、embedding 模型、chunk 规则、metadata 过滤条件。
3. 每次只改一个变量。
4. 记录命中率、相关性、引用准确率和失败样例。
5. 给出推荐改动和回归验证命令。
```

## 抓取方法
抓 RAG Skill 时，不要只收“提高召回率”的建议，要抓评估集、指标、变量控制和失败样例格式。
