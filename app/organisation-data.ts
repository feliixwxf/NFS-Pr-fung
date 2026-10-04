export type OrganisationFlashcard = { id: string; area: string; question: string; answer: string };

export type OrganisationQuestion = {
  id: string;
  prompt: string;
  options: { text: string; correct?: boolean }[];
  source: string;
  difficulty: 1 | 2 | 3;
  mode: "multiple";
};

export const organisationFlashcards: OrganisationFlashcard[] = [
  { id: "orga-card-01", area: "Thüringer Rettungsdienst", question: "Wer trägt in Thüringen welche Kernaufgabe des Rettungsdienstes?", answer: "Landkreise und kreisfreie Städte tragen den bodengebundenen Rettungsdienst einschließlich Berg- und Wasserrettung. Die Kassenärztliche Vereinigung Thüringen stellt die notärztliche Versorgung einschließlich Telenotarzt sicher. Das Land ist Träger der Luftrettung." },
  { id: "orga-card-02", area: "Hilfsfrist", question: "Wie setzt sich die planungsrelevante Hilfsfrist in Thüringen zusammen?", answer: "Regelhaft aus einer Minute Alarmierungs- und Dispositionszeit, einer Minute Ausrückzeit und zwölf Minuten Fahrzeit im dicht besiedelten beziehungsweise fünfzehn Minuten im dünn besiedelten Gebiet. Daraus ergeben sich 14 beziehungsweise 17 Minuten. Der Landesrettungsdienstplan nutzt hierfür einen Erreichungsgrad von 95 Prozent; Sonderlagen und Luftrettung sind gesondert geregelt." },
  { id: "orga-card-03", area: "Lageerkundung", question: "Wofür stehen die vier S der ersten Lageübersicht?", answer: "Scene: Einsatzstelle und Ausdehnung. Safety: Gefahren und Eigenschutz. Situation: Art, Umfang und Dynamik der Lage. Support: benötigte Kräfte, Führungsmittel und Spezialressourcen." },
  { id: "orga-card-04", area: "Gefahren", question: "Wie wird eine Gefahr mit Ursache, Wirkung und bedrohtem Objekt beschrieben?", answer: "Die Gefahrenursache löst eine schädigende Wirkung aus, die ein bedrohtes Objekt erreicht. Taktisch wird an Ursache, Ausbreitungsweg/Wirkung oder Schutz des bedrohten Objekts angesetzt. Diese Dreiteilung verhindert unspezifische Meldungen wie nur ‚es ist gefährlich‘." },
  { id: "orga-card-05", area: "Gefahren", question: "Nennen Sie 4A–1C–4E.", answer: "Atemgifte, Angstreaktion, Ausbreitung und atomare Strahlung; chemische Stoffe; Erkrankung/Verletzung, Explosion, Elektrizität und Einsturz. Das Schema ist eine Merkhilfe zur systematischen Gefahrenerkennung, keine starre Reihenfolge." },
  { id: "orga-card-06", area: "CBRN", question: "Wofür steht GAMS und welche Konsequenz folgt für den Rettungsdienst?", answer: "Gefahr erkennen, Absperren, Menschenrettung unter Eigenschutz, Spezialkräfte anfordern. Der Rettungsdienst betritt einen nicht freigegebenen Gefahrenbereich nicht ohne geeignete Schutzausrüstung und Auftrag; Patientenübergabe und Dekontamination werden mit Feuerwehr und Spezialkräften abgestimmt." },
  { id: "orga-card-07", area: "Erstes Rettungsmittel", question: "Welche Führungsaufgaben übernimmt das erste geeignete Rettungsmittel beim MANV zunächst?", answer: "Sichere Annäherung, Lageüberblick, qualifizierte Lagemeldung, Nachforderung, vorläufige Führungs- und Raumordnung, Vorsichtung nach örtlicher Vorgabe, Kennzeichnung/Dokumentation, lebensrettende Sofortmaßnahmen im verfügbaren Rahmen und geordnete Übergabe an die reguläre Einsatzleitung." },
  { id: "orga-card-08", area: "Lagemeldung", question: "Welche Inhalte muss eine prüfungstaugliche erste MANV-Lagemeldung enthalten?", answer: "Einsatzort und sichere Anfahrt, Ereignis und Ausdehnung, erkannte Gefahren, grobe Zahl und Art Betroffener, bereits eingesetzte Kräfte, zusätzlich benötigte Mittel/Spezialkräfte sowie ein klarer Melder und Rückkanal. Früh melden, Unsicherheiten kennzeichnen und nach Erkundung aktualisieren." },
  { id: "orga-card-09", area: "MANV", question: "Grenzen Sie MANV und überörtlichen MANV fachlich ab.", answer: "Beim MANV besteht ein Missverhältnis zwischen Patientenaufkommen und zunächst verfügbaren Mitteln, das mit den vorgesehenen örtlichen Strukturen beherrscht werden soll. Reichen die örtlichen Kapazitäten nicht, werden überörtliche Einheiten und Führungsstrukturen nach Landes- beziehungsweise Alarm- und Einsatzplanung aktiviert. Die konkrete Stufe richtet sich nach dem örtlichen Plan, nicht allein nach einer Patientenzahl." },
  { id: "orga-card-10", area: "Raumordnung", question: "Unterscheiden Sie Patientenablage, Behandlungsplatz, Bereitstellungsraum und Rettungsmittelhalteplatz.", answer: "Patientenablage: erste geordnete Sammel- und Versorgungsstelle nahe der Schadensstelle. Behandlungsplatz: strukturierte Behandlung und Vorbereitung zum Transport. Bereitstellungsraum: geordneter Raum für angeforderte, noch nicht eingesetzte Kräfte/Mittel. Rettungsmittelhalteplatz: taktisch geführte Aufstellung verfügbarer Transportmittel mit Zu- und Abfahrt." },
  { id: "orga-card-11", area: "Raumordnung", question: "Welche Kriterien bestimmen die Lage eines Behandlungsplatzes?", answer: "Außerhalb des Gefahrenbereichs, möglichst wind- beziehungsweise ausbreitungsseitig sicher, gut erreichbar, ausreichend groß, beleuchtbar, mit getrennten Zu- und Abfahrten, tragfähigem Untergrund sowie sinnvoller Verbindung zu Patientenablage und Transportorganisation." },
  { id: "orga-card-12", area: "Sichtung", question: "Grenzen Sie Vorsichtung und ärztliche Sichtung ab.", answer: "Vorsichtung ist die schnelle erste Priorisierung nach festgelegtem Algorithmus, häufig durch entsprechend qualifiziertes nichtärztliches Personal. Sichtung ist die ärztliche Entscheidung über Behandlungs- und Transportpriorität. Beide sind Momentaufnahmen und müssen bei Zustandsänderung wiederholt werden." },
  { id: "orga-card-13", area: "Sichtung", question: "Nennen Sie die Sichtungskategorien I bis IV und EX.", answer: "I Rot: akute vitale Bedrohung, sofortige Behandlung. II Gelb: schwer verletzt/erkrankt, dringliche Behandlung. III Grün: leicht verletzt/erkrankt, nicht dringlich. IV Blau: ohne Überlebenschance unter den gegebenen Bedingungen, palliative Versorgung; ärztliche Zuordnung. EX Schwarz: verstorben; ärztliche Feststellung. Planungsanteile sind keine Quoten." },
  { id: "orga-card-14", area: "Vorsichtung", question: "Welche Logik prüft mSTaRT bei Erwachsenen typischerweise?", answer: "Gehfähigkeit, lebensbedrohliche Blutung, Atmung nach Atemwegsöffnung, Atemfrequenz, Kreislauf über Radialispuls sowie Befolgen einfacher Aufforderungen; besondere lokale Kriterien können hinzukommen. Der konkrete Algorithmus und die Kennzeichnung richten sich nach dem verbindlichen örtlichen Konzept." },
  { id: "orga-card-15", area: "Führung", question: "Wie unterscheiden sich OrgL und LNA?", answer: "Der Organisatorische Leiter Rettungsdienst koordiniert Personal, Material, Räume, Rettungsmittel und Transportlogistik. Der Leitende Notarzt verantwortet die medizinische Lagebeurteilung, Sichtungs- und Behandlungsgrundsätze sowie medizinische Prioritäten. Beide arbeiten abgestimmt innerhalb der übergeordneten Einsatzleitung." },
  { id: "orga-card-16", area: "Führung", question: "Was unterscheidet Führung und Leitung im Sinne der FwDV 100?", answer: "Führung umfasst das zielgerichtete Einwirken auf Kräfte zur Auftragserfüllung einschließlich Führungsorganisation, -vorgang und -mitteln. Leitung bezeichnet die gesamtverantwortliche Führungstätigkeit der zuständigen Führungskraft beziehungsweise Einsatzleitung." },
  { id: "orga-card-17", area: "Führungsprozess", question: "Wie läuft der Führungsvorgang ab?", answer: "Lagefeststellung durch Erkundung und Kontrolle, Planung mit Beurteilung und Entschluss, Befehlsgebung sowie erneute Kontrolle. Der Vorgang ist ein Regelkreis: Neue Lageinformationen können jederzeit eine neue Beurteilung und Anpassung auslösen." },
  { id: "orga-card-18", area: "Führungsstil", question: "Wann sind autoritärer und kooperativer Führungsstil sinnvoll?", answer: "Bei unmittelbarer Gefahr, Zeitdruck oder unerfahrenen Kräften ist klare, enge Führung erforderlich. Bei stabilerer Lage und kompetentem Team kann kooperatives Führen Wissen und Eigenständigkeit nutzen. Lage, Auftrag und Team bestimmen den Stil; weder Starrheit noch Beliebigkeit sind fachgerecht." },
  { id: "orga-card-19", area: "Zusammenarbeit", question: "Welche Grundregel gilt bei der Zusammenarbeit von Rettungsdienst, Feuerwehr und Polizei?", answer: "Jede Organisation arbeitet in ihrem gesetzlichen Aufgaben- und Führungsbereich. Gemeinsame Lage, klare Schnittstellen, abgestimmte Ziele, Funkwege und Übergaben verhindern Parallelstrukturen. Medizinische, technische und polizeiliche Entscheidungen müssen koordiniert, aber nicht vermischt werden." },
  { id: "orga-card-20", area: "Taktik", question: "Unterscheiden Sie Algorithmus, Richtlinie, Leitlinie und dienstliche Anweisung.", answer: "Ein Algorithmus bildet einen festgelegten Entscheidungsablauf ab. Leitlinien geben evidenzbasierte Handlungsempfehlungen mit begründbaren Abweichungen. Richtlinien beziehungsweise verbindliche Regelungen setzen einen normativen Rahmen. Dienstliche Anweisungen/SOP/VFA regeln organisationsbezogenes Handeln und sind im jeweiligen Geltungsbereich zu beachten." },
];

export const organisationQuestions: OrganisationQuestion[] = [
  { id: "orga-q-01", prompt: "Welche Aussagen zur Thüringer Hilfsfrist und ihrer Planung sind zutreffend?", options: [
    { text: "Alarmierungs- und Dispositionszeit sowie Ausrückzeit werden mit jeweils einer Minute berücksichtigt.", correct: true },
    { text: "Die reguläre Fahrzeit wird planungsbezogen mit zwölf beziehungsweise fünfzehn Minuten angesetzt.", correct: true },
    { text: "Der Landesrettungsdienstplan verlangt, dass jeder einzelne Einsatz zwingend innerhalb der Frist erreicht wird." },
    { text: "Die Planung orientiert sich grundsätzlich an einem Erreichungsgrad von 95 Prozent.", correct: true },
    { text: "Für Luftrettungsmittel gilt automatisch dieselbe Hilfsfrist wie für bodengebundene Rettungsmittel." },
  ], source: "Die planungsrelevante Frist ergibt sich regelmäßig aus 1 + 1 + 12 beziehungsweise 15 Minuten. Der 95-Prozent-Wert ist ein Planungsmaßstab und keine Garantie für jeden Einzelfall; Luftrettung und Sonderrettung sind gesondert geregelt.", difficulty: 2, mode: "multiple" },
  { id: "orga-q-02", prompt: "Das erste Rettungsmittel trifft bei einem Busunfall ein. Welche Maßnahmen gehören zur unmittelbaren Lagearbeit?", options: [
    { text: "Sichere Aufstellung und Eigenschutz vor Patientenkontakt prüfen.", correct: true },
    { text: "Frühe Lagemeldung mit grober Betroffenenzahl und erkannten Gefahren absetzen.", correct: true },
    { text: "Alle Kräfte ohne Raumordnung direkt bis an den Bus heranfahren lassen." },
    { text: "Benötigte Führungs-, Rettungs- und Spezialmittel gezielt nachfordern.", correct: true },
    { text: "Vorläufige Strukturen schaffen und später geordnet an die Einsatzleitung übergeben.", correct: true },
  ], source: "Das erste geeignete Rettungsmittel verbindet Eigenschutz, Lagefeststellung, Meldung, Nachforderung und vorläufige Ordnung. Unkontrolliertes Zufahren blockiert Wege und erhöht Risiken.", difficulty: 2, mode: "multiple" },
  { id: "orga-q-03", prompt: "Welche Zuordnungen zur 4-S-Matrix sind fachlich richtig?", options: [
    { text: "Scene beschreibt Einsatzort, Ausdehnung und räumliche Besonderheiten.", correct: true },
    { text: "Safety erfasst Gefahren, Schutzmaßnahmen und sichere Zugänge.", correct: true },
    { text: "Situation beschreibt ausschließlich die endgültige ärztliche Diagnose aller Patienten." },
    { text: "Support umfasst benötigte Verstärkung, Spezialkräfte und Führungsmittel.", correct: true },
    { text: "Die Matrix ersetzt die erneute Erkundung nach Lageänderung." },
  ], source: "Die 4-S-Matrix unterstützt eine erste strukturierte Lageübersicht. Situation betrifft Art, Umfang und Dynamik; die Lage muss fortlaufend neu bewertet werden.", difficulty: 1, mode: "multiple" },
  { id: "orga-q-04", prompt: "Bei einem Gefahrstoffaustritt liegen zwei Personen in einem nicht freigegebenen Bereich. Welche Aussagen sind taktisch korrekt?", options: [
    { text: "Die Gefahr ist zu erkennen und der Bereich gegen unkontrollierten Zutritt abzusperren.", correct: true },
    { text: "Menschenrettung bedeutet, dass Rettungsdienstpersonal unabhängig von Schutzausrüstung sofort hineingehen muss." },
    { text: "Geeignete Spezialkräfte und die erforderliche Dekontaminationsstruktur sind frühzeitig anzufordern.", correct: true },
    { text: "Patientenversorgung und Übergabepunkt müssen außerhalb des Gefahrenbereichs abgestimmt werden.", correct: true },
    { text: "Ein fehlender Eigengeruch schließt eine Atemgiftgefahr zuverlässig aus." },
  ], source: "GAMS verlangt Menschenrettung unter Eigenschutz. Ein nicht freigegebener Bereich wird nur mit geeigneter Schutzausrüstung, Auftrag und abgestimmter Taktik betreten; Wahrnehmbarkeit schließt Gefahren nicht aus.", difficulty: 3, mode: "multiple" },
  { id: "orga-q-05", prompt: "Welche Aussagen beschreiben MANV und überörtliche Unterstützung treffend?", options: [
    { text: "Entscheidend ist ein zeitweiliges Missverhältnis zwischen Bedarf und verfügbaren Ressourcen.", correct: true },
    { text: "Eine feste bundesweit identische Patientenzahl definiert jede MANV-Stufe." },
    { text: "Die Aktivierung richtet sich nach dem örtlichen Alarm- und Einsatzplan.", correct: true },
    { text: "In der Frühphase kann eine ressourcenorientierte Priorisierung erforderlich werden.", correct: true },
    { text: "Überörtliche Hilfe macht eine örtliche Führungs- und Raumordnung entbehrlich." },
  ], source: "MANV ist eine Ressourcen- und Organisationslage. Schwellen, Module und Bezeichnungen sind planabhängig; überörtliche Kräfte werden in eine klare Führungsstruktur eingebunden.", difficulty: 2, mode: "multiple" },
  { id: "orga-q-06", prompt: "Welche Zuordnungen der Raumordnung sind korrekt?", options: [
    { text: "Die Patientenablage bündelt Betroffene zunächst nahe, aber sicher außerhalb der unmittelbaren Gefahrenzone.", correct: true },
    { text: "Der Behandlungsplatz dient strukturierter Behandlung und Transportvorbereitung.", correct: true },
    { text: "Im Bereitstellungsraum warten bereits angeforderte Kräfte geordnet auf ihren Einsatzauftrag.", correct: true },
    { text: "Der Rettungsmittelhalteplatz soll Zu- und Abfahrten möglichst kreuzen lassen, damit Wege kurz bleiben." },
    { text: "Ein Hubschrauberlandeplatz wird ohne Abstimmung direkt neben der Patientenablage gewählt." },
  ], source: "Raumordnung trennt Gefahren-, Behandlungs-, Bereitstellungs- und Transportfunktionen. Verkehrswege und Luftrettungsbetrieb benötigen sichere, abgestimmte Flächen.", difficulty: 2, mode: "multiple" },
  { id: "orga-q-07", prompt: "Welche Aussagen zu Vorsichtung und Sichtung sind richtig?", options: [
    { text: "Vorsichtung ist eine schnelle erste Priorisierung nach einem vorgegebenen Algorithmus.", correct: true },
    { text: "Die ärztliche Sichtung legt Behandlungs- und Transportprioritäten fest.", correct: true },
    { text: "Eine einmal vergebene Kategorie bleibt unabhängig vom klinischen Verlauf bestehen." },
    { text: "Nach Behandlung oder Zustandsänderung ist eine erneute Bewertung erforderlich.", correct: true },
    { text: "Dokumentation und eindeutige Kennzeichnung gehören zum Prozess.", correct: true },
  ], source: "Priorisierung ist dynamisch. Vorsichtung und ärztliche Sichtung haben unterschiedliche Rollen; Re-Sichtung und nachvollziehbare Kennzeichnung sind sicherheitsrelevant.", difficulty: 2, mode: "multiple" },
  { id: "orga-q-08", prompt: "Welche Aussagen zu den Sichtungskategorien sind fachlich korrekt?", options: [
    { text: "Kategorie I/Rot bedeutet akute vitale Bedrohung mit sofortigem Behandlungsbedarf.", correct: true },
    { text: "Kategorie II/Gelb kennzeichnet schwere, dringlich zu behandelnde Verletzungen oder Erkrankungen.", correct: true },
    { text: "Kategorie III/Grün schließt eine spätere Verschlechterung aus." },
    { text: "Kategorie IV/Blau und EX/Schwarz erfordern eine ärztliche Entscheidung beziehungsweise Feststellung.", correct: true },
    { text: "Planungsanteile von 20/30/50 Prozent sind anzustrebende Quoten für jede Einsatzstelle." },
  ], source: "Kategorien beschreiben aktuelle Prioritäten. Grün bleibt re-sichtungspflichtig; Planungsanteile dienen der Ressourcenplanung und dürfen die klinische Einordnung nicht steuern.", difficulty: 3, mode: "multiple" },
  { id: "orga-q-09", prompt: "Welche Befunde führen in einem typischen Erwachsenen-mSTaRT zu höchster Priorität?", options: [
    { text: "Eine unkontrollierte spritzende Blutung.", correct: true },
    { text: "Nach Atemwegsöffnung wieder einsetzende Atmung.", correct: true },
    { text: "Atemfrequenz im vorgesehenen Normalbereich bei tastbarem Radialispuls und befolgten Aufforderungen." },
    { text: "Fehlender Radialispuls.", correct: true },
    { text: "Unfähigkeit, einfache Aufforderungen zu befolgen.", correct: true },
  ], source: "mSTaRT priorisiert vitale Störungen von Blutung, Atmung, Kreislauf und Bewusstsein. Der konkret eingesetzte Algorithmus kann lokal ergänzt oder abweichend geregelt sein.", difficulty: 3, mode: "multiple" },
  { id: "orga-q-10", prompt: "Welche Aufgabenteilung zwischen OrgL und LNA ist zutreffend?", options: [
    { text: "Der OrgL koordiniert rettungsdienstliche Kräfte, Räume, Material und Transportmittel.", correct: true },
    { text: "Der LNA setzt medizinische Sichtungs-, Behandlungs- und Transportgrundsätze.", correct: true },
    { text: "Der OrgL entscheidet allein über jede ärztliche Therapie am Einzelpatienten." },
    { text: "OrgL und LNA stimmen ihre Entscheidungen innerhalb der Einsatzleitung miteinander ab.", correct: true },
    { text: "Mit Eintreffen des LNA entfallen Dokumentation und Nachforderung durch die Führungsorganisation." },
  ], source: "Organisation und medizinische Führung sind getrennte, eng verzahnte Verantwortungsbereiche. Beide bleiben Teil einer gemeinsamen Führungsstruktur.", difficulty: 2, mode: "multiple" },
  { id: "orga-q-11", prompt: "Welche Aussagen zum Führungsvorgang nach FwDV 100 sind richtig?", options: [
    { text: "Lagefeststellung umfasst Erkundung und fortlaufende Kontrolle.", correct: true },
    { text: "Planung verbindet Beurteilung der Lage mit einem Entschluss.", correct: true },
    { text: "Nach der Befehlsgebung ist eine erneute Lagekontrolle nicht mehr vorgesehen." },
    { text: "Neue Informationen können den Regelkreis erneut auslösen.", correct: true },
    { text: "Führungsmittel unterstützen Darstellung, Kommunikation und Dokumentation.", correct: true },
  ], source: "Der Führungsvorgang ist ein dynamischer Regelkreis aus Lagefeststellung, Planung, Befehl und Kontrolle; Führungsmittel machen die Lage bearbeitbar und nachvollziehbar.", difficulty: 2, mode: "multiple" },
  { id: "orga-q-12", prompt: "Ein Team arbeitet an einer instabilen Einsatzstelle unter hohem Zeitdruck. Welche Führungsentscheidungen sind plausibel?", options: [
    { text: "Aufträge eindeutig, kurz und an benannte Personen erteilen.", correct: true },
    { text: "Sicherheitskritische Rückmeldungen trotz klarer Führung ausdrücklich zulassen.", correct: true },
    { text: "Alle taktischen Entscheidungen zunächst im vollständigen Teamkonsens treffen." },
    { text: "Nach Stabilisierung der Lage stärker kooperativ führen und Fachwissen einbeziehen.", correct: true },
    { text: "Die Wirkung erteilter Aufträge kontrollieren.", correct: true },
  ], source: "Zeitkritik erfordert klare Führung, schließt Speak-up und Rückmeldung aber nicht aus. Der Führungsstil wird der Lage angepasst und bleibt kontrolliert.", difficulty: 3, mode: "multiple" },
  { id: "orga-q-13", prompt: "Welche Aussagen zur organisationsübergreifenden Zusammenarbeit sind korrekt?", options: [
    { text: "Feuerwehr, Rettungsdienst und Polizei behalten ihre gesetzlichen Aufgabenbereiche.", correct: true },
    { text: "Gemeinsame Lagebilder und eindeutig benannte Schnittstellen reduzieren widersprüchliche Aufträge.", correct: true },
    { text: "Medizinische Prioritäten ersetzen automatisch polizeiliche Gefahrenabwehrentscheidungen." },
    { text: "Übergabepunkte, Funkwege und Transportachsen sollten gemeinsam abgestimmt werden.", correct: true },
    { text: "Technische Rettung und medizinische Versorgung müssen zeitlich und räumlich koordiniert werden.", correct: true },
  ], source: "Zusammenarbeit bedeutet Koordination bei getrennter Fachverantwortung. Gemeinsame Ziele, Schnittstellen und Kommunikationswege sind zentral.", difficulty: 2, mode: "multiple" },
  { id: "orga-q-14", prompt: "Welche Aussagen zu Regelwerken und Entscheidungshilfen treffen zu?", options: [
    { text: "Ein Algorithmus bildet einen vorgegebenen Entscheidungsweg ab.", correct: true },
    { text: "Eine Leitlinie ist stets identisch mit einer zwingenden dienstlichen Anweisung." },
    { text: "SOP und VFA gelten im festgelegten organisatorischen Geltungsbereich.", correct: true },
    { text: "Begründete Abweichungen von Empfehlungen können bei atypischer Lage erforderlich sein und sind zu dokumentieren.", correct: true },
    { text: "Örtliche Alarm- und Einsatzpläne konkretisieren übergeordnete Vorgaben für die Praxis.", correct: true },
  ], source: "Normativer Rang, Bindungswirkung und Geltungsbereich unterscheiden sich. Prüfungssicher ist die begründete Zuordnung statt der pauschalen Behauptung, alles sei gleich verbindlich.", difficulty: 3, mode: "multiple" },
  { id: "orga-q-15", prompt: "Welche Kriterien sprechen für einen geeigneten Behandlungsplatz?", options: [
    { text: "Lage außerhalb vorhersehbarer Gefahren- und Ausbreitungsbereiche.", correct: true },
    { text: "Ausreichende Fläche, tragfähiger Untergrund und Beleuchtbarkeit.", correct: true },
    { text: "Möglichst nur eine gemeinsame enge Zu- und Abfahrt für alle Fahrzeuge." },
    { text: "Gute Verbindung zu Patientenablage und Transportorganisation.", correct: true },
    { text: "Erreichbarkeit, ohne die technische Rettung oder Feuerwehrzufahrt zu blockieren.", correct: true },
  ], source: "Ein Behandlungsplatz muss sicher, erreichbar, groß genug und in die Gesamtlogistik eingebunden sein. Verkehrsströme werden möglichst getrennt und konfliktarm geführt.", difficulty: 2, mode: "multiple" },
  { id: "orga-q-16", prompt: "Nach einer Explosion gehen zahlreiche gehfähige Betroffene selbstständig auf Rettungsmittel zu. Welche Maßnahmen sind sinnvoll?", options: [
    { text: "Gehfähige Betroffene an einen klar benannten, sicheren Sammelpunkt lenken.", correct: true },
    { text: "Auch zunächst grün Eingestufte registrieren und erneut beurteilen.", correct: true },
    { text: "Alle gehfähigen Personen ohne Erfassung sofort entlassen." },
    { text: "Kontamination und mögliche Inhalationsverletzung trotz Gehfähigkeit mitdenken.", correct: true },
    { text: "Die Bewegungsrichtung so steuern, dass Rettungs- und Transportwege frei bleiben.", correct: true },
  ], source: "Gehfähigkeit ist nur ein frühes Priorisierungskriterium. Sammlung, Registrierung, Re-Sichtung, Gefahrenerkennung und geordnete Wege bleiben notwendig.", difficulty: 3, mode: "multiple" },
];
