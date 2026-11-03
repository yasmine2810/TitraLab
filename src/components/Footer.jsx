import React from 'react';

/**
 * Komponen Footer
 * Menampilkan identitas media, atribusi resmi PhET Interactive Simulations,
 * navigasi pintas, dan kepatuhan standar aksesibilitas WCAG AA 4,5:1.
 */
export default function Footer({ onHapusProgres }) {
  return (
    <footer className="lab-footer" role="contentinfo">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 2v5.5L4.2 18.2A2 2 0 0 0 5.9 21h12.2a2 2 0 0 0 1.7-2.8L14 7.5V2" />
              <path d="M8.5 2h7" />
            </svg>
            <span>Simulasi PhET • TitraLab Kimia Asam Basa</span>
          </div>
          <p className="footer-desc">
            Media pembelajaran kimia interaktif untuk siswa SMA Kelas XI. Membantu visualisasi tingkat mikroskopis dan makroskopis sifat larutan asam basa serta titrasi volumetri.
          </p>
          <div className="phet-attribution-note">
            <small>
              Simulasi interaktif didukung oleh PhET Interactive Simulations, University of Colorado Boulder (
              <a href="https://phet.colorado.edu" target="_blank" rel="noopener noreferrer" className="phet-link">
                https://phet.colorado.edu
              </a>
              ).
            </small>
          </div>
        </div>

        <div className="footer-nav-groups">
          <div className="footer-col">
            <span className="footer-col-title">Navigasi Materi</span>
            <ul>
              <li><a href="#beranda">Beranda Utama</a></li>
              <li><a href="#modul">Tiga Modul Praktikum</a></li>
              <li><a href="#kalkulator-ph">Kalkulator pH Virtual</a></li>
              <li><a href="#kuis">Kuis Pemahaman Mandiri</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Topik Kurikulum XI</span>
            <ul>
              <li><span>Teori Asam Basa & Indikator</span></li>
              <li><span>Kekuatan Asam & Ionisasi</span></li>
              <li><span>Titrasi Volumetri</span></li>
              <li><span>Kurikulum Merdeka 2026</span></li>
            </ul>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Privasi & Data</span>
            <ul>
              <li><span>Penyimpanan Anonim</span></li>
              <li><span>Tanpa Registrasi Data Pribadi</span></li>
              {onHapusProgres && (
                <li>
                  <button 
                    type="button" 
                    className="btn-link-reset" 
                    onClick={onHapusProgres}
                  >
                    Hapus Seluruh Progres
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} TitraLab • Media Simulasi PhET Kimia Asam Basa SMA Kelas XI.</p>
          <p className="footer-standards">Aksesibel • Standar Kontras WCAG AA 4,5 : 1</p>
        </div>
      </div>
    </footer>
  );
}
