import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ModulSection from '../components/ModulSection';
import KalkulatorSection from '../components/KalkulatorSection';
import KuisSection from '../components/KuisSection';
import Footer from '../components/Footer';
import { 
  getOrCreateAnonStudentId, 
  getCompletedModules, 
  hapusSemuaProgres 
} from '../utils/storage';

/**
 * Halaman Beranda Media Pembelajaran Kimia TitraLab (Asam Basa SMA Kelas XI)
 * Mengintegrasikan komponen independen: Navbar, HeroSection, ModulSection,
 * KalkulatorSection, KuisSection, dan Footer.
 */
export default function Beranda({ theme, toggleTheme }) {
  const [completedModules, setCompletedModules] = useState([]);

  // Inisialisasi data progres modul anonim dari localStorage
  useEffect(() => {
    getOrCreateAnonStudentId();
    const modules = getCompletedModules();
    setCompletedModules(modules);
  }, []);

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
        onHapusProgres={handleHapusProgres}
      />

      <main id="konten-utama" tabIndex="-1">
        {/* 2. Hero Section Pembelajaran */}
        <HeroSection 
          onMulaiBelajar={() => scrollToSection('modul')} 
        />

        {/* 3. Seksi Tiga Modul Pembelajaran Kimia Asam Basa */}
        <ModulSection 
          completedModules={completedModules}
          onModuleCompleted={(updated) => setCompletedModules(updated)}
        />

        {/* 4. Seksi Kalkulator pH Larutan Virtual */}
        <KalkulatorSection />

        {/* 5. Seksi Kuis Pemahaman Asam Basa Interaktif */}
        <KuisSection />
      </main>

      {/* 6. Footer Terpadu dengan Atribusi PhET */}
      <Footer 
        onHapusProgres={handleHapusProgres} 
      />
    </div>
  );
}
