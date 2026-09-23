import type { ComponentType, ReactNode } from "react";

type FigureProps = { src: string; alt: string; caption: string; wide?: boolean };
type Props = { Figure: ComponentType<FigureProps>; Vfa: ComponentType<FigureProps>; children: ReactNode };

export default function ExtremitaetentraumaLesson({ Figure, Vfa, children }: Props) {
  const section = (number: string, title: string, body: ReactNode) => <section className="lesson-section" key={number}><header className="chapter-heading"><span>{number}</span><div><small>Extremitätentrauma</small><h2>{title}</h2></div></header><div className="lesson-prose script-copy">{body}</div></section>;
  return <article className="lesson-article">
    <div className="lesson-intro"><p className="lead">Eine Verletzung von Arm oder Bein kann Knochen, Gelenke und Weichteile betreffen. Im Mittelpunkt stehen Blutung, Durchblutung, Motorik, Sensibilität und eine möglichst schonende Versorgung.</p></div>
    {section("01", "Definition", <><p>Die Fraktur ist eine durch Stoß, Schlag, Aufprall, Fall oder Überbelastung hervorgerufene Kontinuitätstrennung eines Extremitätenknochens unter Bildung von zwei oder mehreren Bruchstücken.</p><p>Beim Extremitätentrauma können darüber hinaus Gelenke, Muskeln, Sehnen, Bänder, Gefäße und Nerven verletzt sein.</p></>)}
    {section("02", "Anatomie und Physiologie", <>
      <div className="extremity-system-grid">
        <div className="extremity-system-card">
          <small>Struktur & Stabilität</small>
          <h3>Passiver Bewegungsapparat</h3>
          <p>Knochen, Knorpel, Gelenke und Bänder stützen, schützen und führen die Bewegung.</p>
        </div>
        <div className="extremity-system-card">
          <small>Bewegung & Haltung</small>
          <h3>Aktiver Bewegungsapparat</h3>
          <p>Die quergestreifte Skelettmuskulatur bewegt und fixiert Körperabschnitte. Sehnen übertragen ihre Kraft auf den Knochen.</p>
        </div>
      </div>
      <p>Knochen speichern Mineralstoffe, dienen als Muskelansatz und enthalten blutbildendes Knochenmark.</p>
      <h3>Röhrenknochen</h3>
      <p>Ein Röhrenknochen besitzt zwei Epiphysen, dazwischen Metaphysen und eine Diaphyse. Außen liegen Periost und Kompakta, innen Spongiosa und Markraum.</p>
      <Figure src="/lessons/extremitaetentrauma/im1-sharp.png" alt="Röhrenknochen mit Epiphyse, Metaphyse und Diaphyse" caption="Röhrenknochen · äußere Abschnitte" wide />
      <Figure src="/lessons/extremitaetentrauma/im2-sharp.png" alt="Röhrenknochen mit Periost, Kompakta, Spongiosa und Markraum" caption="Röhrenknochen · innerer Aufbau" wide />
      <h3>Knorpel und Gelenke</h3>
      <p>Knorpel ist gefäßlos und wird durch Diffusion versorgt. Osteoblasten bauen Knochen auf, Osteoklasten bauen ihn ab. Echte Gelenke besitzen Gelenkflächen mit Knorpel, einen Gelenkspalt und eine Kapsel; Bänder führen und stabilisieren.</p>
      <Figure src="/lessons/extremitaetentrauma/im3-sharp.png" alt="Beschrifteter Querschnitt eines echten Gelenks" caption="Gelenkaufbau" />
      <Figure src="/lessons/extremitaetentrauma/im4-sharp.png" alt="Verschiedene Gelenkformen mit Bewegungsachsen" caption="Gelenkformen und Beweglichkeit" wide />
    </>)}
{section("03", "Pathophysiologie und Ursachen", <><p>Direkte Gewalt, Sturz, Verdrehung oder Überlastung können geschlossene oder offene Frakturen, Luxationen sowie Muskel-, Sehnen- und Bandverletzungen auslösen. Bei offenen Verletzungen besteht eine Verbindung zur Außenwelt; auch kleine Wunden über einer Fraktur sind deshalb wichtig.</p><p>Bruchenden und Schwellung können Gefäße und Nerven schädigen. Die Einblutung in Weichteile kann erheblich sein; besonders bei großen Knochen und mehreren Verletzungen ist der Kreislauf mitzubewerten. Eine zunehmende Schwellung in einem engen Muskelkompartiment kann dessen Perfusion gefährden.</p><h3>Häufige Frakturformen</h3><p>Die Begriffe beschreiben unterschiedliche Merkmale: Vollständigkeit, Verlauf der Bruchlinie oder Zahl der Fragmente. Sie können bei einer Verletzung gemeinsam zutreffen.</p><ul className="script-list"><li><b>Grünholzfraktur:</b> unvollständiger Biegebruch beim Kind; eine Knochenseite bricht, die Gegenseite verbiegt sich.</li><li><b>Wulstfraktur (Torusfraktur):</b> Stauchung mit Aufwölbung der Knochenrinde, vor allem bei Kindern.</li><li><b>Querfraktur:</b> Bruchlinie verläuft annähernd quer zur Längsachse des Knochens.</li><li><b>Schrägfraktur:</b> Bruchlinie verläuft schräg durch den Knochen.</li><li><b>Spiralfraktur:</b> schraubenförmiger Bruchverlauf, häufig nach Verdrehung.</li><li><b>Trümmerfraktur (Mehrfragmentfraktur):</b> der Knochen ist in mindestens drei Fragmente gebrochen.</li></ul></>)}
    {section("04", "Welche Symptome stützen die Arbeitsdiagnose?", <><p>Schmerz, Schwellung, Schonhaltung, Hämatom, Funktionsverlust und Druckempfindlichkeit stützen den Verdacht. Fehlstellung, Stufenbildung, abnorme Beweglichkeit oder sichtbare Knochenanteile sprechen stärker für eine Fraktur. Krepitation wird nicht absichtlich provoziert.</p><aside className="red-flags"><span>!</span><div><small>Red Flags</small><h3>Offene Verletzung oder gefährdete Extremität</h3><p>Starke Blutung, fehlende oder verschlechterte periphere Durchblutung, neue Sensibilitäts- oder Motorikstörung sowie unverhältnismäßig zunehmender Schmerz verlangen sofortige Re-Evaluation.</p></div></aside></>)}
{section("05", "Komplikationen und Gefahren", <><p>Relevante Gefahren sind Blutverlust bis zum Schock, Gefäß- und Nervenschäden, Infektion bei offener Fraktur sowie Kompartmentsyndrom. Nach langen Röhrenknochenfrakturen ist auch eine Fettembolie möglich. Begleitverletzungen an Wirbelsäule, Becken oder Thorax dürfen nicht übersehen werden.</p><Figure src="/lessons/extremitaetentrauma/im5-sharp.png" alt="Grafik zu möglichen Blutverlusten bei Trauma und Frakturen" caption="Blutverlust bei verschiedenen Verletzungen · Größenordnungen aus der Vorlage" wide /></>)}
    {section("06", "Welche Einsatzmaterialien nehmen Sie mit?", <div className="material-chips">{["Notfallrucksack", "Blutstillung / Verbandmaterial", "Sauerstoff / Beatmung", "Monitoring", "Absaugung", "Traumatasche", "Schienen / Vakuumschiene", "i.v.-Material", "Morphin", "Esketamin / Ketanest", "Wärmeerhalt"].map(x => <span key={x}>{x}</span>)}</div>)}
    {section("07", "Erstmaßnahmen und Anamnese", <>
      <div className="extremity-action-grid">
        <div><span>01</span><b>Prioritäten</b><p>Eigenschutz, Blutung stoppen, cABCDE.</p></div>
        <div><span>02</span><b>Untersuchen</b><p>Schonend freilegen; pDMS im Seitenvergleich prüfen.</p></div>
        <div><span>03</span><b>Versorgen</b><p>Wunde steril abdecken, Extremität schienen, Schmerz erfassen.</p></div>
        <div><span>04</span><b>Kontrollieren</b><p>pDMS erneut prüfen und dokumentieren; Monitoring, Wärmeerhalt, Transport.</p></div>
      </div>
      <p className="extremity-priority-note">Bei instabilem Zustand: lebensrettende Maßnahmen und zügiger Transport vor der ausführlichen Extremitätenuntersuchung.</p>
      <h3>SAMPLERS</h3>
      <div className="samplers-grid extremity-samplers">
        <p><b>S · Symptome</b>Schmerz, Ausfälle, Verlauf</p>
        <p><b>A · Allergien</b>Bekannte Unverträglichkeiten</p>
        <p><b>M · Medikamente</b>Besonders Antikoagulanzien</p>
        <p><b>P · Patientengeschichte</b>Relevante Vorerkrankungen</p>
        <p><b>L · Letzte Aufnahme</b>Essen und Trinken</p>
        <p><b>E · Ereignis</b>Unfallmechanismus, Zeitpunkt</p>
        <p><b>R · Risikofaktoren</b>Weitere Gefährdungen</p>
        <p><b>S · Schwangerschaft</b>Falls relevant</p>
      </div>
      <p className="extremity-opqrst"><b>OPQRST:</b> Schmerzbeginn, Auslöser, Qualität, Ort, Stärke (NRS) und zeitlichen Verlauf knapp erfassen.</p>
    </>)}
    {section("08", "Differenzialdiagnosen und Entscheidungsfindung", <><div className="differential-grid">{["Luxation", "Distorsion / Bandverletzung", "Muskel- oder Sehnenverletzung", "Gefäß- / Nervenverletzung", "Amputation", "Begleitendes Becken- oder Wirbelsäulentrauma"].map(x => <span key={x}>{x}</span>)}</div><p>Fehlstellung allein unterscheidet Fraktur und Luxation nicht sicher. Die Entscheidung richtet sich nach Gesamtzustand, offenen Wunden, pDMS und Schmerz. Eine pauschale Reposition am Einsatzort ist keine Regel. Bei bedrohter Perfusion oder neurologischem Defizit nach lokalen Vorgaben und mit ärztlicher Rücksprache handeln.</p></>)}
    {section("09", "Weitere Maßnahmen und Analgesie", <><p>Die Extremität in möglichst schmerzarmer Stellung stabilisieren und benachbarte Gelenke mit einbeziehen. Offene Frakturen steril abdecken; herausragende Knochen nicht zurückdrücken. pDMS und Schmerz vor und nach jeder Maßnahme erneut dokumentieren. Bei kritischem Befund Notarzt nachfordern und geeignete Zielklinik früh wählen.</p><h3>Thüringer Schmerz-VFA</h3><p>Ab NRS 5 erfolgt nach cABCDE und OPQRST die ursachenbezogene Auswahl nach VFA 35 und den Vorgaben des zuständigen ÄLRD. Für dieses Kapitel sind Morphin (VFA 38) und Esketamin/Ketanest (VFA 36) relevant. Kontraindikationen, Überwachung, Beatmungsbereitschaft und Wirkungskontrollen gehören zur Anwendung.</p><div className="reading-columns"><div><h3>Morphin</h3><p>Langsame i.v.-Gabe nach Gewichtstabelle, Wirkung nach fünf Minuten prüfen und bei Bedarf halbe Dosis gemäß VFA wiederholen; maximal insgesamt 10 mg. Der Algorithmus verweist Kinder unter 40 kg auf den Kinder-Esketaminpfad.</p></div><div><h3>Esketamin / Ketanest</h3><p>Der Erwachsenenpfad enthält Midazolam als Begleitmedikation und danach 0,2 mg/kg Esketamin langsam i.v. Bei unzureichender Wirkung ist nach den Kontrollschritten eine halbe Initialdosis vorgesehen. Ausschlaggebend sind Originalalgorithmus und lokale Freigabe.</p></div></div></>)}
    {section("10", "VFA Thüringen 2026/2027 und Dosierungsanlagen", <><div className="vfa-stack"><Vfa src="/lessons/sht/vfa-schmerz-basis-35.png" alt="Thüringer VFA 35 zu starken Schmerzzuständen" caption="VFA 35 · Starke Schmerzzustände" /><Vfa src="/lessons/sht/vfa-morphin-38.png" alt="Thüringer VFA 38 Morphin" caption="VFA 38 · Morphin" /><Vfa src="/lessons/sht/vfa-esketamin-36.png" alt="Thüringer VFA 36 Esketamin" caption="VFA 36 · Esketamin / Ketanest" /></div><h3>Vorbereitung · Anlage B2A</h3><p>Morphin: 10 mg in 1 ml plus 9 ml NaCl 0,9 % ergeben 1 mg/ml. Esketamin: 50 mg in 2 ml plus 8 ml NaCl 0,9 % ergeben 5 mg/ml. Konzentration und Spritze vor Gabe prüfen.</p><Figure src="/lessons/sht/medikamentenliste-morphin.png" alt="Originalausschnitt B2A Morphin-Verdünnung" caption="Anlage B2A · Morphin" wide /><Figure src="/lessons/wirbelsaeulentrauma/anlage-b2a-esketamin.png" alt="Originalausschnitt B2A Esketamin-Verdünnung" caption="Anlage B2A · Esketamin" wide /><h3>Gewichtstabellen · Anlage B2B</h3><Figure src="/lessons/wirbelsaeulentrauma/anlage-b2b-morphin.png" alt="Gewichtsbezogene Morphin-Dosierung aus Anlage B2B" caption="Anlage B2B · Morphin" wide /><Figure src="/lessons/wirbelsaeulentrauma/anlage-b2b-esketamin.png" alt="Gewichtsbezogene Esketamin-Dosierung aus Anlage B2B" caption="Anlage B2B · Esketamin" wide /></>)}
    {children}
<p className="lesson-source">Grundlage: Print 7.pdf. Analgesie und Dosierungen: Thüringer VFA 2026/2027, Nr. 35, 36 und 38 sowie Anlagen B2A/B2B. Abbildungen aus der bereitgestellten Vorlage. Aktiver Bewegungsapparat fachlich mit <a href="https://openstax.org/books/anatomy-and-physiology-2e/pages/10-2-skeletal-muscle" target="_blank" rel="noreferrer">OpenStax Anatomie und Physiologie</a> abgeglichen. Frakturformen ergänzt und geprüft mit der <a href="https://register.awmf.org/assets/guidelines/006-060l_S1_Tibia-und-Unterschenkelschaftfrakturen-im-Kindesalter_2025-09.pdf" target="_blank" rel="noreferrer">AWMF-Leitlinie zu kindlichen Unterschenkelfrakturen</a> und der <a href="https://surgeryreference.aofoundation.org/orthopedic-trauma/pediatric-trauma/proximal-humerus/torus-buckle-and-greenstick/definition" target="_blank" rel="noreferrer">AO Surgery Reference</a>.</p>
  </article>;
}
