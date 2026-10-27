import React from 'react';
import { modulData } from '../data/modul';

/**
 * Komponen ModuleCards
 * Menampilkan daftar tiga kartu modul asam basa:
 * 1. Konsep Asam Basa dan Indikator
 * 2. Kekuatan Asam Basa dan Perhitungan pH
 * 3. Titrasi Asam Basa
 * Setiap kartu memuat nomor modul, judul, deskripsi singkat, fokus materi, dan tombol "Buka Modul".
 */
export default function ModuleCards({ onSelectModul }) {
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
          {modulData.map((modul) => (
            <article 
              key={modul.id} 
              className={`module-card module-card-${modul.tagAksen}`}
              role="listitem"
              aria-labelledby={`modul-title-${modul.id}`}
            >
              {/* Card Top / Header */}
              <div className="card-top">
                <div className="module-number-badge">
                  <span className="module-index-hash">#</span>
                  <span className="module-index-val">{modul.nomorUrut}</span>
                </div>

                <div className="module-meta-tags">
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

              {/* Card Body */}
              <div className="card-body">
                <span className="module-eyebrow">{modul.nomor}</span>
                <h3 id={`modul-title-${modul.id}`} className="module-title">
                  {modul.judul}
                </h3>

                <p className="module-desc">
                  {modul.deskripsi}
                </p>

                {/* Rumus Kunci & Fokus Materi */}
                <div className="module-key-formula">
                  <span className="formula-label">Persamaan Kunci:</span>
                  <code className="formula-code">{modul.rumusKunci}</code>
                </div>

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

              {/* Card Action / Footer */}
              <div className="card-footer">
                <button
                  type="button"
                  className="btn btn-open-module"
                  onClick={() => onSelectModul && onSelectModul(modul)}
                  aria-label={`Buka ${modul.nomor}: ${modul.judul}`}
                >
                  <span>Buka Modul</span>
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
          ))}
        </div>
      </div>
    </section>
  );
}
