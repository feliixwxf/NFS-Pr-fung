"use client";

import { ReactNode, useRef } from "react";

function HygieneSection({ number, kicker, title, children }: { number: string; kicker: string; title: string; children: ReactNode }) {
  return <details className="communication-section qm-section"><summary><span>{number}</span><div><small>{kicker}</small><h2>{title}</h2></div><i>⌄</i></summary><div className="communication-section-content">{children}</div></details>;
}

export default function HygieneLesson({ onBack, finale }: { onBack: () => void; finale: ReactNode }) {
  const flowRef = useRef<HTMLDivElement>(null);
  const toggleAll = (open: boolean) => flowRef.current?.querySelectorAll<HTMLDetailsElement>("details").forEach((section) => { section.open = open; });

  return <section className="page-section communication-reader qm-reader">
    <button className="back-button" onClick={onBack}>← Schriftliche Fachbereiche</button>
    <header className="communication-hero qm-hero"><div><span className="eyebrow light">Schriftliche Prüfung · Hygiene &amp; Infektionsschutz</span><h1>Übertragung verstehen.<br />Exposition verhindern.</h1><p>Prüfungsrelevante Begriffe, TRBA 250, Tuberkulose und Postexpositionsmaßnahmen kompakt für den Rettungsdienst.</p></div><div><b>08</b><span>Lernfelder</span><small>Stand 10/2026</small></div></header>
    <aside className="communication-focus"><span>H</span><div><b>Leitgedanke</b><p>Basishygiene gilt unabhängig von einer bekannten Diagnose. Zusätzliche Maßnahmen richten sich nach Übertragungsweg, Tätigkeit und Gefährdungsbeurteilung.</p></div></aside>
    <div className="communication-toolbar" role="group" aria-label="Leseabschnitte steuern"><button type="button" onClick={() => toggleAll(true)}>Alles ausklappen</button><button type="button" onClick={() => toggleAll(false)}>Alles einklappen</button><small>Alle Lernfelder starten übersichtlich eingeklappt.</small></div>

    <div className="communication-reading-flow" ref={flowRef}>
      <HygieneSection number="01" kicker="Grundbegriffe" title="Hygiene und ihre vier Bereiche"><div className="communication-copy">
        <p><b>Hygiene</b> umfasst alle Maßnahmen zur Erhaltung der Gesundheit sowie zur Verhütung von Infektionen und vermeidbaren Erkrankungen. Im Rettungsdienst schützt sie Patienten, Einsatzkräfte und nachfolgende Patienten.</p>
        <div className="communication-grid"><article><b>Individualhygiene</b><p>Persönliche Hygiene, Händehygiene, Schutzkleidung und gesundheitsbewusstes Verhalten.</p></article><article><b>Krankenhaushygiene</b><p>Infektionsprävention in medizinischen Einrichtungen, etwa Basishygiene, Isolation und Aufbereitung.</p></article><article><b>Umwelthygiene</b><p>Gesundheitliche Einflüsse von Luft, Wasser, Boden, Abfall und Schadstoffen.</p></article><article><b>Sozialhygiene</b><p>Gesundheit und Prävention in Bevölkerungsgruppen sowie soziale Einflussfaktoren.</p></article></div>
      </div></HygieneSection>

      <HygieneSection number="02" kicker="Mikrobiologie" title="Erregergruppen, Pathogenität und Toxine"><div className="communication-copy">
        <div className="communication-compare"><article><small>Infektionserreger</small><h3>Vier wichtige Gruppen</h3><p><b>Bakterien</b> sind prokaryotische Zellen. <b>Viren</b> benötigen Wirtszellen. <b>Pilze</b> sind Eukaryoten. <b>Parasiten</b> umfassen unter anderem Protozoen und Helminthen.</p></article><article><small>Krankmachende Eigenschaften</small><h3>Pathogenität und Toxinbildung</h3><p><b>Pathogenität</b> ist die Fähigkeit eines Erregers, Krankheit hervorzurufen. <b>Toxine</b> sind von Erregern gebildete oder freigesetzte Giftstoffe, die Zellen und Organe schädigen können.</p></article></div>
        <p><b>Aseptisch</b> bedeutet, das Eindringen vermehrungsfähiger Mikroorganismen in sterile oder besonders gefährdete Bereiche zu verhindern. Dafür werden sterile Schlüsselstellen nicht berührt und Kontaminationswege konsequent vermieden.</p>
      </div></HygieneSection>

      <HygieneSection number="03" kicker="Infektionskette" title="Übertragungswege erkennen und unterbrechen"><div className="communication-copy">
        <div className="material-chips"><span>Kontakt / Schmierinfektion</span><span>Fäkal-oral</span><span>Aerogen / Tröpfchen</span><span>Sexuell</span><span>Parenteral</span><span>Vertikal / perinatal</span></div>
        <ul><li><b>Kontakt/Schmier:</b> direkt von Mensch zu Mensch oder indirekt über Hände, Flächen und Gegenstände.</li><li><b>Fäkal-oral:</b> Erreger aus Ausscheidungen gelangen über den Mund in den neuen Wirt.</li><li><b>Aerogen/Tröpfchen:</b> Aufnahme infektiöser Partikel über die Atemwege; Partikelgröße und Reichweite unterscheiden sich.</li><li><b>Sexuell:</b> Übertragung durch Schleimhautkontakt und infektiöse Körperflüssigkeiten.</li><li><b>Parenteral:</b> Übertragung unter Umgehung des Magen-Darm-Trakts, etwa durch Nadelstich oder Blutkontakt.</li><li><b>Vertikal:</b> Mutter-Kind-Übertragung pränatal, perinatal während der Geburt oder postnatal.</li></ul>
        <aside className="communication-exam-tip"><b>Infektionskette</b><p>Prävention kann am Reservoir, an der Austrittspforte, am Übertragungsweg, an der Eintrittspforte oder an der Empfänglichkeit des Wirts ansetzen.</p></aside>
      </div></HygieneSection>

      <HygieneSection number="04" kicker="Epidemiologie" title="Inkubationszeit, Ausbruch, Endemie, Epidemie und Pandemie"><div className="communication-copy">
        <div className="communication-grid"><article><b>Inkubationszeit</b><p>Zeit zwischen Infektion und Auftreten erster klinischer Symptome. Sie ist nicht mit der Dauer der Ansteckungsfähigkeit gleichzusetzen.</p></article><article><b>Outbreak / Ausbruch</b><p>Epidemiologisch zusammenhängende Häufung von Fällen über dem erwarteten Maß, häufig zeitlich oder örtlich begrenzt.</p></article><article><b>Endemie</b><p>Dauerhaft erwartbares Auftreten einer Erkrankung in einer Region oder Population.</p></article><article><b>Epidemie</b><p>Zeitlich und räumlich begrenzte Häufung über dem Erwartungswert.</p></article><article><b>Pandemie</b><p>Länder- und kontinentübergreifende epidemische Ausbreitung. Der Begriff beschreibt nicht automatisch die individuelle Schwere.</p></article></div>
      </div></HygieneSection>

      <HygieneSection number="05" kicker="Desinfektion" title="Wirkungsspektren sicher unterscheiden"><div className="communication-copy">
        <div className="communication-grid"><article><b>Bakterizid</b><p>Wirksam gegen vegetative Bakterien; Sporen sind nicht automatisch erfasst.</p></article><article><b>Begrenzt viruzid</b><p>Wirksam gegen behüllte Viren.</p></article><article><b>Viruzid</b><p>Wirksam gegen behüllte und unbehüllte Viren.</p></article><article><b>Tuberkulozid</b><p>Geprüfte Wirksamkeit gegen Erreger des Mycobacterium-tuberculosis-Komplexes.</p></article></div>
        <p>Entscheidend sind <b>passendes Wirkungsspektrum, richtige Konzentration, vollständige Benetzung, Einwirk- beziehungsweise Nutzungszeit</b> sowie Herstellerangaben und Hygieneplan. Sichtbare Kontamination wird zunächst sicher aufgenommen und anschließend gezielt desinfiziert.</p>
      </div></HygieneSection>

      <HygieneSection number="06" kicker="Prävention" title="Dispositions-, Expositions- und Postexpositionsprophylaxe"><div className="communication-copy">
        <div className="closed-loop-model"><span><b>Disposition</b>Empfänglichkeit senken<br /><small>z. B. Impfung</small></span><i>→</i><span><b>Exposition</b>Kontakt verhindern<br /><small>z. B. PSA, Händehygiene</small></span><i>→</i><span><b>Postexposition</b>Folgen nach Kontakt begrenzen<br /><small>z. B. HIV-PEP</small></span></div>
        <aside className="communication-case"><small>Nadelstichverletzung</small><p>Sofort örtlich versorgen und desinfizieren, unverzüglich melden und dokumentieren, zeitnahe arbeitsmedizinische Risikobewertung für HBV/HCV/HIV veranlassen, indizierte HIV-PEP möglichst früh beginnen und Nachkontrollen sicherstellen.</p></aside>
      </div></HygieneSection>

      <HygieneSection number="07" kicker="TRBA 250" title="Risikogruppen sind nicht Schutzstufen"><div className="communication-copy">
        <div className="table-scroll diagnostik-table"><table><thead><tr><th>Risikogruppe</th><th>Gefährdung</th><th>Verbreitung / Prävention</th></tr></thead><tbody><tr><td><b>1</b></td><td>Krankheit beim Menschen unwahrscheinlich</td><td>Geringstes Infektionsrisiko</td></tr><tr><td><b>2</b></td><td>Krankheit möglich, Gefahr für Beschäftigte</td><td>Verbreitung unwahrscheinlich; Vorbeugung oder Behandlung normalerweise möglich</td></tr><tr><td><b>3</b></td><td>Schwere Krankheit, ernste Beschäftigtengefahr</td><td>Verbreitung möglich; Vorbeugung oder Behandlung normalerweise möglich</td></tr><tr><td><b>4</b></td><td>Schwere Krankheit, große Beschäftigtengefahr</td><td>Große Verbreitungsgefahr; normalerweise keine wirksame Vorbeugung oder Behandlung</td></tr></tbody></table></div>
        <aside className="communication-exam-tip"><b>Wichtige Abgrenzung</b><p>Die <b>Risikogruppe</b> beschreibt das Gefährdungspotenzial des Biostoffs. Die <b>Schutzstufe</b> beschreibt die Schutzmaßnahmen einer konkreten Tätigkeit. Tätigkeit, Übertragungsweg, Erregermenge, Aerosolbildung und Expositionswahrscheinlichkeit bestimmen die Gefährdungsbeurteilung.</p></aside>
      </div></HygieneSection>

      <HygieneSection number="08" kicker="Tuberkulose" title="Aerogene Gefahr im Rettungsdienst"><div className="communication-copy">
        <p>Bei ansteckungsfähiger Lungentuberkulose werden infektiöse Aerosole abgegeben. Typische Hinweise sind anhaltender Husten, Gewichtsverlust, Nachtschweiß, Fieber und Hämoptysen; sie beweisen die Diagnose präklinisch nicht.</p>
        <div className="communication-grid"><article><b>Während der Versorgung</b><p>Kontaktzahl und Expositionszeit minimieren, Patient nach Möglichkeit mit medizinischem Mund-Nasen-Schutz versorgen, Personal mit dicht sitzender FFP2 nach Gefährdungsbeurteilung, Fahrzeug lüften und Zielklinik voranmelden.</p></article><article><b>Aerosolbildung</b><p>Aerosolbildende Maßnahmen nur bei zwingender medizinischer Indikation durchführen und Schutzmaßnahmen anpassen. Basishygiene bleibt zusätzlich erforderlich.</p></article><article><b>Nach dem Transport</b><p>Mögliche Kontaktflächen tuberkulozid wirksam wischdesinfizieren. Nach Antrocknung kann das Fahrzeug nach Vorgabe wieder genutzt werden; eine Begasung ist nicht regelhaft erforderlich.</p></article><article><b>Nach Exposition</b><p>Exposition dokumentieren, arbeitsmedizinisch bewerten und erregerspezifische Nachsorge veranlassen. Nicht jeder Kontakt ist automatisch eine relevante Exposition.</p></article></div>
        <aside className="communication-exam-tip"><b>Praxisgrenze</b><p>Konkrete Mittel, Konzentrationen, Einwirkzeiten und Meldewege richten sich nach Hygieneplan, Herstellerangaben, Gefährdungsbeurteilung und örtlicher Betriebsanweisung.</p></aside>
      </div></HygieneSection>
    </div>
    {finale}
    <p className="lesson-source-note">Fachliche Grundlage: BioStoffV, TRBA 250, Empfehlungen von RKI/KRINKO sowie die örtlichen Hygiene- und Betriebsanweisungen.</p>
  </section>;
}
