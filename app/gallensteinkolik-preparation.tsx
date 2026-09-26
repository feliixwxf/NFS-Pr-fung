import { useState } from "react";

type Preparation = "metamizol" | "butylscopolamin" | "dimenhydrinat";

const preparations = {
  metamizol: {
    name: "Metamizol",
    dose: "1 g",
    source: "1 g / 2 ml",
    drugVolume: 2,
    salineVolume: 98,
    finalVolume: 100,
    concentration: "10 mg/ml",
    route: "Kurzinfusion · VFA 39",
    time: "Über 5 Minuten",
    note: "Nach Risikoaufklärung und bei RRsys ≥ 100 mmHg. Die 2 ml Wirkstoff werden mit 98 ml NaCl 0,9 % auf 100 ml Gesamtvolumen ergänzt (B2A).",
  },
  butylscopolamin: {
    name: "Butylscopolamin",
    dose: "20 mg",
    source: "20 mg / 1 ml",
    drugVolume: 1,
    salineVolume: 9,
    finalVolume: 10,
    concentration: "2 mg/ml",
    route: "Langsam i.v. · VFA 39",
    time: "Bei kolikartigem Schmerz",
    note: "Die 1-ml-Ampulle wird mit 9 ml NaCl 0,9 % auf 10 ml Gesamtvolumen verdünnt (B2A).",
  },
  dimenhydrinat: {
    name: "Dimenhydrinat",
    dose: "62 mg",
    source: "62 mg / 10 ml",
    drugVolume: 10,
    salineVolume: 0,
    finalVolume: 10,
    concentration: "6,2 mg/ml",
    route: "Langsam i.v. · VFA 18",
    time: "Über mindestens 2 Minuten",
    note: "Die 10-ml-Ampulle bleibt unverdünnt (B2A). Die 500 ml Kristalloidlösung aus VFA 18 sind eine separate Infusion und gehören nicht in diese Spritze.",
  },
} as const;

const format = (value: number) => String(value).replace(".", ",");

export default function GallensteinkolikPreparation() {
  const [selected, setSelected] = useState<Preparation>("butylscopolamin");
  const item = preparations[selected];
  const syringe = selected !== "metamizol";
  const drugWidth = item.drugVolume / item.finalVolume * 470;
  const salineWidth = item.salineVolume / item.finalVolume * 470;
  return <div className="syringe-panel galle-preparation">
    <div className="syringe-panel-heading"><div><small>VFA-Zubereitung anschaulich</small><h3>Spritze oder Kurzinfusion?</h3></div><span>VFA 18 / 39 · Anlage B2A</span></div>
    <div className="syringe-controls" role="group" aria-label="Medikament wählen">{(Object.keys(preparations) as Preparation[]).map(key => <button type="button" key={key} className={selected === key ? "active" : ""} aria-pressed={selected === key} onClick={() => setSelected(key)}>{preparations[key].name}</button>)}</div>
    <div className="syringe-readout"><div><small>Wirkstoff</small><b>{item.dose} · {item.drugVolume} ml</b></div><div><small>NaCl 0,9 %</small><b>{item.salineVolume} ml{item.salineVolume === 0 ? " · pur" : ""}</b></div><div><small>Gesamtvolumen</small><b>{item.finalVolume} ml</b></div></div>
    {syringe ? <div className="syringe-drawing" role="img" aria-label={`10-ml-Spritze: ${item.drugVolume} ml ${item.name} und ${item.salineVolume} ml NaCl 0,9 %, insgesamt 10 ml`}>
      <svg viewBox="0 0 650 182" xmlns="http://www.w3.org/2000/svg">
        <path d="M35 77H77V101H35Z" fill="#d8e7e8" stroke="#8ca6a9" strokeWidth="2"/><path d="M31 73V105M78 63V114" stroke="#657b83" strokeWidth="4"/>
        <rect x="88" y="63" width="470" height="50" rx="8" fill="#fbffff" stroke="#9ab2b7" strokeWidth="3"/>
        <rect x="90" y="65" width={Math.max(0, drugWidth - 2)} height="46" fill="#3d9d90"/>
        {salineWidth > 0 && <rect x={88 + drugWidth} y="65" width={Math.max(0, salineWidth - 2)} height="46" fill="#bbdfe3"/>}
        <path d="M558 60V116" stroke="#214950" strokeWidth="6"/><path d="M558 88H605M605 67V109" stroke="#8b9da1" strokeWidth="5"/>
        {Array.from({ length: 11 }, (_, i) => <g key={i}><path d={`M${88 + i * 47} 63V${i % 2 === 0 ? 80 : 72}`} stroke="#244a54" strokeWidth={i % 2 === 0 ? 2 : 1.5}/>{i % 2 === 0 && <text x={88 + i * 47} y="48" textAnchor="middle" fontSize="15" fontWeight="700" fill="#244a54">{i}</text>}</g>)}
        <text x="557" y="146" textAnchor="end" fontSize="15" fontWeight="700" fill="#496a70">ml-Skala · 0–10 ml</text>
      </svg>
    </div> : <div className="galle-infusion-visual" role="img" aria-label="Kurzinfusion aus 2 ml Metamizol und 98 ml NaCl 0,9 Prozent, Gesamtvolumen 100 ml"><span><b>2 ml</b><small>Metamizol · 1 g</small></span><i>＋</i><span><b>98 ml</b><small>NaCl 0,9 %</small></span><i>→</i><span className="complete"><b>100 ml</b><small>Kurzinfusion</small></span></div>}
    <div className="galle-prep-legend"><span><i className="drug"/>Wirkstoff aus {item.source}</span>{item.salineVolume > 0 && <span><i className="saline"/>NaCl 0,9 %</span>}</div>
    <p className="syringe-explanation"><b>{item.name}: {item.concentration} nach Zubereitung.</b> {item.route} · {item.time}.</p>
    <p className="syringe-caution">{item.note} Lernübersicht; Indikation, Kontraindikationen, Präparat und Original-VFA vor Anwendung prüfen. Die Grafik zeigt keine gemeinsame Mischung der drei Medikamente.</p>
  </div>;
}
