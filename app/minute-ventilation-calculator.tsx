"use client";

import { useMemo, useState } from "react";

export default function MinuteVentilationCalculator() {
  const [tidalVolume, setTidalVolume] = useState(500);
  const [frequency, setFrequency] = useState(12);
  const minuteVolume = useMemo(() => Math.max(0, tidalVolume) * Math.max(0, frequency) / 1000, [tidalVolume, frequency]);

  return <section className="oxygen-calculator" aria-labelledby="amv-calculator-title">
    <div className="oxygen-calculator-heading"><div><small>Interaktiv rechnen</small><h3 id="amv-calculator-title">Atemminutenvolumen (AMV)</h3><p>Das AMV beschreibt das gesamte pro Minute bewegte Atemgas. Es ersetzt nicht die Beurteilung der alveolären Ventilation.</p></div><span>VT × f</span></div>
    <div className="oxygen-input-grid">
      <label><span>Atemzugvolumen VT</span><input type="number" min="0" step="10" value={tidalVolume} onChange={(event) => setTidalVolume(Number(event.target.value))} /><small>ml pro Atemzug</small></label>
      <label><span>Atemfrequenz f</span><input type="number" min="0" step="1" value={frequency} onChange={(event) => setFrequency(Number(event.target.value))} /><small>Atemzüge pro Minute</small></label>
    </div>
    <div className="oxygen-results"><article><small>Berechnetes AMV</small><b>{minuteVolume.toLocaleString("de-DE", { maximumFractionDigits: 2 })} l/min</b><span>{tidalVolume} ml × {frequency}/min ÷ 1000</span></article></div>
    <p className="oxygen-formula"><b>Prüfungsfalle:</b> Bei druckkontrollierter Beatmung ist das Atemzugvolumen das Ergebnis und kann sich bei veränderter Compliance oder Resistance ändern. Deshalb exspiratorisches VT, AMV, etCO₂, Thoraxexkursion und Beatmungsdrücke gemeinsam überwachen.</p>
  </section>;
}
