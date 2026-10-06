import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [library, css] = await Promise.all([
  readFile(new URL("../app/medication-effects-library.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

test("Amiodaron shows two undiluted B2A ampoules in one syringe", () => {
  assert.match(library, /dose: "300 mg", route: "2 Ampullen unverdünnt aufziehen", drugMl: 6, totalMl: 6/);
  assert.match(library, /Eine Ampulle enthält 3 ml mit 150 mg; zwei Ampullen ergeben 6 ml mit 300 mg/);
});

test("every medication effect card has a VFA preparation panel", () => {
  const medicationEntries = library.match(/\{ name: "[^"]+"[^\n]+\},/g) ?? [];
  assert.ok(medicationEntries.length >= 20);
  for (const entry of medicationEntries) assert.match(entry, /preparation: \{/);
});

test("all preparation panels can be expanded and collapsed", () => {
  assert.match(library, /<details className="medication-dose-prep"/);
  assert.match(library, /<summary className="medication-dose-prep-heading"/);
  assert.match(css, /\.medication-dose-prep\[open\] \.medication-dose-prep-heading>i\{transform:rotate\(180deg\)\}/);
});

test("the medication preparation remains responsive without horizontal scrolling", () => {
  assert.match(css, /\.medication-dose-syringe svg\{display:block;width:100%;height:auto\}/);
  assert.match(css, /@media\(max-width:520px\)[^{]*\{\.medication-dose-flow\{display:grid;grid-template-columns:1fr\}/);
});
