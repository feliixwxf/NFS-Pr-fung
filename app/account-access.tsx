"use client";

import { FormEvent, useState } from "react";
import { getSupabaseClient } from "./lib/supabaseClient";

type Mode = "login" | "request" | "forgot" | "password";

export default function AccountAccess({ onDone, passwordSetup = false }: { onDone?: () => void; passwordSetup?: boolean }) {
  const [mode, setMode] = useState<Mode>(passwordSetup ? "password" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        const { error } = await client.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
        if (error) throw error;
        setMessage("Angemeldet. Dein Lernstand wird geladen.");
        onDone?.();
      } else if (mode === "request") {
        const { error } = await client.from("access_requests").insert({ email: email.trim().toLowerCase(), name: name.trim(), note: note.trim() });
        if (error && error.code !== "23505") throw error;
        setMessage("Anfrage gesendet. Felix prüft sie im Supabase-Dashboard und lädt dich danach per E-Mail ein.");
      } else if (mode === "forgot") {
        const { error } = await client.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: window.location.origin });
        if (error) throw error;
        setMessage("Falls für diese Adresse ein Konto besteht, erhältst du eine E-Mail zum Zurücksetzen.");
      } else {
        if (password.length < 12) { setMessage("Bitte wähle mindestens 12 Zeichen."); return; }
        const { error } = await client.auth.updateUser({ password });
        if (error) throw error;
        setPassword("");
        setMessage("Passwort gespeichert. Dein Konto ist bereit.");
        onDone?.();
      }
    } catch (error) {
      setMessage(mode === "login" ? "Anmeldung fehlgeschlagen. Prüfe E-Mail und Passwort oder nutze „Passwort vergessen“." : error instanceof Error ? error.message : "Die Anfrage konnte nicht verarbeitet werden.");
    } finally { setBusy(false); }
  };

  return <div className="account-access">
    <div className="account-mode-tabs" role="group" aria-label="Kontofunktion">
      <button type="button" className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setMessage(""); }}>Anmelden</button>
      <button type="button" className={mode === "request" ? "active" : ""} onClick={() => { setMode("request"); setMessage(""); }}>Zugang anfragen</button>
    </div>
    <form onSubmit={submit}>
      <h3>{mode === "request" ? "Freigabe anfragen" : mode === "forgot" ? "Passwort vergessen" : mode === "password" ? "Passwort festlegen" : "Mit Lernkonto anmelden"}</h3>
      {mode === "request" && <><label>Name<input required minLength={2} maxLength={120} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></label><label className="account-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} /></label></>}
      {mode !== "password" && <label>E-Mail<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>}
      {(mode === "login" || mode === "password") && <label>{mode === "password" ? "Neues Passwort" : "Passwort"}<input required minLength={mode === "password" ? 12 : undefined} type="password" autoComplete={mode === "password" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} /></label>}
      {mode === "request" && <label>Nachricht an Felix <small>(optional)</small><textarea maxLength={1000} value={note} onChange={(event) => setNote(event.target.value)} /></label>}
      <button type="submit" disabled={busy || !client}>{busy ? "Bitte warten …" : mode === "request" ? "Anfrage senden" : mode === "forgot" ? "Link anfordern" : mode === "password" ? "Passwort speichern" : "Anmelden"}</button>
      {message && <p className="account-message" role="status">{message}</p>}
      {mode === "login" && <button className="account-text-button" type="button" onClick={() => { setMode("forgot"); setMessage(""); }}>Passwort vergessen?</button>}
      {(mode === "forgot" || mode === "password") && <button className="account-text-button" type="button" onClick={() => { setMode("login"); setMessage(""); }}>Zur Anmeldung</button>}
    </form>
  </div>;
}
