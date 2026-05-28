#!/usr/bin/env node

// Low-frequency GitHub harvester. It searches repositories, reads README files
// and common workflow directories, then writes raw candidates for later review.
// Network failures are non-fatal so local imports can still run offline.

const path = require("node:path");
const {
  RAW_DIR,
  ensureDir,
  normalizeSkill,
  readJson,
  writeJson
} = require("./lib/skill-pipeline");

const SEARCH_KEYWORDS = [
  "claude code skills",
  "codex skills",
  "agent skills",
  "ai workflow",
  "prompt workflow",
  "mcp workflow",
  "rag workflow",
  "cursor workflow",
  "developer debug workflow",
  "wechat mini program ai workflow"
];
const INTERESTING_PATHS = [
  "skills",
  ".claude/skills",
  "commands",
  ".claude/commands",
  "workflows",
  ".github/workflows",
  "agents"
];

function headers() {
  const result = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ai-skill-archive-local-harvester",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  if (process.env.GITHUB_TOKEN) {
    result.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return result;
}

async function githubJson(url) {
  const response = await fetch(url, { headers: headers() });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function readRepoReadme(repo) {
  try {
    const data = await githubJson(
      `https://api.github.com/repos/${repo.full_name}/readme`
    );
    if (!data.content) return "";
    return Buffer.from(data.content, "base64").toString("utf8").slice(0, 12000);
  } catch (error) {
    console.warn(`[skill-harvester] README 读取失败 ${repo.full_name}: ${error.message}`);
    return "";
  }
}

async function readInterestingDirectories(repo) {
  const found = [];
  for (const directory of INTERESTING_PATHS) {
    try {
      const data = await githubJson(
        `https://api.github.com/repos/${repo.full_name}/contents/${encodeURIComponent(
          directory
        )}`
      );
      if (Array.isArray(data)) {
        found.push(
          ...data
            .filter((item) => /\.(md|txt|json|ya?ml)$/i.test(item.name || ""))
            .slice(0, 5)
            .map((item) => ({
              name: item.name,
              path: item.path,
              url: item.html_url || item.download_url || repo.html_url
            }))
        );
      }
    } catch {
      // Many repositories simply do not have these directories. Silence is intentional.
    }
  }
  return found.slice(0, 12);
}

function recordFromRepo(repo, readme, files, keyword) {
  const description = repo.description || `${repo.full_name} workflow`;
  const fileHints = files.map((file) => file.path).join(", ");
  return normalizeSkill({
    title: repo.name.replace(/[-_]/g, " "),
    summary: description,
    use_case:
      readme.match(/(?:workflow|skill|agent|prompt|debug).{0,120}/i)?.[0] ||
      `从 GitHub 仓库 ${repo.full_name} 整理 AI 工作流。`,
    inputs: ["仓库 README", "skills / commands / workflows / agents 目录", "用户任务上下文"],
    steps: [
      "阅读 README，识别仓库提供的 AI 工作流或技能类型。",
      "检查 skills、commands、workflows、agents 等目录中的结构化文件。",
      "抽取触发场景、输入材料、执行步骤、输出格式和验证方式。",
      "过滤只有标题或营销描述的内容。",
      "归档为 Prompt / Debug / Skill 候选项并保留来源链接。"
    ],
    output_format: ["候选 Skill JSON", "来源链接", "质量评分", "待人工补充字段"],
    constraints: [
      "不要收录没有步骤的万能 Prompt。",
      "不要复制无法判断来源的内容。",
      "保留 GitHub 仓库和文件链接。"
    ],
    verification: [
      "每条候选至少满足 3 条质量规则。",
      "同一 source_url 不重复入库。"
    ],
    trigger_keywords: [keyword, repo.name, repo.full_name, ...(repo.topics || [])],
    tags: [keyword, ...(repo.topics || []), ...(fileHints ? ["structured-files"] : [])].slice(0, 12),
    tooling: ["ChatGPT", "Claude Code", "Codex"],
    source_name: repo.full_name,
    source_url: repo.html_url,
    source_type: "github",
    github_stars: repo.stargazers_count,
    github_files: files,
    approved: false
  });
}

async function searchGithubSkills() {
  ensureDir(RAW_DIR);
  const outputPath = path.join(RAW_DIR, "github-skills.json");
  const previous = readJson(outputPath, []);
  const byUrl = new Map(previous.map((item) => [item.source_url, item]));
  const maxReposPerQuery = Number(process.env.SKILL_HARVEST_REPOS_PER_QUERY || 2);

  try {
    for (const keyword of SEARCH_KEYWORDS) {
      const url = new URL("https://api.github.com/search/repositories");
      url.searchParams.set("q", `${keyword} in:name,description,readme`);
      url.searchParams.set("sort", "stars");
      url.searchParams.set("order", "desc");
      url.searchParams.set("per_page", String(maxReposPerQuery));
      const data = await githubJson(url.toString());

      for (const repo of data.items || []) {
        if (byUrl.has(repo.html_url)) continue;
        const readme = await readRepoReadme(repo);
        const files = await readInterestingDirectories(repo);
        byUrl.set(repo.html_url, recordFromRepo(repo, readme, files, keyword));
      }
    }

    const merged = Array.from(byUrl.values());
    writeJson(outputPath, merged);
    console.log(`[skill-harvester] GitHub 采集完成：${merged.length} 条 -> ${outputPath}`);
  } catch (error) {
    console.warn(`[skill-harvester] GitHub 采集失败：${error.message}`);
    console.warn("[skill-harvester] 已保留现有 github-skills.json；可继续运行本地导入和 build。");
    writeJson(outputPath, previous);
  }
}

if (require.main === module) {
  searchGithubSkills();
}

module.exports = { searchGithubSkills };
