"use client";

import { useMemo, useState } from "react";
import { isCorrect, parseGermanNumber } from "../lib/medicationCalculations";
import { medicationCases, medicationRules, sourceIssues, type Category } from "../lib/medicationData";

type Mode = "learn" | "exam";
type Result = { answers: Record<string,string>; correct: boolean };
const STORAGE = "notsan-medication-progress-v1";

function safeRead(): Record<string,{attempts:number;correct:number}> {
  if (typeof window === "undefined") return {};
  try { const value=JSON.parse(localStorage.getItem(STORAGE)||"{}"); return value && typeof value==="object" ? value : {}; } catch { return {}; }
}

export default function MedicationTrainer() {
 const [mode,setMode]=useState<Mode>("learn"), [group,setGroup]=useState("Alle"), [category,setCategory]=useState("Alle"), [drug,setDrug]=useState("Alle");
 const [length,setLength]=useState("10"), [index,setIndex]=useState(0), [inputs,setInputs]=useState<Record<string,string>>({}), [results,setResults]=useState<Record<string,Result>>({});
 const [revealed,setRevealed]=useState(false), [hintStep,setHintStep]=useState(0), [progress,setProgress]=useState<Record<string,{attempts:number;correct:number}>>(safeRead), [wrongOnly,setWrongOnly]=useState(false);
 const ruleGroups=useMemo(()=>Array.from(new Set(medicationRules.map(r=>r.drug))),[]);
 const pool=useMemo(()=>medicationCases.filter(c=>(group==="Alle"||c.group===group)&&(category==="Alle"||c.category===category)&&(drug==="Alle"||medicationRules.find(r=>r.id===c.ruleId)?.drug===drug)&&(!wrongOnly||progress[c.id]?.correct<progress[c.id]?.attempts)),[group,category,drug,wrongOnly,progress]);
 const session=useMemo(()=>length==="frei"?pool:pool.slice(0,Number(length)),[pool,length]);
 const current=session[index];
 const evaluated= current ? results[current.id] : undefined;
 const submit=()=>{ if(!current||current.answers.some(answer=>parseGermanNumber(inputs[answer.id]||"")===null)) return;
   const correct=current.answers.every(answer=>isCorrect(inputs[answer.id],answer.value,answer.decimals));
   const next={...results,[current.id]:{answers:{...inputs},correct}}; setResults(next);
   const updated={...progress,[current.id]:{attempts:(progress[current.id]?.attempts||0)+1,correct:(progress[current.id]?.correct||0)+(correct?1:0)}}; setProgress(updated); localStorage.setItem(STORAGE,JSON.stringify(updated));
   if(mode==="learn") setRevealed(true); else if(index<session.length-1){setIndex(index+1);setInputs({});setHintStep(0);}
 };
 const next=()=>{setIndex(Math.min(index+1,session.length-1));setInputs({});setRevealed(false);setHintStep(0)};
 const reset=()=>{setIndex(0);setInputs({});setResults({});setRevealed(false);setHintStep(0)};
 const finished=mode==="exam"&&session.length>0&&Object.keys(results).length===session.length;
 const solved=Object.keys(progress).length, correctTotal=Object.values(progress).filter(x=>x.correct===x.attempts&&x.attempts>0).length;
 return <section className="page-section medication-page">
   <div className="section-heading medication-heading"><div><span className="eyebrow">INTERAKTIVER FALLTRAINER</span><h1>Medikamentenrechnen</h1><p>Dosierungen, Verdünnungen und Volumina anhand realistischer Einsatzbeispiele trainieren.</p></div><div className="source-badge"><b>{medicationCases.length}</b><span>Startfälle</span></div></div>
   <div className="medication-warning">⚕ <b>Lernmodul nach VFA Thüringen 2026/27</b> – kein Rechner für die Patientenversorgung.</div>
   <section className="trainer-settings" aria-label="Training einstellen">
    <div className="mode-switch"><button className={mode==="learn"?"active":""} onClick={()=>{setMode("learn");reset()}}>Lernmodus</button><button className={mode==="exam"?"active":""} onClick={()=>{setMode("exam");reset()}}>Prüfungsmodus</button></div>
    <label>Medikamentengruppe<select value={drug} onChange={e=>{setDrug(e.target.value);reset()}}><option>Alle</option>{ruleGroups.map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Patientengruppe<select value={group} onChange={e=>{setGroup(e.target.value);reset()}}><option>Alle</option><option>Erwachsene</option><option>Kinder</option></select></label>
    <label>Aufgabentyp<select value={category} onChange={e=>{setCategory(e.target.value);reset()}}><option>Alle</option>{(["Dosisberechnung","mg–ml-Umrechnung","Verdünnung","Wiederholung/Höchstdosis","Infusionsmengen"] as Category[]).map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Umfang<select value={length} onChange={e=>{setLength(e.target.value);reset()}}><option value="10">10 Aufgaben</option><option value="20">20 Aufgaben</option><option value="30">30 Aufgaben</option><option value="frei">Frei weiterüben</option></select></label>
    <label className="wrong-toggle"><input type="checkbox" checked={wrongOnly} onChange={e=>{setWrongOnly(e.target.checked);reset()}}/> Nur Fehler wiederholen</label>
   </section>
   <div className="trainer-stats"><span><b>{solved}</b> gelöst</span><span><b>{correctTotal}</b> sicher korrekt</span><span><b>{Object.values(progress).filter(x=>x.correct<x.attempts).length}</b> Fehlerschwerpunkte</span></div>
   {finished ? <ExamSummary session={session} results={results} onRestart={reset}/> : current ? <article className="case-card">
    <header><div><span>Fall {index+1} von {session.length}</span><h2>{current.title}</h2></div><div className="case-tags"><span>{current.age} Jahre</span><span>{current.weight} kg</span><span>{current.phase}</span></div></header>
    <div className="case-progress"><i style={{width:`${((index+1)/session.length)*100}%`}}/></div><p className="case-text">{current.text}</p><h3>{current.question}</h3>
    {mode==="learn"&&<details className="rule-details"><summary>Dosierregel anzeigen</summary><p>{medicationRules.find(r=>r.id===current.ruleId)?.parameter} · {medicationRules.find(r=>r.id===current.ruleId)?.concentration}</p></details>}
    <div className="answer-grid">{current.answers.map(answer=><label key={answer.id}>{answer.label}<small>Rundung: {answer.decimals} Nachkommastellen</small><div><input inputMode="decimal" disabled={!!evaluated} value={inputs[answer.id]||""} onChange={e=>setInputs({...inputs,[answer.id]:e.target.value})} aria-label={`${answer.label} in ${answer.unit}`}/><span>{answer.unit}</span></div></label>)}</div>
    {mode==="learn"&&!evaluated&&<div className="hint-row"><button onClick={()=>setHintStep(Math.min(2,hintStep+1))}>Hinweis {hintStep+1}/2</button>{hintStep>0&&<p>{hintStep===1?current.hint:`Rechenweg: ${current.answers[0].calculation}`}</p>}</div>}
    {evaluated&&revealed&&<Feedback current={current} result={evaluated}/>} 
    <div className="case-actions">{!evaluated?<button className="primary-button" onClick={submit}>Antwort prüfen</button>:<button className="primary-button" onClick={next} disabled={index===session.length-1}>Nächster Fall →</button>}</div>
   </article>:<div className="empty-medication"><h2>Keine passenden Fälle</h2><p>Filter anpassen oder zunächst andere Aufgaben bearbeiten.</p></div>}
   <details className="source-issues"><summary>Quellenabgrenzungen im Datensatz</summary><ul>{sourceIssues.map(issue=><li key={issue}>{issue}</li>)}</ul><p>Quelle: <a href="https://agtn.de/notfallsanitaeter/" target="_blank" rel="noreferrer">Verfahrensanweisungen Thüringer Rettungsdienst 2026/2027</a>, Stand 01.07.2026.</p></details>
 </section>
}

function Feedback({current,result}:{current:(typeof medicationCases)[number];result:Result}) { const count=current.answers.filter(x=>isCorrect(result.answers[x.id],x.value,x.decimals)).length; return <section className={`case-feedback ${count===current.answers.length?"correct":count?"partial":"wrong"}`}><h3>{count===current.answers.length?"Korrekt":count?"Teilweise korrekt":"Noch nicht korrekt"}</h3>{current.answers.map(answer=>{const ok=isCorrect(result.answers[answer.id],answer.value,answer.decimals);return <div key={answer.id}><b>{ok?"✓":"×"} {answer.label}: {result.answers[answer.id]} {answer.unit}</b><p>Richtig: {String(answer.value).replace(".",",")} {answer.unit}. {answer.calculation}.</p>{!ok&&<small>{answer.errorHint||current.hint}</small>}</div>})}<footer><b>Regel</b> {medicationRules.find(r=>r.id===current.ruleId)?.parameter}<br/><b>Quelle</b> {medicationRules.find(r=>r.id===current.ruleId)?.source}</footer></section> }

function ExamSummary({session,results,onRestart}:{session:typeof medicationCases;results:Record<string,Result>;onRestart:()=>void}) {const correct=session.filter(x=>results[x.id]?.correct).length;return <section className="exam-summary"><span className="eyebrow">GEMEINSAME AUSWERTUNG</span><h2>{correct} von {session.length} Fällen vollständig korrekt</h2><p>Die Aufschlüsselung zeigt die fehlerhaften Rechenschritte. Regeln und Lösungen waren bis zum Abschluss verborgen.</p>{session.map(c=><details key={c.id} open={!results[c.id]?.correct}><summary>{results[c.id]?.correct?"✓":"×"} {c.title}</summary><Feedback current={c} result={results[c.id]}/></details>)}<button className="primary-button" onClick={onRestart}>Neue Prüfung starten</button></section>}
