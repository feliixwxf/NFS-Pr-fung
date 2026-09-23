import assert from "node:assert/strict";
import test from "node:test";
import { supplementalQuestions } from "../app/supplemental-questions.ts";

test("every prepared chapter receives three distinct, difficult multiple-choice questions", () => {
  const banks = Object.values(supplementalQuestions);
  assert.equal(banks.length, 14);
  assert.equal(banks.reduce((sum, bank) => sum + bank.length, 0), 42);

  const ids = new Set<string>();
  let longestCorrect = 0;
  for (const bank of banks) {
    assert.equal(bank.length, 3);
    for (const question of bank) {
      assert.ok(!ids.has(question.id), `duplicate id: ${question.id}`);
      ids.add(question.id);
      assert.equal(question.mode, "multiple");
      assert.equal(question.difficulty, 3);
      assert.equal(question.options.length, 5);
      const correct = question.options.filter((option) => option.correct);
      assert.ok(correct.length >= 2 && correct.length <= 3, question.id);
      assert.equal(new Set(question.options.map((option) => option.text)).size, 5, question.id);
      assert.ok(question.source.length > 30, question.id);
      const longest = question.options.reduce((best, option) => option.text.length > best.text.length ? option : best);
      if (longest.correct) longestCorrect += 1;
    }
  }
  assert.ok(longestCorrect < ids.size * 0.7, "the longest option should not usually be correct");
});
