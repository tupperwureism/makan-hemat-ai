# DOKUMENTASI PENGGUNAAN COLLABORATIVE AI
Proyek WarungBudget AI v2

## A. AI Tools yang Digunakan
| Aktivitas | Tools AI | Deskripsi Peran |
| :--- | :--- | :--- |
| Brainstorming Solusi | Gemini / ChatGPT | Menentukan ide fitur (filter protein, budget bulanan) & struktur database JSON lokal. |
| UI/UX & Glassmorphism | Tailwind v4 / Lovable | Menyusun gaya visual modern dengan gradasi transparan (glassmorphism) yang responsif. |
| Penulisan Kode (Coding) | Antigravity AI / Cursor | Membangun routing berbasis file (file-based routing) dan SSR Server Functions. |
| Validasi & Debugging | Claude / Antigravity AI | Memecahkan error SSR pada peta Leaflet dan error compiler Nitro Vercel (404 routing). |

## B. Prompt Utama yang Digunakan
1. *Prompt Perancangan Database:*
   > "Bantu buatkan struktur database lokal berbentuk JSON untuk menu makanan mahasiswa kos di Tembalang. Database harus memiliki field: id, nama menu, harga, protein (tinggi/sedang/rendah), ada sayur (yes/no), koordinat maps, dan langkah memasak jika itu resep."
2. *Prompt Pemecahan Isu SSR Peta:*
   > "Saya menggunakan Leaflet Map di React TanStack Start, tetapi error 'window is not defined' saat kompilasi SSR. Bagaimana cara membuat inisialisasi petanya aman di client-side saja?"

## C. Validasi, Revisi, dan Perbaikan Manual terhadap Hasil AI
* **Kesalahan AI yang Ditemukan:** 
  1. AI menuliskan kode inisialisasi objek Leaflet secara langsung di level komponen teratas. Hal ini memicu error fatal saat SSR karena server Node.js tidak memiliki objek browser `window`.
  2. Saat awal deployment Vercel, Nitro mendeteksi preset static secara default yang memicu error `404: NOT_FOUND` pada Vercel.
* **Revisi dan Validasi yang Dilakukan:**
  1. *Perbaikan Peta:* Kami memodifikasi kode secara manual dengan menerapkan *lazy import* di dalam blok `useEffect` sehingga modul Leaflet hanya dimuat setelah komponen berhasil dipasang (*mounted*) di browser client.
  2. *Perbaikan Deploy:* Kami mengubah setelan preset Nitro secara manual pada `vite.config.ts` menjadi `nitro: { preset: 'vercel' }` agar Vercel mengenali routing serverless secara benar.

## D. Refleksi Kelompok terhadap Pemanfaatan AI
* **Manfaat AI:** Memangkas waktu pembuatan kode dasar (*boilerplate*) hingga 70% dan membantu mendiagnosis error kompilasi dengan cepat.
* **Keterbatasan AI:** AI sering kali melewatkan aspek runtime yang berbeda antara lingkungan Server (SSR Node) dan Browser (Client), sehingga validasi manual dan penyesuaian logika oleh manusia tetap sangat krusial.
