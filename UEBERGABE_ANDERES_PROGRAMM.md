# Übergabe: NotSan Prüfung

## Auftrag

Dieses Repository enthält die Lernwebsite **„NotSan Prüfung“** für die Notfallsanitäter-Abschlussprüfung in Thüringen. Neue Inhalte sollen das bestehende Design und die vorhandene Lernlogik fortführen, ohne ältere Kapitel oder Nutzerdaten zu beschädigen.

## Technischer Stand

- Framework: Next.js 16, React 19 und TypeScript
- Zentrale Oberfläche und Kapitel: `app/page.tsx`
- Kapitelbezogene Fragen/Karteikarten: `app/*-data.ts`
- Bilder: `public/lessons/<thema>/`
- Lokaler Start: `npm run dev -- --port 3002`
- Prüfung: `npm run build` und `npm run build:vercel`
- Produktion: GitHub `main`, Vercel und ChatGPT Sites
- Aktueller geprüfter Commit: `05973a3` – Gallensteinkolik ergänzt

## Inhaltliche Regeln für neue mündliche Themen

1. Das vom Nutzer gelieferte Skript ist die Hauptquelle. Nichts frei hinzudichten.
2. Ergänzungen nur fachlich geprüft und rettungsdienstlich relevant einbauen.
3. Dosierungen, Medikamente und Maßnahmen nach den Thüringer VFA 2026/2027 übernehmen.
4. Kapitelstruktur: Definition; Anatomie/Physiologie; Pathophysiologie/Ursachen; Symptome und Arbeitsdiagnose; Komplikationen/Gefahren; Einsatzmaterial; Erstmaßnahmen mit cABCDE und SAMPLERS/OPQRST; Differenzialdiagnosen/Entscheidungsfindung; weitere Maßnahmen; passende VFA-Abbildungen.
5. Das Kapitel soll wie ein gut lesbarer Fließtext wirken. Abschnitte und Bilder müssen ein-/ausklappbar sein; Bilder vollständig, scharf und im Vollbild sichtbar.
6. Keine Formulierungen wie „das Skript sagt/nennt“. Der Text soll selbst wie die Lernunterlage klingen.
7. Am Kapitelende anspruchsvolle Karteikarten und schwere Multiple-Choice-Aufgaben auf Thüringer NotSan-Prüfungsniveau ergänzen.
8. Multiple Choice immer deutlich kennzeichnen. Richtige Antworten müssen unterschiedliche Inhalte abfragen; keine inhaltlichen Doppelungen. Distraktoren eng und plausibel formulieren. Die längste Antwort darf nicht automatisch richtig sein.
9. Fragen und Antwortmöglichkeiten werden beim Neustart gemischt. Ergebnisse fließen in Statistik und Fortschritt ein. Eine Frage gilt nach dreimal richtiger Beantwortung als sicher; bei einer falschen Antwort fällt sie wieder auf „falsch“ zurück.

## Bereits ausgearbeitete Bereiche

Unter anderem: Schlaganfall, ACS, Lungenarterienembolie, SHT, Thoraxtrauma, Abdominaltrauma, Hypoglykämie, Hyperventilation, Geburt/Neugeborenenversorgung, Hodentorsion, Nierensteinkolik, Gallensteinkolik und Rechtskunde.

## Git-Sicherheit

Vor jeder Änderung zwingend `AGENTS.md` beachten: Status prüfen, `git fetch --prune origin`, `origin/main` und `origin/Dustin` vergleichen und nur einen sauberen `main` per Fast-Forward aktualisieren. Uncommittete Änderungen niemals überschreiben, stashen oder verwerfen. Dustins Branch nicht ungeprüft mergen oder rebasen.

Aktueller Branchstand bei Übergabe: `main` ist sauber und entspricht `origin/main`. `origin/Dustin` ist abweichend und darf nicht automatisch integriert werden.

