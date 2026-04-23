import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'pancago_progress';

// Data Sila — setiap sila punya threshold misi yang harus diselesaikan
const SILA_MISSIONS = {
  1: ['misi-1a', 'misi-1b', 'misi-1c'],
  2: ['misi-2a', 'misi-2b', 'misi-2c'],
  3: ['misi-3a', 'misi-3b', 'misi-3c'],
  4: ['misi-4a', 'misi-4b', 'misi-4c'],
  5: ['misi-5a', 'misi-5b', 'misi-5c'],
};

// Hitung persentase Sila berdasarkan misi yang selesai
function calcSilaPct(silaNum, completedMisiIds) {
  const missions = SILA_MISSIONS[silaNum] || [];
  if (missions.length === 0) return 0;
  const done = missions.filter((id) => completedMisiIds.includes(id)).length;
  return Math.round((done / missions.length) * 100);
}

// Apakah sebuah Sila sudah selesai penuh?
function isSilaDone(silaNum, completedMisiIds) {
  return calcSilaPct(silaNum, completedMisiIds) === 100;
}

const defaultState = {
  completedMisiIds: [],    // array id misi yang sudah selesai
  completedQuizIds: [],    // array id quiz yang sudah selesai (skor 100%)
};

export const useProgressStore = create((set, get) => ({
  ...defaultState,

  // ─── Load dari storage ──────────────────────────────────────────────────────
  loadProgress: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) set({ ...defaultState, ...JSON.parse(raw) });
    } catch (_) {}
  },

  _save: async (nextState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (_) {}
  },

  // ─── Tandai misi sebagai selesai ───────────────────────────────────────────
  completeMisi: (misiId) => {
    set((state) => {
      if (state.completedMisiIds.includes(misiId)) return state;
      const next = {
        ...state,
        completedMisiIds: [...state.completedMisiIds, misiId],
      };
      get()._save(next);
      return next;
    });
  },

  // ─── Tandai quiz sebagai selesai ────────────────────────────────────────────
  completeQuiz: (quizId) => {
    set((state) => {
      if (state.completedQuizIds.includes(quizId)) return state;
      const next = {
        ...state,
        completedQuizIds: [...state.completedQuizIds, quizId],
      };
      get()._save(next);
      return next;
    });
  },

  // ─── Getter: progres persentase tiap Sila ──────────────────────────────────
  getSilaPct: (silaNum) => {
    return calcSilaPct(silaNum, get().completedMisiIds);
  },

  // ─── Getter: apakah sebuah Sila sudah selesai? ─────────────────────────────
  isSilaDone: (silaNum) => {
    return isSilaDone(silaNum, get().completedMisiIds);
  },

  // ─── Getter: apakah sebuah Sila terbuka (Sila sebelumnya selesai)? ──────────
  isSilaUnlocked: (silaNum) => {
    if (silaNum === 1) return true; // Sila 1 selalu terbuka
    return isSilaDone(silaNum - 1, get().completedMisiIds);
  },

  // ─── Getter: hitung total persentase keseluruhan ────────────────────────────
  getTotalProgress: () => {
    const all = [1, 2, 3, 4, 5].map((n) =>
      calcSilaPct(n, get().completedMisiIds)
    );
    return Math.round(all.reduce((a, b) => a + b, 0) / 5);
  },

  // ─── Getter: berapa Sila yang sudah selesai? ───────────────────────────────
  getCompletedSilaCount: () => {
    return [1, 2, 3, 4, 5].filter((n) =>
      isSilaDone(n, get().completedMisiIds)
    ).length;
  },

  // ─── Reset ─────────────────────────────────────────────────────────────────
  resetProgress: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ ...defaultState });
  },
}));
