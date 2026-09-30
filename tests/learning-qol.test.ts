import test from "node:test";
import assert from "node:assert/strict";
import { buildBalancedRound, stableQuestionKey } from "../app/lib/learningQol.ts";
import { parseLearningBackup } from "../app/learning-backup.tsx";

test("compound question keys distinguish chapter-local ids", () => {
  assert.notEqual(stableQuestionKey("acs", "01"), stableQuestionKey("sht", "01"));
});

test("mixed rounds contain no duplicate compound keys and are balanced", () => {
  const banks = ["a", "b"].map(topic => ({ topic, questions: [1,2,3].map(id => ({ id: String(id) })) }));
  const round = buildBalancedRound(banks, 5, () => .5);
  assert.equal(round.length, 5);
  assert.equal(new Set(round.map(item => stableQuestionKey(item.topic, item.question.id))).size, 5);
  assert.ok(Math.abs(round.filter(item => item.topic === "a").length - round.filter(item => item.topic === "b").length) <= 1);
});

test("old backups remain valid without bookmarks", () => {
  const preview = parseLearningBackup(JSON.stringify({ schemaVersion: 1, exportedAt: new Date().toISOString(), data: { questions: {}, topics: {}, medication: {} } }));
  assert.equal(preview.questions, 0);
});
