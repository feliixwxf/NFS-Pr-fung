"use client";

import { ReactNode, useRef, useState } from "react";

function CommunicationSection({ number, kicker, title, children }: { number: string; kicker: string; title: string; children: ReactNode }) {
  return <details className="communication-section"><summary><span>{number}</span><div><small>{kicker}</small><h2>{title}</h2></div><i>⌄</i></summary><div className="communication-section-content">{children}</div></details>;
}

function CommunicationStudyCard({ title, kicker, children }: { title: string; kicker?: string; children: ReactNode }) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped((value) => !value);
  return <article role="button" tabIndex={0} className={`communication-study-card${flipped ? " is-flipped" : ""}`} onClick={toggle} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle(); } }} aria-pressed={flipped} aria-label={`${title}: ${flipped ? "Lösung anzeigen" : "zum Abfragen umdrehen"}`}>
    <div className="communication-study-card-inner">
      <div className="communication-study-card-front">{kicker ? <small>{kicker}</small> : null}<b>{title}</b><div>{children}</div><em>Antippen · Begriff abfragen</em></div>
      <div className="communication-study-card-back"><b>{title}</b><small>Erkläre den Begriff zuerst selbst.</small><em>Antippen · Lösung anzeigen</em></div>
    </div>
  </article>;
}

export default function KommunikationLesson({ onBack, finale }: { onBack: () => void; finale: ReactNode }) {
  const flowRef = useRef<HTMLDivElement>(null);
  const toggleAll = (open: boolean) => flowRef.current?.querySelectorAll<HTMLDetailsElement>("details").forEach((section) => { section.open = open; });

  return <section className="page-section legal-reader communication-reader">
    <button className="back-button" onClick={onBack}>← Schriftliche Fachbereiche</button>
    <header className="communication-hero">
      <div><span className="eyebrow light">Schriftliche Prüfung · Kommunikation &amp; Interaktion</span><h1>Verstehen.<br />Verbinden. Sicher handeln.</h1><p>Kommunikationsmodelle nicht nur nennen, sondern auf Patientengespräch, Teamarbeit und Übergabe anwenden.</p></div>
      <div><b>12</b><span>Lernfelder</span><small>NotSan-Prüfung 2027</small></div>
    </header>

    <aside className="communication-focus"><span>↔</span><div><b>Prüfungsfokus Thüringen</b><p>Modelle erklären, eine Einsatzsituation analysieren und daraus eine konkrete professionelle Formulierung oder Handlung ableiten.</p></div></aside>

    <div className="communication-toolbar" role="group" aria-label="Leseabschnitte steuern">
      <button type="button" onClick={() => toggleAll(true)}>Alles ausklappen</button>
      <button type="button" onClick={() => toggleAll(false)}>Alles einklappen</button>
      <small>Beim Öffnen sind alle Lernfelder bewusst eingeklappt.</small>
    </div>

    <div className="communication-reading-flow" ref={flowRef}>
      <CommunicationSection number="01" kicker="Grundlagen" title="Kommunikation und Interaktion">
        <div className="communication-copy"><p><b>Kommunikation</b> ist der Austausch von Informationen und Bedeutungen. <b>Interaktion</b> beschreibt wechselseitig aufeinander bezogenes Handeln: Jede Reaktion verändert den weiteren Verlauf.</p>
          <div className="communication-channel-grid">
            <article><span>Wort</span><h3>Verbal</h3><p>Gesprochener Inhalt, Wortwahl und Satzbau.</p></article>
            <article><span>Stimme</span><h3>Paraverbal</h3><p>Tonfall, Lautstärke, Tempo, Pausen und Betonung.</p></article>
            <article><span>Körper</span><h3>Nonverbal</h3><p>Mimik, Gestik, Blick, Haltung, Bewegung und Distanz.</p></article>
            <article><span>Berührung</span><h3>Taktil</h3><p>Körperkontakt mit Anlass, Ankündigung und möglichst Zustimmung.</p></article>
          </div>
          <aside className="communication-case"><small>Kongruent oder inkongruent?</small><p><b>Kongruent:</b> Wort, Stimme und Körpersprache passen zusammen. <b>Inkongruent:</b> Signale widersprechen sich. Das ist ein Anlass zum Nachfragen, aber kein Beweis für Täuschung.</p></aside>
          <h3>Fähigkeiten professioneller Kommunikation</h3><div className="communication-pill-row"><span>Selbstwahrnehmung</span><span>Fremdwahrnehmung</span><span>Selbstreflexion</span><span>Sensibilität</span><span>Empathie</span></div>
        </div>
      </CommunicationSection>

      <CommunicationSection number="02" kicker="Gesprächsführung" title="Fragen und aktives Zuhören">
        <div className="communication-copy"><div className="communication-study-grid"><CommunicationStudyCard kicker="Kontakt und Erkundung" title="Offene Fragen"><p>Beginnen meist mit was, wie, wann oder wo und ermöglichen eine freie Antwort.</p><strong>„Was ist heute passiert?“</strong></CommunicationStudyCard><CommunicationStudyCard kicker="Fokussierung und Sicherheit" title="Geschlossene Fragen"><p>Erlauben kurze, eindeutige Antworten und prüfen gezielt Zeitkritisches.</p><strong>„Nehmen Sie Blutverdünner?“</strong></CommunicationStudyCard></div>
          <h3>Fünf Techniken des aktiven Zuhörens</h3>
          <ol className="listening-steps"><li><b>Paraphrasieren</b><span>Inhalt in eigenen Worten wiedergeben.</span></li><li><b>Verbalisieren</b><span>Wahrgenommene Gefühle vorsichtig benennen.</span></li><li><b>Nachfragen</b><span>Unklares oder Widersprüchliches konkretisieren.</span></li><li><b>Aufmerksamkeit zeigen</b><span>Blick, Nicken und kurze verbale Bestätigung.</span></li><li><b>Zusammenfassen</b><span>Kernaussagen bündeln und bestätigen lassen.</span></li></ol>
          <aside className="communication-exam-tip"><b>Prüfungsstark</b><p>Erst offen explorieren, dann fokussieren: Eine Notfallanamnese ist weder ein freies Endlosgespräch noch eine reine Ja-Nein-Abfrage.</p></aside>
        </div>
      </CommunicationSection>

      <CommunicationSection number="03" kicker="Personzentrierter Ansatz" title="Grundhaltungen nach Carl Rogers">
        <div className="communication-copy"><div className="communication-study-grid"><CommunicationStudyCard title="Empathie"><p>Innere Welt des Gegenübers verstehen und dieses Verständnis prüfend zurückmelden.</p></CommunicationStudyCard><CommunicationStudyCard title="Akzeptanz"><p>Die Person respektieren, ohne jedes Verhalten gutzuheißen oder Grenzen aufzugeben.</p></CommunicationStudyCard><CommunicationStudyCard title="Kongruenz"><p>Echt, glaubwürdig und transparent auftreten; Rolle und eigene Grenzen reflektieren.</p></CommunicationStudyCard></div>
          <p>Im Rettungsdienst schaffen diese Haltungen Kooperation. Sie stehen nicht im Gegensatz zu klaren Anweisungen: Bei Gefahr kann Kommunikation zugleich wertschätzend und eindeutig sein.</p>
        </div>
      </CommunicationSection>

      <CommunicationSection number="04" kicker="Modell 1" title="Sender–Empfänger-Modell nach Shannon und Weaver">
        <div className="communication-copy"><div className="sender-receiver-diagram" role="img" aria-label="Sender verschlüsselt eine Nachricht, überträgt sie über einen störbaren Kanal, Empfänger entschlüsselt und gibt Rückmeldung"><div><small>Gedanke / Absicht</small><b>Sender</b><span>verschlüsselt (codiert)</span></div><i>→</i><div className="message-channel"><small>Übertragungsweg</small><b>Nachricht über Kanal</b><span>Wort · Stimme · Körper · Medien</span></div><i>→</i><div><small>Bedeutung</small><b>Empfänger</b><span>entschlüsselt (decodiert)</span></div><em>↶ Reaktion und Rückmeldung ↵</em></div>
          <p><b>Ablauf:</b> Der Sender verschlüsselt seine beabsichtigte Nachricht in Zeichen. Die Nachricht wird über einen Kanal an den Empfänger gesendet. Der Empfänger entschlüsselt und interpretiert sie. Erst eine Rückmeldung zeigt, ob die gemeinte Botschaft angekommen ist.</p>
          <figure className="communication-model-image"><a href="/lessons/kommunikation/sender-empfaenger-modell.webp" target="_blank" rel="noreferrer"><img src="/lessons/kommunikation/sender-empfaenger-modell.webp" alt="Sender-Empfänger-Modell mit Codierung, Übertragung, Decodierung und Feedback" loading="lazy" /></a><figcaption>Sender–Empfänger-Modell · zum Vergrößern antippen</figcaption></figure>
          <h3>Wo entstehen Störungen?</h3><div className="communication-study-grid"><CommunicationStudyCard title="Sender"><p>Unklare Begriffe, zu viel Information, widersprüchliche Signale.</p></CommunicationStudyCard><CommunicationStudyCard title="Kanal"><p>Lärm, Funkstörung, Maske, räumliche Trennung.</p></CommunicationStudyCard><CommunicationStudyCard title="Empfänger"><p>Angst, Schmerz, Sprache, Hörstörung, Vorwissen oder Erwartung.</p></CommunicationStudyCard><CommunicationStudyCard title="Rückmeldung"><p>Fehlt Check-back, bleibt ein Missverständnis unentdeckt.</p></CommunicationStudyCard></div>
          <aside className="communication-case"><small>Einsatzbeispiel</small><p>„Zieh Adrenalin auf“ ist unvollständig. Sicherer: Person ansprechen, Wirkstoff, Konzentration, Dosis und Applikationsweg nennen; Empfänger wiederholt, Sender bestätigt.</p></aside>
        </div>
      </CommunicationSection>

      <CommunicationSection number="05" kicker="Modell 2" title="Kommunikationsquadrat nach Schulz von Thun">
        <div className="communication-copy"><div className="four-sides-model" role="img" aria-label="Vier Ebenen einer Nachricht: Sachebene, Selbstkundgabe, Beziehungsebene und Appellebene"><span className="side-fact">Sachebene<small>Worüber informiere ich?</small></span><span className="side-self">Selbstkundgabe<small>Was zeige ich von mir?</small></span><b>Nachricht</b><span className="side-relation">Beziehungsebene<small>Wie stehe ich zu dir?</small></span><span className="side-appeal">Appellebene<small>Was möchte ich erreichen?</small></span></div>
          <p>Sender sprechen mit vier „Schnäbeln“, Empfänger hören mit vier „Ohren“. Missverständnisse entstehen, wenn eine andere Seite gehört wird als beabsichtigt.</p>
          <div className="communication-case"><small>„Sie sind ja endlich da.“</small><ul><li><b>Sache:</b> Das Rettungsteam ist eingetroffen.</li><li><b>Selbstkundgabe:</b> Ich war besorgt und habe lange gewartet.</li><li><b>Beziehung:</b> Ich halte Sie möglicherweise für zu langsam.</li><li><b>Appell:</b> Kümmern Sie sich jetzt sofort.</li></ul></div>
        </div>
      </CommunicationSection>

      <CommunicationSection number="06" kicker="Modell 3" title="Die fünf Axiome nach Watzlawick">
        <div className="communication-copy"><ol className="axiom-list"><li><b>Man kann nicht nicht kommunizieren.</b><span>Auch Schweigen, Abwenden oder Nichtreagieren kann Mitteilungscharakter haben.</span></li><li><b>Kommunikation hat immer einen Inhalts- und Beziehungsaspekt.</b><span>Die Beziehungsebene beeinflusst, wie der Sachinhalt verstanden wird.</span></li><li><b>Kommunikation ist immer Ursache und Wirkung.</b><span>Jede Seite erlebt das eigene Verhalten als Reaktion auf die andere. So entstehen wechselseitige Kommunikationskreisläufe.</span></li><li><b>Kommunikation bedient sich digitaler und analoger Modalitäten.</b><span>Digital meint Wörter und vereinbarte Zeichen; analog meint besonders Körpersprache, Mimik, Tonfall und Beziehungssignale.</span></li><li><b>Kommunikation ist symmetrisch oder komplementär.</b><span><b>Symmetrisch:</b> Konzentration auf Gleichheit und Gemeinsamkeiten. <b>Komplementär:</b> unterschiedliche Rollen ergänzen sich; dabei kann ein Gesprächspartner die Interaktion stärker bestimmen oder dominieren.</span></li></ol>
          <aside className="communication-exam-tip"><b>Prüfungsfalle</b><p>„Digital“ meint hier nicht Internet oder Geräte. Axiom 3 ist mehr als „jede Ursache hat eine Wirkung“: Entscheidend ist die unterschiedliche Gliederung eines wechselseitigen Kommunikationskreislaufs.</p></aside>
        </div>
      </CommunicationSection>

      <CommunicationSection number="07" kicker="Bedürfnisse und Tiefenebene" title="Maslow und Eisbergmodell">
        <div className="communication-copy"><div className="maslow-model" role="img" aria-label="Bedürfnispyramide nach Maslow von körperlichen Grundbedürfnissen bis Selbstverwirklichung"><span>Selbstverwirklichung</span><span>Bedürfnisse nach Wertschätzung</span><span>Soziale Bedürfnisse</span><span>Sicherheitsbedürfnisse</span><span>Körperliche Grundbedürfnisse</span></div>
          <aside className="communication-case"><small>Fachlich präzisiert</small><p>Die Pyramide ist ein Orientierungsmodell, kein starres Stufengesetz. Bedürfnisse können gleichzeitig wirksam sein; eine untere Ebene muss nicht vollständig erfüllt sein, bevor eine höhere Bedeutung erhält.</p></aside>
          <figure className="communication-model-image"><a href="/lessons/kommunikation/eisbergmodell.jpg" target="_blank" rel="noreferrer"><img src="/lessons/kommunikation/eisbergmodell.jpg" alt="Eisbergmodell mit sichtbarer Sachebene und unsichtbarer Beziehungsebene" loading="lazy" /></a><figcaption>Eisbergmodell · zum Vergrößern antippen</figcaption></figure>
          <div className="communication-study-grid"><CommunicationStudyCard kicker="Sichtbare Ebene" title="Wahrnehmbar"><p>Gedanken, Aussagen und Verhalten – also das, was andere Menschen unmittelbar sehen oder hören können.</p></CommunicationStudyCard><CommunicationStudyCard kicker="Unsichtbare Ebene" title="Wirkt im Hintergrund"><p>Gefühle, Ängste, Erfahrungen, Werte, frühere Erlebnisse und innere Konflikte beeinflussen das Verhalten stark.</p></CommunicationStudyCard></div>
          <aside className="communication-exam-tip"><b>Anwendung im Patientengespräch</b><p>Hinter Ablehnung, Aggression oder Rückzug können Angst, Scham oder frühere Erfahrungen stehen. Statt Motive zu unterstellen, beobachtbares Verhalten benennen, offen nachfragen und die Antwort des Patienten ernst nehmen.</p></aside>
        </div>
      </CommunicationSection>

      <CommunicationSection number="08" kicker="Persönlichkeitsmodell" title="Strukturmodell nach Sigmund Freud">
        <div className="communication-copy">
          <p>Das Strukturmodell beschreibt drei miteinander wirkende psychische Instanzen. Es ist ein historisches Deutungsmodell und keine messbare Aufteilung des Gehirns.</p>
          <div className="angel-model" aria-label="Anschauliches Beispiel für Es, Ich und Über-Ich"><article><span>😈</span><small>Böser Engel</small><b>Es</b><p>„Ich will sofort weg – egal, was passiert.“</p></article><i>↔</i><article className="angel-ego"><span>🧠</span><small>Vermittler</small><b>Ich</b><p>„Ich höre mir die Folgen an und entscheide realistisch.“</p></article><i>↔</i><article><span>😇</span><small>Guter Engel</small><b>Über-Ich</b><p>„Ich sollte vernünftig sein und Hilfe annehmen.“</p></article></div>
          <div className="communication-study-grid"><CommunicationStudyCard kicker="Lustprinzip" title="Es"><p>Triebe, Wünsche und unmittelbare Bedürfnisse.</p><strong>Beispiel: „Ich will jetzt sofort weg.“</strong></CommunicationStudyCard><CommunicationStudyCard kicker="Realitätsprinzip" title="Ich"><p>Prüft die Situation und vermittelt zwischen Es, Über-Ich und Außenwelt.</p><strong>Beispiel: „Ich bleibe, bis die Untersuchung beendet ist.“</strong></CommunicationStudyCard><CommunicationStudyCard kicker="Moralprinzip" title="Über-Ich"><p>Verinnerlichte Normen, Werte, Regeln und Gewissen.</p><strong>Beispiel: „Ich muss vernünftig sein und Hilfe annehmen.“</strong></CommunicationStudyCard></div>
          <figure className="communication-model-image"><a href="/lessons/kommunikation/instanzenmodell-freud.jpg" target="_blank" rel="noreferrer"><img src="/lessons/kommunikation/instanzenmodell-freud.jpg" alt="Instanzenmodell nach Sigmund Freud mit Es, Ich und Über-Ich" loading="lazy" /></a><figcaption>Strukturmodell: Es – Ich – Über-Ich · zum Vergrößern antippen</figcaption></figure>
          <aside className="communication-case"><small>Bezug zum Patientengespräch</small><p>Widersprüchliches Verhalten kann aus konkurrierenden Bedürfnissen, realen Anforderungen und verinnerlichten Regeln entstehen. Im Einsatz wird dies nicht diagnostiziert, sondern als mögliche Erklärung für Ambivalenz respektvoll exploriert.</p></aside>
        </div>
      </CommunicationSection>

      <CommunicationSection number="09" kicker="Konflikt und Deeskalation" title="Rollen, Ich-Botschaften und gewaltfreie Kommunikation">
        <div className="communication-copy"><div className="communication-study-grid"><CommunicationStudyCard kicker="Zwischen eigenen Rollen" title="Interrollenkonflikt"><p>Beispiel: Teamleitung und private Freundschaft erzeugen gegensätzliche Erwartungen.</p></CommunicationStudyCard><CommunicationStudyCard kicker="Innerhalb derselben Rolle" title="Intrarollenkonflikt"><p>Beispiel: Angehörige und Notarzt erwarten Unterschiedliches von derselben NotSan-Rolle.</p></CommunicationStudyCard></div>
          <h3>Vier Schritte nach Marshall B. Rosenberg</h3><div className="giraffe-steps"><span><b>1</b>Beobachtung ohne Bewertung</span><span><b>2</b>Gefühl benennen</span><span><b>3</b>Bedürfnis ausdrücken</span><span><b>4</b>Konkrete Bitte formulieren</span></div>
          <aside className="communication-case"><small>Ich-Botschaft</small><p>„Wenn mehrere Personen gleichzeitig sprechen, verliere ich wichtige Angaben. Ich brauche kurz Ruhe. Bitte spricht jetzt nur eine Person.“</p></aside>
          <p>Gewaltfreie Kommunikation ist ein Gesprächsrahmen. Bei akuter Eigen- oder Fremdgefährdung bleiben eindeutige Grenzen, Sicherheitsmaßnahmen und klare Teamführung notwendig.</p>
        </div>
      </CommunicationSection>

      <CommunicationSection number="10" kicker="Rettungsdienstpraxis" title="Teamkommunikation und strukturierte Übergabe">
        <div className="communication-copy"><div className="closed-loop-model"><span><b>1</b>Person ansprechen</span><i>→</i><span><b>2</b>Auftrag + Ziel</span><i>→</i><span><b>3</b>Check-back</span><i>→</i><span><b>4</b>Bestätigung</span><i>→</i><span><b>5</b>Ergebnis melden</span></div>
          <div className="communication-study-grid"><CommunicationStudyCard title="Call-out"><p>Wichtiger Befund wird für das gesamte Team hörbar ausgesprochen.</p></CommunicationStudyCard><CommunicationStudyCard title="Check-back"><p>Empfänger wiederholt; Sender bestätigt oder korrigiert.</p></CommunicationStudyCard><CommunicationStudyCard title="Closed Loop"><p>Auftrag, Bestätigung, Durchführung und Ergebnis sind geschlossen.</p></CommunicationStudyCard><CommunicationStudyCard title="Speak up"><p>Sicherheitsbedenken klar, konkret und bei Bedarf eskalierend äußern.</p></CommunicationStudyCard></div>
          <h3>Übergabe: strukturiert statt vollständig ungefiltert</h3><div className="handover-line"><span><b>S</b>Situation</span><span><b>B</b>Background</span><span><b>A</b>Assessment</span><span><b>R</b>Recommendation / Request</span></div>
          <p>Lokale Vorgaben können ISBAR, SBAR oder SINNHAFT nutzen. Unabhängig vom Akronym gehören größte Gefahr, Verlauf, relevante Vorgeschichte, Befunde, Arbeitsdiagnose, Maßnahmen mit Wirkung und offene Aufgaben in die Übergabe.</p>
        </div>
      </CommunicationSection>

      <CommunicationSection number="11" kicker="Patientenzentriert" title="Nähe, besondere Bedürfnisse und Verständnissicherung">
        <div className="communication-copy"><div className="distance-model" role="img" aria-label="Orientierungswerte für öffentliche, gesellschaftliche, persönliche und intime Distanz"><span><b>Öffentlich</b>ab etwa 3 m</span><span><b>Gesellschaftlich</b>etwa 1,2–3 m</span><span><b>Persönlich</b>etwa 0,6–1,2 m</span><span><b>Intim</b>bis etwa 0,6 m</span></div>
          <p>Distanzzonen sind kultur- und situationsabhängige Orientierung. Untersuchung und Behandlung erfordern häufig intime Nähe: ankündigen, begründen, soweit möglich Zustimmung einholen und auf das Notwendige begrenzen.</p>
          <div className="communication-study-grid"><CommunicationStudyCard title="Angst und Schmerz"><p>Reize reduzieren, Orientierung geben, kurze Sätze, nächsten Schritt ankündigen.</p></CommunicationStudyCard><CommunicationStudyCard title="Hörbeeinträchtigung"><p>Gesicht sichtbar, Blickkontakt, Nebengeräusche reduzieren, Hilfsmittel nutzen.</p></CommunicationStudyCard><CommunicationStudyCard title="Sprachbarriere"><p>Einfach sprechen, visualisieren, möglichst qualifizierte Sprachmittlung einsetzen.</p></CommunicationStudyCard><CommunicationStudyCard title="Kognition und Alter"><p>Ein Schritt nach dem anderen, Zeit geben, Bezugsperson angemessen einbinden.</p></CommunicationStudyCard></div>
          <aside className="teach-back-card"><small>Teach-back</small><h3>„Damit ich weiß, ob ich es verständlich erklärt habe …“</h3><p>„Was tun Sie, wenn der Schmerz wiederkommt?“ Bei Lücken erneut einfacher erklären und das Verständnis nochmals prüfen.</p></aside>
        </div>
      </CommunicationSection>

      <CommunicationSection number="12" kicker="Patientenkommunikation" title="Die 5 Regeln der Patientenkommunikation">
        <div className="communication-copy">
          <p>Die fünf Regeln geben auch unter Zeitdruck eine klare Reihenfolge für einen respektvollen, verständlichen und sicheren Kontakt.</p>
          <ol className="patient-communication-rules"><li><b>Sich vorstellen</b><span>Name, Funktion und nächsten Schritt nennen.</span></li><li><b>Blickkontakt herstellen</b><span>Möglichst auf Augenhöhe sprechen und Reaktionen beobachten.</span></li><li><b>Einfach und verständlich sprechen</b><span>Kurze Sätze, bekannte Wörter und jeweils eine Information.</span></li><li><b>Aktiv zuhören</b><span>Ausreden lassen, nachfragen, paraphrasieren und zusammenfassen.</span></li><li><b>Empathie zeigen</b><span>Gefühle wahrnehmen, vorsichtig benennen und ernst nehmen.</span></li></ol>
          <aside className="communication-case"><small>Kurzes Einsatzbeispiel</small><p>„Guten Tag, mein Name ist Max Mustermann, ich bin Notfallsanitäter. Ich sehe, dass Sie Angst haben. Ich erkläre Ihnen jeden Schritt. Erzählen Sie mir zuerst, was passiert ist.“</p></aside>
        </div>
      </CommunicationSection>
    </div>

    {finale}
    <section className="legal-sources communication-sources"><span className="eyebrow">Fachliche Grundlage</span><h2>Geprüfte Lerninhalte</h2><p>Die Kommunikationsmodelle und Einsatzbeispiele wurden anhand der NotSan-APrV, des Schulz-von-Thun-Instituts sowie patientensicherer Kommunikationsprinzipien wie Check-back und Teach-back geprüft und präzisiert.</p></section>
  </section>;
}
