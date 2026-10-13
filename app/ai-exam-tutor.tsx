"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { freeTutorKnowledge, type FreeTutorKnowledge } from "./free-tutor-knowledge";
import { vfaLibrary, type VfaReference } from "./vfa-library";

type TutorMode = "exam" | "case" | "question";
type TutorScope = "chapter" | "site";
type TutorResult = { evaluation: string; strengths: string[]; missing_points: string[]; score: number; source_basis: string };
type TutorTurn = { role: "user" | "assistant"; text: string; result?: TutorResult; vfaImages?: readonly VfaReference[] };
type LearningSource = { title: string; material: string; scope: TutorScope };

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
  return material.length >= 100 ? { title, material, scope } : null;
}

function materialAnswer(material: string, query: string) {
  const queryTokens = tokens(query);
  if (!queryTokens.length) return "";
  const sentences = material.split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter((sentence) => sentence.length >= 35 && sentence.length <= 420);
  return sentences.map((sentence) => ({ sentence, score: queryTokens.filter((token) => containsToken(sentence, token)).length })).filter((match) => match.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map((match) => match.sentence).join(" ");
}

function keyTerms(answer: string) {
  return tokens(answer).filter((word) => word.length >= 5 && !["dabei", "durch", "diese", "einem", "einen", "einer", "folgen", "kann", "sowie", "werden"].includes(word)).sort((a, b) => b.length - a.length).slice(0, 12);
}

function includesConcept(response: string, term: string) {
  if (containsToken(response, term)) return true;
  const normalizedTerm = normalize(term);
  const group = CONCEPT_SYNONYMS.find((items) => items.some((item) => normalize(item) === normalizedTerm));
  return Boolean(group?.some((item) => normalize(response).includes(normalize(item))));
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

const IMPORTANT_TEXT_PATTERN = /(\b(?:Wirkung|Wechselwirkungen?|Kontraindikationen?|Nebenwirkungen?|Dosierung|Zubereitung|Reanimation|Atemweg|Atmung|Kreislauf|Bewusstsein|Bradykardie|Tachykardie|Hypotonie|Hypertonie|Dyspnoe|Atemdepression|Kammerflimmern|Blutung|Schock|ROSC|cABCDE|ABCDE|SAMPLER|OPQRST|GCS|SpO₂|SpO2|etCO₂|etCO2)\b|\b\d+(?:[.,]\d+)?\s?(?:mg|µg|g|ml|l|min|mmHg|cmH₂O|J|IE|%)(?:\/(?:kgKG|kg|h|min))?\b)/gi;

function emphasizeImportantText(text: string) {
  return text.split(IMPORTANT_TEXT_PATTERN).map((part, index) =>
    !part ? null : index % 2 === 1 ? <strong className="message-key" key={`${part}-${index}`}>{part}</strong> : part,
  );
}

function TutorMessageText({ text, emphasize = false }: { text: string; emphasize?: boolean }) {
  const headings = new Set(["antwort", "fachliche begründung", "musterlösung", "warum diese antwort?", "nächste frage", "weiter im fall"]);
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
    const required = Math.min(2, Math.max(1, Math.ceil(point.terms.length * 0.35)));
    return { ...point, covered: hits.length >= required, hits };
  });
  const covered = points.filter((point) => point.covered);
  const missing = points.filter((point) => !point.covered);
  const ratio = points.length ? covered.length / points.length : 0;
  const score = Math.max(0, Math.min(5, Math.round(ratio * 5)));
  const verdict = score >= 4 ? "fachlich weitgehend vollständig" : score >= 2 ? "in wichtigen Teilen richtig, aber noch lückenhaft" : "noch deutlich zu ergänzen";
  return {
    evaluation: `Deine Antwort ist ${verdict}. ${covered.length} von ${points.length} inhaltlichen Kernpunkten wurden erkannt. Synonyme und gebräuchliche Abkürzungen werden mitbewertet; die automatische Rückmeldung ersetzt dennoch keine Lehrkraft.`,
    strengths: covered.slice(0, 4).map((point) => shortenPoint(point.text)),
    missing_points: missing.slice(0, 5).map((point) => shortenPoint(point.text)),
    score,
    source_basis: `Lernbestand · ${entry.topic} · ${entry.area}`,
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
  ];
  return scenarios.find(([terms]) => terms.some((term) => normalizedTopic.includes(term)))?.[1]
    || `Du übernimmst einen Patienten mit einem rettungsdienstlichen Beschwerdebild aus dem Themengebiet „${topic}“. Die Lage soll strukturiert beurteilt und begründet versorgt werden.`;
}

function chooseExamPool(focus: string, knowledge: readonly FreeTutorKnowledge[]) {
  const ranked = rankedKnowledge(focus, knowledge);
  const focused = ranked.filter((match) => match.score >= Math.max(12, (ranked[0]?.score || 0) * 0.35)).map((match) => match.entry);
  const pool = focused.length >= 2 ? focused : [...knowledge];
  const offset = Math.floor(Math.random() * pool.length);
  return [...pool.slice(offset), ...pool.slice(0, offset)].slice(0, 20);
}

export default function AiExamTutor({ active, siteOverview, additionalKnowledge = [] }: { active: boolean; siteOverview: string; additionalKnowledge?: readonly FreeTutorKnowledge[] }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mode, setMode] = useState<TutorMode>("exam");
  const [source, setSource] = useState<LearningSource | null>(null);
  const [turns, setTurns] = useState<TutorTurn[]>([]);
  const [examPool, setExamPool] = useState<FreeTutorKnowledge[]>([]);
  const [examIndex, setExamIndex] = useState(0);
  const [weakEntryIds, setWeakEntryIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(window.localStorage.getItem("notsan-tutor-weak-entries") || "[]");
      return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string") : [];
    } catch { return []; }
  });
  const [reviewMode, setReviewMode] = useState(false);
  const [sessionScores, setSessionScores] = useState<number[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
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
    try { window.localStorage.setItem("notsan-tutor-weak-entries", JSON.stringify(weakEntryIds)); } catch { /* Privater Browsermodus kann localStorage sperren. */ }
  }, [weakEntryIds]);
  if (!active || dismissed) return null;

  const openTutor = () => {
    const chapter = collectLearningMaterial(siteOverview);
    if (chapter?.title !== source?.title) { setTurns([]); setExamPool([]); setExamIndex(0); setInput(""); setReviewMode(false); setSessionScores([]); }
    setSource(chapter);
    setError(chapter ? "" : "Die Lerninhalte konnten auf dieser Seite nicht geladen werden.");
    setOpen(true);
  };

  const reset = (nextMode: TutorMode = mode) => {
    setMode(nextMode); setTurns([]); setExamPool([]); setExamIndex(0); setInput(""); setError(""); setReviewMode(false); setSessionScores([]); setSource(collectLearningMaterial(siteOverview));
  };

  const questionText = (entry: FreeTutorKnowledge, index: number) => mode === "case"
    ? `${index === 0 ? `Fallbeispiel – ${entry.topic}\n${caseScenario(entry.topic)}\n\n` : `Fallfortsetzung · Frage ${index + 1}\n`}${entry.question}`
    : entry.question;

  const startExam = () => {
    if (!source) return;
    const pool = chooseExamPool(input.trim() || source.title, knowledge);
    const first = pool[0];
    setReviewMode(false); setSessionScores([]); setExamPool(pool); setExamIndex(0); setTurns(first ? [{ role: "assistant", text: questionText(first, 0) }] : []); setInput(""); setError(first ? "" : "Zu diesem Schwerpunkt wurden keine Lernkarten gefunden.");
  };

  const startWeakReview = () => {
    if (!source || !weakEntries.length) return;
    const offset = Math.floor(Math.random() * weakEntries.length);
    const pool = [...weakEntries.slice(offset), ...weakEntries.slice(0, offset)];
    setReviewMode(true); setSessionScores([]); setExamPool(pool); setExamIndex(0); setTurns([{ role: "assistant", text: pool[0].question }]); setInput(""); setError("");
  };

  const askQuestion = (value: string) => {
    if (!source) return;
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
    if (match && match.score >= 16) { text = structuredKnowledgeAnswer(match.entry); sourceBasis = `Lernbestand · ${match.entry.topic} · ${match.entry.area}`; }
    else { text = materialAnswer(source.material, value); sourceBasis = `${source.title} · sichtbarer Lesetext`; }
    if (!text) { text = "Dazu finde ich im hinterlegten Lernmaterial keinen eindeutigen Treffer. Öffne bitte das passende Kapitel und formuliere die Frage mit einem konkreten Fachbegriff erneut."; sourceBasis = "Kein sicherer Treffer"; }
    setTurns((current) => [...current, { role: "user", text: value }, { role: "assistant", text, result: { evaluation: "", strengths: [], missing_points: [], score: 0, source_basis: sourceBasis } }]);
    setInput("");
  };

  const answerExam = (value: string) => {
    if (!currentEntry) return;
    const result = evaluateAnswer(currentEntry, value);
    setWeakEntryIds((current) => result.score <= 3
      ? [...new Set([...current, currentEntry.id])]
      : current.filter((id) => id !== currentEntry.id));
    setSessionScores((current) => [...current, result.score]);
    const nextIndex = examPool.length > 1 ? (examIndex + 1) % examPool.length : examIndex;
    const next = examPool[nextIndex];
    const finishedWeakRound = reviewMode && nextIndex === 0;
    const response = `Musterlösung\n${currentEntry.answer.replace(/\n\n(?:Begründung|Warum):\s*[\s\S]+$/i, "").trim()}\n\nWarum diese Antwort?\n${answerRationale(currentEntry)}${next && !finishedWeakRound ? `\n\n${mode === "case" ? "Weiter im Fall" : "Nächste Frage"}\n${questionText(next, nextIndex)}` : finishedWeakRound ? "\n\nWiederholungsrunde beendet. Sicher beantwortete Inhalte wurden aus deiner Schwächenliste entfernt." : ""}`;
    setTurns((current) => [...current, { role: "user", text: value }, { role: "assistant", text: response, result }]);
    if (finishedWeakRound) { setExamPool([]); setReviewMode(false); }
    else setExamIndex(nextIndex);
    setInput("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    if (mode === "question") askQuestion(value); else answerExam(value);
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
        <div className="ai-tutor-tabs" role="tablist" aria-label="Trainingsart"><button type="button" role="tab" aria-selected={mode === "exam"} className={mode === "exam" ? "active" : ""} onClick={() => reset("exam")}>Mündliche Prüfung</button><button type="button" role="tab" aria-selected={mode === "case"} className={mode === "case" ? "active" : ""} onClick={() => reset("case")}>Fallbeispiel</button><button type="button" role="tab" aria-selected={mode === "question"} className={mode === "question" ? "active" : ""} onClick={() => reset("question")}>Lernchat</button></div>
        {!turns.length && source && <div className="ai-tutor-welcome"><span>{mode === "exam" ? "01" : mode === "case" ? "F" : "?"}</span><div><h3>{mode === "exam" ? "Prüfung starten" : mode === "case" ? "Falltraining starten" : "Im Lernmaterial suchen"}</h3><p>{mode === "exam" ? "Der Lernprüfer bewertet deine freie Antwort anhand inhaltlicher Kernpunkte. Synonyme und übliche Abkürzungen werden berücksichtigt." : mode === "case" ? "Du erhältst eine Einsatzlage und beantwortest dazu nacheinander fachliche Fragen. Fehlende Kernpunkte landen automatisch in deiner Wiederholung." : "Frage frei über den Lernstoff, zum Beispiel: „Nenne mir die Cushing-Trias“, „Erkläre Atropin“ oder „Wie wird Morphin aufgezogen?“."}</p>{mode !== "question" && <>{source.scope === "site" && <label className="ai-tutor-focus">{mode === "case" ? "Fallthema" : "Prüfungsthema"}<input maxLength={180} value={input} onChange={(event) => setInput(event.target.value)} placeholder="z. B. ACS, Hygiene oder Rechtskunde" /></label>}<div className="ai-tutor-start-actions"><button type="button" disabled={source.scope === "site" && !input.trim()} onClick={startExam}>{mode === "case" ? "Fallbeispiel starten →" : "Erste Prüfungsfrage stellen →"}</button>{mode === "exam" && <button className="secondary" type="button" disabled={!weakEntries.length} onClick={startWeakReview}>Schwächen wiederholen{weakEntries.length ? ` (${weakEntries.length})` : ""}</button>}</div></>}</div></div>}
        <div className="ai-tutor-conversation" aria-live="polite">
          {turns.map((turn, index) => <article className={turn.role} key={`${turn.role}-${index}`}><span>{turn.role === "assistant" ? "LP" : "Du"}</span><div><TutorMessageText text={turn.text} emphasize={turn.role === "assistant"} />{turn.vfaImages && turn.vfaImages.length > 0 && <div className="ai-tutor-vfa-grid">{turn.vfaImages.map((vfa) => <a href={vfa.src} target="_blank" rel="noreferrer" key={vfa.src}><img src={vfa.src} alt={vfa.title} loading="lazy" /><b>{vfa.title}</b><small>Zum Vergrößern öffnen ↗</small></a>)}</div>}{turn.role === "assistant" && turn.result && mode !== "question" && index > 0 && <div className="ai-tutor-feedback"><div className="ai-tutor-score"><b>{turn.result.score}/5</b><small>Kernpunkte</small></div>{turn.result.evaluation && <p>{turn.result.evaluation}</p>}{turn.result.strengths.length > 0 && <section><b>Das war enthalten</b><ul>{turn.result.strengths.map((point) => <li key={point}>{point}</li>)}</ul></section>}{turn.result.missing_points.length > 0 && <section className="missing"><b>Das solltest du ergänzen</b><ul>{turn.result.missing_points.map((point) => <li key={point}>{point}</li>)}</ul></section>}</div>}{turn.role === "assistant" && turn.result?.source_basis && <small>Textgrundlage: {turn.result.source_basis}</small>}</div></article>)}
          <div ref={endRef} />
        </div>
        {source && (mode === "question" || currentEntry) && <form className="ai-tutor-form" onSubmit={submit}><label htmlFor="ai-tutor-input">{mode === "question" ? "Deine Frage" : mode === "case" ? "Deine Antwort zum Fall" : "Deine freie Antwort"}</label><textarea id="ai-tutor-input" maxLength={2500} rows={4} value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === "question" ? "Stelle eine Wissensfrage zur NotSan-Prüfung …" : "Antworte so, wie du es in der mündlichen Prüfung erklären würdest …"} /><div><small>{input.length}/2500 · Keine echten Patientendaten eingeben.</small><button type="submit" disabled={!canSubmit}>{mode === "question" ? "Suchen →" : "Antwort prüfen →"}</button></div></form>}
        {error && <p className="ai-tutor-error" role="alert">{error}</p>}
        <footer><span>{knowledge.length} Lerninhalte · {weakEntries.length} in Wiederholung{sessionScores.length ? ` · Ø ${(sessionScores.reduce((sum, score) => sum + score, 0) / sessionScores.length).toFixed(1)}/5` : ""}</span><button type="button" onClick={() => reset()}>{mode === "question" ? "Chat leeren" : "Training zurücksetzen"}</button></footer>
      </section>
    </div>}
  </>;
}
