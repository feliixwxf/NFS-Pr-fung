import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [page, css] = await Promise.all([
  readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

test("oral topic availability shows only the dynamic available count", () => {
  assert.match(page, /source-badge topic-availability-stat/);
  assert.match(page, /<b>\{READY_TOPIC_NUMBERS\.size\}<\/b><span>verfügbar<\/span>/);
  assert.match(page, /aria-label=\{`\$\{READY_TOPIC_NUMBERS\.size\} verfügbar`\}/);
  assert.doesNotMatch(page, /<small><b>\{topics\.length - READY_TOPIC_NUMBERS\.size\}/);
  assert.match(css, /\.topic-availability-stat\{[\s\S]*?min-width:190px;[\s\S]*?white-space:normal;/);
});

test("the oral statistic stacks in constrained layouts instead of leaving the page grid", () => {
  assert.match(css, /@media\(max-width:900px\)\{[\s\S]*?\.topic-library-page \.section-heading\{grid-template-columns:1fr\}/);
  assert.match(css, /@media\(max-width:530px\)\{[\s\S]*?\.topic-availability-stat\{display:grid;width:100%;max-width:270px/);
});

test("processing progress is shown separately from consolidation and metadata remains readable", () => {
  assert.match(page, /progress-ring-stat[\s\S]*?progress-ring[\s\S]*?formatProgressPercent\(metrics\.completionPercent\)[\s\S]*?<span>Bearbeitungsfortschritt<\/span>/);
  assert.match(page, /Festigung: \{formatProgressPercent\(metrics\.consolidationPercent\)\}/);
  assert.match(css, /\.progress-ring-stat>span\{[^}]*font-size:13px/);
  assert.match(css, /\.profile-stat-grid span[^\n]*font-size:12px/);
});

test("MC hover, focus, selection and assessed states stay visually distinct", () => {
  assert.match(css, /\.multiple-choice-actions button:hover:not\(:disabled\):not\(\.selected\)\{border-color:#c6cecb;background:#f1f4f3;box-shadow:none\}/);
  assert.match(css, /\.multiple-choice-actions button:focus-visible\{outline:3px solid #e88b6b66;outline-offset:3px\}/);
  assert.match(css, /\.multiple-choice-actions button\.selected\{border-color:var\(--orange\);background:#fff0e9/);
  assert.match(css, /\.multiple-choice-actions button\.correct\{border-color:#168357;background:#168357/);
  assert.match(css, /\.multiple-choice-actions button\.wrong\{border-color:#b43029;background:#b43029/);
  assert.match(page, /disabled=\{!selected\.length\}>Auswahl prüfen/);
});

test("login stays compact at desktop and tablet widths and scrolls naturally on mobile", () => {
  assert.match(page, /<AccountAccess showLoginHeading=\{false\} \/>/);
  assert.match(css, /\.login-page \{ display:grid; grid-template-columns:minmax\(0,1\.02fr\) minmax\(360px,\.98fr\); min-height:100vh; min-height:100dvh; \}/);
  assert.match(css, /@media \(max-width:700px\) \{[\s\S]*?\.login-page \{ grid-template-columns:1fr; min-height:100dvh; \}[\s\S]*?\.login-brand \{ min-height:0;/);
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
