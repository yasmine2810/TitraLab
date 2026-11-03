import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Beranda from './pages/Beranda';
import Modul from './pages/Modul';
import Kalkulator from './pages/Kalkulator';
import Kuis from './pages/Kuis';
import { 
  getOrCreateAnonStudentId, 
  getCompletedModules, 
  hapusSemuaProgres 
} from './utils/storage';
import './App.css';

/**
 * Komponen Utama App
 * Mengelola sistem navigasi antar halaman (Beranda, Modul, Kalkulator pH, Kuis),
 * sinkronisasi URL hash untuk riwayat peramban (tombol Back/Forward),
 * tema laboratorium (gelap/terang), serta progres anonim siswa di localStorage.
 */
export default function App() {
  const [theme, setTheme] = useState('dark');
  const [currentPage, setCurrentPage] = useState('beranda');
  const [completedModules, setCompletedModules] = useState([]);

  // Fungsi penentu halaman dari hash URL
  const getPageFromHash = () => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#modul') return 'modul';
    if (hash === '#kalkulator' || hash === '#kalkulator-ph') return 'kalkulator';
    if (hash === '#kuis') return 'kuis';
    return 'beranda';
  };

  // Inisialisasi tema, halaman aktif dari hash, dan data progres siswa
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    getOrCreateAnonStudentId();
    setCompletedModules(getCompletedModules());
    setCurrentPage(getPageFromHash());

    const handleHashChange = () => {
      const page = getPageFromHash();
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navigate = (pageId) => {
    setCurrentPage(pageId);
    window.location.hash = `#${pageId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHapusProgres = () => {
    const yakin = window.confirm(
      'Apakah Anda yakin ingin menghapus seluruh progres belajar dan riwayat kuis dari peramban ini?\nData akan direset bersih.'
    );
    if (yakin) {
      hapusSemuaProgres();
      getOrCreateAnonStudentId();
      setCompletedModules([]);
      alert('Seluruh progres belajar telah berhasil dibersihkan.');
    }
  };

  return (
    <div className="beranda-wrapper">
      {/* 1. Navbar Navigasi Terpadu Antar Halaman */}
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        activePage={currentPage}
        onNavigate={navigate}
        onHapusProgres={handleHapusProgres}
      />

      {/* 2. Kontainer Konten Halaman Aktif */}
      <main id="konten-utama" tabIndex="-1">
        {currentPage === 'beranda' && (
          <Beranda onNavigate={navigate} />
        )}

        {currentPage === 'modul' && (
          <Modul 
            completedModules={completedModules}
            onModuleCompleted={(updated) => setCompletedModules(updated)}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'kalkulator' && (
          <Kalkulator onNavigate={navigate} />
        )}

        {currentPage === 'kuis' && (
          <Kuis onNavigate={navigate} />
        )}
      </main>

      {/* 3. Footer Terpadu dengan Atribusi Resmi PhET */}
      <Footer 
        onNavigate={navigate}
        onHapusProgres={handleHapusProgres}
      />
    </div>
  );
}
