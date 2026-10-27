import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const plan = await readFile(new URL("../app/learning-plan.tsx", import.meta.url), "utf8");
const cases = await readFile(new URL("../app/case-generator.tsx", import.meta.url), "utf8");
const tutor = await readFile(new URL("../app/ai-exam-tutor.tsx", import.meta.url), "utf8");
const knowledge = await readFile(new URL("../app/free-tutor-knowledge.ts", import.meta.url), "utf8");
const serviceWorker = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");

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

test("offline worker caches the app shell and visited same-origin assets", () => {
  assert.match(page, /OfflineBootstrap/);
  assert.match(serviceWorker, /CACHE_APP_SHELL/);
  assert.match(serviceWorker, /request\.mode === "navigate"/);
  assert.match(serviceWorker, /caches\.match\("\/"\)/);
  assert.match(serviceWorker, /\["script", "style", "font", "image"\]/);
});
