import React, { useState, useMemo } from 'react';
import { 
  kalkulasiPhLengkap, 
  formatDesimal, 
  formatNotasiIlmiah 
} from '../utils/ph';

/**
 * Komponen KalkulatorSection
 * Perhitungan pH larutan asam kuat, asam lemah, basa kuat, dan basa lemah
 * Dilengkapi validasi input positif, pesan galat ramah, dan perincian langkah perhitungan.
 */
export default function KalkulatorSection() {
  const [jenisLarutan, setJenisLarutan] = useState('asam_kuat');
  const [konsentrasi, setKonsentrasi] = useState('0,01');
  const [valensi, setValensi] = useState(1);
  const [tetapanKaKb, setTetapanKaKb] = useState('0,00001'); // 1,0 × 10⁻⁵
  const [tampilkanLangkah, setTampilkanLangkah] = useState(true);

  // Daftar contoh larutan kimia riil untuk kemudahan eksplorasi siswa
  const presetLarutan = [
    { label: 'HCl 0,01 M (Asam Kuat)', jenis: 'asam_kuat', m: '0,01', v: 1, k: '0,00001' },
    { label: 'H₂SO₄ 0,05 M (Asam Kuat Divalen)', jenis: 'asam_kuat', m: '0,05', v: 2, k: '0,00001' },
    { label: 'CH₃COOH 0,1 M (Asam Lemah)', jenis: 'asam_lemah', m: '0,1', v: 1, k: '0,00001' },
    { label: 'NaOH 0,01 M (Basa Kuat)', jenis: 'basa_kuat', m: '0,01', v: 1, k: '0,00001' },
    { label: 'Ca(OH)₂ 0,05 M (Basa Kuat Divalen)', jenis: 'basa_kuat', m: '0,05', v: 2, k: '0,00001' },
    { label: 'NH₄OH 0,1 M (Basa Lemah)', jenis: 'basa_lemah', m: '0,1', v: 1, k: '0,00001' }
  ];

  const handleTerapkanPreset = (p) => {
    setJenisLarutan(p.jenis);
    setKonsentrasi(p.m);
    setValensi(p.v);
    setTetapanKaKb(p.k);
  };

  // Kalkulasi real-time
  const hasil = useMemo(() => {
    return kalkulasiPhLengkap(jenisLarutan, konsentrasi, valensi, tetapanKaKb);
  }, [jenisLarutan, konsentrasi, valensi, tetapanKaKb]);

  const isKuat = jenisLarutan.includes('kuat');
  const isAsam = jenisLarutan.includes('asam');

  return (
    <section className="lab-feature-section" id="kalkulator-ph" aria-labelledby="calc-heading">
      <div className="container">
        {/* Header Seksi */}
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
            Hitung nilai konsentrasi [H⁺], [OH⁻], pH, dan pOH untuk berbagai kategori larutan asam basa lengkap dengan perincian langkah perhitungannya.
          </p>
        </div>

        {/* Preset Cepat */}
        <div className="calc-presets-bar" aria-label="Contoh Cepat Larutan">
          <span className="preset-label">Contoh Cepat:</span>
          <div className="preset-chips">
            {presetLarutan.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className="btn-preset-chip"
                onClick={() => handleTerapkanPreset(p)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="calculator-box">
          {/* Panel Input */}
          <div className="calc-inputs">
            <div className="input-group">
              <label htmlFor="jenis-larutan-select" className="input-label">
                Kategori Larutan Kimia:
              </label>
              <select 
                id="jenis-larutan-select"
                className="calc-select"
                value={jenisLarutan}
                onChange={(e) => setJenisLarutan(e.target.value)}
              >
                <option value="asam_kuat">Asam Kuat (misal: HCl, HNO₃, H₂SO₄)</option>
                <option value="asam_lemah">Asam Lemah (misal: CH₃COOH, HF)</option>
                <option value="basa_kuat">Basa Kuat (misal: NaOH, KOH, Ca(OH)₂)</option>
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
                  type="text"
                  className="calc-input"
                  value={konsentrasi}
                  placeholder="Contoh: 0,01"
                  onChange={(e) => setKonsentrasi(e.target.value)}
                  aria-describedby="konsentrasi-hint"
                />
                <span id="konsentrasi-hint" className="input-hint">Satuan M (mol/L), masukkan angka lebih dari 0</span>
              </div>

              {isKuat ? (
                <div className="input-group">
                  <label htmlFor="valensi-select" className="input-label">
                    Valensi {isAsam ? 'Asam (a)' : 'Basa (b)'}:
                  </label>
                  <select 
                    id="valensi-select"
                    className="calc-select"
                    value={valensi}
                    onChange={(e) => setValensi(parseInt(e.target.value))}
                  >
                    <option value={1}>1 (Monovalen, cth: HCl, NaOH, HNO₃)</option>
                    <option value={2}>2 (Divalen, cth: H₂SO₄, Ca(OH)₂)</option>
                    <option value={3}>3 (Trivalen, cth: H₃PO₄, Al(OH)₃)</option>
                  </select>
                </div>
              ) : (
                <div className="input-group">
                  <label htmlFor="kakb-input" className="input-label">
                    Tetapan Ionisasi {isAsam ? 'Ka' : 'Kb'}:
                  </label>
                  <input 
                    id="kakb-input"
                    type="text"
                    className="calc-input"
                    value={tetapanKaKb}
                    placeholder="Contoh: 0,00001 atau 1e-5"
                    onChange={(e) => setTetapanKaKb(e.target.value)}
                    aria-describedby="kakb-hint"
                  />
                  <span id="kakb-hint" className="input-hint">Tetapan ionisasi asam/basa lemah (lebih dari 0)</span>
                </div>
              )}
            </div>

            {/* Kotak Pesan Galat Ramah jika input tidak valid */}
            {!hasil.sukses && (
              <div className="calc-alert-error" role="alert">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div className="alert-content">
                  <strong>Peringatan Input:</strong> {hasil.galat}
                </div>
              </div>
            )}
          </div>

          {/* Panel Hasil Perhitungan */}
          <div className="calc-results-panel">
            {hasil.sukses ? (
              <>
                <div className="result-card primary-result">
                  <span className="result-label">Derajat Keasaman (pH)</span>
                  <span className="result-value-big">{formatDesimal(hasil.ph, 2)}</span>
                  <span className={`result-tag ${hasil.ph < 7 ? 'tag-acid' : hasil.ph > 7 ? 'tag-base' : 'tag-neutral'}`}>
                    {hasil.ph < 7 ? 'Sifat Larutan Asam' : hasil.ph > 7 ? 'Sifat Larutan Basa' : 'Sifat Larutan Netral'}
                  </span>
                </div>

                <div className="sub-results-grid">
                  <div className="sub-result-item">
                    <span className="sub-label">Nilai pOH</span>
                    <span className="sub-val">{formatDesimal(hasil.pOH, 2)}</span>
                  </div>
                  <div className="sub-result-item">
                    <span className="sub-label">[H⁺]</span>
                    <span className="sub-val">{formatNotasiIlmiah(hasil.hPlus)} M</span>
                  </div>
                  <div className="sub-result-item">
                    <span className="sub-label">[OH⁻]</span>
                    <span className="sub-val">{formatNotasiIlmiah(hasil.ohMinus)} M</span>
                  </div>
                </div>

                {/* Tombol Perincian Langkah */}
                <div className="steps-toggle-wrap">
                  <button
                    type="button"
                    className="btn-toggle-steps"
                    onClick={() => setTampilkanLangkah(!tampilkanLangkah)}
                    aria-expanded={tampilkanLangkah}
                  >
                    <span>{tampilkanLangkah ? 'Sembunyikan Langkah Hitung' : 'Lihat Langkah Perhitungan Lengkap'}</span>
                    <span className="toggle-chevron" aria-hidden="true">{tampilkanLangkah ? '▲' : '▼'}</span>
                  </button>
                </div>

                {/* Langkah-Langkah Hitung Komprehensif Sesuai Aturan */}
                {tampilkanLangkah && hasil.langkahHitung && (
                  <div className="calc-steps-box" aria-label="Langkah-Langkah Perhitungan">
                    <h4 className="steps-title">
                      <span className="steps-icon" aria-hidden="true">📝</span>
                      Langkah Perhitungan Rumus & Substitusi:
                    </h4>
                    <ol className="steps-list">
                      {hasil.langkahHitung.map((item, idx) => (
                        <li key={idx} className="step-item">
                          <strong className="step-heading">{item.langkah}</strong>
                          {item.deskripsi && <p className="step-desc">{item.deskripsi}</p>}
                          {item.rumus && (
                            <div className="step-math">
                              <span className="math-label">Rumus:</span>
                              <code className="math-code">{item.rumus}</code>
                            </div>
                          )}
                          {item.substitusi && (
                            <div className="step-math">
                              <span className="math-label">Substitusi:</span>
                              <code className="math-code">{item.substitusi}</code>
                            </div>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </>
            ) : (
              <div className="calc-placeholder-empty">
                <p>Masukkan angka konsentrasi yang valid di sebelah kiri untuk melihat hasil kalkulasi pH dan langkah perhitungannya.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

