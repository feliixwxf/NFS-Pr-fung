import assert from "node:assert/strict";
import test from "node:test";
import { verbrennungFlashcards, verbrennungQuestions } from "../app/verbrennung-data.ts";

test("burn chapter has distinct, multi-answer exam questions", () => {
  assert.equal(verbrennungQuestions.length, 22);
  assert.equal(new Set(verbrennungQuestions.map(question => question.id)).size, verbrennungQuestions.length);
  for (const question of verbrennungQuestions) {
    assert.equal(question.mode, "multiple");
    assert.ok(question.options.filter(option => option.correct).length >= 2, question.id);
    assert.equal(new Set(question.options.map(option => option.text)).size, question.options.length, question.id);
  }
  assert.equal(new Set(verbrennungFlashcards.map(card => card.id)).size, verbrennungFlashcards.length);
});
