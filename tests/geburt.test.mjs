import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("Geburtskapitel zeigt Anatomie, Trimester und vollständige Geburtsmechanik", () => {
  const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
  for (const text of ["Innere Geschlechtsorgane", "Äußere Geschlechtsorgane", "1. Trimester", "2. Trimester", "3. Trimester", "geburtsmechanik-zentriert.png"]) {
    assert.ok(page.includes(text), text);
  }
  assert.ok(existsSync(new URL("../public/lessons/geburt/geburtsmechanik-zentriert.png", import.meta.url)));
});

test("zusätzliche VFA-43-Fragen prüfen Dosis, Zeit und Notfallsituationen", () => {
  const bank = readFileSync(new URL("../app/geburt-data.ts", import.meta.url), "utf8");
  const supplements = readFileSync(new URL("../app/supplemental-questions.ts", import.meta.url), "utf8");
  const ids = [...bank.matchAll(/id: "(geburt-q-\d+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, 22);
  assert.equal(new Set(ids).size, 22);
  assert.equal([...supplements.matchAll(/question\("geburt-extra-\d+"/g)].length, 3);
  for (const id of ["geburt-q-19", "geburt-q-20", "geburt-q-21", "geburt-q-22"]) {
    assert.ok(ids.includes(id), id);
  }
  assert.match(bank, /25 µg entsprechen 0,025 mg Wirkstoff", correct: true/);
  assert.match(bank, /innerhalb von 15 Minuten ist eine einmalige Wiederholung vorgesehen", correct: true/);
  assert.match(bank, /Querlage", correct: true/);
  assert.match(bank, /Nabelschnurvorfall", correct: true/);
});
