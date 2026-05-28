---
title: "Codex 实施检查清单 Prompt"
slug: "codex-implementation-checklist"
category: "Codex Prompts"
scenario: "当需要 Codex 执行一组前后端改动，希望它边改边验证并给出清晰结果。"
models:
  - Codex
linked_debug:
  - fastapi-llm-api-422-pydantic-validation-error
  - claude-code-context-overflow
---

```text
请按工程检查清单完成这个改动。

要求：
1. 先读取现有结构，说明将修改哪些文件。
2. 只实现当前需求，不加入登录、付费、后台等额外系统。
3. 每完成一个模块后更新状态。
4. 保留用户已有改动，不回滚无关文件。
5. 最后运行测试或构建命令，并报告真实输出。

请输出：修改范围 / 实施步骤 / 验证结果 / 遗留风险。
```
