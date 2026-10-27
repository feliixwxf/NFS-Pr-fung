import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const plan = await readFile(new URL("../app/learning-plan.tsx", import.meta.url), "utf8");
const cases = await readFile(new URL("../app/case-generator.tsx", import.meta.url), "utf8");
const tutor = await readFile(new URL("../app/ai-exam-tutor.tsx", import.meta.url), "utf8");
const barotrauma = await readFile(new URL("../app/barotrauma-lesson.tsx", import.meta.url), "utf8");
const knowledge = await readFile(new URL("../app/free-tutor-knowledge.ts", import.meta.url), "utf8");
const serviceWorker = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
const offlineSupport = await readFile(new URL("../app/offline-support.tsx", import.meta.url), "utf8");
const viewportSupport = await readFile(new URL("../app/device-viewport-support.tsx", import.meta.url), "utf8");

test("personal learning plan derives tasks from due and weak questions", () => {
  assert.match(page, /Mein Lernplan/);
  assert.match(plan, /dueQuestionIds\(progress\)/);
  assert.match(plan, /Prüfungsdatum/);
  assert.match(plan, /Zeit pro Tag/);
  assert.match(plan, /onTrain\(weak\.topic\)/);
  assert.match(plan, /localDayKey\(\)/);
  assert.match(plan, /dailyScore\(`\$\{dailySeed\}:\$\{topic\.topic\}`\)/);
  assert.match(plan, /localStorage\.setItem\(storageKey, JSON\.stringify\(settings\)\)/);
  assert.match(plan, /Der Tagesplan bleibt heute gleich und wechselt morgen/);
});

test("case generator integrates oral follow-ups into every examination mode", () => {
  assert.match(cases, /notsan-open-tutor/);
  assert.match(cases, /Komplette Prüfungssimulation/);
  assert.match(cases, /VFA-Prüfung/);
  assert.doesNotMatch(cases, /<b>Mündliche Nachfragen<\/b>/);
  assert.match(cases, /Nachfragen sind automatisch in jedem Prüfungsmodus enthalten/);
  assert.match(tutor, /window\.addEventListener\("notsan-open-tutor"/);
  assert.match(tutor, /Vorbereitungszeit: 20 Minuten/);
  assert.match(tutor, /VFA_VERSION = "Thüringer VFA 2026\/2027"/);
  assert.match(tutor, /ORAL_FOLLOW_UPS/);
  assert.match(tutor, /adaptiveFollowUp/);
  assert.match(tutor, /Die vollständige Auflösung folgt nach der gezielten Nachfrage/);
  assert.match(tutor, /examDimensions/);
  assert.match(tutor, /partial_points/);
  assert.match(tutor, /Kritische Sicherheitslücken/);
  assert.match(tutor, /knowledge\.filter\(isVfaExamEntry\)/);
  assert.match(tutor, /!entry\.id\.startsWith\("mc-"\)/);
  assert.doesNotMatch(tutor, /Kernpunkt aus dem Bereich/);
  assert.match(tutor, /Welche konkrete Kontraindikation oder Sicherheitsgrenze/);
  assert.match(tutor, /clinicalDoseValues/);
  assert.match(tutor, /Korrekt erkannt:/);
  assert.match(tutor, /point\.terms\.length <= 3/);
  assert.match(tutor, /fachliche Inhalt, nicht der Wortlaut/);
  assert.match(tutor, /keine weitergehende oder möglicherweise unpassende Angabe/);
  assert.match(tutor, /rankedChatKnowledge/);
  assert.match(tutor, /Rückfrage wegen mehrdeutiger Zuordnung/);
  assert.match(tutor, /Rückfrage wegen zu allgemeiner Formulierung/);
  assert.match(tutor, /entry\.topic\.startsWith\("Medikamentenrechnen ·"\)/);
  assert.match(tutor, /chatContextEntryId/);
  assert.match(tutor, /source\.scope === "chapter"/);
  assert.match(tutor, /nameVfaReferences/);
  assert.match(tutor, /VFA_NAME_BY_NUMBER/);
  assert.match(tutor, /Bitte wähle ein konkreteres Thema/);
  assert.doesNotMatch(tutor, />Nachfragen<\/button>/);
  assert.match(tutor, /mode === "exam" \|\| mode === "simulation" \|\| mode === "vfa"/);
  assert.match(tutor, /chooseCasePool\(input\.trim\(\) \|\| source\.title/);
  assert.match(tutor, /chooseVfaPool\(input\.trim\(\) \|\| source\.title/);
  assert.match(tutor, /VFA-geprüfter Lernbestand/);
  assert.match(tutor, /questionId: string/);
  assert.match(tutor, /sessionResults\.find\(\(entry\) => entry\.questionId === currentEntry\.id\)/);
  assert.match(tutor, /Math\.min\(5, previousResult\.score/);
  assert.match(knowledge, /ekg-strip-rbbb/);
  assert.match(knowledge, /bundle-branch-a\.svg/);
  assert.match(knowledge, /ekg-strip-lbbb/);
  assert.match(knowledge, /bundle-branch-b\.svg/);
  assert.match(cases, /Therapie und Dosierungen werden gegen die hinterlegten VFA-Inhalte geprüft/);
});

test("AI tutor remains compact and operable on iPad-sized viewports", () => {
  assert.match(styles, /grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
  assert.match(styles, /@media\(min-width:701px\) and \(max-width:1100px\)/);
  assert.match(styles, /max-height:calc\(100dvh - 24px\)/);
  assert.match(styles, /\.ai-tutor-form textarea\{min-height:82px;max-height:18dvh;font-size:16px\}/);
  assert.match(styles, /html \{ max-width:100%; overflow-x:hidden/);
});

test("barotrauma explains the complete pressure injury mechanism in teachable steps", () => {
  assert.match(barotrauma, /Pathophysiologie: Wie entsteht ein Barotrauma/);
  assert.match(barotrauma, /Beim Abtauchen: Druck von außen/);
  assert.match(barotrauma, /Beim Auftauchen: Luft dehnt sich aus/);
  assert.match(barotrauma, /In verletzte Lungenvenen/);
  assert.match(barotrauma, /Dekompressionskrankheit: ähnliches Ereignis, anderer Mechanismus/);
  assert.match(barotrauma, /So kannst du es in der mündlichen Prüfung erzählen/);
});

test("offline worker caches the app shell and visited same-origin assets", () => {
  assert.match(layout, /OfflineBootstrap/);
  assert.match(offlineSupport, /getRegistrations/);
  assert.match(serviceWorker, /CACHE_APP_SHELL/);
  assert.match(serviceWorker, /request\.mode === "navigate"/);
  assert.match(serviceWorker, /caches\.match\("\/"\)/);
  assert.match(serviceWorker, /\["script", "style", "font", "image"\]/);
});

test("iPad viewport support handles keyboard, split view, touch and standalone mode", () => {
  assert.match(layout, /DeviceViewportSupport/);
  assert.match(viewportSupport, /window\.visualViewport/);
  assert.match(viewportSupport, /keyboard-open/);
  assert.match(styles, /@media \(hover:none\) and \(pointer:coarse\)/);
  assert.match(styles, /@media \(display-mode:standalone\)/);
  assert.match(styles, /min-width:701px\) and \(max-width:900px/);
});
