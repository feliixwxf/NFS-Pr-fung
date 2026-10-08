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

test("Urapidil and Midazolam show their complete five millilitre ampoules", () => {
  assert.match(library, /name: "Urapidil \(Ebrantil\)"[^\n]+dose: "25 mg in 5 ml"[^\n]+drugMl: 5, totalMl: 5[^\n]+syringeLabel: "Urapidil · 25 mg \/ 5 ml"/);
  assert.match(library, /Eine VFA-Gabe von 10 mg entspricht 2 ml/);
  assert.match(library, /name: "Midazolam \(Dormicum\)"[^\n]+dose: "5 mg in 5 ml"[^\n]+drugMl: 5, totalMl: 5[^\n]+syringeLabel: "Midazolam · 5 mg \/ 5 ml"/);
  assert.match(library, /beim Erwachsenen mit laufendem Krampfanfall nennt der i\.v\.-Erstschritt 3 mg = 3 ml/);
});

test("every medication effect card has a VFA preparation panel", () => {
  const medicationEntries = library.match(/\{ name: "[^"]+"[^\n]+\},/g) ?? [];
  assert.ok(medicationEntries.length >= 20);
  for (const entry of medicationEntries) assert.match(entry, /preparation: \{/);
});

test("Dimetinden is one entry searchable by both documented trade names", () => {
  assert.equal((library.match(/name: "Dimetinden \(Histakut \/ Fenistil\)"/g) ?? []).length, 1);
  assert.match(library, /aliases: \["Histakut", "Fenistil"\]/);
  assert.match(library, /Andere Darreichungsformen oder Konzentrationen dürfen nicht daraus übernommen werden/);
  assert.doesNotMatch(library, /name: "Dimetinden \(Histakut\)"|name: "Dimetinden \(Fenistil\)"/);
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
