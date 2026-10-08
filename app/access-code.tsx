"use client";

import { FormEvent, useState } from "react";

export default function AccessCode({ onDone }: { onDone: () => void }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/access-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Der Zugangscode konnte nicht geprüft werden.");
      setCode("");
      onDone();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Der Zugangscode konnte nicht geprüft werden.");
    } finally {
      setBusy(false);
    }
  };

  return <div className="access-code-login">
    <div className="access-code-divider"><span>oder</span></div>
    <form onSubmit={submit}>
      <h3>Mit Zugangscode öffnen</h3>
      <p>Für einen schnellen lokalen Zugang ohne synchronisiertes Lernkonto.</p>
      <label>Zugangscode<input required type="password" autoComplete="current-password" value={code} onChange={(event) => setCode(event.target.value)} /></label>
      <button type="submit" disabled={busy}>{busy ? "Code wird geprüft …" : "Lernbereich öffnen"}</button>
      {message && <p className="account-message" role="status">{message}</p>}
    </form>
  </div>;
}
