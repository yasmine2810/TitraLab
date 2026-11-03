/**
 * Modul Utilitas Penyimpanan Progres Anonim Siswa (storage.js)
 * Memenuhi kriteria privasi dan keamanan:
 * - Hanya menggunakan localStorage (tanpa backend/database luar)
 * - Hanya menyimpan data non-pribadi: ID acak, peran aktif, modul selesai, skor kuis
 * - Dilarang menyimpan nama, email, nomor telepon, atau data pribadi
 * - Semua operasi dibungkus try/catch agar aplikasi tetap berjalan normal jika storage gagal
 * - Menyediakan fungsi hapusSemuaProgres()
 */

const STORAGE_KEYS = {
  USER_ROLE: 'titralab_user_role', // 'siswa' | 'guru'
  ANON_STUDENT_ID: 'titralab_anon_student_id', // cth: 'SISWA-4891'
  COMPLETED_MODULES: 'titralab_completed_modules', // array of module ids
  QUIZ_PROGRESS: 'titralab_quiz_progress', // { skor, benar, total, tanggal }
  LAST_POSITION: 'titralab_last_position' // string section ID
};

/**
 * Dapatkan atau buat ID Siswa acak baru
 */
export function getOrCreateAnonStudentId() {
  try {
    let id = localStorage.getItem(STORAGE_KEYS.ANON_STUDENT_ID);
    if (!id) {
      const acak = Math.floor(1000 + Math.random() * 9000);
      id = `SISWA-${acak}`;
      localStorage.setItem(STORAGE_KEYS.ANON_STUDENT_ID, id);
    }
    return id;
  } catch (e) {
    return 'SISWA-TAMU';
  }
}

/**
 * Dapatkan peran pengguna saat ini ('siswa' | 'guru' | null)
 */
export function getUserRole() {
  try {
    const role = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    return role === 'guru' || role === 'siswa' ? role : 'siswa';
  } catch (e) {
    return 'siswa';
  }
}

/**
 * Simpan peran pengguna ('siswa' | 'guru')
 */
export function setUserRole(role) {
  try {
    if (role === 'guru' || role === 'siswa') {
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * Dapatkan riwayat skor kuis anonim
 */
export function getQuizProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_PROGRESS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // Abaikan galat storage
  }
  return null;
}

/**
 * Simpan riwayat skor kuis
 */
export function saveQuizProgress(skor, benar, total) {
  try {
    const data = {
      skor,
      benar,
      total,
      waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    localStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Dapatkan modul-modul yang telah diselesaikan
 */
export function getCompletedModules() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_MODULES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // Abaikan galat storage
  }
  return [];
}

/**
 * Tandai modul sebagai selesai
 */
export function markModuleCompleted(moduleId) {
  try {
    const current = getCompletedModules();
    if (!current.includes(moduleId)) {
      const updated = [...current, moduleId];
      localStorage.setItem(STORAGE_KEYS.COMPLETED_MODULES, JSON.stringify(updated));
      return updated;
    }
    return current;
  } catch (e) {
    return [];
  }
}

/**
 * Simpan posisi section terakhir yang dilihat pengguna
 */
export function saveLastPosition(sectionId) {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_POSITION, sectionId);
  } catch (e) {
    // Abaikan galat storage
  }
}

/**
 * Hapus seluruh progres belajar pengguna (Membersihkan localStorage)
 */
export function hapusSemuaProgres() {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    localStorage.removeItem(STORAGE_KEYS.ANON_STUDENT_ID);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_MODULES);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.LAST_POSITION);
    return true;
  } catch (e) {
    return false;
  }
}

