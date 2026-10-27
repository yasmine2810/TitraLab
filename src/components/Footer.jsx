import React from 'react';

export default function Footer() {
  return (
    <footer id="docs" className="footer">
      <div className="container footer-content">
        <div className="footer-top">
          <div className="footer-info">
            <div className="brand">
              <span className="brand-name">React<span className="text-gradient">Vite</span></span>
            </div>
            <p className="footer-desc">
              Setup project modern siap pakai untuk pembuatan aplikasi web interaktif, performan, dan estetik.
            </p>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Struktur Direktori</h4>
              <ul className="footer-links">
                <li><code>src/components/</code> - Komponen UI</li>
                <li><code>src/App.jsx</code> - Komponen Utama</li>
                <li><code>src/index.css</code> - Global Design System</li>
                <li><code>vite.config.js</code> - Konfigurasi Vite</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Perintah Utama</h4>
              <ul className="footer-links">
                <li><code>npm run dev</code> - Jalankan Server Dev</li>
                <li><code>npm run build</code> - Build untuk Produksi</li>
                <li><code>npm run preview</code> - Preview Hasil Build</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} React Vite Starter Project. Dibuat dengan performa & estetika maksimal.</p>
          <div className="status-badge">
            <span className="status-dot"></span>
            Siap Dikembangkan
          </div>
        </div>
      </div>
    </footer>
  );
}
