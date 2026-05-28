# 🛡️ Agent Guardrails: Less Tokens, Fewer Pitfalls

> **Common error immunity for LLM Agents.** 一键为你的本地 Agent（Claude Code, Cursor, Codex）挂载防失控与防踩坑的“公共免疫补丁”，节省 40%~80% Token 消耗。

---

## 💡 为什么需要这个项目？

在大模型 Agent（尤其是具备终端与文件修改权限的 Coding Agent）时代，开发范式已经发生了根本改变。你不再需要去 StackOverflow 复制 **Code Snippet（代码片段）**，大模型自己就能秒写代码。

你面临的真实痛点是：
1. **Token 浪费严重**：Agent 遇到报错时会盲目重试，进行“修改-报错-再修改”的死循环，一瞬间烧掉数万 Token。
2. **行为失控**：Agent 无法感知 Git 冲突标记、容易在错误的路径上过度重构，甚至把项目改废。
3. **长尾与本地踩坑**：大模型对微信小程序、私有 MCP 端口冲突、特定框架的 422 报错等本地特有环境缺乏感知。

**本项目提供了一个“双向免疫网络”：**
*   **人类贡献**：将你在本地调教大模型的血泪教训（Prompt / Debug 经验）脱敏并沉淀为结构化的 SOP。
*   **Agent 消费**：本地 Agent 在执行任务前，只需极速请求本站 API，即可自动注入前人总结的 **`steps`（执行步骤）**、**`constraints`（规避红线）** 与 **`verification`（验证条件）**，实现“一处踩坑，全球免疫”。

---

## 🛠️ 项目架构：GitHub 协作 + 独立站 RAG 检索

我们采用 **“GitHub 托管协作，网站负责展示和搜索 API”** 的混合职责架构：

*   **GitHub (源数据 & 协作层)**：所有 Prompt、Debug Cases 和 Skills 以标准 Markdown/JSON 形式托管在 GitHub。支持全网开发者通过 Fork + Pull Request 贡献和审计经验。
*   **独立站 (API & 展现层)**：Next.js 构建的独立站提供漂亮的交互 UI（支持一键复制 SOP），同时为本地 Agent 暴露超轻量、低 Token 的 `GET /api/skills?q={query}` 检索接口。

---

## 🚀 快速开始

### 1. 本地启动网站与 API 服务

```bash
npm install
npm run dev
```
访问 `http://localhost:3000` 即可打开前端交互站。

### 2. 本地 Agent 一键调用 (示例)

你可以编写一个简单的本地脚本或配置，让你的 Agent 在执行任务前自动通过 curl 检索本站 API：

```bash
curl "http://localhost:3000/api/skills?q=mcp"
```

返回对大模型极其友好的结构化 SOP 响应：
```json
{
  "success": true,
  "results": [
    {
      "title": "MCP 服务连接超时与端口冲突排查",
      "category": "Debug",
      "domain": "Agent",
      "summary": "本地挂载 MCP 服务连接超时或端口冲突排查",
      "steps": [
        "净化标准输出，将调试日志重定向至 console.error，绝对不能用 console.log",
        "使用 lsof -i :port 检查端口占用",
        "在配置中将 localhost 强行指定为 127.0.0.1 避开 IPv6 解析误差"
      ],
      "constraints": [
        "优先给最小可行方案，不要过度重构"
      ],
      "verification": [
        "运行 lsof 确认服务独立运行",
        "在终端用 mcp list 确认挂载成功"
      ]
    }
  ]
}
```

---

## ✍️ 如何贡献你本地的踩坑经验？

我们强烈欢迎你将自己调教大模型的经验贡献出来！只需两步：

### 方式 A：通过 GitHub 提 PR (最推荐)
1. **Fork** 本仓库。
2. 在 `content/debug/`（报错解法）或 `content/prompts/`（提示词指令）下新建一个 `.md` 文件，使用规范的 YAML Frontmatter：
   ```markdown
   ---
   title: "你的排坑标题"
   slug: "your-bug-slug"
   category: "分类"
   tags: ["标签"]
   summary: "一句话总结"
   ---
   ## 适用场景
   ...
   ## 修复步骤
   ...
   ## 验证方法
   ...
   ```
3. 提交 PR。GitHub Actions 会自动触发 Lint 并更新云端 API。

### 方式 B：本地批量导入
如果你在本地有一堆零散的踩坑 Markdown、JSON 或 TXT 笔记，可以直接把它们丢进项目的 [data/imports/](file:///Users/leo/2生成内容/8AI网站/data/imports/) 目录下，然后运行：
```bash
npm run skills:update
```
本地管线会自动对它们进行清洗、智能归类并完成构建。

---

## 🗺️ 发展路线 (Roadmap)

- [x] 基于 Next.js 14 的轻量前端与一键复制 SOP 控制台
- [x] 支持跨分类（Prompt/Debug/Skill）的 Agent 检索 API
- [ ] 封装标准的 **MCP Server**，支持 Claude Code 等 Agent 零配置原生挂载
- [ ] 自动化本地对话历史脱敏上传脚本

---

## 📄 开源协议

MIT License.
