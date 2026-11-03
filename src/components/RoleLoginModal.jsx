import React, { useState } from 'react';
import { setUserRole, getOrCreateAnonStudentId } from '../utils/storage';

/**
 * Komponen RoleLoginModal
 * Pemisah Login yang jelas antara Guru dan Siswa:
 * - Siswa: Masuk secara mandiri dan anonim tanpa data pribadi
 * - Guru: Masuk dengan kode akses pendidik (default: GURU123) untuk membuka fitur pembelajaran guru
 */
export default function RoleLoginModal({ isOpen, onClose, currentRole, onRoleChanged }) {
  const [tabAktif, setTabAktif] = useState(currentRole || 'siswa');
  const [pinGuru, setPinGuru] = useState('');
  const [pesanGalat, setPesanGalat] = useState('');

  if (!isOpen) return null;

  const handleLoginSiswa = () => {
    const studentId = getOrCreateAnonStudentId();
    setUserRole('siswa');
    if (onRoleChanged) {
      onRoleChanged('siswa', studentId);
    }
    onClose();
  };

  const handleLoginGuru = (e) => {
    if (e) e.preventDefault();
    setPesanGalat('');

    // Kode akses guru default yang mudah dan ramah pengguna
    const kodeValid = 'GURU123';
    const inputClean = pinGuru.trim().toUpperCase();

    if (inputClean === '' || inputClean === kodeValid || inputClean === 'GURU') {
      setUserRole('guru');
      if (onRoleChanged) {
        onRoleChanged('guru', 'Pendidik Kimia');
      }
      onClose();
    } else {
      setPesanGalat('Kode akses pengajar belum tepat. Masukkan GURU123 atau biarkan kosong untuk mode pendidik tamu.');
    }
  };

  return (
    <div 
      className="modal-overlay" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="login-modal-title"
      onClick={onClose}
    >
      <div 
        className="modal-container login-role-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="login-modal-badge">
            <span className="badge-dot" aria-hidden="true"></span>
            <span>Autentikasi Peran Pengguna</span>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Tutup jendela login"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <h2 id="login-modal-title" className="login-modal-title">
            Pilih Akses Masuk Pembelajaran
          </h2>
          <p className="login-modal-subtitle">
            Pilihlah peran Anda untuk menyesuaikan pengalaman belajar dan fitur yang disediakan pada media ini.
          </p>

          {/* Tab Pemisah Siswa vs Guru */}
          <div className="role-tab-switcher" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tabAktif === 'siswa'}
              className={`role-tab-btn ${tabAktif === 'siswa' ? 'active' : ''}`}
              onClick={() => {
                setTabAktif('siswa');
                setPesanGalat('');
              }}
            >
              <span className="role-tab-icon" aria-hidden="true">👨‍🎓</span>
              <div className="role-tab-text">
                <strong>Mode Siswa</strong>
                <small>Peserta Didik SMA XI</small>
              </div>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={tabAktif === 'guru'}
              className={`role-tab-btn ${tabAktif === 'guru' ? 'active' : ''}`}
              onClick={() => {
                setTabAktif('guru');
                setPesanGalat('');
              }}
            >
              <span className="role-tab-icon" aria-hidden="true">👨‍🏫</span>
              <div className="role-tab-text">
                <strong>Mode Guru</strong>
                <small>Pendidik & Pengajar</small>
              </div>
            </button>
          </div>

          {/* Konten Tab Siswa */}
          {tabAktif === 'siswa' && (
            <div className="role-content-box" role="tabpanel">
              <div className="role-card-banner banner-siswa">
                <div className="role-banner-header">
                  <span className="badge-pill-green">Masuk Bebas & Anonim</span>
                  <span className="anon-id-pill">ID Otomatis: {getOrCreateAnonStudentId()}</span>
                </div>
                <h3 className="role-banner-title">Akses Mandiri Siswa Kimia</h3>
                <p className="role-banner-desc">
                  Siswa dapat langsung belajar tanpa perlu registrasi data pribadi (nama/email). Seluruh progres belajar dan skor kuis tersimpan aman di peramban Anda.
                </p>
              </div>

              <div className="role-feature-list">
                <span className="feature-list-title">Fitur yang Tersedia untuk Siswa:</span>
                <ul>
                  <li>
                    <span className="icon-check" aria-hidden="true">✓</span>
                    <span><strong>3 Modul Pembelajaran Interaktif:</strong> Konsep Teori, Kekuatan Asam Basa, dan Titrasi Volumetri.</span>
                  </li>
                  <li>
                    <span className="icon-check" aria-hidden="true">✓</span>
                    <span><strong>Simulasi Virtual PhET:</strong> Akses penuh ke lab simulasi pH Scale, Solutions, dan Titration.</span>
                  </li>
                  <li>
                    <span className="icon-check" aria-hidden="true">✓</span>
                    <span><strong>Kalkulator pH Real-Time:</strong> Menghitung [H⁺], [OH⁻], pH, pOH dengan langkah perhitungan lengkap.</span>
                  </li>
                  <li>
                    <span className="icon-check" aria-hidden="true">✓</span>
                    <span><strong>Kuis Uji Pemahaman:</strong> Soal acak dengan umpan balik langsung seketika setelah menjawab.</span>
                  </li>
                </ul>
              </div>

              <div className="modal-actions-group">
                <button
                  type="button"
                  className="btn btn-hero-primary btn-full"
                  onClick={handleLoginSiswa}
                >
                  Masuk sebagai Siswa
                </button>
              </div>
            </div>
          )}

          {/* Konten Tab Guru */}
          {tabAktif === 'guru' && (
            <div className="role-content-box" role="tabpanel">
              <div className="role-card-banner banner-guru">
                <div className="role-banner-header">
                  <span className="badge-pill-indigo">Ruang Khusus Pendidik</span>
                  <span className="access-info-pill">Kurikulum Merdeka</span>
                </div>
                <h3 className="role-banner-title">Panel Pengajar & Guru Kimia</h3>
                <p className="role-banner-desc">
                  Disediakan khusus untuk Bapak/Ibu Guru guna memandu praktikum, mengakses RPP/Modul Ajar, mengunduh LKPD virtual, serta melihat kunci jawaban dan rubrik kuis.
                </p>
              </div>

              <div className="role-feature-list">
                <span className="feature-list-title">Fasilitas Khusus Guru:</span>
                <ul>
                  <li>
                    <span className="icon-check" aria-hidden="true">✓</span>
                    <span><strong>Modul Ajar & RPP:</strong> Panduan sintaks pembelajaran berbasis inkuiri dengan simulasi PhET.</span>
                  </li>
                  <li>
                    <span className="icon-check" aria-hidden="true">✓</span>
                    <span><strong>LKPD Virtual:</strong> Lembar Kerja Peserta Didik untuk 3 topik praktikum siap pakai di kelas.</span>
                  </li>
                  <li>
                    <span className="icon-check" aria-hidden="true">✓</span>
                    <span><strong>Bank Kunci & Rubrik Kuis:</strong> Kunci jawaban lengkap beserta pembahasan dan capaian pembelajaran.</span>
                  </li>
                  <li>
                    <span className="icon-check" aria-hidden="true">✓</span>
                    <span><strong>Petunjuk Pembelajaran PhET:</strong> Rekomendasi aktivitas pembelajaran di laboratorium komputer/sekolah.</span>
                  </li>
                </ul>
              </div>

              <form onSubmit={handleLoginGuru} className="guru-login-form">
                <div className="input-group">
                  <label htmlFor="pin-guru-input" className="input-label">
                    Kode Akses Pengajar / Guru:
                  </label>
                  <div className="pin-input-wrap">
                    <input
                      id="pin-guru-input"
                      type="text"
                      className="calc-input"
                      placeholder="Masukkan kode: GURU123"
                      value={pinGuru}
                      onChange={(e) => setPinGuru(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-autofill-pin"
                      onClick={() => setPinGuru('GURU123')}
                      title="Isi otomatis kode GURU123"
                    >
                      Isi GURU123
                    </button>
                  </div>
                  <span className="input-hint">
                    Petunjuk: Masukkan kode <strong>GURU123</strong> untuk aktivasi mode guru pendidik.
                  </span>
                </div>

                {pesanGalat && (
                  <div className="calc-alert-error" role="alert">
                    <span>{pesanGalat}</span>
                  </div>
                )}

                <div className="modal-actions-group">
                  <button
                    type="submit"
                    className="btn btn-hero-primary btn-full"
                  >
                    Masuk sebagai Guru
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

