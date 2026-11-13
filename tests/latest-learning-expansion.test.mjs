import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const polytrauma = readFileSync(new URL("../app/polytrauma-lesson.tsx", import.meta.url), "utf8");
const polytraumaData = readFileSync(new URL("../app/polytrauma-data.ts", import.meta.url), "utf8");
const exam = readFileSync(new URL("../app/written-state-exam.tsx", import.meta.url), "utf8");
const highlighter = readFileSync(new URL("../app/text-highlighter.tsx", import.meta.url), "utf8");
const highlightStore = readFileSync(new URL("../app/lib/textHighlights.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const writtenSearch = readFileSync(new URL("../app/written-term-search.tsx", import.meta.url), "utf8");

test("polytrauma distinguishes immediate and delayed splenic rupture", () => {
  assert.match(polytrauma, /Einzeitige Milzruptur/);
  assert.match(polytrauma, /Zweizeitige Milzruptur/);
  assert.match(polytraumaData, /polytrauma-card-24/);
  assert.match(polytraumaData, /q\(36,/);
});

test("written exams use refreshed pools and visibly varied catalogues", () => {
  assert.match(exam, /notsan-written-exam-v2/);
  assert.match(exam, /catalogLabel/);
  assert.match(exam, /bei jedem Neustart neu gemischt/);
  assert.match(exam, /diagnostikQuestions/);
  assert.match(exam, /pharmakologieQuestions/);
});

test("personal highlighting offers yellow and red account-synced colors", () => {
  assert.match(highlighter, /addHighlight\("yellow"\)/);
  assert.match(highlighter, /addHighlight\("red"\)/);
  assert.match(highlightStore, /color\?: "yellow" \| "red"/);
  assert.match(highlightStore, /color: highlight\.color \|\| "yellow"/);
});

test("legal categories themselves follow a systematic learning order", () => {
  assert.doesNotMatch(page, /Rechtskunde in sechs sinnvollen Blöcken/);
  assert.match(page, /const legalSectionOrder/);
  assert.match(page, /"07": \{ order: 3, displayNumber: "03" \}/);
  assert.match(page, /"03": \{ order: 6, displayNumber: "06" \}/);
  assert.match(page, /"05": \{ order: 7, displayNumber: "07" \}/);
  assert.match(page, /"04": \{ order: 13, displayNumber: "13" \}/);
});

test("legal reader supports global folding and searchable jump results", () => {
  assert.match(page, /function LegalReaderTools/);
  assert.match(page, /Alles ausklappen/);
  assert.match(page, /Alles einklappen/);
  assert.match(page, /Begriff suchen, z\. B\. Deliktsfähigkeit/);
  assert.match(page, /querySelectorAll<HTMLDetailsElement>\("\.legal-section"\)/);
  assert.match(page, /scrollIntoView\(\{ behavior: "smooth", block: "center" \}\)/);
});

test("every written learning area exposes searchable jump results", () => {
  const lessonFiles = [
    "kommunikation-lesson.tsx",
    "organisation-lesson.tsx",
    "qm-lesson.tsx",
    "terminologie-lesson.tsx",
    "diagnostik-lesson.tsx",
    "hygiene-lesson.tsx",
    "pharmakologie-lesson.tsx",
  ];
  for (const file of lessonFiles) {
    const source = readFileSync(new URL(`../app/${file}`, import.meta.url), "utf8");
    assert.match(source, /<WrittenTermSearch rootRef=\{flowRef\} \/>/, file);
  }
  assert.match(writtenSearch, /Schriftlichen Lernbereich durchsuchen/);
  assert.match(writtenSearch, /:scope > details/);
  assert.match(writtenSearch, /scrollIntoView\(\{ behavior: "smooth", block: "center" \}\)/);
});
