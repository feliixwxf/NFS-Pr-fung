import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const dataUrl = new URL("../app/lib/medicationData.ts", import.meta.url);

test("medication trainer contains 92 sequential cases with round learning weights", async () => {
  const source = await readFile(dataUrl, "utf8");
  const ids = [...source.matchAll(/\["(?:esk|morph|hep|mid|glu|ana|adr|cpr|fluid|oxy)-(\d{2})"/g)];
  const rows = [...source.matchAll(/^\["[^"]+","[^"]+",\d+,(\d+),/gm)];

  assert.deepEqual(ids.map((match) => Number(match[1])), Array.from({ length: 92 }, (_, index) => index + 1));
  assert.equal(new Set(ids.map((match) => match[0])).size, 92);
  assert.equal(rows.length, 92);
  for (const row of rows) assert.match(row[1], /[05]$/);
});

test("oxygen practice uses only 2-litre and 10-litre cylinders", async () => {
  const source = await readFile(dataUrl, "utf8");
  const rows = source.split("\n").filter((line) => line.startsWith('["oxy-'));
  assert.equal(rows.length, 12);
  for (const row of rows) assert.match(row, /(?:2-Liter|10-Liter)-Sauerstoffflasche/);
});

