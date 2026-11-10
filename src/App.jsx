import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import Beranda from './pages/Beranda';
import Modul from './pages/Modul';
import Kalkulator from './pages/Kalkulator';
import Kuis from './pages/Kuis';
import UserProfile from './pages/UserProfile';
import PanelGuru from './pages/PanelGuru';
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
 * 2. Navigasi Antar Halaman dengan Sidebar Kiri Modern (Sesuai Desain Acuan Dark Mode Sidebar)
 * 3. Sinkronisasi URL Hash & Penyimpanan Progres Pembelajaran
 */
export default function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [currentPage, setCurrentPage] = useState('beranda');
  const [completedModules, setCompletedModules] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Fungsi penentu halaman dari hash URL
  const getPageFromHash = () => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#modul') return 'modul';
    if (hash === '#kalkulator' || hash === '#kalkulator-ph') return 'kalkulator';
    if (hash === '#kuis') return 'kuis';
    if (hash === '#profile' || hash === '#user-profile') return 'profile';
    if (hash === '#panel-guru' || hash === '#guru') return 'panel-guru';
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
    <div className={`app-shell-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      {/* 1. Sidebar Navigasi Kiri (Dark Mode Sidebar Sesuai Gambar Referensi) */}
      <Sidebar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        activePage={currentPage}
        onNavigate={navigate}
        onHapusProgres={handleHapusProgres}
        currentUser={currentUser}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* 2. Area Konten Utama Aplikasi (Di Sebelah Kanan Sidebar) */}
      <div className="app-main-viewport">
        {/* Mobile Header Bar (Hanya tampil di layar ponsel/tablet < 860px) */}
        <header className="mobile-header-bar">
          <button
            type="button"
            className="mobile-sidebar-toggle-btn"
            onClick={() => setIsMobileSidebarOpen(true)}
            aria-label="Buka menu navigasi sidebar"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          
          <div className="mobile-brand-title">
            <span>TitraLab <strong className="highlight-cyan">PhET</strong></span>
          </div>

          <button
            type="button"
            className="mobile-theme-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
            title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </header>

        {/* Kontainer Konten Halaman Aktif */}
        <main id="konten-utama" tabIndex="-1" className="main-content-flow">
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

          {currentPage === 'profile' && (
            <UserProfile 
              currentUser={currentUser}
              onNavigate={navigate}
              onLogout={handleLogout}
              onHapusProgres={handleHapusProgres}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
            />
          )}

          {currentPage === 'panel-guru' && (
            <PanelGuru onNavigate={navigate} />
          )}
        </main>

        {/* 3. Footer Terpadu dengan Atribusi Resmi PhET */}
        <Footer 
          onNavigate={navigate}
          onHapusProgres={handleHapusProgres}
        />
      </div>
    </div>
  );
}
