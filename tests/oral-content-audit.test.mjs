import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const appDirectory = new URL("../app/", import.meta.url);
const appFiles = await readdir(appDirectory);
const oralLessonFiles = appFiles.filter((name) => name.endsWith("-lesson.tsx"));
const oralSources = await Promise.all(
  ["page.tsx", ...oralLessonFiles].map(async (name) => ({
    name,
    source: await readFile(new URL(name, appDirectory), "utf8"),
  })),
);

test("oral lessons do not expose drafting-source labels", () => {
  for (const { name, source } of oralSources) {
    assert.doesNotMatch(source, /Notfallguru|RD[- ]?Factsheet/i, name);
  }
});

test("the Prehn sign is described without reversing its traditional meaning", () => {
  const page = oralSources.find(({ name }) => name === "page.tsx")?.source ?? "";
  assert.match(page, /Schmerzabnahme beim Anheben wird traditionell als „positiv“ bezeichnet/);
  assert.doesNotMatch(page, /Schmerzverstärkung beim vorsichtigen Anheben kann als positives Prehn-Zeichen/);
  assert.match(page, /nicht zuverlässig genug, um eine Hodentorsion auszuschließen/);
});

test("the shared oral layout contains overflow and media safeguards", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.topic-reader,\.lesson-article,\.lesson-section,\.lesson-prose\{min-width:0\}/);
  assert.match(css, /\.lesson-prose :is\(img,svg,video,canvas\)\{max-width:100%;height:auto\}/);
  assert.match(css, /\.lesson-source\{overflow-wrap:anywhere\}/);
});
