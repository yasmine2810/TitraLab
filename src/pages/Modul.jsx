import React from 'react';
import ModulSection from '../components/ModulSection';

/**
 * Halaman Khusus Modul Pembelajaran
 * Menampilkan daftar 3 modul praktikum virtual Asam Basa berbasis PhET
 * beserta modal dialog eksplorasi masing-masing modul.
 */
export default function Modul({ completedModules, onModuleCompleted, onNavigate }) {
  return (
    <div className="page-container page-modul">
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
              Tiga Modul Praktikum
            </li>
          </ol>
        </nav>
      </div>

      {/* Komponen Inti ModulSection Tanpa Mengubah Tampilan & Fitur */}
      <ModulSection 
        completedModules={completedModules}
        onModuleCompleted={onModuleCompleted}
      />
    </div>
  );
}

