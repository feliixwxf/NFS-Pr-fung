import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [library, css] = await Promise.all([
  readFile(new URL("../app/medication-effects-library.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

test("Amiodaron shows the B2A withdrawal syringe and final short infusion", () => {
  assert.match(library, /drugMg: 300, drugMl: 6, salineMl: 94, totalMl: 100/);
  assert.match(library, /2 Ampullen Amiodaron/);
  assert.match(library, /Kurzinfusion · 3 mg\/ml/);
  assert.match(library, /keine direkte Gabe der Entnahmespritze/);
});

test("the Amiodaron preparation remains responsive without horizontal scrolling", () => {
  assert.match(css, /\.medication-amiodarone-syringe svg\{display:block;width:100%;height:auto\}/);
  assert.match(css, /@media\(max-width:520px\)[^{]*\{\.medication-amiodarone-flow\{display:grid;grid-template-columns:1fr\}/);
});
