/**
 * supabase.js — Native (iOS / Android)
 *
 * Strategi pembacaan env (urutan prioritas):
 * 1. expo-constants (app.json extra) — selalu tersedia di EAS Build & OTA
 * 2. process.env EXPO_PUBLIC_* — tersedia di local dev (Expo Go / Metro)
 *
 * Kenapa pakai expo-constants sebagai sumber utama:
 * - File .env TIDAK dibundle ke APK production oleh EAS Build cloud
 * - process.env.EXPO_PUBLIC_* hanya reliable di local Metro bundler
 * - expo-constants membaca dari app.json extra yang SELALU ikut di-bundle
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
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

// ── Validation — tampilkan error jelas, tidak crash silent ───────────────────
if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [];
  if (!supabaseUrl) missing.push('supabaseUrl');
  if (!supabaseAnonKey) missing.push('supabaseAnonKey');
  console.error(
    '[Supabase] KONFIGURASI TIDAK LENGKAP!\n' +
    'Field yang kosong: ' + missing.join(', ') + '\n' +
    'Pastikan app.json extra.supabaseUrl dan extra.supabaseAnonKey sudah diisi.'
  );
}

// ── Buat Supabase client ──────────────────────────────────────────────────────
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
