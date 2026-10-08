import test from "node:test";
import assert from "node:assert/strict";
import { oralTopicReferenceLabel, oralTopicReferenceLabels } from "../app/lib/oralTopicReferences.ts";

test("all 49 oral topics have an explicit reference label", () => {
  assert.deepEqual(Object.keys(oralTopicReferenceLabels).map(Number), Array.from({ length: 49 }, (_, index) => index + 1));
});

test("formerly generic VFA fallbacks match their chapter sources", () => {
  assert.equal(oralTopicReferenceLabel(17), "VFA 19 · B2A");
  assert.equal(oralTopicReferenceLabel(29), "VFA 25 · 26 · B2A · B3B");
  assert.equal(oralTopicReferenceLabel(35), "VFA L2 · 07");
  assert.equal(oralTopicReferenceLabel(37), "VFA 04 · Atemwegsmanagement");
  assert.equal(oralTopicReferenceLabel(43), "VFA 18 · 35/36/38 · indikationsabhängig");
  assert.doesNotMatch(oralTopicReferenceLabel(41), /VFA 18|VFA 35|VFA 36|VFA 38/);
});
