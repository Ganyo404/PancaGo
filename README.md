# PancaGo! 🇮🇩

**PancaGo!** adalah aplikasi mobile edukasi interaktif yang dirancang khusus untuk anak-anak agar dapat mempelajari nilai-nilai Pancasila dengan cara yang seru dan menyenangkan. Melalui petualangan misi, kuis menantang, dan koleksi karakter unik, anak-anak akan belajar memahami dan mengamalkan Pancasila dalam kehidupan sehari-hari.

---

## 🚀 Fitur Utama

- **Petualangan Misi (Mission Map):** Peta perjalanan interaktif untuk mempelajari Sila 1 sampai 5.
- **Sistem Kuis:** Uji pemahaman dengan kuis interaktif dan kumpulkan poin Panca!
- **Koleksi Karakter:** Pilih dan beli karakter unik (Asih, Garuda, Komo, Mauwi) yang memiliki animasi pose keren.
- **Profil Petualang:** Pantau progres belajar, level, dan statistik pencapaianmu.
- **Session Persisten:** Data nama, poin, dan karakter tersimpan secara otomatis sehingga petualangan bisa dilanjutkan kapan saja.

## 🛠️ Tech Stack

Aplikasi ini dibangun menggunakan teknologi modern:
- **Framework:** [React Native](https://reactnative.dev/) dengan [Expo](https://expo.dev/).
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing).
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) untuk manajemen state yang ringan dan cepat.
- **Persistence:** [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) untuk penyimpanan data lokal.
- **Styling:** React Native StyleSheet dengan desain kustom yang *child-friendly*.

---

## 📦 Instalasi & Cara Menjalankan

### Prasyarat
Pastikan Anda sudah menginstal **Node.js** dan **npm** di komputer Anda.

### Langkah-langkah:
1. **Clone Repository:**
   ```bash
   git clone https://github.com/Ganyo404/PancaGo.git
   cd PancaGo
   ```

2. **Instal Dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan Aplikasi:**
   ```bash
   npx expo start
   ```
   *Gunakan aplikasi **Expo Go** di Android/iOS untuk scan QR Code, atau tekan `w` untuk membuka di browser.*

---

## 📂 Struktur Folder

- `/app`: Folder utama Expo Router (Routing & Layout).
- `/components`: Komponen UI dan Screen utama aplikasi.
- `/constants`: Data statis seperti daftar karakter dan tema warna.
- `/store`: Logika State Management (User, Progres, dan Toko).
- `/assets`: Aset gambar, ikon, dan data JSON (Kuis & Misi).

---

## 🤝 Kontribusi

Kami sangat terbuka untuk kontribusi! Jika Anda ingin meningkatkan materi edukasi atau menambahkan fitur baru, silakan lakukan *Fork* repository ini dan kirimkan *Pull Request*.

**PancaGo! - Belajar Pancasila Lebih Seru!**
