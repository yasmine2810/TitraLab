import React, { useState } from 'react';

/**
 * Komponen HeroSection
 * Menampilkan judul media, satu kalimat penjelasan edukatif sains,
 * tombol "Mulai Belajar", serta peraga visual laboratorium virtual interaktif.
 */
export default function HeroSection({ onMulaiBelajar }) {
  // Simulator mini interaktif pH untuk menarik antusiasme siswa
  const [phNilai, setPhNilai] = useState(7.0);

  // Penentuan spektrum warna larutan berdasarkan nilai pH
  const getLarutanStyle = (val) => {
    if (val < 3) return { bg: 'rgba(239, 68, 68, 0.28)', border: '#ef4444', label: 'Asam Kuat', ion: 'H₃O⁺ >> OH⁻' };
    if (val < 7) return { bg: 'rgba(249, 115, 22, 0.25)', border: '#f97316', label: 'Asam Lemah', ion: 'H₃O⁺ > OH⁻' };
    if (val === 7) return { bg: 'rgba(16, 185, 129, 0.25)', border: '#10b981', label: 'Netral (Air Murni)', ion: '[H⁺] = [OH⁻]' };
    if (val <= 11) return { bg: 'rgba(6, 182, 212, 0.25)', border: '#06b6d4', label: 'Basa Lemah', ion: 'OH⁻ > H₃O⁺' };
    return { bg: 'rgba(99, 102, 241, 0.28)', border: '#6366f1', label: 'Basa Kuat', ion: 'OH⁻ >> H₃O⁺' };
  };

  const statusLarutan = getLarutanStyle(Number(phNilai));

  return (
    <section className="hero-section" id="beranda" aria-labelledby="hero-heading">
      <div className="container hero-grid">
        {/* Kolom Teks & Tombol Aksi */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-pulse" aria-hidden="true"></span>
            <span>Kimia SMA Kelas XI • Kurikulum Merdeka</span>
          </div>

          <h1 id="hero-heading" className="hero-title">
            Eksplorasi Konsep <span className="text-highlight">Asam Basa</span> Lewat Simulasi Laboratorium Virtual
          </h1>

          <p className="hero-description">
            Pelajari konsep sifat larutan, pengukuran derajat keasaman (pH), dan prosedur eksperimen titrasi secara visual dan interaktif melalui media simulasi PhET sains.
          </p>

          <div className="hero-cta-group">
            <a 
              href="#modul" 
              className="btn btn-hero-primary"
              onClick={onMulaiBelajar}
              id="tombol-mulai-belajar"
            >
              <span>Mulai Belajar</span>
              <svg 
                className="btn-arrow" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>

            <a 
              href="#kalkulator-ph" 
              className="btn btn-hero-secondary"
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="10" x2="16" y2="10" />
                <line x1="8" y1="14" x2="12" y2="14" />
                <line x1="8" y1="18" x2="10" y2="18" />
              </svg>
              <span>Kalkulator pH</span>
            </a>
          </div>

          {/* Indikator Keunggulan / Metrik Edukasi */}
          <div className="hero-stats" role="list">
            <div className="stat-item" role="listitem">
              <span className="stat-number">3</span>
              <span className="stat-label">Modul Praktikum</span>
            </div>
            <div className="stat-divider" aria-hidden="true"></div>
            <div className="stat-item" role="listitem">
              <span className="stat-number">0 - 14</span>
              <span className="stat-label">Rentang Skala pH</span>
            </div>
            <div className="stat-divider" aria-hidden="true"></div>
            <div className="stat-item" role="listitem">
              <span className="stat-number">100%</span>
              <span className="stat-label">Eksperimen Bebas Risiko</span>
            </div>
          </div>
        </div>

        {/* Kolom Visual Laboratorium & Demo Interaktif */}
        <div className="hero-visual-card" aria-label="Visualisasi laboratorium virtual asam basa">
          <div className="lab-card-glow" aria-hidden="true"></div>
          
          <div className="lab-display-header">
            <div className="lab-window-dots" aria-hidden="true">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div className="lab-monitor-badge">
              <span className="live-indicator" aria-hidden="true"></span>
              <span>PHET LAB SIMULATOR v2.4</span>
            </div>
          </div>

          {/* Aparatus Laboratorium Kimia (SVG Visual) */}
          <div className="lab-apparatus-area">
            {/* Tabung Erlenmeyer & Larutan */}
            <div className="flask-container">
              <svg 
                className="flask-svg" 
                viewBox="0 0 200 240" 
                aria-hidden="true"
              >
                {/* Garis leher dan badan labu erlenmeyer */}
                <defs>
                  <linearGradient id="flaskLiquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={statusLarutan.border} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={statusLarutan.border} stopOpacity="0.35" />
                  </linearGradient>
                  <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Skala Ukur Labu */}
                <line x1="88" y1="130" x2="100" y2="130" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <line x1="82" y1="150" x2="98" y2="150" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <line x1="74" y1="170" x2="96" y2="170" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <line x1="66" y1="190" x2="92" y2="190" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

                {/* Cairan di dalam labu yang warnanya dinamis */}
                <path 
                  d="M 52 205 L 148 205 Q 160 205 155 190 L 125 125 Q 100 120 75 125 L 45 190 Q 40 205 52 205 Z" 
                  fill="url(#flaskLiquidGrad)"
                  className="liquid-fluid"
                />

                {/* Gelembung mikro ion larutan */}
                <circle cx="85" cy="180" r="3.5" fill="rgba(255,255,255,0.7)" className="bubble b1" />
                <circle cx="115" cy="165" r="2.5" fill="rgba(255,255,255,0.7)" className="bubble b2" />
                <circle cx="98" cy="145" r="2" fill="rgba(255,255,255,0.7)" className="bubble b3" />

                {/* Garis Kaca Erlenmeyer */}
                <path 
                  d="M 85 20 L 115 20 M 90 20 L 90 75 L 165 200 Q 172 215 155 215 L 45 215 Q 28 215 35 200 L 110 75 L 110 20" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.75)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {/* Probe pH Meter Digital tercelup */}
                <rect x="96" y="30" width="8" height="120" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                <circle cx="100" cy="150" r="6" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Panel Pengukuran pH Real-Time */}
            <div className="ph-meter-panel">
              <div className="ph-meter-header">
                <span className="ph-meter-title">SENSOR pH ELEKTRODA</span>
                <span className="ph-meter-state" style={{ color: statusLarutan.border }}>
                  ● AKTIF
                </span>
              </div>

              <div className="ph-readout">
                <span className="ph-symbol">pH</span>
                <span className="ph-digits" style={{ color: statusLarutan.border }}>
                  {Number(phNilai).toFixed(1)}
                </span>
              </div>

              <div className="ph-nature-badge" style={{ borderColor: statusLarutan.border, color: statusLarutan.border }}>
                {statusLarutan.label}
              </div>

              <p className="ph-ion-ratio">
                Kondisi Ion: <code>{statusLarutan.ion}</code>
              </p>

              {/* Slider Interaktif Pengubah pH */}
              <div className="ph-slider-box">
                <label htmlFor="ph-slider-input" className="ph-slider-label">
                  Uji Perubahan pH:
                </label>
                <input 
                  id="ph-slider-input"
                  type="range" 
                  min="0" 
                  max="14" 
                  step="0.5"
                  value={phNilai} 
                  onChange={(e) => setPhNilai(parseFloat(e.target.value))}
                  className="ph-range-slider"
                  aria-valuemin="0"
                  aria-valuemax="14"
                  aria-valuenow={phNilai}
                  aria-label="Penggeser nilai pH untuk simulasi interaktif larutan"
                />
                <div className="ph-slider-marks" aria-hidden="true">
                  <span>0 (Asam)</span>
                  <span>7 (Netral)</span>
                  <span>14 (Basa)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lab-footer-note">
            <span className="lab-tip-icon" aria-hidden="true">💡</span>
            <span>
              Geser nilai pH untuk mengamati respons warna larutan dan dominasi ion secara langsung.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
