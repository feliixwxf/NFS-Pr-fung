# NotSan-Prüfung: Konten und Lernstand

Dieses Verzeichnis gehört ausschließlich zum Supabase-Projekt `uxiimrwnhcgpggqswmpz` (NotSanPrüfung). Das Fotografie-Projekt wird nicht verwendet.

## Einmalige Einrichtung

1. Im SQL Editor dieses Projekts zuerst `migrations/202609270001_learning_accounts.sql` und danach `migrations/202609270002_account_profiles.sql` ausführen. Sie legen Freigabeanfragen, nutzergebundenen Lernfortschritt sowie private Profilbilder mit Row Level Security an.
2. Unter **Authentication → Sign In / Providers** „Allow new users to sign up“ ausschalten. Die Website bietet selbst keine öffentliche Registrierung an; diese Einstellung sperrt zusätzlich direkte API-Registrierungen.
3. Unter **Authentication → URL Configuration** als Site URL die produktive NotSan-Adresse eintragen und als Redirect URLs sowohl diese Adresse als auch die benötigten lokalen Entwicklungsadressen freigeben. Nur so funktionieren Einladungs- und Passwort-Zurücksetzen-Links an der richtigen Website.
4. Bei Vercel im **NotSan-Projekt** `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` setzen. Lokal liegen sie in der ignorierten `.env.local`. Niemals einen `service_role`- oder Secret-Key im Browser verwenden.

## Freigabe durch Felix

Anfragen stehen im Table Editor unter `public.access_requests` (`status = pending`). Felix prüft E-Mail und Nachricht und sendet unter **Authentication → Users → Add user → Send invitation** die Einladung. Danach setzt er den Status der Anfrage im Table Editor auf `approved`; abgelehnte Anfragen auf `declined`. Erst die Einladung erstellt einen nutzbaren Auth-Zugang. Die Website legt bei einer Anfrage kein Konto an.

Bei erster Kontoanmeldung wird ein vorhandener lokaler Lernstand einmalig übernommen, aber nicht aus dem Browser gelöscht. Danach werden Fragen, abgeschlossene Kapitel und Medikamentenrechnen nutzergetrennt gespeichert und synchronisiert. Ein Synchronisierungsfehler wird im Profil angezeigt; der lokale Kontostand bleibt erhalten.

Hinweis: Die öffentliche Anfrage ist eine Insert-only-Tabelle und hat bewusst keine Leserechte für Besucher. Für stärkeren Spam-Schutz vor öffentlichem Betrieb sollte Supabase-CAPTCHA oder ein serverseitiges Rate-Limit ergänzt werden.
