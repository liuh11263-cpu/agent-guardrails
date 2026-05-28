# 本地内容工厂

第一版只预留目录和占位脚本，不实际调用 API。

未来流程：

```text
输入错误种子
↓
AI 生成 Debug Case
↓
AI 裁判评分
↓
人工审核
↓
导出 Markdown
↓
网站自动展示
```

## 目录说明

- `prompts/generate_debug_case.md`：根据错误种子生成 Debug Case。
- `prompts/judge_debug_case.md`：对生成内容进行准确性、可复用性、SEO 评分。
- `prompts/improve_debug_case.md`：根据裁判意见改写内容。
- `data/seeds.json`：人工收集的错误种子。
- `data/generated.json`：AI 生成结果。
- `data/judged.json`：AI 裁判结果。
- `data/approved.json`：人工审核通过结果。
- `scripts/`：未来自动化脚本占位。
