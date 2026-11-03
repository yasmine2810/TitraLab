import React from 'react';
import HeroSection from '../components/HeroSection';

/**
 * Halaman Beranda Utama (TitraLab)
 * Sebagai beranda navigasi pengantar yang mengarahkan siswa ke 3 halaman pembelajaran terpisah:
 * 1. Halaman Tiga Modul Praktikum
 * 2. Halaman Kalkulator pH Virtual
 * 3. Halaman Kuis Pemahaman Mandiri
 */
export default function Beranda({ onNavigate }) {
  return (
    <div className="page-beranda">
      {/* 1. Hero Section */}
      <HeroSection 
        onMulaiBelajar={() => onNavigate && onNavigate('modul')} 
        onKalkulatorClick={(e) => {
          if (e) e.preventDefault();
          onNavigate && onNavigate('kalkulator');
        }}
      />

      {/* 2. Portal Tiga Halaman Pembelajaran Terpisah */}
      <section className="portal-section" id="portal-menu" aria-labelledby="portal-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Portal Pembelajaran Terpadu</span>
            </div>

            <h2 id="portal-heading" className="section-title">
              Pilih Ruang Pembelajaran <span className="text-highlight">Kimia Asam Basa</span>
            </h2>

            <p className="section-subtitle">
              Akses tiga fitur utama pembelajaran di bawah ini. Masing-masing fitur disajikan dalam halaman khusus untuk kenyamanan belajar Anda.
            </p>
          </div>

          <div className="portal-grid" role="list">
            {/* Kartu Portal 1: Modul */}
            <article className="portal-card portal-card-modul" role="listitem">
              <div className="portal-card-head">
                <div className="portal-icon-wrap" aria-hidden="true">
                  🧪
                </div>
                <span className="portal-tag">3 Topik Materi</span>
              </div>

              <h3 className="portal-card-title">Tiga Modul Praktikum PhET</h3>
              <p className="portal-card-desc">
                Pelajari konsep dasar asam basa & indikator, perbedaan kekuatan asam kuat vs lemah, serta prosedur eksperimen titrasi asam-basa volumetri secara interaktif.
              </p>

              <div className="portal-highlights">
                <span className="highlight-item">✓ Teori Arrhenius, Brønsted-Lowry & Lewis</span>
                <span className="highlight-item">✓ Derajat Ionisasi (α) & Tetapan Ka/Kb</span>
                <span className="highlight-item">✓ Kurva Titrasi Asam Kuat - Basa Kuat</span>
              </div>

              <button
                type="button"
                className="btn btn-portal-action"
                onClick={() => onNavigate && onNavigate('modul')}
              >
                <span>Buka Halaman Modul</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </article>

            {/* Kartu Portal 2: Kalkulator pH */}
            <article className="portal-card portal-card-calc" role="listitem">
              <div className="portal-card-head">
                <div className="portal-icon-wrap" aria-hidden="true">
                  🔢
                </div>
                <span className="portal-tag">Komputasi Real-Time</span>
              </div>

              <h3 className="portal-card-title">Kalkulator pH Virtual</h3>
              <p className="portal-card-desc">
                Hitung nilai konsentrasi [H⁺], [OH⁻], derajat keasaman (pH), dan pOH secara akurat untuk larutan asam kuat, asam lemah, basa kuat, dan basa lemah lengkap dengan langkah hitung.
              </p>

              <div className="portal-highlights">
                <span className="highlight-item">✓ Contoh Cepat Larutan Kimia Riil</span>
                <span className="highlight-item">✓ Validasi Angka Positif Ramah</span>
                <span className="highlight-item">✓ Langkah Substitusi Rumus Terperinci</span>
              </div>

              <button
                type="button"
                className="btn btn-portal-action"
                onClick={() => onNavigate && onNavigate('kalkulator')}
              >
                <span>Buka Kalkulator pH</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </article>

            {/* Kartu Portal 3: Kuis */}
            <article className="portal-card portal-card-quiz" role="listitem">
              <div className="portal-card-head">
                <div className="portal-icon-wrap" aria-hidden="true">
                  📝
                </div>
                <span className="portal-tag">Uji Mandiri</span>
              </div>

              <h3 className="portal-card-title">Kuis Pemahaman Mandiri</h3>
              <p className="portal-card-desc">
                Uji pemahaman Anda melalui latihan soal interaktif berbobot kurikulum SMA XI dengan urutan soal teracak otomatis dan umpan balik pembahasan seketika.
              </p>

              <div className="portal-highlights">
                <span className="highlight-item">✓ Pengacakan Soal & Pilihan Otomatis</span>
                <span className="highlight-item">✓ Umpan Balik Benar/Salah Seketika</span>
                <span className="highlight-item">✓ Penyimpanan Skor Anonim di Peramban</span>
              </div>

              <button
                type="button"
                className="btn btn-portal-action"
                onClick={() => onNavigate && onNavigate('kuis')}
              >
                <span>Mulai Kuis Sekarang</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* 3. Seksi Fitur Unggulan Simulasi PhET */}
      <section className="features-highlight-section" aria-labelledby="features-heading">
        <div className="container">
          <div className="features-box-wrap">
            <div className="features-intro">
              <span className="badge-highlight">Keunggulan Media</span>
              <h3 id="features-heading" className="features-heading-text">
                Mengapa Belajar Asam Basa dengan Simulasi Virtual?
              </h3>
              <p className="features-desc-text">
                Materi asam basa melibatkan fenomena tingkat sub-mikroskopis (ion H⁺, OH⁻, dan partikel molekul) yang tidak kasat mata pada praktikum laboratorium biasa.
              </p>
            </div>

            <div className="features-cards-mini">
              <div className="mini-feature-card">
                <div className="mini-icon" aria-hidden="true">🔬</div>
                <h4>Visualisasi Tingkat Partikel</h4>
                <p>Memperlihatkan pergerakan molekul air dan ionisasi asam basa secara nyata.</p>
              </div>

              <div className="mini-feature-card">
                <div className="mini-icon" aria-hidden="true">🛡️</div>
                <h4>Praktikum Bebas Risiko</h4>
                <p>Bebas mencoba asam dan basa pekat tanpa kekhawatiran iritasi atau tumpahan bahan kimia berbahaya.</p>
              </div>

              <div className="mini-feature-card">
                <div className="mini-icon" aria-hidden="true">⚡</div>
                <h4>Umpan Balik Instan</h4>
                <p>Melihat perubahan warna kertas lakmus dan trayek pH secara langsung seketika konsentrasi diubah.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
