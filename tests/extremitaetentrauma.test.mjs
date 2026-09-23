import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { extremitaetentraumaFlashcards, extremitaetentraumaQuestions } from "../app/extremitaetentrauma-data.ts";

test("Extremitätentrauma has a distinct 21-question multiple-choice bank", () => {
  assert.equal(extremitaetentraumaQuestions.length, 21);
  assert.equal(new Set(extremitaetentraumaQuestions.map((item) => item.id)).size, 21);
  for (const item of extremitaetentraumaQuestions) {
    assert.equal(item.mode, "multiple");
    assert.ok(item.options.filter((option) => option.correct).length >= 2, item.id);
    assert.ok(item.options.filter((option) => !option.correct).length >= 2, item.id);
    assert.equal(new Set(item.options.map((option) => option.text.toLowerCase())).size, item.options.length, item.id);
    assert.ok(item.source.length > 25, item.id);
  }
  assert.equal(extremitaetentraumaFlashcards.length, 13);
});

test("original anatomy images and reused Thüringer VFA assets exist", () => {
  for (const file of ["im1.jpg", "im2.jpg", "im3.jpg", "im4.jpg", "im5.jpg"]) {
    assert.ok(existsSync(new URL(`../public/lessons/extremitaetentrauma/${file}`, import.meta.url)), file);
  }
  for (const file of ["im1-sharp.png", "im2-sharp.png", "im3-sharp.png", "im4-sharp.png", "im5-sharp.png"]) {
    assert.ok(existsSync(new URL(`../public/lessons/extremitaetentrauma/${file}`, import.meta.url)), file);
  }
  for (const file of ["../public/lessons/sht/vfa-schmerz-basis-35.png", "../public/lessons/sht/vfa-morphin-38.png", "../public/lessons/sht/vfa-esketamin-36.png", "../public/lessons/wirbelsaeulentrauma/anlage-b2a-esketamin.png", "../public/lessons/wirbelsaeulentrauma/anlage-b2b-morphin.png", "../public/lessons/wirbelsaeulentrauma/anlage-b2b-esketamin.png"]) {
    assert.ok(existsSync(new URL(file, import.meta.url)), file);
  }
});

test("lesson explains at least six distinct fracture patterns", () => {
  const lesson = readFileSync(new URL("../app/extremitaetentrauma-lesson.tsx", import.meta.url), "utf8");
  for (const pattern of ["Grünholzfraktur", "Wulstfraktur", "Querfraktur", "Schrägfraktur", "Spiralfraktur", "Trümmerfraktur"]) {
    assert.ok(lesson.includes(pattern), pattern);
  }
});

test("anatomy and first measures stay clearly structured", () => {
  const lesson = readFileSync(new URL("../app/extremitaetentrauma-lesson.tsx", import.meta.url), "utf8");
  assert.match(lesson, /Passiver Bewegungsapparat/);
  assert.match(lesson, /Aktiver Bewegungsapparat/);
  assert.match(lesson, /Skelettmuskulatur/);
  assert.match(lesson, /Sehnen übertragen ihre Kraft/);
  assert.equal((lesson.match(/className="extremity-action-grid"/g) ?? []).length, 1);
  assert.equal((lesson.match(/className="samplers-grid extremity-samplers"/g) ?? []).length, 1);
});
