export type SupplementalQuestion = {
  id: string;
  mode: "multiple";
  prompt: string;
  options: Array<{ text: string; correct?: boolean }>;
  source: string;
  difficulty: 3;
};

type MarkedOption = [text: string, correct: boolean];

function question(id: string, prompt: string, options: MarkedOption[], source: string): SupplementalQuestion {
  return {
    id,
    mode: "multiple",
    difficulty: 3,
    prompt,
    options: options.map(([text, correct]) => ({ text, ...(correct ? { correct: true } : {}) })),
    source,
  };
}

// Zusätzliche Fallfragen greifen ausschließlich Inhalte der vorhandenen Lesekapitel und VFA-Abbildungen auf.
export const supplementalQuestions = {
  acs: [
    question("acs-extra-01", "Eine Diabetikerin hat plötzlich Dyspnoe, Übelkeit und Schwäche, aber keinen ausgeprägten Thoraxschmerz. Das erste EKG zeigt keine ST-Hebung. Welche Bewertungen sind tragfähig?", [
      ["Ein ACS bleibt trotz atypischer Beschwerden möglich", true],
      ["Das fehlende ST-Hebungszeichen schließt NSTEMI und instabile Angina nicht aus", true],
      ["Verlauf, Monitoring und erneute klinische Beurteilung bleiben entscheidend", true],
      ["Ohne retrosternalen Schmerz entfällt die kardiale Differenzialdiagnostik", false],
      ["Ein normales Erst-EKG belegt eine harmlose gastrointestinale Ursache", false],
    ], "Atypische Präsentationen und ein unauffälliges Einzel-EKG schließen ein ACS nicht sicher aus."),
    question("acs-extra-02", "Bei Thoraxschmerz fallen ein neurologisches Defizit und einseitig schwacher Radialispuls auf. Welche Entscheidungen sind vor ASS und Heparin begründet?", [
      ["Eine akute Aortendissektion als gefährliche Differenzialdiagnose prüfen", true],
      ["Die in VFA 14 genannten Kontraindikationen gezielt abgleichen", true],
      ["Puls- und Blutdruckseitenvergleich in die Übergabe aufnehmen", true],
      ["Das neurologische Defizit als Beweis für einen isolierten STEMI werten", false],
      ["Die antithrombotische Gabe unabhängig vom Verdacht auf Aortendissektion beginnen", false],
    ], "Neurologische Ausfälle und Pulsdefizit können für eine Aortenerkrankung sprechen; VFA 14 nennt die akute Aortendissektion als Kontraindikation."),
    question("acs-extra-03", "Ein Patient mit inferioren ST-Hebungen berichtet PDE-5-Hemmer vom Vorabend; RRsys 118 mmHg. Welche Aussagen zur Versorgung stimmen?", [
      ["Glyceroltrinitrat ist wegen mehrerer VFA-Kontraindikationen nicht angezeigt", true],
      ["Die ACS-Versorgung mit Monitoring und geeigneter Zielklinikplanung läuft weiter", true],
      ["Der Inferiorbefund hebt die Bedeutung der EKG- und Kreislaufkontrolle nicht auf", true],
      ["Die stabile Sättigung beseitigt die Notwendigkeit der Herzkatheter-Voranmeldung", false],
      ["Die PDE-5-Einnahme wäre nur bei gleichzeitigem Fieber relevant", false],
    ], "VFA 13 nennt PDE-5-Hemmer innerhalb von 48 Stunden, RRsys unter 120 mmHg und Verdacht auf Hinterwandinfarkt als Kontraindikationen."),
  ],
  apoplex: [
    question("apoplex-extra-01", "Eine Patientin war zehn Minuten aphasisch und ist beim Eintreffen wieder beschwerdefrei. Welche Schlüsse sind richtig?", [
      ["Die vorübergehende Symptomatik kann eine TIA darstellen", true],
      ["Der genaue Beginn beziehungsweise letzte bekannte Normalzustand bleibt wichtig", true],
      ["BZ und neurologischer Verlauf werden weiter beurteilt", true],
      ["Die Rückbildung macht eine Stroke-Unit-Vorstellung entbehrlich", false],
      ["Ein aktuell negativer BEFAST-Test beweist, dass kein neurologisches Ereignis vorlag", false],
    ], "Eine TIA bleibt trotz Symptomrückbildung ein zeitkritischer neurologischer Notfall."),
    question("apoplex-extra-02", "Bei akutem fokalem Defizit misst das Team einen deutlich erhöhten Blutdruck. Welche Aussagen sind im präklinischen Entscheidungsweg belastbar?", [
      ["Ein Schlaganfalltyp lässt sich allein aus Blutdruck und Klinik nicht sicher festlegen", true],
      ["Die Versorgung richtet sich nach der gültigen Thüringer VFA und dem Gesamtzustand", true],
      ["BZ-Kontrolle und wiederholte neurologische Untersuchung bleiben erforderlich", true],
      ["Eine Blutdrucksenkung nach frei gewählter Dosis ist allein wegen des Messwerts zwingend", false],
      ["Ein hoher Blutdruck schließt eine Hirnblutung sicher aus", false],
    ], "Ischämie und Blutung können präklinisch nicht sicher getrennt werden; die VFA und serielle Befunde bestimmen die Maßnahmen."),
    question("apoplex-extra-03", "Ein Patient hat eine neue Halbseitenstörung; gleichzeitig ist der BZ erniedrigt. Was folgt aus dem gemeinsamen Befund?", [
      ["Die Hypoglykämie wird nach dem passenden Behandlungspfad korrigiert", true],
      ["Nach der Glukosegabe werden BZ und neurologische Defizite erneut geprüft", true],
      ["Persistierende Defizite erfordern weitere Schlaganfallabklärung", true],
      ["Der erniedrigte BZ beweist, dass ein Schlaganfall ausgeschlossen ist", false],
      ["Eine neurologische Übergabe ist nach einem einzigen normalen Kontrollwert überflüssig", false],
    ], "Hypoglykämie kann einen Schlaganfall imitieren oder gleichzeitig mit einem anderen neurologischen Ereignis auftreten."),
  ],
  sht: [
    question("sht-extra-01", "Nach Kopftrauma nimmt die Vigilanz ab; Atmung und Kreislauf sind gefährdet. Welche Prioritäten sind richtig?", [
      ["cABCDE und Sicherung ausreichender Oxygenierung haben Vorrang", true],
      ["Hypotonie und Hypoxie als sekundäre Hirnschädigungen vermeiden", true],
      ["GCS, Pupillen und neurologischen Verlauf wiederholt dokumentieren", true],
      ["Die erste Pupillenprüfung ersetzt jede spätere Re-Evaluation", false],
      ["Analgesie darf die Behandlung einer akuten Atemstörung verzögern", false],
    ], "Die Traumaversorgung verbindet cABCDE mit der Vermeidung sekundärer Hirnschäden und serieller neurologischer Kontrolle."),
    question("sht-extra-02", "Ein Patient entwickelt nach SHT eine neue Anisokorie und eine zunehmende Bewusstseinsstörung. Welche Bewertungen sind angemessen?", [
      ["Die Befunddynamik ist ein Warnsignal für eine intrakranielle Verschlechterung", true],
      ["Zeitpunkt und Seitenbefund gehören in die Klinikübergabe", true],
      ["Atemweg, Oxygenierung und Kreislauf werden parallel re-evaluiert", true],
      ["Eine Schmerzreduktion hebt die Gefahr einer Hirndrucksteigerung auf", false],
      ["Ein einzelner noch normaler Blutdruck widerlegt die neurologische Verschlechterung", false],
    ], "Neu auftretende Pupillendifferenz und Vigilanzabfall sind relevante Verlaufszeichen nach SHT."),
    question("sht-extra-03", "Bei schmerzhaftem SHT wird eine Analgesie nach der Thüringer Schmerz-VFA vorbereitet. Welche Sicherungen sind fachlich sinnvoll?", [
      ["Neurologischen Ausgangsbefund vor und nach der Gabe festhalten", true],
      ["Indikation, Gegenanzeigen und gewählten Medikamentenpfad prüfen", true],
      ["Monitoring sowie Atemwegs- und Beatmungsbereitschaft fortführen", true],
      ["Eine sedierende Wirkung macht weitere Pupillen- und GCS-Kontrollen unnötig", false],
      ["Die Analgesie ersetzt die zeitkritische Traumazielklinikplanung", false],
    ], "Analgesie ist Teil der überwachten Traumaversorgung; neurologischer Verlauf und Transportpriorität bleiben maßgeblich."),
  ],
  lae: [
    question("lae-extra-01", "Zwei Patienten haben Verdacht auf LAE: einer ist wach und kreislaufstabil, der andere synkopiert mit Hypotonie. Welche Unterscheidungen sind korrekt?", [
      ["Hypotonie und Synkope machen eine hämodynamisch instabile LAE wahrscheinlicher", true],
      ["Beim instabilen Patienten werden Notarztnachforderung und Reanimationsbereitschaft priorisiert", true],
      ["Auch beim stabilen Patienten bleiben Monitoring und Verlaufskontrolle nötig", true],
      ["Eine normale anfängliche Sättigung beweist bei beiden den Ausschluss einer LAE", false],
      ["Der instabile Patient darf erst nach vollständiger Diagnosesicherung transportiert werden", false],
    ], "Die hämodynamische Stabilität bestimmt Kritikalität und Versorgungspriorität; Einzelwerte schließen die LAE nicht aus."),
    question("lae-extra-02", "Warum muss positive Druckbeatmung bei schwerer LAE mit Rechtsherzversagen besonders sorgfältig abgewogen werden?", [
      ["Der intrathorakale Druck kann den venösen Rückstrom zum rechten Herzen vermindern", true],
      ["Ein bereits belasteter rechter Ventrikel kann hämodynamisch weiter dekompensieren", true],
      ["Bei notwendiger Atemwegssicherung bleiben enges Monitoring und Kreislaufbereitschaft wichtig", true],
      ["Positive Druckbeatmung verbessert bei jeder LAE automatisch den venösen Rückstrom", false],
      ["Die Problematik betrifft nur die Bildgebung, nicht die Kreislaufsituation", false],
    ], "Bei schwerem Rechtsherzversagen kann erhöhter intrathorakaler Druck Vorlast und Kreislauf zusätzlich beeinträchtigen."),
    question("lae-extra-03", "Bei Dyspnoe und Tachykardie zeigt das EKG kein S₁Q₃T₃-Muster. Welche Aussagen sind richtig?", [
      ["Das fehlende Muster schließt eine LAE nicht aus", true],
      ["Die Suche nach TVT-Zeichen und Rechtsherzbelastung bleibt sinnvoll", true],
      ["Klinischer Verlauf und Kreislaufstatus wiegen schwerer als dieses Einzelzeichen", true],
      ["Das Muster wäre bei Vorliegen allein beweisend für eine LAE", false],
      ["Ohne S₁Q₃T₃ ist keine weitere respiratorische Beurteilung nötig", false],
    ], "S₁Q₃T₃ ist weder empfindlich noch beweisend; die LAE wird im klinischen Gesamtbild beurteilt."),
  ],
  hypoglykaemie: [
    question("hypo-extra-01", "Ein insulinbehandelter Patient schwitzt und ist verwirrt; kapillär werden 68 mg/dl gemessen. Welche Einordnung ist begründet?", [
      ["Beschwerden können individuell auch oberhalb des Richtwerts von 50 mg/dl beginnen", true],
      ["Medikation, Nahrungsaufnahme und körperliche Belastung gehören zur Ursachenklärung", true],
      ["BZ und neurologischer Befund müssen gemeinsam und im Verlauf bewertet werden", true],
      ["Der Wert oberhalb von 50 mg/dl schließt eine symptomatische Unterzuckerung sicher aus", false],
      ["Ohne Heißhunger kann keine neuroglykopenische Störung bestehen", false],
    ], "Der Richtwert ersetzt nicht die individuelle klinische Bewertung; 60 bis 80 mg/dl können bereits symptomatisch sein."),
    question("hypo-extra-02", "Nach Behandlung steigt der BZ, die Sprachstörung bleibt jedoch bestehen. Welche Schritte sind erforderlich?", [
      ["Den Kontroll-BZ kapillär bestimmen und dokumentieren", true],
      ["Ein zerebrales Ereignis weiterhin als Differenzialdiagnose prüfen", true],
      ["Den neurologischen Verlauf mit Zeitangaben übergeben", true],
      ["Die Aphasie allein als normale Folge jeder Glukosegabe abtun", false],
      ["Die Versorgung nach dem ersten Normalwert ohne weitere Untersuchung beenden", false],
    ], "Ein normalisierter BZ erklärt persistierende fokale Defizite nicht ausreichend; Re-Evaluation bleibt nötig."),
    question("hypo-extra-03", "Eine bewusstlose Person mit Hypoglykämie hat keinen sicher laufenden Venenzugang. Welche Aussagen bleiben richtig?", [
      ["Orale Glukose ist ohne sichere Schutzreflexe kein geeigneter Weg", true],
      ["Atemweg und Aspirationsschutz werden parallel zur Therapievorbereitung beurteilt", true],
      ["Eine i.v.-Gabe setzt die sichere Lage und Funktion des Zugangs voraus", true],
      ["Eine paravasale Glukosegabe ist bei Zeitdruck gleichwertig", false],
      ["Der niedrige BZ macht Monitoring und erneute Messung überflüssig", false],
    ], "Schwere Hypoglykämie verlangt Schutz der Atemwege, sicheren Applikationsweg und wiederholte klinische sowie kapilläre Kontrolle."),
  ],
  nierensteinkolik: [
    question("niere-extra-01", "Bei kolikartigem Flankenschmerz kommen Fieber und Hypotonie hinzu. Welche Bewertungen sind begründet?", [
      ["Eine komplizierte Obstruktion mit Infektion muss erwogen werden", true],
      ["Sepsiszeichen verändern Transportpriorität und ärztlichen Unterstützungsbedarf", true],
      ["Vitaltrend und klinische Re-Evaluation sind wichtiger als alleinige Schmerzabnahme", true],
      ["Fieber beweist eine unkomplizierte Nierensteinkolik", false],
      ["Analgesie erlaubt es, Kreislaufinstabilität bis zur Klinik zu ignorieren", false],
    ], "Fieber und Instabilität sind Warnzeichen einer komplizierten Nierenkolik beziehungsweise Infektion."),
    question("niere-extra-02", "Der Schmerz lässt während des Transports nach; zuvor bestanden starke Flankenkoliken und Erbrechen. Welche Aussagen bleiben richtig?", [
      ["Die klinische Besserung beweist keinen sicheren Steinabgang", true],
      ["BZ, Vitalwerte, Schmerz und Begleitsymptome werden nach Befund erneut bewertet", true],
      ["Eine fortbestehende Obstruktion oder alternative Ursache bleibt möglich", true],
      ["Nach Schmerzreduktion sind alle Red Flags automatisch widerlegt", false],
      ["Eine forcierte Infusion ist zum Ausschwemmen des Steins stets erforderlich", false],
    ], "Schmerzverlauf allein sichert weder Steinabgang noch Ausschluss einer Komplikation; forcierte Flüssigkeitsgabe ist nicht Standard."),
    question("niere-extra-03", "Bei vermuteter Nierensteinkolik und NRS 8 soll VFA 39 angewandt werden. Welche Prüfschritte sind korrekt?", [
      ["Schwangerschaft beziehungsweise Stillzeit als Algorithmus-Gegenanzeigen beachten", true],
      ["Vor dem Metamizolpfad den systolischen Blutdruck beurteilen", true],
      ["Bei passender kolikartiger Symptomatik den Butylscopolamin-Zweig prüfen", true],
      ["Bei RRsys unter 100 mmHg denselben Medikamentenpfad ohne weitere Prüfung fortsetzen", false],
      ["Die Medikamentengabe ersetzt Überwachung und Transport", false],
    ], "VFA 39 verlangt Indikations-, Gegenanzeigen- und Kreislaufprüfung sowie fortgesetztes Monitoring."),
  ],
  hodentorsion: [
    question("hoden-extra-01", "Ein Jugendlicher hat plötzlich Leistenschmerz, Erbrechen und einen hochstehenden Hoden. Welche Entscheidungen sind richtig?", [
      ["Die Hodentorsion bleibt auch bei führendem Leistenschmerz eine wichtige Arbeitsdiagnose", true],
      ["Exakten Symptombeginn und Seitenbefund dokumentieren", true],
      ["Die zeitkritische urologische Zielklinik früh organisieren", true],
      ["Ein unauffälliger Urinstatus erlaubt ein sicheres Ausschließen", false],
      ["Erst eine spätere Schmerzverstärkung macht die Vorstellung dringlich", false],
    ], "Ausstrahlender Schmerz und vegetative Zeichen können eine Torsion begleiten; Verdacht und Zeitfenster bestimmen die Dringlichkeit."),
    question("hoden-extra-02", "Der Skrotalschmerz bessert sich plötzlich vollständig nach einer starken Episode. Welche Aussagen sind angemessen?", [
      ["Eine intermittierende Torsion mit spontaner Detorsion bleibt möglich", true],
      ["Frühere ähnliche Episoden und die genaue Zeitachse müssen erfragt werden", true],
      ["Die urologische Abklärung bleibt notwendig", true],
      ["Schmerzfreiheit beweist eine dauerhaft normale Hodendurchblutung", false],
      ["Das Team sollte präklinisch eine manuelle Detorsion als Routine versuchen", false],
    ], "Symptomrückgang schließt eine Torsion nicht aus; präklinisch stehen Analgesie und zeitkritischer Transport im Vordergrund."),
    question("hoden-extra-03", "Bei starkem Schmerz nach Skrotaltrauma besteht Torsionsverdacht. Welche Maßnahmen dürfen parallel laufen?", [
      ["cABCDE und fokussierte Untersuchung mit Seitenvergleich", true],
      ["Überwachte Analgesie nach passendem Thüringer Schmerzpfad", true],
      ["Urologische Voranmeldung und zügiger Transport", true],
      ["Die operative Zeitkritik bis zur vollständigen Analgesiewirkung aussetzen", false],
      ["Ein gutes Ansprechen auf Schmerzmittel als Beweis gegen Torsion werten", false],
    ], "Schmerzkontrolle, Monitoring und Transportorganisation ergänzen sich; die Ursache wird dadurch nicht beseitigt."),
  ],
  hyperventilation: [
    question("hyper-extra-01", "Ein ängstlicher Patient atmet schnell, hat Thoraxschmerz und SpO₂ 99 %. Welche Schlüsse sind zulässig?", [
      ["Eine psychogene Hyperventilation bleibt möglich, ist aber nicht bewiesen", true],
      ["ACS, LAE und Pneumothorax müssen anhand weiterer Befunde geprüft werden", true],
      ["Auskultation, Kreislauf und EKG können die Einordnung verändern", true],
      ["Die hohe SpO₂ schließt jede organische Ursache aus", false],
      ["Angst macht eine strukturierte cABCDE-Beurteilung entbehrlich", false],
    ], "Normale Oxygenierung und Angst reichen nicht zur psychogenen Zuordnung; Red Flags und organische Ursachen werden aktiv gesucht."),
    question("hyper-extra-02", "Bei Tachypnoe ist EtCO₂ erniedrigt. Welche Interpretationen sind fachlich haltbar?", [
      ["Gesteigerte CO₂-Abatmung ist eine mögliche Erklärung", true],
      ["LAE oder Schock können trotz niedrigem EtCO₂ ebenfalls vorliegen", true],
      ["Klinischer Kontext und Verlauf entscheiden über die Arbeitshypothese", true],
      ["Ein niedriger Wert beweist eine Panikattacke", false],
      ["Eine metabolische Azidose ist bei schneller Atmung grundsätzlich ausgeschlossen", false],
    ], "EtCO₂ ist ein Kontextbefund, keine alleinige Ursachenbestimmung der Tachypnoe."),
    question("hyper-extra-03", "Bei vermutetem Hyperventilationssyndrom treten Kribbeln und Pfötchenstellung auf. Welche Aussagen stimmen?", [
      ["CO₂-Abfall kann eine respiratorische Alkalose auslösen", true],
      ["Die veränderte Verfügbarkeit von ionisiertem Kalzium kann Tetaniezeichen begünstigen", true],
      ["Angeleitete Atemverlangsamung und ruhige Kommunikation sind geeignete erste Schritte", true],
      ["Tütenrückatmung ist unabhängig von der Ursache immer gefahrlos", false],
      ["Die Tetaniezeichen schließen eine gleichzeitig bestehende organische Erkrankung aus", false],
    ], "Hypokapnie erklärt Alkalose und Tetanie; die sichere Versorgung setzt weiterhin Differenzialdiagnostik voraus."),
  ],
  geburt: [
    question("geburt-extra-01", "Während einer präklinischen Geburt entwickelt die Mutter eine starke Blutung. Welche Prioritäten bleiben richtig?", [
      ["Mütterliche Kreislauf- und Blutungsverläufe wiederholt erfassen", true],
      ["Parallel die Versorgung des Neugeborenen und den Transport organisieren", true],
      ["Plazentastatus, Zeitpunkte und Maßnahmen für die Übergabe dokumentieren", true],
      ["Ein guter APGAR-Wert des Kindes schließt eine mütterliche Gefährdung aus", false],
      ["Die Blutung erst nach vollständiger schriftlicher Dokumentation beurteilen", false],
    ], "Mutter und Neugeborenes haben getrennte Versorgungs- und Beobachtungsbedarfe; Blutverlust ist ein eigenständiges Warnzeichen."),
    question("geburt-extra-02", "Ein Neugeborenes atmet nach der Geburt nicht ausreichend. Welche Entscheidungen entsprechen dem dargestellten Versorgungsablauf?", [
      ["Wärmeerhalt und strukturierte Beurteilung von Atmung und Herzfrequenz beginnen sofort", true],
      ["Wirksame Beatmung ist bei unzureichender Atmung ein zentraler Schritt", true],
      ["Die Herzfrequenz wird nach Maßnahmen erneut beurteilt", true],
      ["Die Hautfarbe allein entscheidet über den Beginn von Thoraxkompressionen", false],
      ["Ein einmaliger APGAR-Gesamtwert ersetzt die laufende Re-Evaluation", false],
    ], "Der Neugeborenenalgorithmus priorisiert Wärme, Atmung, Herzfrequenz, wirksame Beatmung und Re-Evaluation."),
    question("geburt-extra-03", "Nach wirksamer Beatmung bleibt die Herzfrequenz des Neugeborenen unter 60/min. Welche Aussagen sind korrekt?", [
      ["Thoraxkompressionen werden nun nach dem dargestellten Algorithmus begonnen", true],
      ["Das Verhältnis beträgt drei Kompressionen zu einer Beatmung", true],
      ["Beatmungswirksamkeit und Herzfrequenz bleiben Gegenstand der Re-Evaluation", true],
      ["Kompressionen waren bereits allein wegen einer Akrozyanose zwingend", false],
      ["Die Beatmung wird beim Beginn der Kompressionen dauerhaft beendet", false],
    ], "Bei fortbestehender Herzfrequenz unter 60/min trotz effektiver Beatmung folgen Kompressionen im Verhältnis 3:1."),
  ],
  thoraxtrauma: [
    question("thorax-extra-01", "Nach Thoraxtrauma nimmt die Dyspnoe zu; einseitig fehlt das Atemgeräusch, der Blutdruck fällt. Welche Aussagen sind richtig?", [
      ["Ein Spannungspneumothorax muss als zeitkritische Ursache bedacht werden", true],
      ["Atem- und Kreislaufdynamik sind gemeinsam zu beurteilen", true],
      ["Die Kriterien der Thüringer VFA 07 für die Entlastung sind gezielt zu prüfen", true],
      ["Eine fehlende Trachealverlagerung schließt die Diagnose in diesem Stadium aus", false],
      ["Ein einzelner SpO₂-Wert beweist einen Hämatothorax statt Pneumothorax", false],
    ], "VFA 07 verbindet mindestens einseitig abgeschwächtes Atemgeräusch mit hämodynamischer Instabilität; die Trachealverlagerung ist ein Spätzeichen."),
    question("thorax-extra-02", "Bei stumpfem Thoraxtrauma sind Atemgeräusch und Kreislauf auffällig. Welche Mechanismen müssen unterschieden werden?", [
      ["Ein Hämatothorax kann gleichzeitig Ventilation und zirkulierendes Volumen beeinträchtigen", true],
      ["Ein Spannungspneumothorax kann den venösen Rückstrom behindern", true],
      ["Eine Herzkontusion kann die Pumpleistung mindern", true],
      ["Alle drei Befunde führen ausschließlich über denselben Schockmechanismus zur Hypotonie", false],
      ["Eine geschlossene Thoraxwand schließt jedes dieser Verletzungsmuster sicher aus", false],
    ], "Thoraxverletzungen können hypovolämische, obstruktive oder kardiogene Kreislaufprobleme auslösen."),
    question("thorax-extra-03", "Nach Analgesie sinkt die NRS, zugleich verschlechtern sich Atemfrequenz und Blutdruck. Welche Schritte sind begründet?", [
      ["cABCDE und Thoraxbefund umgehend erneut prüfen", true],
      ["Wirkung und mögliche Nebenwirkungen der Analgesie im Verlauf berücksichtigen", true],
      ["Notarzt-, Transport- und Zielklinikplanung an der Verschlechterung ausrichten", true],
      ["Die geringere NRS als Entwarnung für Atmung und Kreislauf werten", false],
      ["Weitere Messungen bis zum Eintreffen in der Klinik aussetzen", false],
    ], "Analgesie beseitigt die Verletzungsursache nicht; respiratorische und hämodynamische Verschlechterung verlangt sofortige Re-Evaluation."),
  ],
  abdominaltrauma: [
    question("abd-extra-01", "Nach Hochrasanztrauma ist der Bauch zunächst weich, die Herzfrequenz steigt und der Blutdruck fällt später. Welche Bewertungen sind richtig?", [
      ["Ein anfänglich geringer Bauchbefund schließt innere Blutung nicht aus", true],
      ["Serielle Vitalwerte und wiederholtes cABCDE sind entscheidend", true],
      ["Zeitkritischer Transport und geeignete Zielklinik werden parallel vorbereitet", true],
      ["Ein weicher Bauch beweist eine stabile retroperitoneale Situation", false],
      ["Die Transportplanung soll bis zur exakten Organlokalisation warten", false],
    ], "Abdominelle und retroperitoneale Blutungen können anfangs wenig äußerliche Zeichen zeigen; Dynamik und definitive Versorgung zählen."),
    question("abd-extra-02", "Bei Bauchtrauma besteht der Verdacht auf lebensbedrohliche Blutung. Welche Aussagen zur Tranexamsäure-Einordnung sind korrekt?", [
      ["Die konkrete Indikation der Thüringer VFA beziehungsweise Anlage muss geprüft werden", true],
      ["Die Gabe wird in Blutungs-, Schock- und Transportmanagement eingebettet", true],
      ["Zeitpunkt, Menge, Wirkung und weitere Maßnahmen werden übergeben", true],
      ["Jeder leichte Bauchschmerz ohne Blutungsverdacht ist automatisch eine TXA-Indikation", false],
      ["Tranexamsäure ersetzt die Suche nach und Versorgung der Blutungsquelle", false],
    ], "TXA gehört nur bei passender Blutungsindikation in den strukturierten Traumapfad; definitive Blutungskontrolle bleibt nötig."),
    question("abd-extra-03", "Nach stumpfem Bauchtrauma liegen Flankenschmerz und Hämaturie vor. Welche Schlüsse sind angemessen?", [
      ["Eine Nieren- oder retroperitoneale Verletzung bleibt möglich", true],
      ["Begleitverletzungen und Kreislauftrend müssen mitbeurteilt werden", true],
      ["Der Befund gehört in Voranmeldung und Übergabe", true],
      ["Hämaturie beweist ohne weitere Untersuchung eine isolierte Ureterkolik", false],
      ["Fehlende Eviszeration schließt eine schwere innere Verletzung aus", false],
    ], "Flankenbefund und Hämaturie können auf urogenitale Verletzungen hinweisen; Hochrasanzmechanismus und Vitaltrend bleiben relevant."),
  ],
  gallensteinkolik: [
    question("galle-extra-01", "Eine Patientin hat Kolikschmerz im rechten Oberbauch; später kommen Fieber und Ikterus hinzu. Welche Bewertungen sind richtig?", [
      ["Eine entzündliche Komplikation beziehungsweise Gallenwegsbeteiligung ist zu bedenken", true],
      ["Die bisherige Arbeitsdiagnose einer unkomplizierten Kolik muss überprüft werden", true],
      ["Kreislauf und Transportdringlichkeit werden neu beurteilt", true],
      ["Schmerzlinderung nach Analgesie schließt eine Cholangitis aus", false],
      ["Fieber und Ikterus sind für die Übergabe unerheblich, solange die NRS sinkt", false],
    ], "Fieber und Ikterus sind Warnzeichen bei möglicher Abflussstörung; symptomatische Besserung hebt die Komplikationsgefahr nicht auf."),
    question("galle-extra-02", "Oberbauchschmerz nach fettreicher Mahlzeit geht mit Kaltschweißigkeit einher. Welche Entscheidungen sind fachlich begründet?", [
      ["Ein 12-Kanal-EKG zur ACS-Abgrenzung ist erforderlich", true],
      ["Mahlzeit und Schmerzcharakter stützen höchstens eine Arbeitsdiagnose", true],
      ["Bei STEMI-Kriterien ist der in VFA 39 vorgesehene ACS-Pfad zu beachten", true],
      ["Der Essensbezug schließt einen Myokardinfarkt sicher aus", false],
      ["Eine unauffällige Temperatur macht weitere Differenzialdiagnostik überflüssig", false],
    ], "Bei Schmerzen oberhalb des Bauchnabels verlangt VFA 39 die Prüfung auf STEMI-Kriterien; Essensbezug beweist keine Gallenursache."),
    question("galle-extra-03", "Eine Gallensteinkolik wird von massiver Übelkeit begleitet. Welche Aussagen zur VFA-Zuordnung stimmen?", [
      ["Schmerz- und Übelkeitspfad haben unterschiedliche Indikationen", true],
      ["Kontraindikationen, Kreislauf und Verlauf werden vor und nach Maßnahmen geprüft", true],
      ["VFA 18 kann zusätzlich zur passenden Schmerzbehandlung relevant werden", true],
      ["Die Antiemese ersetzt ein EKG bei relevantem Oberbauchschmerz", false],
      ["Nach Medikamentengabe sind Monitoring und Transport nicht mehr nötig", false],
    ], "VFA 39 und VFA 18 adressieren verschiedene Symptome; beide erfordern strukturierte Prüfung und Überwachung."),
  ],
  wirbelsaeulentrauma: [
    question("ws-extra-01", "Nach Sturz aus Höhe hat ein Patient Rückenschmerz, aber zunächst normale Motorik. Welche Schlussfolgerungen sind richtig?", [
      ["Eine Wirbelkörper- oder Bandverletzung bleibt trotz erhaltener Motorik möglich", true],
      ["Der Mechanismus beeinflusst Rettung und Bewegungsbegrenzung", true],
      ["Neurologischer Ausgangsbefund und Verlauf werden dokumentiert", true],
      ["Normale Sensibilität beweist eine stabile Wirbelsäule", false],
      ["Auf Begleitverletzungen kann bei fehlender Parese verzichtet werden", false],
    ], "Ein unauffälliger Erstbefund schließt strukturelle Verletzungen nicht aus; Mechanismus und Verlauf bleiben entscheidend."),
    question("ws-extra-02", "Nach möglicher hoher Rückenmarksverletzung bestehen Hypotonie und Atemschwäche. Welche Bewertungen sind richtig?", [
      ["Die Atemfunktion kann durch gestörte Zwerchfellansteuerung bedroht sein", true],
      ["Ein neurogener Schock ist möglich, Blutung muss dennoch geprüft werden", true],
      ["cABCDE, Begleitverletzungen und Vitaltrend werden parallel beurteilt", true],
      ["Jede Hypotonie nach Trauma ist ohne weitere Prüfung sicher neurogen", false],
      ["Eine normale SpO₂-Messung macht die Beurteilung der Atemarbeit entbehrlich", false],
    ], "Hohe Läsionen können Atmung und autonome Kreislaufregulation beeinträchtigen; hämorrhagische Ursachen dürfen nicht übersehen werden."),
    question("ws-extra-03", "Für ein schmerzhaftes Wirbelsäulentrauma wird Analgesie vorbereitet. Welche Schritte bleiben notwendig?", [
      ["Neurologischen Befund vor und nach der Medikamentengabe vergleichen", true],
      ["Morphin- oder Esketaminpfad anhand der gültigen VFA und Kontraindikationen wählen", true],
      ["Atmung, Kreislauf, Schmerz und Nebenwirkungen fortlaufend überwachen", true],
      ["Schmerzfreiheit allein erlaubt eine sofortige Entlassung ohne weitere Traumabeurteilung", false],
      ["Die Medikamentenwirkung ersetzt die Übergabe des Unfallmechanismus", false],
    ], "Analgesie ergänzt die überwachte Traumaversorgung; Neurostatus, Mechanismus und Verlauf müssen erhalten und übergeben werden."),
  ],
  rechtskunde: [
    question("recht-extra-01", "Ein NotSan erwägt eine invasive Maßnahme nach § 2a NotSanG. Welche Voraussetzungen und Grenzen sind richtig?", [
      ["Die Maßnahme muss in der Ausbildung erlernt worden sein und beherrscht werden", true],
      ["Sie muss zur Abwendung von Lebensgefahr oder wesentlichen Folgeschäden erforderlich sein", true],
      ["Die Regelung gilt nur bis zum Eintreffen des Notarztes oder Beginn weiterer ärztlicher, auch teleärztlicher, Versorgung", true],
      ["Eine beliebige heilkundliche Maßnahme ist schon bei bloßer Zweckmäßigkeit gedeckt", false],
      ["Teleärztliche Versorgung ist für die zeitliche Grenze rechtlich unbeachtlich", false],
    ], "§ 2a NotSanG verbindet Beherrschung und Erforderlichkeit mit einer ausdrücklich begrenzten Übergangsphase."),
    question("recht-extra-02", "Bei einer geplanten Unterbringung wird eine Fixierung erwogen. Welche Trennungen sind rechtlich wichtig?", [
      ["Die Unterbringung und die Fixierung sind unterschiedliche Eingriffe", true],
      ["Für eine nicht nur kurzfristige Fixierung ist grundsätzlich eine richterliche Entscheidung nötig", true],
      ["Die Voraussetzungen des ThürPsychKG sind für jeden Eingriff gesondert zu prüfen", true],
      ["Ein Unterbringungsbeschluss erlaubt automatisch jede Fixierung ohne weitere Prüfung", false],
      ["Eine Fixierung wird allein durch eine medizinische Zweckmäßigkeitserwägung gerechtfertigt", false],
    ], "§§ 7–9 ThürPsychKG betreffen die Unterbringung; § 14 regelt die zusätzliche Fixierung und ihre Sicherungen."),
    question("recht-extra-03", "Eine einwilligungsfähige Patientin lehnt nach Aufklärung den Transport ab. Welche Handlungen sind korrekt?", [
      ["Verständnis, Entscheidungsfähigkeit und Freiwilligkeit der Ablehnung prüfen", true],
      ["Risiken, Alternativen und die dokumentierte Entscheidung nachvollziehbar besprechen", true],
      ["Bei veränderter Vigilanz die Einwilligungsfähigkeit erneut beurteilen", true],
      ["Allein die medizinische Empfehlung macht eine Behandlung gegen den Willen zulässig", false],
      ["Die Unterschrift auf einem Formular ersetzt jede Aufklärung und Befunddokumentation", false],
    ], "Eine wirksame Ablehnung setzt Entscheidungsfähigkeit und Aufklärung voraus; der dokumentierte Verlauf bleibt entscheidend."),
  ],
} satisfies Record<string, SupplementalQuestion[]>;
