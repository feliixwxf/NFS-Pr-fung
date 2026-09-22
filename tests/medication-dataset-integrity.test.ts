import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const dataUrl = new URL("../app/lib/medicationData.ts", import.meta.url);

test("medication dataset keeps unique, sequential case numbers after merges", async () => {
  const source = await readFile(dataUrl, "utf8");
  const matches = [...source.matchAll(/\["(?:esk|morph|hep|mid|glu|ana|adr|cpr|fluid)-(\d{2})"/g)];
  const numbers = matches.map((match) => Number(match[1]));

  assert.equal(numbers.length, 66);
  assert.deepEqual(numbers, Array.from({ length: 66 }, (_, index) => index + 1));
  assert.equal(new Set(matches.map((match) => match[0])).size, 66);
});

test("every rule family remains represented after a merge", async () => {
  const source = await readFile(dataUrl, "utf8");
  for (const prefix of ["esk", "morph", "hep", "mid", "glu", "ana", "adr", "cpr", "fluid"]) {
    assert.match(source, new RegExp(`\\["${prefix}-\\d{2}"`));
  }
});

test("safety boundaries and source exclusions remain present", async () => {
  const source = await readFile(dataUrl, "utf8");
  for (const requiredText of [
    "exakt 30 kg",
    "i.m. exakt 40 kg",
    "keine Interpolation",
    "MAD-Aufziehtabelle",
    "Gesamt-Totraum",
    "maximal 150 mg",
    "maximal 300 mg",
  ]) assert.match(source, new RegExp(requiredText));
});
