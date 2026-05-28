#!/usr/bin/env node

const { buildSkillIndex } = require("./build-skill-index");

console.log("[skill-harvester] normalize-skills 已合并到 build-skill-index，开始构建。");
buildSkillIndex();
