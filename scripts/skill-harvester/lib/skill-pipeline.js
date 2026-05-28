const fs = require("node:fs");
const path = require("node:path");

// Shared rules for the local Skill Archive pipeline. Keep heuristics here so
// GitHub, local imports, manual JSON, and future data sources behave alike.

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const RAW_DIR = path.join(DATA_DIR, "raw");
const IMPORTS_DIR = path.join(DATA_DIR, "imports");
const PROCESSED_DIR = path.join(DATA_DIR, "processed");

const ALLOWED_CATEGORIES = new Set(["Prompt", "Debug", "Skill"]);
const DIFFICULTIES = new Set(["beginner", "intermediate", "advanced"]);
const SKILL_DOMAINS = [
  "AI 编程",
  "Debug",
  "Agent",
  "RAG",
  "内容创作",
  "产品设计",
  "微信小程序",
  "数据与检索",
  "资料抓取"
];
const FILTERS = [
  "全部",
  "Prompt",
  "Debug",
  "Skill",
  "AI 编程",
  "Agent",
  "RAG",
  "小程序",
  "内容创作",
  "产品设计",
  "资料抓取"
];
const BLOCKED_PATTERNS = [
  /破解|绕过安全|攻击|木马|钓鱼|盗号|违法|刷量|夸张承诺|稳赚|暴富|广告位|招商/i
];

function ensureDir(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function readJson(filePath, fallback = []) {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.warn(`[skill-harvester] JSON 解析失败：${filePath}`);
    console.warn(`[skill-harvester] ${error.message}`);
    return fallback;
  }
}

function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(`${filePath}.tmp`, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(`${filePath}.tmp`, filePath);
}

function asArray(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n|；|;|\u2022|(?:^|\n)\s*[-*]\s+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function asString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function toDate(value) {
  if (typeof value === "string" && value.trim()) return value.slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

function slugify(value) {
  const source = asString(value, "skill");
  const ascii = source
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");

  if (ascii) return ascii.slice(0, 80);
  return `skill-${Buffer.from(source).toString("hex").slice(0, 16)}`;
}

function stableId(source) {
  const seed = [
    source.source_url,
    source.slug,
    source.title,
    source.source_name
  ]
    .filter(Boolean)
    .join("|");
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return `skill_${hash.toString(16).padStart(8, "0")}`;
}

function includesAny(text, patterns) {
  const haystack = text.toLowerCase();
  return patterns.some((pattern) => haystack.includes(pattern.toLowerCase()));
}

function inferDomain(source) {
  if (SKILL_DOMAINS.includes(source.domain)) {
    return source.domain;
  }

  const text = [
    source.domain,
    source.title,
    source.summary,
    source.use_case,
    source.category,
    ...(source.tags || []),
    ...(source.tooling || [])
  ]
    .filter(Boolean)
    .join(" ");

  if (/微信|小程序|云开发|订阅消息|虚拟支付|支付回调|内容安全/.test(text)) {
    return "微信小程序";
  }
  if (/抓取|GitHub|入库|采集|资料/.test(text)) {
    return "资料抓取";
  }
  if (/RAG|向量|检索|embedding|评估集|数据|分析|清洗/.test(text)) {
    return includesAny(text, ["RAG"]) ? "RAG" : "数据与检索";
  }
  if (/Agent|Function Calling|Tool Calling|MCP|多 Agent|长上下文|任务拆解/i.test(text)) {
    return "Agent";
  }
  if (/文章|视频脚本|公众号|小红书|歌词|网文|PPT|图像提示词|创作/.test(text)) {
    return "内容创作";
  }
  if (/PRD|UX|用户引导|增长|运营|商业化|产品/.test(text)) {
    return "产品设计";
  }
  if (/报错|Debug|错误|异常|超时|状态码|回调|422|500|401|403|编译错误|依赖安装|环境配置|API 调用失败/i.test(text)) {
    return "Debug";
  }
  if (/Claude Code|Codex|Cursor|代码|重构|测试|Bug|项目初始化|PR|review/i.test(text)) {
    return "AI 编程";
  }
  return asString(source.domain, "AI 编程");
}

function classifySkill(source) {
  const title = asString(source.title);
  const text = [
    source.category,
    source.domain,
    title,
    source.summary,
    source.use_case,
    source.copy_content,
    ...(source.tags || []),
    ...(source.steps || []),
    ...(source.verification || [])
  ]
    .filter(Boolean)
    .join(" ");
  const steps = asArray(source.steps);
  const inputs = asArray(source.inputs);
  const output = asArray(source.output_format);
  const verification = asArray(source.verification);
  const headline = [title, source.summary, source.use_case]
    .filter(Boolean)
    .join(" ");
  const reusableWorkflow =
    steps.length >= 3 &&
    inputs.length >= 1 &&
    (output.length >= 1 || verification.length >= 1);

  if (
    /报错|错误|异常|超时|状态码|422|500|401|403|编译错误|依赖安装|环境配置|回调|API 调用失败/i.test(headline) &&
    (steps.length > 0 || verification.length > 0)
  ) {
    return "Debug";
  }

  if (reusableWorkflow) {
    return "Skill";
  }

  if (steps.length <= 2 && verification.length === 0) {
    return "Prompt";
  }

  return "Skill";
}

function triggerKeywordsFor(source) {
  const candidates = [
    source.domain,
    source.category,
    ...(source.tags || []),
    ...(source.tooling || []),
    ...asString(source.title)
      .split(/\s|\/|,|，|：|:/)
      .filter((item) => item.length >= 2)
  ];
  return Array.from(new Set(candidates.filter(Boolean))).slice(0, 18);
}

function outputFormatFor(source) {
  const explicit = asArray(source.output_format);
  if (explicit.length) return explicit;

  if (classifySkill(source) === "Debug") {
    return ["问题判断", "关键原因", "修复步骤", "验证命令", "风险提醒"];
  }

  if (classifySkill(source) === "Prompt") {
    return ["可直接复制的最终 Prompt", "使用说明"];
  }

  return ["问题判断", "执行方案", "可复制 Prompt / 修改建议", "验证方法", "风险提醒"];
}

function constraintsFor(source) {
  const explicit = asArray(source.constraints);
  const defaults = [
    "不要编造不存在的信息。",
    "信息不足时先列出缺失项。",
    "不要大范围重构，优先给最小可行方案。"
  ];

  if (inferDomain(source) === "AI 编程" || inferDomain(source) === "Debug") {
    defaults.push("涉及代码时必须给验证命令或检查方式。");
  }

  if (source.source_url) {
    defaults.push("涉及来源时必须保留 source_url。");
  }

  return Array.from(new Set([...explicit, ...defaults]));
}

function verificationFor(source) {
  const explicit = asArray(source.verification);
  if (explicit.length) return explicit;
  if (classifySkill(source) === "Prompt") return ["输出可被一次性复制使用。"];
  if (classifySkill(source) === "Debug") return ["原始问题可复现并通过最小验证。"];
  return ["按步骤执行后能得到可检查交付物。"];
}

function generateCopyContent(skill) {
  const steps = asArray(skill.steps);
  const output = outputFormatFor(skill);
  const constraints = constraintsFor(skill);
  const verification = verificationFor(skill);

  const formatList = (items) =>
    items.length ? items.map((item, index) => `${index + 1}. ${item}`).join("\n") : "1. 按任务目标输出。";
  const bulletList = (items) =>
    items.length ? items.map((item) => `- ${item}`).join("\n") : "- 给出可执行结果。";

  return [
    `你是一个【${skill.domain}】方向的 AI 工作流执行助手。`,
    "",
    "任务：",
    `【${skill.summary}】`,
    "",
    "适用场景：",
    `【${skill.use_case}】`,
    "",
    "我的输入：",
    "【请在这里粘贴你的具体问题、报错、代码、截图描述、链接或目标】",
    "",
    "请按以下流程执行：",
    formatList(steps),
    "",
    "输出时请包含：",
    bulletList(output.length ? output : ["问题判断", "关键原因", "执行方案", "验证方法"]),
    "",
    "约束：",
    bulletList(constraints),
    "",
    "验证：",
    bulletList(verification)
  ].join("\n");
}

function scoreSkill(skill) {
  const text = [
    skill.title,
    skill.summary,
    skill.use_case,
    skill.copy_content,
    ...(skill.steps || []),
    ...(skill.constraints || []),
    ...(skill.verification || [])
  ].join(" ");

  if (BLOCKED_PATTERNS.some((pattern) => pattern.test(text))) {
    return { score: 1, reason: "包含营销、违法或安全风险内容。" };
  }

  const checks = [
    Boolean(skill.use_case),
    asArray(skill.inputs).length > 0,
    asArray(skill.steps).length >= 2,
    asArray(skill.output_format).length > 0,
    asArray(skill.verification).length > 0,
    asArray(skill.constraints).length > 0,
    Boolean(skill.source_url || skill.source_name),
    /ChatGPT|Claude|Codex|Claude Code|Cursor|MCP|AI/i.test(
      [skill.tooling, skill.copy_content, skill.summary].flat().join(" ")
    )
  ];
  const passed = checks.filter(Boolean).length;

  if (passed >= 7 && asArray(skill.steps).length >= 3) {
    return { score: 5, reason: "结构完整，包含场景、输入、步骤、输出、约束、验证和来源，可直接入库。" };
  }
  if (passed >= 5 && asArray(skill.steps).length >= 2) {
    return { score: 4, reason: "结构较完整，稍作补充即可入库。" };
  }
  if (passed >= 3) {
    return { score: 3, reason: "有价值但字段不完整，需要人工复核。" };
  }
  if (passed >= 2) {
    return { score: 2, reason: "信息不足，不建议默认展示。" };
  }
  return { score: 1, reason: "缺少场景、步骤或来源，应丢弃。" };
}

function normalizeSkill(raw, defaults = {}) {
  const source = { ...defaults, ...raw };
  const category = ALLOWED_CATEGORIES.has(source.category)
    ? source.category
    : classifySkill(source);
  const domain = inferDomain(source);
  const now = toDate(source.updated_at || defaults.updated_at);
  const normalized = {
    id: asString(source.id),
    title: asString(source.title, "未命名工作流"),
    slug: slugify(source.slug || source.title),
    category,
    domain,
    summary: asString(source.summary, asString(source.description, "待补充摘要。")),
    use_case: asString(source.use_case, asString(source.scenario, "适用于同类 AI 工程任务。")),
    trigger_keywords: asArray(source.trigger_keywords),
    inputs: asArray(source.inputs),
    steps: asArray(source.steps),
    output_format: outputFormatFor(source),
    constraints: constraintsFor(source),
    verification: verificationFor(source),
    example_prompt: asString(source.example_prompt),
    copy_content: asString(source.copy_content),
    tags: asArray(source.tags),
    difficulty: DIFFICULTIES.has(source.difficulty) ? source.difficulty : "intermediate",
    tooling: asArray(source.tooling).length
      ? asArray(source.tooling)
      : ["ChatGPT", "Claude Code", "Codex"],
    source_name: asString(source.source_name, "local"),
    source_url: asString(source.source_url, source.source_type === "local" ? `local:${source.slug || source.title}` : ""),
    source_type: asString(source.source_type, "manual"),
    quality_score: 1,
    quality_reason: "",
    approved: Boolean(source.approved),
    recommended: Boolean(source.recommended),
    created_at: toDate(source.created_at || defaults.created_at),
    updated_at: now
  };

  normalized.trigger_keywords = normalized.trigger_keywords.length
    ? normalized.trigger_keywords
    : triggerKeywordsFor(normalized);
  normalized.tags = normalized.tags.length ? normalized.tags : normalized.trigger_keywords.slice(0, 6);
  normalized.inputs = normalized.inputs.length ? normalized.inputs : ["具体问题、目标、代码、日志或上下文"];
  normalized.steps = normalized.steps.length
    ? normalized.steps
    : category === "Prompt"
    ? ["粘贴输入材料", "执行这条 Prompt", "根据输出补充信息"]
    : ["收集上下文", "定位问题或目标", "执行最小方案", "验证结果"];
  normalized.copy_content = normalized.copy_content || generateCopyContent(normalized);
  normalized.id = normalized.id || stableId(normalized);

  const score = scoreSkill(normalized);
  normalized.quality_score = Number(source.quality_score) || score.score;
  normalized.quality_reason = asString(source.quality_reason, score.reason);
  normalized.recommended = Boolean(source.recommended) || normalized.quality_score >= 4;

  return normalized;
}

function similarity(a, b) {
  const left = new Set(slugify(a).split("-").filter(Boolean));
  const right = new Set(slugify(b).split("-").filter(Boolean));
  if (!left.size || !right.size) return 0;
  const intersection = Array.from(left).filter((item) => right.has(item)).length;
  return intersection / Math.max(left.size, right.size);
}

function duplicateKey(skill) {
  if (skill.source_url && !skill.source_url.startsWith("local:")) return `url:${skill.source_url}`;
  if (skill.slug) return `slug:${skill.slug}`;
  return `title:${slugify(skill.title)}:${skill.source_name}`;
}

function chooseBetter(existing, incoming) {
  if (existing.approved && !incoming.approved) return existing;
  if (incoming.approved && !existing.approved) return incoming;
  if ((incoming.quality_score || 0) > (existing.quality_score || 0)) return incoming;
  return existing;
}

function dedupeSkills(skills) {
  const result = [];
  const byKey = new Map();

  for (const skill of skills) {
    const key = duplicateKey(skill);
    const existingIndex = byKey.get(key);
    if (existingIndex !== undefined) {
      result[existingIndex] = chooseBetter(result[existingIndex], skill);
      continue;
    }

    const similarIndex = result.findIndex(
      (item) =>
        item.source_name === skill.source_name &&
        similarity(item.title, skill.title) >= 0.75
    );
    if (similarIndex >= 0) {
      result[similarIndex] = chooseBetter(result[similarIndex], skill);
      byKey.set(key, similarIndex);
      continue;
    }

    byKey.set(key, result.length);
    result.push(skill);
  }

  return result.sort((a, b) => {
    if (b.quality_score !== a.quality_score) return b.quality_score - a.quality_score;
    return a.title.localeCompare(b.title);
  });
}

function splitMarkdownByHeading(markdown) {
  const chunks = [];
  const lines = markdown.split(/\r?\n/);
  let current = null;

  for (const line of lines) {
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      if (current) chunks.push(current);
      current = { title: heading[2].trim(), content: "" };
      continue;
    }
    if (current) current.content += `${line}\n`;
  }

  if (current) chunks.push(current);
  return chunks.length ? chunks : [{ title: "本地导入内容", content: markdown }];
}

function extractListAfter(content, labels) {
  const lines = content.split(/\r?\n/);
  const result = [];
  let active = false;
  const labelPattern =
    /^\s*(适用场景|场景|Use case|输入材料|输入|前置条件|Inputs|执行步骤|步骤|流程|Workflow|Steps|输出格式|输出|Output|约束|禁止|Constraints|验证|验收|Verification)[:：]?\s*$/i;

  for (const line of lines) {
    if (labels.some((label) => line.includes(label))) {
      active = true;
      continue;
    }
    if (active && (/^#{1,4}\s+/.test(line) || labelPattern.test(line))) break;
    if (active) {
      const item = line.match(/^\s*(?:[-*]|\d+[.)、])\s+(.+)$/);
      if (item) result.push(item[1].trim());
      else if (line.trim() && result.length && !/：|:/.test(line)) result.push(line.trim());
    }
  }
  return result.slice(0, 12);
}

function rawFromMarkdown(markdown, sourceInfo = {}) {
  return splitMarkdownByHeading(markdown).map((chunk, index) => {
    const body = chunk.content.trim();
    const useCase =
      extractListAfter(body, ["适用场景", "场景", "Use case"])[0] ||
      (body.match(/适用场景[:：]\s*(.+)/)?.[1] ?? "");
    const firstMeaningfulLine =
      body
        .split(/\r?\n/)
        .find(
          (line) =>
            line.trim() &&
            !line.trim().startsWith("-") &&
            !/^(适用场景|输入材料|执行步骤|输出格式|约束|验证)[:：]?\s*$/.test(
              line.trim()
            )
        )
        ?.trim() || chunk.title;
    return {
      title: chunk.title,
      summary: useCase || firstMeaningfulLine,
      use_case: useCase,
      inputs: extractListAfter(body, ["输入材料", "输入", "前置条件", "Inputs"]),
      steps: extractListAfter(body, ["执行步骤", "步骤", "流程", "Workflow", "Steps"]),
      output_format: extractListAfter(body, ["输出格式", "输出", "Output"]),
      constraints: extractListAfter(body, ["约束", "禁止", "Constraints"]),
      verification: extractListAfter(body, ["验证", "验收", "Verification"]),
      example_prompt: body.match(/```[\w-]*\n([\s\S]*?)```/)?.[1]?.trim() || "",
      copy_content: body.match(/```[\w-]*\n([\s\S]*?)```/)?.[1]?.trim() || "",
      source_name: sourceInfo.source_name,
      source_url: sourceInfo.source_url,
      source_type: sourceInfo.source_type || "local",
      created_at: sourceInfo.created_at,
      updated_at: sourceInfo.updated_at,
      imported_index: index
    };
  });
}

module.exports = {
  BLOCKED_PATTERNS,
  DATA_DIR,
  FILTERS,
  IMPORTS_DIR,
  PROCESSED_DIR,
  RAW_DIR,
  SKILL_DOMAINS,
  asArray,
  classifySkill,
  dedupeSkills,
  ensureDir,
  generateCopyContent,
  normalizeSkill,
  rawFromMarkdown,
  readJson,
  scoreSkill,
  slugify,
  writeJson
};
