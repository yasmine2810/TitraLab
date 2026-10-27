import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ModuleCards from '../components/ModuleCards';

/**
 * Halaman Beranda Media Simulasi PhET Kimia Asam Basa
 * Mengintegrasikan Navbar, HeroSection, ModuleCards, Kalkulator pH, dan Kuis Cepat.
 */
export default function Beranda({ theme, toggleTheme }) {
  // State untuk modal detail modul saat tombol "Buka Modul" diklik
  const [selectedModul, setSelectedModul] = useState(null);

  // State untuk Kalkulator pH interaktif
  const [jenisLarutan, setJenisLarutan] = useState('asam_kuat');
  const [konsentrasi, setKonsentrasi] = useState('0.01');
  const [valensi, setValensi] = useState(1);
  const [kaKb, setKaKb] = useState('0.00001'); // 1 x 10^-5

  // State untuk Kuis Asam Basa
  const [jawabanKuis, setJawabanKuis] = useState({});
  const [tampilkanHasilKuis, setTampilkanHasilKuis] = useState(false);

  // Logika Perhitungan pH Kimia SMA Kelas XI
  const hitungPh = () => {
    const M = parseFloat(konsentrasi) || 0.001;
    const v = parseInt(valensi) || 1;
    const k = parseFloat(kaKb) || 0.00001;

    let hPlus = 0;
    let ohMinus = 0;
    let ph = 7;
    let pOH = 7;

    if (jenisLarutan === 'asam_kuat') {
      hPlus = M * v;
      ph = -Math.log10(hPlus);
      pOH = 14 - ph;
      ohMinus = Math.pow(10, -pOH);
    } else if (jenisLarutan === 'asam_lemah') {
      hPlus = Math.sqrt(k * M);
      ph = -Math.log10(hPlus);
      pOH = 14 - ph;
      ohMinus = Math.pow(10, -pOH);
    } else if (jenisLarutan === 'basa_kuat') {
      ohMinus = M * v;
      pOH = -Math.log10(ohMinus);
      ph = 14 - pOH;
      hPlus = Math.pow(10, -ph);
    } else if (jenisLarutan === 'basa_lemah') {
      ohMinus = Math.sqrt(k * M);
      pOH = -Math.log10(ohMinus);
      ph = 14 - pOH;
      hPlus = Math.pow(10, -ph);
    }

    return {
      ph: Math.max(0, Math.min(14, ph)).toFixed(2),
      pOH: Math.max(0, Math.min(14, pOH)).toFixed(2),
      hPlus: hPlus.toExponential(2),
      ohMinus: ohMinus.toExponential(2)
    };
  };

  const hasilPh = hitungPh();

  // Soal Kuis Pemahaman Asam Basa SMA Kelas XI
  const daftarSoal = [
    {
      id: 1,
      pertanyaan: "Bagaimanakah perubahan warna kertas lakmus merah dan lakmus biru saat dicelupkan ke dalam larutan asam?",
      pilihan: [
        { label: "Lakmus merah tetap merah, lakmus biru menjadi merah", benar: true },
        { label: "Lakmus merah menjadi biru, lakmus biru tetap biru", benar: false },
        { label: "Kedua kertas lakmus menjadi tidak berwarna", benar: false },
        { label: "Kedua kertas lakmus menjadi berwarna hijau netral", benar: false }
      ],
      pembahasan: "Larutan asam memiliki kelebihan ion H⁺ sehingga memerahkan kertas lakmus biru dan mempertahankan warna lakmus merah."
    },
    {
      id: 2,
      pertanyaan: "Berapakah nilai pH dari larutan asam klorida (HCl) 0,01 M (diketahui valensi HCl = 1)?",
      pilihan: [
        { label: "pH = 1", benar: false },
        { label: "pH = 2", benar: true },
        { label: "pH = 7", benar: false },
        { label: "pH = 12", benar: false }
      ],
      pembahasan: "HCl adalah asam kuat: [H⁺] = M × a = 0,01 × 1 = 10⁻² M. pH = -log [H⁺] = -log(10⁻²) = 2."
    },
    {
      id: 3,
      pertanyaan: "Pada praktikum titrasi asam kuat dengan basa kuat, titik saat jumlah mol ion H⁺ tepat habis bereaksi dengan jumlah mol ion OH⁻ dinamakan...",
      pilihan: [
        { label: "Titik akhir titrasi", benar: false },
        { label: "Titik jenuh larutan", benar: false },
        { label: "Titik ekivalen", benar: true },
        { label: "Titik ionisasi", benar: false }
      ],
      pembahasan: "Titik ekivalen adalah kondisi stoikiometris di mana mol asam tepat habis bereaksi dengan mol basa."
    }
  ];

  const handlePilihJawaban = (soalId, idxPilihan) => {
    setJawabanKuis(prev => ({
      ...prev,
      [soalId]: idxPilihan
    }));
  };

  const hitungSkorKuis = () => {
    let benar = 0;
    daftarSoal.forEach(soal => {
      const idxTerpilih = jawabanKuis[soal.id];
      if (idxTerpilih !== undefined && soal.pilihan[idxTerpilih]?.benar) {
        benar++;
      }
    });
    return {
      skor: Math.round((benar / daftarSoal.length) * 100),
      benar,
      total: daftarSoal.length
    };
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="beranda-wrapper">
      {/* 1. Navbar Utama */}
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onNavClick={scrollToSection} 
      />

      <main id="konten-utama" tabIndex="-1">
        {/* 2. Hero Section */}
        <HeroSection 
          onMulaiBelajar={() => scrollToSection('modul')} 
        />

        {/* 3. Tiga Kartu Modul */}
        <ModuleCards 
          onSelectModul={(modul) => setSelectedModul(modul)} 
        />

        {/* 4. Seksi Kalkulator pH Interaktif (Fitur Laboratorium Cepat) */}
        <section className="lab-feature-section" id="kalkulator-ph" aria-labelledby="calc-heading">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M8 10h8M8 14h4" />
                </svg>
                <span>Laboratorium Komputasi Sains</span>
              </div>
              <h2 id="calc-heading" className="section-title">
                Kalkulator <span className="text-highlight">pH Larutan</span> Virtual
              </h2>
              <p className="section-subtitle">
                Hitung nilai konsentrasi [H⁺], [OH⁻], pH, dan pOH untuk berbagai kategori larutan asam basa secara akurat.
              </p>
            </div>

            <div className="calculator-box">
              <div className="calc-inputs">
                <div className="input-group">
                  <label htmlFor="jenis-larutan-select" className="input-label">
                    Jenis Larutan:
                  </label>
                  <select 
                    id="jenis-larutan-select"
                    className="calc-select"
                    value={jenisLarutan}
                    onChange={(e) => setJenisLarutan(e.target.value)}
                  >
                    <option value="asam_kuat">Asam Kuat (misal: HCl, HNO₃)</option>
                    <option value="asam_lemah">Asam Lemah (misal: CH₃COOH, HF)</option>
                    <option value="basa_kuat">Basa Kuat (misal: NaOH, KOH)</option>
                    <option value="basa_lemah">Basa Lemah (misal: NH₄OH)</option>
                  </select>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="konsentrasi-input" className="input-label">
                      Konsentrasi Molaritas (M):
                    </label>
                    <input 
                      id="konsentrasi-input"
                      type="number"
                      step="0.001"
                      min="0.0001"
                      max="10"
                      className="calc-input"
                      value={konsentrasi}
                      onChange={(e) => setKonsentrasi(e.target.value)}
                    />
                  </div>

                  {jenisLarutan.includes('kuat') ? (
                    <div className="input-group">
                      <label htmlFor="valensi-select" className="input-label">
                        Valensi (Jumlah ion H⁺ atau OH⁻):
                      </label>
                      <select 
                        id="valensi-select"
                        className="calc-select"
                        value={valensi}
                        onChange={(e) => setValensi(parseInt(e.target.value))}
                      >
                        <option value={1}>1 (Monovalen, cth: HCl, NaOH)</option>
                        <option value={2}>2 (Divalen, cth: H₂SO₄, Ca(OH)₂)</option>
                        <option value={3}>3 (Trivalen, cth: H₃PO₄, Al(OH)₃)</option>
                      </select>
                    </div>
                  ) : (
                    <div className="input-group">
                      <label htmlFor="kakb-input" className="input-label">
                        Tetapan {jenisLarutan === 'asam_lemah' ? 'Ka' : 'Kb'}:
                      </label>
                      <input 
                        id="kakb-input"
                        type="text"
                        className="calc-input"
                        value={kaKb}
                        placeholder="0.00001 (1 x 10^-5)"
                        onChange={(e) => setKaKb(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Tampilan Hasil Perhitungan */}
              <div className="calc-results-panel">
                <div className="result-card primary-result">
                  <span className="result-label">Derajat Keasaman (pH)</span>
                  <span className="result-value-big">{hasilPh.ph}</span>
                  <span className="result-tag">
                    {parseFloat(hasilPh.ph) < 7 ? 'Larutan Asam' : parseFloat(hasilPh.ph) > 7 ? 'Larutan Basa' : 'Larutan Netral'}
                  </span>
                </div>

                <div className="sub-results-grid">
                  <div className="sub-result-item">
                    <span className="sub-label">Nilai pOH</span>
                    <span className="sub-val">{hasilPh.pOH}</span>
                  </div>
                  <div className="sub-result-item">
                    <span className="sub-label">[H⁺]</span>
                    <span className="sub-val">{hasilPh.hPlus} M</span>
                  </div>
                  <div className="sub-result-item">
                    <span className="sub-label">[OH⁻]</span>
                    <span className="sub-val">{hasilPh.ohMinus} M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Seksi Kuis Pemahaman Asam Basa */}
        <section className="lab-feature-section" id="kuis" aria-labelledby="quiz-heading">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>Uji Pemahaman Mandiri</span>
              </div>
              <h2 id="quiz-heading" className="section-title">
                Kuis Cepat <span className="text-highlight">Kimia Asam Basa</span>
              </h2>
              <p className="section-subtitle">
                Uji penguasaan konsep teori, perhitungan pH, dan prosedur titrasi untuk mengukur kesiapan belajar Anda.
              </p>
            </div>

            <div className="quiz-container">
              {daftarSoal.map((soal, sIdx) => {
                const terpilih = jawabanKuis[soal.id];
                return (
                  <div key={soal.id} className="quiz-card">
                    <div className="quiz-question-header">
                      <span className="question-number">Soal #{sIdx + 1}</span>
                      <p className="question-text">{soal.pertanyaan}</p>
                    </div>

                    <div className="quiz-options">
                      {soal.pilihan.map((pil, pIdx) => {
                        const isSelected = terpilih === pIdx;
                        let optionClass = 'quiz-option';
                        if (isSelected) optionClass += ' selected';
                        if (tampilkanHasilKuis) {
                          if (pil.benar) optionClass += ' correct';
                          else if (isSelected && !pil.benar) optionClass += ' wrong';
                        }

                        return (
                          <button
                            key={pIdx}
                            type="button"
                            className={optionClass}
                            onClick={() => handlePilihJawaban(soal.id, pIdx)}
                            aria-pressed={isSelected}
                          >
                            <span className="option-alpha">
                              {String.fromCharCode(65 + pIdx)}
                            </span>
                            <span className="option-label">{pil.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {tampilkanHasilKuis && (
                      <div className="quiz-explanation">
                        <strong>Pembahasan:</strong> {soal.pembahasan}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Kontrol Hasil Kuis */}
              <div className="quiz-actions-bar">
                {!tampilkanHasilKuis ? (
                  <button
                    type="button"
                    className="btn btn-hero-primary"
                    onClick={() => setTampilkanHasilKuis(true)}
                    disabled={Object.keys(jawabanKuis).length === 0}
                  >
                    Periksa Jawaban Kuis
                  </button>
                ) : (
                  <div className="quiz-result-summary">
                    <div className="quiz-score-badge">
                      Skor Anda: <strong>{hitungSkorKuis().skor} / 100</strong> ({hitungSkorKuis().benar} dari {hitungSkorKuis().total} benar)
                    </div>
                    <button
                      type="button"
                      className="btn btn-hero-secondary"
                      onClick={() => {
                        setJawabanKuis({});
                        setTampilkanHasilKuis(false);
                      }}
                    >
                      Ulangi Kuis
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal Dialog Detail Modul (Saat Klik "Buka Modul") */}
      {selectedModul && (
        <div 
          className="modal-overlay" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-module-title"
          onClick={() => setSelectedModul(null)}
        >
          <div 
            className="modal-container" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-badge-group">
                <span className="modal-badge">{selectedModul.nomor}</span>
                <span className="modal-category">{selectedModul.kategori}</span>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setSelectedModul(null)}
                aria-label="Tutup jendela informasi modul"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <h3 id="modal-module-title" className="modal-title">
                {selectedModul.judul}
              </h3>
              
              <p className="modal-description">
                {selectedModul.deskripsi}
              </p>

              <div className="modal-meta-grid">
                <div className="modal-meta-box">
                  <span className="meta-box-label">Durasi Estimasi</span>
                  <span className="meta-box-val">{selectedModul.durasi}</span>
                </div>
                <div className="modal-meta-box">
                  <span className="meta-box-label">Tingkat Kesulitan</span>
                  <span className="meta-box-val">{selectedModul.tingkat}</span>
                </div>
                <div className="modal-meta-box">
                  <span className="meta-box-label">Simulasi PhET Rujukan</span>
                  <span className="meta-box-val">{selectedModul.simulasiPhet}</span>
                </div>
              </div>

              <div className="modal-curriculum-topics">
                <span className="curriculum-title">Tujuan & Indikator Capaian Pembelajaran:</span>
                <ul>
                  {selectedModul.fokusMateri.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-callout">
                <span className="callout-icon" aria-hidden="true">🔬</span>
                <p>
                  Modul ini siap dieksplorasi secara virtual menggunakan simulasi PhET interaktif untuk membuktikan konsep teori asam basa tanpa membutuhkan bahan kimia berbahaya.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-hero-secondary"
                onClick={() => setSelectedModul(null)}
              >
                Tutup
              </button>
              <button 
                type="button" 
                className="btn btn-hero-primary"
                onClick={() => {
                  alert(`Memulai ${selectedModul.nomor}: ${selectedModul.judul}\nSimulasi PhET (${selectedModul.simulasiPhet}) siap dijalankan!`);
                  setSelectedModul(null);
                }}
              >
                Jalankan Simulasi Lab Virtual
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Laboratorium Sains */}
      <footer className="lab-footer" role="contentinfo">
        <div className="container footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 2v5.5L4.2 18.2A2 2 0 0 0 5.9 21h12.2a2 2 0 0 0 1.7-2.8L14 7.5V2" />
                <path d="M8.5 2h7" />
              </svg>
              <span>Simulasi PhET • Asam Basa</span>
            </div>
            <p className="footer-desc">
              Media pembelajaran kimia interaktif untuk siswa SMA Kelas XI. Membantu visualisasi tingkat mikroskopis dan makroskopis sifat larutan asam basa.
            </p>
          </div>

          <div className="footer-nav-groups">
            <div className="footer-col">
              <span className="footer-col-title">Navigasi Utama</span>
              <ul>
                <li><a href="#beranda">Beranda Utama</a></li>
                <li><a href="#modul">Daftar Tiga Modul</a></li>
                <li><a href="#kalkulator-ph">Kalkulator pH Real-Time</a></li>
                <li><a href="#kuis">Kuis Pemahaman</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <span className="footer-col-title">Topik Kurikulum</span>
              <ul>
                <li><span>Teori Asam Basa & Indikator</span></li>
                <li><span>Kekuatan Asam & Ionisasi</span></li>
                <li><span>Titrasi Volumetri</span></li>
                <li><span>Kurikulum Merdeka Kelas XI</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <p>© {new Date().getFullYear()} Media Simulasi PhET Kimia Asam Basa SMA Kelas XI. Dibuat dengan React & Vite.</p>
            <p className="footer-standards">Aksesibel • Standar Kontras WCAG AA 4,5 : 1</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
