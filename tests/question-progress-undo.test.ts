import assert from "node:assert/strict";
import test from "node:test";
import { readQuestionProgress, recordQuestionAnswer, restoreQuestionAnswer, setActiveProgressUser } from "../app/lib/questionProgress.ts";

test("an undone answer restores the exact previous learning record", () => {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  }});
  Object.defineProperty(globalThis, "window", { configurable: true, value: globalThis });
  setActiveProgressUser(null);

  const first = recordQuestionAnswer("test-question", true)["test-question"];
  recordQuestionAnswer("test-question", false);
  restoreQuestionAnswer("test-question", first);

  assert.deepEqual(readQuestionProgress()["test-question"], first);
});

test("undoing the first answer removes the newly-created record", () => {
  recordQuestionAnswer("new-question", true);
  restoreQuestionAnswer("new-question");
  assert.equal(readQuestionProgress()["new-question"], undefined);
});
