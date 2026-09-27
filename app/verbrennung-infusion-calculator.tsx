"use client";

import { useState } from "react";
import { calculateBurnInfusionMaximum } from "./lib/burnInfusion";

const format = (value: number) => new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);

export default function BurnInfusionCalculator() {
  const [weight, setWeight] = useState("");
  const [minutes, setMinutes] = useState("60");
  const weightKg = Number(weight.replace(",", "."));
  const duration = Number(minutes.replace(",", "."));
  const result = weight.trim() && minutes.trim() ? calculateBurnInfusionMaximum(weightKg, duration) : null;
  return <section className="burn-infusion-card" aria-label="Infusionsrechner nach VFA 34">
    <div className="burn-infusion-header"><span aria-hidden="true">◉</span><div><small>VFA 34 · Kristalloide Infusionslösung</small><h3>Infusions-Obergrenze berechnen</h3><p>Wie bei der Spritzenansicht: Gewicht eintragen, Rate und rechnerisches Volumen direkt ablesen.</p></div></div>
    <div className="burn-infusion-form"><label>Körpergewicht <span>kgKG</span><input type="text" inputMode="decimal" value={weight} onChange={event => setWeight(event.target.value)} placeholder="z. B. 60" aria-label="Körpergewicht in Kilogramm" /></label><label>Zeitraum <span>Minuten</span><input type="text" inputMode="decimal" value={minutes} onChange={event => setMinutes(event.target.value)} aria-label="Zeitraum in Minuten" /></label></div>
    <div className="burn-infusion-result" aria-live="polite">{result ? <><div><small>Maximale Rate</small><strong>{format(result.mlPerHour)} <span>ml/h</span></strong></div><div><small>Rechnerisch in {format(duration)} min</small><strong>{format(result.volumeMl)} <span>ml</span></strong></div></> : <p>{weight || !minutes ? "Bitte gültiges Gewicht (über 0 bis 350 kg) und einen Zeitraum (1 bis 1440 Minuten) eingeben." : "Gewicht eingeben, um die VFA-Obergrenze zu berechnen."}</p>}</div>
    <p className="burn-infusion-equation">{result ? `${format(weightKg)} kg × 10 ml/kgKG/h = ${format(result.mlPerHour)} ml/h` : "kgKG × 10 ml/kgKG/h = maximale ml/h"}</p>
    <p className="burn-infusion-warning"><b>Wichtig:</b> „max. 10 ml/kgKG/h“ ist eine Höchstgeschwindigkeit, keine pauschale Infusionsanordnung. Volumenbedarf, Schock, Alter, Verlauf und Begleitverletzungen gesondert beurteilen; die Parkland-Formel wird hier nicht als präklinische VFA-Rate verwendet.</p>
  </section>;
}
