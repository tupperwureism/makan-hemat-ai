# PROPOSAL & PRESENTASI PITCH DECK: WARUNGBUDGET AI v2
Solving Real Problems with AI Collaboration (Tugas Besar AI For Real Impact 2026)

---

# Slide 1: WARUNGBUDGET AI (v2.0)
## Solving Real Problems with AI Collaboration
* **Deskripsi:** Aplikasi Rekomendasi Makanan Ekonomis Mahasiswa Kos Tembalang Berbasis Peta Lokasi & Database Dinamis.
* **Kelompok:** AI For Real Impact 2026
* **Anggota:** [Nama Anda] (NIM) | [Nama Anggota] (NIM) | [Nama Anggota] (NIM)

---

# Slide 2: Latar Belakang & Urgensi Masalah
## Mengapa Masalah Ini Penting untuk Diselesaikan?
* **Krisis Finansial & Gizi:** Mahasiswa kos di area Tembalang (UNDIP) sering kesulitan mengelola uang saku harian untuk konsumsi makan secara teratur di akhir bulan.
* **Dampak Buruk:** Pola makan tidak teratur, makan mie instan berlebih, penurunan daya tahan tubuh, dan gangguan konsentrasi kuliah.
* **Kesenjangan Informasi:** Banyak warung murah tersembunyi di gang-gang Tembalang yang tidak terpetakan secara digital.
* **Target Pengguna:** Mahasiswa rantau/kos dengan budget ketat di kawasan Tembalang, Semarang.

---

# Slide 3: Solusi Unggulan: WarungBudget AI v2
## Mengubah Web Statis v1 Menjadi Platform Dinamis & Interaktif
* **Kalkulator Budget Pintar:** Membagi jatah sisa anggaran bulanan/mingguan menjadi jatah makan harian secara presisi.
* **Peta Interaktif Leaflet:** Memvisualisasikan sebaran lokasi warung makan murah terdekat secara nyata tanpa Google Maps API berbayar.
* **Resep Masak Kos Sehat:** Memberikan instruksi detail memasak hemat lengkap dengan estimasi waktu dan kandungan gizi (protein tinggi).

---

# Slide 4: Fitur Utama Aplikasi
## Rangkaian Fitur Pendukung Problem Solving
* **Pengolah Anggaran Fleksibel:** Input total uang saku lalu bagi menjadi opsi: Sekali Makan, Harian, atau Bulanan.
* **Integrasi Peta Leaflet:** Menandai sebaran titik kuliner murah Tembalang dengan popup koordinat menu.
* **Filter Nutrisi & Harga:** Filter menu makanan berdasarkan rentang harga, kandungan protein tinggi, dan sayur.
* **Admin Panel CRUD:** Pengelolaan database warung makan dan resep memasak kos secara dinamis dan real-time.

---

# Slide 5: Arsitektur & Teknologi Stack
## Landasan Teknis yang Cepat dan Terstruktur
* **Frontend & UI:** React, TypeScript, dan Tailwind CSS (menerapkan desain premium Glassmorphism transparan dan responsif).
* **Meta-Framework:** TanStack Start (File-based routing & Server-side Rendering).
* **Penyimpanan (Database):** Local Server JSON (`src/lib/db.json`) untuk akses data instan tanpa latensi database eksternal.
* **Serverless Hosting:** Vercel Cloud Serverless Functions dengan Nitro compiler.

---

# Slide 6: Pemanfaatan Collaborative AI
## Peran Masing-masing AI Tools dalam Pengembangan Proyek
* **Gemini / ChatGPT:** Brainstorming ide fitur (filter gizi) dan mendesain skema database lokal JSON.
* **Tailwind v4 / Lovable:** Merancang antarmuka glassmorphism modern dan sistem toggle auto/manual dark mode.
* **Antigravity AI / Cursor:** Akselerasi penulisan kode routing file-based dan Server Functions CRUD.
* **Claude:** Debugging error kompilasi SSR Leaflet dan optimasi deployment Vercel.

---

# Slide 7: Validasi, Revisi, dan Refleksi
## Berpikir Kritis terhadap Output AI
* **Resolusi Bug SSR Peta:** AI meng-generate inisialisasi peta secara naif di server Node. Kami memperbaikinya dengan lazy dynamic import di dalam useEffect agar inisialisasi berjalan di client browser.
* **Resolusi Bug 404 Vercel:** Merevisi setelan bundling Nitro di `vite.config.ts` untuk memaksa Vercel target.
* **Refleksi Utama:** AI melipatgandakan kecepatan produksi prototype, namun pengawasan kritis manusia mutlak diperlukan untuk validasi logika runtime dan menjaga empati terhadap masalah sosial anak kos.
