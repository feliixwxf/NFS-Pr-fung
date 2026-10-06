import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [library, css] = await Promise.all([
  readFile(new URL("../app/medication-effects-library.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

test("Amiodaron shows two undiluted B2A ampoules in one syringe", () => {
  assert.match(library, /ampouleMg: 150, ampouleMl: 3, ampoules: 2, totalMg: 300, totalMl: 6/);
  assert.match(library, /1 Ampulle · \{preparation\.ampouleMg\} mg/);
  assert.match(library, /\{preparation\.ampoules\} Ampullen · \{preparation\.totalMg\} mg/);
  assert.match(library, /unverdünnt zusammen aufgezogen/);
  assert.doesNotMatch(library, /94 ml NaCl|100-ml-Kurzinfusion|Kurzinfusion · 3 mg\/ml/);
});

test("the Amiodaron preparation remains responsive without horizontal scrolling", () => {
  assert.match(css, /\.medication-amiodarone-syringe svg\{display:block;width:100%;height:auto\}/);
  assert.match(css, /@media\(max-width:520px\)[^{]*\{\.medication-amiodarone-flow\{display:grid;grid-template-columns:1fr\}/);
});
