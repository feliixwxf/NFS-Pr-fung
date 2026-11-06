import { getSupabaseClient } from "./supabaseClient";

export type TextHighlight = {
  id: string;
  pagePath: string;
  quote: string;
  prefix: string;
  suffix: string;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_PREFIX = "notsan-text-highlights-v1";

function storageKey(userId: string | null) {
  return `${STORAGE_PREFIX}:${userId || "guest"}`;
}

function isHighlight(value: unknown): value is TextHighlight {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<TextHighlight>;
  return typeof item.id === "string"
    && typeof item.pagePath === "string"
    && typeof item.quote === "string"
    && typeof item.prefix === "string"
    && typeof item.suffix === "string"
    && typeof item.createdAt === "string"
    && typeof item.updatedAt === "string";
}

export function readLocalTextHighlights(userId: string | null): TextHighlight[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey(userId)) || "[]");
    return Array.isArray(parsed) ? parsed.filter(isHighlight) : [];
  } catch {
    return [];
  }
}

function writeLocalTextHighlights(userId: string | null, highlights: readonly TextHighlight[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(userId), JSON.stringify(highlights));
}

function mergeHighlights(...sources: readonly TextHighlight[][]) {
  const merged = new Map<string, TextHighlight>();
  for (const source of sources) for (const highlight of source) {
    const previous = merged.get(highlight.id);
    if (!previous || previous.updatedAt <= highlight.updatedAt) merged.set(highlight.id, highlight);
  }
  return [...merged.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function syncTextHighlights(userId: string) {
  const local = readLocalTextHighlights(userId);
  const supabase = getSupabaseClient();
  if (!supabase) return local;
  const { data, error } = await supabase
    .from("learning_text_highlights")
    .select("highlight_id,page_path,quote,prefix,suffix,created_at,updated_at")
    .eq("user_id", userId);
  if (error) throw error;
  const remote: TextHighlight[] = (data || []).map((row) => ({
    id: String(row.highlight_id),
    pagePath: String(row.page_path),
    quote: String(row.quote),
    prefix: String(row.prefix || ""),
    suffix: String(row.suffix || ""),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }));
  const merged = mergeHighlights(local, remote);
  if (merged.length) {
    const { error: writeError } = await supabase.from("learning_text_highlights").upsert(
      merged.map((highlight) => ({
        user_id: userId,
        highlight_id: highlight.id,
        page_path: highlight.pagePath,
        quote: highlight.quote,
        prefix: highlight.prefix,
        suffix: highlight.suffix,
        created_at: highlight.createdAt,
        updated_at: highlight.updatedAt,
      })),
      { onConflict: "user_id,highlight_id" },
    );
    if (writeError) throw writeError;
  }
  writeLocalTextHighlights(userId, merged);
  return merged;
}

export async function saveTextHighlight(userId: string | null, highlight: TextHighlight) {
  const next = mergeHighlights(readLocalTextHighlights(userId), [highlight]);
  writeLocalTextHighlights(userId, next);
  if (!userId) return next;
  const supabase = getSupabaseClient();
  if (!supabase) return next;
  const { error } = await supabase.from("learning_text_highlights").upsert({
    user_id: userId,
    highlight_id: highlight.id,
    page_path: highlight.pagePath,
    quote: highlight.quote,
    prefix: highlight.prefix,
    suffix: highlight.suffix,
    created_at: highlight.createdAt,
    updated_at: highlight.updatedAt,
  }, { onConflict: "user_id,highlight_id" });
  if (error) throw error;
  return next;
}

export async function deleteTextHighlight(userId: string | null, highlightId: string) {
  const next = readLocalTextHighlights(userId).filter((highlight) => highlight.id !== highlightId);
  writeLocalTextHighlights(userId, next);
  if (!userId) return next;
  const supabase = getSupabaseClient();
  if (!supabase) return next;
  const { error } = await supabase
    .from("learning_text_highlights")
    .delete()
    .eq("user_id", userId)
    .eq("highlight_id", highlightId);
  if (error) throw error;
  return next;
}
