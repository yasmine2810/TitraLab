/**
 * Modul Utilitas Perhitungan pH Kimia SMA Kelas XI (ph.js)
 * Sesuai kurikulum kimia asam basa:
 * - Asam kuat: [H⁺] = a × M; pH = −log [H⁺]
 * - Asam lemah: [H⁺] = √(Ka × M)
 * - Basa kuat: [OH⁻] = b × M; pOH = −log [OH⁻]
 * - Basa lemah: [OH⁻] = √(Kb × M)
 * - pH + pOH = 14 (pada suhu 25 °C)
 * 
 * Semua fungsi divalidasi dengan angka positif dan menyertakan langkah perhitungan.
 */

/**
 * Format angka desimal menggunakan tanda koma sesuai kaidah bahasa Indonesia
 * Contoh: 1.5 -> "1,5"
 */
export function formatDesimal(angka, presisi = 2) {
  if (angka === null || angka === undefined || isNaN(angka)) return '0,00';
  return Number(angka).toFixed(presisi).replace('.', ',');
}

/**
 * Format notasi ilmiah ke format Indonesia
 * Contoh: 1.0e-5 -> "1,0 × 10⁻⁵"
 */
export function formatNotasiIlmiah(angka, presisi = 2) {
  if (angka === null || angka === undefined || isNaN(angka) || angka <= 0) return '0';
  
  const eksponen = Math.floor(Math.log10(angka));
  const mantissa = angka / Math.pow(10, eksponen);
  const mantissaStr = formatDesimal(mantissa, presisi);

  // Peta superskrip eksponen
  const superskripMap = {
    '-': '⁻',
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹'
  };

  const expStr = String(eksponen)
    .split('')
    .map(ch => superskripMap[ch] || ch)
    .join('');

  return `${mantissaStr} × 10${expStr}`;
}

/**
 * Validasi input kalkulator:
 * - Harus ada isi (tidak boleh string kosong)
 * - Harus berupa angka valid
 * - Harus bernilai lebih besar dari 0 (positif)
 */
export function validasiAngkaPositif(nilai, namaField = 'Nilai') {
  if (nilai === undefined || nilai === null || String(nilai).trim() === '') {
    return { valid: false, pesan: `${namaField} tidak boleh kosong. Masukkan angka lebih dari 0.` };
  }

  // Normalisasi koma menjadi titik untuk parsing
  const normalStr = String(nilai).replace(',', '.').trim();
  const num = parseFloat(normalStr);

  if (isNaN(num)) {
    return { valid: false, pesan: `${namaField} harus berupa angka yang valid. Contoh: 0,01` };
  }

  if (num <= 0) {
    return { valid: false, pesan: `${namaField} harus bernilai positif (lebih besar dari 0). Masukkan angka lebih dari 0.` };
  }

  return { valid: true, nilai: num };
}

/**
 * 1. Hitung pH Asam Kuat
 * Rumus: [H⁺] = a × M; pH = −log [H⁺]; pOH = 14 − pH
 * 
 * Contoh Uji Manual 1:
 * - Larutan HCl 0,01 M (valensi a = 1):
 *   [H⁺] = 1 × 0,01 = 0,01 M = 1,0 × 10⁻² M
 *   pH = −log(0,01) = 2,00
 *   pOH = 14 − 2,00 = 12,00
 * 
 * Contoh Uji Manual 2:
 * - Larutan H₂SO₄ 0,05 M (valensi a = 2):
 *   [H⁺] = 2 × 0,05 = 0,10 M = 1,0 × 10⁻¹ M
 *   pH = −log(0,10) = 1,00
 *   pOH = 14 − 1,00 = 13,00
 */
export function hitungAsamKuat(konsentrasiMolar, valensiA = 1) {
  const mVal = validasiAngkaPositif(konsentrasiMolar, 'Konsentrasi Molaritas (M)');
  if (!mVal.valid) return { sukses: false, galat: mVal.pesan };

  const vVal = validasiAngkaPositif(valensiA, 'Valensi Asam (a)');
  if (!vVal.valid) return { sukses: false, galat: vVal.pesan };

  const M = mVal.nilai;
  const a = Math.round(vVal.nilai);

  const hPlus = a * M;
  const ph = -Math.log10(hPlus);
  const pOH = 14 - ph;
  const ohMinus = Math.pow(10, -pOH);

  return {
    sukses: true,
    jenis: 'Asam Kuat',
    rumusTipe: '[H⁺] = a × M',
    hPlus,
    ohMinus,
    ph: Math.max(0, Math.min(14, ph)),
    pOH: Math.max(0, Math.min(14, pOH)),
    langkahHitung: [
      {
        langkah: 'Identifikasi Data Diketahui',
        deskripsi: `M = ${formatDesimal(M, 4)} M; Valensi asam (a) = ${a}`
      },
      {
        langkah: 'Menghitung Konsentrasi Ion H⁺',
        rumus: '[H⁺] = a × M',
        substitusi: `[H⁺] = ${a} × ${formatDesimal(M, 4)} = ${formatNotasiIlmiah(hPlus)} M`
      },
      {
        langkah: 'Menghitung Derajat Keasaman (pH)',
        rumus: 'pH = −log [H⁺]',
        substitusi: `pH = −log(${formatNotasiIlmiah(hPlus)}) = ${formatDesimal(ph, 2)}`
      },
      {
        langkah: 'Menghitung Nilai pOH (25 °C)',
        rumus: 'pOH = 14 − pH',
        substitusi: `pOH = 14 − ${formatDesimal(ph, 2)} = ${formatDesimal(pOH, 2)}`
      }
    ]
  };
}

/**
 * 2. Hitung pH Asam Lemah
 * Rumus: [H⁺] = √(Ka × M); pH = −log [H⁺]; pOH = 14 − pH
 * 
 * Contoh Uji Manual:
 * - Larutan CH₃COOH 0,1 M (Ka = 1,0 × 10⁻⁵):
 *   [H⁺] = √(1,0 × 10⁻⁵ × 0,1) = √(1,0 × 10⁻⁶) = 1,0 × 10⁻³ M
 *   pH = −log(10⁻³) = 3,00
 *   pOH = 14 − 3,00 = 11,00
 */
export function hitungAsamLemah(konsentrasiMolar, tetapanKa) {
  const mVal = validasiAngkaPositif(konsentrasiMolar, 'Konsentrasi Molaritas (M)');
  if (!mVal.valid) return { sukses: false, galat: mVal.pesan };

  const kVal = validasiAngkaPositif(tetapanKa, 'Tetapan Ionisasi Asam (Ka)');
  if (!kVal.valid) return { sukses: false, galat: kVal.pesan };

  const M = mVal.nilai;
  const Ka = kVal.nilai;

  const hPlus = Math.sqrt(Ka * M);
  const ph = -Math.log10(hPlus);
  const pOH = 14 - ph;
  const ohMinus = Math.pow(10, -pOH);

  return {
    sukses: true,
    jenis: 'Asam Lemah',
    rumusTipe: '[H⁺] = √(Ka × M)',
    hPlus,
    ohMinus,
    ph: Math.max(0, Math.min(14, ph)),
    pOH: Math.max(0, Math.min(14, pOH)),
    langkahHitung: [
      {
        langkah: 'Identifikasi Data Diketahui',
        deskripsi: `M = ${formatDesimal(M, 4)} M; Ka = ${formatNotasiIlmiah(Ka)}`
      },
      {
        langkah: 'Menghitung Konsentrasi Ion H⁺',
        rumus: '[H⁺] = √(Ka × M)',
        substitusi: `[H⁺] = √(${formatNotasiIlmiah(Ka)} × ${formatDesimal(M, 4)}) = ${formatNotasiIlmiah(hPlus)} M`
      },
      {
        langkah: 'Menghitung Derajat Keasaman (pH)',
        rumus: 'pH = −log [H⁺]',
        substitusi: `pH = −log(${formatNotasiIlmiah(hPlus)}) = ${formatDesimal(ph, 2)}`
      },
      {
        langkah: 'Menghitung Nilai pOH (25 °C)',
        rumus: 'pOH = 14 − pH',
        substitusi: `pOH = 14 − ${formatDesimal(ph, 2)} = ${formatDesimal(pOH, 2)}`
      }
    ]
  };
}

/**
 * 3. Hitung pH Basa Kuat
 * Rumus: [OH⁻] = b × M; pOH = −log [OH⁻]; pH = 14 − pOH
 * 
 * Contoh Uji Manual 1:
 * - Larutan NaOH 0,01 M (valensi b = 1):
 *   [OH⁻] = 1 × 0,01 = 0,01 M = 1,0 × 10⁻² M
 *   pOH = −log(0,01) = 2,00
 *   pH = 14 − 2,00 = 12,00
 * 
 * Contoh Uji Manual 2:
 * - Larutan Ca(OH)₂ 0,05 M (valensi b = 2):
 *   [OH⁻] = 2 × 0,05 = 0,10 M = 1,0 × 10⁻¹ M
 *   pOH = −log(0,10) = 1,00
 *   pH = 14 − 1,00 = 13,00
 */
export function hitungBasaKuat(konsentrasiMolar, valensiB = 1) {
  const mVal = validasiAngkaPositif(konsentrasiMolar, 'Konsentrasi Molaritas (M)');
  if (!mVal.valid) return { sukses: false, galat: mVal.pesan };

  const vVal = validasiAngkaPositif(valensiB, 'Valensi Basa (b)');
  if (!vVal.valid) return { sukses: false, galat: vVal.pesan };

  const M = mVal.nilai;
  const b = Math.round(vVal.nilai);

  const ohMinus = b * M;
  const pOH = -Math.log10(ohMinus);
  const ph = 14 - pOH;
  const hPlus = Math.pow(10, -ph);

  return {
    sukses: true,
    jenis: 'Basa Kuat',
    rumusTipe: '[OH⁻] = b × M',
    hPlus,
    ohMinus,
    ph: Math.max(0, Math.min(14, ph)),
    pOH: Math.max(0, Math.min(14, pOH)),
    langkahHitung: [
      {
        langkah: 'Identifikasi Data Diketahui',
        deskripsi: `M = ${formatDesimal(M, 4)} M; Valensi basa (b) = ${b}`
      },
      {
        langkah: 'Menghitung Konsentrasi Ion OH⁻',
        rumus: '[OH⁻] = b × M',
        substitusi: `[OH⁻] = ${b} × ${formatDesimal(M, 4)} = ${formatNotasiIlmiah(ohMinus)} M`
      },
      {
        langkah: 'Menghitung Nilai pOH',
        rumus: 'pOH = −log [OH⁻]',
        substitusi: `pOH = −log(${formatNotasiIlmiah(ohMinus)}) = ${formatDesimal(pOH, 2)}`
      },
      {
        langkah: 'Menghitung Derajat Keasaman (pH pada 25 °C)',
        rumus: 'pH = 14 − pOH',
        substitusi: `pH = 14 − ${formatDesimal(pOH, 2)} = ${formatDesimal(ph, 2)}`
      }
    ]
  };
}

/**
 * 4. Hitung pH Basa Lemah
 * Rumus: [OH⁻] = √(Kb × M); pOH = −log [OH⁻]; pH = 14 − pOH
 * 
 * Contoh Uji Manual:
 * - Larutan NH₄OH 0,1 M (Kb = 1,0 × 10⁻⁵):
 *   [OH⁻] = √(1,0 × 10⁻⁵ × 0,1) = √(1,0 × 10⁻⁶) = 1,0 × 10⁻³ M
 *   pOH = −log(10⁻³) = 3,00
 *   pH = 14 − 3,00 = 11,00
 */
export function hitungBasaLemah(konsentrasiMolar, tetapanKb) {
  const mVal = validasiAngkaPositif(konsentrasiMolar, 'Konsentrasi Molaritas (M)');
  if (!mVal.valid) return { sukses: false, galat: mVal.pesan };

  const kVal = validasiAngkaPositif(tetapanKb, 'Tetapan Ionisasi Basa (Kb)');
  if (!kVal.valid) return { sukses: false, galat: kVal.pesan };

  const M = mVal.nilai;
  const Kb = kVal.nilai;

  const ohMinus = Math.sqrt(Kb * M);
  const pOH = -Math.log10(ohMinus);
  const ph = 14 - pOH;
  const hPlus = Math.pow(10, -ph);

  return {
    sukses: true,
    jenis: 'Basa Lemah',
    rumusTipe: '[OH⁻] = √(Kb × M)',
    hPlus,
    ohMinus,
    ph: Math.max(0, Math.min(14, ph)),
    pOH: Math.max(0, Math.min(14, pOH)),
    langkahHitung: [
      {
        langkah: 'Identifikasi Data Diketahui',
        deskripsi: `M = ${formatDesimal(M, 4)} M; Kb = ${formatNotasiIlmiah(Kb)}`
      },
      {
        langkah: 'Menghitung Konsentrasi Ion OH⁻',
        rumus: '[OH⁻] = √(Kb × M)',
        substitusi: `[OH⁻] = √(${formatNotasiIlmiah(Kb)} × ${formatDesimal(M, 4)}) = ${formatNotasiIlmiah(ohMinus)} M`
      },
      {
        langkah: 'Menghitung Nilai pOH',
        rumus: 'pOH = −log [OH⁻]',
        substitusi: `pOH = −log(${formatNotasiIlmiah(ohMinus)}) = ${formatDesimal(pOH, 2)}`
      },
      {
        langkah: 'Menghitung Derajat Keasaman (pH pada 25 °C)',
        rumus: 'pH = 14 − pOH',
        substitusi: `pH = 14 − ${formatDesimal(pOH, 2)} = ${formatDesimal(ph, 2)}`
      }
    ]
  };
}

/**
 * Router Terpadu untuk Perhitungan pH berdasarkan Jenis Larutan
 */
export function kalkulasiPhLengkap(jenisLarutan, konsentrasi, valensi, tetapanKaKb) {
  switch (jenisLarutan) {
    case 'asam_kuat':
      return hitungAsamKuat(konsentrasi, valensi);
    case 'asam_lemah':
      return hitungAsamLemah(konsentrasi, tetapanKaKb);
    case 'basa_kuat':
      return hitungBasaKuat(konsentrasi, valensi);
    case 'basa_lemah':
      return hitungBasaLemah(konsentrasi, tetapanKaKb);
    default:
      return { sukses: false, galat: 'Pilih jenis larutan asam atau basa yang valid.' };
  }
}

