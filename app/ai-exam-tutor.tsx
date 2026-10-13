"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { freeTutorKnowledge, type FreeTutorKnowledge } from "./free-tutor-knowledge";

type TutorMode = "exam" | "question";
type TutorScope = "chapter" | "site";
type TutorResult = { evaluation: string; strengths: string[]; missing_points: string[]; score: number; source_basis: string };
type TutorTurn = { role: "user" | "assistant"; text: string; result?: TutorResult };
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
};

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

function rankedKnowledge(query: string) {
  return freeTutorKnowledge.map((entry) => ({ entry, score: scoreEntry(entry, query) })).filter((match) => match.score > 0).sort((a, b) => b.score - a.score);
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

function evaluateAnswer(entry: FreeTutorKnowledge, response: string): TutorResult {
  const expectedTerms = keyTerms(entry.answer);
  const matched = expectedTerms.filter((term) => containsToken(response, term));
  const missing = expectedTerms.filter((term) => !matched.includes(term));
  const ratio = expectedTerms.length ? matched.length / expectedTerms.length : 0;
  const detailBonus = response.trim().length >= 120 ? 1 : 0;
  const score = Math.max(0, Math.min(5, Math.round(ratio * 5) + detailBonus));
  return {
    evaluation: `Deine Antwort deckt ${matched.length} von ${expectedTerms.length} zentralen Lernbegriffen ab. Vergleiche sie mit der eingeblendeten Musterlösung; diese automatische Wortauswertung ersetzt keine fachliche Korrektur durch Lehrkräfte.`,
    strengths: matched.length ? [`Erkannt: ${matched.slice(0, 5).join(", ")}`] : [],
    missing_points: missing.length ? [`Noch prüfen: ${missing.slice(0, 6).join(", ")}`] : [],
    score,
    source_basis: `Karteikarte · ${entry.topic} · ${entry.area}`,
  };
}

function chooseExamPool(focus: string) {
  const ranked = rankedKnowledge(focus);
  const focused = ranked.filter((match) => match.score >= Math.max(12, (ranked[0]?.score || 0) * 0.35)).map((match) => match.entry);
  const pool = focused.length >= 2 ? focused : freeTutorKnowledge;
  const offset = Math.floor(Math.random() * pool.length);
  return [...pool.slice(offset), ...pool.slice(0, offset)].slice(0, 20);
}

export default function AiExamTutor({ active, siteOverview }: { active: boolean; siteOverview: string }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mode, setMode] = useState<TutorMode>("exam");
  const [source, setSource] = useState<LearningSource | null>(null);
  const [turns, setTurns] = useState<TutorTurn[]>([]);
  const [examPool, setExamPool] = useState<FreeTutorKnowledge[]>([]);
  const [examIndex, setExamIndex] = useState(0);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
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
  if (!active || dismissed) return null;

  const openTutor = () => {
    const chapter = collectLearningMaterial(siteOverview);
    if (chapter?.title !== source?.title) { setTurns([]); setExamPool([]); setExamIndex(0); setInput(""); }
    setSource(chapter);
    setError(chapter ? "" : "Die Lerninhalte konnten auf dieser Seite nicht geladen werden.");
    setOpen(true);
  };

  const reset = (nextMode: TutorMode = mode) => {
    setMode(nextMode); setTurns([]); setExamPool([]); setExamIndex(0); setInput(""); setError(""); setSource(collectLearningMaterial(siteOverview));
  };

  const startExam = () => {
    if (!source) return;
    const pool = chooseExamPool(input.trim() || source.title);
    const first = pool[0];
    setExamPool(pool); setExamIndex(0); setTurns(first ? [{ role: "assistant", text: first.question }] : []); setInput(""); setError(first ? "" : "Zu diesem Schwerpunkt wurden keine Lernkarten gefunden.");
  };

  const askQuestion = (value: string) => {
    if (!source) return;
    const match = rankedKnowledge(value)[0];
    let text = "";
    let sourceBasis = "";
    if (match && match.score >= 16) { text = match.entry.answer; sourceBasis = `Karteikarte · ${match.entry.topic} · ${match.entry.area}`; }
    else { text = materialAnswer(source.material, value); sourceBasis = `${source.title} · sichtbarer Lesetext`; }
    if (!text) { text = "Dazu finde ich im hinterlegten Lernmaterial keinen eindeutigen Treffer. Öffne bitte das passende Kapitel und formuliere die Frage mit einem konkreten Fachbegriff erneut."; sourceBasis = "Kein sicherer Treffer"; }
    setTurns((current) => [...current, { role: "user", text: value }, { role: "assistant", text, result: { evaluation: "", strengths: [], missing_points: [], score: 0, source_basis: sourceBasis } }]);
    setInput("");
  };

  const answerExam = (value: string) => {
    if (!currentEntry) return;
    const result = evaluateAnswer(currentEntry, value);
    const nextIndex = examPool.length > 1 ? (examIndex + 1) % examPool.length : examIndex;
    const next = examPool[nextIndex];
    const response = `Musterlösung:\n${currentEntry.answer}${next ? `\n\nNächste Frage:\n${next.question}` : ""}`;
    setTurns((current) => [...current, { role: "user", text: value }, { role: "assistant", text: response, result }]);
    setExamIndex(nextIndex); setInput("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    if (mode === "exam") answerExam(value); else askQuestion(value);
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
        <div className="ai-tutor-tabs" role="tablist" aria-label="Trainingsart"><button type="button" role="tab" aria-selected={mode === "exam"} className={mode === "exam" ? "active" : ""} onClick={() => reset("exam")}>Mündliche Prüfung</button><button type="button" role="tab" aria-selected={mode === "question"} className={mode === "question" ? "active" : ""} onClick={() => reset("question")}>Lernchat</button></div>
        {!turns.length && source && <div className="ai-tutor-welcome"><span>{mode === "exam" ? "01" : "?"}</span><div><h3>{mode === "exam" ? "Prüfung starten" : "Im Lernmaterial suchen"}</h3><p>{mode === "exam" ? "Der Lernprüfer nutzt die hinterlegten Karteikarten, prüft zentrale Begriffe und zeigt danach die Musterlösung." : "Frage frei über den Lernstoff, zum Beispiel: „Nenne mir die Cushing-Trias“ oder „Erkläre die Sauerstoffformel“."}</p>{mode === "exam" && <>{source.scope === "site" && <label className="ai-tutor-focus">Prüfungsthema<input maxLength={180} value={input} onChange={(event) => setInput(event.target.value)} placeholder="z. B. ACS, Hygiene oder Rechtskunde" /></label>}<button type="button" disabled={source.scope === "site" && !input.trim()} onClick={startExam}>Erste Prüfungsfrage stellen →</button></>}</div></div>}
        <div className="ai-tutor-conversation" aria-live="polite">
          {turns.map((turn, index) => <article className={turn.role} key={`${turn.role}-${index}`}><span>{turn.role === "assistant" ? "LP" : "Du"}</span><div><p>{turn.text}</p>{turn.role === "assistant" && turn.result && mode === "exam" && index > 0 && <div className="ai-tutor-feedback"><div className="ai-tutor-score"><b>{turn.result.score}/5</b><small>Begriffscheck</small></div>{turn.result.evaluation && <p>{turn.result.evaluation}</p>}{turn.result.strengths.length > 0 && <section><b>Das war enthalten</b><ul>{turn.result.strengths.map((point) => <li key={point}>{point}</li>)}</ul></section>}{turn.result.missing_points.length > 0 && <section className="missing"><b>Das solltest du prüfen</b><ul>{turn.result.missing_points.map((point) => <li key={point}>{point}</li>)}</ul></section>}</div>}{turn.role === "assistant" && turn.result?.source_basis && <small>Textgrundlage: {turn.result.source_basis}</small>}</div></article>)}
          <div ref={endRef} />
        </div>
        {source && (mode === "question" || currentEntry) && <form className="ai-tutor-form" onSubmit={submit}><label htmlFor="ai-tutor-input">{mode === "exam" ? "Deine freie Antwort" : "Deine Frage"}</label><textarea id="ai-tutor-input" maxLength={2500} rows={4} value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === "exam" ? "Antworte so, wie du es in der mündlichen Prüfung erklären würdest …" : "Stelle eine Wissensfrage zur NotSan-Prüfung …"} /><div><small>{input.length}/2500 · Keine echten Patientendaten eingeben.</small><button type="submit" disabled={!canSubmit}>{mode === "exam" ? "Antwort prüfen →" : "Suchen →"}</button></div></form>}
        {error && <p className="ai-tutor-error" role="alert">{error}</p>}
        <footer><span>Lokale Lernhilfe: keine API-Kosten, keine extern übertragenen Fragen.</span><button type="button" onClick={() => reset()}>{mode === "exam" ? "Training zurücksetzen" : "Chat leeren"}</button></footer>
      </section>
    </div>}
  </>;
}
