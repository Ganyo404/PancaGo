/**
 * quizService.js
 * Semua operasi Supabase yang berkaitan dengan soal quiz.
 *
 * Struktur ID quiz yang dipakai di seluruh app:
 *   quiz-sila{silaNum}-{difficulty}-{orderIndex}
 *   Contoh: "quiz-sila1-Pemula-1", "quiz-sila3-Petualang-2"
 *
 * Mapping difficulty → quizNum (untuk kompatibilitas layar lama):
 *   Pemula    → #1, #2, #3
 *   Menengah  → #4, #5, #6
 *   Petualang → #7, #8, #9
 */

import { supabase } from './supabase';

// ── Konstanta ────────────────────────────────────────────────────────────────

export const DIFFICULTIES = ['Pemula', 'Menengah', 'Petualang'];

const DIFFICULTY_BASE = { Pemula: 0, Menengah: 3, Petualang: 6 };
const DIFFICULTY_POINTS = { Pemula: [50, 60, 70], Menengah: [100, 120, 140], Petualang: [200, 240, 280] };
const DIFFICULTY_STARS  = { Pemula: 1, Menengah: 2, Petualang: 3 };

const SILA_NAMES = [
  'Ketuhanan Yang Maha Esa',
  'Kemanusiaan yang Adil dan Beradab',
  'Persatuan Indonesia',
  'Kerakyatan yang Dipimpin oleh Hikmat',
  'Keadilan Sosial bagi Seluruh Rakyat',
];

// ── Helper: baris DB → format soal yang dipakai komponen ────────────────────

function rowToQuestion(row) {
  return {
    id: row.id,                        // UUID dari Supabase
    text: row.question_text,
    hint: row.hint,
    explanation: row.explanation,
    choices: [
      { id: 'A', text: row.choice_a_text, isCorrect: row.correct_choice === 'A' },
      { id: 'B', text: row.choice_b_text, isCorrect: row.correct_choice === 'B' },
      { id: 'C', text: row.choice_c_text, isCorrect: row.correct_choice === 'C' },
      { id: 'D', text: row.choice_d_text, isCorrect: row.correct_choice === 'D' },
    ],
    correctId: row.correct_choice,
  };
}

// ── Helper: buat quizId string dari komponen ─────────────────────────────────

export function makeQuizId(silaNum, difficulty, orderIndex) {
  return `quiz-sila${silaNum}-${difficulty}-${orderIndex}`;
}

// ── Helper: parse quizId string → komponen ───────────────────────────────────

export function parseQuizId(quizId) {
  // Format: quiz-sila{n}-{Difficulty}-{order}
  const match = quizId.match(/^quiz-sila(\d)-(\w+)-(\d)$/);
  if (!match) return null;
  return {
    silaNum:    parseInt(match[1], 10),
    difficulty: match[2],
    orderIndex: parseInt(match[3], 10),
  };
}

// ── Helper: quizNum (1-9) → difficulty + orderIndex ──────────────────────────

export function quizNumToDifficulty(quizNum) {
  if (quizNum <= 3) return { difficulty: 'Pemula',    orderIndex: quizNum };
  if (quizNum <= 6) return { difficulty: 'Menengah',  orderIndex: quizNum - 3 };
  return              { difficulty: 'Petualang', orderIndex: quizNum - 6 };
}

// ── Fetch satu soal berdasarkan quizId ───────────────────────────────────────

export async function fetchQuizById(quizId) {
  const parsed = parseQuizId(quizId);
  if (!parsed) return null;

  const { silaNum, difficulty, orderIndex } = parsed;
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('sila_num', silaNum)
    .eq('difficulty', difficulty)
    .eq('order_index', orderIndex)
    .single();

  if (error || !data) return null;

  return {
    id: quizId,
    silaNum,
    quizNum: DIFFICULTY_BASE[difficulty] + orderIndex,
    title: `SILA ${silaNum} #${DIFFICULTY_BASE[difficulty] + orderIndex}`,
    silaName: SILA_NAMES[silaNum - 1],
    level: difficulty,
    stars: DIFFICULTY_STARS[difficulty],
    points: DIFFICULTY_POINTS[difficulty][orderIndex - 1],
    questions: [rowToQuestion(data)],
  };
}

// ── Fetch semua quiz untuk satu sila (9 item) ────────────────────────────────

export async function fetchQuizBySila(silaNum) {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('sila_num', silaNum)
    .order('difficulty', { ascending: true })   // Pemula < Menengah < Petualang (alphabetical)
    .order('order_index', { ascending: true });

  if (error || !data) return [];

  // Urutkan manual sesuai urutan difficulty yang benar
  const ordered = [];
  for (const diff of DIFFICULTIES) {
    const rows = data.filter(r => r.difficulty === diff).sort((a, b) => a.order_index - b.order_index);
    rows.forEach(row => {
      const quizNum = DIFFICULTY_BASE[diff] + row.order_index;
      ordered.push({
        id: makeQuizId(silaNum, diff, row.order_index),
        silaNum,
        quizNum,
        title: `SILA ${silaNum} #${quizNum}`,
        silaName: SILA_NAMES[silaNum - 1],
        level: diff,
        stars: DIFFICULTY_STARS[diff],
        points: DIFFICULTY_POINTS[diff][row.order_index - 1],
        questions: [rowToQuestion(row)],
      });
    });
  }
  return ordered;
}

// ── Fetch semua quiz (semua sila) — untuk keperluan preload ──────────────────

export async function fetchAllQuizzes() {
  const results = await Promise.all([1, 2, 3, 4, 5].map(fetchQuizBySila));
  return results.flat();
}
