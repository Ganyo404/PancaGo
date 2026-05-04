/**
 * supabase.web.js — Web (SPA mode, browser only)
 * Expo Router otomatis pakai file ini saat platform = web.
 *
 * Strategi pembacaan env sama dengan supabase.js:
 * 1. expo-constants (app.json extra)
 * 2. process.env EXPO_PUBLIC_* (local dev)
 */

import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// ── Baca config dengan fallback chain ────────────────────────────────────────
const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl ||
  Constants.manifest?.extra?.supabaseUrl ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  '';

const supabaseAnonKey =
  Constants.expoConfig?.extra?.supabaseAnonKey ||
  Constants.manifest?.extra?.supabaseAnonKey ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  '';

// ── Validation ────────────────────────────────────────────────────────────────
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[Supabase Web] KONFIGURASI TIDAK LENGKAP! ' +
    'Pastikan app.json extra.supabaseUrl dan extra.supabaseAnonKey sudah diisi.'
  );
}

// ── Bersihkan sesi lama jika URL berubah ─────────────────────────────────────
if (typeof window !== 'undefined') {
  const STORED_URL_KEY = 'pancago_supabase_url';
  const storedUrl = window.localStorage.getItem(STORED_URL_KEY);
  if (storedUrl && storedUrl !== supabaseUrl) {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith('sb-') || k.startsWith('supabase.auth'))
      .forEach((k) => window.localStorage.removeItem(k));
  }
  if (supabaseUrl) window.localStorage.setItem(STORED_URL_KEY, supabaseUrl);
}

// ── localStorage adapter ──────────────────────────────────────────────────────
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
