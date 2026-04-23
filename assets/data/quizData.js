// ─────────────────────────────────────────────────────────────────────────────
// assets/data/quizData.js
// Kumpulan soal kuis PancaGo — edit di sini untuk menambah/mengubah soal
// ─────────────────────────────────────────────────────────────────────────────

export const QUIZ_SETS = [
  {
    id: 'quiz-sila1',
    title: 'Ayo Kenal Pancasila!',
    sila: 1,
    points: 50,
    level: 'Pemula',
    stars: 1,
    questions: [
      {
        id: 'q1-1',
        text: 'Apa bunyi Sila pertama Pancasila?',
        image: null, // ganti dengan require('../../assets/images/materials/sila1.png') setelah gambar ada
        choices: [
          { id: 'A', text: 'Ketuhanan Yang Maha Esa', isCorrect: true },
          { id: 'B', text: 'Kemanusiaan yang Adil dan Beradab', isCorrect: false },
          { id: 'C', text: 'Persatuan Indonesia', isCorrect: false },
          { id: 'D', text: 'Keadilan Sosial bagi Seluruh Rakyat', isCorrect: false },
        ],
      },
      {
        id: 'q1-2',
        text: 'Simbol sila pertama Pancasila adalah...',
        image: null,
        choices: [
          { id: 'A', text: 'Rantai', isCorrect: false },
          { id: 'B', text: 'Bintang', isCorrect: true },
          { id: 'C', text: 'Pohon Beringin', isCorrect: false },
          { id: 'D', text: 'Padi dan Kapas', isCorrect: false },
        ],
      },
      {
        id: 'q1-3',
        text: 'Berikut ini adalah contoh sikap pengamalan Sila ke-1, kecuali...',
        image: null,
        choices: [
          { id: 'A', text: 'Berdoa sebelum belajar', isCorrect: false },
          { id: 'B', text: 'Menghormati teman yang berbeda agama', isCorrect: false },
          { id: 'C', text: 'Mengejek teman yang beribadah', isCorrect: true },
          { id: 'D', text: 'Menjalankan ibadah dengan tertib', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'quiz-sila2',
    title: 'Pilih yang Baik Yuk!',
    sila: 2,
    points: 100,
    level: 'Menengah',
    stars: 2,
    questions: [
      {
        id: 'q2-1',
        text: 'Bagaimana cara kita menjaga persatuan di sekolah?',
        image: null,
        choices: [
          { id: 'A', text: 'Bermain bersama semua teman', isCorrect: true },
          { id: 'B', text: 'Hanya bermain dengan satu orang', isCorrect: false },
          { id: 'C', text: 'Bertengkar saat bermain', isCorrect: false },
          { id: 'D', text: 'Sembunyi sendirian', isCorrect: false },
        ],
      },
      {
        id: 'q2-2',
        text: 'Sila ke-2 mengajarkan kita untuk bersikap...',
        image: null,
        choices: [
          { id: 'A', text: 'Egois dan tidak peduli', isCorrect: false },
          { id: 'B', text: 'Adil dan beradab kepada semua orang', isCorrect: true },
          { id: 'C', text: 'Hanya baik kepada orang kaya', isCorrect: false },
          { id: 'D', text: 'Marah jika tidak diperhatikan', isCorrect: false },
        ],
      },
      {
        id: 'q2-3',
        text: 'Ketika teman kita jatuh, kita sebaiknya...',
        image: null,
        choices: [
          { id: 'A', text: 'Menertawakannya', isCorrect: false },
          { id: 'B', text: 'Pura-pura tidak melihat', isCorrect: false },
          { id: 'C', text: 'Membantu dan menanyakan kondisinya', isCorrect: true },
          { id: 'D', text: 'Lari meninggalkannya', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'quiz-sila3',
    title: 'Misi Kebaikan Hari Ini!',
    sila: 3,
    points: 250,
    level: 'Petualang',
    stars: 3,
    questions: [
      {
        id: 'q3-1',
        text: 'Sila ke-3 Pancasila berbunyi...',
        image: null,
        choices: [
          { id: 'A', text: 'Keadilan Sosial bagi Seluruh Rakyat Indonesia', isCorrect: false },
          { id: 'B', text: 'Persatuan Indonesia', isCorrect: true },
          { id: 'C', text: 'Ketuhanan Yang Maha Esa', isCorrect: false },
          { id: 'D', text: 'Kerakyatan yang Dipimpin oleh Hikmat', isCorrect: false },
        ],
      },
      {
        id: 'q3-2',
        text: 'Simbol sila ketiga adalah pohon beringin, yang melambangkan...',
        image: null,
        choices: [
          { id: 'A', text: 'Kemakmuran dan kesuburan', isCorrect: false },
          { id: 'B', text: 'Persatuan dan kesatuan yang kokoh', isCorrect: true },
          { id: 'C', text: 'Keadilan bagi semua', isCorrect: false },
          { id: 'D', text: 'Kepercayaan kepada Tuhan', isCorrect: false },
        ],
      },
      {
        id: 'q3-3',
        text: 'Contoh nyata pengamalan Sila ke-3 di sekolah adalah...',
        image: null,
        choices: [
          { id: 'A', text: 'Berkelahi dengan teman berbeda suku', isCorrect: false },
          { id: 'B', text: 'Kerja bakti membersihkan kelas bersama', isCorrect: true },
          { id: 'C', text: 'Menolak bermain dengan teman dari daerah lain', isCorrect: false },
          { id: 'D', text: 'Mengutamakan kepentingan diri sendiri', isCorrect: false },
        ],
      },
    ],
  },
];
