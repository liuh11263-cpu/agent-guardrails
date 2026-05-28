---
title: "Agent 工具契约检查 Prompt"
slug: "agent-tool-contract"
category: "Agent Prompts"
scenario: "当 Agent 工具调用不稳定，需要检查 schema、参数、返回值和重试策略。"
models:
  - GPT-4.1
  - Claude
linked_debug:
  - function-calling-json-parse-failed
---

```text
请检查我的 Agent 工具契约是否可靠。

请逐项审查：
1. 每个 tool 的 name、description、input schema 是否清晰。
2. required 字段、枚举、数组、数字范围是否收敛。
3. 工具返回值是否结构化，是否能安全放回下一轮上下文。
4. 失败时是否有可读错误、重试策略和降级路径。
5. 给出最小测试用例覆盖正常调用、缺字段、类型错误和工具异常。

输出：风险列表 / schema 修改建议 / 测试用例。
```
