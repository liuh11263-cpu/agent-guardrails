---
title: "ComfyUI 工作流 API 加载 workflow_api.json 失败怎么办？"
slug: "comfyui-workflow-api-json-not-found"
category: "ComfyUI"
tags:
  - ComfyUI
  - Workflow API
  - File Path
  - Image Generation
difficulty: "beginner"
error_type: "file_not_found"
tool:
  - ComfyUI
  - Python
  - Claude Code
seo_keywords:
  - "ComfyUI workflow_api.json"
  - "ComfyUI API workflow not found"
  - "workflow_api.json 加载失败"
status: "reviewed"
summary: "ComfyUI 页面导出的普通 workflow 和 API workflow 结构不同，路径、文件名或节点依赖不一致都会导致加载失败。"
related:
  - python-venv-activate-not-found
  - claude-code-context-overflow
created_at: "2026-05-27"
updated_at: "2026-05-27"
---

## 适用场景
你想从 Python、Node.js 或后端服务调用 ComfyUI 工作流，但代码读取 `workflow_api.json` 失败，或提交 prompt 后 ComfyUI 返回节点错误。

## 报错现象
常见错误包括：

- `FileNotFoundError: workflow_api.json`
- `json.decoder.JSONDecodeError`
- ComfyUI 返回 `Prompt outputs failed validation`
- 某些节点 class type 不存在

## 根因解释
ComfyUI 有普通 workflow 和 API workflow 两种导出结构。普通 workflow 面向前端画布，API workflow 面向 `/prompt` 接口。如果把普通 workflow 当 API JSON 提交，节点字段通常不匹配。

另一类问题是脚本运行目录不对。相对路径 `workflow_api.json` 会按当前进程目录解析，而不是按脚本文件所在目录解析。

## 修复步骤
1. 在 ComfyUI 设置里开启 Dev Mode。
2. 使用 Save API Format 导出 API workflow。
3. 在脚本里用绝对路径或 `Path(__file__).parent` 定位 JSON。
4. 检查自定义节点是否已安装，并确认 ComfyUI 启动日志没有 import 失败。
5. 先用最小 prompt 提交，确认服务和 workflow 都可用。

## 可复制代码 / 命令
```python
import json
from pathlib import Path

WORKFLOW_PATH = Path(__file__).parent / "workflow_api.json"

with WORKFLOW_PATH.open("r", encoding="utf-8") as file:
    workflow = json.load(file)

print("loaded nodes:", len(workflow))
```

```bash
python scripts/run_comfyui_workflow.py
```

## 给 Claude Code / Codex 的 Debug Prompt
```text
请帮我排查 ComfyUI API workflow 加载失败。

请检查：
1. 当前代码读取 workflow_api.json 的路径是否依赖错误的工作目录。
2. JSON 是否为 ComfyUI 的 API Format，而不是普通前端 workflow。
3. 提交到 /prompt 的 payload 结构是否正确。
4. workflow 里引用的自定义节点是否在 ComfyUI 环境中存在。
5. 给出一个最小可运行的 Python 加载和提交脚本。

请输出「路径问题」「JSON 结构问题」「节点依赖问题」「修复代码」「验证命令」。
```

## Prompt 使用方法
把脚本路径、workflow 文件路径、ComfyUI 错误日志和导出的 JSON 前 20 行一起提供。不要直接把整个大型 workflow 贴进对话，除非 Agent 明确需要节点细节。

## 同类问题排查框架
1. 文件不存在先查运行目录和绝对路径。
2. JSON 解析失败先查文件内容是不是空文件或 HTML 错误页。
3. API 校验失败先查导出格式和节点字段。
4. 节点不存在先查自定义节点安装和启动日志。

## 相关问题
- Python venv 路径找不到 activate 怎么办？
- Claude Code 上下文溢出怎么办？
