"use client";

import { useMemo, useState } from "react";

function decimal(value: number) {
  return value.toLocaleString("de-DE", { maximumFractionDigits: 2 });
}

function Syringe({ label, dose, volume, color = "#d2694d" }: { label: string; dose: string; volume: number; color?: string }) {
  const capacity = volume <= 1 ? 1 : volume <= 5 ? 5 : volume <= 10 ? 10 : Math.ceil(volume / 5) * 5;
  const fill = Math.min(470, volume / capacity * 470);
  return <div className="ana-syringe" role="img" aria-label={`${label}: ${dose}, ${decimal(volume)} Milliliter`}>
    <svg viewBox="0 0 650 164" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 75H76V99H32Z" fill="#dce8e9" stroke="#8ba3a7" strokeWidth="2"/><path d="M28 70V104M77 61V113" stroke="#617980" strokeWidth="4"/>
      <rect x="88" y="61" width="470" height="52" rx="8" fill="#fbffff" stroke="#91a9ad" strokeWidth="3"/>
      <rect x="90" y="63" width={Math.max(0, fill - 2)} height="48" rx="6" fill={color}/>
      <path d={`M${88 + fill} 59V115M${88 + fill} 87H606M606 67V107`} stroke="#466068" strokeWidth="5"/>
      {[0,1,2,3,4,5].map(index => <g key={index}><path d={`M${88 + index * 94} 61V76`} stroke="#214650" strokeWidth="2"/><text x={88 + index * 94} y="45" textAnchor="middle" fontSize="15" fontWeight="800" fill="#214650">{decimal(index * capacity / 5)}</text></g>)}
      <text x="323" y="94" textAnchor="middle" fontSize="15" fontWeight="850" fill="#fff">{label} · {dose}</text>
      <text x="558" y="144" textAnchor="end" fontSize="14" fontWeight="750" fill="#60777d">Gesamt {decimal(volume)} ml</text>
    </svg>
  </div>;
}

export default function AnaphylaxiePreparation() {
  const [track, setTrack] = useState<"adult" | "child">("adult");
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState<"under6" | "6to12" | "over12">("6to12");
  const child = useMemo(() => {
    const adrenaline = age === "under6" ? 0.15 : age === "6to12" ? 0.3 : 0.5;
    const band = weight < 15 ? { pred: 50, dim: 1 } : weight <= 30 ? { pred: 100, dim: 2 } : { pred: 250, dim: 4 };
    return { adrenaline, pred: band.pred, predMl: band.pred / 50, dim: band.dim, dimMl: band.dim, fluid: weight * 10 };
  }, [age, weight]);
  const adultDim = weight * 0.1;

  return <section className="ana-preparation" aria-labelledby="ana-preparation-title">
    <header><div><small>Thüringer VFA 25/26 · Anlage B2A</small><h3 id="ana-preparation-title">Dosierung und Spritzenansicht</h3><p>Die Konzentrationen und Dosen sind strikt nach der bereitgestellten VFA 2026/27 dargestellt.</p></div><div className="ana-preparation-tabs" role="tablist"><button className={track === "adult" ? "active" : ""} onClick={() => setTrack("adult")}>Erwachsene</button><button className={track === "child" ? "active" : ""} onClick={() => setTrack("child")}>Kinder</button></div></header>
    <label className="ana-weight"><span>Körpergewicht für Berechnung</span><span><input type="number" min="1" max="250" value={weight} onChange={event => setWeight(Math.max(1, Number(event.target.value) || 1))}/><b>kg</b></span></label>
    {track === "adult" ? <div className="ana-preparation-grid">
      <article><small>VFA 25 · Stadium II/III</small><h4>Adrenalin i.m.</h4><Syringe label="Adrenalin 1 mg/ml" dose="0,5 mg" volume={0.5}/><p><b>0,5 ml</b> unverdünnt in den lateralen Oberschenkel. Bei ausbleibendem oder nachlassendem Effekt alle fünf Minuten wiederholen.</p></article>
      <article><small>Einmalgabe</small><h4>Prednisolon i.v.</h4><Syringe label="Prednisolon 50 mg/ml" dose="500 mg" volume={10} color="#557e9c"/><p>Zwei rekonstituierte 250-mg-Ampullen ergeben <b>10 ml</b> für 500 mg.</p></article>
      <article><small>Einmalgabe · gewichtsbezogen</small><h4>Histakut / Dimetinden i.v.</h4><Syringe label="Dimetinden 1 mg/ml" dose={`${decimal(adultDim)} mg`} volume={adultDim} color="#8c69a5"/><p>Bei {decimal(weight)} kg: <b>{decimal(adultDim)} mg = {decimal(adultDim)} ml</b>.</p></article>
      <article className="ana-nebulizer"><small>Bei Stridor</small><h4>Adrenalin inhalativ</h4><div><b>5 mg</b><span>= 5 ml pur</span></div><p>Unverdünnt mit Sauerstoff vernebeln. Das ist eine zusätzliche Maßnahme und nicht die i.m.-Spritze.</p></article>
    </div> : <>
      <div className="ana-age-tabs" role="group" aria-label="Altersstufe wählen"><button className={age === "under6" ? "active" : ""} onClick={() => setAge("under6")}>&lt; 6 Jahre</button><button className={age === "6to12" ? "active" : ""} onClick={() => setAge("6to12")}>6–12 Jahre</button><button className={age === "over12" ? "active" : ""} onClick={() => setAge("over12")}>&gt; 12 Jahre</button></div>
      <div className="ana-preparation-grid">
        <article><small>VFA 26 · altersabhängig</small><h4>Adrenalin i.m.</h4><Syringe label="Adrenalin 1 mg/ml" dose={`${decimal(child.adrenaline)} mg`} volume={child.adrenaline}/><p>Volle Initialdosis: <b>{decimal(child.adrenaline)} ml</b>. Bei ausbleibendem oder nachlassendem Effekt alle fünf Minuten wiederholen.</p></article>
        <article><small>VFA 26 · Gewichtsgruppe</small><h4>Prednisolon i.v.</h4><Syringe label="Prednisolon 50 mg/ml" dose={`${child.pred} mg`} volume={child.predMl} color="#557e9c"/><p>Bei {decimal(weight)} kg: <b>{child.pred} mg = {decimal(child.predMl)} ml</b> rekonstituierte Lösung.</p></article>
        <article><small>VFA 26 · Gewichtsgruppe</small><h4>Histakut / Dimetinden i.v.</h4><Syringe label="Dimetinden 1 mg/ml" dose={`${child.dim} mg`} volume={child.dimMl} color="#8c69a5"/><p>Bei {decimal(weight)} kg: <b>{child.dim} mg = {decimal(child.dimMl)} ml</b>. i.v.-Zusatzgaben laut VFA erst ab einem Jahr.</p></article>
        <article className="ana-nebulizer"><small>Volumen und Stadium I</small><h4>Weitere Kinderangaben</h4><div><b>{decimal(child.fluid)} ml</b><span>Kristalloid · 10 ml/kgKG</span></div><p>Bei Stridor: 5 mg Adrenalin pur inhalativ. Im Stadium-I-Zweig: 100 mg Prednisolon rektal.</p></article>
      </div>
    </>}
    <p className="ana-preparation-caution">Schematische Lernansicht. Vor Anwendung Alter, Gewicht, Stadium, Konzentration und Original-VFA prüfen. Adrenalin i.m., inhalatives Adrenalin, Prednisolon und Dimetinden werden getrennt vorbereitet.</p>
  </section>;
}
