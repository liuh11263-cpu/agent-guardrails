#!/usr/bin/env node

// Reads data/imports/*.md|*.json|*.txt, extracts raw workflow records, and
// writes normalized local raw data. This script never publishes content directly.

const fs = require("node:fs");
const path = require("node:path");
const {
  IMPORTS_DIR,
  RAW_DIR,
  ensureDir,
  normalizeSkill,
  rawFromMarkdown,
  readJson,
  writeJson
} = require("./lib/skill-pipeline");

function parseTxt(content, sourceInfo) {
  return content
    .split(/\n\s*\n|---+/)
    .map((chunk, index) => chunk.trim())
    .filter(Boolean)
    .map((chunk, index) => {
      const [firstLine, ...rest] = chunk.split(/\r?\n/);
      return {
        title: firstLine.replace(/^#+\s*/, "").trim() || `TXT 导入 ${index + 1}`,
        summary: rest.find((line) => line.trim()) || firstLine,
        steps: rest
          .map((line) => line.match(/^\s*(?:[-*]|\d+[.)、])\s+(.+)$/)?.[1])
          .filter(Boolean),
        source_name: sourceInfo.source_name,
        source_url: sourceInfo.source_url,
        source_type: "local",
        imported_index: index
      };
    });
}

function recordsFromJson(value, sourceInfo) {
  const rows = Array.isArray(value) ? value : [value];
  return rows.map((row, index) => ({
    ...row,
    source_name: row.source_name || sourceInfo.source_name,
    source_url: row.source_url || `${sourceInfo.source_url}#${index + 1}`,
    source_type: row.source_type || "local"
  }));
}

function importLocalSkills() {
  ensureDir(IMPORTS_DIR);
  ensureDir(RAW_DIR);

  const files = fs
    .readdirSync(IMPORTS_DIR)
    .filter((filename) => /\.(md|json|txt)$/i.test(filename))
    .sort();
  const records = [];

  for (const filename of files) {
    const filePath = path.join(IMPORTS_DIR, filename);
    const sourceInfo = {
      source_name: filename,
      source_url: `local:data/imports/${filename}`,
      source_type: "local"
    };

    try {
      const content = fs.readFileSync(filePath, "utf8");
      if (filename.endsWith(".json")) {
        records.push(...recordsFromJson(JSON.parse(content), sourceInfo));
      } else if (filename.endsWith(".md")) {
        records.push(...rawFromMarkdown(content, sourceInfo));
      } else {
        records.push(...parseTxt(content, sourceInfo));
      }
    } catch (error) {
      console.warn(`[skill-harvester] 跳过 ${filename}：${error.message}`);
    }
  }

  const normalized = records.map((item) => normalizeSkill(item));
  const outputPath = path.join(RAW_DIR, "local-skills.json");
  writeJson(outputPath, normalized);
  console.log(
    `[skill-harvester] 本地导入完成：${normalized.length} 条 -> ${outputPath}`
  );
}

if (require.main === module) {
  importLocalSkills();
}

module.exports = { importLocalSkills };
