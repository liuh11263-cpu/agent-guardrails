---
title: "多层链路 Debug 分诊 Prompt"
slug: "debug-triage"
category: "Debug Prompts"
scenario: "当 AI 应用报错来源不明确，需要先判断是前端、接口、模型服务、工具调用还是环境问题。"
models:
  - Claude Code
  - Codex
linked_debug:
  - fastapi-llm-api-422-pydantic-validation-error
  - function-calling-json-parse-failed
---

```text
请对这个 AI 应用问题做分层 Debug 分诊。

请按以下链路检查：
1. 前端请求参数和请求头。
2. 后端路由、schema、日志和异常栈。
3. 模型 API 调用、鉴权、限流和响应结构。
4. 工具调用 / Function Calling 的参数解析。
5. 本地环境、路径、依赖和运行目录。

请输出：最可能层级 / 证据 / 下一步最小验证 / 推荐修复顺序。
```
