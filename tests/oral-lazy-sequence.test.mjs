import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const core = readFileSync(new URL("../app/core-oral-lessons.tsx", import.meta.url), "utf8");
const rhythm = readFileSync(new URL("../app/herzrhythmusstoerungen-lesson.tsx", import.meta.url), "utf8");

test("formerly embedded oral lessons are lazy-loaded from a separate bundle", () => {
  const lessons = [
    "ApoplexLesson", "AcsLesson", "ShtLesson", "LaeLesson", "ThoraxtraumaLesson",
    "AbdominaltraumaLesson", "GallensteinkolikLesson", "NierensteinkolikLesson",
    "HypoglykaemieLesson", "HyperventilationLesson", "GeburtLesson", "HodentorsionLesson",
  ];

  assert.match(page, /import\("\.\/core-oral-lessons"\)/);
  for (const lesson of lessons) {
    assert.match(page, new RegExp(`module\\.${lesson}`), lesson);
    assert.match(core, new RegExp(`export function ${lesson}\\(`), lesson);
    assert.doesNotMatch(page, new RegExp(`function ${lesson}\\(`), lesson);
  }
});

test("heart rhythm chapter follows the oral exam sequence", () => {
  const markers = [
    'section("01", "Definition',
    'section("02", "Anatomie',
    'section("03A", "Bradykardie',
    'section("03B", "Tachykardien',
    'section("04", "Symptome',
    'section("05", "Komplikationen',
    'section("06", "Einsatzmaterialien',
    'section("07", "Erstmaßnahmen',
    'section("08", "Differenzialdiagnosen',
    'section("09", "Weitere Maßnahmen und Medikamente',
    'section("10", "VFA',
  ];

  let previous = -1;
  for (const marker of markers) {
    const current = rhythm.indexOf(marker);
    assert.ok(current > previous, marker);
    previous = current;
  }
});
