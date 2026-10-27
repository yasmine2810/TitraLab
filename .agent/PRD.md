#PRD Web Pembelajaran Kimia

**Identitas**
Nama media: Simulasi Phet
Jenis media: Web pembelajaran interaktif berbasis simulasi (responsif di ponsel dan laptop)
Mata pelajaran / topik: Kimia / Asam dan Basa
Target pengguna: Siswa SMA kelas XI
Pengguna sekunder: Guru kimia (membagikan tautan dan mendampingi di kelas)
Masalah belajar: Siswa kesulitan memahami asam basa karena konsepnya abstrak: perbedaan kekuatan dan konsentrasi asam/basa, hubungan [H⁺] dengan pH, perhitungan pH, dan titrasi
Platform: Web, tanpa instalasi dan tanpa login
Bahasa: Indonesia

**Tujuan**
1. Membantu siswa memahami konsep asam basa lewat visualisasi dan eksperimen virtual.
2. Melatih perhitungan pH/pOH dan pembacaan kurva titrasi.
3. Memberi umpan balik langsung atas jawaban siswa.
4. Menyediakan media belajar mandiri yang bisa diakses kapan saja.

**Indikator capaian**
Siswa mampu:
- Membedakan asam dan basa menurut Arrhenius dan Brønsted–Lowry.
- Menjelaskan perbedaan asam/basa kuat dan lemah pada tingkat partikel.
- Menghitung pH dan pOH larutan asam/basa kuat dan lemah.
- Menafsirkan kurva titrasi dan menentukan titik ekuivalen.

## Fitur inti

1. **Tiga modul**
   - Modul 1: Konsep Asam Basa dan Indikator (ciri asam basa, teori Arrhenius dan Brønsted–Lowry, indikator, skala pH)
   - Modul 2: Kekuatan Asam Basa dan Perhitungan pH (asam/basa kuat dan lemah, Ka dan Kb, rumus pH dan pOH)
   - Modul 3: Titrasi Asam Basa (prinsip titrasi, titik ekuivalen, kurva titrasi, memilih indikator)
   - Tiap modul berisi: tujuan belajar, pemantik, eksplorasi simulasi dengan petunjuk bertahap, penjelasan konsep, rangkuman, dan kuis.
2. **Kuis dengan umpan balik**
   - Pilihan ganda di akhir tiap modul (5–10 soal) dan kuis akhir gabungan.
   - Setelah menjawab, siswa langsung melihat benar/salah, alasan jawaban, dan tautan ke bagian materi terkait.
   - Ada umpan balik khusus untuk miskonsepsi umum, soal diacak, dan siswa bisa mengulang.
3. **Penyimpanan progres anonim**
   - Tanpa nama, email, atau data pribadi; progres disimpan di peramban dengan ID acak.
   - Yang tersimpan: modul selesai, skor kuis, dan posisi terakhir belajar.
   - Ada tombol hapus progres dan pemberitahuan bahwa data hanya tersimpan di perangkat tersebut.
4. **Video interaktif**
   - Video pendek (3–5 menit) per modul yang berhenti di titik tertentu untuk pertanyaan singkat.
   - Jawaban salah memunculkan penjelasan dan mengulang bagian terkait.
   - Dilengkapi navigasi bab, kontrol kecepatan, dan transkrip.
5. **Kalkulator pH**
   - Input: jenis larutan (asam kuat, asam lemah, basa kuat, basa lemah), konsentrasi, Ka/Kb, dan valensi.
   - Output: [H⁺] atau [OH⁻], pH, pOH, dan sifat larutan.
   - Langkah perhitungan ditampilkan agar menjadi alat belajar, bukan sekadar pemberi jawaban.

#Jika waktu cukup
1. Pencarian materi (cari istilah atau subtopik, lalu langsung menuju bagiannya)
2. Glosarium istilah kimia
3. Mode gelap dan pengaturan ukuran teks
4. Lembar kerja yang dapat diunduh

**Alur pengguna**
Beranda → pilih modul → eksplorasi simulasi → video interaktif → rangkuman → kuis dan umpan balik → progres tersimpan → lanjut modul berikutnya. Kalkulator pH bisa dibuka kapan saja.

**Kebutuhan non-fungsional**
- Halaman utama termuat kurang dari 3 detik pada 4G.
- Nyaman di layar ponsel (min. lebar 360 px) hingga laptop.
- Kontras warna memadai dan ada teks alternatif pada gambar.
- Tidak mengumpulkan data pribadi.
- Kuis dan kalkulator tetap berfungsi walau simulasi gagal dimuat.

**Saran teknis**
- Frontend: HTML, CSS, JavaScript.
- Simulasi PhET disematkan lewat iframe (cek lisensi dan cantumkan atribusi PhET, University of Colorado Boulder).
- Progres disimpan dengan localStorage.
- Hosting statis (GitHub Pages, Netlify, atau Vercel).

**Indikator keberhasilan**
- ≥ 70% siswa yang memulai menyelesaikan ketiga modul.
- Rata-rata skor kuis akhir ≥ 75.
- Skor naik minimal 15 poin antara percobaan pertama dan ulang.
- Kemudahan penggunaan ≥ 4 dari 5 pada angket.

**Di luar cakupan**
Akun dan login, dasbor guru, pembuatan simulasi baru, dan materi di luar asam basa.

**Risiko**
- Simulasi tidak termuat karena koneksi lambat: sediakan pesan galat dan materi teks sebagai cadangan.
- Progres hilang karena data peramban dihapus: beri peringatan di awal.
- Waktu terbatas: kerjakan fitur inti dahulu, bagian "jika waktu cukup" terakhir.