"use client";

import { useEffect, useMemo, useState } from "react";
import { organisationQuestions } from "./organisation-data";
import { diagnostikQuestions } from "./diagnostik-data";
import { rechtskundeQuestions } from "./rechtskunde-data";
import { qmQuestions } from "./qm-data";
import { hygieneQuestions } from "./hygiene-data";
import { kommunikationQuestions } from "./kommunikation-data";
import { terminologyQuestions } from "./terminologie-data";
import { schockQuestions } from "./schock-data";
import { polytraumaQuestions } from "./polytrauma-data";
import { anaphylaxieQuestions } from "./anaphylaxie-data";
import { myokardinfarktQuestions } from "./myokardinfarkt-data";
import { herzrhythmusstoerungenQuestions } from "./herzrhythmusstoerungen-data";
import { bronchoQuestions } from "./bronchoobstruktion-data";
import { krampfanfallQuestions } from "./krampfanfall-data";

type ExamOption = { text: string; correct?: boolean };
type ExamQuestion = {
  id: string;
  prompt: string;
  options: ExamOption[];
  source: string;
  difficulty: 1 | 2 | 3;
  mode?: "single" | "multiple";
};

type ExamDefinition = {
  id: "tag-1" | "tag-2" | "tag-3";
  day: string;
  title: string;
  subtitle: string;
  topics: string[];
  banks: ExamQuestion[][];
};

type StoredAttempt = {
  attempt: number;
  startedAt: number;
  current: number;
  answers: Record<string, number[]>;
  submittedAt?: number;
};

const EXAM_DURATION_SECONDS = 120 * 60;
const EXAM_QUESTION_COUNT = 30;
const STORAGE_PREFIX = "notsan-written-exam-v1";

const EXAMS: ExamDefinition[] = [
  {
    id: "tag-1",
    day: "Prüfungstag 1",
    title: "Einsatz und Gefahrenabwehr",
    subtitle: "Erstversorgung planen, Gefahren beherrschen und Algorithmen situationsgerecht anwenden.",
    topics: ["Einsatzablauf", "Gefahren", "cABCDE", "Trauma", "MANV"],
    banks: [organisationQuestions, schockQuestions, polytraumaQuestions, anaphylaxieQuestions],
  },
  {
    id: "tag-2",
    day: "Prüfungstag 2",
    title: "Diagnostik und Therapie",
    subtitle: "Befunde einordnen, bei Therapie mitwirken und lebensrettende Maßnahmen sicher priorisieren.",
    topics: ["Diagnostik", "Reanimation", "EKG", "Atmung", "Neurologie"],
    banks: [diagnostikQuestions, myokardinfarktQuestions, herzrhythmusstoerungenQuestions, bronchoQuestions, krampfanfallQuestions, anaphylaxieQuestions],
  },
  {
    id: "tag-3",
    day: "Prüfungstag 3",
    title: "Recht, Qualität und Rahmenbedingungen",
    subtitle: "Berufliches Handeln rechtlich, qualitativ, kommunikativ und ressourcenbewusst begründen.",
    topics: ["Recht", "Qualitätsmanagement", "Hygiene", "Kommunikation", "Fachsprache"],
    banks: [rechtskundeQuestions, qmQuestions, hygieneQuestions, kommunikationQuestions, terminologyQuestions],
  },
];

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function seededShuffle<T>(items: T[], seedText: string) {
  const result = [...items];
  let seed = hash(seedText) || 1;
  const random = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 4294967296;
  };
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function buildExamQuestions(exam: ExamDefinition, attempt: number) {
  const banks = exam.banks.map((bank, index) => seededShuffle(bank, `${exam.id}-${attempt}-${index}`));
  const questions: ExamQuestion[] = [];
  let row = 0;
  while (questions.length < EXAM_QUESTION_COUNT) {
    let added = false;
    banks.forEach((bank) => {
      const question = bank[row];
      if (question && questions.length < EXAM_QUESTION_COUNT && !questions.some((entry) => entry.id === question.id)) {
        questions.push(question);
        added = true;
      }
    });
    if (!added) break;
    row += 1;
  }
  return seededShuffle(questions, `${exam.id}-${attempt}-all-topics`);
}

function readAttempt(examId: ExamDefinition["id"]): StoredAttempt | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}:${examId}`);
    return raw ? JSON.parse(raw) as StoredAttempt : null;
  } catch {
    return null;
  }
}

function formatTime(totalSeconds: number) {
  const seconds = Math.max(0, totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function sameSelection(left: number[] = [], right: number[] = []) {
  return left.length === right.length && [...left].sort((a, b) => a - b).every((value, index) => value === [...right].sort((a, b) => a - b)[index]);
}

export default function WrittenStateExam({ onBack }: { onBack: () => void }) {
  const [selectedId, setSelectedId] = useState<ExamDefinition["id"] | null>(() => {
    if (typeof window === "undefined") return null;
    const id = window.location.pathname.split("/")[3];
    return EXAMS.some((exam) => exam.id === id) ? id as ExamDefinition["id"] : null;
  });
  const [attempt, setAttempt] = useState<StoredAttempt | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const selectedExam = EXAMS.find((exam) => exam.id === selectedId) || null;
  const questions = useMemo(() => selectedExam && attempt ? buildExamQuestions(selectedExam, attempt.attempt) : [], [selectedExam, attempt?.attempt]);
  const remainingSeconds = attempt ? Math.max(0, EXAM_DURATION_SECONDS - Math.floor((now - attempt.startedAt) / 1000)) : EXAM_DURATION_SECONDS;
  const submitted = Boolean(attempt?.submittedAt);

  useEffect(() => {
    if (!selectedId) return;
    setAttempt(readAttempt(selectedId));
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId || !attempt) return;
    localStorage.setItem(`${STORAGE_PREFIX}:${selectedId}`, JSON.stringify(attempt));
  }, [selectedId, attempt]);

  useEffect(() => {
    if (!attempt || submitted) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [attempt, submitted]);

  useEffect(() => {
    if (attempt && !submitted && remainingSeconds === 0) setAttempt((current) => current ? { ...current, submittedAt: Date.now() } : current);
  }, [attempt, remainingSeconds, submitted]);

  const openExam = (examId: ExamDefinition["id"]) => {
    setSelectedId(examId);
    setAttempt(null);
    window.history.pushState({}, "", `/schriftlich/probeexamen/${examId}`);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const closeExam = () => {
    setSelectedId(null);
    setAttempt(null);
    window.history.pushState({}, "", "/schriftlich/probeexamen");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const startExam = () => {
    const previous = selectedId ? readAttempt(selectedId) : null;
    setNow(Date.now());
    setAttempt({ attempt: (previous?.attempt || 0) + 1, startedAt: Date.now(), current: 0, answers: {} });
  };

  const toggleAnswer = (question: ExamQuestion, optionIndex: number) => {
    if (!attempt || submitted) return;
    setAttempt((current) => {
      if (!current) return current;
      const currentSelection = current.answers[question.id] || [];
      const nextSelection = question.mode === "single"
        ? [optionIndex]
        : currentSelection.includes(optionIndex)
          ? currentSelection.filter((index) => index !== optionIndex)
          : [...currentSelection, optionIndex];
      return { ...current, answers: { ...current.answers, [question.id]: nextSelection } };
    });
  };

  if (!selectedExam) {
    return <section className="page-section written-exam-page">
      <button className="back-button" type="button" onClick={onBack}>← Schriftliche Fachbereiche</button>
      <header className="written-exam-hero">
        <div><span className="eyebrow light">Schriftliche Prüfung · Probeexamen</span><h1>Drei Tage.<br />Drei Klausuren.</h1><p>Eine realistische, zeitlich begrenzte Generalprobe auf Basis deiner Lerninhalte. Lösungen bleiben bis zur Abgabe verborgen.</p></div>
        <aside><b>3 × 120</b><span>Minuten</span><small>nach § 15 NotSan-APrV</small></aside>
      </header>
      <div className="written-exam-grid">{EXAMS.map((exam, index) => {
        const saved = readAttempt(exam.id);
        return <button type="button" key={exam.id} onClick={() => openExam(exam.id)}>
          <header><span>0{index + 1}</span><small>{exam.day}</small></header>
          <h2>{exam.title}</h2><p>{exam.subtitle}</p>
          <div>{exam.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
          <footer><b>{saved?.submittedAt ? "Auswertung ansehen" : saved ? "Klausur fortsetzen" : "Klausur starten"}</b><span>120 Min · {EXAM_QUESTION_COUNT} Aufgaben →</span></footer>
        </button>;
      })}</div>
      <aside className="written-exam-note"><b>Prüfungsnah, aber fair eingeordnet</b><p>Die echte schriftliche Staatsprüfung besteht aus drei 120‑minütigen Aufsichtsarbeiten an drei Tagen. Dieses digitale Probeexamen nutzt Auswahlaufgaben zur selbstständigen Vorbereitung; die Prozentwertung ist keine amtliche Prüfungsnote.</p><a href="https://www.gesetze-im-internet.de/notsan-aprv/__15.html" target="_blank" rel="noreferrer">§ 15 NotSan-APrV öffnen ↗</a></aside>
    </section>;
  }

  if (!attempt) {
    return <section className="page-section written-exam-page">
      <button className="back-button" type="button" onClick={closeExam}>← Alle Prüfungstage</button>
      <div className="written-exam-start"><span>{selectedExam.day}</span><h1>{selectedExam.title}</h1><p>{selectedExam.subtitle}</p><dl><div><dt>Zeit</dt><dd>120 Minuten</dd></div><div><dt>Umfang</dt><dd>{EXAM_QUESTION_COUNT} Aufgaben</dd></div><div><dt>Lösungen</dt><dd>erst nach Abgabe</dd></div></dl><ul><li>Mehrere Antworten können richtig sein.</li><li>Dein Stand bleibt auf diesem Gerät gespeichert.</li><li>Die Uhr läuft auch weiter, wenn du die Seite schließt.</li></ul><button className="primary-button" type="button" onClick={startExam}>Probeexamen verbindlich starten</button></div>
    </section>;
  }

  const correctCount = questions.filter((question) => sameSelection(attempt.answers[question.id], question.options.map((option, index) => option.correct ? index : -1).filter((index) => index >= 0))).length;
  const answeredCount = questions.filter((question) => (attempt.answers[question.id] || []).length > 0).length;

  if (submitted) {
    return <section className="page-section written-exam-page">
      <button className="back-button" type="button" onClick={closeExam}>← Alle Prüfungstage</button>
      <header className="written-exam-result"><div><span className="eyebrow">Auswertung · {selectedExam.day}</span><h1>{selectedExam.title}</h1><p>Die Auswertung zählt eine Aufgabe nur dann als richtig, wenn alle richtigen und keine falschen Optionen markiert wurden.</p></div><strong><b>{correctCount}</b><span>von {questions.length}</span><small>{Math.round((correctCount / Math.max(1, questions.length)) * 100)} %</small></strong></header>
      <div className="written-exam-result-list">{questions.map((question, questionIndex) => {
        const selected = attempt.answers[question.id] || [];
        const correct = question.options.map((option, index) => option.correct ? index : -1).filter((index) => index >= 0);
        const isCorrect = sameSelection(selected, correct);
        return <details key={question.id} className={isCorrect ? "correct" : "incorrect"}><summary><span>{isCorrect ? "✓" : "!"}</span><div><small>Aufgabe {questionIndex + 1}</small><b>{question.prompt}</b></div><i>⌄</i></summary><div>{question.options.map((option, optionIndex) => <p key={optionIndex} className={`${option.correct ? "is-correct" : ""} ${selected.includes(optionIndex) ? "was-selected" : ""}`}><span>{option.correct ? "✓" : selected.includes(optionIndex) ? "×" : "○"}</span>{option.text}</p>)}<aside><b>Begründung</b>{question.source}</aside></div></details>;
      })}</div>
      <div className="written-exam-actions"><button type="button" onClick={startExam}>Neue Variante starten</button><button type="button" onClick={closeExam}>Zu den Prüfungstagen</button></div>
    </section>;
  }

  const question = questions[attempt.current];
  if (!question) return null;
  const selection = attempt.answers[question.id] || [];

  return <section className="page-section written-exam-page written-exam-running">
    <header className="written-exam-bar"><button type="button" onClick={closeExam}>← Unterbrechen</button><div><small>{selectedExam.day}</small><b>{selectedExam.title}</b></div><time className={remainingSeconds < 600 ? "urgent" : ""}>{formatTime(remainingSeconds)}</time></header>
    <div className="written-exam-progress"><span style={{ width: `${((attempt.current + 1) / questions.length) * 100}%` }} /><small>Aufgabe {attempt.current + 1} von {questions.length} · {answeredCount} beantwortet</small></div>
    <article className="written-exam-question"><small>Schwierigkeit {question.difficulty} · {question.mode === "single" ? "Eine Antwort" : "Eine oder mehrere Antworten"}</small><h1>{question.prompt}</h1><div>{question.options.map((option, optionIndex) => <label key={optionIndex} className={selection.includes(optionIndex) ? "selected" : ""}><input type={question.mode === "single" ? "radio" : "checkbox"} name={question.id} checked={selection.includes(optionIndex)} onChange={() => toggleAnswer(question, optionIndex)} /><span>{String.fromCharCode(65 + optionIndex)}</span><b>{option.text}</b></label>)}</div></article>
    <nav className="written-exam-nav"><button type="button" disabled={attempt.current === 0} onClick={() => setAttempt((current) => current ? { ...current, current: current.current - 1 } : current)}>← Zurück</button><div>{questions.map((entry, index) => <button type="button" key={entry.id} aria-label={`Aufgabe ${index + 1}`} className={`${index === attempt.current ? "active" : ""} ${(attempt.answers[entry.id] || []).length ? "answered" : ""}`} onClick={() => setAttempt((current) => current ? { ...current, current: index } : current)}>{index + 1}</button>)}</div>{attempt.current < questions.length - 1 ? <button type="button" onClick={() => setAttempt((current) => current ? { ...current, current: current.current + 1 } : current)}>Weiter →</button> : <button type="button" className="submit" onClick={() => { if (window.confirm(`Klausur jetzt abgeben? ${questions.length - answeredCount} Aufgaben sind noch unbeantwortet.`)) setAttempt((current) => current ? { ...current, submittedAt: Date.now() } : current); }}>Abgeben</button>}</nav>
  </section>;
}
