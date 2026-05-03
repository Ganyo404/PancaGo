# PancaGo — Dokumentasi Frontend

## Daftar Isi
1. [Arsitektur Umum](#arsitektur-umum)
2. [Autentikasi](#autentikasi)
3. [Sistem Quiz](#sistem-quiz)
4. [Store & State Management](#store--state-management)
5. [Alur Navigasi](#alur-navigasi)
6. [Perubahan dari Versi Sebelumnya](#perubahan-dari-versi-sebelumnya)

---

## Arsitektur Umum

```
app/                    ← Route files (Expo Router)
components/             ← Screen components (UI logic)
store/                  ← Zustand global state
lib/                    ← Supabase client & service layer
assets/data/            ← Data statis (misiData.js — quizData.js sudah tidak dipakai)
```

---

## Autentikasi

### File: `store/useAuthStore.js`

Store utama untuk autentikasi. Semua operasi login/register/logout ada di sini.

| Fungsi | Keterangan |
|--------|-----------|
| `init()` | Dipanggil saat app pertama buka. Cek sesi Supabase yang tersimpan di AsyncStorage. |
| `register({ username, email, password })` | Buat akun baru. Cek duplikat username → buat auth user → insert ke tabel `profiles` → insert ke `user_progress`. |
| `login({ username, password })` | Login dengan username. Cari email dari tabel `profiles` berdasarkan username, lalu `signInWithPassword`. |
| `logout()` | Sign out dari Supabase, reset semua store lokal dan quiz cache. |
| `updateProfile(updates)` | Update kolom di tabel `profiles` (poin, level, karakter, dll). |
| `updateProgress(updates)` | Update kolom di tabel `user_progress` (completed_misi_ids, completed_quiz_ids). |
| `fetchProgress()` | Ambil baris `user_progress` milik user yang sedang login. |

### File: `lib/supabase.js`

Inisialisasi Supabase client dengan `AsyncStorage` sebagai storage untuk persist sesi di mobile.

```js
// Konfigurasi di .env
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### File: `app/_layout.js`

Root layout yang menangani routing otomatis berdasarkan status login:
- Saat `isLoaded = true` dan `session` ada → load profil & progress → redirect ke `/home`
- Saat `isLoaded = true` dan `session` null → reset store → redirect ke `/splash`

---

## Sistem Quiz

### Struktur ID Quiz

Format ID quiz yang dipakai di seluruh app:

```
quiz-sila{silaNum}-{difficulty}-{orderIndex}

Contoh:
  quiz-sila1-Pemula-1     → Sila 1, Pemula, soal ke-1
  quiz-sila3-Menengah-2   → Sila 3, Menengah, soal ke-2
  quiz-sila5-Petualang-3  → Sila 5, Petualang, soal ke-3
```

Mapping ke quizNum lama (1-9):
```
Pemula    → #1, #2, #3
Menengah  → #4, #5, #6
Petualang → #7, #8, #9
```

### File: `lib/quizService.js`

Service layer untuk semua operasi Supabase terkait soal quiz.

| Fungsi | Keterangan |
|--------|-----------|
| `fetchQuizById(quizId)` | Fetch 1 soal berdasarkan quizId string. Parse ID → query Supabase → return QuizSet. |
| `fetchQuizBySila(silaNum)` | Fetch semua 9 soal untuk satu sila. Return array QuizSet terurut (Pemula→Menengah→Petualang). |
| `fetchAllQuizzes()` | Fetch semua 45 soal (5 sila × 9). Untuk preload. |
| `makeQuizId(silaNum, difficulty, orderIndex)` | Buat string quizId dari komponen. |
| `parseQuizId(quizId)` | Parse string quizId → `{ silaNum, difficulty, orderIndex }`. |
| `quizNumToDifficulty(quizNum)` | Konversi quizNum (1-9) → `{ difficulty, orderIndex }`. |

Format QuizSet yang dikembalikan:
```js
{
  id: 'quiz-sila1-Pemula-1',
  silaNum: 1,
  quizNum: 1,
  title: 'SILA 1 #1',
  silaName: 'Ketuhanan Yang Maha Esa',
  level: 'Pemula',
  stars: 1,
  points: 50,
  questions: [{
    id: '<uuid-dari-supabase>',
    text: 'Apa bunyi Sila ke-1?',
    hint: '...',
    explanation: '...',
    choices: [
      { id: 'A', text: '...', isCorrect: true },
      { id: 'B', text: '...', isCorrect: false },
      { id: 'C', text: '...', isCorrect: false },
      { id: 'D', text: '...', isCorrect: false },
    ],
    correctId: 'A',
  }],
}
```

### File: `store/useQuizStore.js`

Cache in-memory untuk soal yang sudah di-fetch. Mencegah request berulang ke Supabase dalam satu sesi.

| State/Fungsi | Keterangan |
|-------------|-----------|
| `quizzesBySila` | Cache `{ [silaNum]: QuizSet[] }` |
| `quizzesById` | Cache `{ [quizId]: QuizSet }` |
| `loadQuizzesBySila(silaNum)` | Fetch + cache semua quiz satu sila. Skip jika sudah ada di cache. |
| `loadQuizById(quizId)` | Fetch + cache satu quiz. Skip jika sudah ada di cache. |
| `getQuizzesBySila(silaNum)` | Getter dari cache. |
| `getQuizById(quizId)` | Getter dari cache. |
| `isLoadingSila(silaNum)` | Cek apakah sedang loading. |
| `resetQuizCache()` | Hapus semua cache (dipanggil saat logout). |

### Komponen Quiz

#### `QuizSilaScreen.js`
- Fetch soal saat layar dibuka via `loadQuizzesBySila(silaNum)`
- Tampilkan loading spinner saat fetch
- Tampilkan error + tombol retry jika gagal
- Soal dikelompokkan per difficulty (Pemula / Menengah / Petualang)
- Sistem lock: quiz ke-N terkunci jika quiz ke-(N-1) belum selesai

#### `QuizSelectionScreen.js`
- Preload semua 5 sila saat layar dibuka (untuk hitung progress count)
- Tampilkan jumlah quiz selesai per sila (X/9)

#### `QuizQuestionScreen.js`
- Fetch soal via `loadQuizById(quizId)` (dengan cache)
- Tampilkan loading spinner saat fetch
- Setelah jawab → navigasi ke `QuizFeedbackScreen` dengan params

---

## Store & State Management

### `useUserStore.js`
State lokal data user (poin, level, streak, karakter). Di-load dari Supabase saat login via `loadFromProfile(profile)`.

Fungsi yang mengembalikan nilai untuk di-sync ke Supabase:
- `addPoints(amount)` → return `{ points, level }`
- `recordAnswer(isCorrect)` → return `newStreak`
- `buyCharacter(charId, cost)` → return `{ success, points, ownedCharIds, equippedCharId }`

### `useProgressStore.js`
State lokal progress misi & quiz. Di-load dari Supabase saat login via `loadFromSupabase(progressData)`.

Fungsi yang mengembalikan nilai untuk di-sync ke Supabase:
- `completeMisi(misiId)` → return array `completedMisiIds` terbaru
- `completeQuiz(quizId)` → return array `completedQuizIds` terbaru

### `useAuthStore.js`
Sumber kebenaran untuk sesi user. Semua sync ke Supabase dilakukan melalui `updateProfile()` dan `updateProgress()`.

---

## Alur Navigasi

```
/splash
  ├── Mulai Petualangan → /onboarding (Login)
  │     ├── Login sukses → /home
  │     └── Daftar di sini → /register
  │           └── Register sukses → /home
  └── (sudah login) → /home (auto-redirect via _layout.js)

/home → /quiz → /quiz/sila?silaNum=N → /quiz/question?quizId=X
                                              ↓
                                       /quiz/feedback
                                              ↓
                                       /quiz/question (soal berikutnya)
                                              ↓ (soal terakhir)
                                       /quiz/result
```

---

## Perubahan dari Versi Sebelumnya

### Yang Dihapus / Tidak Dipakai Lagi
- `assets/data/quizData.js` — File ini **tidak lagi dipakai** oleh komponen quiz. Soal sekarang diambil dari Supabase. File masih ada tapi bisa dihapus setelah data berhasil di-seed ke Supabase.
- Import `getQuizBySila`, `getQuizById`, `QUIZ_SETS` dari `quizData.js` di komponen quiz sudah diganti.

### Yang Ditambahkan
| File | Keterangan |
|------|-----------|
| `lib/supabase.js` | Supabase client |
| `lib/quizService.js` | Service layer fetch soal dari Supabase |
| `store/useAuthStore.js` | Store autentikasi |
| `store/useQuizStore.js` | Cache soal quiz |
| `supabase_schema.sql` | Schema + seed data untuk Supabase |
| `docs/FRONTEND_DOCS.md` | Dokumentasi ini |
| `docs/DATABASE_DOCS.md` | Dokumentasi database |

### Yang Diubah
| File | Perubahan |
|------|----------|
| `store/useUserStore.js` | Hapus AsyncStorage, load dari Supabase, fungsi return nilai untuk sync |
| `store/useProgressStore.js` | Hapus AsyncStorage, load dari Supabase, fungsi return nilai untuk sync |
| `app/_layout.js` | Gunakan `useAuthStore` untuk routing berdasarkan sesi |
| `app/index.js` | Redirect berdasarkan `session` bukan `hasOnboarded` |
| `components/OnboardingScreen.js` | Jadi halaman Login (username + password) |
| `components/RegisterScreen.js` | Register ke Supabase dengan validasi |
| `components/ProfileScreen.js` | Tambah tombol logout, gunakan `useAuthStore` |
| `components/QuizSilaScreen.js` | Fetch soal dari Supabase via `useQuizStore` |
| `components/QuizSelectionScreen.js` | Preload quiz dari Supabase |
| `components/QuizQuestionScreen.js` | Fetch soal dari Supabase via `useQuizStore` |
| `components/QuizResultScreen.js` | Sync poin ke Supabase setelah quiz selesai |
| `components/KarakterScreen.js` | Sync karakter ke Supabase setelah beli/equip |
| `components/OnMisiScreen.js` | Sync progress misi ke Supabase setelah selesai |
