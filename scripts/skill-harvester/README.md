# Skill Harvester

This folder contains the local Skill Archive ingestion pipeline.

## Commands

- `npm run skills:harvest` searches GitHub repositories and writes `data/raw/github-skills.json`.
- `npm run skills:import` reads `data/imports/*.md`, `*.json`, and `*.txt`, then writes `data/raw/local-skills.json`.
- `npm run skills:build` merges raw files, normalizes, scores, deduplicates, and writes processed JSON.
- `npm run skills:update` runs harvest, import, and build in order.

GitHub access is optional. Set `GITHUB_TOKEN=xxx` for a higher API limit. If GitHub fetch fails, the script keeps the previous raw file and local import still works.

## Review Flow

- `data/processed/skill-candidates.json` contains candidates with `quality_score >= 3`.
- `data/processed/skills-approved.json` contains only `approved=true` records and is what the website reads.
- New harvested content defaults to `approved=false`.
- To approve one item, edit `skill-candidates.json` or a raw source file, set `approved: true`, then run `npm run skills:build`.

## Manual Skills

Add structured records to `data/raw/manual-skills.json`, or drop rough material into:

- `data/imports/*.md`
- `data/imports/*.json`
- `data/imports/*.txt`

Each approved Skill should include scenario, inputs, steps, output format, constraints, verification, and source.

## Cron Example

Run every day at 22:00:

```cron
0 22 * * * cd /Users/leo/2生成内容/8AI网站 && npm run skills:update
```
