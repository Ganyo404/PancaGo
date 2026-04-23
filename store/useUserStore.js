import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'pancago_user';

// Hitung level berdasarkan total poin (setiap 500 poin = 1 level)
function calcLevel(points) {
  return Math.max(1, Math.floor(points / 500) + 1);
}

// Hitung streak hari ini (sederhana: tambah setiap kali quiz selesai)
const defaultState = {
  name: 'Petualang',
  points: 0,
  level: 1,
  streak: 0,
  quizDoneToday: false,
  equippedCharId: 'asih', // Default character
  ownedCharIds: ['asih'],
  hasOnboarded: false,
};

export const useUserStore = create((set, get) => ({
  ...defaultState,
  isLoaded: false,

  // ─── Muat data dari penyimpanan ─────────────────────────────────────────────
  loadUser: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        set({ ...defaultState, ...saved, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch (_) {
      set({ isLoaded: true });
    }
  },

  // ─── Simpan state ke penyimpanan ────────────────────────────────────────────
  _save: async (nextState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (_) {}
  },

  // ─── Tambah poin (setelah quiz berhasil) ────────────────────────────────────
  addPoints: (amount) => {
    set((state) => {
      const newPoints = state.points + amount;
      const newLevel = calcLevel(newPoints);
      const next = {
        ...state,
        points: newPoints,
        level: newLevel,
        quizDoneToday: true,
        streak: state.quizDoneToday ? state.streak : state.streak + 1,
      };
      get()._save(next);
      return next;
    });
  },

  // ─── Kurangi poin (saat beli karakter) ──────────────────────────────────────
  spendPoints: (amount) => {
    const { points } = get();
    if (points < amount) return false; // tidak cukup poin
    set((state) => {
      const next = { ...state, points: state.points - amount };
      get()._save(next);
      return next;
    });
    return true;
  },

  // ─── Beli dan pasang karakter ────────────────────────────────────────────────
  buyCharacter: (charId, cost) => {
    const { ownedCharIds } = get();
    if (ownedCharIds.includes(charId)) {
      // Sudah punya, langsung equip
      set((state) => {
        const next = { ...state, equippedCharId: charId };
        get()._save(next);
        return next;
      });
      return true;
    }
    const success = get().spendPoints(cost);
    if (success) {
      set((state) => {
        const next = {
          ...state,
          ownedCharIds: [...state.ownedCharIds, charId],
          equippedCharId: charId,
        };
        get()._save(next);
        return next;
      });
    }
    return success;
  },

  // ─── Atur onboarding (nama & avatar pertama) ──────────────────────────────
  setOnboarded: (name, charId) => {
    set((state) => {
      const next = { 
        ...state, 
        name: name || 'Petualang',
        equippedCharId: charId,
        ownedCharIds: Array.from(new Set([...state.ownedCharIds, charId])),
        hasOnboarded: true 
      };
      get()._save(next);
      return next;
    });
  },

  // ─── Reset (untuk testing) ──────────────────────────────────────────────────
  resetUser: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ ...defaultState });
  },
}));
