import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const diagnostik = readFileSync(new URL("../app/diagnostik-lesson.tsx", import.meta.url), "utf8");
const diagnostikData = readFileSync(new URL("../app/diagnostik-data.ts", import.meta.url), "utf8");
const kramp = readFileSync(new URL("../app/krampfanfall-kind-lesson.tsx", import.meta.url), "utf8");
const krampData = readFileSync(new URL("../app/krampfanfall-kind-data.ts", import.meta.url), "utf8");
const anaphylaxie = readFileSync(new URL("../app/anaphylaxie-lesson.tsx", import.meta.url), "utf8");
const anaphylaxieData = readFileSync(new URL("../app/anaphylaxie-data.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");

test("written diagnostics contains the school-based paediatric learning section", () => {
  assert.match(diagnostik, /number="26" kicker="Pädiatrie"/);
  for (const term of ["Neugeborenes", "Säugling", "Kleinkind", "Schulkind", "Jugendlicher", "AF\/min", "AZV", "HF\/min"]) assert.match(diagnostik, new RegExp(term));
  assert.match(diagnostik, /Bradykardie beim akut kranken Kind ist kritisch/);
  assert.match(diagnostik, /Vier-Augen-Kontrolle/);
  assert.match(diagnostik, /Fünf Initialbeatmungen sofort/);
  assert.match(diagnostik, /Hohe Knochenelastizität/);
  assert.match(diagnostik, /Handrücken/);
  assert.match(diagnostikData, /diagnostik-card-74/);
  assert.match(diagnostikData, /diagnostik-q-83/);
  assert.match(diagnostik, /APGAR-Score/);
  assert.match(diagnostik, /Aussehen \/ Hautfarbe/);
  assert.match(diagnostik, /Allergien und bekannte Unverträglichkeiten/);
  assert.match(diagnostikData, /diagnostik-card-81/);
  assert.match(diagnostikData, /diagnostik-q-92/);
  assert.match(page, /Pädiatrie-Prüfungsblock/);
  assert.match(page, /setMode\("paediatrics"\)/);
});

test("oral paediatric topics include decompensation and medication safety", () => {
  assert.match(kramp, /Bradykardie ist beim akut kranken Kind ein spätes Warnzeichen/);
  assert.match(kramp, /Weiterleitung im Axon/);
  assert.match(kramp, /Calcium-Einstrom/);
  assert.match(kramp, /frei zugängliche Familienmedikamente/);
  assert.match(krampData, /krampfanfall-kind-card-17/);
  assert.match(krampData, /q\(26, "Ein Kind wird nach einem Anfall hypoxisch/);
  assert.match(anaphylaxie, /Pädiatrische Medikamentensicherheit/);
  assert.match(anaphylaxieData, /anaphylaxie-card-20/);
  assert.match(anaphylaxieData, /q\(27, "Welche Schritte erhöhen bei einem Kind mit Anaphylaxie/);
});

test("epiglottitis avoids provocative mouth and throat manipulation", () => {
  const lesson = readFileSync(new URL("../app/pseudokrupp-epiglottitis-lesson.tsx", import.meta.url), "utf8");
  assert.match(lesson, /Keine Spatelinspektion/);
  assert.match(lesson, /Laryngospasmus/);
  assert.match(lesson, /Blutung oder zusätzliche Schleimhautschwellung/);
});
