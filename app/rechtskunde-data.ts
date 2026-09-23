import { supplementalQuestions } from "./supplemental-questions";

export type LegalFlashcard = { id: string; area: string; question: string; answer: string };

export type LegalQuestion = {
  id: string;
  prompt: string;
  options: { text: string; correct?: boolean }[];
  source: string;
  difficulty: 1 | 2 | 3;
  mode: "multiple";
};

export const rechtskundeFlashcards: LegalFlashcard[] = [
  { id: "recht-card-01", area: "Rechtsordnung", question: "Ordnen Sie Verfassung, formelles Gesetz, Rechtsverordnung und Satzung hierarchisch ein.", answer: "Höherrangiges Recht bindet niederrangiges Recht: Verfassung → formelles Gesetz → Rechtsverordnung → Satzung. Zusätzlich sind Unionsrecht und die jeweilige Gesetzgebungskompetenz zu beachten." },
  { id: "recht-card-02", area: "NotSanG", question: "Welche zwei kumulativen Voraussetzungen nennt § 2a NotSanG für eigenverantwortliche heilkundliche Maßnahmen?", answer: "Die Maßnahme wurde in der Ausbildung erlernt und wird beherrscht; außerdem ist sie erforderlich, um Lebensgefahr oder wesentliche Folgeschäden abzuwenden. Sie gilt bis zum Eintreffen des Notarztes oder bis zum Beginn weiterer ärztlicher, auch teleärztlicher, Versorgung." },
  { id: "recht-card-03", area: "NotSanG", question: "Grenzen Sie § 4 Abs. 2 Nr. 1 c von § 4 Abs. 2 Nr. 2 c NotSanG ab.", answer: "Nr. 1 c beschreibt eigenverantwortlich erlernte und beherrschte Erstversorgungsmaßnahmen in einer vitalen oder folgenschweren Lage. Nr. 2 c betrifft die eigenständige Durchführung heilkundlicher Maßnahmen nach standardmäßiger Vorgabe, Überprüfung und Verantwortung durch den ÄLRD oder entsprechend verantwortliche Ärzte." },
  { id: "recht-card-04", area: "ThürRettG", question: "Welche Rolle hat die Ärztliche Leitung Rettungsdienst bei standardisierten heilkundlichen Maßnahmen?", answer: "Sie gibt geeignete Maßnahmen für definierte Zustandsbilder standardmäßig vor, überprüft die Anwendung und trägt die ärztliche Systemverantwortung. Die ausführende Person behält Auswahl-, Durchführungs-, Überwachungs- und Dokumentationsverantwortung im konkreten Einsatz." },
  { id: "recht-card-05", area: "Strafrecht", question: "Prüfen Sie eine Straftat in der klassischen Reihenfolge.", answer: "Tatbestand (objektiv und subjektiv) → Rechtswidrigkeit mit möglichen Rechtfertigungsgründen → Schuld. Bei Unterlassen kommen Garantenstellung, Handlungsmöglichkeit und hypothetische Kausalität hinzu." },
  { id: "recht-card-06", area: "Einwilligung", question: "Welche Voraussetzungen machen eine Einwilligung in eine medizinische Maßnahme wirksam?", answer: "Einwilligungsfähigkeit, hinreichende Aufklärung, Freiwilligkeit, Bezug auf die konkrete Maßnahme und Erklärung vor der Maßnahme. Im zeitkritischen Notfall kann bei Einwilligungsunfähigkeit der mutmaßliche Wille maßgeblich sein." },
  { id: "recht-card-07", area: "ThürPsychKG", question: "Grenzen Sie die schnelle von der geplanten öffentlich-rechtlichen Unterbringung in Thüringen ab.", answer: "Schnell: § 9 ThürPsychKG erlaubt dem Sozialpsychiatrischen Dienst bei dringenden Anhaltspunkten und nicht rechtzeitig erreichbarer Gerichtsentscheidung eine vorläufige Unterbringung für höchstens 24 Stunden; der Antrag nach § 8 ist unverzüglich zu stellen. Geplant: Voraussetzungen nach § 7, regulärer Antrag mit Gutachten nach § 8 und gerichtliche Entscheidung." },
  { id: "recht-card-08", area: "Fixierung", question: "Wie trennen Sie Unterbringung und Fixierung, und welche Kerngrenze gilt für eine nicht nur kurzfristige Fixierung?", answer: "Schnelle oder geplante Unterbringung bezeichnet den Weg in die Einrichtung. Die Fixierung ist eine zusätzliche Sicherungsmaßnahme bei bereits untergebrachten Patienten nach § 14 ThürPsychKG. Nicht nur kurzfristige Fixierungen brauchen grundsätzlich eine vorherige richterliche Entscheidung; kurzfristig ist in der Regel eine absehbare Dauer unter 30 Minuten." },
  { id: "recht-card-09", area: "Schweigepflicht", question: "Wie wirkt die Schweigepflicht nach dem Tod und gegenüber Angehörigen?", answer: "Die Schweigepflicht endet nicht mit dem Tod. Angehörige – auch Ehepartner – haben kein automatisches Recht auf medizinische Informationen. Erforderlich sind Einwilligung, mutmaßliche Einwilligung oder eine gesetzliche beziehungsweise rechtfertigende Offenbarungsbefugnis." },
  { id: "recht-card-10", area: "Straßenverkehr", question: "Grenzen Sie Sonderrechte und Wegerecht ab.", answer: "§ 35 Abs. 5a StVO befreit Rettungsdienstfahrzeuge bei höchster Eile unter Wahrung öffentlicher Sicherheit und Ordnung von StVO-Vorschriften. § 38 Abs. 1 StVO: Nur blaues Blinklicht zusammen mit Einsatzhorn ordnet anderen an, sofort freie Bahn zu schaffen." },
  { id: "recht-card-11", area: "Patientenwille", question: "Wie wird eine Patientenverfügung nach § 1827 BGB angewendet?", answer: "Es wird geprüft, ob die schriftlichen Festlegungen auf die aktuelle Lebens- und Behandlungssituation zutreffen. Dann ist ihnen Geltung zu verschaffen. Andernfalls sind Behandlungswünsche oder der mutmaßliche Wille anhand konkreter Anhaltspunkte zu ermitteln." },
  { id: "recht-card-12", area: "BtMG", question: "Welche Voraussetzungen müssen für § 13 Abs. 1b BtMG zusammen vorliegen?", answer: "Notfallsanitäter verabreichen ein Anlage-III-Betäubungsmittel im Rahmen einer heilkundlichen Maßnahme; standardisierte ärztliche Vorgaben liegen vor; ärztliches Eintreffen kann nicht abgewartet werden; die Gabe ist zur Gefahrenabwehr oder zur Beseitigung beziehungsweise Linderung erheblicher Beschwerden erforderlich. Nachweis und Dokumentation bleiben Pflicht." },
];

const rechtskundeBaseQuestions: LegalQuestion[] = [
  { id: "recht-q-01", prompt: "Welche Aussagen zur Normenhierarchie und zu juristischen Personen treffen zu?", options: [
    { text: "Eine Rechtsverordnung braucht grundsätzlich eine gesetzliche Ermächtigungsgrundlage.", correct: true },
    { text: "Eine Satzung darf höherrangigem Recht widersprechen, wenn sie lokal beschlossen wurde." },
    { text: "Die Rechtsfähigkeit einer juristischen Person hängt von ihrer Rechtsform und regelmäßig von Errichtung, Anerkennung oder Eintragung ab.", correct: true },
    { text: "Jeder Zusammenschluss von genau 21 Personen wird ohne Weiteres zur juristischen Person." },
  ], source: "Rechtsverordnungen und Satzungen stehen unter dem Gesetz; juristische Personen entstehen nach den Regeln ihrer jeweiligen Rechtsform, nicht durch eine starre Mitgliederzahl.", difficulty: 1, mode: "multiple" },
  { id: "recht-q-02", prompt: "Welche Aussagen zur strafrechtlichen Verantwortlichkeit Minderjähriger sind richtig?", options: [
    { text: "Wer bei der Tat noch nicht 14 Jahre alt ist, ist nach § 19 StGB schuldunfähig.", correct: true },
    { text: "Bei 14- bis 17-Jährigen setzt Jugendstrafrecht zusätzlich die nötige Reife nach § 3 JGG voraus.", correct: true },
    { text: "Ab dem 18. Geburtstag ist Jugendstrafrecht unter allen Umständen ausgeschlossen." },
    { text: "Bei Heranwachsenden von 18 bis 20 Jahren kann unter den Voraussetzungen des § 105 JGG Jugendstrafrecht angewandt werden.", correct: true },
  ], source: "§ 19 StGB sowie §§ 3 und 105 JGG unterscheiden Kinder, Jugendliche und Heranwachsende; starre Aussagen nur anhand des Alters greifen zu kurz.", difficulty: 1, mode: "multiple" },
  { id: "recht-q-03", prompt: "Welche Aussagen beschreiben § 2a NotSanG korrekt?", options: [
    { text: "Die Maßnahme muss in der Ausbildung erlernt worden sein und von der handelnden Person beherrscht werden.", correct: true },
    { text: "Die Maßnahme muss erforderlich sein, um Lebensgefahr oder wesentliche Folgeschäden abzuwenden.", correct: true },
    { text: "Die Befugnis endet erst mit persönlichem Eintreffen eines Notarztes; teleärztliche Versorgung ist unbeachtlich." },
    { text: "Eine vorherige individuelle ärztliche Anordnung ist Tatbestandsvoraussetzung jeder Maßnahme nach § 2a." },
  ], source: "§ 2a NotSanG erlaubt die eigenverantwortliche Durchführung bis zum Eintreffen des Notarztes oder Beginn weiterer ärztlicher, auch teleärztlicher, Versorgung bei zwei kumulativen Voraussetzungen.", difficulty: 1, mode: "multiple" },
  { id: "recht-q-04", prompt: "Welche Zuordnungen zum Ausbildungsziel nach § 4 Abs. 2 NotSanG sind richtig?", options: [
    { text: "Nr. 1 b: Gesundheitszustand beurteilen, vitale Bedrohung erkennen und über Nachforderungen entscheiden.", correct: true },
    { text: "Nr. 1 c: erlernte und beherrschte Maßnahmen zur Vermeidung einer Verschlechterung bei Lebensgefahr oder drohenden wesentlichen Folgeschäden.", correct: true },
    { text: "Nr. 2 b: eigenständiges Durchführen ärztlich veranlasster Maßnahmen.", correct: true },
    { text: "Nr. 2 c: freie Ausübung jeder heilkundlichen Maßnahme ohne standardmäßige ärztliche Vorgabe." },
  ], source: "§ 4 Abs. 2 NotSanG trennt eigenverantwortliche Aufgaben von der Mitwirkung, darunter ärztlich veranlasste und standardmäßig vorgegebene heilkundliche Maßnahmen.", difficulty: 1, mode: "multiple" },
  { id: "recht-q-05", prompt: "Welche Aussagen zur Prüfung einer Straftat sind zutreffend?", options: [
    { text: "Nach erfüllt geprüftem Tatbestand folgen Rechtswidrigkeit und Schuld.", correct: true },
    { text: "Notwehr nach § 32 StGB setzt einen gegenwärtigen rechtswidrigen Angriff voraus.", correct: true },
    { text: "Rechtfertigender Notstand nach § 34 StGB verlangt unter anderem eine Interessenabwägung und Angemessenheit.", correct: true },
    { text: "Jede Vorbereitungshandlung ist unabhängig vom Delikt strafbar." },
  ], source: "Klassischer Deliktsaufbau: Tatbestand, Rechtswidrigkeit, Schuld. Vorbereitungen sind grundsätzlich straflos, soweit das Gesetz nicht ausnahmsweise anderes bestimmt.", difficulty: 1, mode: "multiple" },
  { id: "recht-q-06", prompt: "Welche Aussagen zum Unterlassen im Rettungsdienst treffen zu?", options: [
    { text: "§ 323c StGB erfasst erforderliche und zumutbare Hilfeleistung auch ohne besondere Garantenstellung.", correct: true },
    { text: "Ein unechtes Unterlassungsdelikt setzt eine Rechtspflicht zum Einstehen für den Erfolg voraus.", correct: true },
    { text: "Die Übernahme der Patientenversorgung kann eine Garantenstellung begründen.", correct: true },
    { text: "Eine Garantenstellung führt automatisch zur Strafbarkeit, selbst wenn keine mögliche und zumutbare Handlung bestand." },
  ], source: "Unterlassungsdelikte erfordern je nach Tatbestand Garantenpflicht, Handlungsmöglichkeit, Zumutbarkeit und die weiteren Voraussetzungen der jeweiligen Norm.", difficulty: 2, mode: "multiple" },
  { id: "recht-q-07", prompt: "Eine einwilligungsfähige Patientin lehnt nach verständlicher Aufklärung den Transport ab. Welche Schritte sind rechtlich besonders wichtig?", options: [
    { text: "Einwilligungsfähigkeit und Verständnis der Risiken nachvollziehbar prüfen und dokumentieren.", correct: true },
    { text: "Über relevante Risiken, Alternativen und Warnzeichen aufklären und eine erneute Kontaktaufnahme ermöglichen.", correct: true },
    { text: "Die Ablehnung allein wegen einer medizinisch unvernünftigen Entscheidung ignorieren." },
    { text: "Bei fortbestehender Einwilligungsfähigkeit die autonome Entscheidung respektieren.", correct: true },
  ], source: "Selbstbestimmung erlaubt auch medizinisch unvernünftige Entscheidungen. Entscheidend sind Einwilligungsfähigkeit, Aufklärung, Freiwilligkeit und saubere Dokumentation.", difficulty: 2, mode: "multiple" },
  { id: "recht-q-08", prompt: "Welche Aussagen zur Behandlung Einwilligungsunfähiger sind richtig?", options: [
    { text: "Bei unaufschiebbarer Behandlung kann der mutmaßliche Wille eine Maßnahme rechtfertigen.", correct: true },
    { text: "Eine einschlägige Patientenverfügung ist auch unabhängig von Art und Stadium der Erkrankung zu beachten.", correct: true },
    { text: "Eine Patientenverfügung ist nur wirksam, wenn Arzt und Vertreter inhaltlich derselben Meinung sind." },
    { text: "Ist die Verfügung nicht einschlägig, sind konkrete frühere Äußerungen und Wertvorstellungen für den mutmaßlichen Willen relevant.", correct: true },
  ], source: "§ 1827 BGB verlangt die Prüfung der konkreten Passung; andernfalls sind Behandlungswünsche und mutmaßlicher Wille anhand konkreter Anhaltspunkte festzustellen.", difficulty: 2, mode: "multiple" },
  { id: "recht-q-09", prompt: "Welche Aussagen zur Schweigepflicht im Rettungsdienst treffen zu?", options: [
    { text: "Sie besteht grundsätzlich auch nach dem Tod fort.", correct: true },
    { text: "Ehegatten und Eltern volljähriger Patienten haben automatisch ein vollständiges Auskunftsrecht." },
    { text: "Im Behandlungsteam dürfen nur für die Versorgung erforderliche Informationen auf tragfähiger Rechtsgrundlage weitergegeben werden.", correct: true },
    { text: "Eine Offenbarung kann durch Einwilligung, mutmaßliche Einwilligung oder gesetzliche beziehungsweise rechtfertigende Befugnis gedeckt sein.", correct: true },
  ], source: "§ 203 StGB schützt anvertraute Geheimnisse; Tod oder Verwandtschaft beseitigen die Schweigepflicht nicht automatisch.", difficulty: 2, mode: "multiple" },
  { id: "recht-q-10", prompt: "Welche Aussagen zur sozialen Sicherung sind korrekt?", options: [
    { text: "Die soziale Pflegeversicherung ist im SGB XI geregelt.", correct: true },
    { text: "Volle Erwerbsminderung liegt grundsätzlich bei einer Leistungsfähigkeit von unter drei Stunden täglich unter den üblichen Bedingungen des allgemeinen Arbeitsmarktes vor.", correct: true },
    { text: "Teilweise Erwerbsminderung liegt grundsätzlich bei drei bis unter sechs Stunden täglich vor.", correct: true },
    { text: "Das SGB IX ist das Gesetzbuch der sozialen Pflegeversicherung." },
  ], source: "Pflegeversicherung: SGB XI. Erwerbsminderungsrente: grundsätzlich unter drei Stunden voll, drei bis unter sechs Stunden teilweise.", difficulty: 2, mode: "multiple" },
  { id: "recht-q-11", prompt: "Welche Aussagen zu § 35 und § 38 StVO sind richtig?", options: [
    { text: "§ 35 Abs. 5a kann Rettungsdienstfahrzeuge bei höchster Eile von StVO-Vorschriften befreien.", correct: true },
    { text: "Sonderrechte dürfen nur unter gebührender Berücksichtigung der öffentlichen Sicherheit und Ordnung ausgeübt werden.", correct: true },
    { text: "Erst blaues Blinklicht zusammen mit Einsatzhorn ordnet anderen Verkehrsteilnehmern an, sofort freie Bahn zu schaffen.", correct: true },
    { text: "Blaues Blinklicht allein erzeugt stets das Wegerecht nach § 38 Abs. 1." },
  ], source: "§ 35 StVO regelt Sonderrechte; § 38 Abs. 1 StVO die Anordnung freier Bahn durch blaues Blinklicht zusammen mit Einsatzhorn.", difficulty: 2, mode: "multiple" },
  { id: "recht-q-12", prompt: "Welche Aussagen zur ärztlichen Delegation sind richtig?", options: [
    { text: "Die anordnende Person trägt Verantwortung für Indikation, Auswahl einer geeigneten Person und klare Anordnung.", correct: true },
    { text: "Die ausführende Person trägt Verantwortung für Übernahme, fachgerechte Durchführung, Überwachung und Rückmeldung.", correct: true },
    { text: "Erkennbare fehlende Kompetenz oder eine unklare beziehungsweise gefährliche Anordnung muss angesprochen und gegebenenfalls abgelehnt werden.", correct: true },
    { text: "Mit der Delegation geht jede Verantwortung vollständig auf den ÄLRD über." },
  ], source: "Delegation verteilt Anordnungs-, Auswahl-, Übernahme- und Durchführungsverantwortung; sie beseitigt nicht die Eigenverantwortung der ausführenden Person.", difficulty: 2, mode: "multiple" },
  { id: "recht-q-13", prompt: "Welche Aussagen grenzen die schnelle und die geplante Unterbringung nach ThürPsychKG korrekt ab?", options: [
    { text: "§ 9 betrifft die vorläufige Unterbringung, wenn eine gerichtliche Entscheidung nicht rechtzeitig herbeigeführt werden kann.", correct: true },
    { text: "Die Anordnung nach § 9 erfolgt durch den Sozialpsychiatrischen Dienst und ist auf höchstens 24 Stunden ab Beginn begrenzt.", correct: true },
    { text: "Beim regulären Weg bilden § 7 die materiellen Voraussetzungen und § 8 Antrag, Gutachten und gerichtliches Verfahren ab.", correct: true },
    { text: "Eine vorläufige Unterbringung nach § 9 erlaubt automatisch jede Fixierung für 24 Stunden ohne weitere Prüfung." },
  ], source: "Das Skript unterscheidet den schnellen Weg nach § 9 vom geplanten regulären Verfahren nach §§ 7 und 8. Unterbringung und eine zusätzliche Fixierung nach § 14 müssen getrennt geprüft werden.", difficulty: 3, mode: "multiple" },
  { id: "recht-q-14", prompt: "Welche Aussagen gibt § 14 ThürPsychKG für besondere Sicherungsmaßnahmen in der Einrichtung vor?", options: [
    { text: "Eine nicht nur kurzfristige Fixierung bedarf grundsätzlich einer vorherigen richterlichen Entscheidung.", correct: true },
    { text: "Als kurzfristig gilt eine Fixierung in der Regel, wenn absehbar unter 30 Minuten.", correct: true },
    { text: "Während einer Fixierung ist eine ununterbrochene Eins-zu-eins-Betreuung durch therapeutisches oder pflegerisches Personal sicherzustellen.", correct: true },
    { text: "Eine ärztliche Anordnung berechtigt stets zu einer Fixierung für 24 Stunden ohne gerichtliche Beteiligung." },
  ], source: "ThürPsychKG § 14 enthält Richtervorbehalt, kurze Ausnahmegrenze, engmaschige Überwachung, Eins-zu-eins-Betreuung und Dokumentationspflichten.", difficulty: 3, mode: "multiple" },
  { id: "recht-q-15", prompt: "Welche Konstellationen können eine Datenweitergabe trotz Schweigepflicht rechtfertigen?", options: [
    { text: "Wirksame Einwilligung der betroffenen Person.", correct: true },
    { text: "Mutmaßliche Einwilligung bei erforderlicher Weitergabe zur anschließenden Behandlung.", correct: true },
    { text: "Gesetzliche Mitteilungsbefugnis oder rechtfertigender Notstand bei entsprechend gewichtiger Gefahr.", correct: true },
    { text: "Bloße Neugier eines Familienangehörigen mit zutreffendem Nachnamen." },
  ], source: "Offenbarung ist nur mit Einwilligung oder tragfähiger gesetzlicher beziehungsweise rechtfertigender Grundlage zulässig und auf das Erforderliche zu begrenzen.", difficulty: 3, mode: "multiple" },
  { id: "recht-q-16", prompt: "Welche Aussagen zur Gabe eines Anlage-III-Betäubungsmittels nach § 13 Abs. 1b BtMG sind richtig?", options: [
    { text: "Eine standardisierte ärztliche Vorgabe muss die Anwendung tragen.", correct: true },
    { text: "Das Eintreffen eines Arztes darf nicht abgewartet werden können.", correct: true },
    { text: "Die Gabe muss zur Abwehr gesundheitlicher Gefahren oder zur Beseitigung beziehungsweise Linderung erheblicher Beschwerden erforderlich sein.", correct: true },
    { text: "Die Vorschrift erlaubt Notfallsanitätern jede beliebige Anlage-II-Substanz ohne Dokumentation." },
  ], source: "§ 13 Abs. 1b BtMG ist eng auf Anlage III, standardisierte Vorgaben, zeitliche Unaufschiebbarkeit und Erforderlichkeit begrenzt; Nachweis- und Dokumentationspflichten bleiben bestehen.", difficulty: 3, mode: "multiple" },
  { id: "recht-q-17", prompt: "Ein Notfallsanitäter beherrscht eine invasive Maßnahme, doch die Lage erlaubt gefahrlos das sofortige teleärztliche Gespräch. Welche Aussagen sind vertretbar?", options: [
    { text: "§ 2a ist keine allgemeine Wunschbefugnis; seine konkrete Erforderlichkeit muss geprüft werden.", correct: true },
    { text: "Mit Beginn weiterer teleärztlicher Versorgung ist die zeitliche Grenze des § 2a erreicht.", correct: true },
    { text: "Beherrschen allein genügt, selbst wenn weder Lebensgefahr noch wesentliche Folgeschäden drohen." },
    { text: "Die Entscheidung und ihre medizinisch-rechtliche Begründung gehören in die Dokumentation.", correct: true },
  ], source: "§ 2a verlangt Beherrschen und konkrete Erforderlichkeit und endet auch mit Beginn einer weiteren teleärztlichen Versorgung.", difficulty: 3, mode: "multiple" },
  { id: "recht-q-18", prompt: "Welche Aussagen bilden eine rechtssichere präklinische Entscheidungslogik am besten ab?", options: [
    { text: "Patientenwille und Einwilligungsfähigkeit klären; bei fehlender Fähigkeit Vertretung, Verfügung oder mutmaßlichen Willen prüfen.", correct: true },
    { text: "Für Eingriff und Datenweitergabe jeweils Rechtsgrundlage, Erforderlichkeit und Verhältnismäßigkeit getrennt prüfen.", correct: true },
    { text: "Bei Delegation Kompetenzgrenzen erkennen, Remonstration nutzen und Verlauf einschließlich Wirkung und Nebenwirkung dokumentieren.", correct: true },
    { text: "Eine medizinisch richtige Maßnahme ist unabhängig von Einwilligung, Zuständigkeit und Dokumentation immer rechtmäßig." },
  ], source: "Prüfungssicheres Handeln verbindet medizinische Indikation mit Patientenwillen, Befugnis, Verhältnismäßigkeit, Kompetenz, Überwachung und Dokumentation.", difficulty: 3, mode: "multiple" },
];

export const rechtskundeQuestions: LegalQuestion[] = [...rechtskundeBaseQuestions, ...supplementalQuestions.rechtskunde];
