---
title: "Function Calling 返回 JSON 解析失败怎么办？"
slug: "function-calling-json-parse-failed"
category: "Agent"
tags:
  - Function Calling
  - JSON
  - Tool Use
  - Agent
difficulty: "intermediate"
error_type: "json_parse_error"
tool:
  - OpenAI API
  - Agent SDK
  - Codex
seo_keywords:
  - "Function Calling JSON parse failed"
  - "tool call JSON 解析失败"
  - "Agent 函数调用 JSON 错误"
status: "reviewed"
summary: "函数调用 JSON 失败多半是 schema 不严格、把自然语言当 JSON 解析、或工具返回值没有做边界处理。"
related:
  - fastapi-llm-api-422-pydantic-validation-error
  - rag-low-relevance-recall
created_at: "2026-05-27"
updated_at: "2026-05-27"
---

## 适用场景
你在 AI 应用里使用 Function Calling、Tool Use 或 Agent 工具调用，模型返回后 `JSON.parse`、Pydantic 校验或工具参数解析失败。

## 报错现象
常见现象包括：

- `JSONDecodeError: Expecting value`
- `Unexpected token ... in JSON`
- 工具参数缺字段或多字段。
- 模型把解释文字和 JSON 混在一起返回。

## 根因解释
Function Calling 的关键是 schema 和调用边界。若 schema 过宽，模型会生成不稳定字段。若你把普通 assistant 文本当成工具参数解析，就会解析到自然语言。工具返回值如果直接拼回 prompt，也可能污染下一轮 JSON。

## 修复步骤
1. 使用严格 JSON schema，减少自由文本字段。
2. 区分 assistant message、tool call arguments、tool result。
3. 只解析 tool call arguments，不解析自然语言回答。
4. 对工具返回值做 JSON.stringify 或结构化封装。
5. 增加失败重试：把解析错误和 schema 发回模型要求修正。

## 可复制代码 / 命令
```ts
const argsText = toolCall.function.arguments;
let args: unknown;

try {
  args = JSON.parse(argsText);
} catch (error) {
  throw new Error(`Tool arguments are not valid JSON: ${argsText}`);
}
```

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": ["query", "limit"],
  "properties": {
    "query": { "type": "string" },
    "limit": { "type": "integer", "minimum": 1, "maximum": 10 }
  }
}
```

## 给 Claude Code / Codex 的 Debug Prompt
```text
请帮我排查 Function Calling / Tool Use 返回 JSON 解析失败。

请检查：
1. 代码是否只解析 tool call arguments，而不是解析 assistant 文本。
2. tool schema 是否设置 required、type、additionalProperties。
3. 工具返回值是否被安全序列化，是否污染下一轮模型输入。
4. 当前失败样例的原始模型响应、arguments 字符串和解析错误。
5. 给出一个带 schema 校验、解析错误提示和重试策略的最小修复。

请输出「失败链路」「原始证据」「schema 修改」「解析代码」「回归测试」。
```

## Prompt 使用方法
提供原始模型响应很关键。不要只贴 JSON.parse 的错误，因为真正的问题可能是你拿错了 message 字段。

## 同类问题排查框架
1. 先确认解析对象来自哪里。
2. 再确认 schema 是否足够收敛。
3. 再确认工具返回是否结构化。
4. 最后增加重试和回归测试。

## 相关问题
- FastAPI 调用大模型接口返回 422 怎么办？
- RAG 检索结果相关性很低怎么办？
