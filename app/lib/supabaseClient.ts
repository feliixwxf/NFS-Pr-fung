import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

const REMEMBER_SESSION_KEY = "notsan-remember-session";

const shouldRememberSession = () =>
  typeof window === "undefined" || window.sessionStorage.getItem(REMEMBER_SESSION_KEY) !== "false";

const authStorage = {
  getItem(key: string) {
    if (typeof window === "undefined") return null;
    return window.sessionStorage.getItem(key) ?? window.localStorage.getItem(key);
  },
  setItem(key: string, value: string) {
    if (typeof window === "undefined") return;
    if (shouldRememberSession()) {
      window.localStorage.setItem(key, value);
      window.sessionStorage.removeItem(key);
      return;
    }
    window.sessionStorage.setItem(key, value);
    window.localStorage.removeItem(key);
  },
  removeItem(key: string) {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  },
};

export function getRememberSessionDefault(): boolean {
  return shouldRememberSession();
}

export function setRememberSession(remember: boolean) {
  if (typeof window === "undefined") return;
  if (remember) {
    window.localStorage.setItem(REMEMBER_SESSION_KEY, "true");
    window.sessionStorage.removeItem(REMEMBER_SESSION_KEY);
    return;
  }
  window.localStorage.removeItem(REMEMBER_SESSION_KEY);
  window.sessionStorage.setItem(REMEMBER_SESSION_KEY, "false");
}

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  if (!browserClient) {
    browserClient = createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: authStorage,
      },
    });
  }
  return browserClient;
}
