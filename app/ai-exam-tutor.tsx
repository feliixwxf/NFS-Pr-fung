"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { getSupabaseClient } from "./lib/supabaseClient";

type TutorMode = "exam" | "question";
type TutorScope = "chapter" | "site";
type TutorResult = {
  message: string;
  evaluation: string;
  strengths: string[];
  missing_points: string[];
  score: number;
  next_question: string;
  source_basis: string;
};
type TutorTurn = { role: "user" | "assistant"; text: string; result?: TutorResult };

function collectLearningMaterial(siteOverview: string) {
  const chapter = document.querySelector<HTMLElement>(".topic-reader, .communication-reader");
  const source = chapter || document.querySelector<HTMLElement>(".main-content");
  if (!source) return null;
  const clone = source.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("button, .study-finale, .chapter-completion, .ai-question-panel, .legal-sources, .lesson-source-note").forEach((node) => node.remove());
  const title = chapter ? source.querySelector(".reader-hero h1, .communication-hero h1, h1")?.textContent?.trim() || "Aktuelles Lernkapitel" : "Gesamte Prüfungsvorbereitung";
  const scope: TutorScope = chapter ? "chapter" : "site";
  const visibleText = (clone.textContent || "").replace(/\s+/g, " ").trim();
  const material = `${scope === "site" ? `${siteOverview}\n\nAktuell sichtbare Seite:\n` : ""}${visibleText}`.slice(0, 38_000);
  return material.length >= 100 ? { title, material, scope } : null;
}

export default function AiExamTutor({ active, siteOverview }: { active: boolean; siteOverview: string }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mode, setMode] = useState<TutorMode>("exam");
  const [source, setSource] = useState<{ title: string; material: string; scope: TutorScope } | null>(null);
  const [turns, setTurns] = useState<TutorTurn[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const canSubmit = Boolean(input.trim() && source && !busy);
  const hasStartedExam = mode === "exam" && Boolean(currentQuestion);
  const history = useMemo(() => turns.slice(-8).map((turn) => ({ role: turn.role, text: turn.text })), [turns]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    window.setTimeout(() => dialogRef.current?.focus(), 0);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", closeOnEscape); };
  }, [open]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [turns, busy]);

  if (!active || dismissed) return null;

  const openTutor = () => {
    const chapter = collectLearningMaterial(siteOverview);
    if (chapter?.title !== source?.title) {
      setTurns([]);
      setCurrentQuestion("");
      setInput("");
    }
    setSource(chapter);
    setError(chapter ? "" : "Die Lerninhalte konnten auf dieser Seite nicht geladen werden.");
    setOpen(true);
  };

  const reset = (nextMode: TutorMode = mode) => {
    setMode(nextMode);
    setTurns([]);
    setCurrentQuestion("");
    setInput("");
    setError("");
    setSource(collectLearningMaterial(siteOverview));
  };

  const requestTutor = async (action: "ask" | "start" | "answer", value = "") => {
    if (!source || busy) return;
    setBusy(true);
    setError("");
    if (value) setTurns((current) => [...current, { role: "user", text: value }]);
    try {
      const session = await getSupabaseClient()?.auth.getSession();
      const token = session?.data.session?.access_token;
      const response = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ mode, action, scope: source.scope, topic: source.title, material: source.material, input: value, currentQuestion, history }),
      });
      const result = await response.json().catch(() => ({})) as TutorResult & { error?: string };
      if (!response.ok) throw new Error(result.error || "Der KI-Prüfungstrainer konnte nicht antworten.");
      const displayText = mode === "exam" ? result.next_question || result.message : result.message;
      setTurns((current) => [...current, { role: "assistant", text: displayText, result }]);
      if (mode === "exam") setCurrentQuestion(result.next_question);
      setInput("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Der KI-Prüfungstrainer konnte nicht antworten.");
    } finally {
      setBusy(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    void requestTutor(mode === "exam" ? "answer" : "ask", value);
  };

  return <>
    <div className="ai-tutor-launcher-group">
      <button className="ai-tutor-launcher" type="button" onClick={openTutor} aria-label="KI-Prüfungstrainer öffnen"><span>✦</span><b>KI‑Prüfer</b></button>
      <button className="ai-tutor-launcher-close" type="button" onClick={() => setDismissed(true)} aria-label="KI-Prüfungstrainer ausblenden">×</button>
    </div>
    {open && <div className="ai-tutor-backdrop">
      <button className="ai-tutor-dismiss-layer" type="button" onClick={() => setOpen(false)} aria-label="KI-Prüfungstrainer schließen" />
      <section ref={dialogRef} className="ai-tutor-dialog" role="dialog" aria-modal="true" aria-label="KI-Prüfungstrainer" tabIndex={-1}>
        <header><div><small>TEXTGEBUNDENER LERNASSISTENT</small><h2>KI‑Prüfungstrainer</h2><p>{source?.title || "Kein Kapitel geöffnet"}</p></div><button type="button" onClick={() => setOpen(false)} aria-label="KI-Prüfungstrainer schließen">×</button></header>
        <div className="ai-tutor-tabs" role="tablist" aria-label="Trainingsart"><button type="button" role="tab" aria-selected={mode === "exam"} className={mode === "exam" ? "active" : ""} onClick={() => reset("exam")}>Mündliche Prüfung</button><button type="button" role="tab" aria-selected={mode === "question"} className={mode === "question" ? "active" : ""} onClick={() => reset("question")}>Frage zum Kapitel</button></div>
        {!turns.length && source && <div className="ai-tutor-welcome"><span>{mode === "exam" ? "01" : "?"}</span><div><h3>{mode === "exam" ? "Prüfung starten" : source.scope === "chapter" ? "Kapitel gezielt befragen" : "Lernstoff gezielt befragen"}</h3><p>{mode === "exam" ? "Der Prüfer stellt offene Fragen, bewertet deine Textantwort und fragt anschließend weiter." : source.scope === "chapter" ? "Die Antwort wird ausschließlich aus dem aktuell geöffneten Kapitel abgeleitet." : "Stelle eine Frage zur Prüfungsvorbereitung. Kapiteltexte und bereitgestellte Themen haben Vorrang."}</p>{mode === "exam" && <>{source.scope === "site" && <label className="ai-tutor-focus">Prüfungsthema<input maxLength={180} value={input} onChange={(event) => setInput(event.target.value)} placeholder="z. B. ACS, Hygiene oder Rechtskunde" /></label>}<button type="button" disabled={busy || source.scope === "site" && !input.trim()} onClick={() => void requestTutor("start", source.scope === "site" ? input.trim() : "")}>{busy ? "Frage wird erstellt …" : "Erste Prüfungsfrage stellen →"}</button></>}</div></div>}
        <div className="ai-tutor-conversation" aria-live="polite">
          {turns.map((turn, index) => <article className={turn.role} key={`${turn.role}-${index}`}><span>{turn.role === "assistant" ? "KI" : "Du"}</span><div><p>{turn.text}</p>{turn.role === "assistant" && turn.result && mode === "exam" && index > 0 && <div className="ai-tutor-feedback"><div className="ai-tutor-score"><b>{turn.result.score}/5</b><small>Bewertung</small></div>{turn.result.evaluation && <p>{turn.result.evaluation}</p>}{turn.result.strengths.length > 0 && <section><b>Das war gut</b><ul>{turn.result.strengths.map((point) => <li key={point}>{point}</li>)}</ul></section>}{turn.result.missing_points.length > 0 && <section className="missing"><b>Das fehlt noch</b><ul>{turn.result.missing_points.map((point) => <li key={point}>{point}</li>)}</ul></section>}</div>}{turn.role === "assistant" && turn.result?.source_basis && <small>Textgrundlage: {turn.result.source_basis}</small>}</div></article>)}
          {busy && turns.length > 0 && <div className="ai-tutor-thinking"><i /><i /><i /><span>Antwort wird geprüft …</span></div>}
          <div ref={endRef} />
        </div>
        {source && (mode === "question" || hasStartedExam) && <form className="ai-tutor-form" onSubmit={submit}><label htmlFor="ai-tutor-input">{mode === "exam" ? "Deine freie Antwort" : "Deine Frage zum Kapitel"}</label><textarea id="ai-tutor-input" maxLength={2500} rows={4} value={input} disabled={busy} onChange={(event) => setInput(event.target.value)} placeholder={mode === "exam" ? "Antworte so, wie du es in der mündlichen Prüfung erklären würdest …" : "Was möchtest du zu diesem Kapitel wissen?"} /><div><small>{input.length}/2500 · Keine echten Patientendaten eingeben.</small><button type="submit" disabled={!canSubmit}>{busy ? "Wird geprüft …" : mode === "exam" ? "Antwort prüfen →" : "Frage senden →"}</button></div></form>}
        {error && <p className="ai-tutor-error" role="alert">{error}</p>}
        <footer><span>Antworten können Fehler enthalten.</span><button type="button" onClick={() => reset()}>Training zurücksetzen</button></footer>
      </section>
    </div>}
  </>;
}
