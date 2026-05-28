---
title: "RAG 检索结果相关性很低怎么办？"
slug: "rag-low-relevance-recall"
category: "RAG"
tags:
  - RAG
  - Embedding
  - Retrieval
  - Vector DB
difficulty: "intermediate"
error_type: "low_relevance"
tool:
  - LangChain
  - LlamaIndex
  - Vector DB
seo_keywords:
  - "RAG 相关性低"
  - "RAG recall debug"
  - "向量检索召回差"
status: "reviewed"
summary: "RAG 召回差通常不是模型不聪明，而是切块、元数据、embedding、query 改写或 rerank 链路出了问题。"
related:
  - claude-code-context-overflow
  - function-calling-json-parse-failed
created_at: "2026-05-27"
updated_at: "2026-05-27"
---

## 适用场景
你已经搭好 RAG，但用户提问后召回的 chunk 和问题不相关，回答看起来像编的，或者 top k 结果总是命中泛泛的说明文档。

## 报错现象
RAG 链路通常不会报错，而是质量异常：

- top 5 结果没有命中答案所在文档。
- chunk 内容只有标题、目录或上下文残缺。
- 相似度分数很接近，无法区分结果。
- 同义词、中文缩写、业务术语召回很差。

## 根因解释
RAG 的相关性由多个环节共同决定。切块过大导致向量被噪音稀释，切块过小导致语义不完整。embedding 模型和 query 语言不匹配会降低召回。没有 metadata filter 时，系统会在不该搜索的文档集合里找答案。

## 修复步骤
1. 固定一个已知答案的问题，记录 top k 原始结果。
2. 检查 chunk 是否包含完整语义，优先保留标题和父级路径。
3. 统一文档和 query 的语言，必要时做 query rewrite。
4. 增加 metadata filter，例如产品、版本、文档类型。
5. 在召回后增加 reranker，减少泛泛匹配。
6. 建一个 20 条小型评测集，跟踪命中率和答案准确率。

## 可复制代码 / 命令
```python
def debug_retrieval(query: str, retriever):
    docs = retriever.get_relevant_documents(query)
    for index, doc in enumerate(docs, start=1):
        print(f"#{index}", doc.metadata)
        print(doc.page_content[:600])
        print("-" * 80)
```

```text
推荐记录字段：
query / expected_doc / top1_doc / top5_hit / similarity / rerank_score / failure_reason
```

## 给 Claude Code / Codex 的 Debug Prompt
```text
请帮我系统排查 RAG 检索相关性低的问题。

请完成：
1. 找到文档切块、embedding、入库、检索、rerank、生成回答的代码路径。
2. 选取一个用户问题，打印 top k 原始 chunk、metadata、score。
3. 判断失败属于切块问题、embedding 问题、query rewrite 问题、metadata filter 问题还是 rerank 问题。
4. 给出最小修改方案，并增加一个可重复运行的 retrieval debug 脚本。
5. 输出一个 20 条评测集字段模板。

请用「链路图」「证据」「修复建议」「验证指标」输出。
```

## Prompt 使用方法
给 Agent 提供一个具体 query、预期答案所在文档和当前 top k 输出。没有样例 query 时，Agent 很难判断相关性低到底发生在哪个环节。

## 同类问题排查框架
1. 先看检索结果，再看生成答案。
2. 先做单 query 定位，再做批量评测。
3. 先提升召回命中，再优化回答措辞。
4. 不要只调 top k，先确认 chunk 和 metadata 是否健康。

## 相关问题
- Claude Code 上下文溢出怎么办？
- Function Calling 返回 JSON 解析失败怎么办？
