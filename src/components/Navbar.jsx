import React, { useState, useEffect } from 'react';

/**
 * Komponen Navbar
 * Navigasi antar halaman (Beranda, Modul, Kalkulator pH, Kuis)
 * dengan indikator halaman aktif, profil akun pengguna, tombol keluar, dan pengalih tema.
 */
export default function Navbar({ 
  theme, 
  toggleTheme, 
  activePage = 'beranda', 
  onNavigate, 
  onHapusProgres,
  currentUser,
  onLogout
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Tutup menu saat menekan tombol Escape di keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Kunci scroll halaman ketika menu mobile terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLinkClick = (pageId, e) => {
    if (e) e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(pageId);
    }
  };

  return (
    <header className="navbar" role="banner">
      {/* Skip link untuk aksesibilitas pembaca layar dan navigasi keyboard */}
      <a href="#konten-utama" className="skip-link">
        Langsung ke konten utama
      </a>

      <div className="container navbar-inner">
        {/* Identitas Media */}
        <a 
          href="#beranda" 
          className="brand"
          onClick={(e) => handleLinkClick('beranda', e)}
          aria-label="Simulasi PhET TitraLab Asam Basa - Beranda Kimia SMA Kelas XI"
        >
          <div className="brand-icon-wrapper" aria-hidden="true">
            <svg 
              className="brand-svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M10 2v5.5L4.2 18.2A2 2 0 0 0 5.9 21h12.2a2 2 0 0 0 1.7-2.8L14 7.5V2" />
              <path d="M8.5 2h7" />
              <path d="M7 16h10" />
              <circle cx="10" cy="18.5" r="1" fill="currentColor" />
              <circle cx="14" cy="18" r="0.75" fill="currentColor" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">
              TitraLab <span className="highlight-phet">PhET</span>
            </span>
            <span className="brand-subtitle">Kimia Asam Basa • SMA XI</span>
          </div>
        </a>

        {/* Tautan Navigasi Antar Halaman Desktop */}
        <nav className="nav-desktop" aria-label="Navigasi Utama">
          <ul className="nav-list">
            <li>
              <a 
                href="#beranda" 
                className={`nav-link ${activePage === 'beranda' ? 'active' : ''}`}
                onClick={(e) => handleLinkClick('beranda', e)}
                aria-current={activePage === 'beranda' ? 'page' : undefined}
              >
                <span className="nav-dot" aria-hidden="true"></span>
                Beranda
              </a>
            </li>
            <li>
              <a 
                href="#modul" 
                className={`nav-link ${activePage === 'modul' ? 'active' : ''}`}
                onClick={(e) => handleLinkClick('modul', e)}
                aria-current={activePage === 'modul' ? 'page' : undefined}
              >
                <span className="nav-dot" aria-hidden="true"></span>
                Modul
              </a>
            </li>
            <li>
              <a 
                href="#kalkulator" 
                className={`nav-link ${activePage === 'kalkulator' ? 'active' : ''}`}
                onClick={(e) => handleLinkClick('kalkulator', e)}
                aria-current={activePage === 'kalkulator' ? 'page' : undefined}
              >
                <span className="nav-dot" aria-hidden="true"></span>
                Kalkulator pH
              </a>
            </li>
            <li>
              <a 
                href="#kuis" 
                className={`nav-link ${activePage === 'kuis' ? 'active' : ''}`}
                onClick={(e) => handleLinkClick('kuis', e)}
                aria-current={activePage === 'kuis' ? 'page' : undefined}
              >
                <span className="nav-dot" aria-hidden="true"></span>
                Kuis
              </a>
            </li>
          </ul>
        </nav>

        {/* Aksi Navigasi: Profil Akun, Tema, Tombol Aksi */}
        <div className="nav-actions">
          {/* Lencana Profil Siswa Terautentikasi */}
          {currentUser && (
            <div className="nav-user-badge" title={`Masuk sebagai ${currentUser.name} (${currentUser.email})`}>
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="" className="user-avatar-circle" style={{ objectFit: 'cover' }} />
              ) : (
                <span className="user-avatar-circle" aria-hidden="true">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
                </span>
              )}
              <span className="user-name-text">{currentUser.name}</span>
              {onLogout && (
                <button
                  type="button"
                  className="btn-nav-logout"
                  onClick={onLogout}
                  title="Keluar dari akun"
                >
                  Keluar
                </button>
              )}
            </div>
          )}

          {/* Pengalih Tema */}
          <button 
            type="button"
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'Beralih ke mode terang laboratorium' : 'Beralih ke mode gelap laboratorium'}
            aria-label={theme === 'dark' ? 'Beralih ke mode terang laboratorium' : 'Beralih ke mode gelap laboratorium'}
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          <a 
            href="#modul" 
            className="btn-nav-action"
            onClick={(e) => handleLinkClick('modul', e)}
          >
            Buka Modul
          </a>

          {/* Tombol Hamburger Mobile */}
          <button 
            type="button"
            className="hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          >
            <span className={`hamburger-bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Menu Drawer untuk Perangkat Layar Ponsel */}
      <div 
        id="mobile-navigation"
        className={`mobile-menu-drawer ${isMobileMenuOpen ? 'is-active' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mobile-menu-backdrop" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <span className="mobile-menu-label">Navigasi Halaman Belajar</span>
            <button 
              type="button" 
              className="mobile-close-btn" 
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Tutup menu navigasi"
            >
              ✕
            </button>
          </div>

          {/* Info Pengguna Mobile */}
          {currentUser && (
            <div className="mobile-user-card">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="" className="user-avatar-circle" style={{ objectFit: 'cover' }} />
              ) : (
                <span className="user-avatar-circle" aria-hidden="true">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
                </span>
              )}
              <div className="mobile-user-text">
                <strong>{currentUser.name}</strong>
                <small>{currentUser.email}</small>
              </div>
              {onLogout && (
                <button
                  type="button"
                  className="btn-mobile-logout"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                >
                  Keluar
                </button>
              )}
            </div>
          )}

          <nav aria-label="Navigasi Menu Ponsel">
            <ul className="mobile-nav-list">
              <li>
                <a 
                  href="#beranda" 
                  className={`mobile-nav-link ${activePage === 'beranda' ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick('beranda', e)}
                >
                  <span className="mobile-icon" aria-hidden="true">🏠</span>
                  <span>Halaman Beranda</span>
                </a>
              </li>
              <li>
                <a 
                  href="#modul" 
                  className={`mobile-nav-link ${activePage === 'modul' ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick('modul', e)}
                >
                  <span className="mobile-icon" aria-hidden="true">🧪</span>
                  <span>Tiga Modul Praktikum</span>
                </a>
              </li>
              <li>
                <a 
                  href="#kalkulator" 
                  className={`mobile-nav-link ${activePage === 'kalkulator' ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick('kalkulator', e)}
                >
                  <span className="mobile-icon" aria-hidden="true">🔢</span>
                  <span>Kalkulator pH Virtual</span>
                </a>
              </li>
              <li>
                <a 
                  href="#kuis" 
                  className={`mobile-nav-link ${activePage === 'kuis' ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick('kuis', e)}
                >
                  <span className="mobile-icon" aria-hidden="true">📝</span>
                  <span>Kuis Pemahaman</span>
                </a>
              </li>
            </ul>
          </nav>

          <div className="mobile-menu-footer">
            <a 
              href="#modul" 
              className="btn-full-width"
              onClick={(e) => handleLinkClick('modul', e)}
            >
              Mulai Eksperimen Virtual
            </a>
            {onHapusProgres && (
              <button
                type="button"
                className="btn-reset-mobile"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onHapusProgres();
                }}
              >
                Hapus Seluruh Progres
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
