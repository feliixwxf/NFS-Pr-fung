"use client";

import { useState } from "react";

type Preparation = {
  name: string;
  amount: string;
  drugMl: number;
  salineMl: number;
  totalMl: number;
  route: string;
  source: string;
  note?: string;
  kind?: "syringe" | "infusion" | "nebulizer" | "suppository" | "spray" | "capsule" | "rectiole" | "reconstitution";
  diluent?: string;
};

const morphine: Preparation = { name: "Morphin", amount: "10 mg", drugMl: 1, salineMl: 9, totalMl: 10, route: "i.v. · vorbereitete Lösung 1 mg/ml", source: "Anlage B2A · VFA 38", note: "Die Patientendosis richtet sich nach der Gewichtstabelle B2B." };
const esketamine: Preparation = { name: "Esketamin", amount: "50 mg", drugMl: 2, salineMl: 8, totalMl: 10, route: "i.v. · vorbereitete Lösung 5 mg/ml", source: "Anlage B2A · VFA 36", note: "Die Patientendosis ist gewichtsbezogen. Für i.m. oder i.n. gelten andere Zubereitungen." };
const midazolamAnalgesia: Preparation = { name: "Midazolam", amount: "5 mg", drugMl: 5, salineMl: 0, totalMl: 5, route: "i.v. · unverdünnt, 1 mg/ml", source: "Anlage B2A · VFA 36", note: "Die VFA 36 nennt vor der Esketamingabe 1 mg Midazolam i.v.; das sind 1 ml dieser Lösung." };
const heparin: Preparation = { name: "Heparin", amount: "5.000 I.E.", drugMl: 0.2, salineMl: 4.8, totalMl: 5, route: "i.v. · vorbereitete Lösung 1.000 I.E./ml", source: "Anlage B2A · VFA 14", note: "Nur im passenden ACS-Pfad; 5.000 I.E. sind die Einzelgabegrenze." };
const aspirin: Preparation = { name: "Acetylsalicylsäure", amount: "500 mg", drugMl: 0, salineMl: 5, totalMl: 5, route: "i.v. · Trockensubstanz mit beiliegendem Lösungsmittel rekonstituieren", source: "Anlage B2A · VFA 14", kind: "reconstitution", diluent: "beiliegendes Lösungsmittel", note: "500 mg in 5 ml ergeben 100 mg/ml. Die zu gebende Dosis richtet sich nach VFA 14." };
const nitroSpray: Preparation = { name: "Glyceroltrinitrat", amount: "0,4 mg je Hub", drugMl: 0, salineMl: 0, totalMl: 0, route: "sublingual als Dosierspray", source: "VFA 13 / 15", kind: "spray", note: "Vorher Blutdruck und Kontraindikationen prüfen; kein Spritzenmedikament." };
const tranexamic: Preparation = { name: "Tranexamsäure", amount: "1 g", drugMl: 10, salineMl: 90, totalMl: 100, route: "Kurzinfusion über 10 Minuten", source: "Anlage B2A · Trauma L2", kind: "infusion" };
const alteplase: Preparation = { name: "Alteplase · NEF", amount: "50 mg", drugMl: 0, salineMl: 50, totalMl: 50, route: "Rekonstitution der Trockensubstanz · Anwendung nur durch NEF", source: "Anlage B2A · Lyse", kind: "reconstitution", diluent: "beiliegendes Lösungsmittel", note: "50 mg plus 50 ml Lösungsmittel ergeben 1 mg/ml. Die Lyseentscheidung und Patientendosis sind davon getrennt und gehören zum ärztlichen Vorgehen." };
const amiodarone: Preparation = { name: "Amiodaron", amount: "300 mg", drugMl: 6, salineMl: 94, totalMl: 100, route: "Kurzinfusion nach erfolgloser Kardioversion", source: "Anlage B2A · VFA 20", kind: "infusion" };
const furosemide: Preparation = { name: "Furosemid", amount: "40 mg", drugMl: 4, salineMl: 0, totalMl: 4, route: "langsam i.v. · unverdünnt", source: "Anlage B2A · VFA 15" };
const fenoterol: Preparation = { name: "Partusisten (Fenoterol)", amount: "25 µg", drugMl: 1, salineMl: 9, totalMl: 10, route: "langsam i.v. über 3 Minuten · 2,5 µg/ml", source: "Anlage B2A · VFA 43", note: "Nur nach Indikations- und Schwangerschaftswochenprüfung der VFA 43." };
const glucoseAdult: Preparation = { name: "Glukose 20 %", amount: "20 g", drugMl: 100, salineMl: 0, totalMl: 100, route: "i.v. bei fehlender Wachheit · keine 10-ml-Spritze", source: "VFA 27", kind: "infusion", note: "100 ml Glukose 20 % entsprechen 20 g. Bei wachen, kooperativen Personen gilt der separate orale Weg." };
const glucoseChild: Preparation = { name: "Glukose 20 % · Beispiel 20 kg", amount: "8 g", drugMl: 40, salineMl: 0, totalMl: 40, route: "i.v. · 2 ml/kgKG initial", source: "VFA 28", kind: "syringe", note: "Dies ist nur ein Rechenbeispiel für 20 kg: 2 ml/kgKG = 40 ml; Gewicht und BZ bestimmen den konkreten VFA-Schritt." };
const adrenaline: Preparation = { name: "Adrenalin", amount: "4 mg", drugMl: 4, salineMl: 0, totalMl: 4, route: "inhalativ über Kindervernebler · unverdünnt", source: "VFA 24", kind: "nebulizer", note: "In den Vernebler geben, nicht injizieren. Die VFA nennt 6 l/min O₂." };
const prednisolone: Preparation = { name: "Prednisolon", amount: "100 mg", drugMl: 0, salineMl: 0, totalMl: 0, route: "rektal als Suppositorium", source: "VFA 24", kind: "suppository", note: "Ein Zäpfchen wird nicht in eine Spritze aufgezogen." };
const nifedipine: Preparation = { name: "Nifedipin", amount: "10 mg", drugMl: 0, salineMl: 0, totalMl: 0, route: "oral als Kapsel", source: "VFA 17", kind: "capsule", note: "Nur im dafür vorgesehenen VFA-17-Pfad; nicht mit dem Urapidilpfad gleichsetzen." };
const diazepam: Preparation = { name: "Diazepam", amount: "5 oder 10 mg", drugMl: 0, salineMl: 0, totalMl: 0, route: "rektal als Rectiole", source: "VFA 30", kind: "rectiole", note: "Alters- und Gewichtsgrenzen der Kinder-VFA bestimmen die Rectiolenstärke." };
const adrenalineCpr: Preparation = { name: "Adrenalin · CPR", amount: "1 mg", drugMl: 1, salineMl: 0, totalMl: 1, route: "i.v. · unverdünnt", source: "Anlage B2A · ERC 2025", note: "Bei schwerer Hypothermie gelten temperaturabhängige Sonderregeln. Unter 30 °C ist eine Gabe nur unter den im Reanimationskapitel beschriebenen Bedingungen zu erwägen." };
const metamizole: Preparation = { name: "Metamizol", amount: "1 g", drugMl: 2, salineMl: 98, totalMl: 100, route: "Kurzinfusion über 5 Minuten", source: "Anlage B2A · VFA 39", kind: "infusion" };
const butylscopolamine: Preparation = { name: "Butylscopolamin", amount: "20 mg", drugMl: 1, salineMl: 9, totalMl: 10, route: "langsam i.v. · 2 mg/ml", source: "Anlage B2A · VFA 39" };
const dimenhydrinate: Preparation = { name: "Dimenhydrinat", amount: "62 mg", drugMl: 10, salineMl: 0, totalMl: 10, route: "langsam i.v. · unverdünnt", source: "Anlage B2A · VFA 18" };

const trauma = [morphine, esketamine];
const topicPreparations: Record<number, Preparation[]> = {
  1: [{ ...nitroSpray, source: "VFA 13", note: "0,4 mg als ein Hub sublingual. Nach 5 Minuten Wirkung und RR kontrollieren; maximal zwei Wiederholungen und vor jeder Gabe die VFA-Kontraindikationen erneut prüfen." }],
  2: [aspirin, heparin, nitroSpray],
  4: [...trauma, midazolamAnalgesia],
  7: [alteplase],
  11: [fenoterol],
  13: [nifedipine],
  15: trauma,
  17: trauma,
  18: [...trauma, tranexamic],
  21: [furosemide, nitroSpray, { ...morphine, name: "Morphin · CPAP-Zweig", source: "Anlage B2A · VFA 06", note: "VFA 06 nennt bei nicht tolerierter CPAP-Therapie 2 mg i.v., entsprechend 2 ml der vorbereiteten 1-mg/ml-Lösung." }],
  22: trauma,
  23: [amiodarone],
  26: [glucoseAdult, glucoseChild],
  29: [diazepam],
  33: trauma,
  39: [metamizole, butylscopolamine, dimenhydrinate],
  42: [...trauma, dimenhydrinate],
  46: [adrenalineCpr],
  48: [adrenaline, prednisolone],
};

const format = (value: number) => String(value).replace(".", ",");

function SyringeDrawing({ item }: { item: Preparation }) {
  const capacity = item.totalMl <= 5 ? 5 : item.totalMl <= 10 ? 10 : 50;
  const drawn = Math.min(item.totalMl, capacity);
  const drugWidth = item.drugMl / capacity * 470;
  const salineWidth = item.salineMl / capacity * 470;
  return <div className="universal-prep-drawing" role="img" aria-label={`${format(item.drugMl)} ml ${item.name} plus ${format(item.salineMl)} ml NaCl 0,9 Prozent; insgesamt ${format(item.totalMl)} ml`}>
    <svg viewBox="0 0 650 170" xmlns="http://www.w3.org/2000/svg">
      <path d="M35 76H77V100H35Z" fill="#d8e7e8" stroke="#8ca6a9" strokeWidth="2"/><path d="M31 72V104M78 63V113" stroke="#657b83" strokeWidth="4"/>
      <rect x="88" y="63" width="470" height="50" rx="8" fill="#fbffff" stroke="#9ab2b7" strokeWidth="3"/>
      <rect x="90" y="65" width={Math.max(0, drugWidth - 2)} height="46" fill="#3d9d90"/>
      {salineWidth > 0 && <rect x={88 + drugWidth} y="65" width={Math.max(0, salineWidth - 2)} height="46" fill="#bbdfe3"/>}
      <path d={`M${88 + drawn / capacity * 470} 61V115`} stroke="#214950" strokeWidth="5"/>
      <path d={`M${88 + drawn / capacity * 470} 88H605M605 68V108`} stroke="#8b9da1" strokeWidth="5"/>
      {Array.from({ length: 11 }, (_, index) => <g key={index}><path d={`M${88 + index * 47} 63V${index % 2 ? 73 : 80}`} stroke="#244a54" strokeWidth={index % 2 ? 1.5 : 2}/>{index % 2 === 0 && <text x={88 + index * 47} y="48" textAnchor="middle" fontSize="15" fontWeight="700" fill="#244a54">{index * capacity / 10}</text>}</g>)}
      <text x="558" y="146" textAnchor="end" fontSize="15" fontWeight="700" fill="#496a70">ml-Skala · 0–{capacity} ml</text>
    </svg>
  </div>;
}

export default function MedicationPreparation({ topicNumber }: { topicNumber: number }) {
  const items = topicPreparations[topicNumber];
  const [selected, setSelected] = useState(0);
  if (!items) return null;
  const item = items[Math.min(selected, items.length - 1)];
  return <details className="universal-prep" open={topicNumber === 21}><summary><span className="universal-prep-icon">▤</span><span><small>VFA Thüringen 2026/2027</small><b>Medikamente · Spritze &amp; Zubereitung</b></span><i aria-hidden="true">⌄</i></summary><div className="universal-prep-body">
    <div className="universal-prep-tabs" role="group" aria-label="Medikament wählen">{items.map((candidate, index) => <button key={candidate.name} type="button" aria-pressed={selected === index} className={selected === index ? "active" : ""} onClick={() => setSelected(index)}>{candidate.name}</button>)}</div>
    <div className="universal-prep-values"><div><small>Wirkstoff</small><b>{item.amount}{item.drugMl ? ` · ${format(item.drugMl)} ml` : ""}</b></div><div><small>{item.totalMl ? item.diluent ?? "NaCl 0,9 %" : "Verdünnung"}</small><b>{item.totalMl ? `${format(item.salineMl)} ml${item.salineMl === 0 ? " · pur" : ""}` : "nicht erforderlich"}</b></div><div><small>{item.totalMl ? "Gesamtvolumen" : "Darreichung"}</small><b>{item.totalMl ? `${format(item.totalMl)} ml` : item.kind === "suppository" ? "Suppositorium" : item.kind === "rectiole" ? "Rectiole" : item.kind === "spray" ? "Dosierspray" : "Kapsel"}</b></div></div>
    {item.kind && item.kind !== "syringe" ? <div className="universal-prep-route" role="img" aria-label={`${item.name}: ${item.route}`}><span><b>{item.kind === "reconstitution" ? item.amount : item.totalMl ? `${format(item.drugMl)} ml` : item.amount}</b><small>{item.name}{item.kind === "reconstitution" ? " · Pulver" : ""}</small></span>{item.salineMl > 0 && <><i>＋</i><span><b>{format(item.salineMl)} ml</b><small>{item.diluent ?? "NaCl 0,9 %"}</small></span></>}<i>→</i><span className="target"><b>{item.kind === "infusion" ? "Infusion" : item.kind === "reconstitution" ? "Lösung" : item.kind === "nebulizer" ? "Vernebler" : item.kind === "suppository" ? "Zäpfchen" : item.kind === "rectiole" ? "Rectiole" : item.kind === "spray" ? "Spray" : "Kapsel"}</b><small>{item.route}</small></span></div> : <SyringeDrawing item={item} />}
    <p><b>{item.name}:</b> {item.route}. <span>{item.source}</span></p>{item.note && <p className="universal-prep-note">{item.note}</p>}<small className="universal-prep-caution">Schematische Lernansicht. Indikation, Patientendosis, Konzentration, Kontraindikationen und Original-VFA vor einer Anwendung prüfen. Die Medikamente werden getrennt zubereitet.</small>
  </div></details>;
}
