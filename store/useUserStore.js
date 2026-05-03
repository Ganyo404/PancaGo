import { create } from 'zustand';

// Hitung level berdasarkan total poin (setiap 500 poin = 1 level)
function calcLevel(points) {
  return Math.max(1, Math.floor(points / 500) + 1);
}

const defaultState = {
  name: 'Petualang',
  points: 0,
  level: 1,
  streak: 0,
  quizDoneToday: false,
  equippedCharId: 'asih',
  ownedCharIds: ['asih'],
};

/**
 * useUserStore
 * State lokal untuk data user yang sedang login.
 * Data di-load dari Supabase (via useAuthStore.profile) saat login,
 * dan setiap perubahan di-sync ke Supabase.
 */
export const useUserStore = create((set, get) => ({
  ...defaultState,
  isLoaded: false,

  // ── Load dari profil Supabase ──────────────────────────────────────────────
  loadFromProfile: (profile) => {
    if (!profile) return;
    set({
      name: profile.username || 'Petualang',
      points: profile.points ?? 0,
      level: profile.level ?? 1,
      streak: profile.streak ?? 0,
      equippedCharId: profile.equipped_char_id ?? 'asih',
      ownedCharIds: profile.owned_char_ids ?? ['asih'],
      quizDoneToday: false,
      isLoaded: true,
    });
  },

  // ── Reset ke default (saat logout) ────────────────────────────────────────
  resetUser: () => {
    set({ ...defaultState, isLoaded: false });
  },

  // ── Tambah poin (setelah quiz berhasil) ────────────────────────────────────
  // Mengembalikan { points, level } baru untuk di-sync ke Supabase
  addPoints: (amount) => {
    let result = {};
    set((state) => {
      const newPoints = state.points + amount;
      const newLevel = calcLevel(newPoints);
      result = { points: newPoints, level: newLevel };
      return { ...state, points: newPoints, level: newLevel, quizDoneToday: true };
    });
    return result;
  },

  // ── Catat jawaban quiz (tambah streak jika benar, reset jika salah) ─────────
  // Mengembalikan streak baru untuk di-sync ke Supabase
  recordAnswer: (isCorrect) => {
    let newStreak = 0;
    set((state) => {
      newStreak = isCorrect ? state.streak + 1 : 0;
      return { ...state, streak: newStreak };
    });
    return newStreak;
  },

  // ── Kurangi poin (saat beli karakter) ──────────────────────────────────────
  spendPoints: (amount) => {
    const { points } = get();
    if (points < amount) return false;
    set((state) => ({ ...state, points: state.points - amount }));
    return true;
  },

  // ── Beli dan pasang karakter ────────────────────────────────────────────────
  // Mengembalikan { success, ownedCharIds, equippedCharId, points } untuk sync
  buyCharacter: (charId, cost) => {
    const { ownedCharIds } = get();
    if (ownedCharIds.includes(charId)) {
      set((state) => ({ ...state, equippedCharId: charId }));
      return { success: true, equippedCharId: charId, ownedCharIds, points: get().points };
    }
    const success = get().spendPoints(cost);
    if (success) {
      const newOwned = [...ownedCharIds, charId];
      set((state) => ({
        ...state,
        ownedCharIds: newOwned,
        equippedCharId: charId,
      }));
      return {
        success: true,
        equippedCharId: charId,
        ownedCharIds: newOwned,
        points: get().points,
      };
    }
    return { success: false };
  },

  // ── Equip karakter ─────────────────────────────────────────────────────────
  equipCharacter: (charId) => {
    set((state) => ({ ...state, equippedCharId: charId }));
  },
}));
