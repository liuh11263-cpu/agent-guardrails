import type { Metadata } from "next";
import { ArrowRight, BookOpen, Cpu, Github, Terminal, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "使用指南 | Agent Guardrails",
  description: "如何使用 Agent Guardrails 本地提示词与 Debug 工作流库来对齐和控制你的 AI Agent（Claude Code/Cursor/Codex）并节省 Token 消耗。"
};

export const dynamic = "force-static";

export default function DocsPage() {
  return (
    <main className="min-h-[calc(100vh-68px)] bg-[var(--app-bg)] px-5 py-10 text-[var(--text-main)] lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* 头部标题 */}
        <div className="border-b border-[var(--border-soft)] pb-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
            <BookOpen size={16} />
            <span>项目使用文档</span>
          </div>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[var(--text-main)] sm:text-5xl">
            使用与对接指南
          </h1>
          <p className="mt-4 text-lg text-[var(--text-muted)]">
            本站不仅是给开发者阅读的工具手册，更是可以直接喂给大模型 Agent 的运行规约（SOP）和防错安全绳。
          </p>
        </div>

        {/* 核心概念 */}
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-[var(--text-main)]">
            <Zap className="text-amber-500" size={22} />
            核心概念划分
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
            根据不同的任务粒度和复杂度，我们将内容库精准划分为三类。理解这三类的区别，能帮助你合理调配给 Agent 的上下文：
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-5">
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">Prompt</span>
              <h3 className="mt-3 text-base font-bold text-[var(--text-main)]">一句指令</h3>
              <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                单步执行的指令，步骤不超过 2 步，无验证。用于临时的代码审查、快速重构或特定代码生成。
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-5">
              <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-600">Debug</span>
              <h3 className="mt-3 text-base font-bold text-[var(--text-main)]">问题解法</h3>
              <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                专门针对特定报错、环境冲突或沙箱越权失败的排查 SOP。包含报错原文、根因及验证机制，阻断 Agent 反复改错。
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-5">
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">Skill</span>
              <h3 className="mt-3 text-base font-bold text-[var(--text-main)]">可复用工作流</h3>
              <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                完整的闭环工程。包含输入格式、分步规划、硬性红线约束（Constraints）以及物理断言（Verification）。
              </p>
            </div>
          </div>
        </section>

        {/* 场景一：人类如何使用 */}
        <section className="mt-12 border-t border-[var(--border-soft)] pt-10">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-[var(--text-main)]">
            <Terminal className="text-blue-500" size={22} />
            场景一：开发者在 Web 端手动调用（三步走）
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
            当你在本地开发遇到复杂问题或希望大模型稳定做某项重构时，可以按照以下步骤操作：
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent)]">1</span>
              <div>
                <h4 className="text-base font-semibold text-[var(--text-main)]">搜索并过滤</h4>
                <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                  在 <Link href="/skills" className="text-[var(--accent)] hover:underline">Skill 库</Link> 或 <Link href="/debug" className="text-[var(--accent)] hover:underline">Debug 库</Link> 搜索你当前的技术栈或报错（如 “FastAPI 422”、“Git 冲突”）。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent)]">2</span>
              <div>
                <h4 className="text-base font-semibold text-[var(--text-main)]">一键复制 Prompt 模版</h4>
                <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                  点击卡片右下角的 **“复制执行 Prompt”**。该模版已将复杂的约束条件（如：“不要为了测试改动业务逻辑”）和验证步骤格式化完毕。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent)]">3</span>
              <div>
                <h4 className="text-base font-semibold text-[var(--text-main)]">注入输入并发送</h4>
                <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                  在你的 ChatGPT/Claude/Cursor 窗口中粘贴这段 Prompt，并在标记有 `【我的输入】` 的占位符内，粘贴你本地的报错日志或受影响代码文件。模型将会极其严格地按照规约执行，彻底避免幻觉和越权。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 场景二：本地 Agent 自动化对接 */}
        <section className="mt-12 border-t border-[var(--border-soft)] pt-10">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-[var(--text-main)]">
            <Cpu className="text-purple-500" size={22} />
            场景二：本地 Agent（如 Claude Code）自动化集成
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
            你可以编写一个轻量脚本，让你的 Agent 具备在出错时“自动向本站检索免疫补丁”的能力。
          </p>

          <h3 className="mt-6 text-base font-bold text-[var(--text-main)]">1. 命令行直接 curl 检索</h3>
          <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
            你可以让 Agent 在执行遇到瓶颈时，自己运行以下命令获取 SOP：
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-[var(--app-bg-soft)] p-4 text-xs font-mono text-[var(--text-main)]">
            {"curl -s \"https://your-domain.com/api/skills?q=mcp\""}
          </pre>

          <h3 className="mt-6 text-base font-bold text-[var(--text-main)]">2. 声明给 Agent 的 System Prompt</h3>
          <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
            建议将以下规约直接写进你本地 Agent 的 System Instruction，强制它在踩坑时自我检索：
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-[var(--app-bg-soft)] p-4 text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap">
{"【防错与规训指令】\n当你在执行终端命令报错（如 Permission denied, Process hanging, build failure）或需要进行多文件重构时：\n1. 优先运行 `curl -s \"https://your-domain.com/api/skills?q=<报错关键字>\"`。\n2. 读取返回的 results，并将 results 中定义的 `constraints`（约束）和 `verification`（验证方式）合并进你当前的执行策略中。\n3. 按 SOP 规范修复并验证，不得自行猜测盲目重试。"}
          </pre>
        </section>

        {/* 场景三：共建与参与 */}
        <section className="mt-12 border-t border-[var(--border-soft)] pt-10">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-[var(--text-main)]">
            <Github size={22} />
            参与共建：如何贡献你的经验？
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
            全网开发者的去隐私踩坑经验，是构成这个免疫网络的重要来源：
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[var(--app-bg-soft)] p-5">
              <h4 className="font-bold text-[var(--text-main)]">方式一：通过 GitHub 提 PR</h4>
              <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                Fork 我们的开源仓库，在 `content/debug/` 下以 Markdown 文件格式新建排坑案例。我们在 PR 合并前部署了 Gitleaks 密钥扫描，保障绝对的隐私防泄漏。
              </p>
            </div>
            <div className="rounded-xl bg-[var(--app-bg-soft)] p-5">
              <h4 className="font-bold text-[var(--text-main)]">方式二：本地批量同步</h4>
              <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                如果你有大批量的零散笔记，可将它们以 md/txt 丢进 `data/imports/`，运行 `npm run skills:update`，本地大模型与清洗脚本会自动帮你完成结构化合入。
              </p>
            </div>
          </div>
        </section>

        {/* 尾部按钮 */}
        <div className="mt-10 flex justify-center border-t border-[var(--border-soft)] pt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
          >
            返回首页查找方案
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
