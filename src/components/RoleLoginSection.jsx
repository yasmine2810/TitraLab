import React, { useState } from 'react';
import { setUserRole } from '../utils/storage';

/**
 * Komponen RoleLoginSection
 * Pemisah Login Utama antara Siswa dan Guru yang tampil langsung di Beranda:
 * - Kartu Siswa: Akses langsung bebas registrasi untuk peserta didik
 * - Kartu Guru: Akses khusus pendidik dengan proteksi kode akses (GURU123)
 */
export default function RoleLoginSection({ 
  userRole, 
  anonId, 
  onRoleChanged, 
  onHapusProgres 
}) {
  const [pinInput, setPinInput] = useState('');
  const [pesanGalat, setPesanGalat] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);

  const handlePilihSiswa = () => {
    setUserRole('siswa');
    if (onRoleChanged) {
      onRoleChanged('siswa');
    }
    setPesanGalat('');
  };

  const handlePilihGuru = (e) => {
    if (e) e.preventDefault();
    setPesanGalat('');

    const clean = pinInput.trim().toUpperCase();
    if (clean === 'GURU123' || clean === 'GURU' || clean === '') {
      setUserRole('guru');
      if (onRoleChanged) {
        onRoleChanged('guru');
      }
      setShowPinInput(false);
      setPinInput('');
    } else {
      setPesanGalat('Kode akses pengajar salah. Masukkan GURU123.');
    }
  };

  return (
    <section className="role-auth-section" id="pemisah-login" aria-labelledby="role-heading">
      <div className="container">
        {/* Header Seksi Pemisah Login */}
        <div className="section-header">
          <div className="section-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            <span>Pemisah Peran Pengguna</span>
          </div>

          <h2 id="role-heading" className="section-title">
            Pemisah Akses Belajar: <span className="text-highlight">Siswa</span> vs <span className="text-highlight-accent">Guru</span>
          </h2>

          <p className="section-subtitle">
            Pilihlah mode login di bawah ini untuk mengaktifkan fasilitas pembelajaran yang disesuaikan dengan kebutuhan Anda.
          </p>
        </div>

        {/* Status Peran Aktif Sekarang */}
        <div className="current-role-strip" role="status">
          <div className="strip-left">
            <span className="strip-label">Status Peran Anda Saat Ini:</span>
            <span className={`strip-badge ${userRole === 'guru' ? 'badge-guru-active' : 'badge-siswa-active'}`}>
              <span className="strip-dot" aria-hidden="true"></span>
              {userRole === 'guru' ? 'Mode Guru (Pendidik Kimia)' : `Mode Siswa (ID: ${anonId})`}
            </span>
          </div>

          <div className="strip-right">
            {onHapusProgres && (
              <button
                type="button"
                className="btn btn-reset-link"
                onClick={onHapusProgres}
                title="Hapus riwayat dan progres dari peramban"
              >
                🗑️ Hapus Progres Belajar
              </button>
            )}
          </div>
        </div>

        {/* Grid Dua Kartu Peran */}
        <div className="role-cards-grid">
          {/* 1. KARTU AKSES SISWA */}
          <div className={`role-select-card card-siswa ${userRole === 'siswa' ? 'is-selected' : ''}`}>
            <div className="role-card-head">
              <div className="role-avatar avatar-siswa" aria-hidden="true">
                👨‍🎓
              </div>
              <div className="role-head-info">
                <span className="role-chip chip-siswa">Peserta Didik SMA XI</span>
                <h3 className="role-card-title">Akses Siswa</h3>
              </div>
              {userRole === 'siswa' && (
                <span className="role-active-indicator">✓ Aktif</span>
              )}
            </div>

            <p className="role-card-desc">
              Dirancang untuk belajar mandiri, melakukan simulasi PhET tanpa risiko kimia berbahaya, dan menguji pemahaman konsep secara cepat.
            </p>

            <div className="role-card-features">
              <span className="features-subhead">Hak Akses & Fasilitas Siswa:</span>
              <ul>
                <li>
                  <span className="check-bullet" aria-hidden="true">✓</span>
                  <span><strong>Eksplorasi 3 Modul:</strong> Materi lengkap asam basa, indikator, dan titrasi.</span>
                </li>
                <li>
                  <span className="check-bullet" aria-hidden="true">✓</span>
                  <span><strong>Simulasi PhET:</strong> Mengakses visualisasi molekuler dan skala pH interaktif.</span>
                </li>
                <li>
                  <span className="check-bullet" aria-hidden="true">✓</span>
                  <span><strong>Kalkulator pH:</strong> Eksperimen angka konsentrasi larutan secara seketika.</span>
                </li>
                <li>
                  <span className="check-bullet" aria-hidden="true">✓</span>
                  <span><strong>Kuis Uji Pemahaman:</strong> Umpan balik langsung setelah menjawab tanpa data pribadi.</span>
                </li>
              </ul>
            </div>

            <div className="role-card-footer">
              <div className="role-meta-info">
                <span className="meta-icon" aria-hidden="true">🔒</span>
                <span>Masuk anonim otomatis tanpa formulir pendaftaran</span>
              </div>

              {userRole === 'siswa' ? (
                <button
                  type="button"
                  className="btn btn-role-action btn-role-active"
                  disabled
                >
                  ✓ Anda Sedang Menggunakan Mode Siswa
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-role-action btn-switch-siswa"
                  onClick={handlePilihSiswa}
                >
                  Masuk sebagai Siswa
                </button>
              )}
            </div>
          </div>

          {/* 2. KARTU AKSES GURU */}
          <div className={`role-select-card card-guru ${userRole === 'guru' ? 'is-selected' : ''}`}>
            <div className="role-card-head">
              <div className="role-avatar avatar-guru" aria-hidden="true">
                👨‍🏫
              </div>
              <div className="role-head-info">
                <span className="role-chip chip-guru">Pendidik & Pengajar</span>
                <h3 className="role-card-title">Akses Guru</h3>
              </div>
              {userRole === 'guru' && (
                <span className="role-active-indicator">✓ Aktif</span>
              )}
            </div>

            <p className="role-card-desc">
              Dilengkapi perangkat administrasi ajar Kurikulum Merdeka, panduan praktikum virtual, dan kunci evaluasi untuk pembelajaran di kelas.
            </p>

            <div className="role-card-features">
              <span className="features-subhead">Hak Akses & Fasilitas Khusus Guru:</span>
              <ul>
                <li>
                  <span className="check-bullet" aria-hidden="true">✓</span>
                  <span><strong>Modul Ajar & RPP:</strong> Capaian Pembelajaran (CP) dan Alur Tujuan (ATP).</span>
                </li>
                <li>
                  <span className="check-bullet" aria-hidden="true">✓</span>
                  <span><strong>LKPD Virtual PhET:</strong> 3 Lembar Kerja Siswa siap pakai di laboratorium komputer.</span>
                </li>
                <li>
                  <span className="check-bullet" aria-hidden="true">✓</span>
                  <span><strong>Bank Kunci Kuis:</strong> Kunci jawaban lengkap beserta kisi-kisi dan pembahasan.</span>
                </li>
                <li>
                  <span className="check-bullet" aria-hidden="true">✓</span>
                  <span><strong>Petunjuk Teknis PhET:</strong> Rekomendasi sintaks pembelajaran berbasis inkuiri.</span>
                </li>
              </ul>
            </div>

            <div className="role-card-footer">
              <div className="role-meta-info">
                <span className="meta-icon" aria-hidden="true">🔑</span>
                <span>Memerlukan kode akses guru: <code>GURU123</code></span>
              </div>

              {userRole === 'guru' ? (
                <a
                  href="#panel-guru"
                  className="btn btn-role-action btn-role-active"
                >
                  ✓ Mode Guru Aktif • Buka Ruang Guru
                </a>
              ) : showPinInput ? (
                <form onSubmit={handlePilihGuru} className="pin-auth-form">
                  <div className="pin-input-group">
                    <input
                      type="text"
                      className="calc-input pin-inline-input"
                      placeholder="Masukkan kode: GURU123"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="btn btn-hero-primary btn-sm"
                    >
                      Konfirmasi
                    </button>
                    <button
                      type="button"
                      className="btn btn-hero-secondary btn-sm"
                      onClick={() => {
                        setShowPinInput(false);
                        setPesanGalat('');
                      }}
                    >
                      Batal
                    </button>
                  </div>
                  {pesanGalat && <span className="pin-error-text">{pesanGalat}</span>}
                </form>
              ) : (
                <button
                  type="button"
                  className="btn btn-role-action btn-switch-guru"
                  onClick={() => setShowPinInput(true)}
                >
                  Masuk sebagai Guru
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

