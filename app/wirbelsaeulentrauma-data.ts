import type { ThoraxtraumaChoiceQuestion, ThoraxtraumaFlashcard } from "./thoraxtrauma-data";

export const wirbelsaeulentraumaQuestions: ThoraxtraumaChoiceQuestion[] = [
  {
    "id": "ws-q-01",
    "mode": "multiple",
    "prompt": "Nach einem Sturz auf die Füße bestehen Rückenschmerzen, aber keine Paresen. Welche Schlussfolgerungen sind begründet?",
    "options": [
      {
        "text": "Axiale Stauchung kann Wirbelkörper verletzen",
        "correct": true
      },
      {
        "text": "Erhaltene Motorik erlaubt die Einstufung als stabile Fraktur"
      },
      {
        "text": "Begleitverletzungen von Becken und Beinen sind mitzubeurteilen",
        "correct": true
      },
      {
        "text": "Eine intakte Sensibilität schließt eine Bandverletzung aus"
      },
      {
        "text": "Der Mechanismus beeinflusst die Entscheidung zur Bewegungsbegrenzung",
        "correct": true
      }
    ],
    "source": "Knochen- und Bandverletzung können ohne neurologisches Defizit vorliegen. Mechanismus, Schmerzen und Begleitverletzungen bestimmen das Vorgehen.",
    "difficulty": 2
  },
  {
    "id": "ws-q-02",
    "mode": "multiple",
    "prompt": "Welche anatomischen Beziehungen erklären die Folgen einer hohen Halsmarkverletzung?",
    "options": [
      {
        "text": "Die Phrenikusversorgung stammt aus C3–C5",
        "correct": true
      },
      {
        "text": "Das Atemzentrum liegt im Dens axis"
      },
      {
        "text": "Eine Läsion kann die Ansteuerung des Zwerchfells unterbrechen",
        "correct": true
      },
      {
        "text": "Die Interkostalmuskeln erhalten ihre Versorgung aus C1–C2"
      },
      {
        "text": "Auch autonome Kreislaufbahnen können betroffen sein",
        "correct": true
      }
    ],
    "source": "Hohe Halsmarkläsionen können Zwerchfellansteuerung, weitere Atemmuskulatur und autonome Kreislaufregulation beeinträchtigen.",
    "difficulty": 2
  },
  {
    "id": "ws-q-03",
    "mode": "multiple",
    "prompt": "Welche Zuordnungen passen zum Rückenmarksquerschnitt?",
    "options": [
      {
        "text": "Das Vorderhorn enthält motorische Nervenzellen",
        "correct": true
      },
      {
        "text": "Das Hinterhorn verarbeitet sensible Informationen",
        "correct": true
      },
      {
        "text": "Die weiße Substanz liegt zentral schmetterlingsförmig"
      },
      {
        "text": "Das Seitenhorn hat vegetative Funktionen",
        "correct": true
      },
      {
        "text": "Der Wirbelkörper enthält die aufsteigenden Nervenbahnen"
      }
    ],
    "source": "Graue Substanz liegt innen, weiße Bahnen liegen außen. Vorder-, Hinter- und Seitenhorn haben unterschiedliche Aufgaben.",
    "difficulty": 2
  },
  {
    "id": "ws-q-04",
    "mode": "multiple",
    "prompt": "Welche Aussagen erklären die Stoßdämpferfunktion der Bandscheibe?",
    "options": [
      {
        "text": "Der Anulus fibrosus umgibt den Gallertkern",
        "correct": true
      },
      {
        "text": "Der Nucleus pulposus besitzt einen hohen Wasseranteil",
        "correct": true
      },
      {
        "text": "Eine Bandscheibe trennt Atlas und Axis"
      },
      {
        "text": "Diffusion ermöglicht den Stoffaustausch",
        "correct": true
      },
      {
        "text": "Die Bandscheiben bilden den knöchernen Spinalkanal"
      }
    ],
    "source": "Faserring und wasserreicher Kern verteilen Lasten. Zwischen C1 und C2 befindet sich keine Bandscheibe.",
    "difficulty": 2
  },
  {
    "id": "ws-q-05",
    "mode": "multiple",
    "prompt": "Nach einem Verkehrsunfall bestehen Hypotonie und Bradykardie bei neurologischen Ausfällen. Was ist schlüssig?",
    "options": [
      {
        "text": "Ein Sympathikusausfall kommt als Ursache infrage",
        "correct": true
      },
      {
        "text": "Die Bradykardie beweist das Fehlen einer Blutung"
      },
      {
        "text": "Vasodilatation kann eine relative Hypovolämie erzeugen",
        "correct": true
      },
      {
        "text": "Eine gestörte Thermoregulation passt zur autonomen Schädigung",
        "correct": true
      },
      {
        "text": "Die Kreislaufstörung beschreibt bereits einen spinalen Schock"
      }
    ],
    "source": "Neurogener Schock betrifft den Kreislauf. Blutverlust muss parallel gesucht werden; spinaler Schock bezeichnet den neurologischen Funktionsausfall unterhalb der Läsion.",
    "difficulty": 2
  },
  {
    "id": "ws-q-06",
    "mode": "multiple",
    "prompt": "Welche Befunde erhöhen nach Trauma den Verdacht auf eine Rückenmarks- oder Nervenverletzung?",
    "options": [
      {
        "text": "Neu aufgetretene Harnentleerungsstörung",
        "correct": true
      },
      {
        "text": "Seitendifferente Kraft der Extremitäten",
        "correct": true
      },
      {
        "text": "Parästhesien unterhalb der Verletzungshöhe",
        "correct": true
      },
      {
        "text": "Isolierte Übelkeit bei erhaltener Neurologie"
      },
      {
        "text": "Ein einmal normal gemessener Blutdruck"
      }
    ],
    "source": "Neue Blasen-/Mastdarmstörungen, Paresen und Sensibilitätsstörungen sind neurologische Warnzeichen; Übelkeit oder Blutdruck allein lokalisieren keine Rückenmarksläsion.",
    "difficulty": 3
  },
  {
    "id": "ws-q-07",
    "mode": "multiple",
    "prompt": "Ein alkoholisierter Patient verneint nach Motorradunfall Nackenschmerzen. Welche Bewertungen sind angemessen?",
    "options": [
      {
        "text": "Die Schmerzauskunft ist eingeschränkt zuverlässig",
        "correct": true
      },
      {
        "text": "Die fehlenden Schmerzen erlauben die Freigabe der HWS"
      },
      {
        "text": "Unfallmechanismus und Untersuchung bleiben entscheidend",
        "correct": true
      },
      {
        "text": "Eine Ablenkverletzung kann die Beurteilung zusätzlich erschweren",
        "correct": true
      },
      {
        "text": "BEFAST ersetzt hier die Prüfung von Motorik und Sensibilität"
      }
    ],
    "source": "Intoxikation und Ablenkverletzungen begrenzen die klinische Beurteilbarkeit. Ein negatives Schlaganfallscreening klärt keine Wirbelsäulenverletzung.",
    "difficulty": 3
  },
  {
    "id": "ws-q-08",
    "mode": "multiple",
    "prompt": "Während der Rettung verschlechtert sich die Atmung eines Patienten mit HWS-Verdacht. Welche Prioritäten passen?",
    "options": [
      {
        "text": "Atemweg und Ventilation erneut nach cABCDE beurteilen",
        "correct": true
      },
      {
        "text": "Erst die komplette Fixierung beenden, dann ventilieren"
      },
      {
        "text": "Bewegungen bei notwendigen Maßnahmen möglichst begrenzen",
        "correct": true
      },
      {
        "text": "Atemunterstützung und Notarztnachforderung vorbereiten",
        "correct": true
      },
      {
        "text": "Die Atemstörung primär als Schmerzreaktion werten"
      }
    ],
    "source": "Lebensrettende Maßnahmen haben Vorrang. Bewegungsbegrenzung wird soweit möglich parallel durchgeführt.",
    "difficulty": 3
  },
  {
    "id": "ws-q-09",
    "mode": "multiple",
    "prompt": "Welche Beobachtungen gehören vor und nach einer Umlagerung in die Verlaufskontrolle?",
    "options": [
      {
        "text": "Kraft und Sensibilität im Seitenvergleich",
        "correct": true
      },
      {
        "text": "Nur die NRS, solange der Blutdruck stabil bleibt"
      },
      {
        "text": "Periphere Durchblutung und neue Beschwerden",
        "correct": true
      },
      {
        "text": "Atmung und Kreislauftrend",
        "correct": true
      },
      {
        "text": "Nur die GCS als Ersatz für Extremitätenneurologie"
      }
    ],
    "source": "pDMS, neurologischer Status, Schmerz und Vitalparameter erfassen unterschiedliche Aspekte und ermöglichen den Vorher-nachher-Vergleich.",
    "difficulty": 3
  },
  {
    "id": "ws-q-10",
    "mode": "multiple",
    "prompt": "Welche Aussagen zur mechanischen Verletzung sind zutreffend?",
    "options": [
      {
        "text": "Hyperflexion kann Bandscheiben und Bänder schädigen",
        "correct": true
      },
      {
        "text": "Rotation kann knöcherne und ligamentäre Instabilität erzeugen",
        "correct": true
      },
      {
        "text": "Axiale Kompression betrifft ausschließlich die Halswirbelsäule"
      },
      {
        "text": "Eine C2-Fraktur bedeutet regelhaft vollständige Tetraplegie"
      },
      {
        "text": "Hyperextension kann eine Hangman-Fraktur begünstigen",
        "correct": true
      }
    ],
    "source": "Mechanismus und Verletzungsmuster stehen in Beziehung, erlauben aber keine sichere Aussage über das Ausmaß neurologischer Schäden.",
    "difficulty": 3
  },
  {
    "id": "ws-q-11",
    "mode": "multiple",
    "prompt": "Welche Aussagen zur Rettung und Lagerung sind sinnvoll?",
    "options": [
      {
        "text": "Eine Vakuummatratze kann die achsengerechte Lagerung unterstützen",
        "correct": true
      },
      {
        "text": "Ein Stifneck allein immobilisiert die gesamte Wirbelsäule"
      },
      {
        "text": "Eine schmerzhafte Fehlstellung wird kraftvoll neutral ausgerichtet"
      },
      {
        "text": "Unnötige Umlagerungen werden vermieden",
        "correct": true
      },
      {
        "text": "Bei vitaler Bedrohung kann eine rasche Rettung nötig sein",
        "correct": true
      }
    ],
    "source": "Koordinierte Rettung und Bewegungsbegrenzung reduzieren zusätzliche Belastung. Eine Halskrause ersetzt keine Ganzkörperstabilisierung; keine gewaltsame Korrektur.",
    "difficulty": 3
  },
  {
    "id": "ws-q-12",
    "mode": "multiple",
    "prompt": "Nach Analgesie sinkt die NRS von 8 auf 3, die Beinschwäche bleibt. Welche Entscheidungen sind begründet?",
    "options": [
      {
        "text": "Der neurologische Befund bleibt transportentscheidend",
        "correct": true
      },
      {
        "text": "Die Schmerzreduktion spricht für eine stabile Verletzung"
      },
      {
        "text": "Eine geeignete Zielklinik wird früh vorangemeldet",
        "correct": true
      },
      {
        "text": "Motorik und Sensibilität werden weiter reevaluiert",
        "correct": true
      },
      {
        "text": "Weitere Befundkontrollen warten bis zum Wirkungseintritt aller Medikamente"
      }
    ],
    "source": "Analgesie verändert Schmerzen, beseitigt aber keine strukturelle oder neurologische Verletzung.",
    "difficulty": 3
  },
  {
    "id": "ws-q-13",
    "mode": "multiple",
    "prompt": "Welche Aussagen zur Medikamentenvorbereitung entsprechen den Anlagen B2A/B2B?",
    "options": [
      {
        "text": "Morphin 10 mg/1 ml plus 9 ml NaCl ergibt 1 mg/ml",
        "correct": true
      },
      {
        "text": "Esketamin 50 mg/2 ml plus 8 ml NaCl ergibt 5 mg/ml",
        "correct": true
      },
      {
        "text": "50 mg Esketamin werden mit 10 ml NaCl auf 5 mg/ml verdünnt"
      },
      {
        "text": "Bei Morphin entsprechen 4 mg der genannten Verdünnung 4 ml",
        "correct": true
      },
      {
        "text": "Esketamin 5 mg/ml entspricht Morphin 5 mg/ml"
      }
    ],
    "source": "Entscheidend ist das Endvolumen: beide genannten Ansätze ergeben 10 ml. Wirkstoff, Konzentration, mg und ml getrennt prüfen.",
    "difficulty": 3
  },
  {
    "id": "ws-q-14",
    "mode": "multiple",
    "prompt": "Für einen Erwachsenen mit 80 kg wird nach VFA 36 Esketamin vorbereitet. Welche Werte stimmen?",
    "options": [
      {
        "text": "Die Initialdosis beträgt 16 mg",
        "correct": true
      },
      {
        "text": "Bei 5 mg/ml sind initial 3,2 ml erforderlich",
        "correct": true
      },
      {
        "text": "Eine halbe Initialdosis beträgt 8 mg",
        "correct": true
      },
      {
        "text": "Eine halbe Initialdosis entspricht 3,2 ml"
      },
      {
        "text": "Die Initialdosis beträgt 0,1 mg/kg"
      }
    ],
    "source": "80 × 0,2 mg/kg = 16 mg; 16/5 = 3,2 ml. Die halbe Initialdosis beträgt 8 mg beziehungsweise 1,6 ml.",
    "difficulty": 3
  },
  {
    "id": "ws-q-15",
    "mode": "multiple",
    "prompt": "Ein Erwachsener mit 70 kg erhält Morphin nach VFA 38. Welche Aussagen sind korrekt?",
    "options": [
      {
        "text": "Die Tabelle nennt initial 3 mg",
        "correct": true
      },
      {
        "text": "Bei 1 mg/ml sind initial 3 ml erforderlich",
        "correct": true
      },
      {
        "text": "Nach fünf Minuten kann bei Bedarf die halbe Dosis folgen",
        "correct": true
      },
      {
        "text": "Die tabellarische Initialdosis beträgt 7 mg"
      },
      {
        "text": "Die maximale Gesamtdosis beträgt 10 ml unabhängig von der Konzentration"
      }
    ],
    "source": "Die Gewichtstabelle nennt für 70 kg 3 mg. Die Grenze beträgt 10 mg, nicht grundsätzlich 10 ml; mg und ml sind nur bei 1 mg/ml zahlenmäßig gleich.",
    "difficulty": 3
  },
  {
    "id": "ws-q-16",
    "mode": "multiple",
    "prompt": "Welche Maßnahmen gehören zum Erwachsenen-Esketaminpfad der VFA 36?",
    "options": [
      {
        "text": "Beatmungsbereitschaft sowie EKG- und Blutdruckkontrolle",
        "correct": true
      },
      {
        "text": "1 mg Midazolam i.v. als dargestellte Begleitmedikation",
        "correct": true
      },
      {
        "text": "Langsame Esketamingabe nach Dosierungstabelle",
        "correct": true
      },
      {
        "text": "Unmittelbare Wiederholung der vollen Initialdosis bei Restschmerz"
      },
      {
        "text": "Beendigung des Monitorings bei gesunkener NRS"
      }
    ],
    "source": "VFA 36 zeigt Midazolam, langsames Esketamin, Re-Evaluation und bei Bedarf halbe Repetitionsdosen. Überwachung und NRS-Dokumentation laufen weiter.",
    "difficulty": 3
  },
  {
    "id": "ws-q-17",
    "mode": "multiple",
    "prompt": "Bei 80 kg wurden 4 mg Morphin, nach fünf Minuten weitere 2 mg gegeben. Welche Aussagen treffen zu?",
    "options": [
      {
        "text": "Die bisherige Gesamtdosis beträgt 6 mg",
        "correct": true
      },
      {
        "text": "Die Differenz zur 10-mg-Grenze beträgt 4 mg",
        "correct": true
      },
      {
        "text": "Die noch freie Dosis wird unabhängig vom Befund sofort gegeben"
      },
      {
        "text": "Atmung und Kreislauf entscheiden mit über weitere Gaben",
        "correct": true
      },
      {
        "text": "Eine nachlassende Vigilanz erfordert erst bei NRS 0 eine Kontrolle"
      }
    ],
    "source": "Die Maximaldosis ist keine Zieldosis. Weitere Gabe hängt von Wirkung, Nebenwirkungen und erneuter Beurteilung nach dem Algorithmus ab.",
    "difficulty": 3
  },
  {
    "id": "ws-q-18",
    "mode": "multiple",
    "prompt": "Nach Sturz bestehen beidseitige Beinschwäche, Thoraxschmerz und fallender Blutdruck. Welche Entscheidungen sind schlüssig?",
    "options": [
      {
        "text": "Neurologische Ausfälle und mögliche Blutungsquellen parallel beurteilen",
        "correct": true
      },
      {
        "text": "Die Hypotonie allein der vermuteten Rückenmarksverletzung zuordnen"
      },
      {
        "text": "Transport in ein geeignetes Traumazentrum früh organisieren",
        "correct": true
      },
      {
        "text": "Initialen Neurostatus und Veränderungen strukturiert übergeben",
        "correct": true
      },
      {
        "text": "Die Transportentscheidung bis zur sicheren Frakturlokalisation verschieben"
      }
    ],
    "source": "Begleitverletzungen können gleichzeitig lebensbedrohlich sein. cABCDE, frühe Zielklinikentscheidung und dokumentierter Verlauf unterstützen die zeitkritische Versorgung.",
    "difficulty": 3
  }
];

export const wirbelsaeulentraumaFlashcards: ThoraxtraumaFlashcard[] = [
  {
    "id": "ws-card-01",
    "area": "Definition",
    "question": "Definieren Sie das Wirbelsäulentrauma und grenzen Sie es von einer Rückenmarksverletzung ab.",
    "answer": "Verletzung der Wirbelsäule und angrenzender Weichteile durch direkte oder indirekte Gewalt. Eine Rückenmarksverletzung kann hinzukommen, ist aber nicht Voraussetzung; fehlende Ausfälle beweisen keine Stabilität."
  },
  {
    "id": "ws-card-02",
    "area": "Anatomie",
    "question": "Leiten Sie die Aufgaben der Wirbelsäulenabschnitte aus ihrem Aufbau ab.",
    "answer": "7 Hals-, 12 Brust- und 5 Lendenwirbel sind beweglich. Kreuzbein aus 5 verwachsenen Wirbeln und variables Steißbein verbinden beziehungsweise ergänzen den unteren Abschluss. Die Wirbelsäule trägt Lasten, ermöglicht Bewegung und schützt das Rückenmark."
  },
  {
    "id": "ws-card-03",
    "area": "Bandscheibe",
    "question": "Erklären Sie den Zusammenhang zwischen Aufbau, Ernährung und Funktion der Bandscheibe.",
    "answer": "Äußerer Anulus fibrosus und wasserreicher Nucleus pulposus verteilen Druck und dämpfen Stöße. Flüssigkeits- und Nährstoffaustausch erfolgen über Diffusion. Regelhaft 23 Bandscheiben; keine zwischen Atlas und Axis."
  },
  {
    "id": "ws-card-04",
    "area": "Rückenmark",
    "question": "Ordnen Sie graue und weiße Substanz sowie die Rückenmarkshörner zu.",
    "answer": "Innen graue Substanz für Verschaltung, außen weiße Substanz für Leitungsbahnen. Vorderhorn motorisch, Hinterhorn sensibel, Seitenhorn vegetativ. Das Rückenmark endet beim Erwachsenen ungefähr auf Höhe L1/L2; darunter laufen Nervenwurzeln weiter."
  },
  {
    "id": "ws-card-05",
    "area": "Mechanismus",
    "question": "Vergleichen Sie Kompression, Flexion, Extension und Rotation anhand von Unfallbeispielen.",
    "answer": "Sturz auf Füße/Gesäß oder Kopfsprung: axiale Kompression. Vorwärtsbeugung: Hyperflexion. Überstreckung: Hyperextension, mögliche Hangman-Fraktur. Verdrehung: Rotation. Knochen, Bandscheiben und Bänder können jeweils kombiniert betroffen sein."
  },
  {
    "id": "ws-card-06",
    "area": "Neurogener Schock",
    "question": "Erklären Sie Hypotonie und mögliche Bradykardie nach hoher Rückenmarksverletzung.",
    "answer": "Sympathikusausfall führt zu Vasodilatation, relativer Hypovolämie und möglicher Bradykardie; Thermoregulation kann gestört sein. Blutung parallel suchen. Neurogener Schock ist eine Kreislaufstörung, spinaler Schock ein neurologischer Funktionsausfall."
  },
  {
    "id": "ws-card-07",
    "area": "Atmung",
    "question": "Warum kann eine hohe Halsmarkläsion die Atmung bedrohen?",
    "answer": "C3–C5 stellen die Phrenikusversorgung. Läsionen dieser Segmente oder höherer Bahnen können das Zwerchfell beeinträchtigen; weitere Atemmuskulatur kann ebenfalls ausfallen. Atmung wiederholt prüfen und Beatmung vorbereiten."
  },
  {
    "id": "ws-card-08",
    "area": "Neurologie",
    "question": "Welche Befunde erheben und dokumentieren Sie vor und nach einer Rettung?",
    "answer": "Motorik und Sensibilität im Seitenvergleich, periphere Durchblutung, neue Parästhesien, Schwäche, Blasen-/Mastdarmstörung, Schmerz und Vitalparameter. Ausgangsbefund vor Analgesie erfassen, sofern dadurch keine dringliche Versorgung verzögert wird."
  },
  {
    "id": "ws-card-09",
    "area": "Entscheidung",
    "question": "Warum ist ein schmerzfreier, alkoholisierter Unfallpatient nicht zuverlässig entlastet?",
    "answer": "Intoxikation beeinträchtigt die Anamnese und Untersuchung. Mechanismus, Ablenkverletzungen und neurologischer Befund bleiben wichtig. Fehlende Beschwerden allein erlauben keine zuverlässige Freigabe."
  },
  {
    "id": "ws-card-10",
    "area": "Rettung",
    "question": "Wie verbinden Sie Bewegungsbegrenzung und lebensrettende Maßnahmen?",
    "answer": "MILS und koordinierte, schonende Rettung; achsengerechte Lagerung nach Befund. Keine gewaltsame Neutralstellung. cABCDE und notwendige Atemunterstützung haben Vorrang. Halskrause allein stabilisiert nicht die gesamte Wirbelsäule."
  },
  {
    "id": "ws-card-11",
    "area": "SAMPLERS",
    "question": "Welche Anamnese ist für Versorgung und Analgesie besonders relevant?",
    "answer": "Neue neurologische Beschwerden, Allergien, Antikoagulation und sedierende Medikamente, frühere Wirbelsäulen-/Neurologieerkrankungen, letzte Aufnahme, genauer Unfallhergang, Osteoporose und mögliche Schwangerschaft. Schmerz mit OPQRST und NRS erfassen."
  },
  {
    "id": "ws-card-12",
    "area": "Morphin",
    "question": "Berechnen Sie Initial- und halbe Wiederholungsdosis bei 80 kg nach VFA 38 und der Verdünnungsanlage.",
    "answer": "Tabelle: 4 mg initial, entsprechend 4 ml bei 1 mg/ml. Halbe Dosis: 2 mg = 2 ml nach fünf Minuten bei Bedarf und erneuter Beurteilung. Maximal insgesamt 10 mg; Überwachung und Beatmungsbereitschaft."
  },
  {
    "id": "ws-card-13",
    "area": "Ketanest",
    "question": "Berechnen Sie Esketamin initial und als halbe Repetition bei 75 kg und 5 mg/ml.",
    "answer": "Initial 0,2 mg/kg × 75 = 15 mg = 3 ml. Halbe Initialdosis 7,5 mg = 1,5 ml. Langsam i.v., Re-Evaluation nach VFA 36; dort auch 1 mg Midazolam als Begleitmedikation beachten."
  },
  {
    "id": "ws-card-14",
    "area": "Übergabe",
    "question": "Welche Angaben braucht die aufnehmende Klinik bei vermutetem Spinaltrauma?",
    "answer": "Unfallmechanismus und Zeitpunkt, neurologischer Ausgangsbefund und Verlauf, Atem-/Kreislaufstörungen, Begleitverletzungen, Rettung/Lagerung, Analgetikum mit mg, ml, Konzentration und Zeiten, Wirkung und Nebenwirkungen."
  }
];

