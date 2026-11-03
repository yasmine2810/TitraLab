import React, { useState } from 'react';
import { modulData } from '../data/modul';
import { markModuleCompleted } from '../utils/storage';

/**
 * Komponen ModulSection
 * Menampilkan daftar 3 modul pembelajaran Kimia Asam Basa SMA Kelas XI
 * lengkap dengan dialog modal detail modul dan integrasi simulasi PhET.
 */
export default function ModulSection({ completedModules = [], onModuleCompleted }) {
  const [selectedModul, setSelectedModul] = useState(null);

  const handleOpenModul = (modul) => {
    setSelectedModul(modul);
  };

  const handleCloseModul = () => {
    setSelectedModul(null);
  };

  const handleMulaiSimulasi = (modul) => {
    const updated = markModuleCompleted(modul.id);
    if (onModuleCompleted) {
      onModuleCompleted(updated);
    }
    alert(`Memulai ${modul.nomor}: ${modul.judul}\nSimulasi PhET (${modul.simulasiPhet}) siap dipelajari!`);
    setSelectedModul(null);
  };

  return (
    <section className="modules-section" id="modul" aria-labelledby="modul-heading">
      <div className="container">
        {/* Header Seksi Modul */}
        <div className="section-header">
          <div className="section-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h10" />
            </svg>
            <span>Kurikulum Pembelajaran Kimia SMA</span>
          </div>

          <h2 id="modul-heading" className="section-title">
            Tiga Modul Pembelajaran <span className="text-highlight">Asam Basa</span>
          </h2>

          <p className="section-subtitle">
            Pilihlah modul pembelajaran virtual berbasis PhET di bawah ini untuk memulai eksperimen dan mendalami konsep secara terstruktur.
          </p>
        </div>

        {/* Grid Tiga Kartu Modul */}
        <div className="modules-grid" role="list">
          {modulData.map((modul) => {
            const isCompleted = completedModules.includes(modul.id);
            return (
              <article 
                key={modul.id} 
                className={`module-card module-card-${modul.tagAksen} ${isCompleted ? 'is-completed' : ''}`}
                role="listitem"
                aria-labelledby={`modul-title-${modul.id}`}
              >
                {/* Header Kartu */}
                <div className="card-top">
                  <div className="module-number-badge">
                    <span className="module-index-hash">#</span>
                    <span className="module-index-val">{modul.nomorUrut}</span>
                  </div>

                  <div className="module-meta-tags">
                    {isCompleted && (
                      <span className="meta-tag meta-completed" title="Modul ini telah Anda selesaikan">
                        ✓ Selesai
                      </span>
                    )}
                    <span className="meta-tag meta-category">{modul.kategori}</span>
                    <span className="meta-tag meta-duration">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {modul.durasi}
                    </span>
                  </div>
                </div>

                {/* Badan Kartu */}
                <div className="card-body">
                  <span className="module-eyebrow">{modul.nomor}</span>
                  <h3 id={`modul-title-${modul.id}`} className="module-title">
                    {modul.judul}
                  </h3>

                  <p className="module-desc">
                    {modul.deskripsi}
                  </p>

                  {/* Persamaan Kunci */}
                  <div className="module-key-formula">
                    <span className="formula-label">Persamaan Kunci:</span>
                    <code className="formula-code">{modul.rumusKunci}</code>
                  </div>

                  {/* Fokus Materi */}
                  <div className="module-topics-list">
                    <span className="topics-heading">Fokus Eksplorasi:</span>
                    <ul>
                      {modul.fokusMateri.map((fokus, idx) => (
                        <li key={idx}>
                          <svg className="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>{fokus}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Kartu & Tombol Aksi */}
                <div className="card-footer">
                  <button
                    type="button"
                    className="btn btn-open-module"
                    onClick={() => handleOpenModul(modul)}
                    aria-label={`Buka detail ${modul.nomor}: ${modul.judul}`}
                  >
                    <span>{isCompleted ? 'Pelajari Ulang' : 'Buka Modul'}</span>
                    <svg 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      aria-hidden="true"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Modal Dialog Detail Modul */}
      {selectedModul && (
        <div 
          className="modal-overlay" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-module-title"
          onClick={handleCloseModul}
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
                onClick={handleCloseModul}
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
                  Modul ini siap dieksplorasi secara virtual menggunakan simulasi PhET interaktif untuk membuktikan konsep teori asam basa tanpa membutuhkan bahan kimia berbahaya di laboratorium fisik.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-hero-secondary"
                onClick={handleCloseModul}
              >
                Tutup
              </button>
              <button 
                type="button" 
                className="btn btn-hero-primary"
                onClick={() => handleMulaiSimulasi(selectedModul)}
              >
                Jalankan Simulasi Lab Virtual
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

