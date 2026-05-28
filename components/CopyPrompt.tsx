"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CopyButtonProps = {
  text: string;
  label?: string;
};

export function CopyPromptButton({ text, label = "复制" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-blue-400/30 bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300/60"
      aria-label={copied ? "已复制 Prompt" : label}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? "已复制" : label}
    </button>
  );
}

type CopyPromptBlockProps = {
  prompt: string;
  title?: string;
};

export function CopyPromptBlock({
  prompt,
  title = "可复制 Prompt"
}: CopyPromptBlockProps) {
  return (
    <section className="rounded-2xl border border-blue-400/30 bg-[#0d1b2e] p-4 shadow-lg shadow-blue-950/20">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">
            粘贴给 Claude Code、Codex 或其他代码 Agent，用来快速定位工程问题。
          </p>
        </div>
        <CopyPromptButton text={prompt} label="复制 Prompt" />
      </div>
      <pre className="max-h-[420px] overflow-auto rounded-md border border-slate-700 bg-slate-950 p-4 text-sm leading-6 text-slate-100">
        <code>{prompt}</code>
      </pre>
    </section>
  );
}
