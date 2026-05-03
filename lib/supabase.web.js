/**
 * supabase.web.js — Web (SPA mode, browser only)
 * Expo Router otomatis pakai file ini saat platform = web.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// ── Bersihkan semua sesi Supabase lama dari localStorage ─────────────────────
// Ini penting saat URL pernah berubah (misal dari /rest/v1/ ke base URL).
// Supabase menyimpan session token dengan key "sb-{projectRef}-auth-token".
if (typeof window !== 'undefined') {
  const keysToRemove = Object.keys(window.localStorage).filter(
    (k) => k.startsWith('sb-') || k.startsWith('supabase.auth')
  );
  keysToRemove.forEach((k) => window.localStorage.removeItem(k));
}

// localStorage adapter
const webStorage = {
  getItem:    (key)        => Promise.resolve(window.localStorage.getItem(key)),
  setItem:    (key, value) => { window.localStorage.setItem(key, value); return Promise.resolve(); },
  removeItem: (key)        => { window.localStorage.removeItem(key); return Promise.resolve(); },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: webStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
