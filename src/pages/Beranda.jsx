import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import RoleLoginSection from '../components/RoleLoginSection';
import ModulSection from '../components/ModulSection';
import KalkulatorSection from '../components/KalkulatorSection';
import KuisSection from '../components/KuisSection';
import PanelGuru from '../components/PanelGuru';
import RoleLoginModal from '../components/RoleLoginModal';
import Footer from '../components/Footer';
import { 
  getUserRole, 
  setUserRole, 
  getOrCreateAnonStudentId, 
  getCompletedModules, 
  hapusSemuaProgres 
} from '../utils/storage';

/**
 * Halaman Beranda Utama (TitraLab - Simulasi PhET Kimia Asam Basa SMA Kelas XI)
 * Memisahkan komponen Modul, Kalkulator pH, dan Kuis ke dalam komponen independen,
 * serta menyajikan pemisah perbedaan login antara Siswa dan Guru.
 */
export default function Beranda({ theme, toggleTheme }) {
  // State Peran Pengguna & Identitas Anonim
  const [userRole, setCurrentUserRole] = useState('siswa');
  const [anonId, setAnonId] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [completedModules, setCompletedModules] = useState([]);

  // Inisialisasi data dari penyimpanan lokal anonim
  useEffect(() => {
    const savedRole = getUserRole();
    const id = getOrCreateAnonStudentId();
    const modules = getCompletedModules();

    setCurrentUserRole(savedRole);
    setAnonId(id);
    setCompletedModules(modules);
  }, []);

  const handleRoleChanged = (newRole) => {
    setCurrentUserRole(newRole);
    setUserRole(newRole);
  };

  const handleHapusProgres = () => {
    const yakin = window.confirm(
      'Apakah Anda yakin ingin menghapus seluruh progres belajar dan riwayat kuis dari peramban ini?\nData akan direset bersih.'
    );
    if (yakin) {
      hapusSemuaProgres();
      const freshId = getOrCreateAnonStudentId();
      setAnonId(freshId);
      setCurrentUserRole('siswa');
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
        userRole={userRole}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onHapusProgres={handleHapusProgres}
      />

      <main id="konten-utama" tabIndex="-1">
        {/* 2. Hero Section Pembelajaran */}
        <HeroSection 
          onMulaiBelajar={() => scrollToSection('modul')} 
        />

        {/* 3. Pemisah Perbedaan Login antara Guru dan Siswa pada Beranda Utama */}
        <RoleLoginSection 
          userRole={userRole}
          anonId={anonId}
          onRoleChanged={handleRoleChanged}
          onHapusProgres={handleHapusProgres}
        />

        {/* 4. Panel Khusus Ruang Pendidik (Hanya Tampil Saat Login Sebagai Guru) */}
        {userRole === 'guru' && (
          <PanelGuru 
            onGantiPeran={() => handleRoleChanged('siswa')} 
          />
        )}

        {/* 5. Seksi Tiga Modul Pembelajaran Kimia Asam Basa */}
        <ModulSection 
          completedModules={completedModules}
          onModuleCompleted={(updated) => setCompletedModules(updated)}
        />

        {/* 6. Seksi Kalkulator pH Larutan Virtual */}
        <KalkulatorSection />

        {/* 7. Seksi Kuis Pemahaman Asam Basa Interaktif */}
        <KuisSection />
      </main>

      {/* 8. Footer Terpadu dengan Atribusi PhET */}
      <Footer 
        onHapusProgres={handleHapusProgres} 
      />

      {/* 9. Modal Autentikasi Pemilih Peran Login (Siswa vs Guru) */}
      <RoleLoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentRole={userRole}
        onRoleChanged={handleRoleChanged}
      />
    </div>
  );
}
