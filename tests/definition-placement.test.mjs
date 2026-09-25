import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");

test("every oral reading chapter puts its definition in section 01", () => {
  const definitions = [
    ["Apoplex", "Ein Schlaganfall ist"],
    ["Acs", "Das akute Koronarsyndrom ist"],
    ["Sht", "Ein Schädel-Hirn-Trauma ist"],
    ["Lae", "Unter einer Lungenarterienembolie versteht man"],
    ["Thoraxtrauma", "Ein Thoraxtrauma entsteht"],
    ["Abdominaltrauma", "Ein Abdominaltrauma ist"],
    ["Gallensteinkolik", "Eine Gallensteinkolik ist"],
    ["Nierensteinkolik", "Eine Nierensteinkolik ist"],
    ["Hypoglykaemie", "Eine Hypoglykämie ist"],
    ["Hyperventilation", "Hyperventilation ist"],
    ["Geburt", "Eine Geburt umfasst"],
    ["Hodentorsion", "Die Hodentorsion ist"],
  ];

  for (const [name, phrase] of definitions) {
    const start = page.indexOf(`function ${name}Lesson(`);
    assert.ok(start >= 0, name);
    const next = page.indexOf("\nfunction ", start + 1);
    const chapter = page.slice(start, next < 0 ? undefined : next);
    const first = chapter.indexOf('ChapterHeading number="01"');
    const second = chapter.indexOf('ChapterHeading number="02"');
    assert.ok(first >= 0 && second > first, name);
    assert.ok(chapter.slice(first, second).includes(phrase), `${name}: definition missing from section 01`);
    assert.ok(!chapter.slice(0, first).includes(phrase), `${name}: definition still above section 01`);
  }

  for (const [filename, phrase] of [
    ["wirbelsaeulentrauma-lesson.tsx", "Verletzung der Wirbelsäule"],
    ["extremitaetentrauma-lesson.tsx", "Die Fraktur ist"],
  ]) {
    const chapter = readFileSync(new URL(`../app/${filename}`, import.meta.url), "utf8");
    const first = chapter.indexOf('section("01"');
    const second = chapter.indexOf('section("02"');
    assert.ok(first >= 0 && second > first, filename);
    assert.ok(chapter.slice(first, second).includes(phrase), filename);
    assert.ok(!chapter.slice(0, first).includes(phrase), filename);
  }
});
