"use client";

import { useEffect, useMemo, useState } from "react";
import { dueQuestionIds, type QuestionProgress } from "./lib/questionProgress";
import OfflineStatusCard from "./offline-support";

export type LearningPlanTopic = {
  topic: string;
  number: string;
  title: string;
  questionIds: string[];
  oralIndex?: number;
};

type PlanSettings = { examDate: string; dailyMinutes: number };

const DEFAULT_SETTINGS: PlanSettings = { examDate: "", dailyMinutes: 30 };

function readSettings(storageKey: string): PlanSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    return {
      examDate: typeof saved.examDate === "string" ? saved.examDate : "",
      dailyMinutes: [15, 30, 45, 60].includes(saved.dailyMinutes) ? saved.dailyMinutes : 30,
    };
  } catch { return DEFAULT_SETTINGS; }
}

function daysUntil(date: string) {
  if (!date) return null;
  const target = new Date(`${date}T12:00:00`);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

function localDayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dailyScore(value: string) {
  let hash = 2166136261;
  for (const character of value) { hash ^= character.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}

export default function LearningPlan({
  progress,
  completedTopics,
  topics,
  userId,
  onTrain,
  onRead,
  onProgress,
  onDueReview,
  onCases,
}: {
  progress: QuestionProgress;
  completedTopics: number[];
  topics: LearningPlanTopic[];
  userId: string | null;
  onTrain: (topic: string) => void;
  onRead: (oralIndex: number) => void;
  onProgress: () => void;
  onDueReview: () => void;
  onCases: () => void;
}) {
  const storageKey = `notsan-learning-plan-v1:${userId || "local"}`;
  const [settings, setSettings] = useState<PlanSettings>(DEFAULT_SETTINGS);
  const [loadedStorageKey, setLoadedStorageKey] = useState("");

  // Der Speicherschlüssel ändert sich beim Wechsel zwischen lokalem Profil und Lernkonto.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setSettings(readSettings(storageKey)); setLoadedStorageKey(storageKey); }, [storageKey]);
  useEffect(() => { if (loadedStorageKey === storageKey) localStorage.setItem(storageKey, JSON.stringify(settings)); }, [loadedStorageKey, settings, storageKey]);

  const dueIds = useMemo(() => new Set(dueQuestionIds(progress)), [progress]);
  const planDay = localDayKey();
  const dailySeed = `${planDay}:${settings.examDate || "ohne-pruefungsdatum"}:${userId || "local"}`;
  const ranked = useMemo(() => topics.map((topic) => {
    const records = topic.questionIds.map((id) => progress[id]).filter(Boolean);
    const answered = records.length;
    const wrong = records.filter((record) => record.lastResult === "wrong").length;
    const due = topic.questionIds.filter((id) => dueIds.has(id)).length;
    const security = answered ? records.reduce((sum, record) => sum + record.correctCount / 3, 0) / answered : null;
    const priority = due * 10 + wrong * 7 + (security === null ? 0 : (1 - security) * 5) + (answered ? 2 : 0);
    return { ...topic, answered, wrong, due, security, priority, dailyOrder: dailyScore(`${dailySeed}:${topic.topic}`) };
  }).sort((a, b) => b.priority - a.priority || b.wrong - a.wrong || a.dailyOrder - b.dailyOrder), [dailySeed, dueIds, progress, topics]);

  const weak = ranked.find((topic) => topic.answered > 0) || ranked[0];
  const fresh = ranked.find((topic) => topic.topic !== weak?.topic && topic.oralIndex !== undefined && !completedTopics.includes((topic.oralIndex ?? -1) + 1) && !topic.questionIds.some((id) => progress[id]));
  const minutes = settings.dailyMinutes;
  const examDays = daysUntil(settings.examDate);
  const today = [
    dueIds.size ? { icon: "↺", label: "Wiederholen", title: `${dueIds.size} fällige Frage${dueIds.size === 1 ? "" : "n"}`, text: dueIds.size > 2 ? "Alle heute fälligen Fragen sind bereits gemeinsam ausgewählt. Du kannst die komplette Wiederholungsrunde mit einem Klick öffnen." : `Etwa ${Math.min(15, Math.max(5, Math.round(minutes * .35)))} Minuten für Inhalte, deren Wiederholung heute fällig ist.`, action: dueIds.size > 2 ? `Alle ${dueIds.size} auswählen` : "Wiederholung öffnen", run: dueIds.size > 2 ? onDueReview : onProgress } : null,
    weak ? { icon: "◎", label: "Schwerpunkt", title: weak.title, text: weak.answered ? `${weak.wrong} zuletzt falsch · ${weak.due} heute fällig. Trainiere gezielt statt wahllos.` : "Beginne mit einem prüfungsrelevanten Themenblock.", action: "MC-Training starten", run: () => onTrain(weak.topic) } : null,
    fresh ? { icon: "+", label: "Neuer Stoff", title: fresh.title, text: `Plane etwa ${Math.max(10, Math.round(minutes * .4))} Minuten für Lesen, Verstehen und anschließende Selbstkontrolle ein.`, action: "Kapitel lesen", run: () => onRead(fresh.oralIndex!) } : null,
    { icon: "F", label: "Transfer", title: "Ein Fallbeispiel", text: "Wende das Gelernte in einer dynamischen Einsatzlage an und begründe dein Vorgehen.", action: "Fall generieren", run: onCases },
  ].filter(Boolean).slice(0, minutes <= 15 ? 2 : minutes <= 30 ? 3 : 4) as Array<{ icon: string; label: string; title: string; text: string; action: string; run: () => void }>;

  return <section className="page-section learning-plan-page">
    <div className="section-heading"><div><span className="eyebrow">Persönlicher Lernplan</span><h1>Heute gezielt lernen.</h1><p>Der Plan verbindet fällige Wiederholungen, deine bisherigen Fehler und neue Kapitel. Er passt sich nach jeder beantworteten Frage automatisch an.</p></div><div className="source-badge"><b>{minutes}</b><span>Minuten heute</span></div></div>
    <section className="learning-plan-settings" aria-label="Lernplan einstellen"><label><span>Prüfungsdatum</span><input type="date" value={settings.examDate} min={new Date().toISOString().slice(0, 10)} onChange={(event) => setSettings((current) => ({ ...current, examDate: event.target.value }))} /><small>{settings.examDate ? "✓ Datum dauerhaft auf diesem Gerät gespeichert" : "Datum einmal auswählen – es bleibt gespeichert"}</small></label><label><span>Zeit pro Tag</span><select value={settings.dailyMinutes} onChange={(event) => setSettings((current) => ({ ...current, dailyMinutes: Number(event.target.value) }))}>{[15, 30, 45, 60].map((value) => <option key={value} value={value}>{value} Minuten</option>)}</select><small>Der Tagesplan bleibt heute gleich und wechselt morgen.</small></label><div className="learning-plan-countdown"><small>Bis zur Prüfung</small><b>{examDays === null ? "Datum wählen" : examDays < 0 ? "Termin vorbei" : examDays === 0 ? "Heute" : `${examDays} Tage`}</b></div></section>
    <div className="learning-plan-list">{today.map((task, index) => <article key={`${task.label}-${task.title}`}><span className="learning-plan-step">{String(index + 1).padStart(2, "0")}</span><div className="learning-plan-icon" aria-hidden="true">{task.icon}</div><div><small>{task.label}</small><h2>{task.title}</h2><p>{task.text}</p></div><button type="button" onClick={task.run}>{task.action} <span>→</span></button></article>)}</div>
    {!Object.keys(progress).length && <aside className="learning-plan-note"><b>Der Plan lernt mit dir.</b><p>Zu Beginn erhältst du einen ausgewogenen Einstieg. Sobald du Fragen beantwortet hast, rücken falsche und fällige Inhalte automatisch nach oben.</p></aside>}
    <OfflineStatusCard />
  </section>;
}
