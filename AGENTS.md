# Gemeinsamer Git-Arbeitsablauf

Diese Regeln gelten fuer jede Codex-Aufgabe in diesem Repository.

## Vor jeder Dateiänderung

1. Zuerst `git status --short --branch` ausfuehren.
2. Danach immer `git fetch --prune origin` ausfuehren, damit Aenderungen von Felix und Dustin erkannt werden.
3. Den aktuellen Stand von `origin/main` und `origin/Dustin` pruefen.
4. Wenn der lokale Branch `main` ausgecheckt und das Arbeitsverzeichnis vollstaendig sauber ist, `git pull --ff-only origin main` ausfuehren.
5. Erst nach dieser Synchronisierung Dateien bearbeiten.

## Sicherheitsregeln

- Lokale, noch nicht gesicherte Aenderungen niemals ueberschreiben, verwerfen, stashen oder automatisch committen.
- Bei einem unsauberen Arbeitsverzeichnis nur `fetch` ausfuehren und vor einer Integration auf den Konflikt hinweisen.
- Bei auseinander gelaufenen Branches keinen automatischen Merge und keinen Rebase ausfuehren.
- Aenderungen aus `origin/Dustin`, die noch nicht in `origin/main` enthalten sind, deutlich melden. Sie nicht ungeprueft in `main` integrieren.
- Ausschliesslich Fast-Forward-Aktualisierungen automatisch uebernehmen.

Damit prueft Codex vor jeder Bearbeitung automatisch den gemeinsamen GitHub-Stand und uebernimmt bereits nach `main` freigegebene Aenderungen, ohne lokale Arbeit zu gefaehrden.
