"use client";

import { useMemo, useState } from "react";

const clampNumber = (value: string, fallback: number) => {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const formatNumber = (value: number, digits = 0) =>
  new Intl.NumberFormat("de-DE", { maximumFractionDigits: digits }).format(value);

export default function OxygenCylinderCalculator() {
  const [cylinderSize, setCylinderSize] = useState("2");
  const [pressure, setPressure] = useState("200");
  const [flow, setFlow] = useState("2");
  const [reserve, setReserve] = useState("0");

  const result = useMemo(() => {
    const size = clampNumber(cylinderSize, 0);
    const currentPressure = clampNumber(pressure, 0);
    const selectedFlow = clampNumber(flow, 0);
    const safetyReserve = Math.min(clampNumber(reserve, 0), currentPressure);
    const nominalVolume = size * currentPressure;
    const usableVolume = size * Math.max(currentPressure - safetyReserve, 0);
    const minutes = selectedFlow > 0 ? usableVolume / selectedFlow : 0;
    return { nominalVolume, usableVolume, minutes, selectedFlow, safetyReserve };
  }, [cylinderSize, pressure, flow, reserve]);

  return <div className="oxygen-calculator">
    <div className="oxygen-calculator-heading"><div><small>Interaktiv rechnen</small><h3>Sauerstoffvorrat und Laufzeit</h3><p>Werte eingeben oder eine typische Flaschengröße auswählen.</p></div><span>O₂</span></div>
    <div className="oxygen-presets" role="group" aria-label="Flaschengröße auswählen">
      {["2", "10"].map(size => <button key={size} type="button" className={cylinderSize === size ? "active" : ""} onClick={() => setCylinderSize(size)}>{size}-Liter-Flasche</button>)}
    </div>
    <div className="oxygen-input-grid">
      <label><span>Flaschengröße</span><div><input inputMode="decimal" value={cylinderSize} onChange={event => setCylinderSize(event.target.value)} aria-label="Flaschengröße in Litern" /><b>l</b></div></label>
      <label><span>Flaschendruck</span><div><input inputMode="decimal" value={pressure} onChange={event => setPressure(event.target.value)} aria-label="Flaschendruck in Bar" /><b>bar</b></div></label>
      <label><span>Sauerstofffluss</span><div><input inputMode="decimal" value={flow} onChange={event => setFlow(event.target.value)} aria-label="Sauerstofffluss in Litern pro Minute" /><b>l/min</b></div></label>
      <label><span>Sicherheitsreserve</span><div><input inputMode="decimal" value={reserve} onChange={event => setReserve(event.target.value)} aria-label="Sicherheitsreserve in Bar" /><b>bar</b></div></label>
    </div>
    <div className="oxygen-flow-presets" role="group" aria-label="Sauerstofffluss auswählen">
      {["2", "4", "6", "10", "15"].map(value => <button key={value} type="button" className={flow === value ? "active" : ""} onClick={() => setFlow(value)}>{value} l/min</button>)}
    </div>
    <div className="oxygen-results" aria-live="polite">
      <article><small>Gesamtvorrat</small><b>{formatNumber(result.nominalVolume)} l</b><p>{formatNumber(clampNumber(cylinderSize, 0), 1)} l × {formatNumber(clampNumber(pressure, 0))} bar</p></article>
      <article><small>Nutzbarer Vorrat</small><b>{formatNumber(result.usableVolume)} l</b><p>nach {formatNumber(result.safetyReserve)} bar Reserve</p></article>
      <article className="primary"><small>Rechnerische Laufzeit</small><b>{result.selectedFlow > 0 ? `${formatNumber(result.minutes, 1)} min` : "–"}</b><p>{result.selectedFlow > 0 ? `bei ${formatNumber(result.selectedFlow, 1)} l/min` : "Fluss größer als 0 eingeben"}</p></article>
    </div>
    <div className="oxygen-formula"><span>Flaschenvolumen × (Druck − Reserve)</span><i>÷</i><span>Fluss pro Minute</span><i>=</i><b>Laufzeit</b></div>
    <aside className="communication-exam-tip"><b>Beispiel</b><p>2-l-Flasche bei 200 bar enthält rechnerisch 400 l Sauerstoff. Bei 2 l/min reicht sie ohne Reserve 200 Minuten. Reale Laufzeit kann durch Restdruck, Leckagen und Geräteverbrauch kürzer sein – Vorrat deshalb regelmäßig kontrollieren.</p></aside>
  </div>;
}
