import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { concentration, convert, cumulativeDose, diluentVolume, doseByWeight, isCorrect, parseGermanNumber, remainingToMaximum, volumeAtRate, volumeForDose } from "../app/lib/medicationCalculations.ts";

test("converts compatible units and keeps I.E. separate", () => {
  assert.equal(convert(1, "mg", "µg"), 1000);
  assert.equal(convert(.15, "mg", "µg"), 150);
  assert.equal(convert(2.1, "l", "ml"), 2100);
  assert.throws(() => convert(1, "I.E.", "mg"));
});

test("applies single-dose caps independently of cumulative caps", () => {
  assert.equal(doseByWeight(80, 100, 5000), 5000);
  assert.equal(cumulativeDose([3, 1.5, 4.5]), 9);
  assert.equal(remainingToMaximum(10, 9), 1);
  assert.equal(remainingToMaximum(10, 10), 0);
  assert.equal(remainingToMaximum(10, 12), 0);
});

test("calculates concentrations, dilution, dose volumes and rates", () => {
  assert.equal(concentration(50, 10), 5);
  assert.equal(diluentVolume(10, 2), 8);
  assert.equal(volumeForDose(150, 50), 3);
  assert.equal(volumeAtRate(800, 30), 400);
});

test("accepts decimal comma, rejects invalid values and uses strict rounding tolerance", () => {
  assert.equal(parseGermanNumber("0,15"), .15);
  assert.equal(parseGermanNumber("3.2"), 3.2);
  assert.equal(parseGermanNumber("-1"), null);
  assert.equal(parseGermanNumber("3 ml"), null);
  assert.equal(isCorrect("0,15", .15, 2), true);
  assert.equal(isCorrect("0,2", .15, 2), false);
});

test("keeps all 32 reproducible reference cases and excludes ambiguous rules", async () => {
  const data = await readFile(new URL("../app/lib/medicationData.ts", import.meta.url), "utf8");
  const ids = [...data.matchAll(/\["(?:esk|morph|hep|mid|glu|ana|adr|cpr|fluid)-\d{2}"/g)];
  assert.equal(ids.length, 32);
  assert.match(data, /exakt 30 kg/);
  assert.match(data, /i\.m\. exakt 40 kg/);
  assert.match(data, /keine Interpolation/);
  assert.match(data, /MAD-Aufziehtabelle/);
  assert.match(data, /zweite Gabe.*maximal 150 mg/i);
  assert.match(data, /Gesamt-Totraum/);
});
