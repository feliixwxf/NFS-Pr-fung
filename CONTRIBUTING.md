# Gemeinsam an NotSan Prüfung arbeiten

## Rollen

- **Felix (`@feliixwxf`)** ist Host und gibt Änderungen für `main` frei.
- **Dustin (`@iTz-vSweazy`)** arbeitet in eigenen Branches und eröffnet Pull Requests.

## Ablauf für jede Änderung

1. Vor Arbeitsbeginn den aktuellen Stand holen:

   ```bash
   git switch main
   git pull origin main
   ```

2. Einen neuen, eindeutig benannten Branch erstellen:

   ```bash
   git switch -c dustin/kurze-beschreibung
   ```

   Felix verwendet entsprechend `felix/kurze-beschreibung`.

3. Änderungen vornehmen und die Website lokal prüfen.

4. Beide Builds ausführen:

   ```bash
   npm run build:vercel
   npm run build
   ```

5. Änderungen speichern und hochladen:

   ```bash
   git add .
   git commit -m "Kurze Beschreibung der Änderung"
   git push -u origin dustin/kurze-beschreibung
   ```

6. Auf GitHub einen Pull Request nach `main` eröffnen. Felix prüft Inhalt,
   Darstellung und fachliche Richtigkeit und führt ihn anschließend zusammen.

## Damit ihr euch nicht überschreibt

- Nicht direkt auf `main` arbeiten.
- Pro Aufgabe einen eigenen Branch verwenden.
- Vor Arbeitsbeginn kurz absprechen, wer welches Kapitel oder welche Datei
  bearbeitet.
- Große PDF- und Bilddateien nicht gleichzeitig ersetzen.
- Wenn GitHub einen Konflikt meldet, nicht raten: erst den aktuellen Stand
  holen und den Konflikt gemeinsam prüfen.

## Medizinische Inhalte

- Nur bereitgestellte Skripte, PDFs und ausdrücklich freigegebene Quellen
  verwenden.
- Keine frei erfundenen Ergänzungen oder stillen inhaltlichen Änderungen.
- Im Pull Request Quelle, Dokument und betroffenen Abschnitt angeben.
- Thüringer Verfahrensanweisungen haben bei Maßnahmen, Medikamenten und
  Dosierungen Vorrang.
- Bilder nur in dem Zusammenhang einsetzen, in dem sie im Ausgangsmaterial
  stehen.

## Veröffentlichung

Ein zusammengeführter Pull Request auf `main` startet automatisch die
Vercel-Veröffentlichung. Änderungen gelten erst als fertig, wenn die Prüfung
erfolgreich ist und die Produktionsseite kontrolliert wurde.
