import React, { useState, useEffect } from 'react';
import { 
  getOrCreateAnonStudentId, 
  getCompletedModules, 
  getQuizProgress,
  getQuizSubmission,
  hapusSemuaProgres 
} from '../utils/storage';
import { 
  resetPassword, 
  updateUserProfileName, 
  isFirebaseConfigured 
} from '../utils/auth';

/**
 * Halaman UserProfile (Profil Pengguna Siswa)
 * Menyajikan:
 * 1. Identitas Siswa (Nama, Avatar Inisial/Foto, ID Siswa Pembelajaran, Jenjang Kelas XI)
 * 2. Informasi Akun & Keamanan (Email, Metode Masuk, Reset Kata Sandi, Status Sesi)
 * 3. Progres Belajar & Riwayat Aktivitas (Penyelesaian 3 Modul, Skor Kuis Asam Basa, Akses Kalkulator)
 * 4. Pengaturan Akun & Manajemen Data (Hapus Progres Belajar Anonim & Keluar Akun)
 */
export default function UserProfile({ 
  currentUser, 
  onNavigate, 
  onLogout,
  onHapusProgres,
  onUpdateUser
}) {
  const [anonId, setAnonId] = useState('');
  const [completedMods, setCompletedMods] = useState([]);
  const [quizScore, setQuizScore] = useState(null);
  const [quizSession, setQuizSession] = useState(null);
  
  // State Edit Nama Profil
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [avatarError, setAvatarError] = useState(false);

  // State Pesan Umpan Balik
  const [pesanSukses, setPesanSukses] = useState('');
  const [pesanGalat, setPesanGalat] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAnonId(getOrCreateAnonStudentId());
    setCompletedMods(getCompletedModules());
    setQuizScore(getQuizProgress());
    setQuizSession(getQuizSubmission());
  }, []);

  useEffect(() => {
    if (currentUser?.name) {
      setNameInput(currentUser.name);
    }
  }, [currentUser]);

  // Simpan perubahan nama tampilan
  const handleSaveName = async (e) => {
    if (e) e.preventDefault();
    setPesanSukses('');
    setPesanGalat('');

    const clean = nameInput.trim();
    if (!clean) {
      setPesanGalat('Nama tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updateUserProfileName(clean);
      if (res.success) {
        setPesanSukses(res.message || 'Nama profil berhasil diperbarui.');
        setIsEditingName(false);
        if (onUpdateUser && res.user) {
          onUpdateUser(res.user);
        }
      } else {
        setPesanGalat(res.message || 'Gagal memperbarui nama profil.');
      }
    } catch (err) {
      setPesanGalat('Terjadi kesalahan saat memperbarui nama.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Kirim email reset kata sandi
  const handleResetPassword = async () => {
    setPesanSukses('');
    setPesanGalat('');

    if (!currentUser?.email) {
      setPesanGalat('Alamat email akun tidak ditemukan.');
      return;
    }

    const konfirmasi = window.confirm(
      `Kirim tautan pemulihan kata sandi ke alamat email:\n${currentUser.email}?`
    );
    if (!konfirmasi) return;

    setIsSubmitting(true);
    try {
      const res = await resetPassword(currentUser.email);
      if (res.success) {
        setPesanSukses(res.message || 'Tautan pemulihan kata sandi telah dikirim ke email Anda.');
      } else {
        setPesanGalat(res.message || 'Gagal mengirim email pemulihan.');
      }
    } catch (err) {
      setPesanGalat('Terjadi kesalahan saat memproses permintaan reset kata sandi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hapus progres belajar lokal
  const handleHapusProgresData = () => {
    if (onHapusProgres) {
      onHapusProgres();
      setCompletedMods([]);
      setQuizScore(null);
      setQuizSession(null);
    } else {
      const yakin = window.confirm('Apakah Anda yakin ingin menghapus seluruh progres belajar dan nilai kuis?');
      if (yakin) {
        hapusSemuaProgres();
        setCompletedMods([]);
        setQuizScore(null);
        setQuizSession(null);
        setPesanSukses('Seluruh progres belajar telah berhasil dibersihkan.');
      }
    }
  };

  const initialLetter = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'S';

  return (
    <div className="page-container page-user-profile">
      {/* 1. Navigasi Breadcrumb */}
      <div className="container breadcrumb-container">
        <nav aria-label="Breadcrumb" className="page-breadcrumb">
          <ol className="breadcrumb-list">
            <li>
              <button 
                type="button" 
                className="breadcrumb-link"
                onClick={() => onNavigate && onNavigate('beranda')}
              >
                Beranda
              </button>
            </li>
            <li className="breadcrumb-separator" aria-hidden="true">/</li>
            <li className="breadcrumb-current" aria-current="page">
              User Profile
            </li>
          </ol>
        </nav>
      </div>

      <div className="container profile-main-container">
        {/* Notifikasi Pesan Sukses / Galat */}
        {pesanSukses && (
          <div className="profile-alert alert-success" role="status">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{pesanSukses}</span>
            <button type="button" className="alert-close-btn" onClick={() => setPesanSukses('')} aria-label="Tutup pesan">✕</button>
          </div>
        )}

        {pesanGalat && (
          <div className="profile-alert alert-error" role="alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{pesanGalat}</span>
            <button type="button" className="alert-close-btn" onClick={() => setPesanGalat('')} aria-label="Tutup pesan">✕</button>
          </div>
        )}

        {/* 2. Kartu Hero Header Pengguna */}
        <section className="profile-hero-card" aria-label="Ringkasan Profil Pengguna">
          <div className="hero-avatar-area">
            {!avatarError && currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt={`Foto profil ${currentUser.name}`}
                className="profile-hero-avatar-img"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="profile-hero-avatar-initial" aria-hidden="true">
                {initialLetter}
              </div>
            )}
            <span className="avatar-status-dot" title="Akun Aktif" aria-label="Status aktif"></span>
          </div>

          <div className="hero-info-area">
            <div className="hero-name-row">
              <h1 className="hero-user-name">{currentUser?.name || 'Siswa TitraLab'}</h1>
              <span className="badge-level">Siswa SMA Kelas XI</span>
            </div>
            <p className="hero-user-email">{currentUser?.email || 'siswa@titralab.id'}</p>

            <div className="hero-badges-row">
              <span className="hero-tag tag-id">
                <span className="tag-icon">🆔</span> ID Belajar: <strong>{anonId}</strong>
              </span>
              <span className="hero-tag tag-verified">
                <span className="tag-icon">✓</span> Terverifikasi
              </span>
              {isFirebaseConfigured ? (
                <span className="hero-tag tag-cloud">
                  <span className="tag-icon">☁️</span> Firebase Cloud
                </span>
              ) : (
                <span className="hero-tag tag-local">
                  <span className="tag-icon">💾</span> Sesi Peramban Lokal
                </span>
              )}
            </div>
          </div>

          <div className="hero-action-area">
            <button
              type="button"
              className="btn btn-outline-hero"
              onClick={() => onNavigate && onNavigate('beranda')}
            >
              ← Kembali ke Beranda
            </button>
            {onLogout && (
              <button
                type="button"
                className="btn btn-danger-hero"
                onClick={onLogout}
              >
                Logout
              </button>
            )}
          </div>
        </section>

        {/* 3. Grid Dua Kolom: Identitas & Akun */}
        <div className="profile-grid">
          {/* Kolom Kiri: Identitas Siswa */}
          <section className="profile-card" aria-labelledby="card-identity-title">
            <div className="card-header-row">
              <div className="card-title-wrap">
                <span className="card-icon" aria-hidden="true">👤</span>
                <h2 id="card-identity-title" className="card-title">Identitas Siswa</h2>
              </div>
              {!isEditingName && (
                <button
                  type="button"
                  className="btn-text-action"
                  onClick={() => setIsEditingName(true)}
                >
                  ✎ Ubah Nama
                </button>
              )}
            </div>

            <div className="card-body">
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="edit-name-form">
                  <label htmlFor="input-edit-nama" className="field-label">
                    Nama Lengkap Tampilan
                  </label>
                  <div className="edit-name-row">
                    <input
                      id="input-edit-nama"
                      type="text"
                      className="form-input"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Masukkan nama lengkap siswa"
                      disabled={isSubmitting}
                      autoFocus
                    />
                    <button 
                      type="submit" 
                      className="btn btn-primary-sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary-sm"
                      onClick={() => {
                        setIsEditingName(false);
                        setNameInput(currentUser?.name || '');
                      }}
                      disabled={isSubmitting}
                    >
                      Batal
                    </button>
                  </div>
                </form>
              ) : (
                <div className="info-item-list">
                  <div className="info-item">
                    <span className="info-label">Nama Siswa</span>
                    <strong className="info-value">{currentUser?.name || '-'}</strong>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Jenjang Pendidikan</span>
                    <span className="info-value">SMA Kelas XI (Fase F - Kurikulum Merdeka)</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Mata Pelajaran</span>
                    <span className="info-value">Kimia: Larutan Asam Basa &amp; Titrasi</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">ID Progres Anonim</span>
                    <span className="info-value font-mono">{anonId}</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Kolom Kanan: Pengaturan Akun & Keamanan */}
          <section className="profile-card" aria-labelledby="card-account-title">
            <div className="card-header-row">
              <div className="card-title-wrap">
                <span className="card-icon" aria-hidden="true">🔐</span>
                <h2 id="card-account-title" className="card-title">Akun &amp; Keamanan</h2>
              </div>
            </div>

            <div className="card-body">
              <div className="info-item-list">
                <div className="info-item">
                  <span className="info-label">Alamat Email</span>
                  <strong className="info-value">{currentUser?.email || '-'}</strong>
                </div>
                <div className="info-item">
                  <span className="info-label">Metode Autentikasi</span>
                  <span className="info-value">
                    {currentUser?.photoURL ? 'Akun Google OAuth (SSO)' : 'Email & Kata Sandi'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status Keamanan</span>
                  <span className="info-value text-success">
                    ● Sesi Aktif Terverifikasi
                  </span>
                </div>
              </div>

              <div className="account-action-box">
                <div className="action-box-text">
                  <strong>Atur Ulang Kata Sandi</strong>
                  <p>Kirimkan tautan resmi ke email terdaftar untuk memperbarui kata sandi akun Anda.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-sm"
                  onClick={handleResetPassword}
                  disabled={isSubmitting}
                >
                  Kirim Tautan Reset
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* 4. Progres Belajar & Riwayat Pembelajaran */}
        <section className="profile-card card-full" aria-labelledby="card-progress-title">
          <div className="card-header-row">
            <div className="card-title-wrap">
              <span className="card-icon" aria-hidden="true">📊</span>
              <h2 id="card-progress-title" className="card-title">Progres Belajar &amp; Kuis Kimia</h2>
            </div>
            <button
              type="button"
              className="btn btn-primary-sm"
              onClick={() => onNavigate && onNavigate('modul')}
            >
              Lanjutkan Belajar →
            </button>
          </div>

          <div className="card-body">
            {/* Stat Bar */}
            <div className="stats-metric-grid">
              <div className="stat-metric-card">
                <span className="stat-metric-icon">🧪</span>
                <div className="stat-metric-data">
                  <span className="stat-metric-number">
                    {completedMods.length} <small>/ 3</small>
                  </span>
                  <span className="stat-metric-label">Modul Praktikum Selesai</span>
                </div>
              </div>

              <div className="stat-metric-card">
                <span className="stat-metric-icon">📝</span>
                <div className="stat-metric-data">
                  <span className="stat-metric-number">
                    {quizScore ? `${quizScore.skor}` : '0'} <small>/ 100</small>
                  </span>
                  <span className="stat-metric-label">
                    {quizScore ? `Skor Kuis (${quizScore.benar}/${quizScore.total} Benar)` : 'Belum Mengerjakan Kuis'}
                  </span>
                </div>
              </div>

              <div className="stat-metric-card">
                <span className="stat-metric-icon">⚖️</span>
                <div className="stat-metric-data">
                  <span className="stat-metric-number">Virtual PhET</span>
                  <span className="stat-metric-label">Simulasi Titrasi Tersedia</span>
                </div>
              </div>
            </div>

            {/* Daftar Modul */}
            <h3 className="section-subheading">Status Tiga Modul Praktikum:</h3>
            <div className="module-status-list">
              <div className="module-status-item">
                <div className="module-item-left">
                  <span className={`module-check-badge ${completedMods.includes('modul-1') ? 'completed' : 'pending'}`}>
                    {completedMods.includes('modul-1') ? '✓' : '1'}
                  </span>
                  <div className="module-item-info">
                    <strong>Modul 1: Konsep Asam Basa &amp; Teori Arrhenius, Brønsted-Lowry, Lewis</strong>
                    <small>Identifikasi larutan asam basa dengan indikator alami dan lakmus</small>
                  </div>
                </div>
                <div className="module-item-right">
                  <span className={`status-pill ${completedMods.includes('modul-1') ? 'pill-success' : 'pill-pending'}`}>
                    {completedMods.includes('modul-1') ? 'Selesai' : 'Belum Selesai'}
                  </span>
                  <button 
                    type="button" 
                    className="btn btn-outline-xs"
                    onClick={() => onNavigate && onNavigate('modul')}
                  >
                    Buka
                  </button>
                </div>
              </div>

              <div className="module-status-item">
                <div className="module-item-left">
                  <span className={`module-check-badge ${completedMods.includes('modul-2') ? 'completed' : 'pending'}`}>
                    {completedMods.includes('modul-2') ? '✓' : '2'}
                  </span>
                  <div className="module-item-info">
                    <strong>Modul 2: Kekuatan Asam Basa &amp; Perhitungan Derajat Keasaman (pH)</strong>
                    <small>Tetapan ionisasi (Ka/Kb), derajat disosiasi (α), dan hubungan pH + pOH = 14</small>
                  </div>
                </div>
                <div className="module-item-right">
                  <span className={`status-pill ${completedMods.includes('modul-2') ? 'pill-success' : 'pill-pending'}`}>
                    {completedMods.includes('modul-2') ? 'Selesai' : 'Belum Selesai'}
                  </span>
                  <button 
                    type="button" 
                    className="btn btn-outline-xs"
                    onClick={() => onNavigate && onNavigate('modul')}
                  >
                    Buka
                  </button>
                </div>
              </div>

              <div className="module-status-item">
                <div className="module-item-left">
                  <span className={`module-check-badge ${completedMods.includes('modul-3') ? 'completed' : 'pending'}`}>
                    {completedMods.includes('modul-3') ? '✓' : '3'}
                  </span>
                  <div className="module-item-info">
                    <strong>Modul 3: Titrasi Asam Basa &amp; Simulasi Virtual PhET</strong>
                    <small>Penentuan konsentrasi analit lewat titik ekuivalen dan kurva titrasi</small>
                  </div>
                </div>
                <div className="module-item-right">
                  <span className={`status-pill ${completedMods.includes('modul-3') ? 'pill-success' : 'pill-pending'}`}>
                    {completedMods.includes('modul-3') ? 'Selesai' : 'Belum Selesai'}
                  </span>
                  <button 
                    type="button" 
                    className="btn btn-outline-xs"
                    onClick={() => onNavigate && onNavigate('modul')}
                  >
                    Buka
                  </button>
                </div>
              </div>
            </div>

            {/* Detail Kuis */}
            <div className="quiz-details-box">
              <div className="quiz-details-content">
                <strong>Kuis Pemahaman Kimia Asam Basa</strong>
                <p>
                  {quizScore 
                    ? `Hasil pengerjaan terakhir: Anda menjawab ${quizScore.benar} benar dari ${quizScore.total} soal (Nilai: ${quizScore.skor}). Disimpan pada ${quizScore.waktu || 'sesi ini'}.`
                    : 'Uji penguasaan konsep teori asam basa, perhitungan pH, dan kurva titrasi Anda melalui kuis interaktif.'
                  }
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline-sm"
                onClick={() => onNavigate && onNavigate('kuis')}
              >
                {quizScore ? 'Kerjakan Ulang Kuis' : 'Mulai Kuis Sekarang'}
              </button>
            </div>
          </div>
        </section>

        {/* 5. Bagian Privasi & Manajemen Data (Sesuai AGENTS.md) */}
        <section className="profile-card card-full card-danger-zone" aria-labelledby="card-danger-title">
          <div className="card-header-row">
            <div className="card-title-wrap">
              <span className="card-icon" aria-hidden="true">⚙️</span>
              <h2 id="card-danger-title" className="card-title">Privasi &amp; Manajemen Data Siswa</h2>
            </div>
          </div>

          <div className="card-body">
            <p className="privacy-desc">
              Sesuai kaidah privasi TitraLab, riwayat modul dan nilai kuis hanya disimpan secara anonim pada penyimpanan peramban lokal (<code>localStorage</code>) tanpa mengumpulkan data pribadi sensitif. Anda dapat mereset data kapan saja secara mandiri.
            </p>

            <div className="danger-actions-row">
              <button
                type="button"
                className="btn btn-danger-outline"
                onClick={handleHapusProgresData}
              >
                🗑️ Hapus Seluruh Progres Belajar
              </button>
              {onLogout && (
                <button
                  type="button"
                  className="btn btn-danger-solid"
                  onClick={onLogout}
                >
                  🚪 Keluar dari Akun (Logout)
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

