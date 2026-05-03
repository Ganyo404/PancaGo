-- ============================================================
-- PancaGo - Supabase Database Schema (Full)
-- Jalankan script ini di Supabase SQL Editor
-- ============================================================

-- ── Tabel profiles ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username         TEXT UNIQUE NOT NULL,
  email            TEXT NOT NULL,
  points           INTEGER NOT NULL DEFAULT 0,
  level            INTEGER NOT NULL DEFAULT 1,
  streak           INTEGER NOT NULL DEFAULT 0,
  equipped_char_id TEXT NOT NULL DEFAULT 'asih',
  owned_char_ids   TEXT[] NOT NULL DEFAULT ARRAY['asih'],
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabel user_progress ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_progress (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  completed_misi_ids  TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  completed_quiz_ids  TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabel quiz_questions ─────────────────────────────────────────────────────
-- Menyimpan semua soal quiz, dikelompokkan per sila (1-5) dan
-- tingkat kesulitan (Pemula / Menengah / Petualang).
-- Setiap baris = 1 soal dengan 4 pilihan jawaban (A-D).
-- Urutan soal dalam satu kelompok ditentukan oleh kolom `order_index`
-- (dimulai dari 1). Frontend menarik soal berdasarkan sila_num +
-- difficulty + order_index, sehingga Quiz #1 = order 1, Quiz #2 = order 2, dst.
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Pengelompokan
  sila_num     SMALLINT NOT NULL CHECK (sila_num BETWEEN 1 AND 5),
  difficulty   TEXT     NOT NULL CHECK (difficulty IN ('Pemula', 'Menengah', 'Petualang')),
  order_index  SMALLINT NOT NULL CHECK (order_index BETWEEN 1 AND 3),

  -- Konten soal
  question_text TEXT NOT NULL,
  hint          TEXT NOT NULL DEFAULT '',
  explanation   TEXT NOT NULL DEFAULT '',

  -- Pilihan jawaban (A-D)
  choice_a_text TEXT NOT NULL,
  choice_b_text TEXT NOT NULL,
  choice_c_text TEXT NOT NULL,
  choice_d_text TEXT NOT NULL,
  correct_choice TEXT NOT NULL CHECK (correct_choice IN ('A','B','C','D')),

  -- Metadata
  points       SMALLINT NOT NULL DEFAULT 50,
  stars        SMALLINT NOT NULL DEFAULT 1 CHECK (stars BETWEEN 1 AND 3),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Satu soal unik per kombinasi sila + difficulty + urutan
  UNIQUE (sila_num, difficulty, order_index)
);

-- ── Auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER quiz_questions_updated_at
  BEFORE UPDATE ON public.quiz_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Row Level Security (RLS) ─────────────────────────────────────────────────
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- profiles: user hanya bisa akses data sendiri
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- user_progress: user hanya bisa akses progress sendiri
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- quiz_questions: semua user yang login bisa baca (read-only)
CREATE POLICY "Authenticated users can read quiz questions"
  ON public.quiz_questions FOR SELECT USING (auth.role() = 'authenticated');

-- ── Index untuk performa ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS profiles_username_idx
  ON public.profiles(username);
CREATE INDEX IF NOT EXISTS user_progress_user_id_idx
  ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS quiz_questions_lookup_idx
  ON public.quiz_questions(sila_num, difficulty, order_index);

-- ============================================================
-- SEED DATA — 45 soal (5 sila × 3 difficulty × 3 soal)
-- Salin dari quizData.js yang sudah ada
-- ============================================================

-- ── SILA 1 — PEMULA ─────────────────────────────────────────────────────────
INSERT INTO public.quiz_questions (sila_num, difficulty, order_index, question_text, hint, explanation, choice_a_text, choice_b_text, choice_c_text, choice_d_text, correct_choice, points, stars) VALUES
(1,'Pemula',1,'Apa bunyi Sila ke-1 Pancasila?','Berkaitan dengan kepercayaan kepada Tuhan.','Sila ke-1: Ketuhanan Yang Maha Esa.','Ketuhanan Yang Maha Esa','Persatuan Indonesia','Kemanusiaan yang Adil','Keadilan Sosial','A',50,1),
(1,'Pemula',2,'Simbol Sila ke-1 adalah...','Benda bercahaya di langit malam.','Bintang melambangkan cahaya rohani.','Rantai','Bintang Emas','Pohon Beringin','Padi & Kapas','B',60,1),
(1,'Pemula',3,'Contoh pengamalan Sila ke-1 kecuali...','Cari sikap yang tidak menghormati agama.','Mengejek teman beribadah melanggar toleransi.','Berdoa sebelum belajar','Menghormati ibadah teman','Mengejek teman beribadah','Menjalankan ibadah tertib','C',70,1);

-- ── SILA 1 — MENENGAH ───────────────────────────────────────────────────────
INSERT INTO public.quiz_questions (sila_num, difficulty, order_index, question_text, hint, explanation, choice_a_text, choice_b_text, choice_c_text, choice_d_text, correct_choice, points, stars) VALUES
(1,'Menengah',1,'Toleransi beragama berarti...','Hargai perbedaan.','Toleransi = menghormati perbedaan.','Memaksakan agama kita','Menghormati perbedaan keyakinan','Mengabaikan agama orang lain','Melarang orang beribadah','B',100,2),
(1,'Menengah',2,'Berapa agama resmi yang diakui di Indonesia?','Hitung agama yang ada KTP-nya.','Indonesia mengakui 6 agama resmi.','4','5','6','7','C',120,2),
(1,'Menengah',3,'Sikap yang benar saat teman sedang beribadah adalah...','Hargai waktu ibadah orang lain.','Menghormati ibadah orang lain wujud toleransi.','Mengganggu','Menghormati dan tidak mengganggu','Mengajak pergi','Mentertawakannya','B',140,2);

-- ── SILA 1 — PETUALANG ──────────────────────────────────────────────────────
INSERT INTO public.quiz_questions (sila_num, difficulty, order_index, question_text, hint, explanation, choice_a_text, choice_b_text, choice_c_text, choice_d_text, correct_choice, points, stars) VALUES
(1,'Petualang',1,'Nilai utama Sila ke-1 adalah...','Sila ini tentang hubungan manusia-Tuhan.','Nilai utama sila ke-1 adalah ketakwaan kepada Tuhan YME.','Gotong royong','Musyawarah','Ketakwaan kepada Tuhan','Keadilan sosial','C',200,3),
(1,'Petualang',2,'Pancasila sebagai dasar negara disahkan pada...','Tanggal pengesahan UUD 1945.','Pancasila disahkan 18 Agustus 1945 bersama UUD 1945.','17 Agustus 1945','1 Juni 1945','18 Agustus 1945','22 Juni 1945','C',240,3),
(1,'Petualang',3,'Siapa yang pertama mencetuskan istilah Pancasila?','Presiden pertama RI.','Soekarno mencetuskan istilah Pancasila pada 1 Juni 1945.','Moh. Hatta','Soekarno','Moh. Yamin','Soepomo','B',280,3);

-- ── SILA 2 — PEMULA ─────────────────────────────────────────────────────────
INSERT INTO public.quiz_questions (sila_num, difficulty, order_index, question_text, hint, explanation, choice_a_text, choice_b_text, choice_c_text, choice_d_text, correct_choice, points, stars) VALUES
(2,'Pemula',1,'Sila ke-2 berbunyi...','Berkaitan dengan kemanusiaan.','Sila ke-2: Kemanusiaan yang Adil dan Beradab.','Persatuan Indonesia','Kemanusiaan yang Adil dan Beradab','Ketuhanan Yang Maha Esa','Keadilan Sosial','B',50,1),
(2,'Pemula',2,'Simbol Sila ke-2 adalah...','Benda penghubung yang berbentuk lingkaran.','Rantai melambangkan hubungan antar manusia yang saling terkait.','Bintang','Rantai Emas','Pohon Beringin','Kepala Banteng','B',60,1),
(2,'Pemula',3,'Saat teman kita jatuh, kita sebaiknya...','Bayangkan jika kamu yang jatuh.','Menolong teman adalah bentuk nilai kemanusiaan.','Menertawakannya','Pura-pura tidak melihat','Membantu dan menanyakan kondisinya','Lari meninggalkannya','C',70,1);

-- ── SILA 2 — MENENGAH ───────────────────────────────────────────────────────
INSERT INTO public.quiz_questions (sila_num, difficulty, order_index, question_text, hint, explanation, choice_a_text, choice_b_text, choice_c_text, choice_d_text, correct_choice, points, stars) VALUES
(2,'Menengah',1,'HAM adalah singkatan dari...','Hak yang dimiliki setiap orang sejak lahir.','HAM = Hak Asasi Manusia, hak dasar setiap manusia.','Hak Asasi Manusia','Hukum Adat Masyarakat','Hak Atas Milik','Hubungan Antar Manusia','A',100,2),
(2,'Menengah',2,'Sikap yang mencerminkan Sila ke-2 adalah...','Adil = tidak pilih kasih.','Bersikap adil kepada semua adalah wujud kemanusiaan.','Memilih teman berdasarkan suku','Bersikap adil kepada semua orang','Mengutamakan kepentingan sendiri','Membeda-bedakan teman','B',120,2),
(2,'Menengah',3,'Keberadaban dalam Sila ke-2 berarti...','Beradab = berperilaku baik.','Beradab berarti bersikap sopan dan menjunjung martabat.','Kaya raya','Sopan dan bermartabat','Pandai berbicara','Berani berkelahi','B',140,2);

-- ── SILA 2 — PETUALANG ──────────────────────────────────────────────────────
INSERT INTO public.quiz_questions (sila_num, difficulty, order_index, question_text, hint, explanation, choice_a_text, choice_b_text, choice_c_text, choice_d_text, correct_choice, points, stars) VALUES
(2,'Petualang',1,'Dasar hukum HAM di Indonesia tercantum di...','Pasal tentang hak warga negara.','HAM diatur dalam UUD 1945 pasal 28A-28J.','Pancasila saja','UUD 1945 pasal 28','KUHP pasal 1','TAP MPR 1966','B',200,3),
(2,'Petualang',2,'Tindakan yang melanggar Sila ke-2 adalah...','Menyakiti orang lain melanggar nilai kemanusiaan.','Bullying melanggar HAM dan nilai kemanusiaan.','Donor darah','Bully/perundungan','Kerja bakti','Menghormati orang tua','B',240,3),
(2,'Petualang',3,'Rantai pada lambang Sila ke-2 terdiri dari mata rantai...','Ada dua bentuk berbeda.','Mata rantai bulat (perempuan) & persegi (laki-laki) = semua manusia saling berkaitan.','Bulat dan persegi','Hanya bulat','Hanya persegi','Segitiga dan bulat','A',280,3);

-- ── SILA 3 — PEMULA ─────────────────────────────────────────────────────────
INSERT INTO public.quiz_questions (sila_num, difficulty, order_index, question_text, hint, explanation, choice_a_text, choice_b_text, choice_c_text, choice_d_text, correct_choice, points, stars) VALUES
(3,'Pemula',1,'Sila ke-3 berbunyi...','Berkaitan dengan kesatuan bangsa.','Sila ke-3: Persatuan Indonesia.','Keadilan Sosial','Persatuan Indonesia','Ketuhanan Yang Maha Esa','Kerakyatan yang Dipimpin','B',50,1),
(3,'Pemula',2,'Simbol Sila ke-3 adalah...','Pohon besar nan kokoh.','Pohon Beringin melambangkan persatuan yang kokoh.','Bintang','Rantai','Pohon Beringin','Kepala Banteng','C',60,1),
(3,'Pemula',3,'Semboyan Bhinneka Tunggal Ika berarti...','Bhinneka = beragam, Tunggal Ika = satu jua.','Bhinneka Tunggal Ika: berbeda-beda tetapi tetap satu.','Bersatu kita teguh','Berbeda-beda tetapi tetap satu','Indonesia tanah airku','Maju terus pantang mundur','B',70,1);

-- ── SILA 3 — MENENGAH ───────────────────────────────────────────────────────
INSERT INTO public.quiz_questions (sila_num, difficulty, order_index, question_text, hint, explanation, choice_a_text, choice_b_text, choice_c_text, choice_d_text, correct_choice, points, stars) VALUES
(3,'Menengah',1,'Contoh pengamalan Sila ke-3 di sekolah adalah...','Kegiatan yang mempersatukan.','Kerja bakti bersama mencerminkan semangat persatuan.','Berkelahi dengan teman beda suku','Kerja bakti bersama','Menolak bermain dengan teman daerah lain','Mengutamakan kepentingan sendiri','B',100,2),
(3,'Menengah',2,'Pohon Beringin pada lambang Sila ke-3 melambangkan...','Pohon besar yang bercabang-cabang.','Beringin = tempat berlindung, lambang persatuan dan kesatuan.','Kemakmuran','Persatuan kokoh yang menaungi semua','Keadilan','Kepercayaan kepada Tuhan','B',120,2),
(3,'Menengah',3,'Sikap cinta tanah air ditunjukkan dengan...','Cinta produk = cinta bangsa.','Bangga produk lokal adalah salah satu wujud cinta tanah air.','Memakai produk luar negeri saja','Bangga menggunakan produk dalam negeri','Menjelek-jelekkan Indonesia','Tidak mau belajar budaya sendiri','B',140,2);

-- ── SILA 3 — PETUALANG ──────────────────────────────────────────────────────
INSERT INTO public.quiz_questions (sila_num, difficulty, order_index, question_text, hint, explanation, choice_a_text, choice_b_text, choice_c_text, choice_d_text, correct_choice, points, stars) VALUES
(3,'Petualang',1,'Kapan Sumpah Pemuda diperingati?','Berkaitan dengan pemuda Indonesia 1928.','Sumpah Pemuda diperingati setiap 28 Oktober.','17 Agustus','2 Mei','28 Oktober','1 Juni','C',200,3),
(3,'Petualang',2,'Makna persatuan bagi bangsa Indonesia adalah...','Persatuan bukan keseragaman.','Persatuan berarti bersatu dalam keberagaman untuk mencapai tujuan bersama.','Semua harus sama','Bersatu meski beragam demi kemajuan bersama','Menghapus perbedaan budaya','Mengutamakan suku mayoritas','B',240,3),
(3,'Petualang',3,'Lagu "Indonesia Raya" diciptakan oleh...','Diperdengarkan pertama 28 Oktober 1928.','Indonesia Raya diciptakan W.R. Supratman, pertama kali dikumandangkan pada Sumpah Pemuda.','Ismail Marzuki','W.R. Supratman','Chairil Anwar','H. Mutahar','B',280,3);

-- ── SILA 4 — PEMULA ─────────────────────────────────────────────────────────
INSERT INTO public.quiz_questions (sila_num, difficulty, order_index, question_text, hint, explanation, choice_a_text, choice_b_text, choice_c_text, choice_d_text, correct_choice, points, stars) VALUES
(4,'Pemula',1,'Sila ke-4 berbunyi...','Tentang demokrasi.','Sila ke-4 tentang demokrasi musyawarah mufakat.','Persatuan Indonesia','Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan','Kemanusiaan yang Adil','Keadilan Sosial','B',50,1),
(4,'Pemula',2,'Simbol Sila ke-4 adalah...','Hewan yang melambangkan kekuatan rakyat.','Kepala Banteng melambangkan tenaga rakyat yang kuat.','Bintang','Pohon Beringin','Kepala Banteng','Padi dan Kapas','C',60,1),
(4,'Pemula',3,'Musyawarah bertujuan untuk mencapai...','Mufakat = sepakat bersama.','Musyawarah bertujuan mencapai mufakat yang menguntungkan semua pihak.','Keputusan pribadi','Mufakat/kesepakatan bersama','Keuntungan ketua saja','Perpecahan kelompok','B',70,1);

-- ── SILA 4 — MENENGAH ───────────────────────────────────────────────────────
INSERT INTO public.quiz_questions (sila_num, difficulty, order_index, question_text, hint, explanation, choice_a_text, choice_b_text, choice_c_text, choice_d_text, correct_choice, points, stars) VALUES
(4,'Menengah',1,'Saat hasil voting tidak sesuai keinginan kita, kita harus...','Demokratis = menghormati keputusan bersama.','Menghormati keputusan bersama adalah nilai demokrasi Pancasila.','Marah dan keluar dari kelompok','Menerima dan menghormati keputusan bersama','Menuntut voting ulang terus','Diam dan tidak mau kerjasama','B',100,2),
(4,'Menengah',2,'DPR singkatan dari...','Lembaga legislatif Indonesia.','DPR = Dewan Perwakilan Rakyat, lembaga perwakilan rakyat di Indonesia.','Dewan Perwakilan Rakyat','Dewan Pembuat Rancangan','Departemen Pertahanan Rakyat','Dewan Pemimpin Republik','A',120,2),
(4,'Menengah',3,'Pemilu diadakan untuk...','Pemilu = proses demokrasi.','Pemilu adalah sarana rakyat memilih pemimpin secara demokratis.','Memilih pemimpin secara demokratis','Ajang hiburan masyarakat','Menentukan harga barang','Membagi-bagikan uang','A',140,2);

-- ── SILA 4 — PETUALANG ──────────────────────────────────────────────────────
INSERT INTO public.quiz_questions (sila_num, difficulty, order_index, question_text, hint, explanation, choice_a_text, choice_b_text, choice_c_text, choice_d_text, correct_choice, points, stars) VALUES
(4,'Petualang',1,'Asas pemilu di Indonesia adalah...','Singkatan tentang cara memilih yang benar.','LUBER JURDIL: Langsung, Umum, Bebas, Rahasia, Jujur, Adil.','LUBER JURDIL','ABRI dan rakyat','Gotong royong','Bhinneka Tunggal Ika','A',200,3),
(4,'Petualang',2,'Hikmat kebijaksanaan dalam Sila ke-4 berarti...','Hikmat = bijaksana dan bertanggung jawab.','Hikmat kebijaksanaan = keputusan yang diambil dengan penuh tanggung jawab demi kepentingan rakyat.','Keputusan yang cerdas dan bertanggung jawab','Pemimpin yang kaya','Kebijakan yang menguntungkan penguasa','Kebijaksanaan akademis','A',240,3),
(4,'Petualang',3,'Contoh musyawarah di lingkungan sekolah adalah...','Melibatkan semua pihak.','Pemilihan ketua kelas bersama adalah contoh musyawarah di sekolah.','Guru memutuskan sendiri tanpa tanya murid','Pemilihan ketua kelas bersama','Siswa berkelahi untuk tentukan jadwal','Kepala sekolah memerintah tanpa diskusi','B',280,3);

-- ── SILA 5 — PEMULA ─────────────────────────────────────────────────────────
INSERT INTO public.quiz_questions (sila_num, difficulty, order_index, question_text, hint, explanation, choice_a_text, choice_b_text, choice_c_text, choice_d_text, correct_choice, points, stars) VALUES
(5,'Pemula',1,'Sila ke-5 berbunyi...','Tentang keadilan untuk semua.','Sila ke-5: Keadilan Sosial bagi Seluruh Rakyat Indonesia.','Persatuan Indonesia','Kerakyatan yang Dipimpin','Keadilan Sosial bagi Seluruh Rakyat Indonesia','Ketuhanan Yang Maha Esa','C',50,1),
(5,'Pemula',2,'Simbol Sila ke-5 adalah...','Melambangkan sandang dan pangan.','Padi & Kapas melambangkan kemakmuran dan keadilan bagi seluruh rakyat.','Bintang','Rantai','Kepala Banteng','Padi dan Kapas','D',60,1),
(5,'Pemula',3,'Keadilan sosial berarti...','Adil = tidak pilih kasih.','Keadilan sosial = setiap orang mendapat hak yang sama dan diperlakukan adil.','Kaya raya untuk semua','Perlakuan yang sama dan adil untuk semua','Hanya orang miskin yang dibantu','Kebebasan tanpa batas','B',70,1);

-- ── SILA 5 — MENENGAH ───────────────────────────────────────────────────────
INSERT INTO public.quiz_questions (sila_num, difficulty, order_index, question_text, hint, explanation, choice_a_text, choice_b_text, choice_c_text, choice_d_text, correct_choice, points, stars) VALUES
(5,'Menengah',1,'Contoh pengamalan Sila ke-5 adalah...','Berbagi = wujud keadilan.','Berbagi bekal adalah wujud keadilan sosial dalam kehidupan sehari-hari.','Hanya membantu teman yang kaya','Berbagi bekal dengan teman yang tidak punya','Mengambil barang milik orang lain','Tidak mau ikut kerja bakti','B',100,2),
(5,'Menengah',2,'Gotong royong berkaitan erat dengan Sila ke...','Gotong royong = bekerja bersama untuk kemakmuran.','Gotong royong adalah wujud nyata keadilan sosial dan kebersamaan.','1','3','4','5','D',120,2),
(5,'Menengah',3,'Program pemerintah yang mencerminkan Sila ke-5 adalah...','Program yang meratakan kesempatan.','Beasiswa untuk semua kalangan adalah wujud keadilan sosial.','Beasiswa untuk semua kalangan','Pajak hanya untuk orang miskin','Larangan berjualan di pasar','Menutup sekolah di desa','A',140,2);

-- ── SILA 5 — PETUALANG ──────────────────────────────────────────────────────
INSERT INTO public.quiz_questions (sila_num, difficulty, order_index, question_text, hint, explanation, choice_a_text, choice_b_text, choice_c_text, choice_d_text, correct_choice, points, stars) VALUES
(5,'Petualang',1,'Padi pada lambang Sila ke-5 melambangkan...','Padi = makanan pokok.','Padi melambangkan kecukupan pangan sebagai hak dasar rakyat.','Kekayaan alam','Kebutuhan pangan yang tercukupi','Pertanian tradisional','Persatuan petani','B',200,3),
(5,'Petualang',2,'Kapas pada lambang Sila ke-5 melambangkan...','Kapas = bahan pakaian.','Kapas melambangkan terpenuhinya kebutuhan sandang sebagai hak dasar.','Kebersihan','Kebutuhan sandang/pakaian yang terpenuhi','Alam yang indah','Kemerdekaan','B',240,3),
(5,'Petualang',3,'Ciri masyarakat adil dan makmur menurut Pancasila adalah...','Adil = hak-kewajiban seimbang.','Masyarakat adil makmur: setiap warga terpenuhi hak dasarnya dan menjalankan kewajibannya.','Semua orang menjadi kaya raya','Hak dan kewajiban setiap warga terpenuhi secara seimbang','Tidak ada perbedaan sama sekali','Pemerintah mengatur segalanya','B',280,3);
