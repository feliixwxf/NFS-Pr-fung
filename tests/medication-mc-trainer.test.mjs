import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sourceUrl = new URL("../app/medication-effects-library.tsx", import.meta.url);

test("medication MC trainer covers the five card learning areas", async () => {
  const source = await readFile(sourceUrl, "utf8");
  for (const area of ["effect", "interactions", "sideEffects", "contraindications", "preparation"]) {
    assert.match(source, new RegExp(`value: \\"${area}\\"`));
  }
  assert.match(source, /buildMedicationMcQuestions/);
  assert.match(source, /slice\(0, Math\.min\(10, pool\.length\)\)/);
});

test("medication MC trainer gives feedback before moving to the next question", async () => {
  const source = await readFile(sourceUrl, "utf8");
  assert.match(source, /Antwort prüfen/);
  assert.match(source, /Noch nicht richtig/);
  assert.match(source, /Nächste Frage/);
});
