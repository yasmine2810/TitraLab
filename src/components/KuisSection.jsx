import React, { useState, useEffect } from 'react';
import { daftarSoalKuis } from '../data/kuis';
import { saveQuizProgress, getQuizProgress } from '../utils/storage';

/**
 * Komponen KuisSection
 * Kuis Pemahaman Asam Basa Interaktif Kimia SMA Kelas XI
 * - Soal dan pilihan diacak saat kuis dimulai
 * - Umpan balik langsung (benar/salah + penjelasan) seketika setelah menjawab
 * - Kunci jawaban tidak ditampilkan sebelum siswa menjawab
 * - Penyimpanan skor anonim ke localStorage dengan try/catch
 * - Siswa dapat mengulang kuis dengan urutan teracak kembali
 */
export default function KuisSection() {
  const [soalAcak, setSoalAcak] = useState([]);
  const [jawabanUser, setJawabanUser] = useState({}); // { [soalId]: { pilihanId, benar } }
  const [riwayatSkor, setRiwayatSkor] = useState(null);

  // Fungsi pengacak array (Fisher-Yates Shuffle)
  const acakArray = (arr) => {
    const duplikat = [...arr];
    for (let i = duplikat.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [duplikat[i], duplikat[j]] = [duplikat[j], duplikat[i]];
    }
    return duplikat;
  };

  // Inisialisasi kuis dengan soal dan opsi teracak
  const inisialisasiKuis = () => {
    const teracak = acakArray(daftarSoalKuis).map(soal => ({
      ...soal,
      pilihan: acakArray(soal.pilihan)
    }));
    setSoalAcak(teracak);
    setJawabanUser({});
    setRiwayatSkor(getQuizProgress());
  };

  useEffect(() => {
    inisialisasiKuis();
  }, []);

  // Saat siswa memilih salah satu pilihan jawaban
  const handlePilihOpsi = (soal, opsi) => {
    // Jika soal sudah pernah dijawab, kunci agar tidak bisa gonta-ganti jawaban sembarangan
    if (jawabanUser[soal.id]) return;

    const dataJawaban = {
      pilihanId: opsi.id,
      benar: Boolean(opsi.benar)
    };

    const updated = {
      ...jawabanUser,
      [soal.id]: dataJawaban
    };
    setJawabanUser(updated);

    // Hitung skor saat ini dan simpan ke localStorage
    const totalTerjawab = Object.keys(updated).length;
    let jumlahBenar = 0;
    Object.values(updated).forEach(j => {
      if (j.benar) jumlahBenar++;
    });

    const skorSekarang = Math.round((jumlahBenar / soalAcak.length) * 100);
    saveQuizProgress(skorSekarang, jumlahBenar, soalAcak.length);
    setRiwayatSkor({ skor: skorSekarang, benar: jumlahBenar, total: soalAcak.length });
  };

  const totalSoal = soalAcak.length;
  const jumlahTerjawab = Object.keys(jawabanUser).length;
  const jumlahBenar = Object.values(jawabanUser).filter(j => j.benar).length;
  const nilaiAkhir = totalSoal > 0 ? Math.round((jumlahBenar / totalSoal) * 100) : 0;
  const semuaSelesai = totalSoal > 0 && jumlahTerjawab === totalSoal;

  return (
    <section className="lab-feature-section" id="kuis" aria-labelledby="quiz-heading">
      <div className="container">
        {/* Header Kuis */}
        <div className="section-header">
          <div className="section-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Uji Pemahaman Mandiri</span>
          </div>
          <h2 id="quiz-heading" className="section-title">
            Kuis Interaktif <span className="text-highlight">Kimia Asam Basa</span>
          </h2>
          <p className="section-subtitle">
            Uji pemahaman Anda mengenai teori asam basa, indikator, perhitungan pH, dan stoikiometri titrasi. Setiap jawaban langsung disertai pembahasan!
          </p>
        </div>

        {/* Bar Progres & Skor Kuis */}
        <div className="quiz-status-bar">
          <div className="quiz-progress-info">
            <span>Progres: <strong>{jumlahTerjawab}</strong> dari <strong>{totalSoal}</strong> soal terjawab</span>
            <div className="quiz-progress-track">
              <div 
                className="quiz-progress-fill" 
                style={{ width: `${(jumlahTerjawab / (totalSoal || 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="quiz-status-actions">
            {riwayatSkor && (
              <span className="badge-saved-score">
                Nilai Terakhir: <strong>{riwayatSkor.skor}</strong> ({riwayatSkor.benar}/{riwayatSkor.total} benar)
              </span>
            )}
            <button
              type="button"
              className="btn btn-secondary-sm"
              onClick={inisialisasiKuis}
              title="Acak kembali soal dan ulangi kuis"
            >
              🔄 Acak & Ulangi Kuis
            </button>
          </div>
        </div>

        {/* Daftar Soal */}
        <div className="quiz-container">
          {soalAcak.map((soal, sIdx) => {
            const statusJawaban = jawabanUser[soal.id];
            const sudahDijawab = Boolean(statusJawaban);

            return (
              <div 
                key={soal.id} 
                className={`quiz-card ${sudahDijawab ? (statusJawaban.benar ? 'card-answered-correct' : 'card-answered-wrong') : ''}`}
              >
                <div className="quiz-question-header">
                  <div className="quiz-q-meta">
                    <span className="question-number">Nomor {sIdx + 1}</span>
                    {sudahDijawab && (
                      <span className={`status-pill ${statusJawaban.benar ? 'pill-correct' : 'pill-wrong'}`}>
                        {statusJawaban.benar ? '✓ Jawaban Anda Benar' : '✕ Jawaban Anda Kurang Tepat'}
                      </span>
                    )}
                  </div>
                  <p className="question-text">{soal.pertanyaan}</p>
                </div>

                {/* Pilihan Jawaban */}
                <div className="quiz-options" role="radiogroup" aria-labelledby={`soal-text-${soal.id}`}>
                  {soal.pilihan.map((pil, pIdx) => {
                    const isSelected = statusJawaban?.pilihanId === pil.id;
                    let optionClass = 'quiz-option';

                    if (sudahDijawab) {
                      if (pil.benar) {
                        optionClass += ' correct';
                      } else if (isSelected && !pil.benar) {
                        optionClass += ' wrong';
                      } else {
                        optionClass += ' dimmed';
                      }
                    }

                    return (
                      <button
                        key={pil.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        disabled={sudahDijawab}
                        className={optionClass}
                        onClick={() => handlePilihOpsi(soal, pil)}
                      >
                        <span className="option-alpha">
                          {String.fromCharCode(65 + pIdx)}
                        </span>
                        <span className="option-label">{pil.teks}</span>
                        {sudahDijawab && pil.benar && (
                          <span className="option-mark" aria-hidden="true">✓ Kunci</span>
                        )}
                        {sudahDijawab && isSelected && !pil.benar && (
                          <span className="option-mark" aria-hidden="true">✕ Pilihan Anda</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Umpan Balik Tepat Setelah Siswa Menjawab */}
                {sudahDijawab && (
                  <div className={`quiz-feedback-box ${statusJawaban.benar ? 'feedback-correct' : 'feedback-wrong'}`}>
                    <div className="feedback-badge">
                      {statusJawaban.benar ? '🎉 Penjelasan Konsep:' : '💡 Pembahasan & Koreksi Konsep:'}
                    </div>
                    <p className="feedback-text">{soal.pembahasan}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Ringkasan Akhir Saat Semua Soal Terjawab */}
          {semuaSelesai && (
            <div className="quiz-summary-banner" role="status">
              <div className="summary-icon" aria-hidden="true">🏆</div>
              <div className="summary-content">
                <h3 className="summary-title">Luar Biasa! Anda Telah Menyelesaikan Kuis</h3>
                <p className="summary-desc">
                  Skor Akhir Anda: <strong>{nilaiAkhir} / 100</strong> ({jumlahBenar} dari {totalSoal} soal dijawab dengan benar).
                </p>
                <p className="summary-tip">
                  {nilaiAkhir >= 80 
                    ? 'Pemahaman Anda pada materi Asam Basa sangat solid! Terus pertahankan di modul praktikum PhET berikutnya.' 
                    : 'Bagus! Pelajari kembali pembahasan di atas dan ulangi kuis untuk memantapkan konsep kimia Anda.'}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-hero-primary"
                onClick={inisialisasiKuis}
              >
                Ulangi Kuis Sekarang
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

