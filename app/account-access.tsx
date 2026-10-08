"use client";

import { FormEvent, useState } from "react";
import { getRememberSessionDefault, getSupabaseClient, setRememberSession } from "./lib/supabaseClient";

type Mode = "login" | "request" | "forgot" | "password";
type PasswordSetupKind = "invite" | "recovery";

export default function AccountAccess({ onDone, passwordSetupKind, showLoginHeading = true }: { onDone?: () => void; passwordSetupKind?: PasswordSetupKind; showLoginHeading?: boolean }) {
  const [mode, setMode] = useState<Mode>(passwordSetupKind ? "password" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberSession, setRememberSessionState] = useState(getRememberSessionDefault);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const client = getSupabaseClient();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    if (!client) { setMessage("Die Kontofunktion ist auf dieser Website noch nicht konfiguriert."); return; }
    if (honeypot) return;
    setBusy(true);
    try {
      if (mode === "login") {
        setRememberSession(rememberSession);
        const { error } = await client.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
        if (error) throw error;
        const { error: otherSessionsError } = await client.auth.signOut({ scope: "others" });
        setMessage(otherSessionsError ? "Angemeldet. Eine ältere Sitzung konnte nicht vollständig beendet werden." : "Angemeldet. Dein Lernstand wird geladen und ältere Sitzungen werden beendet.");
        onDone?.();
      } else if (mode === "request") {
        const { error } = await client.from("access_requests").insert({ email: email.trim().toLowerCase(), name: name.trim(), note: note.trim() });
        if (error && error.code !== "23505") throw error;
        setMessage("Anfrage gesendet. Felix prüft sie im Supabase-Dashboard und lädt dich danach per E-Mail ein.");
      } else if (mode === "forgot") {
        const redirectTo = new URL("/", window.location.origin);
        redirectTo.searchParams.set("password-reset", "1");
        const { error } = await client.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: redirectTo.toString() });
        if (error) throw error;
        setMessage("Falls für diese Adresse ein Konto besteht, erhältst du eine E-Mail. Öffne darin den Link, um ein neues Passwort festzulegen.");
      } else {
        if (password.length < 12) { setMessage("Bitte wähle mindestens 12 Zeichen."); return; }
        if (password !== passwordConfirmation) { setMessage("Die beiden Passwörter stimmen nicht überein."); return; }
        const { error } = await client.auth.updateUser({ password });
        if (error) throw error;
        setPassword("");
        setPasswordConfirmation("");
        setMessage(passwordSetupKind === "recovery" ? "Dein neues Passwort wurde gespeichert." : "Passwort gespeichert. Dein Konto ist bereit.");
        onDone?.();
      }
    } catch (error) {
      setMessage(mode === "login" ? "Anmeldung fehlgeschlagen. Prüfe E-Mail und Passwort oder nutze „Passwort vergessen“." : error instanceof Error ? error.message : "Die Anfrage konnte nicht verarbeitet werden.");
    } finally { setBusy(false); }
  };

  return <div className="account-access">
    {!passwordSetupKind && <div className="account-mode-tabs" role="group" aria-label="Kontofunktion">
      <button type="button" className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setMessage(""); }}>Anmelden</button>
      <button type="button" className={mode === "request" ? "active" : ""} onClick={() => { setMode("request"); setMessage(""); }}>Zugang anfragen</button>
    </div>}
    <form onSubmit={submit}>
      {(mode !== "login" || showLoginHeading) && <h3>{mode === "request" ? "Freigabe anfragen" : mode === "forgot" ? "Passwort zurücksetzen" : mode === "password" ? passwordSetupKind === "recovery" ? "Neues Passwort festlegen" : "Passwort festlegen" : "Mit Lernkonto anmelden"}</h3>}
      {mode === "request" && <><label>Name<input required minLength={2} maxLength={120} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></label><label className="account-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} /></label></>}
      {mode !== "password" && <label>E-Mail<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>}
      {(mode === "login" || mode === "password") && <label>{mode === "password" ? "Neues Passwort" : "Passwort"}<input required minLength={mode === "password" ? 12 : undefined} type="password" autoComplete={mode === "password" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} /></label>}
      {mode === "login" && <label className="account-remember"><input type="checkbox" checked={rememberSession} onChange={(event) => setRememberSessionState(event.target.checked)} /><span><b>Eingeloggt bleiben</b><small>Die Anmeldung bleibt auf diesem Gerät gespeichert. Eine neue Anmeldung auf einem anderen Gerät ersetzt die bisherige Sitzung.</small></span></label>}
      {mode === "password" && <label>Neues Passwort wiederholen<input required minLength={12} type="password" autoComplete="new-password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} /></label>}
      {mode === "request" && <label>Nachricht an Felix <small>(optional)</small><textarea maxLength={1000} value={note} onChange={(event) => setNote(event.target.value)} /></label>}
      <button type="submit" disabled={busy || !client}>{busy ? "Bitte warten …" : mode === "request" ? "Anfrage senden" : mode === "forgot" ? "Reset-Link anfordern" : mode === "password" ? "Neues Passwort speichern" : "Anmelden"}</button>
      {message && <p className="account-message" role="status">{message}</p>}
      {mode === "login" && <button className="account-text-button" type="button" onClick={() => { setMode("forgot"); setMessage(""); }}>Passwort vergessen?</button>}
      {mode === "forgot" && <button className="account-text-button" type="button" onClick={() => { setMode("login"); setMessage(""); }}>Zur Anmeldung</button>}
    </form>
  </div>;
}
