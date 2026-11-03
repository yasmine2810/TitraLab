/**
 * Bank Soal Kuis Pemahaman Asam Basa Kimia SMA Kelas XI
 * Setiap soal memiliki:
 * - id: pengenal unik
 * - pertanyaan: kalimat tanya baku bahasa Indonesia
 * - pilihan: daftar opsi { id, teks, benar }
 * - pembahasan: penjelasan konsep kimia yang komprehensif
 */

export const daftarSoalKuis = [
  {
    id: 1,
    pertanyaan: "Bagaimanakah perubahan warna kertas lakmus merah dan lakmus biru saat dicelupkan ke dalam larutan asam?",
    pilihan: [
      { id: 'a', teks: "Lakmus merah tetap merah, lakmus biru berubah menjadi merah", benar: true },
      { id: 'b', teks: "Lakmus merah berubah menjadi biru, lakmus biru tetap biru", benar: false },
      { id: 'c', teks: "Kedua kertas lakmus menjadi tidak berwarna", benar: false },
      { id: 'd', teks: "Kedua kertas lakmus berubah menjadi hijau netral", benar: false }
    ],
    pembahasan: "Larutan asam melepaskan ion H⁺ (atau H₃O⁺) dalam air yang memerahkan kertas lakmus biru dan mempertahankan warna merah pada kertas lakmus merah."
  },
  {
    id: 2,
    pertanyaan: "Berapakah nilai pH dari larutan asam klorida (HCl) 0,01 M jika diketahui valensi asam HCl (a) = 1?",
    pilihan: [
      { id: 'a', teks: "pH = 1,0", benar: false },
      { id: 'b', teks: "pH = 2,0", benar: true },
      { id: 'c', teks: "pH = 7,0", benar: false },
      { id: 'd', teks: "pH = 12,0", benar: false }
    ],
    pembahasan: "HCl merupakan asam kuat monoprotik: [H⁺] = a × M = 1 × 0,01 = 1,0 × 10⁻² M. Nilai pH = −log [H⁺] = −log(10⁻²) = 2,0."
  },
  {
    id: 3,
    pertanyaan: "Pada praktikum titrasi asam kuat dengan basa kuat, titik saat jumlah mol ion H⁺ tepat habis bereaksi dengan jumlah mol ion OH⁻ dinamakan...",
    pilihan: [
      { id: 'a', teks: "Titik akhir titrasi", benar: false },
      { id: 'b', teks: "Titik jenuh larutan", benar: false },
      { id: 'c', teks: "Titik ekivalen", benar: true },
      { id: 'd', teks: "Titik hidrolisis garam", benar: false }
    ],
    pembahasan: "Titik ekivalen adalah kondisi stoikiometris stoikiometri reaksi di mana mol H⁺ tepat habis dinetralkan oleh mol OH⁻. Sementara titik akhir titrasi ditandai oleh perubahan warna indikator."
  },
  {
    id: 4,
    pertanyaan: "Menurut teori Brønsted-Lowry, spesi yang bertindak sebagai basa konjugasi dari asam HSO₄⁻ adalah...",
    pilihan: [
      { id: 'a', teks: "SO₄²⁻", benar: true },
      { id: 'b', teks: "H₂SO₄", benar: false },
      { id: 'c', teks: "H₃O⁺", benar: false },
      { id: 'd', teks: "OH⁻", benar: false }
    ],
    pembahasan: "Basa konjugasi terbentuk ketika suatu asam mendonorkan satu proton (H⁺). Ketika HSO₄⁻ melepaskan H⁺, spesi yang tersisa adalah SO₄²⁻."
  },
  {
    id: 5,
    pertanyaan: "Jika larutan asam asetat (CH₃COOH) memiliki konsentrasi 0,1 M dan nilai Ka = 1,0 × 10⁻⁵, berapakah konsentrasi ion [H⁺] dalam larutan tersebut?",
    pilihan: [
      { id: 'a', teks: "1,0 × 10⁻³ M", benar: true },
      { id: 'b', teks: "1,0 × 10⁻² M", benar: false },
      { id: 'c', teks: "1,0 × 10⁻⁴ M", benar: false },
      { id: 'd', teks: "1,0 × 10⁻⁵ M", benar: false }
    ],
    pembahasan: "CH₃COOH adalah asam lemah: [H⁺] = √(Ka × M) = √(1,0 × 10⁻⁵ × 0,1) = √(1,0 × 10⁻⁶) = 1,0 × 10⁻³ M. Dengan demikian pH larutan tersebut adalah 3,0."
  }
];

export default daftarSoalKuis;

