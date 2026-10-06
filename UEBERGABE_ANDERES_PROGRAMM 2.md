# KI-Übergabe für NotSan Prüfung

Stand: 29. September 2026

## Sofortiger Arbeitsauftrag für die übernehmende KI

Du arbeitest an der Lernwebsite **NotSan Prüfung** für die staatliche Notfallsanitäter-Abschlussprüfung in Thüringen. Erhalte die bestehende Gestaltung, Lernlogik, Benutzerkonten und gespeicherten Fortschritte. Nutze vom Nutzer gelieferte Unterlagen als Hauptquelle. Ergänze nur fachlich geprüfte und präklinisch relevante Inhalte. Bei Maßnahmen, Medikamenten, Verdünnungen und Dosierungen haben ausschließlich die Thüringer Verfahrensanweisungen 2026/2027 und die vom Nutzer bereitgestellten Anlagen Vorrang.

Lies vor jeder Änderung zuerst `AGENTS.md`, prüfe den Git-Stand und überschreibe niemals lokale oder fremde Arbeit. Untersuche anschließend vergleichbare vorhandene Kapitel, bevor du neue Komponenten oder CSS-Klassen entwickelst. Ein neues Kapitel ist erst fertig, wenn Lesekapitel, Bilder, Medikamentenanzeige, Karteikarten, Multiple-Choice-Fragen, Fortschrittseintrag, mobile Darstellung und Produktions-Build geprüft sind.

## Ziel des Projekts

Die Website soll Lernenden eine moderne, übersichtliche und mobil nutzbare Prüfungsvorbereitung bieten:

- lesbare und fachlich strukturierte mündliche Kapitel,
- ein eigener Bereich für schriftliche Themen,
- schwere Multiple-Choice-Aufgaben auf NotSan-Staatsexamensniveau,
- anspruchsvolle Karteikarten,
- dreistufiger Fragenfortschritt,
- Kapitelabschluss und Statistik,
- Medikamenten- und Spritzenübersichten,
- Benutzerkonten mit Supabase-Synchronisierung,
- Veröffentlichung über GitHub und Vercel.

## Verbindliche Quellenreihenfolge

1. Vom Nutzer bereitgestelltes Skript, DOCX oder PDF.
2. Thüringer Verfahrensanweisungen Rettungsdienst 2026/2027 einschließlich B2A/B2B-Anlagen.
3. Vom Nutzer ausdrücklich genannte Zusatzquelle.
4. Aktuelle offizielle Leitlinien oder Primärquellen für eine fachliche Kontrolle.
5. Eigenes Modellwissen nur zum Verbinden oder verständlichen Erklären bereits belegter Inhalte.

### Medizinische Grenzen

- Keine Dosierungen aus Modellwissen, anderen Bundesländern oder allgemeinen Fachseiten übernehmen.
- Bei abweichenden Angaben gelten die Thüringer VFA beziehungsweise die bereitgestellten Anlagen.
- Keine innerklinischen Maßnahmen ergänzen, wenn sie für die präklinische NotSan-Prüfung nicht relevant sind.
- Keine Inhalte erfinden, um einen Abschnitt zu füllen.
- Unsichere oder widersprüchliche Angaben zuerst prüfen und dem Nutzer transparent melden.
- Inhalte aus einer Quelle nicht aus dem Zusammenhang lösen.
- Im Lesetext nicht schreiben: „Das Skript sagt“, „laut Skript“ oder „die Vorlage nennt“. Der Text selbst ist die Lernunterlage.
- Quellen nur im Quellenhinweis am Kapitelende nennen.

## Standardstruktur eines mündlichen Kapitels

Alle Abschnitte sind beim Öffnen ausgeklappt, lassen sich aber einzeln einklappen. Das Kapitel soll wie eine zusammenhängende, hochwertige Lernunterlage wirken und nicht wie eine rohe Formularliste.

1. Definition
2. Anatomie und Physiologie
3. Pathophysiologie und Ursachen
4. Welche Symptome stützen die Arbeitsdiagnose?
5. Komplikationen und Gefahren
6. Welche Einsatzmaterialien nehmen Sie mit?
7. Erstmaßnahmen, Diagnostik und Anamnese
8. Differenzialdiagnosen und Entscheidungsfindung
9. Weitere Maßnahmen
10. Thüringer VFA 2026/2027 und Dosierungsanlagen
11. Medikamenten- oder Spritzenanzeige, sofern Medikamente vorkommen
12. Karteikarten und Multiple-Choice-Training
13. Kapitelabschluss und Quellenhinweis

### Inhaltliche Ausgestaltung

- Bei Erstmaßnahmen konsequent mit `cABCDE` arbeiten.
- Anamnese knapp und prüfbar mit `SAMPLERS`, bei Schmerz zusätzlich `OPQRST` und NRS darstellen.
- Red Flags und typische Prüfungsfallen deutlich, aber nicht überladen hervorheben.
- Entscheidungswege begründen: stabil/instabil, zeitkritisch/nicht zeitkritisch, Load-go-and-treat.
- Wiederholte Re-Evaluation nach Maßnahmen nennen.
- Bei Trauma Blutung, Oxygenierung, Wärmeerhalt, Zielklinik und Transportzeit mitdenken.
- Definitionen stehen ausschließlich im Abschnitt „Definition“.
- Lange Textblöcke vermeiden. Für Vergleiche, Abläufe und Prioritäten vorhandene Karten- und Rasterklassen verwenden.

## Design- und Darstellungsregeln

Die Website besitzt bereits ein einheitliches Designsystem in `app/globals.css`. Vor neuen Styles immer ein ähnliches fertiges Kapitel prüfen.

### Vorhandene Muster

- Kapitelcontainer: `lesson-article`
- Aufklappbarer Abschnitt: `details.rib-section`
- Kapitelüberschrift: `chapter-heading`
- Lesetext: `lesson-prose script-copy`
- Vergleich: `pulmo-compare`
- Risiko- oder Faktenkarten: `pulmo-risk-grid`
- cABCDE- und Ablaufkarten: `pulmo-care-grid`
- VFA-Ablauf: `pulmo-vfa-flow`
- Symptom-/Befundkarten: `rib-fracture-grid`
- Material: `material-chips`
- Differenzialdiagnosen: `differential-grid`
- Anamnese: `samplers-grid`
- Warnhinweise: `red-flags` oder `diagnostic-boundary`
- Zweispaltige Inhalte: `reading-columns`
- Medikamentenanzeige: `MedicationPreparation`

Viele dieser Klassen werden über `rippenfraktur-lesson` mitgestaltet. Fehlt diese Klasse bei einem ähnlich aufgebauten Kapitel, wirken Raster und Schrift unfertig. Neue Spezialklassen nur anlegen, wenn die bestehenden Muster den Inhalt nicht sinnvoll abbilden.

### Typografie und Layout

- Schriftgröße und Überschriftenhierarchie an vorhandenen fertigen Kapiteln ausrichten.
- Keine übervollen Karten oder extrem langen Absätze.
- Auf Desktop vorzugsweise zwei Spalten, auf Mobilgeräten automatisch eine Spalte.
- Texte dürfen weder aus Karten herauslaufen noch abgeschnitten werden.
- Interaktive Elemente benötigen mindestens 44 Pixel große Berührungsflächen.
- Das schwebende mobile/iPad-Menü muss sichtbar und schließbar bleiben.
- Kapitel öffnen immer am Seitenanfang.
- Jede Änderung auch auf schmaler Breite und iPad-Breite prüfen.

## Bilder und VFA-Abbildungen

- Bilder unter `public/lessons/<thema>/` speichern.
- Abbildungen aus Nutzerunterlagen nur im vorgesehenen fachlichen Zusammenhang nutzen.
- Keine Bildteile abschneiden. Standardmäßig `object-fit: contain` und automatische Höhe verwenden.
- Bilder vollständig, scharf und anklickbar im Vollbild darstellen.
- VFA-Seiten und Anlagen einzeln ein- und ausklappbar machen.
- Große VFA-Seiten ausreichend hochauflösend rendern.
- Bei B2A/B2B-Anlagen nur den benötigten Medikamentenbereich zuschneiden, ohne Tabelleninhalte abzuschneiden.
- Keine KI-generierte medizinische Grafik als Ersatz für eine verbindliche VFA verwenden.

## Karteikarten

- Nicht nur einfache Begriffsabfragen erstellen.
- Zusammenhänge, Pathophysiologie, Prioritäten und Einsatzentscheidungen abfragen.
- Antworten müssen fachlich vollständig, aber lernbar bleiben.
- VFA-Kriterien und relevante Zubereitungen einbeziehen.
- Die Karteikarten werden gesammelt am Kapitelende angeboten.

## Multiple-Choice-Regeln

- Ausschließlich als **Multiple Choice** kennzeichnen, wenn mehrere Antworten richtig sein können.
- Pro Frage genau eine klare Fragestellung und in der Regel fünf Antwortmöglichkeiten.
- Mehrere richtige Antworten müssen unterschiedliche Aussagen enthalten. Keine zwei sinngleichen richtigen Antworten.
- Distraktoren sollen plausibel und eng abgrenzbar sein.
- Die längste Antwort darf nicht systematisch die richtige sein.
- Keine Formulierung wie „Was sagt das Skript?“ oder nur „laut VFA Nummer 07“.
- Stattdessen die klinische Situation oder den VFA-Titel nennen, zum Beispiel „bei starken Schmerzzuständen“.
- Fragen sollen Anwendung, Priorisierung, Differenzialdiagnosen und Prüfungsfallen verlangen.
- Fragen immer direkt zum medizinischen Inhalt stellen. In der Fragestellung niemals Formulierungen wie „laut Aufzeichnung“, „nach Skript“, „nach Notfallguru“ oder ähnliche Quellenverweise verwenden; Quellen gehören ausschließlich in Erklärung und Quellenhinweis.
- Auch VFA-Indikationen, Kontraindikationen, Wirkungskontrolle und Re-Evaluation abfragen.
- Reihenfolge von Fragen und Antworten beim Neustart mischen.
- Richtig/falsch nach Abgabe deutlich grün beziehungsweise rot anzeigen.

### Fortschrittslogik

- Erste richtige Antwort: 33 Prozent.
- Zweite richtige Antwort: 67 Prozent.
- Dritte richtige Antwort: 100 Prozent beziehungsweise sicher.
- Eine falsche Antwort setzt nur die betroffene Frage auf 0 Prozent zurück.
- Im Fortschritt erscheinen nur begonnene Themen.
- Dort können einmal richtige und falsche Antworten gezielt wiederholt werden.
- MC-Ergebnisse aus einem Kapitel müssen in Statistik und Supabase-Lernstand einfließen.

## Technische Struktur

- Framework: Next.js 16, React 19, TypeScript
- Node.js: mindestens 22.13.0
- Zentrale Oberfläche und Integration: `app/page.tsx`
- Globale Gestaltung: `app/globals.css`
- Eigenständige Lektionen: `app/<thema>-lesson.tsx`
- Fragen und Karteikarten: `app/<thema>-data.ts`
- Medikamentenübersicht: `app/medication-preparation.tsx`
- Konto/Freigabe: `app/account-access.tsx`
- Profilbild/E-Mail: `app/account-profile-settings.tsx`
- Supabase-Client: `app/lib/supabaseClient.ts`
- Lernstand-Synchronisierung: `app/lib/learningProgress.ts`
- Bilder: `public/lessons/<thema>/`
- Supabase-Migrationen: `supabase/migrations/`

## Checkliste zum Einbinden eines neuen mündlichen Themas

1. Bestehende ähnliche Lektion und zugehörige Datendatei prüfen.
2. `app/<thema>-lesson.tsx` erstellen.
3. `app/<thema>-data.ts` mit Karteikarten und Multiple-Choice-Fragen erstellen.
4. Lektion und Daten in `app/page.tsx` importieren.
5. `TrainingTopic` um den Schlüssel erweitern.
6. Themennummer in `READY_TOPIC_NUMBERS` ergänzen.
7. Verfügbarkeits- und VFA-Label in der Themenübersicht ergänzen.
8. Im `TopicReader` die richtige Themennummer beziehungsweise den nullbasierten Index zuordnen.
9. Kapitelabschluss und Studienauswahl mit der tatsächlichen Anzahl von Fragen/Karten einbauen.
10. Fragenbank in `totalQuestionCount` ergänzen.
11. Kapitel in `oralTrainingChapters` und `questionCounts` ergänzen.
12. Fragenbank in `QuizTraining` und den vollständigen Fragenpool integrieren.
13. Kapitel im `ProgressView` ergänzen.
14. Falls Medikamente vorkommen, Zuordnung in `app/medication-preparation.tsx` ergänzen.
15. Bilder und VFA-Abbildungen prüfen.
16. Desktop-, iPad- und Mobilansicht prüfen.
17. Produktions-Build durchführen.

Wenn einer dieser Punkte fehlt, kann das Kapitel zwar lesbar sein, aber im MC-Training, Fortschritt oder Dashboard fehlen.

## Konten und Supabase

Das verwendete Projekt ist ausschließlich das Supabase-Projekt **NotSanPrüfung**. Das Fotografie-Projekt darf nicht verwendet werden.

- Projekt-ID: `uxiimrwnhcgpggqswmpz`
- Öffentliche Konfiguration nur über:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Niemals `service_role`, Secret-Key oder private Zugangsdaten in Client-Code oder Git schreiben.
- Neue Nutzer stellen eine Freigabeanfrage.
- Felix prüft `public.access_requests` im Supabase-Dashboard.
- Konten werden anschließend über Supabase Authentication eingeladen.
- Lernfortschritt, abgeschlossene Kapitel, Fragenstände und Medikamentenrechnen werden nutzerbezogen synchronisiert.
- Lokaler Fortschritt bleibt als Ausfallsicherung erhalten.
- Passwort-Zurücksetzen, E-Mail-Änderung und Profilbild sind Bestandteil des Kontobereichs.

Weitere Einrichtungshinweise stehen in `supabase/README.md`.

## Git-Arbeitsablauf

`AGENTS.md` ist verbindlich und hat Vorrang. Vor jeder Dateiänderung:

```bash
git status --short --branch
git fetch --prune origin
git rev-parse --short origin/main
git rev-parse --short origin/Dustin
```

Nur wenn lokaler `main` vollständig sauber ist:

```bash
git pull --ff-only origin main
```

### Niemals automatisch

- ungesicherte Änderungen überschreiben,
- fremde Änderungen löschen,
- Änderungen stashen,
- `git reset --hard` verwenden,
- divergierende Branches mergen oder rebasen,
- `origin/Dustin` ungeprüft nach `main` übernehmen.

Felix ist Host und gibt Produktionsänderungen frei. Dustin arbeitet normalerweise über eigene Branches und Pull Requests. Ein Merge nach `main` löst den Vercel-Deploy aus.

## Starten und Prüfen

```bash
npm ci
npm run dev -- --port 3002
npm run build:vercel
npm run build
npm test
```

Mindestens `npm run build:vercel` muss vor der Übergabe erfolgreich sein. Danach die betroffene Seite im Browser kontrollieren. Bei Inhalts- oder Layoutänderungen zusätzlich schmale Mobilansicht und iPad-Breite prüfen.

## Veröffentlichung

- Produktion: https://nfs-pr-fung.vercel.app/
- Alternative Sites-Version: https://notsan-pruefung.kk2vvvgxsh.chatgpt.site/
- GitHub `main` ist die Grundlage der Vercel-Produktion.
- Ein erfolgreicher lokaler Build allein bedeutet noch nicht, dass die Änderung online ist.
- Nach dem Push Vercel-Deployment und Produktionsseite kontrollieren.

## Aktueller lokaler Arbeitsstand

Wichtig: Diesen Abschnitt vor jeder Weiterarbeit neu prüfen.

- Lokaler Branch: `main`
- Lokaler Commit: `ed26bc4`
- `origin/main`: `77c354d`
- `origin/Dustin`: `77c354d`
- Lokaler `main` liegt zwei Commits hinter dem gemeinsamen Remote-Stand.
- Das Arbeitsverzeichnis ist **nicht sauber**.
- Ungesicherte lokale Arbeit darf nicht überschrieben oder verworfen werden.

### Noch ungesicherte Polytrauma-Arbeit

- `app/polytrauma-lesson.tsx` neu
- `app/polytrauma-data.ts` neu
- `public/lessons/polytrauma/` neu
- `app/page.tsx` geändert
- `app/medication-preparation.tsx` geändert

Das lokale Polytrauma-Kapitel enthält derzeit:

- vollständige Kapitelstruktur,
- Schockformen,
- schnelle Traumauntersuchung,
- Pneumothorax-vs.-Spannungspneumothorax,
- Punktionsorte nach VFA 07,
- Beckenschlinge,
- Traumaalgorithmus,
- Tranexamsäure,
- Esketamin und Morphin,
- typische Prüfungsfallen,
- 31 schwere Multiple-Choice-Fragen,
- 19 Karteikarten,
- VFA- und B2A/B2B-Abbildungen,
- Medikamentenanzeige.

`npm run build:vercel` war mit diesem lokalen Polytrauma-Stand erfolgreich. Die Darstellung wurde im Browser kontrolliert. Dieser Stand ist jedoch noch nicht mit der neuen Remote-iPad-Änderung in `origin/main` zusammengeführt und noch nicht gepusht.

### Konsequenz für die nächste KI

1. Nichts pullen, mergen, rebasen, stashen oder zurücksetzen.
2. Zuerst den Nutzer auf den unsauberen und zurückliegenden lokalen Branch hinweisen.
3. Die Remote-Änderungen an `app/page.tsx` und `app/globals.css` gegen die lokalen Polytrauma-Änderungen prüfen.
4. Nur mit ausdrücklicher Freigabe kontrolliert zusammenführen.
5. Danach Build, Browser und mobile Darstellung erneut prüfen.

## Fertig-Definition

Eine Aufgabe gilt erst als abgeschlossen, wenn:

- Nutzerauftrag und Quellen vollständig umgesetzt sind,
- keine nicht autorisierten Dosierungen oder Maßnahmen enthalten sind,
- Design und Schriftbild zu den anderen Kapiteln passen,
- Bilder vollständig und scharf angezeigt werden,
- Karteikarten und Multiple-Choice-Fragen funktionieren,
- Fragenzähler, Fortschritt und Statistik stimmen,
- Supabase-Synchronisierung nicht beschädigt wurde,
- Desktop, iPad und Mobilansicht funktionieren,
- `git diff --check` sauber ist,
- der Produktions-Build erfolgreich ist,
- der Git-Stand keine fremde Arbeit überschreibt,
- nach einer Freigabe der Vercel-Deploy kontrolliert wurde.
