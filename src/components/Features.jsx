import React from 'react';

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
    title: 'Vite Next-Gen Bundler',
    description: 'Server start instan tanpa menunggu bundling. HMR super cepat membuat proses development terasa sangat mulus.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    ),
    title: 'Komponen Modular',
    description: 'Struktur kode bersih dan terorganisir. Mudah diperluas untuk aplikasi skala kecil maupun enterprise.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
    title: 'Reaktif & Interaktif',
    description: 'Ditenagai React Hooks modern (useState, useEffect, useMemo) untuk manajemen state yang reaktif dan stabil.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="m4.93 4.93 4.24 4.24"></path>
        <path d="m14.83 9.17 4.24-4.24"></path>
        <path d="m14.83 14.83 4.24 4.24"></path>
        <path d="m9.17 14.83-4.24 4.24"></path>
        <circle cx="12" cy="12" r="4"></circle>
      </svg>
    ),
    title: 'Design System Modern',
    description: 'Mendukung Dark & Light mode dengan token CSS murni, Glassmorphism halus, dan animasi yang elegan.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
    title: 'Production Ready',
    description: 'Optimasi bundle otomatis berbasis Rollup saat menjalankan `npm run build` dengan hasil file yang sangat ringkas.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    title: 'Tanpa Dependensi Rumit',
    description: 'Setup rapi dan teruji tanpa konflik dependensi. Siap langsung ditambahkan router, axios, ataupun state store.'
  }
];

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="section-header">
          <div className="badge">Kenapa React + Vite?</div>
          <h2 className="section-title">
            Fondasi Sempurna untuk <span className="text-gradient">Project Web Anda</span>
          </h2>
          <p className="section-desc">
            Nikmati kemudahan pengembangan frontend dengan konfigurasi optimal sejak detik pertama.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="glass-card feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
