import { create } from 'zustand';
import { MISI_NODES } from '../assets/data/misiData';

// ── Helpers ──────────────────────────────────────────────────────────────────

function isNodeDone(nodeId, completedMisiIds) {
  const node = MISI_NODES.find((n) => n.id === nodeId);
  if (!node) return false;
  return node.misiIds.every((id) => completedMisiIds.includes(id));
}

function isNodeUnlocked(nodeId, completedMisiIds) {
  if (nodeId === 1) return true;
  return isNodeDone(nodeId - 1, completedMisiIds);
}

function calcNodePct(nodeId, completedMisiIds) {
  const node = MISI_NODES.find((n) => n.id === nodeId);
  if (!node || node.misiIds.length === 0) return 0;
  const done = node.misiIds.filter((id) => completedMisiIds.includes(id)).length;
  return Math.round((done / node.misiIds.length) * 100);
}

function isSilaDone(silaNum, completedMisiIds) {
  const nodes = MISI_NODES.filter((n) => n.silaNum === silaNum);
  return nodes.length > 0 && nodes.every((n) => isNodeDone(n.id, completedMisiIds));
}

const defaultState = {
  completedMisiIds: [],
  completedQuizIds: [],
};

/**
 * useProgressStore
 * State lokal untuk progress user.
 * Di-load dari Supabase saat login, dan setiap perubahan di-sync ke Supabase.
 */
export const useProgressStore = create((set, get) => ({
  ...defaultState,

  // ── Load dari data Supabase ────────────────────────────────────────────────
  loadFromSupabase: (progressData) => {
    if (!progressData) return;
    set({
      completedMisiIds: progressData.completed_misi_ids ?? [],
      completedQuizIds: progressData.completed_quiz_ids ?? [],
    });
  },

  // ── Reset (saat logout) ────────────────────────────────────────────────────
  resetProgress: () => {
    set({ ...defaultState });
  },

  // ── Tandai quiz selesai ────────────────────────────────────────────────────
  // Mengembalikan array terbaru untuk di-sync ke Supabase
  completeQuiz: (quizId) => {
    const current = get().completedQuizIds;
    // Sudah ada, tidak perlu update
    if (current.includes(quizId)) return current;
    const newIds = [...current, quizId];
    set({ completedQuizIds: newIds });
    return newIds;
  },

  // ── Tandai sub-misi selesai ────────────────────────────────────────────────
  // Mengembalikan array terbaru untuk di-sync ke Supabase
  completeMisi: (misiId) => {
    const current = get().completedMisiIds;
    if (current.includes(misiId)) return current;
    const newIds = [...current, misiId];
    set({ completedMisiIds: newIds });
    return newIds;
  },

  // ── Getter node-based ──────────────────────────────────────────────────────
  isNodeDone:     (nodeId) => isNodeDone(nodeId, get().completedMisiIds),
  isNodeUnlocked: (nodeId) => isNodeUnlocked(nodeId, get().completedMisiIds),
  getNodePct:     (nodeId) => calcNodePct(nodeId, get().completedMisiIds),

  // ── Getter sila-based ──────────────────────────────────────────────────────
  isSilaDone:     (silaNum) => isSilaDone(silaNum, get().completedMisiIds),
  isSilaUnlocked: (silaNum) => {
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
}));
