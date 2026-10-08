import test from "node:test";
import assert from "node:assert/strict";
import { toggleMultipleChoiceSelection } from "../app/lib/multipleChoiceSelection.ts";

test("clicking an already selected MC answer removes it immediately", () => {
  const selected = [1, 3];
  const next = toggleMultipleChoiceSelection(selected, 1);
  assert.deepEqual(next, [3]);
  assert.deepEqual(selected, [1, 3]);
});

test("clicking an unselected MC answer adds it", () => {
  assert.deepEqual(toggleMultipleChoiceSelection([1], 2), [1, 2]);
});
