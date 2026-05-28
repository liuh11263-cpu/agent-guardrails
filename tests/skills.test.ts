import test from "node:test";
import assert from "node:assert/strict";

import { getSkillItems } from "../lib/content";

test("getSkillItems reads reusable workflow cards from markdown", () => {
  const skills = getSkillItems();
  const skill = skills.find((item) => item.slug === "claude-code-feature-loop");

  assert.ok(skill);
  assert.equal(skill.category, "Skill");
  assert.equal(skill.approved, true);
  assert.equal(skill.copy_content.includes("【请在这里粘贴你的具体问题"), true);
  assert.equal(skill.steps.length >= 4, true);
  assert.equal(skill.verification.length >= 1, true);
});
