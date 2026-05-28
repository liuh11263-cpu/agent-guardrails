---
title: "MCP 服务连接超时与端口冲突排查"
slug: "mcp-server-handshake-timeout"
category: "Agent"
tags:
  - MCP
  - Claude Code
  - Connection Timeout
  - Port Collision
difficulty: "advanced"
error_type: "MCP Handshake Failure"
tool:
  - Claude Code
  - MCP Server
  - Node.js / Python
seo_keywords:
  - mcp handshake timeout
  - claude code mcp failed
  - mcp server port collision
status: "published"
created_at: "2026-05-28"
updated_at: "2026-05-28"
summary: "在配置和启动 Claude Code 挂载的 MCP (Model Context Protocol) 服务时，如果遇到连接挂起、握手超时或底层端口占用，Agent 会因无法访问工具集而频繁崩溃重启。本 Case 提供标准排查步骤。"
related:
  - function-calling-json-parse-failed
---

## 适用场景
当本地挂载了自定义的 MCP Server（例如本地数据库读取、文件系统增强工具）到 Claude Code 或 Desktop 后，在启动 Agent 时发生挂死、连接被拒，或者 Agent 控制台抛出 TCP/stdio 握手失败的日志。

## 报错现象
Agent 启动时长时间卡顿，最终报错退回或抛出异常：
```text
[mcp] Error: Connection handshake timeout
[mcp] Failed to connect to server "my-database-mcp"
...
FATAL: MCP server initialization failed. Exiting...
```

## 根因解释
1.  **通信管道阻塞**：MCP 可以基于 stdio (标准输入输出) 或 SSE (HTTP Server-Sent Events) 通信。如果基于 stdio 启动的 node/python 脚本中包含多余的 `console.log`，这些日志会混入 stdio 的 JSON-RPC 数据流中，导致通信协议解析被破坏，触发握手超时。
2.  **端口冲突**：如果采用 SSE 通信方式，MCP 服务试图占用的本地端口（如 3000、8000）已经被其他业务进程（如 Next.js 研发服）抢占，导致握手直接被拒。
3.  **环境隔离限制**：Agent 运行于沙箱或受限 shell 中，无法正确识别本地系统配置的 `localhost` (可能映射为 IPv6 `::1` 而服务运行在 IPv4 `127.0.0.1` 上)。

## 修复步骤
针对本地 MCP 服务的配置进行逐一排除：

1.  **净化标准输出 (Stdio Clean-up)**：
    检查你的 MCP Server 源码。**绝对不能**在初始化和运行中调用普通的 `console.log()` 或 `print()` 输出调试信息。所有调试日志必须重定向输出到 `console.error()`（标准错误流不会干扰 MCP 的 RPC 管道）。
2.  **杀死占用端口的僵尸进程**：
    若是基于 SSE 通信，检查配置中设定的服务端口（假设为 3000 端口）：
    ```bash
    lsof -i :3000
    ```
    若发现占用，直接杀死其 pid：
    ```bash
    kill -9 <PID>
    ```
3.  **强行指定 IPv4 绑定**：
    在挂载 MCP 配置（如 `claude_desktop_config.json` 或本站的 MCP 端）时，将 `localhost` 修改为明晰的 IP 地址，避开 IPv6 解析误差：
    ```json
    "my-database-mcp": {
      "command": "node",
      "args": ["/path/to/server.js", "--host", "127.0.0.1", "--port", "3000"]
    }
    ```
4.  **脱机测试握手**：
    不通过 Agent，先手动以 stdio 方式在终端启动该服务，并输入一个简单的 JSON-RPC 初始化请求，观察其是否能正常返回响应，排除环境路径配置问题：
    ```bash
    node /path/to/server.js
    ```

## 验证方法
*   运行 `lsof -i :3000` 确认 MCP 服务独立运行在对应端口上。
*   启动 Claude Code，运行命令 `mcp list` 或 `show tools`，应该能够瞬间返回挂载成功的自定义 Tool 列表，没有任何连接超时的 warn 日志。
