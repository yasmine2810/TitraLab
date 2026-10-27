import React, { useState } from 'react';

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const command = 'npm run dev';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="hero-section">
      <div className="container hero-container">
        <div className="hero-badge-wrap">
          <div className="badge">
            <span className="pulse-dot"></span>
            Projek React + Vite Siap Digunakan
          </div>
        </div>

        <h1 className="hero-title">
          Bangun Aplikasi Modern dengan <br />
          <span className="text-gradient">Kecepatan & Elegansi</span>
        </h1>

        <p className="hero-subtitle">
          Setup React berbasis Vite generasi terbaru dengan Hot Module Replacement (HMR) secepat kilat,
          arsitektur modular, dan desain antarmuka yang bersih serta responsif.
        </p>

        <div className="hero-cta-group">
          <a href="#demo" className="btn btn-primary">
            Lihat Demo Interaktif
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>

          <div className="command-box" onClick={copyToClipboard} role="button" tabIndex={0} title="Klik untuk menyalin">
            <span className="terminal-prefix">$</span>
            <code>{command}</code>
            <button className="copy-icon-btn" aria-label="Copy command">
              {copied ? (
                <span className="copied-text">Tersalin!</span>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">&lt; 50ms</span>
            <span className="stat-label">HMR Update</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">React 18 Ready</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">Ultra</span>
            <span className="stat-label">Responsif & Ringan</span>
          </div>
        </div>
      </div>
    </section>
  );
}
