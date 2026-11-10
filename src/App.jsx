import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import Beranda from './pages/Beranda';
import Modul from './pages/Modul';
import Kalkulator from './pages/Kalkulator';
import Kuis from './pages/Kuis';
import { 
  getOrCreateAnonStudentId, 
  getCompletedModules, 
  hapusSemuaProgres 
} from './utils/storage';
import { 
  getCurrentSession, 
  logoutUser,
  subscribeToAuthChanges 
} from './utils/auth';
import './App.css';

/**
 * Komponen Utama App
 * Menangani:
 * 1. Gerbang Autentikasi Awal (LoginPage: Login, Register, Lupa Sandi, Remember Sandi)
 * 2. Navigasi Antar Halaman (Beranda, Modul, Kalkulator pH, Kuis)
 * 3. Sinkronisasi URL Hash & Penyimpanan Progres Pembelajaran
 */
export default function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
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

  // 1. Terapkan tema aktif
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // 2. Inisialisasi sesi login Firebase/lokal, progres modul, dan listener navigasi hash
  useEffect(() => {
    // Berlangganan status login real-time dari Firebase
    const unsubscribeAuth = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setIsAuthChecking(false);
    });

    getOrCreateAnonStudentId();
    setCompletedModules(getCompletedModules());
    setCurrentPage(getPageFromHash());

    const handleHashChange = () => {
      const page = getPageFromHash();
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      if (typeof unsubscribeAuth === 'function') {
        unsubscribeAuth();
      }
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navigate = (pageId) => {
    setCurrentPage(pageId);
    window.location.hash = `#${pageId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler saat login / register / guest berhasil
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPage('beranda');
    window.location.hash = '#beranda';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler saat user keluar (logout)
  const handleLogout = async () => {
    const yakin = window.confirm('Apakah Anda yakin ingin keluar dari akun?');
    if (yakin) {
      await logoutUser();
      setCurrentUser(null);
      window.location.hash = '#login';
    }
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

  // Tampilkan blank / loading halus saat memeriksa sesi
  if (isAuthChecking) {
    return null;
  }

  // JIKA BELUM LOGIN: Tampilkan Gerbang Halaman Login (Sesuai Desain Gambar Referensi)
  if (!currentUser) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess} 
      />
    );
  }

  // JIKA SUDAH LOGIN: Tampilkan Seluruh Media Pembelajaran TitraLab PhET
  return (
    <div className="beranda-wrapper">
      {/* 1. Navbar Navigasi Terpadu Antar Halaman */}
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        activePage={currentPage}
        onNavigate={navigate}
        onHapusProgres={handleHapusProgres}
        currentUser={currentUser}
        onLogout={handleLogout}
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
