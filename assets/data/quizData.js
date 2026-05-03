// quizData.js — 9 kuis per sila (Pemula #1-3, Menengah #4-6, Petualang #7-9)

const makeQ = (id, text, choices, correctId, hint = '', explanation = '') => ({
  id, text, hint, explanation,
  choices: choices.map(([cid, ctxt, ok]) => ({ id: cid, text: ctxt, isCorrect: ok })),
  correctId,
});

// ─── SILA 1 ───────────────────────────────────────────────────────────────────
const S1Q = [
  makeQ('s1q1','Apa bunyi Sila ke-1 Pancasila?',[['A','Ketuhanan Yang Maha Esa',true],['B','Persatuan Indonesia',false],['C','Kemanusiaan yang Adil',false],['D','Keadilan Sosial',false]],'A','Berkaitan dengan kepercayaan kepada Tuhan.','Sila ke-1: Ketuhanan Yang Maha Esa.'),
  makeQ('s1q2','Simbol Sila ke-1 adalah...',[['A','Rantai',false],['B','Bintang Emas',true],['C','Pohon Beringin',false],['D','Padi & Kapas',false]],'B','Benda bercahaya di langit malam.','Bintang melambangkan cahaya rohani.'),
  makeQ('s1q3','Contoh pengamalan Sila ke-1 kecuali...',[['A','Berdoa sebelum belajar',false],['B','Menghormati ibadah teman',false],['C','Mengejek teman beribadah',true],['D','Menjalankan ibadah tertib',false]],'C','Cari sikap yang tidak menghormati agama.','Mengejek teman beribadah melanggar toleransi.'),
  makeQ('s1q4','Toleransi beragama berarti...',[['A','Memaksakan agama kita',false],['B','Menghormati perbedaan keyakinan',true],['C','Mengabaikan agama orang lain',false],['D','Melarang orang beribadah',false]],'B','Hargai perbedaan.','Toleransi = menghormati perbedaan.'),
  makeQ('s1q5','Berapa agama resmi yang diakui di Indonesia?',[['A','4',false],['B','5',false],['C','6',true],['D','7',false]],'C','Hitung agama yang ada KTP-nya.','Indonesia mengakui 6 agama resmi.'),
  makeQ('s1q6','Sikap yang benar saat teman sedang beribadah adalah...',[['A','Mengganggu',false],['B','Menghormati dan tidak mengganggu',true],['C','Mengajak pergi',false],['D','Mentertawakannya',false]],'B','Hargai waktu ibadah orang lain.','Menghormati ibadah orang lain wujud toleransi.'),
  makeQ('s1q7','Nilai utama Sila ke-1 adalah...',[['A','Gotong royong',false],['B','Musyawarah',false],['C','Ketakwaan kepada Tuhan',true],['D','Keadilan sosial',false]],'C','Sila ini tentang hubungan manusia-Tuhan.','Nilai utama sila ke-1 adalah ketakwaan kepada Tuhan YME.'),
  makeQ('s1q8','Pancasila sebagai dasar negara disahkan pada...',[['A','17 Agustus 1945',false],['B','1 Juni 1945',false],['C','18 Agustus 1945',true],['D','22 Juni 1945',false]],'C','Tanggal pengesahan UUD 1945.','Pancasila disahkan 18 Agustus 1945 bersama UUD 1945.'),
  makeQ('s1q9','Siapa yang pertama mencetuskan istilah Pancasila?',[['A','Moh. Hatta',false],['B','Soekarno',true],['C','Moh. Yamin',false],['D','Soepomo',false]],'B','Presiden pertama RI.','Soekarno mencetuskan istilah Pancasila pada 1 Juni 1945.'),
];

// ─── SILA 2 ───────────────────────────────────────────────────────────────────
const S2Q = [
  makeQ('s2q1','Sila ke-2 berbunyi...',[['A','Persatuan Indonesia',false],['B','Kemanusiaan yang Adil dan Beradab',true],['C','Ketuhanan Yang Maha Esa',false],['D','Keadilan Sosial',false]],'B','Berkaitan dengan kemanusiaan.','Sila ke-2: Kemanusiaan yang Adil dan Beradab.'),
  makeQ('s2q2','Simbol Sila ke-2 adalah...',[['A','Bintang',false],['B','Rantai Emas',true],['C','Pohon Beringin',false],['D','Kepala Banteng',false]],'B','Benda penghubung yang berbentuk lingkaran.','Rantai melambangkan hubungan antar manusia yang saling terkait.'),
  makeQ('s2q3','Saat teman kita jatuh, kita sebaiknya...',[['A','Menertawakannya',false],['B','Pura-pura tidak melihat',false],['C','Membantu dan menanyakan kondisinya',true],['D','Lari meninggalkannya',false]],'C','Bayangkan jika kamu yang jatuh.','Menolong teman adalah bentuk nilai kemanusiaan.'),
  makeQ('s2q4','HAM adalah singkatan dari...',[['A','Hak Asasi Manusia',true],['B','Hukum Adat Masyarakat',false],['C','Hak Atas Milik',false],['D','Hubungan Antar Manusia',false]],'A','Hak yang dimiliki setiap orang sejak lahir.','HAM = Hak Asasi Manusia, hak dasar setiap manusia.'),
  makeQ('s2q5','Sikap yang mencerminkan Sila ke-2 adalah...',[['A','Memilih teman berdasarkan suku',false],['B','Bersikap adil kepada semua orang',true],['C','Mengutamakan kepentingan sendiri',false],['D','Membeda-bedakan teman',false]],'B','Adil = tidak pilih kasih.','Bersikap adil kepada semua adalah wujud kemanusiaan.'),
  makeQ('s2q6','Keberadaban dalam Sila ke-2 berarti...',[['A','Kaya raya',false],['B','Sopan dan bermartabat',true],['C','Pandai berbicara',false],['D','Berani berkelahi',false]],'B','Beradab = berperilaku baik.','Beradab berarti bersikap sopan dan menjunjung martabat.'),
  makeQ('s2q7','Dasar hukum HAM di Indonesia tercantum di...',[['A','Pancasila saja',false],['B','UUD 1945 pasal 28',true],['C','KUHP pasal 1',false],['D','TAP MPR 1966',false]],'B','Pasal tentang hak warga negara.','HAM diatur dalam UUD 1945 pasal 28A-28J.'),
  makeQ('s2q8','Tindakan yang melanggar Sila ke-2 adalah...',[['A','Donor darah',false],['B','Bully/perundungan',true],['C','Kerja bakti',false],['D','Menghormati orang tua',false]],'B','Menyakiti orang lain melanggar nilai kemanusiaan.','Bullying melanggar HAM dan nilai kemanusiaan.'),
  makeQ('s2q9','Rantai pada lambang Sila ke-2 terdiri dari mata rantai...',[['A','Bulat dan persegi',true],['B','Hanya bulat',false],['C','Hanya persegi',false],['D','Segitiga dan bulat',false]],'A','Ada dua bentuk berbeda.','Mata rantai bulat (perempuan) & persegi (laki-laki) = semua manusia saling berkaitan.'),
];

// ─── SILA 3 ───────────────────────────────────────────────────────────────────
const S3Q = [
  makeQ('s3q1','Sila ke-3 berbunyi...',[['A','Keadilan Sosial',false],['B','Persatuan Indonesia',true],['C','Ketuhanan Yang Maha Esa',false],['D','Kerakyatan yang Dipimpin',false]],'B','Berkaitan dengan kesatuan bangsa.','Sila ke-3: Persatuan Indonesia.'),
  makeQ('s3q2','Simbol Sila ke-3 adalah...',[['A','Bintang',false],['B','Rantai',false],['C','Pohon Beringin',true],['D','Kepala Banteng',false]],'C','Pohon besar nan kokoh.','Pohon Beringin melambangkan persatuan yang kokoh.'),
  makeQ('s3q3','Semboyan Bhinneka Tunggal Ika berarti...',[['A','Bersatu kita teguh',false],['B','Berbeda-beda tetapi tetap satu',true],['C','Indonesia tanah airku',false],['D','Maju terus pantang mundur',false]],'B','Bhinneka = beragam, Tunggal Ika = satu jua.','Bhinneka Tunggal Ika: berbeda-beda tetapi tetap satu.'),
  makeQ('s3q4','Contoh pengamalan Sila ke-3 di sekolah adalah...',[['A','Berkelahi dengan teman beda suku',false],['B','Kerja bakti bersama',true],['C','Menolak bermain dengan teman daerah lain',false],['D','Mengutamakan kepentingan sendiri',false]],'B','Kegiatan yang mempersatukan.','Kerja bakti bersama mencerminkan semangat persatuan.'),
  makeQ('s3q5','Pohon Beringin pada lambang Sila ke-3 melambangkan...',[['A','Kemakmuran',false],['B','Persatuan kokoh yang menaungi semua',true],['C','Keadilan',false],['D','Kepercayaan kepada Tuhan',false]],'B','Pohon besar yang bercabang-cabang.','Beringin = tempat berlindung, lambang persatuan dan kesatuan.'),
  makeQ('s3q6','Sikap cinta tanah air ditunjukkan dengan...',[['A','Memakai produk luar negeri saja',false],['B','Bangga menggunakan produk dalam negeri',true],['C','Menjelek-jelekkan Indonesia',false],['D','Tidak mau belajar budaya sendiri',false]],'B','Cinta produk = cinta bangsa.','Bangga produk lokal adalah salah satu wujud cinta tanah air.'),
  makeQ('s3q7','Kapan Sumpah Pemuda diperingati?',[['A','17 Agustus',false],['B','2 Mei',false],['C','28 Oktober',true],['D','1 Juni',false]],'C','Berkaitan dengan pemuda Indonesia 1928.','Sumpah Pemuda diperingati setiap 28 Oktober.'),
  makeQ('s3q8','Makna persatuan bagi bangsa Indonesia adalah...',[['A','Semua harus sama',false],['B','Bersatu meski beragam demi kemajuan bersama',true],['C','Menghapus perbedaan budaya',false],['D','Mengutamakan suku mayoritas',false]],'B','Persatuan bukan keseragaman.','Persatuan berarti bersatu dalam keberagaman untuk mencapai tujuan bersama.'),
  makeQ('s3q9','Lagu "Indonesia Raya" diciptakan oleh...',[['A','Ismail Marzuki',false],['B','W.R. Supratman',true],['C','Chairil Anwar',false],['D','H. Mutahar',false]],'B','Diperdengarkan pertama 28 Oktober 1928.','Indonesia Raya diciptakan W.R. Supratman, pertama kali dikumandangkan pada Sumpah Pemuda.'),
];

// ─── SILA 4 ───────────────────────────────────────────────────────────────────
const S4Q = [
  makeQ('s4q1','Sila ke-4 berbunyi...',[['A','Persatuan Indonesia',false],['B','Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan',true],['C','Kemanusiaan yang Adil',false],['D','Keadilan Sosial',false]],'B','Tentang demokrasi.','Sila ke-4 tentang demokrasi musyawarah mufakat.'),
  makeQ('s4q2','Simbol Sila ke-4 adalah...',[['A','Bintang',false],['B','Pohon Beringin',false],['C','Kepala Banteng',true],['D','Padi dan Kapas',false]],'C','Hewan yang melambangkan kekuatan rakyat.','Kepala Banteng melambangkan tenaga rakyat yang kuat.'),
  makeQ('s4q3','Musyawarah bertujuan untuk mencapai...',[['A','Keputusan pribadi',false],['B','Mufakat/kesepakatan bersama',true],['C','Keuntungan ketua saja',false],['D','Perpecahan kelompok',false]],'B','Mufakat = sepakat bersama.','Musyawarah bertujuan mencapai mufakat yang menguntungkan semua pihak.'),
  makeQ('s4q4','Saat hasil voting tidak sesuai keinginan kita, kita harus...',[['A','Marah dan keluar dari kelompok',false],['B','Menerima dan menghormati keputusan bersama',true],['C','Menuntut voting ulang terus',false],['D','Diam dan tidak mau kerjasama',false]],'B','Demokratis = menghormati keputusan bersama.','Menghormati keputusan bersama adalah nilai demokrasi Pancasila.'),
  makeQ('s4q5','DPR singkatan dari...',[['A','Dewan Perwakilan Rakyat',true],['B','Dewan Pembuat Rancangan',false],['C','Departemen Pertahanan Rakyat',false],['D','Dewan Pemimpin Republik',false]],'A','Lembaga legislatif Indonesia.','DPR = Dewan Perwakilan Rakyat, lembaga perwakilan rakyat di Indonesia.'),
  makeQ('s4q6','Pemilu diadakan untuk...',[['A','Memilih pemimpin secara demokratis',true],['B','Ajang hiburan masyarakat',false],['C','Menentukan harga barang',false],['D','Membagi-bagikan uang',false]],'A','Pemilu = proses demokrasi.','Pemilu adalah sarana rakyat memilih pemimpin secara demokratis.'),
  makeQ('s4q7','Asas pemilu di Indonesia adalah...',[['A','LUBER JURDIL',true],['B','ABRI dan rakyat',false],['C','Gotong royong',false],['D','Bhinneka Tunggal Ika',false]],'A','Singkatan tentang cara memilih yang benar.','LUBER JURDIL: Langsung, Umum, Bebas, Rahasia, Jujur, Adil.'),
  makeQ('s4q8','Hikmat kebijaksanaan dalam Sila ke-4 berarti...',[['A','Keputusan yang cerdas dan bertanggung jawab',true],['B','Pemimpin yang kaya',false],['C','Kebijakan yang menguntungkan penguasa',false],['D','Kebijaksanaan akademis',false]],'A','Hikmat = bijaksana dan bertanggung jawab.','Hikmat kebijaksanaan = keputusan yang diambil dengan penuh tanggung jawab demi kepentingan rakyat.'),
  makeQ('s4q9','Contoh musyawarah di lingkungan sekolah adalah...',[['A','Guru memutuskan sendiri tanpa tanya murid',false],['B','Pemilihan ketua kelas bersama',true],['C','Siswa berkelahi untuk tentukan jadwal',false],['D','Kepala sekolah memerintah tanpa diskusi',false]],'B','Melibatkan semua pihak.','Pemilihan ketua kelas bersama adalah contoh musyawarah di sekolah.'),
];

// ─── SILA 5 ───────────────────────────────────────────────────────────────────
const S5Q = [
  makeQ('s5q1','Sila ke-5 berbunyi...',[['A','Persatuan Indonesia',false],['B','Kerakyatan yang Dipimpin',false],['C','Keadilan Sosial bagi Seluruh Rakyat Indonesia',true],['D','Ketuhanan Yang Maha Esa',false]],'C','Tentang keadilan untuk semua.','Sila ke-5: Keadilan Sosial bagi Seluruh Rakyat Indonesia.'),
  makeQ('s5q2','Simbol Sila ke-5 adalah...',[['A','Bintang',false],['B','Rantai',false],['C','Kepala Banteng',false],['D','Padi dan Kapas',true]],'D','Melambangkan sandang dan pangan.','Padi & Kapas melambangkan kemakmuran dan keadilan bagi seluruh rakyat.'),
  makeQ('s5q3','Keadilan sosial berarti...',[['A','Kaya raya untuk semua',false],['B','Perlakuan yang sama dan adil untuk semua',true],['C','Hanya orang miskin yang dibantu',false],['D','Kebebasan tanpa batas',false]],'B','Adil = tidak pilih kasih.','Keadilan sosial = setiap orang mendapat hak yang sama dan diperlakukan adil.'),
  makeQ('s5q4','Contoh pengamalan Sila ke-5 adalah...',[['A','Hanya membantu teman yang kaya',false],['B','Berbagi bekal dengan teman yang tidak punya',true],['C','Mengambil barang milik orang lain',false],['D','Tidak mau ikut kerja bakti',false]],'B','Berbagi = wujud keadilan.','Berbagi bekal adalah wujud keadilan sosial dalam kehidupan sehari-hari.'),
  makeQ('s5q5','Gotong royong berkaitan erat dengan Sila ke...',[['A','1',false],['B','3',false],['C','4',false],['D','5',true]],'D','Gotong royong = bekerja bersama untuk kemakmuran.','Gotong royong adalah wujud nyata keadilan sosial dan kebersamaan.'),
  makeQ('s5q6','Program pemerintah yang mencerminkan Sila ke-5 adalah...',[['A','Beasiswa untuk semua kalangan',true],['B','Pajak hanya untuk orang miskin',false],['C','Larangan berjualan di pasar',false],['D','Menutup sekolah di desa',false]],'A','Program yang meratakan kesempatan.','Beasiswa untuk semua kalangan adalah wujud keadilan sosial.'),
  makeQ('s5q7','Padi pada lambang Sila ke-5 melambangkan...',[['A','Kekayaan alam',false],['B','Kebutuhan pangan yang tercukupi',true],['C','Pertanian tradisional',false],['D','Persatuan petani',false]],'B','Padi = makanan pokok.','Padi melambangkan kecukupan pangan sebagai hak dasar rakyat.'),
  makeQ('s5q8','Kapas pada lambang Sila ke-5 melambangkan...',[['A','Kebersihan',false],['B','Kebutuhan sandang/pakaian yang terpenuhi',true],['C','Alam yang indah',false],['D','Kemerdekaan',false]],'B','Kapas = bahan pakaian.','Kapas melambangkan terpenuhinya kebutuhan sandang sebagai hak dasar.'),
  makeQ('s5q9','Ciri masyarakat adil dan makmur menurut Pancasila adalah...',[['A','Semua orang menjadi kaya raya',false],['B','Hak dan kewajiban setiap warga terpenuhi secara seimbang',true],['C','Tidak ada perbedaan sama sekali',false],['D','Pemerintah mengatur segalanya',false]],'B','Adil = hak-kewajiban seimbang.','Masyarakat adil makmur: setiap warga terpenuhi hak dasarnya dan menjalankan kewajibannya.'),
];

// ─── Konfigurasi per-nomor quiz ────────────────────────────────────────────────
const LEVELS = [
  { num: 1, level: 'Pemula',    stars: 1, points: 50  },
  { num: 2, level: 'Pemula',    stars: 1, points: 60  },
  { num: 3, level: 'Pemula',    stars: 1, points: 70  },
  { num: 4, level: 'Menengah',  stars: 2, points: 100 },
  { num: 5, level: 'Menengah',  stars: 2, points: 120 },
  { num: 6, level: 'Menengah',  stars: 2, points: 140 },
  { num: 7, level: 'Petualang', stars: 3, points: 200 },
  { num: 8, level: 'Petualang', stars: 3, points: 240 },
  { num: 9, level: 'Petualang', stars: 3, points: 280 },
];

const SILA_NAMES = [
  'Ketuhanan Yang Maha Esa',
  'Kemanusiaan yang Adil dan Beradab',
  'Persatuan Indonesia',
  'Kerakyatan yang Dipimpin oleh Hikmat',
  'Keadilan Sosial bagi Seluruh Rakyat',
];

const ALL_QUESTIONS = [S1Q, S2Q, S3Q, S4Q, S5Q];

// ─── Build QUIZ_SETS: 9 per sila = 45 total ────────────────────────────────────
export const QUIZ_SETS = [];
for (let s = 1; s <= 5; s++) {
  for (let n = 0; n < 9; n++) {
    const cfg = LEVELS[n];
    QUIZ_SETS.push({
      id: `quiz-sila${s}-${cfg.num}`,
      silaNum: s,
      quizNum: cfg.num,
      title: `SILA ${s} #${cfg.num}`,
      silaName: SILA_NAMES[s - 1],
      level: cfg.level,
      stars: cfg.stars,
      points: cfg.points,
      questions: [ALL_QUESTIONS[s - 1][n]],
    });
  }
}

// ─── Untuk kompatibilitas layar lama ──────────────────────────────────────────
export const getQuizById = (id) => QUIZ_SETS.find((q) => q.id === id);
export const getQuizBySila = (silaNum) => QUIZ_SETS.filter((q) => q.silaNum === silaNum);
