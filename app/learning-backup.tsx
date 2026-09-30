"use client";

import { ChangeEvent, useState } from "react";
import { QuestionProgress, questionProgressStorageKey, readQuestionProgress } from "./lib/questionProgress";
import { LEGACY_COMPLETED_TOPICS_KEY, readTopicProgress, topicProgressStorageKey, TopicProgress } from "./lib/topicProgress";
import { medicationProgressStorageKey, readMedicationProgress, MedicationProgress } from "./lib/medicationProgress";

const SCHEMA_VERSION = 1;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
type Backup = { schemaVersion: 1; exportedAt: string; data: { questions: QuestionProgress; topics: TopicProgress; medication: MedicationProgress } };
type Preview = { backup: Backup; questions: number; topics: number; medication: number };

const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
export function parseLearningBackup(text: string): Preview {
  const raw: unknown = JSON.parse(text);
  if (!isObject(raw) || raw.schemaVersion !== SCHEMA_VERSION || typeof raw.exportedAt !== "string" || !isObject(raw.data)) throw new Error("Diese Sicherung hat eine unbekannte oder ungültige Version.");
  const { questions, topics, medication } = raw.data;
  if (!isObject(questions) || !isObject(topics) || !isObject(medication)) throw new Error("Die Sicherung enthält keine gültigen Lerndaten.");
  for (const record of Object.values(questions)) if (!isObject(record) || ![0,1,2,3].includes(Number(record.correctCount)) || !["correct","wrong"].includes(String(record.lastResult)) || typeof record.updatedAt !== "string") throw new Error("Ungültiger Fragen-Lernstand.");
  for (const record of Object.values(topics)) if (!isObject(record) || typeof record.completed !== "boolean" || typeof record.updatedAt !== "string") throw new Error("Ungültiger Kapitelstatus.");
  for (const record of Object.values(medication)) if (!isObject(record) || !Number.isInteger(record.attempts) || !Number.isInteger(record.correct)) throw new Error("Ungültiger Rechen-Lernstand.");
  const backup = raw as unknown as Backup;
  return { backup, questions: Object.keys(questions).length, topics: Object.keys(topics).length, medication: Object.keys(medication).length };
}

function newer<T extends { updatedAt?: string }>(current: T | undefined, incoming: T) { return !current || (incoming.updatedAt || "") > (current.updatedAt || "") ? incoming : current; }
function mergeRecords<T extends { updatedAt?: string }>(current: Record<string,T>, incoming: Record<string,T>) { const merged={...current}; for(const [id,record] of Object.entries(incoming)) merged[id]=newer(merged[id],record); return merged; }

export default function LearningBackup({ onImported, userId }: { onImported: () => void; userId: string | null }) {
  const [preview,setPreview]=useState<Preview|null>(null), [message,setMessage]=useState(""), [undo,setUndo]=useState<Backup|null>(null);
  const guestTopics=():TopicProgress=>Object.fromEntries((JSON.parse(localStorage.getItem(LEGACY_COMPLETED_TOPICS_KEY)||"[]") as number[]).map(number=>[number,{completed:true,updatedAt:""}]));
  const currentTopics=()=>userId?readTopicProgress(userId):guestTopics();
  const snapshot=():Backup=>({schemaVersion:1,exportedAt:new Date().toISOString(),data:{questions:readQuestionProgress(),topics:currentTopics(),medication:readMedicationProgress()}});
  const exportData=()=>{const blob=new Blob([JSON.stringify(snapshot(),null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download=`notsan-lernstand-${new Date().toISOString().slice(0,10)}.json`;link.click();URL.revokeObjectURL(url);setMessage("Sicherung wurde erstellt. Sie enthält keine Zugangsdaten.")};
  const choose=async(event:ChangeEvent<HTMLInputElement>)=>{const file=event.target.files?.[0];event.target.value="";setPreview(null);if(!file)return;if(file.size>MAX_FILE_BYTES){setMessage("Die Datei ist größer als 2 MB.");return}try{setPreview(parseLearningBackup(await file.text()));setMessage("")}catch(error){setMessage(error instanceof Error?error.message:"Datei konnte nicht gelesen werden.")}};
  const apply=(source:Backup)=>{localStorage.setItem(questionProgressStorageKey(),JSON.stringify(mergeRecords(readQuestionProgress(),source.data.questions)));const topics=mergeRecords(currentTopics(),source.data.topics);if(userId)localStorage.setItem(topicProgressStorageKey(userId),JSON.stringify(topics));else localStorage.setItem(LEGACY_COMPLETED_TOPICS_KEY,JSON.stringify(Object.entries(topics).filter(([,record])=>record.completed).map(([number])=>Number(number))));localStorage.setItem(medicationProgressStorageKey(),JSON.stringify(mergeRecords(readMedicationProgress(),source.data.medication)));onImported()};
  const importData=()=>{if(!preview)return;setUndo(snapshot());apply(preview.backup);setPreview(null);setMessage("Sicherung wurde atomar zusammengeführt. Je ID bleibt der neuere Stand erhalten.")};
  return <section className="learning-backup"><b>Lernstand sichern</b><p>Versionierte JSON-Datei ohne Passwort, Token oder Sitzungsdaten.</p><div><button type="button" onClick={exportData}>Sicherung herunterladen</button><label>Sicherung importieren<input type="file" accept="application/json,.json" onChange={event=>void choose(event)}/></label></div>{preview&&<div className="backup-preview"><b>Vorschau vor dem Import</b><p>{preview.questions} Fragen · {preview.topics} Kapitel · {preview.medication} Rechenfälle</p><button type="button" onClick={importData}>Neuere Stände zusammenführen</button><button type="button" onClick={()=>setPreview(null)}>Abbrechen</button></div>}{undo&&<button type="button" onClick={()=>{apply(undo);setUndo(null);setMessage("Vorheriger lokaler Stand wurde wiederhergestellt.")}}>Letzten Import rückgängig machen</button>}{message&&<p role="status">{message}</p>}</section>;
}
