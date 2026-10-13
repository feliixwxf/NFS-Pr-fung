import { getSupabaseClient } from "./supabaseClient";

const GUEST_KEY = "notsan-tutor-weak-entries";

function readLocal() {
  if (typeof window === "undefined") return [] as string[];
  try {
    const value = JSON.parse(window.localStorage.getItem(GUEST_KEY) || "[]");
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch { return []; }
}

export function saveLocalTutorWeaknesses(ids: readonly string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUEST_KEY, JSON.stringify([...new Set(ids)]));
}

export async function syncTutorWeaknesses(userId: string) {
  const supabase = getSupabaseClient();
  const local = readLocal();
  if (!supabase) return local;
  const { data, error } = await supabase.from("learning_tutor_weaknesses").select("entry_id").eq("user_id", userId);
  if (error) throw error;
  const merged = [...new Set([...local, ...(data || []).map((row) => String(row.entry_id))])];
  if (merged.length) {
    const updatedAt = new Date().toISOString();
    const { error: writeError } = await supabase.from("learning_tutor_weaknesses").upsert(
      merged.map((entryId) => ({ user_id: userId, entry_id: entryId, score: 0, updated_at: updatedAt })),
      { onConflict: "user_id,entry_id" },
    );
    if (writeError) throw writeError;
  }
  saveLocalTutorWeaknesses(merged);
  return merged;
}

export async function updateTutorWeakness(userId: string, entryId: string, score: number) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  if (score >= 4) {
    const { error } = await supabase.from("learning_tutor_weaknesses").delete().eq("user_id", userId).eq("entry_id", entryId);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("learning_tutor_weaknesses").upsert(
    { user_id: userId, entry_id: entryId, score, updated_at: new Date().toISOString() },
    { onConflict: "user_id,entry_id" },
  );
  if (error) throw error;
}
