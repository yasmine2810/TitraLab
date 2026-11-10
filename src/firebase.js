import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
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
} from 'firebase/auth';

/**
 * Konfigurasi Firebase Web Client untuk TitraLab PhET
 * Nilai diambil secara otomatis dari berkas `.env` (Vite Environment Variables).
 * Menggunakan awalan VITE_ agar dapat diakses di sisi peramban.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

/**
 * Memeriksa apakah konfigurasi Firebase sudah disetel dengan benar oleh pengguna di .env
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey.trim() !== '' &&
  !firebaseConfig.apiKey.includes('YOUR_FIREBASE') &&
  firebaseConfig.authDomain &&
  firebaseConfig.authDomain.trim() !== ''
);

// Inisialisasi Firebase App hanya jika konfigurasi valid dan belum diinisialisasi
let app = null;
let auth = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (error) {
    console.warn('Inisialisasi Firebase gagal:', error);
  }
}

// Provider Google OAuth resmi
const googleProvider = new GoogleAuthProvider();
// Memaksa pengguna memilih akun Google setiap kali klik login Google
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Pemetaan pesan galat Firebase ke Bahasa Indonesia yang ramah siswa SMA
 */
export function getFriendlyFirebaseErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Format alamat email tidak valid. Harap periksa kembali.';
    case 'auth/user-not-found':
      return 'Akun dengan email ini belum terdaftar. Silakan buat akun baru terlebih dahulu.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email atau kata sandi salah. Harap periksa kembali atau gunakan fitur lupa kata sandi.';
    case 'auth/email-already-in-use':
      return 'Alamat email ini sudah terdaftar. Silakan gunakan menu Sign In.';
    case 'auth/weak-password':
      return 'Kata sandi terlalu pendek. Masukkan minimal 6 karakter demi keamanan akun Anda.';
    case 'auth/popup-closed-by-user':
      return 'Jendela pilihan akun Google ditutup sebelum proses selesai. Silakan coba lagi.';
    case 'auth/popup-blocked':
      return 'Jendela pop-up Google diblokir oleh peramban. Harap izinkan pop-up untuk situs ini.';
    case 'auth/operation-not-allowed':
      return 'Metode login ini belum diaktifkan di Firebase Console. Pastikan Email/Password dan Google Sign-in sudah diaktifkan di menu Authentication > Sign-in method.';
    case 'auth/network-request-failed':
      return 'Koneksi internet bermasalah. Harap periksa jaringan internet Anda.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan masuk yang gagal. Akses dibatasi sementara demi keamanan. Coba lagi dalam beberapa menit.';
    default:
      return 'Terjadi kendala pada server autentikasi. Silakan periksa koneksi atau coba beberapa saat lagi.';
  }
}

export { 
  app, 
  auth, 
  googleProvider,
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
};

