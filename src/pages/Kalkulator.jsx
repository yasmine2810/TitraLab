import React from 'react';
import KalkulatorSection from '../components/KalkulatorSection';

/**
 * Halaman Khusus Kalkulator pH Virtual
 * Menampilkan laboratorium komputasi perhitungan derajat keasaman asam basa,
 * tombol preset larutan kimia riil, validasi input angka positif, dan perincian langkah hitung.
 */
export default function Kalkulator({ onNavigate }) {
  return (
    <div className="page-container page-kalkulator">
      {/* Navigasi Breadcrumb */}
      <div className="container breadcrumb-container">
        <nav aria-label="Breadcrumb" className="page-breadcrumb">
          <ol className="breadcrumb-list">
            <li>
              <button 
                type="button" 
                className="breadcrumb-link"
                onClick={() => onNavigate && onNavigate('beranda')}
              >
                Beranda
              </button>
            </li>
            <li className="breadcrumb-separator" aria-hidden="true">/</li>
            <li className="breadcrumb-current" aria-current="page">
              Kalkulator pH Virtual
            </li>
          </ol>
        </nav>
      </div>

      {/* Komponen Inti KalkulatorSection Tanpa Mengubah Tampilan & Fitur */}
      <KalkulatorSection />
    </div>
  );
}

