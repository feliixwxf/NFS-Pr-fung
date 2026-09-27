"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { getSupabaseClient } from "./lib/supabaseClient";

const AVATAR_BUCKET = "profile-images";
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function loadAccountAvatarUrl(userId: string) {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data: profile, error } = await client
    .from("user_profiles")
    .select("avatar_path")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !profile?.avatar_path) return null;
  const { data, error: signedUrlError } = await client.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(profile.avatar_path, 60 * 60);
  return signedUrlError ? null : data.signedUrl;
}

type AccountProfileSettingsProps = {
  userId: string;
  email: string;
  onAvatarChange: (url: string | null) => void;
};

export default function AccountProfileSettings({ userId, email, onAvatarChange }: AccountProfileSettingsProps) {
  const [newEmail, setNewEmail] = useState(email);
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState("");

  const changeEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = newEmail.trim().toLowerCase();
    if (!normalizedEmail || normalizedEmail === email.toLowerCase()) {
      setEmailMessage(normalizedEmail ? "Diese E-Mail-Adresse ist bereits hinterlegt." : "Bitte gib eine E-Mail-Adresse ein.");
      return;
    }
    const client = getSupabaseClient();
    if (!client) {
      setEmailMessage("Die Kontofunktion ist momentan nicht verfügbar.");
      return;
    }
    setEmailBusy(true);
    setEmailMessage("");
    try {
      const { error } = await client.auth.updateUser(
        { email: normalizedEmail },
        { emailRedirectTo: new URL("/", window.location.origin).toString() },
      );
      if (error) throw error;
      setEmailMessage("Bestätigungslink gesendet. Prüfe die bisherige und die neue E-Mail-Adresse.");
    } catch {
      setEmailMessage("Die E-Mail-Adresse konnte nicht geändert werden. Bitte prüfe die Eingabe.");
    } finally {
      setEmailBusy(false);
    }
  };

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ACCEPTED_AVATAR_TYPES.has(file.type)) {
      setAvatarMessage("Bitte wähle ein JPG-, PNG- oder WebP-Bild.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarMessage("Das Profilbild darf höchstens 2 MB groß sein.");
      return;
    }
    const client = getSupabaseClient();
    if (!client) {
      setAvatarMessage("Die Kontofunktion ist momentan nicht verfügbar.");
      return;
    }
    setAvatarBusy(true);
    setAvatarMessage("");
    let uploadedPath: string | null = null;
    try {
      const { data: previousProfile } = await client
        .from("user_profiles")
        .select("avatar_path")
        .eq("user_id", userId)
        .maybeSingle();
      const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      uploadedPath = `${userId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await client.storage.from(AVATAR_BUCKET).upload(uploadedPath, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });
      if (uploadError) throw uploadError;
      const { data: signedUrl, error: signedUrlError } = await client.storage
        .from(AVATAR_BUCKET)
        .createSignedUrl(uploadedPath, 60 * 60);
      if (signedUrlError) throw signedUrlError;
      const { error: profileError } = await client.from("user_profiles").upsert({
        user_id: userId,
        avatar_path: uploadedPath,
        updated_at: new Date().toISOString(),
      });
      if (profileError) throw profileError;
      onAvatarChange(signedUrl.signedUrl);
      setAvatarMessage("Profilbild gespeichert.");
      if (previousProfile?.avatar_path && previousProfile.avatar_path !== uploadedPath) {
        await client.storage.from(AVATAR_BUCKET).remove([previousProfile.avatar_path]);
      }
    } catch {
      if (uploadedPath) await client.storage.from(AVATAR_BUCKET).remove([uploadedPath]);
      setAvatarMessage("Das Profilbild konnte nicht gespeichert werden. Bitte versuche es erneut.");
    } finally {
      setAvatarBusy(false);
    }
  };

  return (
    <div className="account-profile-settings">
      <section>
        <div><b>Profilbild</b><small>JPG, PNG oder WebP · maximal 2 MB</small></div>
        <label className="avatar-upload-button">
          {avatarBusy ? "Wird gespeichert …" : "Bild auswählen"}
          <input type="file" accept="image/jpeg,image/png,image/webp" disabled={avatarBusy} onChange={(event) => void uploadAvatar(event)} />
        </label>
        {avatarMessage && <p className="account-setting-message" role="status">{avatarMessage}</p>}
      </section>
      <form onSubmit={changeEmail}>
        <label htmlFor="account-email">E-Mail-Adresse ändern</label>
        <div className="account-email-row">
          <input id="account-email" type="email" autoComplete="email" required value={newEmail} onChange={(event) => { setNewEmail(event.target.value); setEmailMessage(""); }} />
          <button type="submit" disabled={emailBusy}>{emailBusy ? "…" : "Ändern"}</button>
        </div>
        {emailMessage && <p className="account-setting-message" role="status">{emailMessage}</p>}
      </form>
    </div>
  );
}
