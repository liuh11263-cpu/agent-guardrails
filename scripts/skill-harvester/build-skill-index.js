#!/usr/bin/env node

// Merges raw GitHub/local/manual data, normalizes records, scores quality,
// deduplicates, and writes two review layers:
// - skill-candidates.json: quality_score >= 3
// - skills-approved.json: approved=true only, used by the frontend

const fs = require("node:fs");
const path = require("node:path");
const {
  PROCESSED_DIR,
  RAW_DIR,
  dedupeSkills,
  ensureDir,
  normalizeSkill,
  readJson,
  writeJson
} = require("./lib/skill-pipeline");

const RAW_FILES = ["github-skills.json", "manual-skills.json", "local-skills.json"];

function readRawSkills() {
  const records = [];
  for (const filename of RAW_FILES) {
    const filePath = path.join(RAW_DIR, filename);
    const sourceType = filename.split("-")[0];
    const rows = readJson(filePath, []);
    if (!Array.isArray(rows)) {
      console.warn(`[skill-harvester] ${filename} 不是数组，已跳过。`);
      continue;
    }
    records.push(
      ...rows.map((row) =>
        normalizeSkill({
          ...row,
          source_type: row.source_type || sourceType
        })
      )
    );
  }
  return records;
}

function buildSkillIndex() {
  ensureDir(PROCESSED_DIR);
  ensureDir(RAW_DIR);

  const previousApprovedPath = path.join(PROCESSED_DIR, "skills-approved.json");
  const previousApproved = readJson(previousApprovedPath, []);
  const rawSkills = readRawSkills();
  const candidates = dedupeSkills(rawSkills).filter((item) => item.quality_score >= 3);

  const approvedByKey = new Map(
    previousApproved
      .filter((item) => item.approved)
      .map((item) => [item.source_url || item.slug, normalizeSkill(item)])
  );

  for (const candidate of candidates) {
    const key = candidate.source_url || candidate.slug;
    if (approvedByKey.has(key)) continue;
    if (candidate.approved) approvedByKey.set(key, candidate);
  }

  const approved = dedupeSkills(Array.from(approvedByKey.values())).filter(
    (item) => item.approved
  );

  const candidatesPath = path.join(PROCESSED_DIR, "skill-candidates.json");
  writeJson(candidatesPath, candidates);
  writeJson(previousApprovedPath, approved);

  const summaryPath = path.join(PROCESSED_DIR, "skill-build-summary.json");
  writeJson(summaryPath, {
    generated_at: new Date().toISOString(),
    raw_count: rawSkills.length,
    candidate_count: candidates.length,
    approved_count: approved.length,
    recommended_count: candidates.filter((item) => item.recommended).length
  });

  console.log(`[skill-harvester] 候选库：${candidates.length} 条 -> ${candidatesPath}`);
  console.log(`[skill-harvester] 展示库：${approved.length} 条 -> ${previousApprovedPath}`);
  console.log("[skill-harvester] 审核方式：手动把 candidate 的 approved 改为 true 后重新 npm run skills:build。");
}

if (require.main === module) {
  buildSkillIndex();
}

module.exports = { buildSkillIndex };
