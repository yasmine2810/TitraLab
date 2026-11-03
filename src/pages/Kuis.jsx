import React from 'react';
import KuisSection from '../components/KuisSection';

/**
 * Halaman Khusus Kuis Pemahaman Asam Basa
 * Menampilkan kuis interaktif dengan pengacakan soal/opsi otomatis,
 * umpan balik langsung (benar/salah + penjelasan konsep), dan penyimpanan skor anonim.
 */
export default function Kuis({ onNavigate }) {
  return (
    <div className="page-container page-kuis">
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
              Kuis Pemahaman Mandiri
            </li>
          </ol>
        </nav>
      </div>

      {/* Komponen Inti KuisSection Tanpa Mengubah Tampilan & Fitur */}
      <KuisSection />
    </div>
  );
}

