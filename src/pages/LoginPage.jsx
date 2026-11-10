import React, { useState, useEffect } from 'react';
import { 
  loginUser, 
  registerUser, 
  resetPassword, 
  loginAsGuest, 
  getRememberedEmail,
  getGoogleAccounts,
  addGoogleAccount,
  loginWithGoogle,
  loginWithFirebaseGoogle,
  isFirebaseConfigured
} from '../utils/auth';

/**
 * Komponen LoginPage (Halaman Masuk, Daftar, Lupa Sandi, & Remember Sandi)
 * Dilengkapi:
 * - Autentikasi Firebase Cloud Sungguhan (Email & Password, Google OAuth, Reset Password)
 * - Fitur Login (Sign In)
 * - Fitur Register (Daftar Akun)
 * - Fitur Lupa Kata Sandi (Forgot Password dengan tautan resmi)
 * - Fitur Remember Sandi (Centang "Remember me" via Firebase Persistence)
 * - Fitur Terhubung dengan Pilihan Akun Google (Popup resmi Google OAuth atau Pemilih Akun)
 * - Mode Transisi / Cadangan jika Kredensial Firebase di .env belum disetel
 */
export default function LoginPage({ onLoginSuccess }) {
  // Mode tampilan: 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState('login');

  // State Formulir Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // State Formulir Register
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // State Formulir Lupa Sandi
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotPass, setShowForgotPass] = useState(false);

  // State Dialog Pilihan Akun Google & Modal Petunjuk Firebase
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [googleAccountsList, setGoogleAccountsList] = useState([]);
  const [connectingGoogleId, setConnectingGoogleId] = useState(null);
  const [showAddGoogle, setShowAddGoogle] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // State Pemuatan (Loading)
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Pesan Umpan Balik (Sukses / Galat)
  const [pesanGalat, setPesanGalat] = useState('');
  const [pesanSukses, setPesanSukses] = useState('');

  // Saat pertama dimuat, isi email yang tersimpan jika Remember Me pernah dicentang
  useEffect(() => {
    const remembered = getRememberedEmail();
    if (remembered) {
      setLoginEmail(remembered);
      setRememberMe(true);
    } else {
      setLoginEmail('siswa@titralab.id');
      setLoginPassword('kimia123');
    }
    setGoogleAccountsList(getGoogleAccounts());
  }, []);

  const clearMessages = () => {
    setPesanGalat('');
    setPesanSukses('');
  };

  // 1. Eksekusi Login (Mendukung Firebase & Fallback)
  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    clearMessages();
    setIsLoading(true);

    try {
      const res = await loginUser(loginEmail, loginPassword, rememberMe);
      if (res.success) {
        setPesanSukses(res.message);
        if (onLoginSuccess) {
          onLoginSuccess(res.user);
        }
      } else {
        setPesanGalat(res.message);
      }
    } catch (err) {
      setPesanGalat('Terjadi kesalahan saat memproses login.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Eksekusi Register (Mendukung Firebase & Fallback)
  const handleRegisterSubmit = async (e) => {
    if (e) e.preventDefault();
    clearMessages();

    if (regPassword.length < 6) {
      setPesanGalat('Kata sandi minimal 6 karakter sesuai standar keamanan.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setPesanGalat('Konfirmasi kata sandi tidak cocok. Harap periksa kembali.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerUser(regName, regEmail, regPassword);
      if (res.success) {
        setPesanSukses(res.message);
        setLoginEmail(regEmail);
        setLoginPassword(regPassword);
        setTimeout(() => {
          setAuthMode('login');
        }, 1400);
      } else {
        setPesanGalat(res.message);
      }
    } catch (err) {
      setPesanGalat('Terjadi kesalahan saat mendaftar akun.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Eksekusi Reset Kata Sandi (Kirim Email Firebase / Fallback)
  const handleForgotSubmit = async (e) => {
    if (e) e.preventDefault();
    clearMessages();

    if (!isFirebaseConfigured) {
      if (forgotNewPassword !== forgotConfirmPassword) {
        setPesanGalat('Konfirmasi kata sandi baru tidak sama.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const res = await resetPassword(forgotEmail, forgotNewPassword);
      if (res.success) {
        setPesanSukses(res.message);
        if (!isFirebaseConfigured) {
          setLoginEmail(forgotEmail);
          setLoginPassword(forgotNewPassword);
        }
        setTimeout(() => {
          setAuthMode('login');
        }, 2500);
      } else {
        setPesanGalat(res.message);
      }
    } catch (err) {
      setPesanGalat('Gagal memproses pemulihan kata sandi.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Masuk Cepat sebagai Siswa Tamu
  const handleGuestEntry = () => {
    const guestUser = loginAsGuest();
    if (onLoginSuccess) {
      onLoginSuccess(guestUser);
    }
  };

  // 5. Eksekusi Masuk dengan Google (Popup Resmi Firebase / Akun Chooser)
  const handleGoogleAuthClick = async () => {
    clearMessages();
    if (isFirebaseConfigured) {
      setIsGoogleLoading(true);
      try {
        const res = await loginWithFirebaseGoogle(rememberMe);
        if (res.success) {
          setPesanSukses(res.message);
          if (onLoginSuccess) {
            onLoginSuccess(res.user);
          }
        } else {
          setPesanGalat(res.message);
        }
      } catch (err) {
        setPesanGalat('Gagal menghubungkan akun Google.');
      } finally {
        setIsGoogleLoading(false);
      }
    } else {
      // Jika Firebase belum disetel di .env, tampilkan dialog pemilih akun Google simulasi & petunjuk
      setShowGoogleModal(true);
    }
  };

  // 6. Pilih Akun dari Modal Dialog Simulasi
  const handleSelectGoogleAccount = (account) => {
    setConnectingGoogleId(account.id);
    setTimeout(() => {
      const res = loginWithGoogle(account, rememberMe);
      setConnectingGoogleId(null);
      setShowGoogleModal(false);
      if (res.success && onLoginSuccess) {
        onLoginSuccess(res.user);
      }
    }, 450);
  };

  // 7. Tambah Akun Google Baru di Modal Simulasi
  const handleAddCustomGoogleAccount = (e) => {
    if (e) e.preventDefault();
    const res = addGoogleAccount(customGoogleName, customGoogleEmail);
    if (res.success && res.account) {
      setGoogleAccountsList(getGoogleAccounts());
      setShowAddGoogle(false);
      setCustomGoogleName('');
      setCustomGoogleEmail('');
      handleSelectGoogleAccount(res.account);
    } else {
      alert(res.message || 'Gagal menambahkan akun Google.');
    }
  };

  // Isi Otomatis Akun Demo
  const handleAutoFillDemo = () => {
    setLoginEmail('siswa@titralab.id');
    setLoginPassword('kimia123');
    setRememberMe(true);
    clearMessages();
  };

  return (
    <div className="auth-fullscreen-wrap">
      {/* Latar Belakang Ambient Glow */}
      <div className="auth-ambient-blob blob-1" aria-hidden="true"></div>
      <div className="auth-ambient-blob blob-2" aria-hidden="true"></div>
      <div className="auth-ambient-blob blob-3" aria-hidden="true"></div>

      {/* Kontainer Kartu Frosted Glass Luar */}
      <div className="auth-card-outer">
        <div className="auth-card-inner">
          
          {/* ============================================================
              KOLOM KIRI: Formulir Masuk / Daftar / Lupa Sandi
              ============================================================ */}
          <div className="auth-form-column">
            {/* Header Brand TitraLab PhET */}
            <div className="auth-brand-header">
              <div className="auth-brand-logo" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 2v5.5L4.2 18.2A2 2 0 0 0 5.9 21h12.2a2 2 0 0 0 1.7-2.8L14 7.5V2" />
                  <path d="M8.5 2h7" />
                  <circle cx="10" cy="18.5" r="1" fill="currentColor" />
                  <circle cx="14" cy="18" r="0.75" fill="currentColor" />
                </svg>
              </div>
              <div className="auth-brand-text">
                <span className="auth-brand-name">TitraLab <span className="highlight-cyan">PhET</span></span>
                <span className="auth-brand-sub">Kimia Asam Basa • SMA XI</span>
              </div>
            </div>

            {/* Indikator Status Integrasi Firebase */}
            <div className="auth-firebase-badge-row">
              {isFirebaseConfigured ? (
                <div className="firebase-status-pill status-active" title="Terhubung ke Firebase Cloud">
                  <span className="status-indicator-dot dot-active"></span>
                  <span>Firebase Auth Aktif (Cloud)</span>
                </div>
              ) : (
                <button 
                  type="button" 
                  className="firebase-status-pill status-notice" 
                  onClick={() => setShowConfigModal(true)}
                  title="Klik untuk melihat cara menyambungkan kredensial Firebase"
                >
                  <span className="status-indicator-dot dot-notice"></span>
                  <span>Siapkan Kredensial Firebase (.env)</span>
                  <span className="status-pill-arrow">⚙️</span>
                </button>
              )}
            </div>

            {/* Kotak Pesan Status Sukses atau Galat */}
            {pesanGalat && (
              <div className="auth-alert alert-error" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{pesanGalat}</span>
              </div>
            )}

            {pesanSukses && (
              <div className="auth-alert alert-success" role="status">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{pesanSukses}</span>
              </div>
            )}

            {/* ============================================================
                FORM A: LOGIN (Sign In to your Account)
                ============================================================ */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="auth-form-content">
                <div className="auth-heading-wrap">
                  <h1 className="auth-title">Sign In to your Account</h1>
                  <p className="auth-subtitle">
                    Silakan masukkan email dan kata sandi Anda untuk mengakses laboratorium simulasi virtual kimia.
                  </p>
                </div>

                {/* Input Email */}
                <div className="auth-field-group">
                  <label htmlFor="login-email-input" className="auth-label">
                    Email
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                    <input
                      id="login-email-input"
                      type="email"
                      className="auth-input"
                      placeholder="Enter Email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Input Password */}
                <div className="auth-field-group">
                  <div className="auth-label-row">
                    <label htmlFor="login-password-input" className="auth-label">
                      Password
                    </label>
                    <button
                      type="button"
                      className="auth-link-forgot"
                      onClick={() => {
                        setForgotEmail(loginEmail);
                        clearMessages();
                        setAuthMode('forgot');
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      className="auth-input input-with-toggle"
                      placeholder="Enter Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m15 18-.722-3.25" />
                          <path d="M2 10a14.7 14.7 0 0 0 20 0" />
                          <path d="m2 2 20 20" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Checkbox Remember Me (Centang Ingat Sandi) */}
                <div className="auth-options-row">
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      id="remember-me-checkbox"
                      className="auth-checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="auth-custom-box" aria-hidden="true">
                      {rememberMe && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </span>
                    <span className="checkbox-text">Remember me</span>
                  </label>
                </div>

                {/* Tombol Utama Sign In */}
                <button type="submit" className="btn-auth-primary" disabled={isLoading}>
                  {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                </button>

                {/* Garis Pemisah (Divider) */}
                <div className="auth-divider">
                  <span className="auth-divider-line"></span>
                  <span className="auth-divider-text">atau masuk dengan</span>
                  <span className="auth-divider-line"></span>
                </div>

                {/* Tombol Terhubung dengan Pilihan Akun Google */}
                <button
                  type="button"
                  className="btn-google-auth"
                  onClick={handleGoogleAuthClick}
                  disabled={isGoogleLoading}
                >
                  <svg className="google-icon-svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>
                    {isGoogleLoading ? 'Menghubungkan Google...' : 'Lanjutkan dengan Akun Google'}
                  </span>
                </button>

                {/* Pintasan Akun Demo & Opsi Tamu */}
                <div className="auth-quick-tools">
                  <button
                    type="button"
                    className="btn-demo-autofill"
                    onClick={handleAutoFillDemo}
                    title="Gunakan akun demo siswa@titralab.id"
                  >
                    <span>⚡ Akun Demo Pengujian (siswa@titralab.id / kimia123)</span>
                  </button>
                </div>

                {/* Link Pindah ke Register */}
                <div className="auth-switch-footer">
                  <span>Not registered yet? </span>
                  <button
                    type="button"
                    className="auth-link-action"
                    onClick={() => {
                      clearMessages();
                      setAuthMode('register');
                    }}
                  >
                    Create an account
                  </button>
                </div>

                {/* Akses Masuk Tamu */}
                <div className="auth-guest-option">
                  <button
                    type="button"
                    className="btn-guest-entry"
                    onClick={handleGuestEntry}
                  >
                    Masuk Langsung sebagai Tamu (Eksplorasi Bebas) →
                  </button>
                </div>
              </form>
            )}

            {/* ============================================================
                FORM B: REGISTER (Create an Account)
                ============================================================ */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="auth-form-content">
                <div className="auth-heading-wrap">
                  <h1 className="auth-title">Create an Account</h1>
                  <p className="auth-subtitle">
                    Daftarkan akun Anda untuk mencatat riwayat modul dan nilai kuis kimia asam basa.
                  </p>
                </div>

                {/* Input Nama Siswa */}
                <div className="auth-field-group">
                  <label htmlFor="reg-name-input" className="auth-label">
                    Full Name / Nama Siswa
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="5" />
                        <path d="M20 21a8 8 0 1 0-16 0" />
                      </svg>
                    </span>
                    <input
                      id="reg-name-input"
                      type="text"
                      className="auth-input"
                      placeholder="Enter Full Name (cth: Arya Wiguna)"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Input Email */}
                <div className="auth-field-group">
                  <label htmlFor="reg-email-input" className="auth-label">
                    Email Address
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                    <input
                      id="reg-email-input"
                      type="email"
                      className="auth-input"
                      placeholder="Enter Email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Input Password */}
                <div className="auth-field-group">
                  <label htmlFor="reg-password-input" className="auth-label">
                    Password (Minimal 6 karakter)
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="reg-password-input"
                      type={showRegPassword ? 'text' : 'password'}
                      className="auth-input input-with-toggle"
                      placeholder="Enter Password (min. 6 karakter)"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      aria-label="Toggle password"
                    >
                      {showRegPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Input Confirm Password */}
                <div className="auth-field-group">
                  <label htmlFor="reg-confirm-password-input" className="auth-label">
                    Confirm Password
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </span>
                    <input
                      id="reg-confirm-password-input"
                      type={showRegPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder="Re-enter Password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Tombol Register */}
                <button type="submit" className="btn-auth-primary" disabled={isLoading}>
                  {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                </button>

                {/* Divider Google di Register */}
                <div className="auth-divider">
                  <span className="auth-divider-line"></span>
                  <span className="auth-divider-text">atau daftar langsung dengan</span>
                  <span className="auth-divider-line"></span>
                </div>

                <button
                  type="button"
                  className="btn-google-auth"
                  onClick={handleGoogleAuthClick}
                  disabled={isGoogleLoading}
                >
                  <svg className="google-icon-svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>
                    {isGoogleLoading ? 'Menghubungkan Google...' : 'Daftar Cepat dengan Akun Google'}
                  </span>
                </button>

                {/* Link Pindah ke Login */}
                <div className="auth-switch-footer">
                  <span>Already have an account? </span>
                  <button
                    type="button"
                    className="auth-link-action"
                    onClick={() => {
                      clearMessages();
                      setAuthMode('login');
                    }}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}

            {/* ============================================================
                FORM C: FORGOT PASSWORD (Reset Password)
                ============================================================ */}
            {authMode === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="auth-form-content">
                <div className="auth-heading-wrap">
                  <h1 className="auth-title">Reset your Password</h1>
                  <p className="auth-subtitle">
                    {isFirebaseConfigured 
                      ? 'Masukkan email terdaftar Anda. Tautan pemulihan kata sandi resmi akan dikirim ke email Anda oleh Firebase.' 
                      : 'Masukkan email terdaftar dan tentukan kata sandi baru Anda untuk kembali belajar.'
                    }
                  </p>
                </div>

                {/* Input Email Terdaftar */}
                <div className="auth-field-group">
                  <label htmlFor="forgot-email-input" className="auth-label">
                    Registered Email
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                    <input
                      id="forgot-email-input"
                      type="email"
                      className="auth-input"
                      placeholder="Enter Registered Email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Jika Firebase belum aktif, tampilkan input sandi baru manual */}
                {!isFirebaseConfigured && (
                  <>
                    <div className="auth-field-group">
                      <label htmlFor="forgot-new-password-input" className="auth-label">
                        New Password
                      </label>
                      <div className="auth-input-wrapper">
                        <span className="auth-input-icon" aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </span>
                        <input
                          id="forgot-new-password-input"
                          type={showForgotPass ? 'text' : 'password'}
                          className="auth-input input-with-toggle"
                          placeholder="Enter New Password"
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="auth-password-toggle"
                          onClick={() => setShowForgotPass(!showForgotPass)}
                          aria-label="Toggle password"
                        >
                          {showForgotPass ? '🙈' : '👁️'}
                        </button>
                      </div>
                    </div>

                    <div className="auth-field-group">
                      <label htmlFor="forgot-confirm-password-input" className="auth-label">
                        Confirm New Password
                      </label>
                      <div className="auth-input-wrapper">
                        <span className="auth-input-icon" aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                        </span>
                        <input
                          id="forgot-confirm-password-input"
                          type={showForgotPass ? 'text' : 'password'}
                          className="auth-input"
                          placeholder="Re-enter New Password"
                          value={forgotConfirmPassword}
                          onChange={(e) => setForgotConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Tombol Simpan Sandi Baru */}
                <button type="submit" className="btn-auth-primary" disabled={isLoading}>
                  {isLoading 
                    ? 'SENDING...' 
                    : (isFirebaseConfigured ? 'SEND RESET LINK VIA FIREBASE' : 'RESET PASSWORD')
                  }
                </button>

                {/* Kembali ke Sign In */}
                <div className="auth-switch-footer">
                  <button
                    type="button"
                    className="auth-link-action"
                    onClick={() => {
                      clearMessages();
                      setAuthMode('login');
                    }}
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ============================================================
              KOLOM KANAN: Ilustrasi Grafis Sesuai Contoh Gambar Desain
              (Lingkaran Biru Pekat, Dedaunan, Karakter Melayang, & Node Berpendar)
              ============================================================ */}
          <div className="auth-illustration-column" aria-hidden="true">
            <div className="illustration-circle-canvas">
              {/* Efek Daun Botani Translusen di Sudut Lingkaran */}
              <div className="botanical-leaf leaf-top-left"></div>
              <div className="botanical-leaf leaf-top-right"></div>
              <div className="botanical-leaf leaf-bottom-left"></div>
              <div className="botanical-leaf leaf-bottom-right"></div>

              {/* Garis-Garis Rangkaian Konstelasi Berpendar */}
              <svg className="constellation-svg" viewBox="0 0 400 400">
                <line x1="200" y1="120" x2="200" y2="70" className="constellation-line line-glow" />
                <line x1="200" y1="180" x2="110" y2="150" className="constellation-line" />
                <line x1="200" y1="180" x2="290" y2="130" className="constellation-line" />
                <line x1="200" y1="240" x2="130" y2="280" className="constellation-line" />
                <line x1="200" y1="240" x2="270" y2="295" className="constellation-line" />
                <line x1="200" y1="260" x2="215" y2="340" className="constellation-line" />
              </svg>

              {/* Node 1: Top Center (Logo PhET TitraLab Glow Halus) */}
              <div className="glowing-node node-top-center glow-cyan">
                <div className="node-inner">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
              </div>

              {/* Node 2: Top Right (Surat / Modul Pembelajaran) */}
              <div className="glowing-node node-top-right glow-orange">
                <div className="node-inner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
              </div>

              {/* Node 3: Center Left (Pesawat Kertas / Eksplorasi) */}
              <div className="glowing-node node-center-left glow-blue">
                <div className="node-inner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </div>
              </div>

              {/* Node 4: Center Right (Grafik Batang / Analisis pH & Titrasi) */}
              <div className="glowing-node node-center-right glow-yellow">
                <div className="node-inner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </div>
              </div>

              {/* Node 5: Bottom Left (Megafon / Kolaborasi Diskusi) */}
              <div className="glowing-node node-bottom-left glow-magenta">
                <div className="node-inner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="m3 11 18-5v12L3 14v-3z" />
                    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                  </svg>
                </div>
              </div>

              {/* Node 6: Bottom Right (Flask Kimia / Komunikasi Lab) */}
              <div className="glowing-node node-bottom-right glow-red">
                <div className="node-inner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M10 2v5.5L4.2 18.2A2 2 0 0 0 5.9 21h12.2a2 2 0 0 0 1.7-2.8L14 7.5V2" />
                    <path d="M8.5 2h7" />
                  </svg>
                </div>
              </div>

              {/* Karakter Siswa 3D Melayang Menggapai Node Bersinar (Sesuai Desain) */}
              <div className="floating-character-wrapper">
                <svg className="character-svg" viewBox="0 0 160 220" fill="none">
                  {/* Efek Bayangan Aura Melayang */}
                  <ellipse cx="80" cy="205" rx="35" ry="8" fill="rgba(14, 165, 233, 0.2)" />

                  {/* Lengan Kanan Menggapai ke Atas Menuju Node */}
                  <path d="M85 80 L108 42 L115 30" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
                  <circle cx="116" cy="28" r="6" fill="#fbcfe8" />

                  {/* Kaki Kiri Menggantung */}
                  <path d="M72 135 L62 175 L52 195" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round" />
                  <path d="M52 195 L44 200" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />

                  {/* Kaki Kanan Menekuk Dinamis */}
                  <path d="M88 135 L102 165 L106 185" stroke="#2563eb" strokeWidth="12" strokeLinecap="round" />
                  <path d="M106 185 L116 190" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />

                  {/* Badan / Rompi Biru Gelap */}
                  <rect x="65" y="75" width="30" height="65" rx="14" fill="#1e1b4b" />
                  <rect x="72" y="78" width="16" height="35" rx="8" fill="#6366f1" />

                  {/* Lengan Kiri Santai */}
                  <path d="M68 85 L52 110 L58 128" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
                  <circle cx="58" cy="130" r="5" fill="#fbcfe8" />

                  {/* Kepala & Wajah Karakter */}
                  <circle cx="80" cy="54" r="14" fill="#fbcfe8" />
                  <path d="M68 50 C68 40 92 40 92 50 C92 54 88 56 80 56 C74 56 68 54 68 50 Z" fill="#0f172a" />
                  <ellipse cx="76" cy="48" rx="8" ry="4" fill="#0f172a" />
                </svg>
              </div>

              {/* Lencana Keterangan Kecil */}
              <div className="illustration-caption-pill">
                <span>Eksplorasi Lab Sains Virtual 360°</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================
          MODAL DIALOG: PILIHAN AKUN GOOGLE (GOOGLE ACCOUNT CHOOSER)
          ============================================================ */}
      {showGoogleModal && (
        <div 
          className="google-modal-overlay" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="google-picker-title"
          onClick={() => setShowGoogleModal(false)}
        >
          <div 
            className="google-picker-card" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Google OAuth */}
            <div className="google-picker-header">
              <svg className="google-logo-svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <h2 id="google-picker-title" className="google-picker-title">
                Pilih Akun Google
              </h2>
              <p className="google-picker-subtitle">
                untuk melanjutkan ke <strong>TitraLab PhET Kimia Asam Basa</strong>
              </p>
            </div>

            {/* Daftar Pilihan Akun Google */}
            <div className="google-accounts-list" role="list">
              {googleAccountsList.map((acc) => {
                const isConnecting = connectingGoogleId === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    role="listitem"
                    className="google-account-item"
                    disabled={isConnecting}
                    onClick={() => handleSelectGoogleAccount(acc)}
                  >
                    <div 
                      className="google-avatar-circle"
                      style={{ backgroundColor: acc.bgColor || '#1a73e8' }}
                      aria-hidden="true"
                    >
                      {acc.initial}
                    </div>
                    <div className="google-account-info">
                      <div className="google-account-name-row">
                        <strong className="google-name">{acc.name}</strong>
                        {acc.type && (
                          <span className={`google-badge ${acc.email.includes('belajar.id') ? 'badge-belajar' : ''}`}>
                            {acc.type}
                          </span>
                        )}
                      </div>
                      <span className="google-email">{acc.email}</span>
                    </div>

                    <div className="google-item-action" aria-hidden="true">
                      {isConnecting ? (
                        <span className="google-spinner"></span>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Opsi Gunakan Akun Lain */}
              {!showAddGoogle ? (
                <button
                  type="button"
                  className="google-account-item google-item-add"
                  onClick={() => setShowAddGoogle(true)}
                >
                  <div className="google-avatar-circle circle-add" aria-hidden="true">
                    +
                  </div>
                  <div className="google-account-info">
                    <span className="google-add-text">Gunakan akun Google lain...</span>
                    <small className="google-add-desc">Hubungkan akun Gmail atau akun sekolah baru</small>
                  </div>
                </button>
              ) : (
                <form onSubmit={handleAddCustomGoogleAccount} className="google-add-form">
                  <span className="google-add-form-title">Hubungkan Akun Google Baru</span>
                  <div className="google-add-fields">
                    <input
                      type="text"
                      className="auth-input input-google-custom"
                      placeholder="Nama Lengkap Siswa"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      required
                      autoFocus
                    />
                    <input
                      type="email"
                      className="auth-input input-google-custom"
                      placeholder="Email Google (contoh: nama@gmail.com)"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="google-add-actions">
                    <button type="submit" className="btn-google-confirm">
                      Masuk dengan Akun Ini
                    </button>
                    <button 
                      type="button" 
                      className="btn-google-cancel-form"
                      onClick={() => setShowAddGoogle(false)}
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer Keterangan Privasi Google */}
            <div className="google-picker-footer">
              <p className="google-privacy-notice">
                Untuk melanjutkan, Google akan membagikan nama, alamat email, dan foto profil Anda kepada <strong>TitraLab PhET</strong>. Data Anda hanya disimpan di peramban ini untuk progres belajar.
              </p>
              <div className="google-footer-actions">
                <button
                  type="button"
                  className="btn-google-close"
                  onClick={() => setShowGoogleModal(false)}
                >
                  Tutup / Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL DIALOG: PANDUAN INTEGRASI KREDENSIAL FIREBASE
          ============================================================ */}
      {showConfigModal && (
        <div 
          className="google-modal-overlay" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="firebase-modal-title"
          onClick={() => setShowConfigModal(false)}
        >
          <div 
            className="google-picker-card firebase-config-card" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="google-picker-header">
              <span className="firebase-config-icon" aria-hidden="true">🔥</span>
              <h2 id="firebase-modal-title" className="google-picker-title">
                Integrasi Firebase Authentication
              </h2>
              <p className="google-picker-subtitle">
                Ikuti langkah berikut untuk mengaktifkan autentikasi cloud resmi di TitraLab:
              </p>
            </div>

            <div className="firebase-steps-list">
              <div className="firebase-step-item">
                <div className="step-num">1</div>
                <div className="step-content">
                  <strong>Buka Firebase Console</strong>
                  <p>Kunjungi <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="firebase-doc-link">console.firebase.google.com</a> dan buat atau pilih proyek Anda.</p>
                </div>
              </div>

              <div className="firebase-step-item">
                <div className="step-num">2</div>
                <div className="step-content">
                  <strong>Aktifkan Provider Autentikasi</strong>
                  <p>Masuk ke menu <strong>Build &gt; Authentication &gt; Sign-in method</strong>, lalu aktifkan:</p>
                  <ul className="step-sublist">
                    <li>✔️ <strong>Email/Password</strong></li>
                    <li>✔️ <strong>Google</strong> (pilih email dukungan proyek)</li>
                  </ul>
                </div>
              </div>

              <div className="firebase-step-item">
                <div className="step-num">3</div>
                <div className="step-content">
                  <strong>Salin Konfigurasi ke Berkas <code>.env</code></strong>
                  <p>Buka <strong>Project Settings (⚙️) &gt; Your apps &gt; Web App</strong>, lalu salin nilainya ke berkas <code>.env</code> di direktori root proyek ini:</p>
                  <pre className="firebase-code-snippet">
{`VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=proyek-anda.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=proyek-anda
VITE_FIREBASE_STORAGE_BUCKET=proyek-anda.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:...`}
                  </pre>
                </div>
              </div>

              <div className="firebase-step-item">
                <div className="step-num">4</div>
                <div className="step-content">
                  <strong>Mulai Ulang Dev Server</strong>
                  <p>Setelah berkas <code>.env</code> disimpan, jalankan ulang server (<code>npm run dev</code>). Status akan otomatis berubah menjadi <strong>Firebase Auth Aktif (Cloud)</strong>.</p>
                </div>
              </div>
            </div>

            <div className="google-picker-footer">
              <div className="google-footer-actions">
                <button
                  type="button"
                  className="btn-google-close"
                  onClick={() => setShowConfigModal(false)}
                >
                  Saya Mengerti, Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
