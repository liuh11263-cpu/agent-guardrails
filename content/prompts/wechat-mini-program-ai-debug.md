---
title: "微信小程序 AI 接口排查 Prompt"
slug: "wechat-mini-program-ai-debug"
category: "WeChat Mini Program Prompts"
scenario: "当小程序通过云函数调用 AI 接口失败，需要排查前端入参、云函数日志、鉴权和模型响应。"
models:
  - Claude Code
  - Codex
linked_debug:
  - fastapi-llm-api-422-pydantic-validation-error
---

```text
请帮我排查微信小程序 AI 接口调用失败。

请检查：
1. 小程序端 wx.cloud.callFunction 的 name、data 和错误回调。
2. 云函数入口参数、环境变量、密钥读取和日志。
3. AI 服务请求 payload、超时、鉴权和返回结构。
4. 是否有把敏感 key 暴露到小程序端。
5. 给出安全的云函数修复方案和最小验证步骤。

输出：问题层级 / 风险 / 修复代码位置 / 验证方式。
```
