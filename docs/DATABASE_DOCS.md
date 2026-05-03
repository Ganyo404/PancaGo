# PancaGo — Dokumentasi Database (Supabase)

## Daftar Isi
1. [Gambaran Umum](#gambaran-umum)
2. [Tabel profiles](#tabel-profiles)
3. [Tabel user_progress](#tabel-user_progress)
4. [Tabel quiz_questions](#tabel-quiz_questions) ← **Baru**
5. [Row Level Security (RLS)](#row-level-security-rls)
6. [Index](#index)
7. [Cara Setup](#cara-setup)
8. [Cara Menambah / Edit Soal](#cara-menambah--edit-soal)
9. [Perubahan dari Versi Sebelumnya](#perubahan-dari-versi-sebelumnya)

---

## Gambaran Umum

```
auth.users (Supabase built-in)
    │
    ├── profiles          (1:1) — data profil user
    ├── user_progress     (1:1) — progress misi & quiz per user
    └── quiz_questions    (N)   — soal quiz (dibaca semua user, dikelola admin)
```

Semua tabel ada di schema `public`. Row Level Security (RLS) aktif di semua tabel.

---

## Tabel `profiles`

Menyimpan data profil setiap user yang terdaftar.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | `UUID` PK | Sama dengan `auth.users.id`. Foreign key dengan CASCADE DELETE. |
| `username` | `TEXT` UNIQUE NOT NULL | Username unik yang dipakai untuk login. |
| `email` | `TEXT` NOT NULL | Email yang dipakai untuk Supabase Auth. |
| `points` | `INTEGER` DEFAULT 0 | Total poin yang dikumpulkan user. |
| `level` | `INTEGER` DEFAULT 1 | Level user. Dihitung: `floor(points / 500) + 1`. |
| `streak` | `INTEGER` DEFAULT 0 | Streak jawaban benar berturut-turut. |
| `equipped_char_id` | `TEXT` DEFAULT 'asih' | ID karakter yang sedang dipakai. |
| `owned_char_ids` | `TEXT[]` DEFAULT `{'asih'}` | Array ID karakter yang sudah dimiliki. |
| `created_at` | `TIMESTAMPTZ` | Waktu akun dibuat. |
| `updated_at` | `TIMESTAMPTZ` | Waktu terakhir diupdate (auto-trigger). |

**Contoh baris:**
```json
{
  "id": "uuid-user-123",
  "username": "budi_pancasila",
  "email": "budi@gmail.com",
  "points": 750,
  "level": 2,
  "streak": 5,
  "equipped_char_id": "garuda",
  "owned_char_ids": ["asih", "garuda"]
}
```

---

## Tabel `user_progress`

Menyimpan progress misi dan quiz yang sudah diselesaikan per user.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | `UUID` PK | Auto-generated. |
| `user_id` | `UUID` UNIQUE NOT NULL | FK ke `profiles.id`. Satu user = satu baris. |
| `completed_misi_ids` | `TEXT[]` DEFAULT `{}` | Array ID sub-misi yang sudah selesai. Format: `'misi-{nodeId}{suffix}'` (contoh: `'misi-3a'`). |
| `completed_quiz_ids` | `TEXT[]` DEFAULT `{}` | Array quiz ID yang sudah selesai. Format: `'quiz-sila{n}-{difficulty}-{order}'` (contoh: `'quiz-sila1-Pemula-1'`). |
| `updated_at` | `TIMESTAMPTZ` | Waktu terakhir diupdate (auto-trigger). |

**Contoh baris:**
```json
{
  "user_id": "uuid-user-123",
  "completed_misi_ids": ["misi-1a", "misi-1b", "misi-1c"],
  "completed_quiz_ids": ["quiz-sila1-Pemula-1", "quiz-sila1-Pemula-2"]
}
```

---

## Tabel `quiz_questions`

> **Tabel baru** yang ditambahkan untuk menggantikan data soal statis di `quizData.js`.

Menyimpan semua soal quiz. Setiap baris = 1 soal dengan 4 pilihan jawaban.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | `UUID` PK | Auto-generated. Dipakai sebagai referensi internal soal. |
| `sila_num` | `SMALLINT` NOT NULL | Nomor sila (1–5). |
| `difficulty` | `TEXT` NOT NULL | Tingkat kesulitan: `'Pemula'`, `'Menengah'`, atau `'Petualang'`. |
| `order_index` | `SMALLINT` NOT NULL | Urutan soal dalam satu kelompok (1, 2, atau 3). |
| `question_text` | `TEXT` NOT NULL | Teks pertanyaan. |
| `hint` | `TEXT` DEFAULT `''` | Petunjuk yang muncul saat user tekan tombol Hint. |
| `explanation` | `TEXT` DEFAULT `''` | Penjelasan jawaban yang benar, ditampilkan di FeedbackScreen. |
| `choice_a_text` | `TEXT` NOT NULL | Teks pilihan A. |
| `choice_b_text` | `TEXT` NOT NULL | Teks pilihan B. |
| `choice_c_text` | `TEXT` NOT NULL | Teks pilihan C. |
| `choice_d_text` | `TEXT` NOT NULL | Teks pilihan D. |
| `correct_choice` | `TEXT` NOT NULL | Jawaban benar: `'A'`, `'B'`, `'C'`, atau `'D'`. |
| `points` | `SMALLINT` DEFAULT 50 | Poin yang didapat jika menjawab benar. |
| `stars` | `SMALLINT` DEFAULT 1 | Jumlah bintang (1–3) sesuai difficulty. |
| `created_at` | `TIMESTAMPTZ` | Waktu soal dibuat. |
| `updated_at` | `TIMESTAMPTZ` | Waktu terakhir diupdate (auto-trigger). |

**Constraint UNIQUE:** `(sila_num, difficulty, order_index)` — satu kombinasi sila + difficulty + urutan hanya boleh ada satu soal.

### Struktur Soal (45 total)

```
5 sila × 3 difficulty × 3 soal = 45 soal

Sila 1:
  Pemula    → order 1, 2, 3  (points: 50, 60, 70)
  Menengah  → order 1, 2, 3  (points: 100, 120, 140)
  Petualang → order 1, 2, 3  (points: 200, 240, 280)

Sila 2: (sama strukturnya)
...dst sampai Sila 5
```

### Cara Frontend Mengambil Soal

Frontend mengidentifikasi soal dengan string ID:
```
quiz-sila{silaNum}-{difficulty}-{orderIndex}
```

Saat user membuka Quiz Sila 1 #2 (Pemula, soal ke-2), frontend query:
```sql
SELECT * FROM quiz_questions
WHERE sila_num = 1
  AND difficulty = 'Pemula'
  AND order_index = 2;
```

**Contoh baris:**
```json
{
  "id": "uuid-soal-abc",
  "sila_num": 1,
  "difficulty": "Pemula",
  "order_index": 1,
  "question_text": "Apa bunyi Sila ke-1 Pancasila?",
  "hint": "Berkaitan dengan kepercayaan kepada Tuhan.",
  "explanation": "Sila ke-1: Ketuhanan Yang Maha Esa.",
  "choice_a_text": "Ketuhanan Yang Maha Esa",
  "choice_b_text": "Persatuan Indonesia",
  "choice_c_text": "Kemanusiaan yang Adil",
  "choice_d_text": "Keadilan Sosial",
  "correct_choice": "A",
  "points": 50,
  "stars": 1
}
```

---

## Row Level Security (RLS)

| Tabel | Operasi | Policy |
|-------|---------|--------|
| `profiles` | SELECT | Hanya bisa baca profil sendiri (`auth.uid() = id`) |
| `profiles` | INSERT | Hanya bisa insert untuk diri sendiri |
| `profiles` | UPDATE | Hanya bisa update profil sendiri |
| `user_progress` | SELECT | Hanya bisa baca progress sendiri (`auth.uid() = user_id`) |
| `user_progress` | INSERT | Hanya bisa insert untuk diri sendiri |
| `user_progress` | UPDATE | Hanya bisa update progress sendiri |
| `quiz_questions` | SELECT | Semua user yang sudah login bisa baca (`auth.role() = 'authenticated'`) |
| `quiz_questions` | INSERT/UPDATE/DELETE | Tidak ada policy → hanya bisa dilakukan via Service Role Key (admin) |

---

## Index

| Index | Tabel | Kolom | Tujuan |
|-------|-------|-------|--------|
| `profiles_username_idx` | `profiles` | `username` | Mempercepat lookup username saat login |
| `user_progress_user_id_idx` | `user_progress` | `user_id` | Mempercepat fetch progress per user |
| `quiz_questions_lookup_idx` | `quiz_questions` | `(sila_num, difficulty, order_index)` | Mempercepat query soal berdasarkan sila + difficulty + urutan |

---

## Cara Setup

1. Buka **Supabase Dashboard** → pilih project kamu
2. Pergi ke **SQL Editor**
3. Copy seluruh isi file `supabase_schema.sql`
4. Paste dan klik **Run**
5. Verifikasi di **Table Editor** — harus ada 3 tabel: `profiles`, `user_progress`, `quiz_questions`
6. Di tabel `quiz_questions` harus ada **45 baris** (5 sila × 3 difficulty × 3 soal)

**Pengaturan Auth yang disarankan:**
- Pergi ke **Authentication → Settings**
- Matikan **Email Confirmations** agar user bisa langsung login setelah register tanpa konfirmasi email

---

## Cara Menambah / Edit Soal

### Tambah soal baru via SQL Editor:
```sql
INSERT INTO public.quiz_questions (
  sila_num, difficulty, order_index,
  question_text, hint, explanation,
  choice_a_text, choice_b_text, choice_c_text, choice_d_text,
  correct_choice, points, stars
) VALUES (
  1, 'Pemula', 1,
  'Pertanyaan baru di sini?',
  'Petunjuk di sini.',
  'Penjelasan jawaban di sini.',
  'Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D',
  'A', 50, 1
)
ON CONFLICT (sila_num, difficulty, order_index)
DO UPDATE SET
  question_text = EXCLUDED.question_text,
  hint = EXCLUDED.hint,
  explanation = EXCLUDED.explanation,
  choice_a_text = EXCLUDED.choice_a_text,
  choice_b_text = EXCLUDED.choice_b_text,
  choice_c_text = EXCLUDED.choice_c_text,
  choice_d_text = EXCLUDED.choice_d_text,
  correct_choice = EXCLUDED.correct_choice;
```

### Edit soal via Table Editor:
1. Buka **Table Editor** → pilih tabel `quiz_questions`
2. Filter berdasarkan `sila_num` dan `difficulty`
3. Klik baris yang ingin diedit → ubah langsung di UI

### Aturan penting:
- `order_index` hanya boleh 1, 2, atau 3 per kombinasi sila + difficulty
- `correct_choice` harus `'A'`, `'B'`, `'C'`, atau `'D'` (huruf kapital)
- `difficulty` harus persis `'Pemula'`, `'Menengah'`, atau `'Petualang'` (case-sensitive)
- `sila_num` harus antara 1–5

---

## Perubahan dari Versi Sebelumnya

### Sebelum (v1 — data statis)
- Semua soal quiz disimpan di file `assets/data/quizData.js` dalam kode frontend
- Tidak ada database untuk soal
- Untuk mengubah soal harus edit kode dan deploy ulang aplikasi
- ID quiz format lama: `'quiz-sila1-1'` (tanpa difficulty)

### Sesudah (v2 — Supabase)

**Tabel baru yang ditambahkan:**

| Tabel | Keterangan |
|-------|-----------|
| `quiz_questions` | Tabel baru untuk menyimpan semua soal quiz. Menggantikan `quizData.js`. |

**Perubahan pada tabel yang sudah ada:**

| Tabel | Perubahan |
|-------|----------|
| `profiles` | Tidak ada perubahan struktur. |
| `user_progress` | Kolom `completed_quiz_ids` sekarang menyimpan ID format baru: `'quiz-sila{n}-{difficulty}-{order}'` bukan `'quiz-sila{n}-{num}'`. **Jika ada data lama, perlu migrasi.** |

**Format ID quiz yang berubah:**

| Versi | Format | Contoh |
|-------|--------|--------|
| v1 (lama) | `quiz-sila{n}-{num}` | `quiz-sila1-1` |
| v2 (baru) | `quiz-sila{n}-{difficulty}-{order}` | `quiz-sila1-Pemula-1` |

**Keuntungan perubahan ini:**
- Soal bisa diubah/ditambah tanpa deploy ulang aplikasi
- Admin bisa kelola soal langsung dari Supabase Dashboard
- Soal bisa dibedakan per difficulty dengan jelas di database
- Mudah menambah lebih dari 3 soal per difficulty di masa depan (tinggal tambah `order_index` baru)
- Bisa tracking analytics soal mana yang sering salah dijawab (future feature)
