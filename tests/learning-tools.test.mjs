import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const plan = await readFile(new URL("../app/learning-plan.tsx", import.meta.url), "utf8");
const cases = await readFile(new URL("../app/case-generator.tsx", import.meta.url), "utf8");
const tutor = await readFile(new URL("../app/ai-exam-tutor.tsx", import.meta.url), "utf8");
const writtenExam = await readFile(new URL("../app/written-state-exam.tsx", import.meta.url), "utf8");
const barotrauma = await readFile(new URL("../app/barotrauma-lesson.tsx", import.meta.url), "utf8");
const knowledge = await readFile(new URL("../app/free-tutor-knowledge.ts", import.meta.url), "utf8");
const serviceWorker = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
const offlineSupport = await readFile(new URL("../app/offline-support.tsx", import.meta.url), "utf8");
const viewportSupport = await readFile(new URL("../app/device-viewport-support.tsx", import.meta.url), "utf8");
const textHighlighter = await readFile(new URL("../app/text-highlighter.tsx", import.meta.url), "utf8");
const textHighlightStore = await readFile(new URL("../app/lib/textHighlights.ts", import.meta.url), "utf8");
const textHighlightMigration = await readFile(new URL("../supabase/migrations/202611060001_text_highlights.sql", import.meta.url), "utf8");
const cloudProgress = await readFile(new URL("../app/lib/cloudProgress.ts", import.meta.url), "utf8");
const mcSessionMigration = await readFile(new URL("../supabase/migrations/202611110001_learning_mc_sessions.sql", import.meta.url), "utf8");

test("oral topic routes keep named and legacy links addressable", () => {
  assert.match(page, /13:\s*"hypertensiver-notfall"/);
  assert.match(page, /15:\s*"wirbelsaeulentrauma"/);
  assert.match(page, /41:\s*"eug"/);
  assert.match(page, /47:\s*"herzbeuteltamponade"/);
  assert.match(page, /"thema-14":\s*13/);
});

test("personal learning plan derives tasks from due and weak questions", () => {
  assert.match(page, /Mein Lernplan/);
  assert.match(plan, /dueQuestionIds\(progress\)/);
  assert.match(plan, /Prüfungsdatum/);
  assert.match(plan, /Zeit pro Tag/);
  assert.match(plan, /onTrain\(weak\.topic\)/);
  assert.match(plan, /localDayKey\(\)/);
  assert.match(plan, /dailyScore\(`\$\{dailySeed\}:\$\{topic\.topic\}`\)/);
  assert.match(plan, /localStorage\.setItem\(storageKey, JSON\.stringify\(settings\)\)/);
  assert.match(plan, /Der Tagesplan endet um 00:00 Uhr und wird dann automatisch neu aufgebaut/);
  assert.match(plan, /millisecondsUntilNextLocalDay/);
  assert.match(plan, /nextDay\.setHours\(24, 0, 0, 50\)/);
  assert.match(page, /notsan-mc-session-v1/);
  assert.match(page, /readMultipleChoiceSession/);
  assert.match(page, /localStorage\.setItem\(sessionStorageKey, JSON\.stringify\(session\)\)/);
  for (const writtenPath of ["rechtskunde", "organisation", "kommunikation", "qualitaetsmanagement", "terminologie", "diagnostik", "hygiene", "pharmakologie"]) {
    assert.match(page, new RegExp(`/schriftlich/${writtenPath}`));
  }
  assert.match(plan, /writtenPath/);
  assert.match(plan, /onRead\(fresh\)/);
});

test("ongoing multiple-choice rounds sync privately across signed-in devices", () => {
  assert.match(page, /loadMultipleChoiceSession/);
  assert.match(page, /saveMultipleChoiceSession/);
  assert.match(page, /updatedAt/);
  assert.match(cloudProgress, /from\("learning_mc_sessions"\)/);
  assert.match(mcSessionMigration, /primary key \(user_id, session_key\)/);
  assert.match(mcSessionMigration, /auth\.uid\(\).*user_id/);
});

test("oral lesson chunks prefetch before a chapter is opened", () => {
  assert.match(page, /oralLessonPrefetchers/);
  assert.match(page, /onPointerEnter=\{prepare\}/);
  assert.match(page, /onFocus=\{prepare\}/);
  assert.match(page, /onTouchStart=\{prepare\}/);
});

test("case generator and tutor keep follow-ups scoped to the active examination", () => {
  assert.match(cases, /notsan-open-tutor/);
  assert.match(cases, /Eine vollständige mündliche Prüfung/);
  assert.doesNotMatch(cases, /VFA-Prüfung/);
  assert.doesNotMatch(cases, /<b>Mündliche Nachfragen<\/b>/);
  assert.match(cases, /Gezielte Nachfragen gehören automatisch zur Prüfung/);
  assert.match(tutor, /window\.addEventListener\("notsan-open-tutor"/);
  assert.match(tutor, /Vorbereitungszeit: 20 Minuten/);
  assert.match(tutor, /adaptiveFollowUp/);
  assert.match(tutor, /classifyTutorFollowUp/);
  assert.match(tutor, /sameTutorTopic/);
  assert.match(tutor, /Die vollständige Auflösung folgt nach der gezielten Nachfrage/);
  assert.match(tutor, /examDimensions/);
  assert.match(tutor, /partial_points/);
  assert.match(tutor, /Kritische Sicherheitslücken/);
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
  assert.match(tutor, /mode === "exam" \|\| mode === "simulation"/);
  assert.doesNotMatch(tutor, /mode === "vfa"/);
  assert.match(tutor, /chooseCasePool\(input\.trim\(\) \|\| source\.title/);
  assert.doesNotMatch(tutor, /chooseVfaPool/);
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

test("global tutor exposes only EKG training and written exams reshuffle every attempt", () => {
  assert.match(tutor, /useState<TutorMode>\("image"\)/);
  assert.match(tutor, /className="ai-tutor-tabs single"/);
  assert.doesNotMatch(tutor, />Lernchat<\/button>/);
  assert.doesNotMatch(tutor, />Mündliche Prüfung<\/button>/);
  assert.doesNotMatch(tutor, />Prüfungssimulation<\/button>/);
  assert.match(writtenExam, /seededShuffle\(questions, `\$\{exam\.id\}-\$\{attempt\}-all-topics`\)/);
});

test("AI tutor remains compact and operable on iPad-sized viewports", () => {
  assert.match(styles, /grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
  assert.match(styles, /@media\(min-width:701px\) and \(max-width:1100px\)/);
  assert.match(styles, /max-height:calc\(100dvh - 24px\)/);
  assert.match(styles, /\.ai-tutor-form textarea\{min-height:82px;max-height:18dvh;font-size:16px\}/);
  assert.match(styles, /html \{ max-width:100%; overflow-x:hidden/);
});

test("EKG enlargement stays inside the active tutor session", () => {
  assert.match(tutor, /aria-label="EKG-Auflösung vergrößern"/);
  assert.match(tutor, /aria-label="EKG-Aufgabe vergrößern"/);
  assert.match(tutor, /setExpandedImage\(\{ src: turn\.questionImage!/);
  assert.match(tutor, /className="ai-tutor-image-lightbox"/);
  assert.match(tutor, /className="ai-tutor-image-backdrop-close"/);
  assert.match(styles, /\.ai-tutor-image-lightbox\{position:absolute;inset:0;z-index:20/);
});

test("EKG trainer does not confuse polymorphic VT with pulseless VT", () => {
  assert.match(tutor, /label: "Polymorphe ventrikuläre Tachykardie \(Torsade de pointes\)"/);
  assert.match(tutor, /acceptedTerms: \["polymorphe ventrikuläre Tachykardie", "polymorphe VT"/);
  assert.match(tutor, /Puls.*nicht aus dem EKG ablesen/);
  assert.doesNotMatch(tutor, /label: "Polymorphe ventrikuläre Tachykardie \(pVT/);
  assert.doesNotMatch(tutor, /acceptedTerms: \["pVT", "polymorphe ventrikuläre Tachykardie"/);
});

test("EKG trainer includes the three tachycardia examples from the school material", () => {
  assert.match(knowledge, /ekg-strip-sinustachykardie/);
  assert.match(knowledge, /sinustachykardie-schulfolie\.jpg/);
  assert.match(knowledge, /ekg-strip-svt/);
  assert.match(knowledge, /svt-schmalkomplex-schulfolie\.jpg/);
  assert.match(knowledge, /monomorphe-vt-schulfolie\.jpg/);
  assert.match(tutor, /label: "Sinustachykardie"/);
  assert.match(tutor, /label: "Regelmäßige supraventrikuläre Schmalkomplextachykardie \(SVT\)"/);
  assert.match(tutor, /label: "Monomorphe ventrikuläre Tachykardie \(VT\)"/);
});

test("barotrauma explains the complete pressure injury mechanism in teachable steps", () => {
  assert.match(barotrauma, /Luftgefüllte Räume/);
  assert.match(barotrauma, /Nasennebenhöhlen/);
  assert.match(barotrauma, /Äußerer Gehörgang/);
  assert.match(barotrauma, /Zähne/);
  assert.match(barotrauma, /Die drei Tauchphasen/);
  assert.match(barotrauma, /Kompressionsphase/);
  assert.match(barotrauma, /Isopressionsphase/);
  assert.match(barotrauma, /Dekompressionsphase/);
  assert.match(barotrauma, /Dekompressionskrankheit \(DCS\) \+ arterielle Gasembolie \(AGE\) = Dekompressionsunfall \(DCI\)/);
  assert.match(barotrauma, /Weg A · freie Luft/);
  assert.match(barotrauma, /Weg B · gelöstes Inertgas/);
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

test("personal text highlights persist locally and privately in the learning account", () => {
  assert.match(page, /<TextHighlighter userId=\{accountUserId\}/);
  assert.match(textHighlighter, /document\.addEventListener\("selectionchange"/);
  assert.match(textHighlighter, /CSS.*highlights|css\?\.highlights/si);
  assert.match(textHighlighter, /Markierung im Lernkonto gespeichert/);
  assert.match(textHighlighter, /Markierung entfernen/);
  assert.doesNotMatch(textHighlighter, /text-highlights-open/);
  assert.match(textHighlightStore, /learning_text_highlights/);
  assert.match(textHighlightStore, /localStorage\.setItem/);
  assert.match(textHighlightMigration, /enable row level security/);
  assert.match(textHighlightMigration, /auth\.uid\(\).*user_id/);
});

test("topic PDF export waits for images and uses break-safe A4 rules", () => {
  assert.match(page, /await Promise\.race\(\[imageReady, timeout\]\)/);
  assert.match(page, /await document\.fonts\?\.ready/);
  assert.match(styles, /@page\{size:A4 portrait;margin:0\}/);
  assert.match(styles, /box-decoration-break:clone/);
  assert.match(styles, /thead\{display:table-row-group!important\}/);
  assert.match(styles, /tr\{break-inside:avoid-page!important/);
  assert.doesNotMatch(styles, /:is\(article,aside,figure,table/);
  assert.match(styles, /\.vfa-collapsible\{break-before:page!important/);
  assert.match(styles, /\.universal-prep-print-list\{display:block!important/);
});
