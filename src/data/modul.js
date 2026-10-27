/**
 * Data Modul Pembelajaran Asam Basa SMA Kelas XI
 * Berbasis Media Simulasi PhET Interaktif
 */

export const modulData = [
  {
    id: 1,
    nomor: "Modul 01",
    nomorUrut: "01",
    judul: "Konsep Asam Basa dan Indikator",
    deskripsi:
      "Pelajari teori asam basa Arrhenius, Brønsted-Lowry, dan Lewis serta identifikasi sifat larutan menggunakan indikator lakmus, indikator universal, dan bahan alami.",
    kategori: "Konsep Fundamental",
    durasi: "40 Menit",
    tingkat: "Tingkat Dasar",
    simulasiPhet: "pH Scale Basics",
    fokusMateri: [
      "Teori Arrhenius, Brønsted-Lowry & Lewis",
      "Perubahan Warna Lakmus Merah & Biru",
      "Identifikasi Indikator Alami & Universal"
    ],
    tagAksen: "cyan",
    rumusKunci: "pH = -log [H⁺]"
  },
  {
    id: 2,
    nomor: "Modul 02",
    nomorUrut: "02",
    judul: "Kekuatan Asam Basa dan Perhitungan pH",
    deskripsi:
      "Analisis perbedaan asam kuat, asam lemah, basa kuat, dan basa lemah berdasarkan derajat ionisasi (α) serta tetapan kesetimbangan Ka dan Kb dengan visualisasi molekuler.",
    kategori: "Kalkulasi & Molekuler",
    durasi: "45 Menit",
    tingkat: "Tingkat Menengah",
    simulasiPhet: "Acid-Base Solutions",
    fokusMateri: [
      "Derajat Ionisasi (α) & Tetapan Ka/Kb",
      "Perhitungan Konsentrasi Ion [H⁺] & [OH⁻]",
      "Visualisasi Partikel Asam-Basa dalam Air"
    ],
    tagAksen: "teal",
    rumusKunci: "[H⁺] = √(Ka × Ma)"
  },
  {
    id: 3,
    nomor: "Modul 03",
    nomorUrut: "03",
    judul: "Titrasi Asam Basa",
    deskripsi:
      "Simulasikan prosedur titrasi volumetri menggunakan buret dan erlenmeyer digital untuk menentukan konsentrasi larutan analit melalui titik ekivalen dan titik akhir titrasi.",
    kategori: "Praktikum Virtual",
    durasi: "50 Menit",
    tingkat: "Praktikum Virtual",
    simulasiPhet: "Acid-Base Titration",
    fokusMateri: [
      "Prinsip Titrasi Asam Kuat - Basa Kuat",
      "Penentuan Titik Ekivalen & Kurva Titrasi",
      "Penggunaan Indikator Fenolftalein (PP)"
    ],
    tagAksen: "indigo",
    rumusKunci: "Va × Ma × a = Vb × Mb × b"
  }
];

export default modulData;
