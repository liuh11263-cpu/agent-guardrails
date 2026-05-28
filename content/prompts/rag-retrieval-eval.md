---
title: "RAG 召回质量评测 Prompt"
slug: "rag-retrieval-eval"
category: "RAG Prompts"
scenario: "当 RAG 召回结果相关性低，需要建立最小评测集并定位切块、embedding、filter 或 rerank 问题。"
models:
  - Claude
  - GPT-4.1
linked_debug:
  - rag-low-relevance-recall
---

```text
请帮我设计一个 RAG 检索质量评测方案。

已知：
- 文档类型：
- 用户问题类型：
- 当前 retriever / embedding / vector db：

请输出：
1. 20 条评测样例字段：query、expected_doc、expected_answer、required_terms。
2. 检索指标：top1_hit、top5_hit、mrr、failure_reason。
3. 失败原因分类：切块、embedding、metadata、query rewrite、rerank。
4. 一个可以打印 top k chunk 和 metadata 的 debug 脚本思路。
```
