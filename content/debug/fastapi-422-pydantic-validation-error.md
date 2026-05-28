---
title: "FastAPI 调用大模型接口返回 422 怎么办？"
slug: "fastapi-llm-api-422-pydantic-validation-error"
category: "FastAPI + LLM API"
tags:
  - FastAPI
  - Pydantic
  - API Debug
  - LLM API
difficulty: "beginner"
error_type: "validation_error"
tool:
  - FastAPI
  - Claude Code
  - OpenAI API
seo_keywords:
  - "FastAPI 422"
  - "Pydantic validation error"
  - "大模型接口 422"
status: "reviewed"
summary: "请求体字段、Content-Type 或 Pydantic schema 不一致，导致接口还没进入业务逻辑就被 FastAPI 拦截。"
related:
  - function-calling-json-parse-failed
  - python-venv-activate-not-found
created_at: "2026-05-27"
updated_at: "2026-05-27"
---

## 适用场景
你用 FastAPI 封装 OpenAI、Claude 或本地大模型接口，前端或脚本请求接口时返回 422 Unprocessable Entity。

常见位置包括聊天接口、RAG 查询接口、文件上传后的分析接口，以及给 Claude Code / Codex 暴露的本地工具接口。

## 报错现象
接口返回 422，响应体通常包含字段缺失、类型错误或 body 解析失败。

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "prompt"],
      "msg": "Field required"
    }
  ]
}
```

## 根因解释
422 不是大模型返回的错误，而是 FastAPI 在请求进入函数前做参数校验时失败。

最常见的根因是请求 JSON 字段名和 Pydantic 模型不一致，例如代码需要 `prompt`，客户端却发送了 `message`。其次是 `Content-Type` 没有设置为 `application/json`，或字段类型本该是数组却传了字符串。

## 修复步骤
1. 打印 FastAPI 路由函数的入参模型，确认必填字段。
2. 对照客户端请求体，逐个核对字段名、层级和类型。
3. 确认请求头包含 `Content-Type: application/json`。
4. 如果字段可能为空，给 Pydantic 字段设置默认值或改成可选。
5. 给接口增加一个最小 curl 用例，先绕过前端验证后端。

## 可复制代码 / 命令
```python
from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    model: str = "gpt-4.1-mini"

@app.post("/api/chat")
async def chat(payload: ChatRequest):
    return {"answer": f"received: {payload.prompt}"}
```

```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"解释这个 422 错误","model":"gpt-4.1-mini"}'
```

## 给 Claude Code / Codex 的 Debug Prompt
```text
请帮我排查这个 FastAPI 422 错误。

上下文：
1. 找到报错接口的路由函数和 Pydantic request model。
2. 找到调用这个接口的前端代码、curl、测试脚本或 SDK 调用代码。
3. 对比请求体字段名、字段层级、字段类型、是否必填、默认值。
4. 检查请求头是否包含 Content-Type: application/json。
5. 给出最小可复现请求，并提供修改后的 request model 或调用代码。

请按「根因」「证据」「修复补丁」「验证命令」输出。
```

## Prompt 使用方法
把接口报错日志、路由文件路径、客户端请求代码一起交给代码 Agent。不要只贴 422 响应体，因为 422 的关键信息通常藏在 request model 和调用方字段差异里。

## 同类问题排查框架
1. 先判断错误发生在框架校验层、业务层还是模型服务层。
2. 如果 HTTP 状态码是 422，优先查 schema 和请求体。
3. 如果状态码是 401 / 403，优先查 key、权限和代理。
4. 如果状态码是 500，优先查服务端日志和异常栈。

## 相关问题
- Function Calling 返回 JSON 解析失败怎么办？
- Python venv 路径找不到 activate 怎么办？
