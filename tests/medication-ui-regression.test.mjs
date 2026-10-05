import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../app/medication-effects-library.tsx", import.meta.url), "utf8");
const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("every medication has one stable id and explicit effect areas", () => {
  const recordBlock = source.match(/const medicationRecords:[\s\S]+?= \[([\s\S]+?)\n\];/)?.[1] ?? "";
  const assignmentBlock = source.match(/const medicationAreaAssignments:[\s\S]+?= \{([\s\S]+?)\n\};/)?.[1] ?? "";
  const medicationNames = [...recordBlock.matchAll(/\{ name: "([^"]+)"/g)].map(match => match[1]);
  const ids = [...assignmentBlock.matchAll(/id: "([^"]+)", areas: \[([^\]]+)\]/g)].map(match => ({ id: match[1], areas: match[2] }));

  assert.equal(ids.length, medicationNames.length);
  assert.equal(new Set(ids.map(item => item.id)).size, ids.length);
  assert.ok(ids.every(item => item.areas.trim().length > 0));
});

test("filtering combines text and area and grouped keys remain unique", () => {
  assert.match(source, /area === "all" \|\| item\.areas\.includes\(area\)/);
  assert.match(source, /\.includes\(query\)\)\.sort/);
  assert.match(source, /key=\{`\$\{group\.id\}-\$\{item\.id\}`\}/);
  assert.match(source, /<b>\{filtered\.length\}<\/b>/);
});

test("MC deselection immutably removes state and styling derives from that state", () => {
  assert.match(pageSource, /const chosen=selected\.includes\(index\)/);
  assert.match(pageSource, /chosen \? selected\.filter\(item=>item!==index\) : \[\.\.\.selected,index\]/);
  assert.match(pageSource, /aria-pressed=\{chosen\}/);
});
