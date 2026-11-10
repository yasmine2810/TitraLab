import { 
  auth, 
  googleProvider, 
  isFirebaseConfigured, 
  getFriendlyFirebaseErrorMessage,
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from '../firebase';

/**
 * Modul Autentikasi dan Pengelolaan Pengguna (auth.js)
 * Mengintegrasikan:
 * 1. Firebase Authentication Sungguhan (Email & Password, Google OAuth, Reset Password, Session Persistence)
 * 2. Mode Transisi / Cadangan Lokal (Graceful Offline / Demo Mode jika kunci Firebase belum diisi di .env)
 */

export { isFirebaseConfigured };

const AUTH_STORAGE_KEYS = {
  USERS: 'titralab_registered_users',
  SESSION: 'titralab_auth_session',
  REMEMBERED_EMAIL: 'titralab_remembered_email',
  GOOGLE_ACCOUNTS: 'titralab_google_accounts'
};

// Akun demonstrasi awal bawaan untuk kemudahan pengujian luring
const DEFAULT_DEMO_USER = {
  name: 'Siswa Kimia XI',
  email: 'siswa@titralab.id',
  password: 'kimia123',
  createdAt: '2026-11-10T10:00:00.000Z'
};

// Daftar pilihan akun Google bawaan untuk mode simulasi
const DEFAULT_GOOGLE_ACCOUNTS = [
  {
    id: 'g1',
    name: 'Ahmad Fadillah',
    email: 'ahmad.siswa@sma.belajar.id',
    type: 'Akun Belajar.id (Kemdikbudristek)',
    initial: 'A',
    bgColor: '#1a73e8'
  },
  {
    id: 'g2',
    name: 'Nabila Putri Zahra',
    email: 'nabilaputri.chem@gmail.com',
    type: 'Google Akun Pribadi',
    initial: 'N',
    bgColor: '#ea4335'
  },
  {
    id: 'g3',
    name: 'Arya Wiguna',
    email: 'aryawiguna.siswa@gmail.com',
    type: 'Google Akun Siswa',
    initial: 'A',
    bgColor: '#34a853'
  }
];

/**
 * Format objek user dari Firebase User menjadi format aplikasi TitraLab
 */
export function formatFirebaseUser(fbUser) {
  if (!fbUser) return null;
  const name = fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Siswa TitraLab');
  return {
    uid: fbUser.uid,
    name: name,
    email: fbUser.email || '',
    photoURL: fbUser.photoURL || null,
    provider: fbUser.providerData?.[0]?.providerId || 'firebase',
    initial: name.charAt(0).toUpperCase(),
    isFirebase: true
  };
}

/**
 * Mendapatkan daftar seluruh akun pengguna terdaftar lokal (mode offline)
 */
export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.USERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const hasDemo = parsed.some(u => u.email.toLowerCase() === DEFAULT_DEMO_USER.email.toLowerCase());
        if (!hasDemo) {
          parsed.unshift(DEFAULT_DEMO_USER);
        }
        return parsed;
      }
    }
  } catch (e) {
    // Abaikan galat storage
  }
  return [DEFAULT_DEMO_USER];
}

function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.USERS, JSON.stringify(users));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 1. Fitur Register (Pendaftaran Akun Baru)
 * Terintegrasi penuh dengan Firebase Authentication jika aktif, atau fallback lokal.
 */
export async function registerUser(name, email, password) {
  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!cleanName) {
    return { success: false, message: 'Nama lengkap / panggilan tidak boleh kosong.' };
  }
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Masukkan format alamat email yang valid (contoh: siswa@sekolah.sch.id).' };
  }
  if (!cleanPassword || cleanPassword.length < 6) {
    return { success: false, message: 'Kata sandi minimal terdiri dari 6 karakter.' };
  }

  // JIKA FIREBASE TERSEDIA: Eksekusi pendaftaran sungguhan di cloud Firebase
  if (isFirebaseConfigured && auth) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      // Simpan Display Name ke profil pengguna di Firebase
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: cleanName
        });
      }

      const formatted = formatFirebaseUser(userCredential.user);
      return {
        success: true,
        message: `Akun Firebase berhasil didaftarkan! Selamat datang, ${cleanName}.`,
        user: formatted
      };
    } catch (err) {
      console.error('Firebase Register Error:', err);
      return {
        success: false,
        message: getFriendlyFirebaseErrorMessage(err.code)
      };
    }
  }

  // FALLBACK LOKAL: Jika kunci Firebase belum dimasukkan ke .env
  try {
    const users = getRegisteredUsers();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'Alamat email ini sudah terdaftar. Silakan gunakan fitur Masuk.' };
    }

    const newUser = {
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveRegisteredUsers(users);

    return { 
      success: true, 
      message: 'Akun lokal berhasil dibuat! Silakan masuk dengan email dan kata sandi Anda.',
      user: newUser 
    };
  } catch (e) {
    return { success: false, message: 'Terjadi kesalahan sistem saat mendaftar. Silakan coba lagi.' };
  }
}

/**
 * 2. Fitur Login (Masuk)
 * Terintegrasi penuh dengan Firebase Authentication jika aktif, atau fallback lokal.
 */
export async function loginUser(email, password, rememberMe = false) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!cleanEmail) {
    return { success: false, message: 'Masukkan alamat email Anda.' };
  }
  if (!cleanPassword) {
    return { success: false, message: 'Masukkan kata sandi Anda.' };
  }

  // JIKA FIREBASE TERSEDIA: Eksekusi masuk sungguhan ke cloud Firebase
  if (isFirebaseConfigured && auth) {
    try {
      // Terapkan persistensi sesi (Remember Me) di level Firebase
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);

      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      const formatted = formatFirebaseUser(userCredential.user);

      // Simpan email remembered jika opsi dicentang
      if (rememberMe) {
        try {
          localStorage.setItem(AUTH_STORAGE_KEYS.REMEMBERED_EMAIL, cleanEmail);
        } catch (e) { /* ignore */ }
      } else {
        try {
          localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBERED_EMAIL);
        } catch (e) { /* ignore */ }
      }

      return {
        success: true,
        message: `Selamat datang kembali, ${formatted.name}!`,
        user: formatted
      };
    } catch (err) {
      console.error('Firebase Login Error:', err);
      return {
        success: false,
        message: getFriendlyFirebaseErrorMessage(err.code)
      };
    }
  }

  // FALLBACK LOKAL: Jika kunci Firebase belum dimasukkan ke .env
  try {
    const users = getRegisteredUsers();
    const user = users.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
    );

    if (!user) {
      return { success: false, message: 'Email atau kata sandi tidak cocok. Silakan periksa kembali.' };
    }

    const sessionPayload = {
      user: {
        name: user.name,
        email: user.email,
        provider: 'local',
        initial: user.name.charAt(0).toUpperCase()
      },
      loginTime: new Date().toISOString(),
      rememberMe: Boolean(rememberMe)
    };

    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEYS.SESSION, JSON.stringify(sessionPayload));
      localStorage.setItem(AUTH_STORAGE_KEYS.REMEMBERED_EMAIL, cleanEmail);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEYS.SESSION, JSON.stringify(sessionPayload));
      localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBERED_EMAIL);
      localStorage.removeItem(AUTH_STORAGE_KEYS.SESSION);
    }

    return {
      success: true,
      message: `Selamat datang kembali, ${user.name}!`,
      user: sessionPayload.user
    };
  } catch (e) {
    return { success: false, message: 'Gagal melakukan verifikasi login.' };
  }
}

/**
 * 3. Fitur Lupa Kata Sandi (Atur Ulang Sandi)
 * Mengirim email pemulihan sungguhan melalui Firebase jika aktif, atau reset lokal.
 */
export async function resetPassword(email, newPassword = '') {
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanEmail) {
    return { success: false, message: 'Masukkan alamat email yang terdaftar.' };
  }

  // JIKA FIREBASE TERSEDIA: Kirim email reset kata sandi resmi dari Firebase
  if (isFirebaseConfigured && auth) {
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return {
        success: true,
        message: `Tautan pemulihan kata sandi telah dikirimkan ke alamat ${cleanEmail}. Harap periksa kotak masuk atau folder spam Anda.`
      };
    } catch (err) {
      console.error('Firebase Reset Password Error:', err);
      return {
        success: false,
        message: getFriendlyFirebaseErrorMessage(err.code)
      };
    }
  }

  // FALLBACK LOKAL: Jika kunci Firebase belum disetel
  try {
    const cleanPassword = (newPassword || '').trim();
    if (!cleanPassword || cleanPassword.length < 4) {
      return { success: false, message: 'Kata sandi baru minimal 4 karakter.' };
    }

    const users = getRegisteredUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);

    if (userIndex === -1) {
      return { success: false, message: 'Alamat email tidak ditemukan dalam sistem pendaftaran.' };
    }

    users[userIndex].password = cleanPassword;
    saveRegisteredUsers(users);

    return {
      success: true,
      message: 'Kata sandi baru berhasil disimpan! Silakan masuk dengan kata sandi baru Anda.'
    };
  } catch (e) {
    return { success: false, message: 'Gagal mengatur ulang kata sandi.' };
  }
}

/**
 * 4. Masuk Sungguhan dengan Google OAuth via Firebase Popup
 * Membuka jendela dialog resmi Google dengan pilihan akun Google pengguna sungguhan.
 */
export async function loginWithFirebaseGoogle(rememberMe = true) {
  if (!isFirebaseConfigured || !auth) {
    return {
      success: false,
      message: 'Konfigurasi Firebase belum aktif di .env. Anda dapat menggunakan pilihan akun simulasi di bawah.'
    };
  }

  try {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);

    // Buka popup resmi Google OAuth
    const result = await signInWithPopup(auth, googleProvider);
    const formatted = formatFirebaseUser(result.user);

    if (rememberMe && formatted.email) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEYS.REMEMBERED_EMAIL, formatted.email);
      } catch (e) { /* ignore */ }
    }

    return {
      success: true,
      message: `Berhasil masuk dengan Akun Google sebagai ${formatted.name}!`,
      user: formatted
    };
  } catch (err) {
    console.error('Firebase Google Auth Error:', err);
    return {
      success: false,
      message: getFriendlyFirebaseErrorMessage(err.code)
    };
  }
}

/**
 * 5. Pilihan Akun Google Simulasi (Fallback / Offline)
 */
export function getGoogleAccounts() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.GOOGLE_ACCOUNTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // Abaikan galat storage
  }
  return DEFAULT_GOOGLE_ACCOUNTS;
}

export function addGoogleAccount(name, email) {
  try {
    const current = getGoogleAccounts();
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanName || !cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Nama dan email Google valid wajib diisi.' };
    }

    const exists = current.find(a => a.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: true, account: exists };
    }

    const newAccount = {
      id: `g_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      type: cleanEmail.endsWith('belajar.id') ? 'Akun Belajar.id' : 'Google Akun',
      initial: cleanName.charAt(0).toUpperCase(),
      bgColor: '#1a73e8'
    };

    const updated = [...current, newAccount];
    localStorage.setItem(AUTH_STORAGE_KEYS.GOOGLE_ACCOUNTS, JSON.stringify(updated));
    return { success: true, account: newAccount };
  } catch (e) {
    return { success: false, message: 'Gagal menambahkan akun Google.' };
  }
}

export function loginWithGoogle(googleAccount, rememberMe = true) {
  try {
    if (!googleAccount || !googleAccount.email) {
      return { success: false, message: 'Akun Google tidak valid.' };
    }

    const userPayload = {
      name: googleAccount.name,
      email: googleAccount.email,
      provider: 'google',
      accountType: googleAccount.type || 'Akun Google',
      avatar: googleAccount.initial || 'G',
      initial: googleAccount.initial || 'G',
      color: googleAccount.bgColor || '#1a73e8'
    };

    const sessionPayload = {
      user: userPayload,
      loginTime: new Date().toISOString(),
      rememberMe: Boolean(rememberMe)
    };

    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEYS.SESSION, JSON.stringify(sessionPayload));
      localStorage.setItem(AUTH_STORAGE_KEYS.REMEMBERED_EMAIL, googleAccount.email);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEYS.SESSION, JSON.stringify(sessionPayload));
      localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBERED_EMAIL);
      localStorage.removeItem(AUTH_STORAGE_KEYS.SESSION);
    }

    return {
      success: true,
      message: `Berhasil terhubung dengan Google sebagai ${googleAccount.name}!`,
      user: userPayload
    };
  } catch (e) {
    return { success: false, message: 'Gagal terhubung dengan akun Google.' };
  }
}

/**
 * Mendapatkan email yang dicentang 'Remember Me'
 */
export function getRememberedEmail() {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEYS.REMEMBERED_EMAIL) || '';
  } catch (e) {
    return '';
  }
}

/**
 * Memeriksa apakah ada sesi login aktif (lokal)
 */
export function getCurrentSession() {
  try {
    const local = localStorage.getItem(AUTH_STORAGE_KEYS.SESSION);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && parsed.user) return parsed.user;
    }

    const sess = sessionStorage.getItem(AUTH_STORAGE_KEYS.SESSION);
    if (sess) {
      const parsed = JSON.parse(sess);
      if (parsed && parsed.user) return parsed.user;
    }
  } catch (e) {
    // Abaikan galat storage
  }
  return null;
}

/**
 * Berlangganan status perubahan autentikasi Firebase secara real-time
 */
export function subscribeToAuthChanges(onUserChanged) {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const user = formatFirebaseUser(fbUser);
        onUserChanged(user);
      } else {
        // Jika tidak ada user Firebase, cek apakah ada sesi lokal
        const local = getCurrentSession();
        onUserChanged(local);
      }
    });
  }

  // Jika Firebase belum aktif, gunakan sesi lokal saat ini
  const local = getCurrentSession();
  onUserChanged(local);
  return () => {};
}

/**
 * Masuk Cepat sebagai Tamu (Guest)
 */
export function loginAsGuest() {
  try {
    const acak = Math.floor(1000 + Math.random() * 9000);
    const guestUser = {
      name: `Siswa Tamu #${acak}`,
      email: `tamu${acak}@titralab.id`,
      initial: 'T',
      isGuest: true
    };
    sessionStorage.setItem(AUTH_STORAGE_KEYS.SESSION, JSON.stringify({
      user: guestUser,
      loginTime: new Date().toISOString(),
      rememberMe: false
    }));
    return guestUser;
  } catch (e) {
    return { name: 'Siswa Tamu', email: 'tamu@titralab.id', initial: 'T', isGuest: true };
  }
}

/**
 * Perbarui Nama Tampilan Pengguna
 */
export async function updateUserProfileName(newName) {
  const cleanName = (newName || '').trim();
  if (!cleanName) {
    return { success: false, message: 'Nama lengkap tidak boleh kosong.' };
  }

  if (isFirebaseConfigured && auth && auth.currentUser) {
    try {
      await updateProfile(auth.currentUser, { displayName: cleanName });
    } catch (e) {
      console.warn('Gagal memperbarui profil Firebase:', e);
    }
  }

  try {
    const session = getCurrentSession() || {};
    const updatedUser = {
      ...session,
      name: cleanName,
      initial: cleanName.charAt(0).toUpperCase()
    };

    const payload = {
      user: updatedUser,
      loginTime: new Date().toISOString()
    };

    if (localStorage.getItem(AUTH_STORAGE_KEYS.SESSION)) {
      localStorage.setItem(AUTH_STORAGE_KEYS.SESSION, JSON.stringify(payload));
    }
    if (sessionStorage.getItem(AUTH_STORAGE_KEYS.SESSION)) {
      sessionStorage.setItem(AUTH_STORAGE_KEYS.SESSION, JSON.stringify(payload));
    }

    // Perbarui juga di daftar pengguna terdaftar lokal jika cocok
    const users = getRegisteredUsers();
    const idx = users.findIndex(u => u.email && updatedUser.email && u.email.toLowerCase() === updatedUser.email.toLowerCase());
    if (idx !== -1) {
      users[idx].name = cleanName;
      saveRegisteredUsers(users);
    }

    return {
      success: true,
      message: 'Nama profil berhasil diperbarui.',
      user: updatedUser
    };
  } catch (e) {
    return { success: false, message: 'Gagal menyimpan perubahan ke peramban.' };
  }
}

/**
 * Keluar (Logout)
 */
export async function logoutUser() {
  try {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
  } catch (err) {
    console.error('Firebase SignOut Error:', err);
  }

  try {
    localStorage.removeItem(AUTH_STORAGE_KEYS.SESSION);
    sessionStorage.removeItem(AUTH_STORAGE_KEYS.SESSION);
    return true;
  } catch (e) {
    return false;
  }
}
