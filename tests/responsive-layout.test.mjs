import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [page, css] = await Promise.all([
  readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

test("oral topic availability uses a dedicated two-line statistic", () => {
  assert.match(page, /source-badge topic-availability-stat/);
  assert.match(page, /<b>\{READY_TOPIC_NUMBERS\.size\}<\/b><span>verfügbar<\/span>/);
  assert.match(page, /topics\.length - READY_TOPIC_NUMBERS\.size\}<\/b> in Vorbereitung/);
  assert.match(css, /\.topic-availability-stat\{[\s\S]*?min-width:190px;[\s\S]*?white-space:normal;/);
});

test("the oral statistic stacks in constrained layouts instead of leaving the page grid", () => {
  assert.match(css, /@media\(max-width:900px\)\{[\s\S]*?\.topic-library-page \.section-heading\{grid-template-columns:1fr\}/);
  assert.match(css, /@media\(max-width:530px\)\{[\s\S]*?\.topic-availability-stat\{display:grid;width:100%;max-width:270px/);
});

test("progress label is outside the ring and important metadata remains readable", () => {
  assert.match(page, /progress-ring-stat[\s\S]*?progress-ring[\s\S]*?<b>\{summary\.average\}%<\/b>[\s\S]*?<span>Wiederholungsstand<\/span>/);
  assert.match(css, /\.progress-ring-stat>span\{[^}]*font-size:13px/);
  assert.match(css, /\.profile-stat-grid span[^\n]*font-size:12px/);
});
