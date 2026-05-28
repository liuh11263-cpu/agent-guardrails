import type { Metadata } from "next";

import { FloatingActions } from "@/components/FloatingActions";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI工程解决方案库：Prompt / Debug / Skill",
    template: "%s | AI工程 Debug 手册"
  },
  description:
    "面向 AI 应用开发者的 Prompt、Debug 和 Skill 工作流库，收录 FastAPI、RAG、Agent、Claude Code、Codex、ComfyUI 等可执行解决方案。",
  keywords: [
    "AI工程 Debug",
    "Prompt 实战库",
    "Skill 工作流",
    "Claude Code",
    "Codex",
    "RAG",
    "FastAPI",
    "ComfyUI"
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-950 font-sans antialiased">
        <Header />
        {children}
        <FloatingActions />
      </body>
    </html>
  );
}
