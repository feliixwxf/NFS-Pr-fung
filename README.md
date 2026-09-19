# NotSan Prüfung

Gemeinsame Lernplattform zur Vorbereitung auf das NotSan-Staatsexamen in
Thüringen.

## Team

| Person | GitHub | Aufgabe |
| --- | --- | --- |
| Felix | [@feliixwxf](https://github.com/feliixwxf) | Host, fachliche Freigabe und Veröffentlichung |
| Dustin | [@iTz-vSweazy](https://github.com/iTz-vSweazy) | Mitarbeit an Inhalten und Funktionen |

Felix gibt Änderungen für die Produktionsseite frei. Dustin arbeitet in einem
eigenen Branch und reicht seine Änderungen als Pull Request ein. So bleibt
`main` jederzeit eine funktionsfähige und veröffentlichbare Version.

## Seiten

- Produktion: <https://nfs-pr-fung.vercel.app/>
- Alternative Sites-Version: <https://notsan-pruefung.kk2vvvgxsh.chatgpt.site/>

## Lokal starten

Voraussetzung ist Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
```

## Vor einer Freigabe prüfen

```bash
npm run build:vercel
npm run build
```

Der genaue gemeinsame Ablauf steht in [CONTRIBUTING.md](CONTRIBUTING.md).

## Wichtige Inhaltsregel

Medizinische Lerninhalte werden ausschließlich aus den von Felix
bereitgestellten Unterlagen und ausdrücklich freigegebenen Quellen übernommen.
Dosierungen, Verfahrensanweisungen und Behandlungsvorgaben dürfen nicht frei
ergänzt oder aus anderen Regionen übertragen werden.
