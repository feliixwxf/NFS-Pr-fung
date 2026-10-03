export type CommunicationFlashcard = { id: string; area: string; question: string; answer: string };

export type CommunicationQuestion = {
  id: string;
  prompt: string;
  options: { text: string; correct?: boolean }[];
  source: string;
  difficulty: 1 | 2 | 3;
  mode: "multiple";
};

export const kommunikationFlashcards: CommunicationFlashcard[] = [
  { id: "komm-card-01", area: "Grundlagen", question: "Grenzen Sie verbal, paraverbal, nonverbal und taktil voneinander ab.", answer: "Verbal ist der Wortinhalt. Paraverbal umfasst Stimme, Lautstärke, Sprechtempo und Betonung. Nonverbal sind Mimik, Gestik, Blick, Körperhaltung und Distanz. Taktil meint Berührung; im Rettungsdienst braucht sie Anlass, Erklärung und möglichst Zustimmung." },
  { id: "komm-card-02", area: "Aktives Zuhören", question: "Nennen und erläutern Sie fünf Techniken des aktiven Zuhörens.", answer: "Paraphrasieren: Inhalt in eigenen Worten; Verbalisieren: wahrgenommene Gefühle vorsichtig benennen; Nachfragen: Unklares konkretisieren; Aufmerksamkeitsreaktionen: Blickkontakt, Nicken, kurze Bestätigungen; Zusammenfassen: Kernpunkte bündeln und bestätigen lassen." },
  { id: "komm-card-03", area: "Rogers", question: "Welche drei Grundhaltungen beschreibt Carl Rogers und wie werden sie im Einsatz sichtbar?", answer: "Empathie: Perspektive und Gefühle verstehen; Akzeptanz beziehungsweise bedingungsfreie positive Beachtung: Person respektieren, ohne jedes Verhalten gutzuheißen; Kongruenz: echt, glaubwürdig und transparent auftreten." },
  { id: "komm-card-04", area: "Kommunikationsquadrat", question: "Analysieren Sie die vier Seiten einer Nachricht nach Schulz von Thun.", answer: "Sachinhalt: Worüber informiere ich? Selbstkundgabe: Was zeige ich von mir? Beziehung: Was halte ich von dir beziehungsweise wie stehe ich zu dir? Appell: Wozu möchte ich dich veranlassen? Sender und Empfänger können unterschiedliche Seiten betonen." },
  { id: "komm-card-05", area: "Sender–Empfänger", question: "Erklären Sie den vollständigen Sender–Empfänger-Prozess einschließlich möglicher Störungen.", answer: "Der Sender codiert eine Absicht in Zeichen und übermittelt sie über einen Kanal; der Empfänger decodiert und interpretiert sie. Störungen können bei Codierung, Kanal, Wahrnehmung und Interpretation entstehen. Rückmeldung beziehungsweise Check-back schließt die Schleife." },
  { id: "komm-card-06", area: "Watzlawick", question: "Nennen Sie die fünf Axiome Watzlawicks in prüfungstauglicher Form.", answer: "Man kann nicht nicht kommunizieren; jede Kommunikation hat Inhalts- und Beziehungsaspekt; Kommunikationsabläufe werden unterschiedlich gegliedert und als Ursache/Wirkung interpretiert; Menschen kommunizieren digital und analog; Beziehungen sind symmetrisch oder komplementär." },
  { id: "komm-card-07", area: "Bedürfnisse", question: "Wie ist Maslows Bedürfnismodell aufgebaut und welche Prüfungsfalle ist zu vermeiden?", answer: "Physiologische Bedürfnisse, Sicherheit, soziale Zugehörigkeit, Wertschätzung, Selbstverwirklichung. Es ist ein Orientierungsmodell, kein starres Stufengesetz: Bedürfnisse können gleichzeitig bestehen und müssen nicht vollständig nacheinander erfüllt werden." },
  { id: "komm-card-08", area: "Ich-Botschaft", question: "Bauen Sie eine deeskalierende Ich-Botschaft auf.", answer: "Beobachtung ohne Bewertung, eigene Wirkung oder Gefühl, eigenes Bedürfnis und konkrete Bitte. Beispiel: Wenn mehrere Personen gleichzeitig sprechen, verliere ich wichtige Informationen. Ich brauche kurz Ruhe. Bitte spricht jetzt nur eine Person." },
  { id: "komm-card-09", area: "Konflikte", question: "Unterscheiden Sie Interrollen- und Intrarollenkonflikt anhand rettungsdienstlicher Beispiele.", answer: "Interrollenkonflikt: Erwartungen verschiedener eigener Rollen kollidieren, etwa Teamleitung und private Freundschaft. Intrarollenkonflikt: widersprüchliche Erwartungen innerhalb derselben Rolle, etwa Angehörige wünschen sofortige Abfahrt, der Notarzt weitere Diagnostik vom selben NotSan." },
  { id: "komm-card-10", area: "Patientengespräch", question: "Wann sind offene und wann geschlossene Fragen im Notfalleinsatz sinnvoll?", answer: "Offene Fragen fördern freie Schilderung und Beziehung, etwa zu Beginn der Anamnese. Geschlossene Fragen fokussieren zeitkritische Details, prüfen Red Flags und bestätigen konkrete Angaben. Gute Gesprächsführung beginnt oft offen und wird anschließend gezielt enger." },
  { id: "komm-card-11", area: "Nähe und Distanz", question: "Wie nutzen Sie Distanzzonen im Rettungsdienst fachgerecht?", answer: "Distanzwerte sind kultur- und situationsabhängige Orientierung. Medizinische Versorgung erfordert häufig persönliche oder intime Nähe. Diese wird angekündigt, begründet, möglichst erlaubt und auf das Notwendige begrenzt; Scham, Trauma und Sicherheitslage werden berücksichtigt." },
  { id: "komm-card-12", area: "Teamkommunikation", question: "Erklären Sie Closed Loop, Call-out und Check-back.", answer: "Call-out: relevante Information laut an das gesamte Team. Auftrag: Person namentlich, Aufgabe und Ziel. Check-back: Empfänger wiederholt; Sender bestätigt oder korrigiert. Closed Loop ist erst erreicht, wenn Durchführung und Ergebnis zurückgemeldet wurden." },
  { id: "komm-card-13", area: "Übergabe", question: "Strukturieren Sie eine rettungsdienstliche Übergabe.", answer: "Identifikation und Leitsituation, relevante Vorgeschichte, erhobene Befunde und Verlauf, Arbeitsdiagnose/Risikobewertung, Maßnahmen mit Wirkung sowie offene Aufgaben. Die Reihenfolge kann lokal als ISBAR/SBAR oder SINNHAFT vorgegeben sein; entscheidend sind Präzision, Priorisierung und Rückfragen." },
  { id: "komm-card-14", area: "Verständnissicherung", question: "Was ist Teach-back und wie formuliert man es ohne Prüfungston?", answer: "Der Patient erklärt den Plan in eigenen Worten. Die Verantwortung bleibt beim Erklärenden: ‚Damit ich weiß, ob ich es verständlich erklärt habe: Was tun Sie, wenn die Beschwerden wiederkommen?‘ Bei Lücken erneut einfacher erklären und nochmals prüfen." },
  { id: "komm-card-15", area: "Gewaltfreie Kommunikation", question: "Welche vier Schritte umfasst die Gewaltfreie Kommunikation nach Marshall B. Rosenberg?", answer: "Beobachtung ohne Bewertung, Gefühl, Bedürfnis und konkrete Bitte. Sie dient als Gesprächsstruktur, ersetzt in einer akuten Gefahrenlage aber keine klare Grenze oder eindeutige Anweisung." },
  { id: "komm-card-16", area: "Besondere Situationen", question: "Wie passen Sie Kommunikation bei Angst, Hörbeeinträchtigung oder Sprachbarriere an?", answer: "Reize reduzieren, kurze klare Sätze, eine sprechende Person, Blickkontakt auf Augenhöhe, Zeit lassen, Verständnis prüfen. Bei Hörbeeinträchtigung Gesicht sichtbar halten und Hilfsmittel nutzen; bei Sprachbarriere möglichst qualifizierte Sprachmittlung statt Kinder als Übersetzer." },
];

export const kommunikationQuestions: CommunicationQuestion[] = [
  { id: "komm-q-01", prompt: "Ein wacher Patient wirkt ängstlich und schildert diffuse Beschwerden. Welche Gesprächsschritte fördern zunächst Informationsgewinn und Sicherheit?", options: [
    { text: "Mit einer offenen Frage beginnen und die Schilderung zunächst nicht durch vorschnelle Deutung einengen.", correct: true },
    { text: "Wahrgenommene Gefühle vorsichtig verbalisieren und die Deutung vom Patienten bestätigen lassen.", correct: true },
    { text: "Alle Angaben sofort ausschließlich mit Ja-Nein-Fragen erheben, damit das Gespräch kontrollierbar bleibt." },
    { text: "Wesentliche Aussagen paraphrasieren und anschließend gezielt Red Flags erfragen.", correct: true },
    { text: "Blickkontakt vermeiden, weil nonverbale Signale im medizinischen Gespräch ohne Bedeutung sind." },
  ], source: "Aktives Zuhören verbindet offene Exploration, vorsichtiges Verbalisieren, Paraphrasieren und anschließende Fokussierung. Geschlossene Fragen sind gezielt nützlich, aber nicht als alleinige Gesprächsform.", difficulty: 1, mode: "multiple" },
  { id: "komm-q-02", prompt: "Welche Zuordnungen zu den Kommunikationskanälen sind fachlich korrekt?", options: [
    { text: "Wortwahl und Satzinhalt gehören zur verbalen Ebene.", correct: true },
    { text: "Sprechtempo, Lautstärke und Betonung gehören zur paraverbalen Ebene.", correct: true },
    { text: "Mimik, Gestik, Körperhaltung und Distanz gehören zur nonverbalen Ebene.", correct: true },
    { text: "Eine beruhigende Hand auf der Schulter ist ein taktiles Signal und sollte situationsgerecht angekündigt werden.", correct: true },
    { text: "Widersprechen sich Worte und Mimik, liegt zwingend eine bewusste Täuschung vor." },
  ], source: "Kommunikation nutzt mehrere Kanäle. Inkongruenz ist ein Beobachtungsbefund und kann viele Ursachen haben; sie beweist keine Lüge.", difficulty: 1, mode: "multiple" },
  { id: "komm-q-03", prompt: "Der Satz ‚Hier ist es aber kalt‘ fällt im Behandlungsraum. Welche Analysen entsprechen dem Kommunikationsquadrat?", options: [
    { text: "Sachseite: Die wahrgenommene Raumtemperatur ist niedrig.", correct: true },
    { text: "Selbstkundgabe: Die sprechende Person friert möglicherweise.", correct: true },
    { text: "Appell: Die Tür soll möglicherweise geschlossen oder eine Decke gereicht werden.", correct: true },
    { text: "Beziehungsseite: Je nach Ton kann Kritik an der Fürsorge des Teams mitschwingen.", correct: true },
    { text: "Die Aussage hat immer nur eine Seite; alle weiteren Deutungen sind Kommunikationsfehler." },
  ], source: "Nach Schulz von Thun enthält eine Äußerung Sachinformation, Selbstkundgabe, Beziehungshinweis und Appell. Kontext und Ton beeinflussen die Deutung.", difficulty: 2, mode: "multiple" },
  { id: "komm-q-04", prompt: "Welche Aussagen zum Sender–Empfänger-Modell und zur Verständnissicherung treffen zu?", options: [
    { text: "Der Sender codiert eine Absicht; der Empfänger decodiert die wahrgenommenen Zeichen.", correct: true },
    { text: "Störungen können im Kanal, in der Wahrnehmung oder bei der Interpretation entstehen.", correct: true },
    { text: "Eine Rückmeldung des Empfängers macht aus einer linearen Übertragung eine überprüfbare Kommunikationsschleife.", correct: true },
    { text: "Wenn der Sender fachlich korrekt formuliert, trägt allein der Empfänger Verantwortung für jedes Missverständnis." },
    { text: "Ein Check-back bestätigt den Wortlaut beziehungsweise Auftrag; Teach-back prüft eher das Verständnis eines Plans.", correct: true },
  ], source: "Bedeutung wird nicht einfach übertragen, sondern codiert, wahrgenommen und interpretiert. Rückmeldung reduziert unerkannte Missverständnisse.", difficulty: 2, mode: "multiple" },
  { id: "komm-q-05", prompt: "Welche Aussagen geben Watzlawicks Axiome sachgerecht wieder?", options: [
    { text: "Auch Schweigen oder Abwenden kann in einer sozialen Situation Mitteilungscharakter haben.", correct: true },
    { text: "Der Beziehungsaspekt beeinflusst, wie ein identischer Sachinhalt verstanden wird.", correct: true },
    { text: "Konfliktpartner können denselben Kreislauf unterschiedlich gliedern und jeweils das eigene Verhalten als Reaktion ansehen.", correct: true },
    { text: "Digitale Kommunikation meint bei Watzlawick ausschließlich elektronische Medien." },
    { text: "Interaktionen können auf Gleichheit oder auf unterschiedlichen, sich ergänzenden Positionen beruhen.", correct: true },
  ], source: "Digital bezeichnet eindeutig vereinbarte Zeichen, besonders Sprache; analog meint unter anderem nonverbale und beziehungsbezogene Ausdrucksformen. Das dritte Axiom behandelt die Interpunktion von Ereignisfolgen.", difficulty: 2, mode: "multiple" },
  { id: "komm-q-06", prompt: "Welche Handlungen entsprechen den Grundhaltungen nach Carl Rogers?", options: [
    { text: "Die Perspektive des Patienten verstehen, ohne seine Bewertung automatisch zu übernehmen.", correct: true },
    { text: "Die Person respektieren, während gefährliches Verhalten klar begrenzt wird.", correct: true },
    { text: "Eigene Unsicherheit transparent und professionell benennen, statt Sicherheit vorzutäuschen.", correct: true },
    { text: "Akzeptanz bedeutet, jede Forderung des Patienten erfüllen zu müssen." },
    { text: "Kongruenz verlangt, ungefiltert jede eigene Emotion auszusprechen." },
  ], source: "Empathie, Akzeptanz und Kongruenz sind professionelle Haltungen. Sie schließen Grenzen, Rollenverantwortung und reflektierte Selbststeuerung nicht aus.", difficulty: 2, mode: "multiple" },
  { id: "komm-q-07", prompt: "Welche Aussagen zum Bedürfnismodell nach Maslow sind für die rettungsdienstliche Kommunikation sinnvoll?", options: [
    { text: "Akute physiologische und sicherheitsbezogene Bedürfnisse können die Aufnahmefähigkeit für lange Erklärungen einschränken.", correct: true },
    { text: "Soziale Zugehörigkeit und Wertschätzung können trotz unerfüllter körperlicher Bedürfnisse bedeutsam bleiben.", correct: true },
    { text: "Das Modell eignet sich als Orientierung, nicht als starres diagnostisches Gesetz.", correct: true },
    { text: "Selbstverwirklichung darf erst angesprochen werden, wenn jede niedrigere Stufe vollständig und dauerhaft erfüllt ist." },
    { text: "Die Bedürfnisebene allein erlaubt keine sichere Vorhersage individuellen Verhaltens." , correct: true },
  ], source: "Maslows Modell hilft beim Ordnen von Bedürfnissen, ist aber keine starre Abfolge. Situation, Biografie und Kultur beeinflussen Prioritäten.", difficulty: 2, mode: "multiple" },
  { id: "komm-q-08", prompt: "Welche Aussagen zu räumlicher Nähe im Rettungsdienst sind korrekt?", options: [
    { text: "Distanzangaben sind Orientierungswerte und hängen von Kultur, Beziehung und Situation ab.", correct: true },
    { text: "Untersuchung und Behandlung können intime Nähe erforderlich machen; diese sollte erklärt und begrenzt werden.", correct: true },
    { text: "Ein Zurückweichen kann Unbehagen anzeigen, beweist aber keine Behandlungsverweigerung.", correct: true },
    { text: "In vitaler Gefahr ist jede Erklärung grundsätzlich entbehrlich, auch wenn sie ohne Verzögerung möglich wäre." },
    { text: "Traumaerfahrungen und Scham können die tolerierte Distanz verändern.", correct: true },
  ], source: "Professionelle Nähe verbindet medizinische Erforderlichkeit mit Ankündigung, Respekt, Zustimmung soweit möglich und Beobachtung nonverbaler Reaktionen.", difficulty: 2, mode: "multiple" },
  { id: "komm-q-09", prompt: "Welche Beispiele beschreiben Rollen- und Erwartungskonflikte zutreffend?", options: [
    { text: "Teamleitung und private Freundschaft führen zu gegensätzlichen Erwartungen: Interrollenkonflikt.", correct: true },
    { text: "Angehörige fordern sofortigen Transport, während das Team eine strukturierte Erstversorgung erwartet: zwingend Interrollenkonflikt." },
    { text: "Unterschiedliche Erwartungen von Angehörigen und Notarzt an dieselbe NotSan-Rolle: Intrarollenkonflikt.", correct: true },
    { text: "Ein Interrollenkonflikt entsteht zwischen mehreren Erwartungen innerhalb nur einer Rolle." },
    { text: "Rollenklarheit und transparentes Benennen von Zuständigkeiten können Konflikte reduzieren.", correct: true },
  ], source: "Interrollenkonflikte liegen zwischen verschiedenen Rollen einer Person; Intrarollenkonflikte zwischen widersprüchlichen Erwartungen an dieselbe Rolle.", difficulty: 2, mode: "multiple" },
  { id: "komm-q-10", prompt: "Ein Angehöriger ruft: ‚Seit zehn Minuten machen Sie gar nichts!‘ Welche Reaktionen sind deeskalierend und zugleich professionell?", options: [
    { text: "Die Sorge benennen: ‚Sie haben Angst, dass wir wertvolle Zeit verlieren.‘", correct: true },
    { text: "Kurz erklären, welche zeitkritischen Schritte gerade erfolgen und wer Ansprechpartner ist.", correct: true },
    { text: "Eine Grenze setzen, wenn Verhalten die Versorgung gefährdet, und eine konkrete Bitte formulieren.", correct: true },
    { text: "Mit gleicher Lautstärke antworten, damit die Hierarchie eindeutig wird." },
    { text: "Den Angehörigen ohne Prüfung der Situation grundsätzlich aus dem Raum entfernen lassen." },
  ], source: "Deeskalation verbindet Emotionserkennung, Orientierung, Transparenz und klare Grenzen. Sicherheit bleibt vorrangig.", difficulty: 3, mode: "multiple" },
  { id: "komm-q-11", prompt: "Welche Formulierungen sind echte Ich-Botschaften beziehungsweise Elemente gewaltfreier Kommunikation?", options: [
    { text: "‚Wenn mehrere Personen gleichzeitig sprechen, verliere ich wichtige Angaben. Bitte spricht jetzt nur eine Person.‘", correct: true },
    { text: "‚Ich finde, Sie sind völlig unkooperativ.‘" },
    { text: "‚Als Sie den Arm weggezogen haben, war die Messung nicht möglich. Ich brauche Ihre Zustimmung oder wir besprechen eine Alternative.‘", correct: true },
    { text: "‚Man muss sich hier einfach vernünftig benehmen.‘" },
    { text: "Beobachtung und Bewertung sollten getrennt, die Bitte konkret und erfüllbar formuliert werden.", correct: true },
  ], source: "Eine professionelle Ich-Botschaft benennt konkrete Beobachtung, eigene Wirkung/Bedürfnis und eine klare Bitte, ohne die Person abzuwerten.", difficulty: 2, mode: "multiple" },
  { id: "komm-q-12", prompt: "Welche Elemente gehören zu sicherer Closed-Loop-Kommunikation während einer Reanimation?", options: [
    { text: "Auftrag an eine eindeutig benannte Person richten.", correct: true },
    { text: "Empfänger wiederholt Auftrag und relevante Dosis beziehungsweise Parameter.", correct: true },
    { text: "Auftraggeber bestätigt oder korrigiert die Wiederholung.", correct: true },
    { text: "Nach Durchführung werden Maßnahme und Ergebnis zurückgemeldet.", correct: true },
    { text: "Ein allgemeiner Zuruf in den Raum gilt auch ohne Empfänger als geschlossene Schleife." },
  ], source: "Closed Loop benötigt Adressierung, Check-back, Bestätigung und Rückmeldung der Durchführung; sonst bleibt der Auftrag potenziell offen.", difficulty: 2, mode: "multiple" },
  { id: "komm-q-13", prompt: "Welche Angaben gehören in eine priorisierte Übergabe eines kritisch kranken Patienten?", options: [
    { text: "Identität, Leitsituation und aktuell größte Gefahr.", correct: true },
    { text: "Relevante Vorgeschichte und zeitlicher Verlauf.", correct: true },
    { text: "Befunde, Arbeitsdiagnose und beobachtete Dynamik.", correct: true },
    { text: "Maßnahmen mit Dosis, Zeitpunkt und Wirkung sowie offene Aufgaben.", correct: true },
    { text: "Jede erhobene Information unabhängig von Relevanz in chronologischer Vollständigkeit vortragen." },
  ], source: "Strukturierte Übergaben priorisieren die aktuelle Lage, relevante Hintergründe, Assessment, Maßnahmen/Wirkung und klare Empfehlungen oder offene Aufgaben.", difficulty: 2, mode: "multiple" },
  { id: "komm-q-14", prompt: "Welche Aussagen zu Teach-back treffen zu?", options: [
    { text: "Der Patient gibt zentrale Informationen oder Handlungsanweisungen in eigenen Worten wieder.", correct: true },
    { text: "Die Formulierung sollte die Qualität der eigenen Erklärung prüfen, nicht den Patienten beschämen.", correct: true },
    { text: "Bei einer falschen Rückgabe wird erneut einfacher erklärt und das Verständnis nochmals geprüft.", correct: true },
    { text: "Die Frage ‚Haben Sie alles verstanden?‘ ist gleichwertig, weil ein Ja das Verständnis sicher belegt." },
    { text: "Teach-back eignet sich besonders für Warnzeichen, Medikamentenanwendung und erneute Kontaktaufnahme.", correct: true },
  ], source: "Teach-back macht Verständnis beobachtbar. Ja-Nein-Bestätigungen überschätzen häufig das tatsächliche Verstehen.", difficulty: 2, mode: "multiple" },
  { id: "komm-q-15", prompt: "Welche Anpassungen sind bei besonderen Patientengruppen angemessen?", options: [
    { text: "Bei Hörbeeinträchtigung Gesicht und Mund sichtbar halten, Nebengeräusche reduzieren und Hilfsmittel erfragen.", correct: true },
    { text: "Bei Sprachbarriere kurze Sätze, Visualisierung und wenn möglich qualifizierte Sprachmittlung nutzen.", correct: true },
    { text: "Kinder grundsätzlich als Übersetzer für sensible medizinische Entscheidungen einsetzen." },
    { text: "Bei kognitiver Einschränkung jeweils einen Schritt erklären und Reaktion sowie Verständnis beobachten.", correct: true },
    { text: "Bei Angst zunächst Orientierung, Sicherheit und Vorhersehbarkeit schaffen.", correct: true },
  ], source: "Die NotSan-APrV verlangt eine Anpassung an Alter, Beeinträchtigungen und besondere Bedürfnisse. Verständlichkeit und Würde bleiben zentral.", difficulty: 2, mode: "multiple" },
  { id: "komm-q-16", prompt: "Ein Patient sagt ruhig ‚Es geht schon‘, hält aber den Thorax fest, vermeidet Blickkontakt und atmet rasch. Welche Schlussfolgerungen sind vertretbar?", options: [
    { text: "Verbale und nonverbale Signale wirken inkongruent und müssen weiter exploriert werden.", correct: true },
    { text: "Der Wortinhalt darf nicht isoliert über die medizinische Dringlichkeit entscheiden.", correct: true },
    { text: "Eine offene Nachfrage nach Beschwerden kann mit fokussierter Diagnostik kombiniert werden.", correct: true },
    { text: "Die Inkongruenz beweist, dass der Patient bewusst lügt." },
    { text: "Kulturelle, emotionale oder situative Faktoren können das Ausdrucksverhalten beeinflussen.", correct: true },
  ], source: "Inkongruenz ist ein Anlass zum behutsamen Nachfragen und zur klinischen Prüfung, keine Diagnose von Täuschung.", difficulty: 3, mode: "multiple" },
  { id: "komm-q-17", prompt: "Welche Aussagen zum Eisbergmodell sind für eine Fallanalyse sinnvoll?", options: [
    { text: "Beobachtbare Worte und Handlungen bilden nur einen Teil der für Kommunikation wirksamen Faktoren.", correct: true },
    { text: "Gefühle, Bedürfnisse, Werte, Erfahrungen und Beziehungserwartungen können unter der sichtbaren Ebene liegen.", correct: true },
    { text: "Verborgene Motive dürfen nicht als gesicherte Tatsachen behauptet, sondern höchstens als Hypothesen geprüft werden.", correct: true },
    { text: "Das Eisbergmodell liefert einen validierten festen Prozentsatz von exakt 20 Prozent sichtbar und 80 Prozent unsichtbar." },
    { text: "Die Metapher kann helfen, vorschnelle Bewertungen zu vermeiden.", correct: true },
  ], source: "Das Eisbergmodell ist eine didaktische Metapher. Prozentangaben sind keine diagnostisch belastbare Naturkonstante.", difficulty: 3, mode: "multiple" },
  { id: "komm-q-18", prompt: "Welche Aussagen zeigen prüfungsreife Kommunikationskompetenz im Rettungsdienst?", options: [
    { text: "Kommunikation wird an Zustand, Alter, Wahrnehmung und situative Erfordernisse angepasst.", correct: true },
    { text: "Nonverbale Signale werden beobachtet, aber nicht ohne Rückfrage als sichere Wahrheit behandelt.", correct: true },
    { text: "Teamaufträge, Übergaben und Risikoinformationen werden strukturiert und rückbestätigt.", correct: true },
    { text: "Unter Zeitdruck sind Beziehungsaspekt und Würde grundsätzlich nachrangig und entbehrlich." },
    { text: "Das eigene Kommunikationsverhalten wird nach Wirkung reflektiert und bei Bedarf verändert.", correct: true },
  ], source: "NotSan-APrV Anlage 1 fordert situations- und personengerechte Kommunikation, nonverbale Möglichkeiten, Beratung sowie zielgerichtete Übergabe und Teamarbeit.", difficulty: 3, mode: "multiple" },
];
