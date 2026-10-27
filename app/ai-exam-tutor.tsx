"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { freeTutorKnowledge, type FreeTutorKnowledge, type TutorQuestionImage } from "./free-tutor-knowledge";
import { vfaLibrary, type VfaReference } from "./vfa-library";
import { saveLocalTutorWeaknesses, syncTutorWeaknesses, updateTutorWeakness } from "./lib/tutorWeaknessProgress";

type TutorMode = "exam" | "simulation" | "vfa" | "image" | "question";
type TutorScope = "chapter" | "site";
type TutorDimension = { label: string; score: number; note: string };
type TutorResult = { evaluation: string; strengths: string[]; partial_points?: string[]; missing_points: string[]; score: number; source_basis: string; source_href?: string; dimensions?: TutorDimension[] };
type SessionResult = { questionId: string; score: number; topic: string; area: string; missing: string[]; safetyRelevant: boolean };
type AdaptiveFollowUp = { entry: FreeTutorKnowledge; prompt: string };
type EkgLeadHighlight = { tone: "elevation" | "depression" | "reciprocal" | "context"; leads: string; explanation: string };
type EkgSolution = { image: TutorQuestionImage; label: string; highlights: readonly EkgLeadHighlight[] };
type TutorTurn = { role: "user" | "assistant"; text: string; kind?: "ekg-question" | "ekg-solution" | "case-question" | "oral-follow-up" | "exam-summary"; result?: TutorResult; vfaImages?: readonly VfaReference[]; questionImage?: TutorQuestionImage; ekgSolution?: EkgSolution };
type LearningSource = { title: string; material: string; scope: TutorScope; href: string };
type SpeechRecognitionEventLike = { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> };
type SpeechRecognitionLike = { lang: string; continuous: boolean; interimResults: boolean; onresult: ((event: SpeechRecognitionEventLike) => void) | null; onend: (() => void) | null; onerror: (() => void) | null; start: () => void; stop: () => void };
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const STOP_WORDS = new Set([
  "aber", "alle", "als", "also", "auch", "auf", "aus", "bei", "bitte", "das", "dass", "dem", "den", "der", "des", "die", "ein", "eine", "einer", "eines", "erklaere", "fur", "gibt", "haben", "ist", "kurz", "man", "mehr", "mir", "mit", "nach", "nenne", "oder", "sind", "uber", "und", "von", "warum", "was", "welche", "welcher", "wie", "wird", "zum", "zur",
]);

const ALIASES: Record<string, string> = {
  "cushing triade": "cushing trias",
  herzinfarkt: "myokardinfarkt",
  lae: "lungenarterienembolie",
  acs: "akutes koronarsyndrom",
  sht: "schaedelhirntrauma",
  reani: "reanimation",
  novalgin: "metamizol",
  buscopan: "butylscopolamin",
  adrenalin: "epinephrin",
  blutdruck: "rr",
  blutzucker: "bz",
  herzfrequenz: "hf",
  kontraindikation: "ki",
  kontraindikationen: "ki",
  nebenwirkung: "nw",
  nebenwirkungen: "nw",
};

const CONCEPT_SYNONYMS = [
  ["epinephrin", "adrenalin"], ["metamizol", "novalgin"], ["butylscopolamin", "buscopan"],
  ["arterieller mitteldruck", "map", "mittlerer arterieller druck"], ["blutdruck", "rr"], ["herzfrequenz", "hf", "puls"],
  ["blutzucker", "bz", "glukose"], ["sauerstoffsaettigung", "spo2", "saettigung"], ["kapnometrie", "etco2", "endtidales co2"],
  ["bewusstlos", "nicht ansprechbar", "bewusstsein eingetruebt"], ["atemnot", "dyspnoe"], ["schnelle atmung", "tachypnoe"],
  ["langsamer puls", "bradykardie"], ["schneller puls", "tachykardie"], ["niedriger blutdruck", "hypotonie", "rr abfall"],
  ["blutgerinnsel", "thrombus"], ["gefaessverschluss", "okklusion"], ["herzinfarkt", "myokardinfarkt"],
  ["lungenarterienembolie", "lae", "lungenembolie"], ["schaedelhirntrauma", "sht"], ["reanimation", "cpr", "herz lungen wiederbelebung"],
  ["kontraindikation", "ki", "gegenanzeige"], ["nebenwirkung", "nw", "unerwuenschte wirkung"], ["intravenoes", "iv", "i.v."],
  ["blutung", "blutet", "blutverlust", "haemorrhagie"], ["bewusstseinsstoerung", "bewusstsein eingetruebt", "somnolent", "sopor", "komatoes"],
  ["atemdepression", "atemfrequenz vermindert", "atmet langsam", "bradypnoe"], ["vasokonstriktion", "gefaessverengung"], ["vasodilatation", "gefaesserweiterung"],
  ["analgesie", "schmerzlinderung", "schmerztherapie"], ["antipyretisch", "fiebersenkend"], ["spasmolytisch", "krampfloesend"],
  ["thrombozytenaggregation", "plaettchenaggregation", "blutplaettchen verklumpen"], ["bronchodilatation", "bronchienerweiterung"],
  ["vorlast", "preload"], ["nachlast", "afterload"], ["verfahrensanweisung", "vfa"],
  ["hochkonzentrierter sauerstoff", "100 prozent sauerstoff", "maximale sauerstoffkonzentration", "o2 hochdosiert"],
  ["arterielle gasembolie", "age", "gasembolie"], ["dekompressionskrankheit", "dcs", "dekompressionsunfall"],
  ["spannungspneumothorax", "spannungspneu"], ["bewusstseinskontrolle", "gcs", "vigilanzkontrolle"],
  ["intramuskulaer", "im", "i.m."], ["intraossaer", "io", "i.o."], ["sublingual", "sl", "s.l."],
];

function normalize(value: string) {
  let normalized = value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/ß/g, "ss").toLocaleLowerCase("de").replace(/[^a-z0-9+./ -]/g, " ").replace(/\s+/g, " ").trim();
  for (const [alias, replacement] of Object.entries(ALIASES)) normalized = normalized.replaceAll(alias, replacement);
  return normalized;
}

function tokens(value: string) {
  return [...new Set(normalize(value).split(" ").filter((word) => word.length >= 3 && !STOP_WORDS.has(word)))];
}

function editDistanceAtMostOne(left: string, right: string) {
  if (left === right) return true;
  if (Math.abs(left.length - right.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) { i += 1; j += 1; continue; }
    edits += 1;
    if (edits > 1) return false;
    if (left.length > right.length) i += 1;
    else if (right.length > left.length) j += 1;
    else { i += 1; j += 1; }
  }
  return edits + Number(i < left.length || j < right.length) <= 1;
}

function containsToken(text: string, token: string) {
  return normalize(text).split(" ").some((word) => word === token || word.startsWith(`${token}-`) || token.length >= 6 && word.length >= 6 && editDistanceAtMostOne(word, token));
}

function editDistanceAtMostTwo(left: string, right: string) {
  if (Math.abs(left.length - right.length) > 2) return false;
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      current[column] = Math.min(
        current[column - 1] + 1,
        previous[column] + 1,
        previous[column - 1] + Number(left[row - 1] !== right[column - 1])
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length] <= 2;
}

function scoreEntry(entry: FreeTutorKnowledge, query: string) {
  const queryTokens = tokens(query);
  if (!queryTokens.length) return 0;
  const question = normalize(entry.question);
  const metadata = normalize(`${entry.topic} ${entry.area}`);
  const answer = normalize(entry.answer);
  let score = 0;
  for (const token of queryTokens) {
    if (containsToken(question, token)) score += 12;
    if (containsToken(metadata, token)) score += 7;
    if (containsToken(answer, token)) score += 2;
  }
  const matched = queryTokens.filter((token) => containsToken(`${question} ${metadata} ${answer}`, token)).length;
  return score + Math.round(matched / queryTokens.length * 20);
}

function rankedKnowledge(query: string, knowledge: readonly FreeTutorKnowledge[]) {
  return knowledge.map((entry) => ({ entry, score: scoreEntry(entry, query) })).filter((match) => match.score > 0).sort((a, b) => b.score - a.score);
}

function isVfaRequest(query: string) {
  const value = normalize(query);
  return /\b(vfa|verfahrensanweisung|verfahrensanweisungen)\b/.test(value) && /\b(zeig|zeige|zeigen|offne|bild|abbildung|original|vfa|verfahrensanweisung)\b/.test(value);
}

function isEkgChallengeRequest(query: string) {
  const value = normalize(query);
  return /\b(ekg|rhythmusstreifen|herzrhythmus|av block|schenkelblock|rechtsschenkelblock|linksschenkelblock|rsb|lsb|rbbb|lbbb|asystolie|pea|pvt|ventrikulare tachykardie|kammerflimmern|stemi|nstemi|vorderwandinfarkt|hinterwandinfarkt|inferiorwandinfarkt|posteriorer infarkt)\b/.test(value)
    && /\b(bild|streifen|interpret|ueb|train|zeig|frage|beispiel)\w*\b/.test(value);
}

function isEkgChallengeEntry(entry: FreeTutorKnowledge) {
  return Boolean(entry.image && (entry.id === "image-vorhofflimmern" || entry.id.startsWith("ekg-strip-")));
}

type EkgFindingSpec = {
  label: string;
  exact: RegExp[];
  partial?: RegExp[];
  acceptedTerms?: readonly string[];
  highlights?: readonly EkgLeadHighlight[];
};

const EKG_FINDINGS: Record<string, EkgFindingSpec> = {
  "image-vorhofflimmern": {
    label: "Vorhofflimmern",
    exact: [/\bvorhofflimmern\b/, /\babsolute arrhythmie\b/],
    acceptedTerms: ["Vorhofflimmern", "Vorhof Flimmern", "VHF", "absolute Arrhythmie"],
  },
  "ekg-strip-av1": {
    label: "AV-Block I°",
    exact: [/\bav[- ]?block (?:1|i)\b/, /\bav[- ]?block (?:ersten|1\.) grades\b/, /\berstgradiger av[- ]?block\b/],
    partial: [/\bav[- ]?block\b/],
    acceptedTerms: ["AV Block 1", "AV Block Grad 1", "erstgradiger AV Block"],
    highlights: [
      { tone: "context", leads: "PQ-Zeit", explanation: "Konstant über 200 ms verlängert." },
      { tone: "context", leads: "Überleitung", explanation: "Auf jede P-Welle folgt ein QRS-Komplex; kein Kammerkomplex fällt aus." },
    ],
  },
  "ekg-strip-wenckebach": {
    label: "AV-Block II° Typ Wenckebach (Mobitz I)",
    exact: [/\bwenckebach\b/, /\bmobitz (?:1|i)\b/, /\bav[- ]?block (?:2|ii)(?:\. grades?)? typ (?:1|i)\b/],
    partial: [/\bav[- ]?block\b/, /\bav[- ]?block (?:2|ii)\b/],
    acceptedTerms: ["Wenckebach", "Mobitz 1", "AV Block 2 Typ 1"],
    highlights: [
      { tone: "context", leads: "PQ-Zeit", explanation: "Verlängert sich von Schlag zu Schlag." },
      { tone: "context", leads: "Ausfall", explanation: "Schließlich wird eine P-Welle nicht übergeleitet und der zugehörige QRS-Komplex fehlt." },
    ],
  },
  "ekg-strip-mobitz2": {
    label: "AV-Block II° Typ Mobitz II",
    exact: [/\bmobitz (?:2|ii)\b/, /\bav[- ]?block (?:2|ii)(?:\. grades?)? typ (?:2|ii)\b/],
    partial: [/\bav[- ]?block\b/, /\bav[- ]?block (?:2|ii)\b/],
    acceptedTerms: ["Mobitz 2", "AV Block 2 Typ 2"],
    highlights: [
      { tone: "context", leads: "PQ-Zeit", explanation: "Bleibt bei den übergeleiteten Schlägen konstant." },
      { tone: "context", leads: "Ausfall", explanation: "Eine P-Welle wird plötzlich nicht übergeleitet; der QRS-Komplex fehlt ohne vorherige PQ-Verlängerung." },
    ],
  },
  "ekg-strip-av3": {
    label: "AV-Block III° (kompletter AV-Block)",
    exact: [/\bav[- ]?block (?:3|iii)\b/, /\b(?:kompletter|totaler) av[- ]?block\b/, /\bdrittgradiger av[- ]?block\b/],
    partial: [/\bav[- ]?block\b/],
    acceptedTerms: ["AV Block 3", "AV Block Grad 3", "kompletter AV Block"],
    highlights: [
      { tone: "context", leads: "P-Wellen", explanation: "Regelmäßig und schneller als die Kammeraktion." },
      { tone: "context", leads: "AV-Dissoziation", explanation: "P-Wellen und QRS-Komplexe laufen unabhängig; es gibt keine feste PQ-Beziehung." },
    ],
  },
  "ekg-strip-rbbb": {
    label: "Kompletter Rechtsschenkelblock (RSB)",
    exact: [/\brechtsschenkelblock\b/, /\b(?:rsb|rbbb)\b/],
    partial: [/\bschenkelblock\b/, /\bbreitkomplex\w*\b/],
    acceptedTerms: ["Rechtsschenkelblock", "kompletter RSB", "RSB", "RBBB"],
    highlights: [
      { tone: "context", leads: "V1/V2", explanation: "Terminales R' beziehungsweise rSR'- oder RSR'-Konfiguration." },
      { tone: "context", leads: "I und V6", explanation: "Breite terminale S-Zacke bei verbreitertem QRS-Komplex." },
    ],
  },
  "ekg-strip-lbbb": {
    label: "Kompletter Linksschenkelblock (LSB)",
    exact: [/\blinksschenkelblock\b/, /\b(?:lsb|lbbb)\b/],
    partial: [/\bschenkelblock\b/, /\bbreitkomplex\w*\b/],
    acceptedTerms: ["Linksschenkelblock", "kompletter LSB", "LSB", "LBBB"],
    highlights: [
      { tone: "context", leads: "I, aVL, V5/V6", explanation: "Breite beziehungsweise gekerbte R-Zacken." },
      { tone: "context", leads: "V1/V2", explanation: "Überwiegend negativer QS- oder rS-Komplex bei verbreitertem QRS." },
    ],
  },
  "ekg-strip-asystolie": {
    label: "Asystolie",
    exact: [/\basystolie\b/, /\bnulllinie\b/],
    acceptedTerms: ["Asystolie", "Nulllinie"],
  },
  "ekg-strip-pea": {
    label: "Organisierte elektrische Aktivität (PEA erst bei fehlendem Puls)",
    exact: [/\bpea\b/, /\bpulslose elektrische aktivitat\b/, /\borganisierte elektrische aktivitat\b/],
    acceptedTerms: ["PEA", "pulslose elektrische Aktivität", "organisierte elektrische Aktivität"],
  },
  "ekg-strip-vt": {
    label: "Ventrikuläre Tachykardie (VT)",
    exact: [/\bventrikulare tachykardie\b/, /\bkammertachykardie\b/, /\bvt\b/],
    acceptedTerms: ["ventrikuläre Tachykardie", "Kammertachykardie", "VT"],
  },
  "ekg-strip-pvt": {
    label: "Polymorphe ventrikuläre Tachykardie (pVT erst bei fehlendem Puls)",
    exact: [/\bpvt\b/, /\bpulslose ventrikulare tachykardie\b/, /\bpulslose kammertachykardie\b/, /\bpolymorphe ventrikulare tachykardie\b/, /\btorsade(?:s)? de pointes\b/, /\bventrikulare tachykardie\b/, /\bkammertachykardie\b/, /\bvt\b/],
    partial: [/\bbreitkomplextachykardie\b/],
    acceptedTerms: ["pVT", "polymorphe ventrikuläre Tachykardie", "ventrikuläre Tachykardie", "Kammertachykardie", "Torsade de pointes"],
  },
  "ekg-strip-vf": {
    label: "Kammerflimmern (VF)",
    exact: [/\bkammerflimmern\b/, /\bventrikelflimmern\b/, /\bvf\b/],
    acceptedTerms: ["Kammerflimmern", "Ventrikelflimmern", "VF"],
  },
  "ekg-strip-anterior-stemi": {
    label: "Vorderwand-STEMI (anteriorer STEMI)",
    exact: [/\bvorderwand(?:infarkt| stemi)\b/, /\banterior(?:er)? stemi\b/, /\banteroseptal(?:er)? stemi\b/, /\bstemi (?:der )?vorderwand\b/],
    partial: [/\bstemi\b/, /\bst hebung\b/, /\bmyokardinfarkt\b/],
    acceptedTerms: ["Vorderwand STEMI", "Vorderwandinfarkt", "anteriorer STEMI", "anteroseptaler STEMI"],
    highlights: [
      { tone: "elevation", leads: "V2–V5", explanation: "Zusammengehörige ST-Hebungen sprechen für eine anteriore Ischämie." },
      { tone: "reciprocal", leads: "II, III, aVF", explanation: "Reziproke ST-Senkungen können den Vorderwandbefund stützen." },
    ],
  },
  "ekg-strip-inferior-stemi": {
    label: "Inferiorwand-STEMI (klassisch: Hinterwandinfarkt)",
    exact: [/\binferiorwand(?:infarkt| stemi)\b/, /\binferior(?:er)? stemi\b/, /\bhinterwand(?:infarkt| stemi)\b/, /\bstemi (?:der )?(?:inferiorwand|hinterwand)\b/, /\bstemi (?:in )?(?:ii iii avf|2 3 avf)\b/],
    partial: [/\bstemi\b/, /\bst hebung\b/, /\bmyokardinfarkt\b/],
    acceptedTerms: ["Inferiorwand STEMI", "Inferiorwandinfarkt", "inferiorer STEMI", "Hinterwandinfarkt"],
    highlights: [
      { tone: "elevation", leads: "II, III, aVF", explanation: "ST-Hebungen in den inferioren Ableitungen kennzeichnen den Inferiorwand-STEMI." },
      { tone: "reciprocal", leads: "I, aVL", explanation: "Reziproke ST-Senkungen können als Spiegelbild auftreten." },
      { tone: "context", leads: "V4R", explanation: "Bei passender Klinik an eine rechtsventrikuläre Beteiligung denken." },
    ],
  },
  "ekg-strip-posterior-stemi": {
    label: "Posteriorer STEMI",
    exact: [/\bposterior(?:er)? stemi\b/, /\bposteriorwand(?:infarkt| stemi)\b/, /\bstemi posterior\b/, /\bstemi (?:in )?v7(?: bis|-)?v9\b/],
    partial: [/\bstemi\b/, /\bst senkung(?:en)? (?:in )?v1(?: bis|-)?v3\b/, /\bhinterwandinfarkt\b/],
    acceptedTerms: ["posteriorer STEMI", "Posteriorwandinfarkt", "STEMI posterior"],
    highlights: [
      { tone: "depression", leads: "V1–V3", explanation: "ST-Senkungen mit hohen R-Zacken können das spiegelbildliche Zeichen eines posterioren STEMI sein." },
      { tone: "elevation", leads: "V7–V9", explanation: "Posteriore Zusatzableitungen können die ST-Hebung direkt zeigen." },
    ],
  },
  "ekg-strip-nstemi": {
    label: "NSTE-ACS / NSTEMI-Verdacht mit Ischämiezeichen",
    exact: [/\bnstemi\b/, /\bnste[- ]?acs\b/, /\bnicht st hebungs(?:infarkt|myokardinfarkt)\b/, /\bnon st elevation myocardial infarction\b/],
    partial: [/\bst senkung(?:en)?\b/, /\bischamie(?:zeichen)?\b/, /\bt inversion(?:en)?\b/],
    acceptedTerms: ["NSTEMI", "NSTE ACS", "Nicht ST Hebungsinfarkt"],
    highlights: [
      { tone: "depression", leads: "betroffene Ableitungen", explanation: "ST-Senkungen oder dynamische T-Negativierungen können Ischämiezeichen sein." },
      { tone: "context", leads: "12-Kanal-Verlauf", explanation: "Ein NSTEMI wird nicht allein am Einzel-EKG erkannt: Klinik, Verlauf und Troponindynamik gehören dazu." },
    ],
  },
};

function ekgFindingSpec(entry: FreeTutorKnowledge) {
  return EKG_FINDINGS[entry.id];
}

function ekgQuestionText(entry: FreeTutorKnowledge) {
  return ekgFindingSpec(entry) ? "Welchen EKG-Befund erkennst du?" : entry.question;
}

function neutralEkgImage(entry: FreeTutorKnowledge) {
  if (!entry.image) return undefined;
  return {
    ...entry.image,
    alt: "Unbeschriftetes EKG zur Befunderkennung",
    caption: "EKG ohne Lösungshinweis",
  };
}

function approximatelyMatchesTerm(answer: string, term: string) {
  const answerWords = normalize(answer).split(" ").filter(Boolean);
  const termWords = normalize(term).split(" ").filter(Boolean);
  if (!termWords.length) return false;
  return termWords.every((expectedWord) => answerWords.some((answerWord) =>
    answerWord === expectedWord
    || expectedWord.length >= 4 && answerWord.length >= 4 && editDistanceAtMostOne(answerWord, expectedWord)
    || expectedWord.length >= 7 && answerWord.length >= 7 && editDistanceAtMostTwo(answerWord, expectedWord)
  ));
}

function ekgSolutionFor(entry: FreeTutorKnowledge): EkgSolution | undefined {
  const spec = ekgFindingSpec(entry);
  if (!entry.image || !spec) return undefined;
  return { image: entry.image, label: spec.label, highlights: spec.highlights || [] };
}

function evaluateEkgFinding(entry: FreeTutorKnowledge, response: string): TutorResult {
  const spec = ekgFindingSpec(entry);
  const answer = normalize(response);
  if (!spec) return evaluateAnswer(entry, response);
  const exact = spec.exact.some((pattern) => pattern.test(answer));
  const closeEnough = !exact && spec.acceptedTerms?.some((term) => approximatelyMatchesTerm(answer, term));
  const partial = !exact && !closeEnough && spec.partial?.some((pattern) => pattern.test(answer));
  const correct = exact || Boolean(closeEnough);
  const score = correct ? 5 : partial ? 2 : 0;
  return {
    evaluation: correct
      ? `EKG-Befund korrekt erkannt: ${spec.label}.${closeEnough ? " Kleine Schreibabweichungen wurden sinngemäß gewertet." : ""} Bewertet wurde nur der gesuchte Befund.`
      : partial
        ? `Befundgruppe erkannt, die genaue Bezeichnung fehlt. Richtige Lösung: ${spec.label}.`
        : `EKG-Befund nicht korrekt erkannt. Richtige Lösung: ${spec.label}.`,
    strengths: correct ? [`EKG-Befund richtig benannt: ${spec.label}`] : partial ? ["Passende Befundgruppe erkannt"] : [],
    missing_points: correct ? [] : [`Gesuchter EKG-Befund: ${spec.label}`],
    score,
    source_basis: `EKG-Training · ${entry.topic}`,
  };
}

function requestedEkgChallenges(query: string, entries: readonly FreeTutorKnowledge[]) {
  const value = normalize(query);
  const wantedIds = /\b(vorhofflimmern|vorhof flimmern|vhf|absolute arrhythmie)\b/.test(value)
    ? ["image-vorhofflimmern"]
    : /\b(?:rechtsschenkelblock|rsb|rbbb)\b/.test(value) ? ["ekg-strip-rbbb"]
    : /\b(?:linksschenkelblock|lsb|lbbb)\b/.test(value) ? ["ekg-strip-lbbb"]
    : /\bschenkelblock\b/.test(value) ? ["ekg-strip-rbbb", "ekg-strip-lbbb"]
    : /\b(?:wenckebach|mobitz (?:1|i))\b/.test(value) ? ["ekg-strip-wenckebach"]
    : /\bmobitz (?:2|ii)\b/.test(value) ? ["ekg-strip-mobitz2"]
    : /\b(?:av block (?:grad )?(?:3|iii)|kompletter av block|totaler av block)\b/.test(value) ? ["ekg-strip-av3"]
    : /\b(?:av block (?:grad )?(?:1|i)|erstgradiger av block)\b/.test(value) ? ["ekg-strip-av1"]
    : /\bav block\b/.test(value)
    ? ["ekg-strip-av1", "ekg-strip-wenckebach", "ekg-strip-mobitz2", "ekg-strip-av3"]
    : /\basystolie\b/.test(value) ? ["ekg-strip-asystolie"]
    : /\bpea\b/.test(value) ? ["ekg-strip-pea"]
    : /\bpvt\b/.test(value) ? ["ekg-strip-pvt"]
    : /\bkammerflimmern\b/.test(value) ? ["ekg-strip-vf"]
    : /\b(vt|ventrikulare tachykardie)\b/.test(value) ? ["ekg-strip-vt", "ekg-strip-pvt"]
    : /\b(vorderwand|anterior)\w*\b/.test(value) ? ["ekg-strip-anterior-stemi"]
    : /\b(hinterwand|inferior)\w*\b/.test(value) ? ["ekg-strip-inferior-stemi"]
    : /\bposterior\w*\b/.test(value) ? ["ekg-strip-posterior-stemi"]
    : /\bnstemi\b/.test(value) ? ["ekg-strip-nstemi"]
    : /\bstemi\b/.test(value) ? ["ekg-strip-anterior-stemi", "ekg-strip-inferior-stemi", "ekg-strip-posterior-stemi"]
    : [];
  const requested = wantedIds.length ? entries.filter((entry) => wantedIds.includes(entry.id)) : [...entries];
  return requested.length ? requested : [...entries];
}

function findVfaReferences(query: string, fallbackTopic: string) {
  const generic = new Set(["abbildung", "bild", "bitte", "original", "vfa", "verfahrensanweisung", "verfahrensanweisungen", "zeig", "zeige", "zeigen", "offne"]);
  const directTokens = tokens(query).filter((token) => !generic.has(token));
  const queryTokens = directTokens.length ? directTokens : tokens(fallbackTopic).filter((token) => !generic.has(token));
  const exactNumber = normalize(query).match(/\bvfa\s*(\d{1,2})\b/)?.[1];
  const wantsChild = queryTokens.some((token) => ["kind", "kinder", "neugeborene"].includes(token));
  const wantsAdult = queryTokens.some((token) => ["erwachsene", "erwachsener"].includes(token));
  const matches = vfaLibrary.map((entry) => {
    const searchable = normalize(`${entry.title} ${entry.keywords}`);
    let score = queryTokens.reduce((sum, token) => sum + (containsToken(searchable, token) ? 12 : 0), 0);
    if (exactNumber && new RegExp(`\\bvfa ${exactNumber}\\b`).test(normalize(entry.title))) score += 100;
    if (wantsChild && !/\b(kind|kinder|neugeborene)\b/.test(searchable)) score -= 24;
    if (wantsAdult && /\b(kind|kinder|neugeborene)\b/.test(searchable)) score -= 24;
    return { entry, score };
  }).filter((match) => match.score > 0).sort((left, right) => right.score - left.score);
  if (!matches.length) return [];
  if (exactNumber) return matches.filter((match) => match.score >= 100).slice(0, 3).map((match) => match.entry);
  const best = matches[0].score;
  return matches.filter((match) => match.score >= Math.max(12, best - 6)).slice(0, 3).map((match) => match.entry);
}

function collectLearningMaterial(siteOverview: string): LearningSource | null {
  const chapter = document.querySelector<HTMLElement>(".topic-reader, .communication-reader");
  const source = chapter || document.querySelector<HTMLElement>(".main-content");
  if (!source) return null;
  const clone = source.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("button, .study-finale, .chapter-completion, .ai-question-panel, .legal-sources, .lesson-source-note").forEach((node) => node.remove());
  const title = chapter ? source.querySelector(".reader-hero h1, .communication-hero h1, h1")?.textContent?.trim() || "Aktuelles Lernkapitel" : "Gesamte Prüfungsvorbereitung";
  const scope: TutorScope = chapter ? "chapter" : "site";
  const visibleText = (clone.textContent || "").replace(/\s+/g, " ").trim();
  const material = `${siteOverview}\n\n${scope === "chapter" ? `Aktuell geöffnetes Kapitel „${title}“:\n` : "Aktuell sichtbare Seite:\n"}${visibleText}`.slice(0, 38_000);
  return material.length >= 100 ? { title, material, scope, href: window.location.pathname } : null;
}

function materialAnswer(material: string, query: string) {
  const queryTokens = tokens(query);
  if (!queryTokens.length) return "";
  const sentences = material.split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter((sentence) => sentence.length >= 35 && sentence.length <= 420);
  return sentences.map((sentence) => ({ sentence, score: queryTokens.filter((token) => containsToken(sentence, token)).length })).filter((match) => match.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map((match) => match.sentence).join(" ");
}

function keyTerms(answer: string) {
  const generic = new Set(["dabei", "dadurch", "durch", "diese", "einem", "einen", "einer", "folgen", "kann", "sowie", "typisch", "werden", "wirkt"]);
  return tokens(answer).filter((word) => word.length >= 4 && !generic.has(word)).slice(0, 12);
}

function wordStem(word: string) {
  const normalized = normalize(word);
  if (normalized.length <= 5) return normalized;
  return normalized.replace(/(?:ierungen|ierung|lichkeit|keiten|keit|ungen|ung|ischen|ischer|ische|isch|enden|ender|ende|ieren|iert|est|ern|em|en|er|es|e|n|s)$/u, "");
}

function includesConcept(response: string, term: string) {
  if (containsToken(response, term)) return true;
  const normalizedTerm = normalize(term);
  const group = CONCEPT_SYNONYMS.find((items) => items.some((item) => normalize(item) === normalizedTerm));
  if (group?.some((item) => normalize(response).includes(normalize(item)))) return true;
  const termStem = wordStem(normalizedTerm);
  if (termStem.length < 4) return false;
  return tokens(response).some((word) => {
    const responseStem = wordStem(word);
    return responseStem === termStem
      || termStem.length >= 6 && responseStem.startsWith(termStem)
      || responseStem.length >= 6 && termStem.startsWith(responseStem);
  });
}

function answerKeyPoints(answer: string) {
  const rawPoints = answer
    .split(/\n+|(?<=[.!?])\s+|;\s+/)
    .map((point) => point.replace(/^[•\-–—*\s]+/, "").trim())
    .filter((point) => point.length >= 12 && point.length <= 420);
  const unique = rawPoints.filter((point, index) => rawPoints.findIndex((candidate) => normalize(candidate) === normalize(point)) === index);
  return (unique.length ? unique : [answer]).slice(0, 9).map((text) => ({ text, terms: keyTerms(text).slice(0, 7) }));
}

function shortenPoint(point: string) {
  const cleaned = point.replace(/^(wirkung|wechselwirkungen|kontraindikationen|nebenwirkungen|dosierung und zubereitung|begruendung|merke):\s*/i, "").trim();
  return cleaned.length > 155 ? `${cleaned.slice(0, 152).trim()}…` : cleaned;
}

const VFA_CONTEXT_PATTERN = /\b(?:vfa|verfahrensanweisung|dosier|dosis|aufzieh|zubereit|konzentration|applikation|medikament)\w*\b/i;
const DOSE_VALUE_PATTERN = /\b\d+(?:[.,]\d+)?\s*(?:mg|µg|mcg|g|ml|ie|i\.e\.|j|mmhg|cmh2o|bar|%|sekunden?|minuten?)(?:\s*\/\s*(?:kgkg|kg|h|min))?\b/gi;

type ClinicalDoseValue = { value: number; unit: string; per: string; label: string };

function vfaAnchored(entry: FreeTutorKnowledge) {
  return VFA_CONTEXT_PATTERN.test(`${entry.area} ${entry.question} ${entry.answer}`);
}

function doseValues(value: string) {
  return [...new Set((value.match(DOSE_VALUE_PATTERN) || []).map((dose) => normalize(dose).replace(/\s+/g, "").replace("mcg", "µg").replace("i.e.", "ie").replace(",", ".")))];
}

function clinicalDoseValues(value: string): ClinicalDoseValue[] {
  return doseValues(value).flatMap((label) => {
    const match = label.match(/^(\d+(?:\.\d+)?)(mg|µg|g|ml|ie|j|mmhg|cmh2o|bar|%|sekunden?|minuten?)(?:\/(kgkg|kg|h|min))?$/);
    if (!match) return [];
    const unit = match[2] === "mcg" ? "µg" : match[2];
    return [{ value: Number(match[1]), unit, per: match[3] || "", label }];
  });
}

function sameClinicalDose(left: ClinicalDoseValue, right: ClinicalDoseValue) {
  return left.unit === right.unit && left.per === right.per && Math.abs(left.value - right.value) < 0.0001;
}

function isVfaExamEntry(entry: FreeTutorKnowledge) {
  const explicitlyVfaBased = /\b(?:vfa|verfahrensanweisung)\b/i.test(`${entry.area} ${entry.question}`)
    || entry.id.startsWith("image-vfa-")
    || entry.id.startsWith("med-rule-");
  return explicitlyVfaBased
    && !entry.id.startsWith("mc-")
    && !entry.id.startsWith("med-case-")
    && !/multiple choice|medikamentenrechnen/i.test(entry.area);
}

function answerRationale(entry: FreeTutorKnowledge) {
  const provided = entry.answer.match(/(?:Begründung|Warum):\s*([\s\S]+?)(?=\n\n[A-ZÄÖÜ][^\n]{1,45}:|$)/i)?.[1]?.trim();
  if (provided) return provided;
  const points = answerKeyPoints(entry.answer).map((point) => shortenPoint(point.text)).filter(Boolean).slice(0, 4);
  if (!points.length) return `Die Einordnung stützt sich auf den hinterlegten Lerninhalt aus ${entry.topic}.`;
  return `Für eine vollständige Prüfungsantwort müssen die fachlichen Kernpunkte gemeinsam betrachtet werden:\n${points.map((point) => `• ${point}`).join("\n")}\nSo wird nicht nur ein Einzelbegriff genannt, sondern der Zusammenhang aus Befund, Bedeutung und rettungsdienstlicher Konsequenz erklärt.`;
}

function structuredKnowledgeAnswer(entry: FreeTutorKnowledge) {
  const answerWithoutRationale = entry.answer.replace(/\n\n(?:Begründung|Warum):\s*[\s\S]+$/i, "").trim();
  return `Antwort\n${answerWithoutRationale}\n\nFachliche Begründung\n${answerRationale(entry)}`;
}

const ANSWER_SECTION_INTENTS: Array<{ pattern: RegExp; labels: string[] }> = [
  { pattern: /\b(dosier|dosis|wie viel|wieviel|aufzieh|zubereit|konzentration|applikation|gabe)\w*\b/i, labels: ["dosierung und zubereitung", "dosierung", "zubereitung", "applikation", "regel"] },
  { pattern: /\b(wirk|wirkprinzip|rezeptor)\w*\b/i, labels: ["wirkung"] },
  { pattern: /\b(kontraindikation|gegenanzeige|ki)\w*\b/i, labels: ["kontraindikationen", "kontraindikation"] },
  { pattern: /\b(nebenwirkung|unerwuenschte wirkung|nw)\w*\b/i, labels: ["nebenwirkungen", "nebenwirkung"] },
  { pattern: /\b(wechselwirkung|interaktion)\w*\b/i, labels: ["wechselwirkungen", "wechselwirkung"] },
  { pattern: /\b(vorsicht|warnhinweis)\w*\b/i, labels: ["vorsicht"] },
  { pattern: /\b(ueberwachung|monitoring|kontrolle)\w*\b/i, labels: ["überwachung", "ueberwachung"] },
];

function focusedKnowledgeAnswer(entry: FreeTutorKnowledge, query: string) {
  const normalizedQuery = normalize(query);
  const requestedLabels = ANSWER_SECTION_INTENTS
    .filter((intent) => intent.pattern.test(normalizedQuery))
    .flatMap((intent) => intent.labels);
  if (!requestedLabels.length) return structuredKnowledgeAnswer(entry);
  const requested = new Set(requestedLabels.map((label) => normalize(label)));
  const matchingLines = entry.answer.split("\n").filter((line) => {
    const label = line.match(/^([^:]{2,40}):/)?.[1];
    return label ? requested.has(normalize(label)) : false;
  });
  if (!matchingLines.length) return structuredKnowledgeAnswer(entry);
  return `Antwort\n${matchingLines.join("\n")}`;
}

const IMPORTANT_TEXT_PATTERN = /(\b(?:Wirkung|Wechselwirkungen?|Kontraindikationen?|Nebenwirkungen?|Dosierung|Zubereitung|Reanimation|Atemweg|Atmung|Kreislauf|Bewusstsein|Bradykardie|Tachykardie|Hypotonie|Hypertonie|Dyspnoe|Atemdepression|Kammerflimmern|Blutung|Schock|ROSC|cABCDE|ABCDE|SAMPLER|OPQRST|GCS|SpO₂|SpO2|etCO₂|etCO2)\b|\b\d+(?:[.,]\d+)?\s?(?:mg|µg|g|ml|l|min|mmHg|cmH₂O|J|IE|%)(?:\/(?:kgKG|kg|h|min))?\b)/gi;

function emphasizeImportantText(text: string) {
  return text.split(IMPORTANT_TEXT_PATTERN).map((part, index) =>
    !part ? null : index % 2 === 1 ? <strong className="message-key" key={`${part}-${index}`}>{part}</strong> : part,
  );
}

function TutorMessageText({ text, emphasize = false }: { text: string; emphasize?: boolean }) {
  const headings = new Set(["antwort", "fachliche begründung", "musterlösung", "auflösung", "auswertung", "warum diese antwort?", "nächste frage", "weiter im fall"]);
  return <div className="ai-tutor-message-text">{text.split("\n").map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return <span className="spacer" aria-hidden="true" key={`space-${index}`} />;
    const heading = trimmed.replace(/:$/, "").toLocaleLowerCase("de");
    if (headings.has(heading)) return <strong className="message-heading" key={`heading-${index}`}>{trimmed.replace(/:$/, "")}</strong>;
    if (/^[•\-–]/.test(trimmed)) {
      const bullet = trimmed.replace(/^[•\-–]\s*/, "");
      return <span className="message-bullet" key={`bullet-${index}`}>{emphasize ? emphasizeImportantText(bullet) : bullet}</span>;
    }
    return <span key={`line-${index}`}>{emphasize ? emphasizeImportantText(trimmed) : trimmed}</span>;
  })}</div>;
}

function evaluateAnswer(entry: FreeTutorKnowledge, response: string): TutorResult {
  const points = answerKeyPoints(entry.answer).map((point) => {
    const hits = point.terms.filter((term) => includesConcept(response, term));
    const expectedValues = clinicalDoseValues(point.text);
    const submittedValues = clinicalDoseValues(response);
    const matchedValues = expectedValues.filter((expected) => submittedValues.some((submitted) => sameClinicalDose(expected, submitted)));
    const termCoverage = hits.length > 0 ? Math.min(1, hits.length / Math.min(2, Math.max(1, point.terms.length))) : 0;
    const valueCoverage = expectedValues.length ? matchedValues.length / expectedValues.length : 0;
    const coverage = Math.max(termCoverage, valueCoverage);
    const safetyRelevant = /\b(?:atemweg|atmung|kreislauf|blutung|dosier|dosis|kontra|defibr|notarzt|transport|reanimation|sauerstoff)\w*\b/i.test(point.text);
    return { ...point, covered: coverage >= 1, partial: coverage > 0 && coverage < 1, coverage, safetyRelevant, weight: safetyRelevant ? 1.5 : 1, hits };
  });
  const covered = points.filter((point) => point.covered);
  const partial = points.filter((point) => point.partial);
  const missing = points.filter((point) => point.coverage === 0);
  const possibleWeight = points.reduce((sum, point) => sum + point.weight, 0);
  const earnedWeight = points.reduce((sum, point) => sum + point.coverage * point.weight, 0);
  const ratio = possibleWeight ? earnedWeight / possibleWeight : 0;
  const expectedDoseValues = isVfaExamEntry(entry) ? clinicalDoseValues(entry.answer) : [];
  const submittedDoseValues = clinicalDoseValues(response);
  const matchedDoseValues = expectedDoseValues.filter((expected) => submittedDoseValues.some((submitted) => sameClinicalDose(expected, submitted)));
  const incorrectDose = expectedDoseValues.length > 0
    && submittedDoseValues.length > 0
    && matchedDoseValues.length === 0;
  const rawScore = Math.max(0, Math.min(5, Math.round(ratio * 5)));
  const criticalOmission = points.some((point) => point.safetyRelevant && point.coverage === 0);
  const score = incorrectDose ? Math.min(2, rawScore) : criticalOmission ? Math.min(3, rawScore) : rawScore;
  const verdict = score >= 4 ? "fachlich weitgehend vollständig" : score >= 2 ? "in wichtigen Teilen richtig, aber noch lückenhaft" : "noch deutlich zu ergänzen";
  const doseNotice = incorrectDose
    ? ` Die erkannte Zahlenangabe (${submittedDoseValues.map((dose) => dose.label).join(", ")}) stimmt nicht mit der hinterlegten VFA-Angabe überein und wurde deshalb nicht als sicher gewertet.`
    : matchedDoseValues.length
      ? ` Korrekt erkannt: ${matchedDoseValues.map((dose) => dose.label).join(", ")}.`
      : "";
  const safetyNotice = !incorrectDose && criticalOmission ? " Ein sicherheitsrelevanter Kernpunkt fehlt; deshalb ist die Bewertung auf höchstens 3 Punkte begrenzt." : "";
  return {
    evaluation: `Deine Antwort ist ${verdict}. ${covered.length} Kernpunkte wurden vollständig und ${partial.length} teilweise erkannt.${doseNotice}${safetyNotice} Stichwörter, Wortstämme, sinngleiche Formulierungen, Synonyme und gebräuchliche Abkürzungen werden mitbewertet; der Wortlaut der Musterlösung ist nicht erforderlich.`,
    strengths: covered.slice(0, 4).map((point) => shortenPoint(point.text)),
    partial_points: partial.slice(0, 4).map((point) => shortenPoint(point.text)),
    missing_points: [...(incorrectDose ? ["Dosierung und Zubereitung exakt mit der hinterlegten VFA abgleichen."] : []), ...missing.map((point) => shortenPoint(point.text))].slice(0, 5),
    score,
    source_basis: `${isVfaExamEntry(entry) ? "VFA-geprüfter Lernbestand" : "Lernbestand"} · ${entry.topic} · ${entry.area}`,
  };
}

function caseScenario(topic: string) {
  const normalizedTopic = normalize(topic);
  const scenarios: Array<[string[], string]> = [
    [["akutes koronarsyndrom", "myokardinfarkt", "angina pectoris"], "Ein erwachsener Patient klagt über plötzlich einsetzenden retrosternalen Druck mit Ausstrahlung, Übelkeit und kaltem Schweiß."],
    [["anaphylaxie"], "Kurz nach möglichem Allergenkontakt entwickelt ein Patient Hautveränderungen, Atemnot und Kreislaufprobleme."],
    [["krampfanfall"], "Beim Eintreffen beobachtest du einen Patienten nach einem Krampfereignis mit eingeschränktem Bewusstsein."],
    [["schock", "polytrauma", "blutung", "amputationsverletzung", "schussverletzung", "stichverletzung"], "Nach einem schweren Verletzungsereignis ist der Patient blass, kaltschweißig und kreislaufinstabil."],
    [["asthma", "copd", "pneumonie", "lungenodem", "pseudokrupp", "epiglottitis"], "Du übernimmst einen Patienten mit ausgeprägter Atemnot. Untersuchung und Monitoring müssen Ursache und Schweregrad klären."],
    [["herzrhythmus", "bradykardie", "vorhofflimmern"], "Ein Patient berichtet über Schwindel und Leistungsknick; im Monitoring fällt ein auffälliger Herzrhythmus auf."],
    [["hypoglykamie"], "Ein Patient ist plötzlich verwirrt, blass und kaltschweißig. Fremdanamnestisch besteht eine mögliche Stoffwechselerkrankung."],
    [["geburt"], "Eine Schwangere mit regelmäßiger Wehentätigkeit wird präklinisch versorgt; der Geburtsfortschritt muss rasch eingeschätzt werden."],
    [["verbrennung", "elektrounfall", "explosionsverletzung"], "Nach einem Unfall mit thermischer oder physikalischer Energie bestehen sichtbare Verletzungen und mögliche innere Folgeschäden."],
    [["akutes abdomen", "pankreatitis", "gallensteinkolik", "ulkusblutung"], "Ein Patient klagt über starke akute Bauchschmerzen mit vegetativen Begleitsymptomen."],
    [["lungenarterienembolie", "lungenembolie", "lae"], "Ein Patient entwickelt plötzlich Atemnot, Tachykardie und thorakale Beschwerden. Die Ursache und hämodynamische Relevanz sind noch unklar."],
    [["apoplex", "schlaganfall"], "Bei einem zuvor selbstständigen Patienten treten plötzlich eine einseitige Schwäche und eine Sprachstörung auf. Der genaue Symptombeginn muss geklärt werden."],
    [["schaedelhirntrauma", "sht"], "Nach einem Sturz zeigt ein Patient Kopfschmerzen, Erinnerungslücken und eine zunehmende Bewusstseinsstörung."],
    [["venenthrombose", "pavk", "arterieller verschluss"], "Ein Patient berichtet über neu aufgetretene Beschwerden an einer Extremität. Durchblutung, venöser Rückstrom und zeitkritische Gefahren müssen unterschieden werden."],
    [["barotrauma"], "Nach einem raschen Tauchgang klagt ein Patient unmittelbar nach dem Auftauchen über Atemnot und neurologische Auffälligkeiten."],
    [["wirbelsaulentrauma", "extremitatentrauma", "rippenfraktur", "thoraxtrauma", "abdominaltrauma"], "Nach einem Unfall bestehen starke Schmerzen und ein relevantes Verletzungsmuster. Du musst lebensbedrohliche Befunde vor lokalen Verletzungen erkennen."],
    [["extrauteringraviditat", "eug", "hodentorsion"], "Ein Patient mit akutem Unterbauch- oder Genitalschmerz benötigt eine diskrete, strukturierte und zeitkritische Untersuchung."],
  ];
  return scenarios.find(([terms]) => terms.some((term) => normalizedTopic.includes(term)))?.[1]
    || `Du übernimmst einen Patienten mit einem rettungsdienstlichen Beschwerdebild aus dem Themengebiet „${topic}“. Die Lage soll strukturiert beurteilt und begründet versorgt werden.`;
}

function chooseCasePool(focus: string, difficulty: string, knowledge: readonly FreeTutorKnowledge[]) {
  const pool = chooseExamPool(focus, knowledge);
  const basic = /grundlegend/i.test(difficulty);
  const advanced = /sehr anspruchsvoll/i.test(difficulty);
  const preferred = pool.filter((entry) => basic
    ? /definition|anatomie|symptom|diagnostik|erstma|grundlage/i.test(entry.area)
    : advanced
      ? /pathophysi|differenzial|komplikation|gefahr|entscheidung|recht|medikament/i.test(entry.area)
      : true);
  const ordered = preferred.length >= 3 ? [...preferred, ...pool.filter((entry) => !preferred.includes(entry))] : pool;
  const vfaEntries = ordered.filter(vfaAnchored);
  if (!vfaEntries.length) return ordered;
  const firstVfa = vfaEntries[0];
  const withoutFirstVfa = ordered.filter((entry) => entry !== firstVfa);
  return [...withoutFirstVfa.slice(0, 2), firstVfa, ...withoutFirstVfa.slice(2)];
}

function chooseExamPool(focus: string, knowledge: readonly FreeTutorKnowledge[]) {
  const ranked = rankedKnowledge(focus, knowledge);
  const topScore = ranked[0]?.score || 0;
  const focused = ranked.filter((match) => match.score >= Math.max(12, topScore * 0.45)).map((match) => match.entry);
  const pool = focused;
  if (!pool.length) return [];
  const offset = Math.floor(Math.random() * pool.length);
  return [...pool.slice(offset), ...pool.slice(0, offset)].slice(0, 8);
}

const VFA_VERSION = "Thüringer VFA 2026/2027";
const ORAL_FOLLOW_UPS = [
  "Begründen Sie Ihre Entscheidung: Warum ist dieser Punkt für den Patienten wichtig?",
  "Welche gefährliche Differenzialdiagnose müssen Sie jetzt noch ausschließen?",
  "Welche Komplikation erwarten Sie, wenn sich der Zustand verschlechtert?",
  "Was würde sich bei einem Kind, älteren Menschen oder einer Schwangeren verändern?",
  "Wie kontrollieren Sie die Wirkung Ihrer Maßnahmen und wann eskalieren Sie?",
];

function chooseVfaPool(focus: string, knowledge: readonly FreeTutorKnowledge[]) {
  const ranked = rankedKnowledge(focus, knowledge.filter(isVfaExamEntry));
  const topScore = ranked[0]?.score || 0;
  const base = ranked.filter((match) => match.score >= Math.max(12, topScore * 0.45)).map((match) => match.entry);
  return base.slice(0, 6);
}

function oralFollowUp(entry: FreeTutorKnowledge, index: number) {
  if (index === 0) return entry.question;
  const prompt = ORAL_FOLLOW_UPS[(index - 1) % ORAL_FOLLOW_UPS.length];
  return `${prompt}\n\n${entry.question}`;
}

function adaptiveFollowUp(entry: FreeTutorKnowledge, result: TutorResult, index: number): AdaptiveFollowUp {
  const incorrectDose = /Dosierung stimmt nicht|Dosierung und Zubereitung/i.test(`${result.evaluation} ${result.missing_points.join(" ")}`);
  const target = result.missing_points[0]
    || result.partial_points?.[0]
    || answerKeyPoints(entry.answer)[Math.min(index, Math.max(0, answerKeyPoints(entry.answer).length - 1))]?.text
    || entry.answer;
  const targetText = normalize(target);
  const prompt = incorrectDose || /dosier|dosis|mg|µg|mcg|ml|ie|aufzieh|konzentration/.test(targetText)
    ? `Welche genaue Dosierung ist in diesem Fall vorgesehen? Nennen Sie nur Dosis, Einheit, Applikationsweg und – falls verlangt – Aufziehvolumen oder Wiederholung.`
    : /kontra|gegenanzeige|allerg|sicherheitsgrenze/.test(targetText)
      ? `Welche konkrete Kontraindikation oder Sicherheitsgrenze müssen Sie vor dieser Maßnahme prüfen, und welche Konsequenz hat ein positiver Befund?`
      : /symptom|befund|diagnos|erkenn|zeichen/.test(targetText)
        ? `Welcher konkrete Befund fehlt noch für Ihre Verdachtsdiagnose, und wie erheben Sie ihn präklinisch?`
        : /differenzial|abgrenz|ausschliess/.test(targetText)
          ? `Welche gefährliche Differenzialdiagnose müssen Sie hier noch ausschließen, und welcher Befund hilft bei der Abgrenzung?`
          : /komplikation|gefahr|verschlechter/.test(targetText)
            ? `Welche konkrete Komplikation kann als Nächstes auftreten, und woran würden Sie diese früh erkennen?`
            : /reevalu|kontroll|monitor|wirkung|abbruch|eskal/.test(targetText)
              ? `Welche konkrete Wirkung oder Verschlechterung kontrollieren Sie nach Ihrer Maßnahme, und wann müssen Sie abbrechen oder eskalieren?`
              : /transport|zielklinik|übergabe|notarzt/.test(targetText)
                ? `Welche konkrete Transport- oder Eskalationsentscheidung treffen Sie jetzt, und welcher Befund begründet sie?`
                : /pathophysi|entsteh|mechanismus|rezeptor/.test(targetText)
                  ? `Erklären Sie den noch fehlenden Mechanismus in einer kurzen Ursache-Wirkungs-Kette und nennen Sie die rettungsdienstliche Folge.`
                  : /definition|bedeutet|unterschied|abgrenz/.test(targetText)
                    ? `Formulieren Sie die gesuchte Definition in einem Satz und nennen Sie das entscheidende Unterscheidungsmerkmal.`
                    : `Beantworten Sie die Ausgangsfrage noch einmal konkret: „${entry.question}“ Nennen Sie den wichtigsten bislang fehlenden Fachpunkt und begründen Sie ihn in einem Satz.`;
  return { entry: { ...entry, question: prompt, answer: target }, prompt };
}

function vfaQuestionText(entry: FreeTutorKnowledge, index: number) {
  return `VFA-Prüfung · Frage ${index + 1}\n${entry.topic} · ${entry.area}\n\n${entry.question}\n\nAntworten Sie gezielt nur auf diese Frage. Bei Zahlen gehören Wert und Einheit zusammen.`;
}

function examDimensions(entry: FreeTutorKnowledge, response: string, result: TutorResult): TutorDimension[] {
  const normalized = normalize(response);
  const structured = /\b(cabcde|abcde|samplers|opqrst|prioritat|zuerst|anschliessend|danach)\b/.test(normalized);
  const prioritized = /\b(lebensbedroh|vital|atemweg|atmung|kreislauf|blutung|monitoring|notarzt|transport)\b/.test(normalized);
  const vfaRelevant = vfaAnchored(entry);
  const vfaSafe = !vfaRelevant || !/dosierung stimmt nicht/i.test(result.evaluation);
  return [
    { label: "Fachlichkeit", score: result.score, note: "Inhaltliche Kernpunkte und sinngleiche Fachbegriffe" },
    { label: "Struktur", score: structured ? Math.max(4, result.score) : Math.min(3, Math.max(1, result.score)), note: structured ? "Erkennbar geordnetes Vorgehen" : "Reihenfolge deutlicher nach cABCDE/SAMPLERS gliedern" },
    { label: "Prioritäten", score: prioritized ? Math.max(4, result.score) : Math.min(3, Math.max(1, result.score)), note: prioritized ? "Zeitkritische Gefahren und Maßnahmen benannt" : "Lebensbedrohliche Probleme und Eskalation klarer priorisieren" },
    { label: "VFA-Treue", score: vfaRelevant ? (vfaSafe ? result.score : Math.min(2, result.score)) : Math.max(3, result.score), note: vfaRelevant ? (vfaSafe ? "Hinterlegte VFA-Angaben berücksichtigt" : "Dosierung oder Anwendung mit der VFA abgleichen") : "In diesem Prüfungsschritt ohne abweichende VFA-Angabe" },
  ];
}

function prioritizeWeakEkgEntries(pool: readonly FreeTutorKnowledge[], weakEntryIds: readonly string[]) {
  const weakIds = new Set(weakEntryIds);
  const weak = pool.filter((entry) => weakIds.has(entry.id));
  if (!weak.length) return [...pool];
  const ordered = [...pool];
  weak.forEach((entry, index) => ordered.splice(Math.min(ordered.length, 3 + index * 4), 0, entry));
  return ordered;
}

function scheduleEkgRetry(pool: readonly FreeTutorKnowledge[], currentIndex: number, entry: FreeTutorKnowledge) {
  if (pool.slice(currentIndex + 1).some((candidate) => candidate.id === entry.id)) return [...pool];
  const nextPool = [...pool];
  const remaining = pool.length - currentIndex - 1;
  if (remaining >= 2) nextPool.splice(currentIndex + 3, 0, entry);
  else {
    const fillers = pool.filter((candidate) => candidate.id !== entry.id).slice(0, 2 - remaining);
    nextPool.push(...fillers, entry);
  }
  return nextPool;
}

export default function AiExamTutor({ active, siteOverview, additionalKnowledge = [], userId = null }: { active: boolean; siteOverview: string; additionalKnowledge?: readonly FreeTutorKnowledge[]; userId?: string | null }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mode, setMode] = useState<TutorMode>("exam");
  const [source, setSource] = useState<LearningSource | null>(null);
  const [turns, setTurns] = useState<TutorTurn[]>([]);
  const [examPool, setExamPool] = useState<FreeTutorKnowledge[]>([]);
  const [examIndex, setExamIndex] = useState(0);
  const [pendingNextEkgIndex, setPendingNextEkgIndex] = useState<number | null>(null);
  const [weakEntryIds, setWeakEntryIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(window.localStorage.getItem("notsan-tutor-weak-entries") || "[]");
      return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string") : [];
    } catch { return []; }
  });
  const [reviewMode, setReviewMode] = useState(false);
  const [sessionScores, setSessionScores] = useState<number[]>([]);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [adaptiveQuestion, setAdaptiveQuestion] = useState<AdaptiveFollowUp | null>(null);
  const [chatImageChallenge, setChatImageChallenge] = useState<FreeTutorKnowledge | null>(null);
  const [lastEkgChallengeId, setLastEkgChallengeId] = useState("");
  const [simulationPhase, setSimulationPhase] = useState<"idle" | "prep" | "exam" | "finished">("idle");
  const [prepEndsAt, setPrepEndsAt] = useState<number | null>(null);
  const [prepRemaining, setPrepRemaining] = useState(20 * 60);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [speechSupported] = useState(() => {
    if (typeof window === "undefined") return false;
    const speechWindow = window as typeof window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
    return Boolean(speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition);
  });
  const dialogRef = useRef<HTMLElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const knowledge = useMemo(() => [...freeTutorKnowledge, ...additionalKnowledge], [additionalKnowledge]);
  const weakEntries = useMemo(() => knowledge.filter((entry) => weakEntryIds.includes(entry.id)), [knowledge, weakEntryIds]);
  const currentEntry = examPool[examIndex] || null;
  const canSubmit = Boolean(input.trim() && source);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    window.setTimeout(() => dialogRef.current?.focus(), 0);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", closeOnEscape); };
  }, [open]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [turns]);
  useEffect(() => {
    try { saveLocalTutorWeaknesses(weakEntryIds); } catch { /* Privater Browsermodus kann localStorage sperren. */ }
  }, [weakEntryIds]);
  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);
  useEffect(() => {
    if (simulationPhase !== "prep" || !prepEndsAt) return;
    const update = () => {
      const remaining = Math.max(0, Math.ceil((prepEndsAt - Date.now()) / 1000));
      setPrepRemaining(remaining);
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [prepEndsAt, simulationPhase]);
  useEffect(() => {
    if (!userId) return;
    syncTutorWeaknesses(userId).then(setWeakEntryIds).catch(() => setError("Die Schwächenliste konnte gerade nicht mit deinem Konto synchronisiert werden."));
  }, [userId]);
  useEffect(() => {
    const launchFromPage = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: TutorMode; focus?: string; difficulty?: string }>).detail;
      if (!detail?.mode || !["simulation", "vfa"].includes(detail.mode)) return;
      const chapter = collectLearningMaterial(siteOverview);
      const focus = detail.focus?.trim() || "zufälliger präklinischer Notfall";
      const difficulty = detail.difficulty || "prüfungsnah";
      const pool = detail.mode === "vfa" ? chooseVfaPool(focus, knowledge) : chooseCasePool(focus, difficulty, knowledge).slice(0, 6);
      const first = pool[0];
      setSource(chapter);
      setMode(detail.mode);
      setOpen(true);
      setDismissed(false);
      setReviewMode(false);
      setSessionScores([]);
      setSessionResults([]);
      setAdaptiveQuestion(null);
      setPendingNextEkgIndex(null);
      setExamPool(pool);
      setExamIndex(0);
      setInput("");
      setSimulationPhase(detail.mode === "simulation" ? "prep" : "exam");
      setPrepEndsAt(detail.mode === "simulation" ? Date.now() + 20 * 60 * 1000 : null);
      setPrepRemaining(20 * 60);
      setError(first ? "" : "Zu diesem Schwerpunkt wurden keine Lernkarten gefunden.");
      setTurns(first ? [{ role: "assistant", text: detail.mode === "simulation"
        ? `Prüfungssimulation – ${first.topic}\nVorbereitungszeit: 20 Minuten\n\n${caseScenario(first.topic)}\n\nArbeitsauftrag\nBereiten Sie eine strukturierte Fallvorstellung mit Verdachtsdiagnose, Prioritäten, Diagnostik, Maßnahmen, Transportentscheidung und relevanter VFA vor. Die Prüferfragen beginnen erst nach der Vorbereitungsphase.`
        : detail.mode === "vfa"
          ? `${VFA_VERSION}\n${vfaQuestionText(first, 0)}`
          : first.question }] : []);
    };
    window.addEventListener("notsan-open-tutor", launchFromPage);
    return () => window.removeEventListener("notsan-open-tutor", launchFromPage);
  }, [knowledge, siteOverview]);
  if (!active || dismissed) return null;

  const openTutor = () => {
    const chapter = collectLearningMaterial(siteOverview);
    if (chapter?.title !== source?.title) { setTurns([]); setExamPool([]); setExamIndex(0); setPendingNextEkgIndex(null); setInput(""); setReviewMode(false); setSessionScores([]); setSessionResults([]); setAdaptiveQuestion(null); }
    setSource(chapter);
    setError(chapter ? "" : "Die Lerninhalte konnten auf dieser Seite nicht geladen werden.");
    setOpen(true);
  };

  const reset = (nextMode: TutorMode = mode) => {
    setMode(nextMode); setTurns([]); setExamPool([]); setExamIndex(0); setPendingNextEkgIndex(null); setInput(""); setError(""); setReviewMode(false); setSessionScores([]); setSessionResults([]); setAdaptiveQuestion(null); setChatImageChallenge(null); setSimulationPhase("idle"); setPrepEndsAt(null); setPrepRemaining(20 * 60); setSource(collectLearningMaterial(siteOverview));
  };

  const questionText = (entry: FreeTutorKnowledge, index: number) => mode === "image"
    ? ekgQuestionText(entry)
    : mode === "vfa"
      ? `${index > 0 ? `Prüfer-Nachfrage ${index + 1}\n` : ""}${VFA_VERSION}\n${vfaQuestionText(entry, index)}`
      : mode === "simulation"
        ? `${index === 0 ? `Fallbeispiel – ${entry.topic}\n${caseScenario(entry.topic)}\n\n` : `Prüfer-Nachfrage ${index + 1}\n`}${oralFollowUp(entry, index)}`
      : index === 0
        ? entry.question
        : `Prüfer-Nachfrage ${index + 1}\n${oralFollowUp(entry, index)}`;

  const beginSimulationExam = () => {
    const first = examPool[0];
    if (!first) return;
    setSimulationPhase("exam");
    setPrepEndsAt(null);
    setTurns((current) => [...current, { role: "assistant", kind: "oral-follow-up", text: `Prüfungsbeginn · Fallvorstellung\n\n${oralFollowUp(first, 0)}`, questionImage: first.image }]);
  };

  const startExam = () => {
    if (!source) return;
    const basePool = mode === "image" ? knowledge.filter(isEkgChallengeEntry) : knowledge;
    const selectedPool = mode === "vfa"
      ? chooseVfaPool(input.trim() || source.title, basePool)
      : mode === "simulation"
        ? chooseCasePool(input.trim() || source.title, "prüfungsnah", basePool).slice(0, 6)
        : chooseExamPool(input.trim() || source.title, basePool);
    const pool = mode === "image" ? prioritizeWeakEkgEntries(selectedPool, weakEntryIds) : selectedPool;
    const first = pool[0];
    setReviewMode(false); setSessionScores([]); setSessionResults([]); setAdaptiveQuestion(null); setExamPool(pool); setExamIndex(0); setPendingNextEkgIndex(null); setSimulationPhase(mode === "simulation" ? "prep" : "exam"); setPrepEndsAt(mode === "simulation" ? Date.now() + 20 * 60 * 1000 : null); setPrepRemaining(20 * 60); setTurns(first ? [{ role: "assistant", text: mode === "simulation" ? `Prüfungssimulation – ${first.topic}\nVorbereitungszeit: 20 Minuten\n\n${caseScenario(first.topic)}\n\nArbeitsauftrag\nBereiten Sie eine strukturierte Fallvorstellung mit Verdachtsdiagnose, Prioritäten, Diagnostik, Maßnahmen, Transportentscheidung und relevanter VFA vor.` : questionText(first, 0), kind: mode === "image" ? "ekg-question" : undefined, questionImage: mode === "image" ? neutralEkgImage(first) : first.image }] : []); setInput(""); setError(first ? "" : mode === "vfa" ? "Zu diesem Schwerpunkt ist keine eigene VFA-Prüfungsfrage hinterlegt. Wähle ein konkretes VFA-Thema wie ACS, Anaphylaxie, Krampfanfall oder Entlastungspunktion." : "Zu diesem Schwerpunkt wurden keine eindeutig passenden Lernkarten gefunden. Bitte wähle ein konkreteres Thema.");
  };

  const startWeakReview = () => {
    if (!source || !weakEntries.length) return;
    const offset = Math.floor(Math.random() * weakEntries.length);
    const pool = [...weakEntries.slice(offset), ...weakEntries.slice(0, offset)];
    setReviewMode(true); setSessionScores([]); setSessionResults([]); setAdaptiveQuestion(null); setSimulationPhase("exam"); setExamPool(pool); setExamIndex(0); setPendingNextEkgIndex(null); setTurns([{ role: "assistant", text: isEkgChallengeEntry(pool[0]) ? ekgQuestionText(pool[0]) : pool[0].question, questionImage: isEkgChallengeEntry(pool[0]) ? neutralEkgImage(pool[0]) : pool[0].image }]); setInput(""); setError("");
  };

  const askQuestion = (value: string) => {
    if (!source) return;
    if (isEkgChallengeRequest(value) && !chatImageChallenge) {
      const allChallenges = knowledge.filter(isEkgChallengeEntry);
      const requestedChallenges = requestedEkgChallenges(value, allChallenges);
      const candidates = requestedChallenges.filter((entry) => entry.id !== lastEkgChallengeId);
      const challengePool = candidates.length ? candidates : requestedChallenges;
      const challenge = challengePool[Math.floor(Math.random() * challengePool.length)];
      if (challenge?.image) {
        setChatImageChallenge(challenge);
        setLastEkgChallengeId(challenge.id);
        setTurns((current) => [...current, { role: "user", text: value }, { role: "assistant", kind: "ekg-question", text: ekgQuestionText(challenge), questionImage: neutralEkgImage(challenge) }]);
      } else {
        setTurns((current) => [...current, { role: "user", text: value }, { role: "assistant", text: "Aktuell ist kein neutraler EKG-Streifen ohne Lösungshinweis hinterlegt." }]);
      }
      setInput("");
      return;
    }
    if (chatImageChallenge) {
      const result = evaluateEkgFinding(chatImageChallenge, value);
      const response = `Auflösung\nEKG-Befund: ${ekgFindingSpec(chatImageChallenge)?.label || chatImageChallenge.topic}\n\nAuswertung\n${result.score}/5 Punkte · ${result.evaluation}`;
      setTurns((current) => [...current, { role: "user", text: value }, { role: "assistant", kind: "ekg-solution", text: response, result: { ...result, source_href: chatImageChallenge.href }, ekgSolution: ekgSolutionFor(chatImageChallenge) }]);
      setChatImageChallenge(null);
      setInput("");
      return;
    }
    if (isVfaRequest(value)) {
      const vfaImages = findVfaReferences(value, source.title);
      const text = vfaImages.length
        ? `${vfaImages.length === 1 ? "Hier ist die passende Original-VFA" : "Hier sind die passenden Original-VFA"}. Tippe auf eine Abbildung, um sie vollständig und vergrößert zu öffnen.`
        : "Ich konnte keine eindeutig passende VFA-Abbildung zuordnen. Nenne bitte das Thema, die VFA-Nummer oder den Wirkstoff, zum Beispiel „Zeig mir die VFA 25“, „VFA Anaphylaxie“ oder „VFA Morphin“.";
      setTurns((current) => [...current, { role: "user", text: value }, { role: "assistant", text, vfaImages, result: { evaluation: "", strengths: [], missing_points: [], score: 0, source_basis: vfaImages.length ? "Hinterlegte Original-VFA Thüringen 2026/2027" : "Keine eindeutige Zuordnung" } }]);
      setInput("");
      return;
    }
    const match = rankedKnowledge(value, knowledge)[0];
    let text = "";
    let sourceBasis = "";
    if (match && match.score >= 16) { text = focusedKnowledgeAnswer(match.entry, value); sourceBasis = `Lernbestand · ${match.entry.topic} · ${match.entry.area}`; }
    else { text = materialAnswer(source.material, value); sourceBasis = `${source.title} · sichtbarer Lesetext`; }
    if (!text) { text = "Dazu finde ich im hinterlegten Lernmaterial keinen eindeutigen Treffer. Öffne bitte das passende Kapitel und formuliere die Frage mit einem konkreten Fachbegriff erneut."; sourceBasis = "Kein sicherer Treffer"; }
    setTurns((current) => [...current, { role: "user", text: value }, { role: "assistant", text, result: { evaluation: "", strengths: [], missing_points: [], score: 0, source_basis: sourceBasis, source_href: match && match.score >= 16 ? match.entry.href : source.href } }]);
    setInput("");
  };

  const answerExam = (value: string) => {
    if (!currentEntry) return;
    const assessmentEntry = adaptiveQuestion?.entry || currentEntry;
    const answeringAdaptiveQuestion = Boolean(adaptiveQuestion);
    const ekgOnly = mode === "image" && isEkgChallengeEntry(assessmentEntry);
    const baseResult = ekgOnly ? evaluateEkgFinding(assessmentEntry, value) : evaluateAnswer(assessmentEntry, value);
    const result = mode === "simulation" ? { ...baseResult, dimensions: examDimensions(assessmentEntry, value, baseResult) } : baseResult;
    const previousResult = sessionResults.find((entry) => entry.questionId === currentEntry.id);
    const recordedScore = answeringAdaptiveQuestion && previousResult
      ? Math.min(5, previousResult.score + (result.score >= 3 ? 1 : 0))
      : result.score;
    const recordedResult: SessionResult = {
      questionId: currentEntry.id,
      score: recordedScore,
      topic: currentEntry.topic,
      area: currentEntry.area,
      missing: answeringAdaptiveQuestion && previousResult && result.score >= 3
        ? previousResult.missing.slice(1)
        : result.missing_points,
      safetyRelevant: Boolean(previousResult?.safetyRelevant) || vfaAnchored(assessmentEntry) || /sicherheitsrelevant|Dosierung stimmt nicht/i.test(result.evaluation),
    };
    const updatedResults = previousResult
      ? sessionResults.map((entry) => entry.questionId === currentEntry.id ? recordedResult : entry)
      : [...sessionResults, recordedResult];
    const updatedScores = updatedResults.map((entry) => entry.score);
    setWeakEntryIds((current) => recordedScore <= 3
      ? [...new Set([...current, currentEntry.id])]
      : current.filter((id) => id !== currentEntry.id));
    if (userId) updateTutorWeakness(userId, currentEntry.id, recordedScore).catch(() => setError("Die letzte Bewertung konnte nicht mit deinem Konto synchronisiert werden."));
    setSessionScores(updatedScores);
    setSessionResults(updatedResults);
    const nextPool = ekgOnly && result.score <= 3 ? scheduleEkgRetry(examPool, examIndex, currentEntry) : examPool;
    if (nextPool.length !== examPool.length) setExamPool(nextPool);
    const sequentialMode = mode === "exam" || mode === "simulation" || mode === "vfa";

    if (sequentialMode && !answeringAdaptiveQuestion && result.score <= 3) {
      const followUp = adaptiveFollowUp(currentEntry, result, examIndex);
      const protectedResult: TutorResult = {
        ...result,
        evaluation: `${result.evaluation}\nDie fehlende Stelle wird jetzt gezielt nachgefragt.`,
        partial_points: [],
        missing_points: ["Ein noch unsicherer Kernpunkt wird in der folgenden Prüfer-Nachfrage erneut geprüft."],
      };
      setAdaptiveQuestion(followUp);
      setTurns((current) => [...current,
        { role: "user", text: value },
        { role: "assistant", text: "Zwischenbewertung\nDie Antwort wurde bewertet. Die vollständige Auflösung folgt nach der gezielten Nachfrage.", result: { ...protectedResult, source_href: currentEntry.href } },
        { role: "assistant", kind: "oral-follow-up", text: `Gezielte Prüfer-Nachfrage\n${followUp.prompt}`, questionImage: currentEntry.image },
      ]);
      setInput("");
      return;
    }

    if (answeringAdaptiveQuestion) setAdaptiveQuestion(null);
    const sequentialFinished = sequentialMode && examIndex + 1 >= nextPool.length;
    const nextIndex = sequentialMode ? examIndex + 1 : nextPool.length > 1 ? (examIndex + 1) % nextPool.length : examIndex;
    const next = nextPool[nextIndex];
    const finishedWeakRound = reviewMode && nextIndex === 0;
    const solution = ekgOnly
      ? `Auflösung\nEKG-Befund: ${ekgFindingSpec(assessmentEntry)?.label || assessmentEntry.topic}`
      : `Musterlösung\n${assessmentEntry.answer.replace(/\n\n(?:Begründung|Warum):\s*[\s\S]+$/i, "").trim()}\n\nWarum diese Antwort?\n${answerRationale(assessmentEntry)}`;
    const response = `${solution}${!ekgOnly && !sequentialMode && next && !finishedWeakRound ? `\n\nNächste Frage\n${questionText(next, nextIndex)}` : finishedWeakRound ? "\n\nWiederholungsrunde beendet. Sicher beantwortete Inhalte wurden aus deiner Schwächenliste entfernt." : ""}`;
    if (ekgOnly) {
      setTurns((current) => [...current,
        { role: "user", text: value },
        { role: "assistant", kind: "ekg-solution", text: response, result: { ...result, source_href: currentEntry.href }, ekgSolution: ekgSolutionFor(currentEntry) },
      ]);
      setPendingNextEkgIndex(nextIndex);
      setInput("");
      return;
    }
    setTurns((current) => {
      const assessedTurn: TutorTurn = { role: "assistant", text: response, result: { ...result, source_href: currentEntry.href }, vfaImages: mode === "vfa" ? findVfaReferences(currentEntry.topic, currentEntry.question) : undefined };
      const average = updatedScores.reduce((sum, score) => sum + score, 0) / updatedScores.length;
      const secureAnswers = updatedResults.filter((entry) => entry.score >= 4).length;
      const criticalErrors = updatedResults.filter((entry) => entry.safetyRelevant && entry.score <= 2).length;
      const focusAreas = [...new Set(updatedResults.flatMap((entry) => entry.missing).filter(Boolean))].slice(0, 3);
      const summary: TutorTurn[] = sequentialFinished
        ? [{ role: "assistant", kind: "exam-summary", text: `${mode === "simulation" ? "Prüfungssimulation beendet" : mode === "vfa" ? "VFA-Prüfung beendet" : "Fragerunde beendet"}\n\nGesamtergebnis: ${average.toFixed(1)} von 5 Punkten im Durchschnitt.\nSicher beantwortet: ${secureAnswers} von ${updatedResults.length} Antworten.\nKritische Sicherheitslücken: ${criticalErrors}.\n${focusAreas.length ? `Gezielt wiederholen:\n${focusAreas.map((area) => `• ${area}`).join("\n")}` : "Keine offenen Kernpunkte in dieser Runde."}\n\n${average >= 4 ? "Die wesentlichen Inhalte wurden sicher und prüfungsnah dargestellt." : average >= 2.5 ? "Die Grundlage ist vorhanden. Wiederhole jetzt gezielt die markierten Lücken." : "Wichtige Kernpunkte fehlen noch. Starte direkt eine Wiederholungsrunde."}` }]
        : [];
      const continuation: TutorTurn[] = sequentialMode && next && !sequentialFinished && !finishedWeakRound
        ? [{ role: "assistant", kind: "oral-follow-up", text: questionText(next, nextIndex), questionImage: next.image }]
        : [];
      return [...current, { role: "user", text: value }, assessedTurn, ...summary, ...continuation];
    });
    if (sequentialFinished) { setSimulationPhase("finished"); setExamPool([]); }
    else if (finishedWeakRound) { setExamPool([]); setReviewMode(false); }
    else setExamIndex(nextIndex);
    setInput("");
  };

  const continueEkgTraining = () => {
    if (pendingNextEkgIndex === null) return;
    const next = examPool[pendingNextEkgIndex];
    if (!next) { setPendingNextEkgIndex(null); return; }
    setExamIndex(pendingNextEkgIndex);
    setPendingNextEkgIndex(null);
    setTurns((current) => [...current, { role: "assistant", kind: "ekg-question", text: questionText(next, pendingNextEkgIndex), questionImage: neutralEkgImage(next) }]);
    setInput("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    if (mode === "question") askQuestion(value); else answerExam(value);
  };

  const toggleSpeech = () => {
    if (listening) { recognitionRef.current?.stop(); return; }
    const speechWindow = window as typeof window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) { setError("Die Spracheingabe wird von diesem Browser nicht unterstützt."); return; }
    const recognition = new Recognition();
    const base = input.trim();
    recognition.lang = "de-DE";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = 0; index < event.results.length; index += 1) transcript += `${event.results[index][0].transcript} `;
      setInput(`${base}${base ? " " : ""}${transcript.trim()}`.slice(0, 2500));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => { setListening(false); setError("Die Spracheingabe wurde unterbrochen. Du kannst deine Antwort weiterhin tippen."); };
    recognitionRef.current = recognition;
    setError(""); setListening(true); recognition.start();
  };

  return <>
    <div className="ai-tutor-launcher-group">
      <button className="ai-tutor-launcher" type="button" onClick={openTutor} aria-label="Kostenlosen Lernprüfer öffnen"><span>✶</span><b>Lernprüfer</b></button>
      <button className="ai-tutor-launcher-close" type="button" onClick={() => setDismissed(true)} aria-label="Lernprüfer ausblenden">×</button>
    </div>
    {open && <div className="ai-tutor-backdrop">
      <button className="ai-tutor-dismiss-layer" type="button" onClick={() => setOpen(false)} aria-label="Lernprüfer schließen" />
      <section ref={dialogRef} className="ai-tutor-dialog" role="dialog" aria-modal="true" aria-label="Kostenloser Lernprüfer" tabIndex={-1}>
        <header><div><small>KOSTENLOS · OHNE EXTERNE KI</small><h2>Lernprüfer</h2><p>{source?.title || "Kein Kapitel geöffnet"}</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Lernprüfer schließen">×</button></header>
        <div className="ai-tutor-tabs" role="tablist" aria-label="Trainingsart"><button type="button" role="tab" aria-selected={mode === "simulation"} className={mode === "simulation" ? "active" : ""} onClick={() => reset("simulation")}>Prüfungssimulation</button><button type="button" role="tab" aria-selected={mode === "vfa"} className={mode === "vfa" ? "active" : ""} onClick={() => reset("vfa")}>VFA-Prüfung</button><button type="button" role="tab" aria-selected={mode === "exam"} className={mode === "exam" ? "active" : ""} onClick={() => reset("exam")}>Mündliche Prüfung</button><button type="button" role="tab" aria-selected={mode === "image"} className={mode === "image" ? "active" : ""} onClick={() => reset("image")}>EKG-Training</button><button type="button" role="tab" aria-selected={mode === "question"} className={mode === "question" ? "active" : ""} onClick={() => reset("question")}>Lernchat</button></div>
        {!turns.length && source && <div className="ai-tutor-welcome"><span>{mode === "simulation" ? "20′" : mode === "vfa" ? "VFA" : mode === "exam" ? "01" : mode === "image" ? "EKG" : "?"}</span><div><h3>{mode === "simulation" ? "Komplette Prüfung starten" : mode === "vfa" ? "VFA-Prüfung starten" : mode === "exam" ? "Prüfung starten" : mode === "image" ? "EKG-Streifen trainieren" : "Im Lernmaterial suchen"}</h3><p>{mode === "simulation" ? "Du erhältst einen Fall, 20 Minuten Vorbereitungszeit und anschließend sechs bewertete Prüfungsschritte mit gezielten Nachfragen." : mode === "vfa" ? `Du erhältst bis zu sechs konkrete Einzelfragen aus dem hinterlegten VFA-Bestand ${VFA_VERSION}. Es werden keine Multiple-Choice-Texte als freie Frage verwendet; Zahlen werden zusammen mit ihrer Einheit geprüft.` : mode === "exam" ? "Der Lernprüfer bewertet deine freie Antwort und stellt danach passende Nachfragen zu Begründung, Differenzialdiagnosen, Komplikationen und Reevaluation. Synonyme und übliche Abkürzungen werden berücksichtigt." : mode === "image" ? "In diesem Modus erscheinen ausschließlich EKG-Streifen ohne eingeblendete Lösung. Benenne nur den Rhythmus oder das gefragte Ischämiemuster." : "Frage frei über den Lernstoff, zum Beispiel: „Nenne mir die Cushing-Trias“, „Erkläre Atropin“ oder „Wie wird Morphin aufgezogen?“."}</p>{mode !== "question" && <>{source.scope === "site" && mode !== "image" && <label className="ai-tutor-focus">{mode === "vfa" ? "VFA oder Krankheitsbild" : "Prüfungsthema"}<input maxLength={180} value={input} onChange={(event) => setInput(event.target.value)} placeholder="z. B. ACS, Anaphylaxie oder Krampfanfall" /></label>}<div className="ai-tutor-start-actions"><button type="button" disabled={source.scope === "site" && mode !== "image" && !input.trim()} onClick={startExam}>{mode === "simulation" ? "20-Minuten-Simulation starten →" : mode === "vfa" ? "VFA-Prüfung starten →" : mode === "image" ? "Ersten EKG-Streifen öffnen →" : "Erste Prüfungsfrage stellen →"}</button>{mode === "exam" && <button className="secondary" type="button" disabled={!weakEntries.length} onClick={startWeakReview}>Schwächen wiederholen{weakEntries.length ? ` (${weakEntries.length})` : ""}</button>}</div></>}</div></div>}
        <div className="ai-tutor-conversation" aria-live="polite">
          {turns.map((turn, index) => <article className={`${turn.role}${turn.kind ? ` ${turn.kind}` : ""}`} key={`${turn.role}-${index}`}><span>{turn.role === "assistant" ? "LP" : "Du"}</span><div><TutorMessageText text={turn.text} emphasize={turn.role === "assistant"} />{turn.ekgSolution && <figure className="ai-tutor-ekg-solution"><a href={turn.ekgSolution.image.src} target="_blank" rel="noreferrer"><img src={turn.ekgSolution.image.src} alt={`Aufgelöster EKG-Befund: ${turn.ekgSolution.label}`} loading="lazy" /></a><figcaption><b>{turn.ekgSolution.label}</b>{turn.ekgSolution.highlights.length > 0 && <div className="ai-tutor-lead-highlights">{turn.ekgSolution.highlights.map((highlight) => <div className={highlight.tone} key={`${highlight.tone}-${highlight.leads}`}><strong>{highlight.leads}</strong><span>{highlight.explanation}</span></div>)}</div>}</figcaption></figure>}{turn.questionImage && <figure className="ai-tutor-question-image"><a href={turn.questionImage.src} target="_blank" rel="noreferrer"><img src={turn.questionImage.src} alt={turn.questionImage.alt} loading="lazy" /></a><figcaption>{turn.questionImage.caption} · zum Vergrößern antippen</figcaption></figure>}{turn.vfaImages && turn.vfaImages.length > 0 && <div className="ai-tutor-vfa-grid">{turn.vfaImages.map((vfa) => <a href={vfa.src} target="_blank" rel="noreferrer" key={vfa.src}><img src={vfa.src} alt={vfa.title} loading="lazy" /><b>{vfa.title}</b><small>Zum Vergrößern öffnen ↗</small></a>)}</div>}{turn.role === "assistant" && turn.result && mode !== "question" && index > 0 && <div className="ai-tutor-feedback"><div className="ai-tutor-score"><b>{turn.result.score}/5</b><small>{mode === "image" ? "EKG-Befund" : "Kernpunkte"}</small></div>{turn.result.evaluation && <p>{turn.result.evaluation}</p>}{turn.result.dimensions && <div className="exam-dimension-grid">{turn.result.dimensions.map((dimension) => <div key={dimension.label}><span><b>{dimension.label}</b><strong>{dimension.score}/5</strong></span><i><em style={{ width: `${dimension.score * 20}%` }} /></i><small>{dimension.note}</small></div>)}</div>}{turn.result.strengths.length > 0 && <section><b>{mode === "image" ? "Befundbewertung" : "Das war enthalten"}</b><ul>{turn.result.strengths.map((point) => <li key={point}>{point}</li>)}</ul></section>}{turn.result.partial_points && turn.result.partial_points.length > 0 && <section className="partial"><b>Teilweise erkannt</b><ul>{turn.result.partial_points.map((point) => <li key={point}>{point}</li>)}</ul></section>}{turn.result.missing_points.length > 0 && <section className="missing"><b>{mode === "image" ? "Richtige Lösung" : "Das solltest du ergänzen"}</b><ul>{turn.result.missing_points.map((point) => <li key={point}>{point}</li>)}</ul></section>}</div>}{turn.role === "assistant" && turn.result?.source_basis && <small>Textgrundlage: {turn.result.source_basis}</small>}{turn.role === "assistant" && turn.result?.source_href && <a className="ai-tutor-source-link" href={turn.result.source_href}>Passendes Lernkapitel öffnen →</a>}</div></article>)}
          <div ref={endRef} />
        </div>
        {mode === "simulation" && simulationPhase === "prep" && <div className={`exam-preparation-bar ${prepRemaining === 0 ? "elapsed" : ""}`}><div><small>VORBEREITUNGSZEIT</small><b>{String(Math.floor(prepRemaining / 60)).padStart(2, "0")}:{String(prepRemaining % 60).padStart(2, "0")}</b><span>{prepRemaining > 0 ? "Notizen anfertigen und Fallvorstellung strukturieren." : "Die Vorbereitungszeit ist abgelaufen."}</span></div><button type="button" onClick={beginSimulationExam}>{prepRemaining > 0 ? "Prüfung vorzeitig beginnen" : "Mündliche Prüfung beginnen"} →</button></div>}
        {simulationPhase === "finished" && weakEntries.length > 0 && <div className="exam-review-action"><div><b>Lücken direkt festigen</b><span>Wiederhole jetzt nur die Fragen, die noch nicht sicher beantwortet wurden.</span></div><button type="button" onClick={startWeakReview}>Gezielte Wiederholung starten →</button></div>}
        {mode === "image" && pendingNextEkgIndex !== null && <div className="ai-tutor-next-ekg"><p>Sieh dir zuerst die Auflösung in Ruhe an.</p><button type="button" onClick={continueEkgTraining}>Nächsten EKG-Streifen öffnen →</button></div>}
        {source && simulationPhase !== "prep" && (mode === "question" || currentEntry && pendingNextEkgIndex === null) && <form className="ai-tutor-form" onSubmit={submit}><label htmlFor="ai-tutor-input">{mode === "question" ? "Deine Frage" : mode === "vfa" ? "Deine freie VFA-Antwort" : mode === "simulation" || mode === "exam" ? "Deine Antwort an den Prüfer" : mode === "image" ? "Dein EKG-Befund" : "Deine freie Antwort"}</label><div className="ai-tutor-input-wrap"><textarea id="ai-tutor-input" maxLength={2500} rows={4} value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === "question" ? "Stelle eine Wissensfrage zur NotSan-Prüfung …" : mode === "image" ? "Nur den Rhythmus oder das Ischämiemuster benennen …" : "Antworte so, wie du es in der mündlichen Prüfung erklären würdest …"} />{speechSupported && <button className={`ai-tutor-mic ${listening ? "listening" : ""}`} type="button" onClick={toggleSpeech} aria-pressed={listening} aria-label={listening ? "Spracheingabe beenden" : "Antwort einsprechen"}>{listening ? "■ Aufnahme stoppen" : "🎙 Antwort einsprechen"}</button>}</div><div><small>{input.length}/2500 · Keine echten Patientendaten eingeben.</small><button type="submit" disabled={!canSubmit}>{mode === "question" ? "Suchen →" : "Antwort prüfen →"}</button></div></form>}
        {error && <p className="ai-tutor-error" role="alert">{error}</p>}
        <footer><span>{knowledge.length} Lerninhalte · {weakEntries.length} in Wiederholung{sessionScores.length ? ` · Ø ${(sessionScores.reduce((sum, score) => sum + score, 0) / sessionScores.length).toFixed(1)}/5` : ""}</span><button type="button" onClick={() => reset()}>{mode === "question" ? "Chat leeren" : "Training zurücksetzen"}</button></footer>
      </section>
    </div>}
  </>;
}
