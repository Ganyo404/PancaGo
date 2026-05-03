import { create } from 'zustand';
import { supabase } from '../lib/supabase';

/**
 * useAuthStore
 * Menangani autentikasi (register, login, logout) via Supabase.
 * Data profil & progress disimpan di tabel `profiles` dan `user_progress`.
 */
export const useAuthStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  session: null,       // Supabase session object
  profile: null,       // Data dari tabel `profiles`
  isLoading: false,
  isLoaded: false,     // Sudah selesai cek sesi awal
  error: null,

  // ── Init: cek sesi yang tersimpan ──────────────────────────────────────────
  init: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const profile = await get()._fetchProfile(session.user.id);
        set({ session, profile, isLoaded: true });
      } else {
        set({ session: null, profile: null, isLoaded: true });
      }
    } catch (e) {
      set({ isLoaded: true, error: e.message });
    }

    // Dengarkan perubahan sesi (token refresh, logout dari device lain, dll)
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const profile = await get()._fetchProfile(session.user.id);
        set({ session, profile });
      } else {
        set({ session: null, profile: null });
      }
    });
  },

  // ── Register ───────────────────────────────────────────────────────────────
  // Flow: cek username → signUp → login otomatis → tunggu trigger → fetch profil
  register: async ({ username, email, password }) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Cek apakah username sudah dipakai
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username.trim())
        .maybeSingle();

      if (existing) {
        set({ isLoading: false, error: 'Username sudah digunakan, coba yang lain.' });
        return { success: false, error: 'Username sudah digunakan, coba yang lain.' };
      }

      // 2. Buat akun Supabase Auth
      // Trigger `on_auth_user_created` di DB otomatis insert ke
      // tabel `profiles` dan `user_progress` (SECURITY DEFINER, bypass RLS).
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { username: username.trim() },
        },
      });

      if (signUpError) throw signUpError;

      const userId = signUpData.user?.id;
      if (!userId) throw new Error('Gagal membuat akun.');

      // 3. Pastikan session aktif — kalau signUp tidak return session,
      //    login manual agar RLS bisa baca profil
      let session = signUpData.session;
      if (!session) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        session = signInData.session;
      }

      if (!session) throw new Error('Gagal mendapatkan sesi setelah registrasi.');

      // 4. Tunggu trigger DB selesai buat profil, lalu fetch (retry max 8x, jeda 500ms)
      let profile = null;
      for (let i = 0; i < 8; i++) {
        await new Promise((r) => setTimeout(r, 500));
        profile = await get()._fetchProfile(userId);
        if (profile) break;
      }

      // 5. Kalau trigger belum jalan / gagal, insert manual sebagai fallback
      if (!profile) {
        const { error: insertError } = await supabase.from('profiles').upsert({
          id: userId,
          username: username.trim(),
          email: email.trim(),
          points: 0,
          level: 1,
          streak: 0,
          equipped_char_id: 'asih',
          owned_char_ids: ['asih'],
        });
        if (!insertError) {
          await supabase.from('user_progress').upsert({ user_id: userId });
          profile = await get()._fetchProfile(userId);
        }
      }

      if (!profile) throw new Error('Gagal menyiapkan profil. Coba lagi.');

      set({ session, profile, isLoading: false });
      return { success: true };
    } catch (e) {
      const msg = e.message || 'Terjadi kesalahan saat mendaftar.';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  // ── Login dengan username + password ──────────────────────────────────────
  login: async ({ username, password }) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Cari email berdasarkan username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username.trim())
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profileData) {
        const msg = 'Username tidak ditemukan.';
        set({ isLoading: false, error: msg });
        return { success: false, error: msg };
      }

      // 2. Login dengan email + password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password,
      });

      if (signInError) {
        const msg = 'Password salah atau akun tidak valid.';
        set({ isLoading: false, error: msg });
        return { success: false, error: msg };
      }

      const profile = await get()._fetchProfile(data.user.id);
      set({ session: data.session, profile, isLoading: false });
      return { success: true };
    } catch (e) {
      const msg = e.message || 'Terjadi kesalahan saat login.';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  // ── Logout ─────────────────────────────────────────────────────────────────
  logout: async () => {
    await supabase.auth.signOut();
    // Import di sini untuk hindari circular dependency
    const quizStoreModule = require('../store/useQuizStore');
    const store = quizStoreModule.useQuizStore ?? quizStoreModule.default;
    if (store?.getState) store.getState().resetQuizCache();
    set({ session: null, profile: null, error: null });
  },

  // ── Update profil (poin, level, streak, karakter) ─────────────────────────
  updateProfile: async (updates) => {
    const { session } = get();
    if (!session) return;
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', session.user.id)
      .select()
      .single();
    if (!error && data) {
      set((state) => ({ profile: { ...state.profile, ...data } }));
    }
  },

  // ── Update progress (misi & quiz selesai) ─────────────────────────────────
  updateProgress: async (updates) => {
    const { session } = get();
    if (!session) return;
    await supabase
      .from('user_progress')
      .update(updates)
      .eq('user_id', session.user.id);
  },

  // ── Ambil progress dari Supabase ──────────────────────────────────────────
  fetchProgress: async () => {
    const { session } = get();
    if (!session) return null;
    const { data } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    return data;
  },

  // ── Helper internal: ambil profil dari DB ─────────────────────────────────
  _fetchProfile: async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data;
  },

  clearError: () => set({ error: null }),
}));
