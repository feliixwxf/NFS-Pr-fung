"use client";

import { ReactNode, useRef } from "react";

function OrganisationSection({ number, kicker, title, children }: { number: string; kicker: string; title: string; children: ReactNode }) {
  return <details className="communication-section organisation-section"><summary><span>{number}</span><div><small>{kicker}</small><h2>{title}</h2></div><i>⌄</i></summary><div className="communication-section-content">{children}</div></details>;
}

export default function OrganisationLesson({ onBack, finale }: { onBack: () => void; finale: ReactNode }) {
  const flowRef = useRef<HTMLDivElement>(null);
  const toggleAll = (open: boolean) => flowRef.current?.querySelectorAll<HTMLDetailsElement>("details").forEach(section => { section.open = open; });

  return <section className="page-section legal-reader communication-reader organisation-reader">
    <button className="back-button" onClick={onBack}>← Schriftliche Fachbereiche</button>
    <header className="communication-hero organisation-hero"><div><span className="eyebrow light">Schriftliche Prüfung · Organisation &amp; Einsatztaktik</span><h1>Lage erkennen.<br />Kräfte ordnen. Sicher führen.</h1><p>Von der ersten Lageübersicht bis zur strukturierten Bewältigung eines MANV – prüfungsnah für den Thüringer Rettungsdienst.</p></div><div><b>12</b><span>Lernfelder</span><small>Rechtsstand 10/2026</small></div></header>
    <aside className="communication-focus organisation-focus"><span>⌖</span><div><b>Prüfungsfokus Thüringen</b><p>Taktische Entscheidungen begründen, Zuständigkeiten trennen und die eigene Maßnahme in die gemeinsame Einsatzstruktur einordnen.</p></div></aside>
    <div className="communication-toolbar" role="group" aria-label="Leseabschnitte steuern"><button type="button" onClick={() => toggleAll(true)}>Alles ausklappen</button><button type="button" onClick={() => toggleAll(false)}>Alles einklappen</button><small>Beim Öffnen sind die Lernfelder zur besseren Übersicht eingeklappt.</small></div>

    <div className="communication-reading-flow" ref={flowRef}>
      <OrganisationSection number="01" kicker="System Thüringen" title="Träger, Aufgaben und Hilfsfrist"><div className="communication-copy">
        <p>Der Rettungsdienst ist Teil der staatlichen Daseinsvorsorge. Für eine sichere Prüfungsantwort müssen <b>Trägerschaft, Auftrag und konkrete Durchführung</b> getrennt werden.</p>
        <div className="organisation-three-grid"><article><span>Landkreis / Stadt</span><h3>Bodengebundener Rettungsdienst</h3><p>Einschließlich Berg- und Wasserrettung im gesetzlichen Aufgabenbereich.</p></article><article><span>KVT</span><h3>Notärztliche Versorgung</h3><p>Einschließlich der landesrechtlich vorgesehenen Telenotarztstruktur.</p></article><article><span>Land Thüringen</span><h3>Luftrettung</h3><p>Planung und Sicherstellung der Luftrettung.</p></article></div>
        <h3>Hilfsfrist als Planungsinstrument</h3><div className="timeline-equation"><span><b>1 min</b>Alarmierung / Disposition</span><i>+</i><span><b>1 min</b>Ausrücken</span><i>+</i><span><b>12 / 15 min</b>Fahrt</span><i>=</i><span className="result"><b>14 / 17 min</b>planerisch</span></div>
        <aside className="communication-exam-tip"><b>Prüfungsfalle</b><p>Der Landesrettungsdienstplan arbeitet grundsätzlich mit einem Erreichungsgrad von 95 Prozent. Das ist keine Garantie für jeden Einzelfall. Luftrettung sowie besondere Berg- und Wasserrettungslagen werden nicht schematisch mit derselben Frist bewertet.</p></aside>
      </div></OrganisationSection>

      <OrganisationSection number="02" kicker="Erste Lageübersicht" title="Die 4-S-Matrix"><div className="communication-copy">
        <div className="organisation-four-s"><article><b>Scene</b><p>Wo genau? Welche Ausdehnung, Zugänge und räumlichen Besonderheiten?</p></article><article><b>Safety</b><p>Welche Gefahren? Wo ist ein sicherer Standort und welche PSA ist erforderlich?</p></article><article><b>Situation</b><p>Was ist geschehen, wie viele Betroffene, welche Dynamik ist erkennbar?</p></article><article><b>Support</b><p>Welche Kräfte, Führung, Spezialmittel und Transportressourcen werden benötigt?</p></article></div>
        <p>Die Matrix erzeugt eine <b>frühe, handlungsfähige Lageübersicht</b>. Sie ersetzt weder cABCDE am Patienten noch die laufende Erkundung.</p>
      </div></OrganisationSection>

      <OrganisationSection number="03" kicker="Gefahrenanalyse" title="Ursache – Wirkung – bedrohtes Objekt"><div className="communication-copy">
        <div className="hazard-chain"><span><small>1</small><b>Gefahrenursache</b><em>z. B. Leckage</em></span><i>→</i><span><small>2</small><b>Schädigende Wirkung</b><em>z. B. giftige Wolke</em></span><i>→</i><span><small>3</small><b>Bedrohtes Objekt</b><em>Mensch, Tier, Umwelt, Sachwert</em></span></div>
        <p>Taktische Maßnahmen können an der Ursache, am Ausbreitungsweg oder am bedrohten Objekt ansetzen. Bei mehreren Gefahren werden zuerst Eigengefährdung und akut lebensbedrohliche Einwirkungen begrenzt; die Lage bleibt dynamisch.</p>
        <h3>4A–1C–4E</h3><div className="organisation-acronym-grid"><article><b>4A</b><p>Atemgifte · Angstreaktion · Ausbreitung · atomare Strahlung</p></article><article><b>1C</b><p>Chemische Stoffe</p></article><article><b>4E</b><p>Erkrankung/Verletzung · Explosion · Elektrizität · Einsturz</p></article></div>
      </div></OrganisationSection>

      <OrganisationSection number="04" kicker="CBRN-Lage" title="GAMS: Rettung nur unter Eigenschutz"><div className="communication-copy">
        <div className="closed-loop-model organisation-gams"><span><b>G</b>Gefahr erkennen</span><i>→</i><span><b>A</b>Absperren</span><i>→</i><span><b>M</b>Menschenrettung unter Eigenschutz</span><i>→</i><span><b>S</b>Spezialkräfte anfordern</span></div>
        <aside className="communication-case"><small>Konsequenz für den Rettungsdienst</small><p>Nicht freigegebene Gefahrenbereiche werden ohne geeignete Schutzausrüstung und klaren Auftrag nicht betreten. Übergabepunkt, Dekontamination und medizinische Versorgung werden mit Feuerwehr und Spezialkräften abgestimmt.</p></aside>
      </div></OrganisationSection>

      <OrganisationSection number="05" kicker="Erstes Rettungsmittel" title="Vom Eintreffen bis zur Führungsübergabe"><div className="communication-copy">
        <ol className="organisation-action-list"><li><b>Sicher annähern</b><span>Informationen auf Anfahrt nutzen, Windrichtung, Verkehr, Folgegefahren und sichere Aufstellung beachten.</span></li><li><b>Erste Meldung</b><span>Eintreffen, Lage auf Sicht, sicheren Anfahrtsweg und erkennbare Besonderheiten melden.</span></li><li><b>Erkunden</b><span>Art, Ausmaß, Dynamik, Gefahren und grobe Betroffenenzahl erfassen.</span></li><li><b>Nachfordern</b><span>Rettungsmittel, Führung, Feuerwehr, Polizei und Spezialkräfte lagebezogen anfordern.</span></li><li><b>Ordnen</b><span>Vorläufige Einsatz- und Raumstruktur schaffen; Zufahrten freihalten.</span></li><li><b>Priorisieren</b><span>Vorsichtung nach örtlichem Konzept, Kennzeichnung und lebensrettende Sofortmaßnahmen.</span></li><li><b>Übergeben</b><span>Lage, Entscheidungen, offene Gefahren, Kräfte, Räume und Dokumentation strukturiert übergeben.</span></li></ol>
        <aside className="communication-exam-tip"><b>Prüfungsstark</b><p>Früh und ehrlich melden: Schätzungen werden als Schätzungen benannt und nach genauerer Erkundung aktualisiert. Eine verspätete „perfekte“ Meldung ist taktisch schlechter als eine rechtzeitige qualifizierte Erstmeldung.</p></aside>
      </div></OrganisationSection>

      <OrganisationSection number="06" kicker="Großlage" title="MANV und überörtliche Unterstützung"><div className="communication-copy">
        <div className="communication-compare"><article><small>Örtlich beherrschbar</small><h3>MANV</h3><p>Patientenaufkommen und Bedarf übersteigen zunächst die Regelvorhaltung; vorgesehene örtliche Strukturen und Ressourcen werden aktiviert.</p></article><article><small>Örtliche Mittel reichen nicht</small><h3>Überörtliche Hilfe</h3><p>Zusätzliche Einheiten und Führungsunterstützung werden nach Landes- und örtlichem Alarmplan angefordert und eingegliedert.</p></article></div>
        <p>In der frühen Mangellage kann nicht jede Person sofort individualmedizinisch maximal versorgt werden. Ziel ist der <b>bestmögliche Gesamtnutzen mit den verfügbaren Ressourcen</b>, ohne Eigenschutz, Dokumentation und Re-Evaluation aufzugeben.</p>
        <aside className="communication-case"><small>Keine starre Zahl</small><p>MANV-Stufen, Module und Alarmierungsschwellen werden durch den örtlichen Alarm- und Einsatzplan konkretisiert. Eine einzelne, überall identische Patientenzahl ist keine sichere Definition.</p></aside>
      </div></OrganisationSection>

      <OrganisationSection number="07" kicker="Raumordnung" title="Räume mit klarer Funktion"><div className="communication-copy">
        <div className="organisation-room-flow"><article><span>Gefahrenbereich</span><b>Schadensstelle</b><p>Technische Rettung und Gefahrenabwehr.</p></article><i>→</i><article><span>Erste Ordnung</span><b>Patientenablage</b><p>Sammeln, erste Versorgung und Priorisierung.</p></article><i>→</i><article><span>Behandlung</span><b>Behandlungsplatz</b><p>Strukturierte Behandlung und Transportvorbereitung.</p></article><i>→</i><article><span>Abtransport</span><b>Transportorganisation</b><p>Zielklinik, Transportpriorität und Rettungsmittel.</p></article></div>
        <div className="communication-grid"><article><b>Bereitstellungsraum</b><p>Angeforderte, noch nicht eingesetzte Kräfte und Mittel warten geordnet auf Auftrag.</p></article><article><b>Rettungsmittelhalteplatz</b><p>Transportmittel werden geführt bereitgestellt; Zu- und Abfahrt bleiben konfliktarm.</p></article><article><b>RTH-Landefläche</b><p>Sicher, ausreichend groß, frei von Hindernissen und mit Einsatzleitung abgestimmt.</p></article><article><b>Führungsstelle</b><p>Lagebild, Entscheidungen, Kommunikation und Dokumentation laufen zusammen.</p></article></div>
      </div></OrganisationSection>

      <OrganisationSection number="08" kicker="Priorisierung" title="Vorsichtung, Sichtung und Re-Sichtung"><div className="communication-copy">
        <div className="organisation-triage-grid"><article className="red"><b>I · Rot</b><p>Akute vitale Bedrohung<br />sofortige Behandlung</p></article><article className="yellow"><b>II · Gelb</b><p>Schwer verletzt/erkrankt<br />dringliche Behandlung</p></article><article className="green"><b>III · Grün</b><p>Leicht verletzt/erkrankt<br />nicht dringliche Behandlung</p></article><article className="blue"><b>IV · Blau</b><p>Ohne Überlebenschance<br />palliativ, ärztliche Zuordnung</p></article><article className="black"><b>EX · Schwarz</b><p>Verstorben<br />ärztliche Feststellung</p></article></div>
        <p><b>Vorsichtung</b> ist die schnelle erste Priorisierung nach verbindlichem Algorithmus. Die <b>ärztliche Sichtung</b> setzt medizinische Behandlungs- und Transportprioritäten. Beide sind Momentaufnahmen: Zustandsänderung, Therapie oder Wartezeit erfordern Re-Sichtung.</p>
        <aside className="communication-exam-tip"><b>Planungswerte sind keine Sollquote</b><p>In Unterlagen genannte Verteilungen wie 20 Prozent Rot, 30 Prozent Gelb und 50 Prozent Grün dienen der Ressourcenplanung. Die Kategorie ergibt sich immer aus dem Patientenbefund.</p></aside>
      </div></OrganisationSection>

      <OrganisationSection number="09" kicker="Algorithmus" title="mSTaRT verstehen – örtliche Vorgabe beachten"><div className="communication-copy">
        <div className="organisation-decision-grid"><span>Gehfähig?</span><span>Lebensbedrohliche Blutung?</span><span>Atmung nach Atemwegsöffnung?</span><span>Atemfrequenz auffällig?</span><span>Radialispuls tastbar?</span><span>Einfache Aufforderung möglich?</span></div>
        <p>mSTaRT ordnet Erwachsene anhand weniger zeitkritischer Befunde vor. Gehfähige Personen werden zunächst gesammelt und erneut bewertet; vitale Störungen führen zur höchsten Priorität. Offensichtlich tödliche Verletzungen und Sonderkriterien werden nach dem verbindlichen Konzept behandelt.</p>
        <aside className="communication-case"><small>Wichtig</small><p>Das bereitgestellte Ablaufschema zeigt eine konkrete Ausgestaltung. In der Praxis gelten der Thüringer beziehungsweise örtliche Algorithmus, die festgelegte Kennzeichnung und die dienstliche Schulung.</p></aside>
      </div></OrganisationSection>

      <OrganisationSection number="10" kicker="Führungsorganisation" title="OrgL, LNA und Einsatzleitung"><div className="communication-copy">
        <div className="communication-compare"><article><small>Organisation</small><h3>OrgL Rettungsdienst</h3><p>Ordnet Personal, Material, Räume, Rettungsmittel, Bereitstellung und Transportlogistik.</p></article><article><small>Medizin</small><h3>Leitender Notarzt</h3><p>Beurteilt die medizinische Lage und setzt Sichtungs-, Behandlungs- und Transportgrundsätze.</p></article></div>
        <p>OrgL und LNA arbeiten abgestimmt innerhalb der Gesamtführung. Patientenspezifische medizinische Entscheidungen, organisatorische Befehlswege und die übergeordnete Einsatzleitung dürfen in der Prüfung nicht vermischt werden.</p>
      </div></OrganisationSection>

      <OrganisationSection number="11" kicker="FwDV 100" title="Führung als Regelkreis"><div className="communication-copy">
        <div className="organisation-command-cycle"><span><b>1</b>Lage feststellen<small>erkunden · kontrollieren</small></span><i>→</i><span><b>2</b>Planen<small>beurteilen · entschließen</small></span><i>→</i><span><b>3</b>Befehl geben<small>klar · eindeutig · durchführbar</small></span><i>↻</i></div>
        <div className="communication-compare"><article><small>Zeitkritik / Gefahr</small><h3>Eng und eindeutig führen</h3><p>Kurze Aufträge, benannte Empfänger, klare Grenzen und konsequente Kontrolle.</p></article><article><small>Stabilere Lage / Erfahrung</small><h3>Kooperativ führen</h3><p>Fachwissen einbeziehen, Verantwortung übertragen und Rückmeldungen nutzen.</p></article></div>
        <p>Gute Führung bleibt lageabhängig. Auch bei enger Führung müssen Sicherheitsbedenken geäußert und Aufträge rückbestätigt werden können.</p>
      </div></OrganisationSection>

      <OrganisationSection number="12" kicker="Prüfungstransfer" title="Zusammenarbeit, Regelwerke und typische Fallen"><div className="communication-copy">
        <div className="communication-grid"><article><b>Feuerwehr</b><p>Gefahrenabwehr, technische Rettung und Freigabe gefährdeter Bereiche mit dem medizinischen Vorgehen verzahnen.</p></article><article><b>Polizei</b><p>Eigensicherung, Verkehrsmaßnahmen, Gefahrenabwehr und Ermittlungsinteressen berücksichtigen.</p></article><article><b>Leitstelle</b><p>Lage fortlaufend aktualisieren, Kräfte und Zielkliniken koordinieren und Kommunikationswege sichern.</p></article><article><b>Spezialkräfte</b><p>THW, Wasser-/Bergrettung, CBRN, PSNV und weitere Fachdienste früh lagebezogen einbinden.</p></article></div>
        <h3>Bindungswirkung sauber unterscheiden</h3><div className="organisation-rule-row"><span><b>Algorithmus</b>festgelegter Entscheidungsweg</span><span><b>Leitlinie</b>evidenzbasierte Empfehlung</span><span><b>VFA / SOP</b>organisationsbezogene Verfahrensregel</span><span><b>Alarmplan</b>örtliche Kräfte- und Führungsstruktur</span></div>
        <aside className="communication-exam-tip"><b>Vier häufige Prüfungsfehler</b><p>Patientenzahl mit MANV-Definition verwechseln · Vorsichtung als endgültige Sichtung darstellen · Organisation und medizinische Führung vermischen · Eigenschutz wegen sichtbarer Patienten aufgeben.</p></aside>
      </div></OrganisationSection>
    </div>

    {finale}
    <section className="legal-sources communication-sources"><span className="eyebrow">Grundlage und fachlicher Abgleich</span><h2>Verwendete Unterlagen</h2><p>Hauptgrundlagen: „Prüfungsvorbereitung Organisation und Einsatztaktik NFS 18 Teil I v2“ und „Orga und Einsatz-5“. Abgeglichen mit dem Thüringer Rettungsdienstgesetz in der seit 1. Januar 2024 geltenden Fassung, dem Landesrettungsdienstplan 2025 und den aktuellen Thüringer Katastrophenschutzgrundlagen.</p><p>Fachlich präzisiert wurden insbesondere die Hilfsfrist als 95-Prozent-Planungsmaßstab, die Abgrenzung von MANV-Stufen nach örtlichem Alarmplan und der Hinweis, dass das dargestellte mSTaRT-Schema nicht automatisch landesweit unverändert gilt.</p></section>
  </section>;
}
