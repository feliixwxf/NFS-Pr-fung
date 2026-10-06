# KI-Übergabe für „NotSan Prüfung"

Stand: 5. Oktober 2026

Produktionsstand: Commit `12ca5b4`

Repository: `feliixwxf/NFS-Pr-fung`

## Sofortauftrag für die übernehmende KI

Du arbeitest an der Lernwebsite **NotSan Prüfung** für die staatliche Notfallsanitäter-Abschlussprüfung in Thüringen. Erhalte das bestehende Design, die Lernlogik, die Konten und die gespeicherten Fortschritte.

Vor jeder Arbeit:

1. `AGENTS.md` vollständig lesen.
2. `git status --short --branch` ausführen.
3. `git fetch --prune origin` ausführen.
4. `origin/main` und `origin/Dustin` vergleichen.
5. Nur bei vollständig sauberem lokalen `main` ein Fast-Forward-Pull durchführen.

Vom Nutzer bereitgestellte Unterlagen sind die Hauptquelle. Bei Medikamenten, Dosierungen, Verdünnungen, Indikationen und Maßnahmen haben ausschließlich die bereitgestellten **Thüringer Verfahrensanweisungen 2026/2027** und deren Anlagen Vorrang. Inhalte sollen präklinisch, prüfungsnah und auf NotSan-Niveau formuliert sein.

## Aktueller Git- und Veröffentlichungsstand

- Lokaler Branch: `main`
- Lokaler Commit: `12ca5b4`
- `origin/main`: `12ca5b4`
- `origin/Dustin`: `12ca5b4`
- Abweichung `origin/main...origin/Dustin`: `0 / 0`
- Arbeitsverzeichnis bei Erstellung dieser Übergabe: sauber
- Produktionsseite: <https://nfs-pr-fung.vercel.app/>
- Alternative Sites-Version: <https://notsan-pruefung.kk2vvvgxsh.chatgpt.site/>
- Ein Push nach `main` startet das Vercel-Deployment.

Der zuletzt veröffentlichte Stand enthält unter anderem:

- erweiterte Pathophysiologie der Hypoglykämie,
- kindliche Immunabwehr und Nestschutz bei Pseudokrupp/Epiglottitis,
- erweiterte Pathophysiologie der akuten Pankreatitis,
- vereinfachte, prüfungsgerechte Anaphylaxie-Pathophysiologie,
- hochauflösende Mastzellabbildung,
- genaueren Pfortaderweg bei Alkoholintoxikation,
- ausgeschriebene Opioidrezeptoren und Naloxon in der Medikamentenübersicht,
- überarbeitete Inhalte in Organisation, Terminologie und Medikamentenwirkung.

## Ziel und Funktionsumfang

Die Website bietet:

- mündliche Lesekapitel in fachlicher Reihenfolge,
- fünf schriftliche Lernbereiche,
- schwere Multiple-Choice-Aufgaben,
- anspruchsvolle Karteikarten,
- dreistufigen Fragenfortschritt,
- Kapitelabschluss und Statistik,
- gemerkte Fragen und gemischte Trainingsrunden,
- Medikamentenwirkung und Medikamentenrechnen,
- Medikamenten- und Spritzenansichten,
- Anatomiebibliothek mit eingebetteten Skriptbildern,
- Vorlesefunktion für mündliche Kapitel,
- Vollbildansicht für Lernbilder,
- responsive Desktop-, iPad- und Mobilansicht,
- Supabase-Konten mit geräteübergreifendem Lernstand,
- Veröffentlichung über GitHub und Vercel.

## Navigation und Routen

Hauptbereiche:

- `/` – Startseite und Lernstatistik
- `/muendlich` – mündliche Themen
- `/schriftlich` – schriftliche Lernbereiche
- `/anatomie` – Anatomiebibliothek
- `/mc` – MC-Training
- `/fortschritt` – begonnene und zu wiederholende Fragen
- `/medikamentenrechnen` – Rechentrainer
- `/medikamentenwirkung` – Medikamentenkarten

Direkte Kapitelrouten funktionieren über `/muendlich/<slug>` sowie über die schriftlichen Unterrouten.

## Mündliche Themen

Die Themenliste enthält 49 Prüfungsthemen. Aktuell sind 47 freigeschaltet. Noch in Vorbereitung sind:

- Thema 46: Herzrhythmusstörungen
- Thema 48: Herzbeuteltamponade

### Herz und Kreislauf

- Myokardinfarkt
- Angina pectoris
- Akutes Koronarsyndrom
- Venenthrombose
- Lungenarterienembolie
- Hypertensiver Notfall
- Instabile Bradykardie
- Kardiales Lungenödem
- Vorhofflimmern
- Schock
- Periphere arterielle Verschlusskrankheit

### Trauma und Verletzungen

- Schädel-Hirn-Trauma
- Wirbelsäulentrauma
- Thoraxtrauma
- Abdominaltrauma
- Amputationsverletzung
- Beckentrauma
- Extremitätentrauma
- Schussverletzungen
- Elektrounfall
- Polytrauma
- Stichverletzungen
- Rippenfraktur
- Barotrauma
- Verbrennung/Verbrühung
- Explosionsverletzungen

### Atmung und Atemwege

- Pneumonie
- COPD
- Asthma bronchiale
- Hyperventilationssyndrom
- Pseudokrupp versus Epiglottitis

### Neurologie, Pädiatrie und Stoffwechsel

- Apoplex/Schlaganfall
- Krampfanfall Erwachsener
- Krampfanfall Kind
- Hypoglykämie
- Anaphylaktischer Schock
- Unterkühlung/Erfrierung

### Abdomen, Gynäkologie und Urologie

- Akutes Abdomen
- Akute Pankreatitis
- Ulkusblutung
- Gallensteinkolik
- Nierensteinkolik
- Geburt und Neugeborenenversorgung
- Extrauteringravidität
- Hodentorsion

### Intoxikationen

- Alkoholintoxikation
- Opiatintoxikation

## Schriftliche Lernbereiche

Alle fünf Bereiche sind als Lesekapitel mit MC-Fragen und Karteikarten vorhanden:

1. Rechtskunde
2. Organisation und Einsatztaktik
3. Kommunikation und Interaktion
4. Qualitätsmanagement
5. Terminologie

Besonderheiten:

- Rechtskunde bezieht Bundesrecht und Thüringer Landesrecht ein.
- Fixierung und Unterbringung berücksichtigen die Unterscheidung zwischen schneller und geplanter Maßnahme.
- Organisation enthält unter anderem MANV, Sichtung, Raumordnung, RTH, Autobahngefahren und FwDV 100.
- Kommunikation enthält die Kommunikationsmodelle und die „5 Regeln der Patientenkommunikation“.
- Qualitätsmanagement behandelt Qualitätsdimensionen, acht Säulen, PDCA, Fehlerkultur und Dokumentation.
- Terminologie behandelt Wortbildung, Anatomie, Epidemiologie, Prävention, Evidenz und Fachsprache.

## Verbindliche Quellenreihenfolge

1. Vom Nutzer bereitgestelltes Skript, DOCX, ODT, Bild oder PDF.
2. Thüringer Verfahrensanweisungen Rettungsdienst 2026/2027 einschließlich B2A/B2B.
3. Vom Nutzer ausdrücklich genannte Zusatzquelle.
4. Aktuelle offizielle Leitlinien, Gesetze oder Primärquellen zur Kontrolle.
5. Modellwissen nur zur verständlichen Verbindung bereits belegter Inhalte.

### Medizinische Grenzen

- Keine Dosierungen aus Modellwissen, anderen Bundesländern oder allgemeinen Fachseiten übernehmen.
- Bei Widersprüchen gelten die Thüringer VFA und Nutzerunterlagen.
- Keine unnötigen innerklinischen Maßnahmen ergänzen.
- Keine Inhalte erfinden, nur um einen Abschnitt zu füllen.
- Unsichere Aussagen erst prüfen.
- Im Lesetext niemals „das Skript sagt“, „laut Aufzeichnung“, „nach Notfallguru“ oder „laut RD Factsheets“ schreiben.
- Quellen nur im Quellenhinweis am Kapitelende nennen.
- Website-Inhalte sind Lernmaterial und ersetzen keine gültige VFA, SOP oder ärztliche Anweisung.

## Standardaufbau eines mündlichen Kapitels

Alle Abschnitte sind beim Öffnen ausgeklappt, können einzeln oder über „Alles ein-/ausklappen“ gesteuert werden und sollen wie ein zusammenhängendes Lesekapitel wirken.

1. Definition
2. Anatomie und Physiologie
3. Pathophysiologie und Ursachen
4. Symptome und stützende Befunde
5. Komplikationen und Gefahren
6. Einsatzmaterialien
7. Erstmaßnahmen, Diagnostik und Anamnese
8. Differenzialdiagnosen und Entscheidungsfindung
9. Weitere Maßnahmen
10. Thüringer VFA und Anlagen
11. Medikamenten- oder Spritzenansicht
12. Karteikarten und MC-Training
13. Kapitelabschluss und Quellen

### Inhaltliche Regeln

- `cABCDE` konsequent anwenden.
- Anamnese als kurzes `SAMPLERS`, bei Schmerz zusätzlich `OPQRST` und NRS.
- Red Flags und Prüfungsfallen klar, aber nicht überladen darstellen.
- Stabil/instabil und zeitkritisch/nicht zeitkritisch begründen.
- Wiederholte Re-Evaluation nach Maßnahmen nennen.
- Bei Trauma Blutung, Wärmeerhalt, Zielklinik und Transportzeit mitdenken.
- Definitionen stehen im Definitionsabschnitt.
- „Weitere Maßnahmen“ möglichst als klare Karten oder Abläufe, nicht als Textwand.

## Multiple Choice, Karteikarten und Fortschritt

### MC-Regeln

- Eine Frage, in der Regel fünf Antwortmöglichkeiten.
- Mehrere richtige Antworten müssen inhaltlich verschieden sein.
- Plausible, eng abgrenzbare Distraktoren verwenden.
- Die längste Antwort darf nicht automatisch richtig sein.
- Keine Quellenhinweise in der Fragestellung.
- VFA über klinische Situation oder VFA-Titel abfragen, nicht nur über eine Nummer.
- Fragenreihenfolge und Antwortreihenfolge beim Neustart mischen.
- Nach Abgabe richtig deutlich grün, falsch deutlich rot darstellen.
- Schwierigkeit: NotSan-Abschlussprüfung Thüringen, nicht Medizinstudium.

### Fortschrittslogik

- einmal richtig: 33 Prozent,
- zweimal richtig: 67 Prozent,
- dreimal richtig: 100 Prozent,
- falsch: nur die betroffene Frage fällt auf 0 Prozent zurück.

Im Fortschrittsbereich erscheinen nur begonnene Themen. Falsche, einmal richtige und zweimal richtige Fragen lassen sich gezielt wiederholen. MC-Fragen, Kapitelstatus und Medikamentenrechnen werden lokal sowie bei angemeldeten Nutzern in Supabase gespeichert.

## Designsystem und mobile Darstellung

Die globale Gestaltung liegt in `app/globals.css`. Vor neuen CSS-Klassen zuerst ein fertiges Kapitel wie Apoplex, ACS, LAE oder Rippenfraktur prüfen.

Wichtige bestehende Klassen:

- `lesson-article`
- `details.rib-section`
- `chapter-heading`
- `lesson-prose script-copy`
- `pulmo-compare`
- `pulmo-risk-grid`
- `pulmo-care-grid`
- `pulmo-vfa-flow`
- `rib-fracture-grid`
- `material-chips`
- `differential-grid`
- `samplers-grid`
- `red-flags`
- `diagnostic-boundary`
- `MedicationPreparation`

Einige gemeinsame Raster werden durch `angina-pectoris-lesson` oder `rippenfraktur-lesson` aktiviert. Fehlt eine dieser Klassen, kann ein neues Kapitel trotz korrektem Inhalt unformatiert wirken.

### Layoutregeln

- Keine abgeschnittenen Texte oder Bilder.
- Desktop meist zweispaltig, mobil einspaltig.
- Touch-Ziele mindestens 44 Pixel.
- Schwebendes Menü auf Mobilgerät/iPad sichtbar und schließbar halten.
- Tabellen dürfen auf iPad und Handy nicht aus dem Inhaltsbereich herauslaufen.
- Große Medikamentenkarte sperrt den Hintergrund-Scroll.
- Mündliche Kapitel öffnen am Seitenanfang.
- „NotSan Prüfung“ im Kopf führt zurück zur Startseite.

## Bilder, VFA und Anatomie

- Lernbilder liegen unter `public/lessons/<thema>/`.
- Bilder aus Nutzerunterlagen nur im vorgesehenen Zusammenhang verwenden.
- Standard: vollständige Darstellung, automatische Höhe, `object-fit: contain`.
- Bilder müssen anklickbar und im Vollbild scharf sein.
- VFA-Seiten und Anlagen einzeln ein-/ausklappbar darstellen.
- B2A/B2B möglichst auf den benötigten Medikamentenbereich zuschneiden.
- Keine KI-generierte Grafik als verbindliche VFA ausgeben.
- Anatomieskriptbilder sind bereits in die Anatomiebibliothek und viele Kapitel integriert.
- Im Anatomiebereich existiert ein dauerhaft erreichbarer Zurück-Button.

Neue Bilddateien aus dem letzten Stand:

- `public/lessons/anaphylaxie/immunreaktion-hd.png`
- `public/lessons/pseudokrupp-epiglottitis/nestschutz-igg-iga.png`

## Medikamentenfunktionen

### Medikamentenwirkung

Die Übersicht in `app/medication-effects-library.tsx` besitzt:

- Suchfeld,
- Medikamentengruppen,
- Karten für Wirkung, Wechselwirkung, Nebenwirkung und Kontraindikation,
- vergrößerbare Einzelkarten,
- Hintergrund-Scroll-Sperre im Dialog.

Wichtige Inhalte wurden unter anderem für ASS, Heparin, Adrenalin, Atropin, Salbutamol, Ipratropium/Atrovent, Prednisolon, Histakut, Vomex, Midazolam, Tranexamsäure, Furosemid, Urapidil, Nifedipin, Amiodaron, Partusisten und Naloxon ergänzt.

### Medikamentenrechnen

- Eigene Route `/medikamentenrechnen`.
- Konzentrations-, Dosis-, Volumen- und gewichtsbezogene Aufgaben.
- Fortschritt wird lokal und mit Konto gespeichert.
- Spritzenansichten müssen auch mobil vollständig ohne horizontales Hin- und Herschieben sichtbar bleiben.

### Wiederkehrende Medikamentenhinweise

- Metamizol/Novalgin: Agranulozytose kurz verständlich erklären.
- Dosierungen und Verdünnungen ausschließlich aus Thüringer VFA/B2A/B2B.
- Die Anzeige soll den realen Spritzentyp berücksichtigen, zum Beispiel Heparinspritze.

## Konto, Supabase und Lernstand

Verwendet wird ausschließlich das Supabase-Projekt **NotSanPrüfung**:

- Projekt-ID: `uxiimrwnhcgpggqswmpz`
- Client-Konfiguration:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Niemals Secret- oder `service_role`-Schlüssel in Git oder Clientcode eintragen.

Relevante Tabellen:

- `public.access_requests`
- `public.learning_question_progress`
- `public.learning_topic_progress`
- `public.learning_medication_progress`
- `public.user_profiles`

Relevante Dateien:

- `app/account-access.tsx`
- `app/account-profile-settings.tsx`
- `app/lib/supabaseClient.ts`
- `app/lib/cloudProgress.ts`
- `app/lib/topicProgress.ts`
- `app/lib/medicationProgress.ts`
- `supabase/migrations/`
- `supabase/README.md`

Kontofunktionen:

- Zugangsanfrage statt offener Registrierung,
- Anmeldung mit E-Mail und Passwort,
- Einladungs- und Passwortsetz-Flow,
- Passwort zurücksetzen,
- E-Mail ändern,
- Profilbild hochladen,
- Fortschritt automatisch synchronisieren,
- lokaler Stand bleibt als Ausfallsicherung erhalten.

### Freigabeablauf

1. In `public.access_requests` nach `status = pending` filtern.
2. E-Mail und Antrag prüfen.
3. Unter Authentication → Users → Add user → Send invitation einladen.
4. Erst nach erfolgreichem Versand `status = approved` und `reviewed_at = now()` setzen.
5. Ohne erfolgreiche Einladung nicht nur den Tabellenstatus ändern.

Operativer Stand am 5. Oktober 2026:

- Felix und Dustin besitzen Konten.
- Samu und Max Schneider wurden eingeladen und freigegeben.
- Laura und Max Falke standen zuletzt noch auf `pending`, weil das eingebaute Supabase-Mail-Limit erreicht war.
- Fehlermeldung: `email rate limit exceeded`.
- Nach Ablauf des Limits erneut einladen; bei häufigeren Einladungen eigenes SMTP einrichten.

## Technische Struktur

- Next.js `16.2.6`
- React `19.2.6`
- TypeScript
- Node.js `>=22.13.0`
- Supabase JS `2.117.2`
- Hauptintegration: `app/page.tsx`
- Dynamische Pfade: `app/[...path]/page.tsx`
- Globale Styles: `app/globals.css`
- Lektionen: `app/<thema>-lesson.tsx`
- Fragen/Karten: `app/<thema>-data.ts`
- Anatomie: `app/anatomy-library.tsx`, `app/anatomy-data.ts`
- Medikamentenwirkung: `app/medication-effects-library.tsx`
- Medikamentenanzeige: `app/medication-preparation.tsx`
- Rechentrainer: `app/medikamentenrechnen/`
- Bilder: `public/lessons/`
- Quellenkopien: `source-material/`

`app/page.tsx` ist sehr groß und enthält noch ältere, teilweise nicht mehr genutzte Komponenten. Keine umfassende Bereinigung nebenbei durchführen. Bei Änderungen immer prüfen, welche Komponente tatsächlich gerendert wird.

## Neues mündliches Thema vollständig einbinden

1. Ähnliche fertige Lektion und Datendatei prüfen.
2. `app/<thema>-lesson.tsx` erstellen.
3. `app/<thema>-data.ts` mit MC-Fragen und Karteikarten erstellen.
4. Lektion und Daten in `app/page.tsx` importieren.
5. `TrainingTopic` erweitern.
6. Nummer in `READY_TOPIC_NUMBERS` ergänzen.
7. Route/Slug in `topicSlugByIndex` eintragen.
8. Thema im `TopicReader` mit richtiger Nummer anbinden.
9. Kapitelabschluss mit tatsächlicher Fragen- und Kartenanzahl einbauen.
10. Daten in `trainingQuestionBanks` aufnehmen.
11. Thema in `oralTrainingChapters` ergänzen.
12. `questionCounts`, Gesamtzähler und Fortschrittsansicht prüfen.
13. Quiz, Karteikarten, gemischte Runden und Wiederholung testen.
14. Medikamentenanzeige und VFA-Bilder anbinden.
15. Desktop, iPad und Mobilansicht prüfen.
16. Produktions-Build durchführen.

Fehlt einer dieser Schritte, kann ein Kapitel lesbar sein, aber im MC-Training, Fortschritt, Dashboard oder Direktlink fehlen.

## Git-Arbeitsablauf

`AGENTS.md` ist verbindlich.

```bash
git status --short --branch
git fetch --prune origin
git rev-parse --short origin/main
git rev-parse --short origin/Dustin
```

Nur bei sauberem lokalen `main`:

```bash
git pull --ff-only origin main
```

Niemals automatisch:

- ungesicherte Änderungen überschreiben oder verwerfen,
- Änderungen stashen,
- fremde Arbeit automatisch committen,
- `git reset --hard` verwenden,
- divergierende Branches mergen oder rebasen,
- Dustins Änderungen ungeprüft übernehmen.

Felix ist Host und gibt die Produktion frei. Dustin arbeitet normalerweise in einem eigenen Branch oder Pull Request. Wenn beide Branches nach ausdrücklicher Freigabe identisch sein sollen, darf `Dustin` nur per Fast-Forward auf den geprüften `main`-Stand gebracht werden.

## Starten und Prüfen

```bash
npm ci
npm run dev -- --port 3001
npm run build:vercel
npm run build
npm test
```

Mindestens erforderlich:

1. `git diff --check`
2. `npm run build`
3. betroffene Seite im Browser prüfen
4. bei Layoutänderungen Mobil- und iPad-Breite kontrollieren
5. nach Push die Produktionsseite und neue Assets mit HTTP 200 prüfen

Der Vinext-Build kann eine Warnung zu Chunks über 500 kB zeigen. Solange der Build mit Exit-Code 0 endet, ist dies aktuell eine Optimierungswarnung und kein Buildfehler.

## Bekannte offene Punkte

- Herzrhythmusstörungen und Herzbeuteltamponade sind noch nicht als vollständige Lesekapitel freigeschaltet.
- Supabase Standard-Mailversand ist stark limitiert; für viele Einladungen eigenes SMTP vorsehen.
- Das Vercel-Dashboard zeigte zuletzt gelegentlich einen allgemeinen Ladefehler, obwohl die Produktionsseite und neue Assets korrekt HTTP 200 lieferten.
- `app/page.tsx` enthält historische Komponenten und sollte nur geplant refaktoriert werden.
- Rechtliche und medizinische Inhalte bei jeder späteren Änderung erneut gegen aktuellen Stand prüfen.

## Fertig-Definition

Eine Aufgabe ist erst abgeschlossen, wenn:

- Nutzerauftrag und Quellen vollständig umgesetzt sind,
- keine nicht autorisierten Dosierungen oder Maßnahmen enthalten sind,
- Layout und Typografie zu bestehenden Kapiteln passen,
- Bilder vollständig, scharf und vergrößerbar sind,
- MC-Fragen und Karteikarten funktionieren,
- Zähler, Statistik und Fortschritt stimmen,
- Supabase-Synchronisierung erhalten bleibt,
- Desktop, iPad und Mobilansicht funktionieren,
- `git diff --check` sauber ist,
- der Produktions-Build erfolgreich ist,
- keine fremde Arbeit überschrieben wurde,
- ein freigegebener Stand nach GitHub/Vercel kontrolliert wurde.
