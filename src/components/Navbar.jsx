import React, { useState, useEffect } from 'react';

/**
 * Komponen Navbar
 * Memuat identitas media "Simulasi PhET", tautan navigasi (Modul, Kalkulator pH, Kuis),
 * tombol pengganti tema (mode terang/gelap), dan menu responsif untuk perangkat bergerak.
 */
export default function Navbar({ theme, toggleTheme, onNavClick }) {
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

  const handleLinkClick = (targetId) => {
    setIsMobileMenuOpen(false);
    if (onNavClick) {
      onNavClick(targetId);
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
          onClick={() => handleLinkClick('beranda')}
          aria-label="Simulasi PhET Asam Basa - Beranda Kimia SMA Kelas XI"
        >
          <div className="brand-icon-wrapper" aria-hidden="true">
            {/* SVG Lab Erlenmeyer Flask Icon */}
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
              Simulasi <span className="highlight-phet">PhET</span>
            </span>
            <span className="brand-subtitle">Kimia Asam Basa • SMA XI</span>
          </div>
        </a>

        {/* Tautan Navigasi Desktop */}
        <nav className="nav-desktop" aria-label="Navigasi Utama">
          <ul className="nav-list">
            <li>
              <a 
                href="#modul" 
                className="nav-link"
                onClick={() => handleLinkClick('modul')}
              >
                <span className="nav-dot" aria-hidden="true"></span>
                Modul
              </a>
            </li>
            <li>
              <a 
                href="#kalkulator-ph" 
                className="nav-link"
                onClick={() => handleLinkClick('kalkulator-ph')}
              >
                <span className="nav-dot" aria-hidden="true"></span>
                Kalkulator pH
              </a>
            </li>
            <li>
              <a 
                href="#kuis" 
                className="nav-link"
                onClick={() => handleLinkClick('kuis')}
              >
                <span className="nav-dot" aria-hidden="true"></span>
                Kuis
              </a>
            </li>
          </ul>
        </nav>

        {/* Aksi Tambahan: Pengalih Tema & Tombol Mobile */}
        <div className="nav-actions">
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
            onClick={() => handleLinkClick('modul')}
          >
            Buka Simulasi
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

      {/* Menu Overlay untuk Perangkat Layar Kecil (Mobile Drawer) */}
      <div 
        id="mobile-navigation"
        className={`mobile-menu-drawer ${isMobileMenuOpen ? 'is-active' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mobile-menu-backdrop" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <span className="mobile-menu-label">Navigasi Pembelajaran</span>
            <button 
              type="button" 
              className="mobile-close-btn" 
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Tutup menu navigasi"
            >
              ✕
            </button>
          </div>

          <nav aria-label="Navigasi Menu Ponsel">
            <ul className="mobile-nav-list">
              <li>
                <a 
                  href="#modul" 
                  className="mobile-nav-link"
                  onClick={() => handleLinkClick('modul')}
                >
                  <span className="mobile-icon" aria-hidden="true">🧪</span>
                  <span>Modul Asam Basa</span>
                </a>
              </li>
              <li>
                <a 
                  href="#kalkulator-ph" 
                  className="mobile-nav-link"
                  onClick={() => handleLinkClick('kalkulator-ph')}
                >
                  <span className="mobile-icon" aria-hidden="true">🔢</span>
                  <span>Kalkulator pH</span>
                </a>
              </li>
              <li>
                <a 
                  href="#kuis" 
                  className="mobile-nav-link"
                  onClick={() => handleLinkClick('kuis')}
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
              onClick={() => handleLinkClick('modul')}
            >
              Mulai Eksperimen Virtual
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
