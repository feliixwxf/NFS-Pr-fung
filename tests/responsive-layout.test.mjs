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

test("processing progress is shown separately from consolidation and metadata remains readable", () => {
  assert.match(page, /progress-ring-stat[\s\S]*?progress-ring[\s\S]*?formatProgressPercent\(metrics\.completionPercent\)[\s\S]*?<span>Bearbeitungsfortschritt<\/span>/);
  assert.match(page, /Festigung: \{formatProgressPercent\(summary\.average\)\}/);
  assert.match(css, /\.progress-ring-stat>span\{[^}]*font-size:13px/);
  assert.match(css, /\.profile-stat-grid span[^\n]*font-size:12px/);
});

test("chapter action bar uses stateful labelled controls and local outline icons", () => {
  assert.match(page, /function ChapterActionIcon/);
  assert.match(page, /aria-hidden="true" viewBox="0 0 24 24"/);
  assert.match(page, /aria-current=\{activeChapterAction === "read"/);
  assert.match(page, /aria-pressed=\{isSpeaking\}/);
  assert.match(page, /aria-current=\{activeChapterAction === "cards"/);
  assert.match(css, /\.chapter-primary-actions button \{[^}]*min-height:44px[^}]*border:0[^}]*background:transparent/);
  assert.match(css, /\.chapter-primary-actions button\.active \{[^}]*background:#fff0e9[^}]*color:#9b4129/);
});

test("chapter action bar wraps secondary controls and becomes a two-column mobile grid", () => {
  assert.match(css, /@media \(max-width: 1050px\) \{[^}]*\.chapter-qol \{ flex-wrap:wrap;/);
  assert.match(css, /@media \(max-width: 600px\)[\s\S]*?\.chapter-primary-actions \{ display:grid; grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /\.chapter-primary-actions button[^}]*white-space:nowrap/);
  assert.match(css, /\.chapter-qol button:focus-visible \{ outline:3px solid #c95738/);
});
