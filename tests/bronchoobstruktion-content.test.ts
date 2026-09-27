import assert from "node:assert/strict";
import test from "node:test";
import { bronchoFlashcards, bronchoQuestions } from "../app/bronchoobstruktion-data.ts";

test("Asthma/COPD questions are distinct and require multiple decisions", () => {
  assert.ok(bronchoQuestions.length >= 18);
  assert.ok(bronchoQuestions.filter(question => /Atemgas-Tabelle/.test(question.prompt)).length >= 2);
  assert.equal(new Set(bronchoQuestions.map(question => question.id)).size, bronchoQuestions.length);
  for (const question of bronchoQuestions) {
    assert.equal(question.mode, "multiple");
    assert.ok(question.options.filter(option => option.correct).length >= 2, question.id);
    assert.ok(question.options.filter(option => !option.correct).length >= 2, question.id);
    assert.equal(new Set(question.options.map(option => option.text)).size, question.options.length, question.id);
  }
  assert.equal(new Set(bronchoFlashcards.map(card => card.id)).size, bronchoFlashcards.length);
});
