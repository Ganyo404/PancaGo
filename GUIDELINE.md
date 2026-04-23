# Development Guideline - PancaGo! 🛠️

Dokumen ini berisi panduan teknis bagi pengembang yang ingin memodifikasi atau menambahkan konten ke dalam aplikasi PancaGo.

---

## 1. Manajemen State (Zustand)

Aplikasi menggunakan **Zustand** yang terletak di folder `/store`. Semua state bersifat **persisten** menggunakan `AsyncStorage`.

- **`useUserStore.js`**: Mengelola data profil user (nama, poin, level, karakter yang dimiliki, dan karakter yang sedang dipakai).
- **`useProgressStore.js`**: Mengelola progres penyelesaian misi dan status kunci setiap Sila.
- **`useShopStore.js`**: Logika untuk validasi pembelian karakter.

### Cara Menggunakan Store:
```javascript
import { useUserStore } from '../store/useUserStore';

const { name, points, addPoints } = useUserStore();
```

---

## 2. Menambahkan Materi Kuis Baru

Data kuis tersimpan di `assets/data/quizData.js`. Anda dapat menambahkan set kuis baru dengan mengikuti struktur berikut:

```javascript
// assets/data/quizData.js
export const QUIZ_SETS = {
  'quiz-id-baru': {
    title: 'Judul Kuis',
    questions: [
      {
        id: 1,
        question: 'Pertanyaannya apa?',
        options: ['A', 'B', 'C'],
        answer: 0, // Index jawaban benar
      },
    ],
  },
};
```

---

## 3. Menambahkan Karakter Baru

Aset gambar karakter harus diletakkan di `assets/images/characters/[NamaKarakter]/`. Setiap karakter sebaiknya memiliki 5 variasi pose.

Setelah gambar ditambahkan, daftarkan di `constants/characters.js`:

```javascript
// constants/characters.js
{
  id: 'id-baru',
  name: 'Nama',
  desc: 'Deskripsi singkat',
  category: 'Kategori',
  rarity: 'Epic',
  locked: true,
  pts: 1000,
  image: require('../assets/images/characters/Folder/Pose1.png'),
  poses: [
    require('../assets/images/characters/Folder/Pose1.png'),
    // ... sampai Pose 5
  ],
}
```

---

## 4. Alur Navigasi (Expo Router)

Aplikasi menggunakan **File-based Routing**:
- `app/index.js`: Logic penentu rute (Splash vs Home).
- `app/splash.js`: Layar selamat datang.
- `app/onboarding.js`: Pendaftaran awal.
- `app/home.js`: Dashboard utama.
- `app/quiz/[id].js`: Halaman kuis dinamis.

---

## 5. Tips Pengembangan

- **Penyesuaian Font:** Jika ingin mengubah ukuran font secara massal, gunakan skrip `increase_font.js`.
- **Perbaikan Aset:** Jika mengubah cara import gambar, pastikan menjalankan `fix_image_source.js` untuk menyesuaikan prop `source` pada komponen Image.
- **Debugging:** Gunakan `console.log` di terminal Expo untuk melacak perubahan state pada Zustand.

---

**Terima kasih telah berkontribusi untuk edukasi anak Indonesia!** 🇮🇩
