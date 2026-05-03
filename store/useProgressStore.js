import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MISI_NODES } from '../assets/data/misiData';

const STORAGE_KEY = 'pancago_progress_v2';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Cek apakah semua sub-misi sebuah node sudah selesai */
function isNodeDone(nodeId, completedMisiIds) {
  const node = MISI_NODES.find((n) => n.id === nodeId);
  if (!node) return false;
  return node.misiIds.every((id) => completedMisiIds.includes(id));
}

/** Node terbuka jika node sebelumnya sudah selesai (node 1 selalu terbuka) */
function isNodeUnlocked(nodeId, completedMisiIds) {
  if (nodeId === 1) return true;
  return isNodeDone(nodeId - 1, completedMisiIds);
}

/** Persentase penyelesaian sebuah node */
function calcNodePct(nodeId, completedMisiIds) {
  const node = MISI_NODES.find((n) => n.id === nodeId);
  if (!node || node.misiIds.length === 0) return 0;
  const done = node.misiIds.filter((id) => completedMisiIds.includes(id)).length;
  return Math.round((done / node.misiIds.length) * 100);
}

// Untuk kompatibilitas layar lama (OnMisiScreen, dll) yang masih pakai silaNum
// silaNum dari node = posisi dalam putaran (1-5)
function isSilaDone(silaNum, completedMisiIds) {
  // Cek apakah SEMUA node dengan silaNum ini sudah selesai
  const nodes = MISI_NODES.filter((n) => n.silaNum === silaNum);
  return nodes.length > 0 && nodes.every((n) => isNodeDone(n.id, completedMisiIds));
}

const defaultState = {
  completedMisiIds: [],   // id sub-misi yang selesai  e.g. 'misi-1a'
  completedQuizIds: [],   // id quiz yang selesai
};

export const useProgressStore = create((set, get) => ({
  ...defaultState,

  // ── Load dari storage ──────────────────────────────────────────────────────
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

  // ── Tandai sub-misi selesai ────────────────────────────────────────────────
  completeMisi: (misiId) => {
    set((state) => {
      if (state.completedMisiIds.includes(misiId)) return state;
      const next = { ...state, completedMisiIds: [...state.completedMisiIds, misiId] };
      get()._save(next);
      return next;
    });
  },

  // ── Tandai quiz selesai ────────────────────────────────────────────────────
  completeQuiz: (quizId) => {
    set((state) => {
      if (state.completedQuizIds.includes(quizId)) return state;
      const next = { ...state, completedQuizIds: [...state.completedQuizIds, quizId] };
      get()._save(next);
      return next;
    });
  },

  // ── Getter node-based ──────────────────────────────────────────────────────
  isNodeDone:     (nodeId) => isNodeDone(nodeId, get().completedMisiIds),
  isNodeUnlocked: (nodeId) => isNodeUnlocked(nodeId, get().completedMisiIds),
  getNodePct:     (nodeId) => calcNodePct(nodeId, get().completedMisiIds),

  // ── Getter sila-based (kompatibilitas layar lama) ──────────────────────────
  isSilaDone:     (silaNum) => isSilaDone(silaNum, get().completedMisiIds),
  isSilaUnlocked: (silaNum) => {
    // Sila X terbuka jika ada minimal 1 node silaNum X yang sudah unlock
    const nodes = MISI_NODES.filter((n) => n.silaNum === silaNum);
    return nodes.some((n) => isNodeUnlocked(n.id, get().completedMisiIds));
  },
  getSilaPct: (silaNum) => {
    const nodes = MISI_NODES.filter((n) => n.silaNum === silaNum);
    if (nodes.length === 0) return 0;
    const total = nodes.reduce((acc, n) => acc + calcNodePct(n.id, get().completedMisiIds), 0);
    return Math.round(total / nodes.length);
  },

  // ── Total progress ─────────────────────────────────────────────────────────
  getTotalProgress: () => {
    const total = MISI_NODES.reduce((acc, n) => acc + calcNodePct(n.id, get().completedMisiIds), 0);
    return Math.round(total / MISI_NODES.length);
  },

  getCompletedSilaCount: () => {
    return [1, 2, 3, 4, 5].filter((n) => isSilaDone(n, get().completedMisiIds)).length;
  },

  // ── Reset ──────────────────────────────────────────────────────────────────
  resetProgress: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ ...defaultState });
  },
}));
