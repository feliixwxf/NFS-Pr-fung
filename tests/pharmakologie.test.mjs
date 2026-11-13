import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const data = readFileSync(new URL("../app/pharmakologie-data.ts", import.meta.url), "utf8");
const lesson = readFileSync(new URL("../app/pharmakologie-lesson.tsx", import.meta.url), "utf8");
const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const tutor = readFileSync(new URL("../app/free-tutor-knowledge.ts", import.meta.url), "utf8");
const exam = readFileSync(new URL("../app/written-state-exam.tsx", import.meta.url), "utf8");

test("Pharmakologie is available as a complete written learning area", () => {
  assert.match(page, /\/schriftlich\/pharmakologie/);
  assert.match(page, /PharmakologieStudyFinale/);
  assert.match(page, /pharmakologie: pharmakologieQuestions/);
  assert.match(tutor, /\["Pharmakologie", pharmakologieFlashcards\]/);
  assert.match(exam, /pharmakologieQuestions/);
});

test("Pharmakologie covers kinetics, dynamics, coagulation and neuromuscular blockade", () => {
  for (const term of ["LADME", "Therapeutische Breite", "Primäre Hämostase", "Sekundäre Hämostase", "Nichtdepolarisierend", "Depolarisierend"]) {
    assert.match(lesson, new RegExp(term, "i"));
  }
  assert.equal((data.match(/id: "pharm-card-/g) || []).length, 22);
  assert.equal((data.match(/id: "pharm-q-/g) || []).length, 24);
});

test("Muscle relaxant safety explicitly separates paralysis from anaesthesia", () => {
  assert.match(lesson, /Bewegungslos bedeutet nicht bewusstlos/);
  assert.match(lesson, /weder Bewusstlosigkeit noch Amnesie oder Analgesie/);
  assert.match(lesson, /kontrollierter Beatmung/);
});
