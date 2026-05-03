/**
 * useQuizStore.js
 * Cache soal quiz yang sudah di-fetch dari Supabase.
 * Menghindari fetch berulang untuk sila yang sama dalam satu sesi.
 */

import { create } from 'zustand';
import { fetchQuizById, fetchQuizBySila } from '../lib/quizService';

export const useQuizStore = create((set, get) => ({
  // Cache: { [silaNum]: QuizSet[] }
  quizzesBySila: {},
  // Cache: { [quizId]: QuizSet }
  quizzesById: {},
  // Loading state per sila
  loadingSila: {},
  // Error
  error: null,

  // ── Ambil semua quiz untuk satu sila (dengan cache) ──────────────────────
  loadQuizzesBySila: async (silaNum) => {
    const { quizzesBySila, loadingSila } = get();
    // Sudah ada di cache atau sedang loading
    if (quizzesBySila[silaNum] || loadingSila[silaNum]) return;

    set((s) => ({ loadingSila: { ...s.loadingSila, [silaNum]: true } }));
    try {
      const quizzes = await fetchQuizBySila(silaNum);
      // Simpan ke cache by-sila dan by-id
      const byId = {};
      quizzes.forEach(q => { byId[q.id] = q; });
      set((s) => ({
        quizzesBySila: { ...s.quizzesBySila, [silaNum]: quizzes },
        quizzesById:   { ...s.quizzesById, ...byId },
        loadingSila:   { ...s.loadingSila, [silaNum]: false },
        error: null,
      }));
    } catch (e) {
      set((s) => ({
        loadingSila: { ...s.loadingSila, [silaNum]: false },
        error: e.message,
      }));
    }
  },

  // ── Ambil satu quiz berdasarkan ID (dengan cache) ─────────────────────────
  loadQuizById: async (quizId) => {
    const { quizzesById } = get();
    if (quizzesById[quizId]) return quizzesById[quizId];

    try {
      const quiz = await fetchQuizById(quizId);
      if (quiz) {
        set((s) => ({ quizzesById: { ...s.quizzesById, [quizId]: quiz } }));
      }
      return quiz;
    } catch (e) {
      set({ error: e.message });
      return null;
    }
  },

  // ── Getter: ambil dari cache ──────────────────────────────────────────────
  getQuizzesBySila: (silaNum) => get().quizzesBySila[silaNum] || [],
  getQuizById:      (quizId)  => get().quizzesById[quizId] || null,
  isLoadingSila:    (silaNum) => !!get().loadingSila[silaNum],

  // ── Reset cache (saat logout) ─────────────────────────────────────────────
  resetQuizCache: () => set({ quizzesBySila: {}, quizzesById: {}, loadingSila: {}, error: null }),
}));
