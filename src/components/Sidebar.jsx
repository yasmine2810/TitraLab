import React, { useState, useEffect, useRef } from 'react';

/**
 * Komponen Sidebar (Dark Mode Sidebar sesuai Desain Acuan)
 * Menampilkan:
 * 1. Bagian Atas: Logo TitraLab PhET + Tombol Toggle Collapse (« / »)
 * 2. Kotak Pencarian Materi & Navigasi Cepat
 * 3. Menu Navigasi Utama: Beranda, Modul, Kalkulator pH, Kuis, Panel Guru
 * 4. Pengaturan: Pengalih Tema Gelap/Terang & Reset Progres
 * 5. Bagian Paling Bawah: Profil Pengguna (Avatar, Nama, Email) + Tombol Titik Tiga (Control and Customize)
 *    yang membuka popup menu ke atas (User Profile & Logout).
 */
export default function Sidebar({
  theme,
  toggleTheme,
  activePage = 'beranda',
  onNavigate,
  onHapusProgres,
  currentUser,
  onLogout,
  isCollapsed = false,
  setIsCollapsed,
  isMobileOpen = false,
  setIsMobileOpen
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Tutup menu popup profil dan hasil pencarian saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tutup menu saat tombol Escape ditekan
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false);
        setIsSearchActive(false);
        if (setIsMobileOpen) setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsMobileOpen]);

  const handleLinkClick = (pageId, e) => {
    if (e) e.preventDefault();
    if (setIsMobileOpen) setIsMobileOpen(false);
    setIsUserMenuOpen(false);
    setIsSearchActive(false);
    if (onNavigate) {
      onNavigate(pageId);
    }
  };

  // Daftar item pencarian materi cepat
  const searchDestinations = [
    { label: 'Halaman Beranda', page: 'beranda', icon: '🏠', desc: 'Pengantar & portal materi' },
    { label: 'Modul 1: Konsep Asam Basa & Indikator', page: 'modul', icon: '🧪', desc: 'Arrhenius, Brønsted-Lowry & Lewis' },
    { label: 'Modul 2: Kekuatan Asam Basa & pH', page: 'modul', icon: '🧪', desc: 'Derajat ionisasi & Ka/Kb' },
    { label: 'Modul 3: Titrasi Volumetri PhET', page: 'modul', icon: '🧪', desc: 'Titik ekivalen & kurva netralisasi' },
    { label: 'Kalkulator pH Virtual', page: 'kalkulator', icon: '🔢', desc: 'Hitung pH asam kuat, lemah, basa' },
    { label: 'Kuis Pemahaman Mandiri', page: 'kuis', icon: '📝', desc: 'Latihan soal interaktif 5 nomor' },
    { label: 'Panel Guru Kimia', page: 'panel-guru', icon: '👨‍🏫', desc: 'Monitoring kelas, LKPD & kunci jawaban' },
    { label: 'User Profile (Profil Siswa)', page: 'profile', icon: '👤', desc: 'Identitas, akun & progres' }
  ];

  const filteredSearch = searchQuery.trim() === '' ? [] : searchDestinations.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Backdrop Gelap untuk Tampilan Mobile */}
      {isMobileOpen && (
        <div 
          className="sidebar-mobile-backdrop" 
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <aside 
        className={`app-sidebar ${isCollapsed ? 'is-collapsed' : 'is-expanded'} ${isMobileOpen ? 'mobile-visible' : ''}`}
        aria-label="Navigasi Utama Aplikasi"
      >
        {/* ================================================================
            1. BAGIAN ATAS: LOGO BRAND & TOMBOL COLLAPSE (« / »)
            ================================================================ */}
        <div className="sidebar-header">
          <a 
            href="#beranda" 
            className="sidebar-brand-link"
            onClick={(e) => handleLinkClick('beranda', e)}
            title="TitraLab PhET - Kimia Asam Basa SMA"
          >
            <div className="sidebar-brand-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2v5.5L4.2 18.2A2 2 0 0 0 5.9 21h12.2a2 2 0 0 0 1.7-2.8L14 7.5V2" />
                <path d="M8.5 2h7" />
                <circle cx="10" cy="18.5" r="1" fill="currentColor" />
                <circle cx="14" cy="18" r="0.75" fill="currentColor" />
              </svg>
            </div>
            {!isCollapsed && (
              <div className="sidebar-brand-text">
                <span className="brand-app-name">TitraLab <span className="brand-app-highlight">PhET</span></span>
                <span className="brand-app-sub">Kimia Asam Basa • SMA XI</span>
              </div>
            )}
          </a>

          {/* Tombol Toggle Collapse (« / » Sesuai Gambar Referensi) */}
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={() => setIsCollapsed && setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Perluas bilah samping (Expand sidebar)" : "Ciutkan bilah samping (Collapse sidebar)"}
            title={isCollapsed ? "Perluas menu (»)" : "Ciutkan menu («)"}
          >
            {isCollapsed ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6 17 11 12 6 7" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="11 17 6 12 11 7" />
                <polyline points="18 17 13 12 18 7" />
              </svg>
            )}
          </button>
        </div>

        {/* ================================================================
            2. SEARCH BAR ("Search for anything...")
            ================================================================ */}
        <div className="sidebar-search-area" ref={searchRef}>
          {isCollapsed ? (
            <button
              type="button"
              className="sidebar-search-icon-btn"
              onClick={() => setIsCollapsed(false)}
              title="Cari materi atau simulasi"
              aria-label="Cari materi"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          ) : (
            <div className="sidebar-search-box">
              <span className="search-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="text"
                className="sidebar-search-input"
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchActive(true);
                }}
                onFocus={() => setIsSearchActive(true)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus pencarian"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Dropdown Hasil Pencarian Cepat */}
          {!isCollapsed && isSearchActive && filteredSearch.length > 0 && (
            <div className="sidebar-search-results">
              {filteredSearch.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="search-result-item"
                  onClick={(e) => {
                    handleLinkClick(item.page, e);
                    setSearchQuery('');
                  }}
                >
                  <span className="res-icon">{item.icon}</span>
                  <div className="res-meta">
                    <strong>{item.label}</strong>
                    <small>{item.desc}</small>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================================================================
            3. DAFTAR MENU NAVIGASI (Sesuai Gaya Dark Mode Sidebar)
            ================================================================ */}
        <div className="sidebar-nav-scroll">
          {/* Kelompok Menu Utama (Main) */}
          <div className="sidebar-nav-group">
            {!isCollapsed && <span className="nav-group-label">Main</span>}
            <ul className="sidebar-nav-list" role="list">
              {/* Beranda (Home) */}
              <li>
                <a
                  href="#beranda"
                  className={`sidebar-nav-item ${activePage === 'beranda' ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick('beranda', e)}
                  title="Beranda"
                >
                  <span className="nav-item-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </span>
                  {!isCollapsed && <span className="nav-item-title">Home</span>}
                  {isCollapsed && <span className="sidebar-hover-tooltip">Home</span>}
                </a>
              </li>

              {/* Modul Praktikum (Documentation) */}
              <li>
                <a
                  href="#modul"
                  className={`sidebar-nav-item ${activePage === 'modul' ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick('modul', e)}
                  title="Tiga Modul Praktikum"
                >
                  <span className="nav-item-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </span>
                  {!isCollapsed && <span className="nav-item-title">Documentation</span>}
                  {isCollapsed && <span className="sidebar-hover-tooltip">Documentation</span>}
                </a>
              </li>

              {/* Kalkulator pH (Attendance / Tools) */}
              <li>
                <a
                  href="#kalkulator"
                  className={`sidebar-nav-item ${activePage === 'kalkulator' ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick('kalkulator', e)}
                  title="Kalkulator pH Virtual"
                >
                  <span className="nav-item-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                    </svg>
                  </span>
                  {!isCollapsed && <span className="nav-item-title">Attendance</span>}
                  {isCollapsed && <span className="sidebar-hover-tooltip">Attendance</span>}
                </a>
              </li>

              {/* Kuis Pemahaman (Order / Kuis) */}
              <li>
                <a
                  href="#kuis"
                  className={`sidebar-nav-item ${activePage === 'kuis' ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick('kuis', e)}
                  title="Kuis Pemahaman Mandiri"
                >
                  <span className="nav-item-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="16.5" y1="9.4" x2="7.55" y2="4.24"></line>
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.29 7 12 12 20.71 7"></polyline>
                      <line x1="12" y1="22" x2="12" y2="12"></line>
                    </svg>
                  </span>
                  {!isCollapsed && <span className="nav-item-title">Order</span>}
                  {isCollapsed && <span className="sidebar-hover-tooltip">Order</span>}
                </a>
              </li>

              {/* Panel Guru (Statistics / Panel Guru) */}
              <li>
                <a
                  href="#panel-guru"
                  className={`sidebar-nav-item ${activePage === 'panel-guru' ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick('panel-guru', e)}
                  title="Panel Guru Kimia"
                >
                  <span className="nav-item-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                  </span>
                  {!isCollapsed && <span className="nav-item-title">Statistics</span>}
                  {isCollapsed && <span className="sidebar-hover-tooltip">Statistics</span>}
                </a>
              </li>
            </ul>
          </div>

          {/* Kelompok Menu Komunikasi / Pengaturan */}
          <div className="sidebar-nav-group">
            {!isCollapsed && <span className="nav-group-label">Communication</span>}
            <ul className="sidebar-nav-list" role="list">
              {/* Pengalih Tema Mode Gelap / Terang */}
              <li>
                <button
                  type="button"
                  className="sidebar-nav-item btn-sidebar-item"
                  onClick={toggleTheme}
                  title={theme === 'dark' ? "Mode Terang Laboratorium" : "Mode Gelap Laboratorium"}
                >
                  <span className="nav-item-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                  </span>
                  {!isCollapsed && <span className="nav-item-title">Settings</span>}
                  {isCollapsed && <span className="sidebar-hover-tooltip">Settings</span>}
                </button>
              </li>

              {/* Bantuan & Reset Progres */}
              <li>
                <button
                  type="button"
                  className="sidebar-nav-item btn-sidebar-item"
                  onClick={onHapusProgres}
                  title="Hapus riwayat belajar anonim"
                >
                  <span className="nav-item-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </span>
                  {!isCollapsed && <span className="nav-item-title">Help</span>}
                  {isCollapsed && <span className="sidebar-hover-tooltip">Help</span>}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* ================================================================
            4. BAGIAN PALING BAWAH: PROFIL PENGGUNA & TOMBOL TITIK 3
               (Persis seperti contoh di bagian bawah sidebar pada gambar)
            ================================================================ */}
        {currentUser && (
          <div className="sidebar-footer-user" ref={userMenuRef}>
            {/* Popover Menu Popup ke Atas Saat Profil Ditekan */}
            {isUserMenuOpen && (
              <div className="sidebar-user-popup" role="menu">
                <div className="popup-user-summary">
                  {!avatarError && currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="" 
                      className="popup-avatar-circle" 
                      onError={() => setAvatarError(true)} 
                    />
                  ) : (
                    <span className="popup-avatar-circle" aria-hidden="true">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
                    </span>
                  )}
                  <div className="popup-user-text">
                    <strong className="popup-name">{currentUser.name}</strong>
                    <span className="popup-email">{currentUser.email}</span>
                    <span className="popup-badge">Siswa SMA Kelas XI</span>
                  </div>
                </div>

                <div className="popup-divider"></div>

                <button
                  type="button"
                  className="popup-menu-item"
                  role="menuitem"
                  onClick={(e) => handleLinkClick('profile', e)}
                >
                  <span className="popup-item-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <div className="popup-item-meta">
                    <strong>User Profile</strong>
                    <small>Identitas, akun &amp; progres</small>
                  </div>
                  <span className="popup-item-arrow" aria-hidden="true">→</span>
                </button>

                <button
                  type="button"
                  className="popup-menu-item"
                  role="menuitem"
                  onClick={(e) => handleLinkClick('panel-guru', e)}
                >
                  <span className="popup-item-icon icon-guru" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </span>
                  <div className="popup-item-meta">
                    <strong>Panel Guru</strong>
                    <small>Monitoring kelas &amp; LKPD</small>
                  </div>
                  <span className="popup-item-arrow" aria-hidden="true">→</span>
                </button>

                <div className="popup-divider"></div>

                <button
                  type="button"
                  className="popup-menu-item item-logout"
                  role="menuitem"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                >
                  <span className="popup-item-icon icon-logout" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </span>
                  <div className="popup-item-meta">
                    <strong className="text-danger">Logout</strong>
                    <small>Keluar dari sesi akun</small>
                  </div>
                </button>
              </div>
            )}

            {/* Tombol Kartu User Profile di Paling Bawah (Sesuai Desain Acuan) */}
            <button
              type="button"
              className={`sidebar-user-card-btn ${isUserMenuOpen ? 'menu-open' : ''} ${isCollapsed ? 'collapsed-card' : ''}`}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
              aria-label="Control and customize: Buka menu profil pengguna"
              title={`${currentUser.name} (${currentUser.email}) - Klik untuk opsi profil`}
            >
              {!avatarError && currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="" 
                  className="sidebar-user-avatar" 
                  onError={() => setAvatarError(true)} 
                />
              ) : (
                <span className="sidebar-user-avatar" aria-hidden="true">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
                </span>
              )}

              {!isCollapsed && (
                <>
                  <div className="sidebar-user-info">
                    <strong className="sidebar-user-name">{currentUser.name}</strong>
                    <span className="sidebar-user-email">{currentUser.email}</span>
                  </div>

                  {/* Ikon Tombol Titik Tiga (Control and Customize) */}
                  <span className="sidebar-three-dots" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="2.2" />
                      <circle cx="12" cy="12" r="2.2" />
                      <circle cx="12" cy="19" r="2.2" />
                    </svg>
                  </span>
                </>
              )}

              {isCollapsed && (
                <span className="sidebar-hover-tooltip">{currentUser.name} (Profil)</span>
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

