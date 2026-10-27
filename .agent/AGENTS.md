# AGENTS.md — Simulasi Phet (Web Pembelajaran Kimia: Asam Basa)

Aturan kerja untuk agen. Baca seluruhnya sebelum menulis kode.
Setiap aturan harus bisa diperiksa dengan jawaban "ya / tidak".

## 1. Konteks Proyek
- Media belajar web untuk siswa SMA kelas XI, topik asam dan basa.
- Fitur inti: 3 modul, kuis dengan umpan balik, penyimpanan progres anonim, video interaktif, kalkulator pH.
- Fitur tambahan (kerjakan hanya setelah fitur inti selesai): pencarian materi.

## 2. Teknologi
- Gunakan React + Vite; hanya komponen fungsional dan hooks.
- Gunakan JavaScript (bukan TypeScript) kecuali diminta.
- Styling dengan CSS biasa atau CSS Modules; jangan menambah pustaka UI besar.
- Tidak ada backend, database, atau API luar milik sendiri.
- Jangan menambah dependensi baru tanpa menyebutkan alasannya di akhir jawaban.
- Simulasi PhET hanya disematkan lewat `<iframe>` dari `phet.colorado.edu`, dengan atribusi PhET tampil di halaman.

## 3. Penyimpanan
- Progres disimpan di `localStorage` saja.
- Data yang boleh disimpan: ID acak, modul selesai, skor kuis, posisi terakhir.
- Dilarang menyimpan nama, email, nomor telepon, atau data pribadi lain.
- Semua akses `localStorage` dibungkus `try/catch`; aplikasi tetap jalan bila penyimpanan gagal.
- Tersedia tombol "Hapus progres" yang benar-benar mengosongkan data.
- Tidak memakai pelacak atau analitik pihak ketiga.

## 4. Struktur Folder
- Komponen di `src/components/`, satu komponen per berkas, nama berkas PascalCase.
- Halaman modul di `src/pages/` (Modul1, Modul2, Modul3, Kalkulator).
- Soal kuis dan teks materi disimpan sebagai data di `src/data/`, bukan ditulis langsung di komponen.
- Fungsi hitung (pH, pOH) di `src/utils/ph.js`, terpisah dari tampilan.
- Aset gambar dan video di `public/assets/`.

## 5. Bahasa
- Seluruh teks tampilan memakai bahasa Indonesia baku dan komunikatif, sesuai untuk siswa SMA.
- Kalimat singkat; hindari istilah asing yang tidak dijelaskan.
- Pesan galat harus ramah dan memberi langkah perbaikan (contoh: "Masukkan angka lebih dari 0").
- Nama variabel dan komentar kode boleh memakai bahasa Inggris atau Indonesia, tetapi konsisten dalam satu berkas.

## 6. Notasi Kimia
- Rumus kimia ditulis dengan subskrip dan superskrip yang benar: H₂SO₄, Ca²⁺, OH⁻, H₃O⁺, ΔH.
- Pakai `<sub>` dan `<sup>` atau karakter Unicode; jangan menulis "H2SO4" atau "Ca2+".
- Konsentrasi memakai satuan M (mol/L); bilangan kecil memakai notasi ilmiah (contoh: 1,0 × 10⁻⁵).
- Angka desimal memakai koma (1,5), sesuai kaidah bahasa Indonesia, di semua teks tampilan.

## 7. Aturan Perhitungan (Kalkulator pH)
- Asam kuat: [H⁺] = a × M; pH = −log [H⁺].
- Asam lemah: [H⁺] = √(Ka × M).
- Basa kuat: [OH⁻] = b × M; pOH = −log [OH⁻].
- Basa lemah: [OH⁻] = √(Kb × M).
- pH + pOH = 14 (suhu 25 °C).
- Input harus angka positif; tolak 0, negatif, dan teks kosong dengan pesan galat.
- Hasil ditampilkan bersama langkah perhitungan (rumus dan substitusi nilai).
- Setiap fungsi di `ph.js` memiliki minimal satu contoh uji dengan nilai yang bisa dicek manual.

## 8. Kuis dan Umpan Balik
- Setiap soal memiliki: pertanyaan, pilihan jawaban, kunci, dan penjelasan.
- Umpan balik muncul tepat setelah siswa menjawab, berisi benar/salah dan alasan.
- Urutan soal dan pilihan jawaban diacak; siswa boleh mengulang kuis.
- Jangan menampilkan kunci jawaban sebelum siswa menjawab.

## 9. Video Interaktif
- Video berhenti di titik yang ditentukan dalam data dan menampilkan satu pertanyaan.
- Video tidak dapat dilanjutkan sebelum pertanyaan dijawab.
- Tersedia transkrip teks untuk setiap video.

## 10. Tampilan dan Aksesibilitas
- Layout responsif; tidak ada scroll horizontal pada lebar 360 px.
- Gambar memiliki teks alternatif (`alt`).
- Informasi tidak boleh disampaikan hanya lewat warna.
- Semua tombol dan tautan dapat dioperasikan dengan keyboard.
- Kontras teks terhadap latar minimal 4,5 : 1.

## 11. Cara Kerja Agen
- Kerjakan satu fitur per tugas; jangan mengubah berkas di luar cakupan tugas.
- Sebelum mengubah berkas yang sudah ada, baca dulu isinya.
- Jangan menghapus atau menulis ulang seluruh berkas bila hanya perlu perubahan kecil.
- Jalankan `npm run build` setelah perubahan; perbaiki semua galat sebelum menyatakan selesai.
- Di akhir tugas, tulis ringkasan singkat: berkas yang diubah, cara mencoba, dan hal yang belum selesai.
- Bila instruksi ambigu, ajukan satu pertanyaan klarifikasi sebelum menulis kode.
- Jangan mengarang fakta kimia; bila ragu pada rumus atau nilai Ka/Kb, tandai dengan komentar `TODO: verifikasi`.

## 12. Daftar Periksa Sebelum Selesai
- [ ] Aplikasi tidak memakai backend luar?
- [ ] Hanya `localStorage` yang dipakai untuk menyimpan data?
- [ ] Tidak ada data pribadi yang disimpan?
- [ ] Semua teks tampilan berbahasa Indonesia baku?
- [ ] Rumus kimia memakai subskrip/superskrip yang benar?
- [ ] Kalkulator menolak input tidak valid dan menampilkan langkah hitung?
- [ ] `npm run build` berhasil tanpa galat?