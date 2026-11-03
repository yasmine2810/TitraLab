import React, { useState, useEffect } from 'react';
import { daftarSoalKuis } from '../data/kuis';
import { saveQuizProgress, getQuizProgress } from '../utils/storage';

/**
 * Komponen KuisSection
 * Kuis Pemahaman Asam Basa Kimia SMA Kelas XI
 * Alur Baru:
 * 1. Siswa mengisi seluruh jawaban terlebih dahulu (opsi dapat diubah bebas sebelum dikumpulkan).
 * 2. Kuis memvalidasi bahwa semua butir soal telah terisi.
 * 3. Kunci jawaban, status benar/salah, dan pembahasan lengkap per soal HANYA muncul
 *    setelah siswa mengumpulkan/memeriksa seluruh jawaban kuis.
 * 4. Skor disimpan secara anonim ke localStorage dan kuis dapat diulang kembali dengan pengacakan baru.
 */
export default function KuisSection() {
  const [soalAcak, setSoalAcak] = useState([]);
  const [jawabanSiswa, setJawabanSiswa] = useState({}); // { [soalId]: pilihanId }
  const [sudahDiserahkan, setSudahDiserahkan] = useState(false);
  const [pesanValidasi, setPesanValidasi] = useState('');
  const [riwayatSkor, setRiwayatSkor] = useState(null);

  // Algoritma Fisher-Yates Shuffle untuk pengacakan soal & opsi
  const acakArray = (arr) => {
    const duplikat = [...arr];
    for (let i = duplikat.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [duplikat[i], duplikat[j]] = [duplikat[j], duplikat[i]];
    }
    return duplikat;
  };

  // Inisialisasi awal atau ulang kuis
  const inisialisasiKuis = () => {
    const teracak = acakArray(daftarSoalKuis).map(soal => ({
      ...soal,
      pilihan: acakArray(soal.pilihan)
    }));
    setSoalAcak(teracak);
    setJawabanSiswa({});
    setSudahDiserahkan(false);
    setPesanValidasi('');
    setRiwayatSkor(getQuizProgress());
  };

  useEffect(() => {
    inisialisasiKuis();
  }, []);

  // Saat siswa memilih atau mengganti pilihan opsi
  const handlePilihOpsi = (soalId, pilihanId) => {
    if (sudahDiserahkan) return; // Kunci pilihan jika kuis sudah diserahkan

    setJawabanSiswa(prev => ({
      ...prev,
      [soalId]: pilihanId
    }));
    setPesanValidasi('');
  };

  // Menyerahkan dan memeriksa jawaban seluruh soal
  const handlePeriksaJawaban = () => {
    // 1. Validasi: pastikan semua soal telah terisi
    const belumTerisi = soalAcak.filter(soal => !jawabanSiswa[soal.id]);
    if (belumTerisi.length > 0) {
      setPesanValidasi(
        `Harap jawab seluruh soal terlebih dahulu! Masih ada ${belumTerisi.length} dari ${soalAcak.length} soal yang belum Anda isi.`
      );
      // Gulir ke soal pertama yang belum dijawab
      const firstUnansweredId = `soal-card-${belumTerisi[0].id}`;
      const el = document.getElementById(firstUnansweredId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 2. Hitung jumlah jawaban benar dan skor
    let hitungBenar = 0;
    soalAcak.forEach(soal => {
      const terpilihId = jawabanSiswa[soal.id];
      const opsi = soal.pilihan.find(p => p.id === terpilihId);
      if (opsi && opsi.benar) {
        hitungBenar++;
      }
    });

    const skor = Math.round((hitungBenar / soalAcak.length) * 100);
    saveQuizProgress(skor, hitungBenar, soalAcak.length);
    setRiwayatSkor({ skor, benar: hitungBenar, total: soalAcak.length });
    setSudahDiserahkan(true);
    setPesanValidasi('');

    // Gulir halus ke hasil kuis
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const totalSoal = soalAcak.length;
  const jumlahTerisi = Object.keys(jawabanSiswa).length;
  const semuaTerisi = totalSoal > 0 && jumlahTerisi === totalSoal;

  // Hitung hasil jika kuis sudah diserahkan
  let jumlahBenar = 0;
  if (sudahDiserahkan) {
    soalAcak.forEach(soal => {
      const terpilihId = jawabanSiswa[soal.id];
      const opsi = soal.pilihan.find(p => p.id === terpilihId);
      if (opsi && opsi.benar) jumlahBenar++;
    });
  }
  const nilaiAkhir = totalSoal > 0 ? Math.round((jumlahBenar / totalSoal) * 100) : 0;

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
            Kuis Pemahaman <span className="text-highlight">Kimia Asam Basa</span>
          </h2>
          <p className="section-subtitle">
            Jawab seluruh pertanyaan di bawah ini terlebih dahulu. Kunci jawaban, skor evaluasi, dan pembahasan konsep setiap butir soal akan tampil lengkap setelah Anda mengumpulkan jawaban.
          </p>
        </div>

        {/* Banner Ringkasan Hasil (Tampil Setelah Siswa Memeriksa Jawaban) */}
        {sudahDiserahkan && (
          <div className="quiz-summary-banner" role="status">
            <div className="summary-icon" aria-hidden="true">
              {nilaiAkhir >= 80 ? '🏆' : '📚'}
            </div>
            <div className="summary-content">
              <span className="summary-badge">Hasil Evaluasi Kuis</span>
              <h3 className="summary-title">
                {nilaiAkhir >= 80 ? 'Hasil Sangat Memuaskan!' : 'Evaluasi Pengerjaan Kuis'}
              </h3>
              <p className="summary-desc">
                Skor Akhir Anda: <strong>{nilaiAkhir} / 100</strong> ({jumlahBenar} dari {totalSoal} soal dijawab dengan benar).
              </p>
              <p className="summary-tip">
                {nilaiAkhir >= 80 
                  ? 'Pemahaman Anda pada konsep teori asam basa dan perhitungan pH sudah sangat baik! Periksa pembahasan setiap butir soal di bawah untuk memperdalam konsep.' 
                  : 'Tetap semangat! Pelajari pembahasan dan kunci jawaban pada setiap butir soal di bawah, kemudian ulangi kuis untuk memperkuat pemahaman.'}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-hero-primary"
              onClick={inisialisasiKuis}
            >
              🔄 Ulangi & Acak Kuis Kembali
            </button>
          </div>
        )}

        {/* Bar Status Progres Pengerjaan */}
        <div className="quiz-status-bar">
          <div className="quiz-progress-info">
            <span className="progress-status-text">
              Status Pengerjaan: <strong>{jumlahTerisi}</strong> dari <strong>{totalSoal}</strong> soal telah terisi
              {semuaTerisi && !sudahDiserahkan && (
                <span className="text-ready-pill"> ✓ Siap Dikumpulkan</span>
              )}
            </span>
            <div className="quiz-progress-track">
              <div 
                className="quiz-progress-fill" 
                style={{ width: `${(jumlahTerisi / (totalSoal || 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="quiz-status-actions">
            {riwayatSkor && !sudahDiserahkan && (
              <span className="badge-saved-score">
                Nilai Sebelumnya: <strong>{riwayatSkor.skor}</strong> ({riwayatSkor.benar}/{riwayatSkor.total} benar)
              </span>
            )}
            <button
              type="button"
              className="btn btn-secondary-sm"
              onClick={inisialisasiKuis}
              title="Reset jawaban dan acak kembali urutan soal"
            >
              🔄 Reset & Acak Soal
            </button>
          </div>
        </div>

        {/* Pesan Peringatan Jika Masih Ada Soal yang Belum Terisi */}
        {pesanValidasi && (
          <div className="calc-alert-error quiz-validation-alert" role="alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div className="alert-content">
              <strong>Perhatian:</strong> {pesanValidasi}
            </div>
          </div>
        )}

        {/* Daftar Kartu Soal Kuis */}
        <div className="quiz-container">
          {soalAcak.map((soal, sIdx) => {
            const terpilihId = jawabanSiswa[soal.id];
            const isAnswered = Boolean(terpilihId);
            const opsiTerpilih = soal.pilihan.find(p => p.id === terpilihId);
            const isCorrect = Boolean(opsiTerpilih?.benar);

            // Kelas kartu dinamis
            let cardClass = 'quiz-card';
            if (sudahDiserahkan) {
              cardClass += isCorrect ? ' card-answered-correct' : ' card-answered-wrong';
            } else if (isAnswered) {
              cardClass += ' card-selected-active';
            }

            return (
              <div 
                key={soal.id} 
                id={`soal-card-${soal.id}`}
                className={cardClass}
              >
                {/* Header Soal */}
                <div className="quiz-question-header">
                  <div className="quiz-q-meta">
                    <span className="question-number">Nomor {sIdx + 1}</span>

                    {/* Status Badge */}
                    {!sudahDiserahkan ? (
                      <span className={`status-pill ${isAnswered ? 'pill-filled' : 'pill-empty'}`}>
                        {isAnswered ? '✓ Terjawab' : 'Belum Dijawab'}
                      </span>
                    ) : (
                      <span className={`status-pill ${isCorrect ? 'pill-correct' : 'pill-wrong'}`}>
                        {isCorrect ? '✓ Jawaban Anda Benar' : '✕ Jawaban Anda Kurang Tepat'}
                      </span>
                    )}
                  </div>
                  <p className="question-text">{soal.pertanyaan}</p>
                </div>

                {/* Pilihan Jawaban */}
                <div className="quiz-options" role="radiogroup" aria-labelledby={`soal-card-${soal.id}`}>
                  {soal.pilihan.map((pil, pIdx) => {
                    const isSelected = terpilihId === pil.id;
                    let optionClass = 'quiz-option';

                    if (!sudahDiserahkan) {
                      // Fase pengerjaan: hanya tandai yang sedang dipilih siswa
                      if (isSelected) optionClass += ' selected';
                    } else {
                      // Fase hasil: tampilkan kunci dan status jawaban
                      if (pil.benar) {
                        optionClass += ' correct'; // Kunci jawaban selalu hijau
                      } else if (isSelected && !pil.benar) {
                        optionClass += ' wrong'; // Pilihan salah siswa berwarna merah
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
                        disabled={sudahDiserahkan}
                        className={optionClass}
                        onClick={() => handlePilihOpsi(soal.id, pil.id)}
                      >
                        <span className="option-alpha">
                          {String.fromCharCode(65 + pIdx)}
                        </span>
                        <span className="option-label">{pil.teks}</span>

                        {/* Indikator hanya tampil setelah kuis diserahkan */}
                        {sudahDiserahkan && pil.benar && (
                          <span className="option-mark mark-correct" aria-hidden="true">
                            ✓ Kunci Jawaban Benar
                          </span>
                        )}
                        {sudahDiserahkan && isSelected && !pil.benar && (
                          <span className="option-mark mark-wrong" aria-hidden="true">
                            ✕ Pilihan Anda
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Umpan Balik Penjelasan Konsep Setiap Butir Soal (HANYA MUNCUL SETELAH DISERAHKAN) */}
                {sudahDiserahkan && (
                  <div className={`quiz-feedback-box ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
                    <div className="feedback-badge">
                      {isCorrect ? '🎉 Penjelasan Konsep:' : '💡 Pembahasan & Koreksi Konsep:'}
                    </div>
                    <p className="feedback-text">{soal.pembahasan}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bar Aksi Bawah: Tombol Periksa Jawaban atau Ulangi Kuis */}
        <div className="quiz-submit-action-area">
          {!sudahDiserahkan ? (
            <div className="submit-box-card">
              <div className="submit-box-info">
                <span className="submit-info-title">
                  {semuaTerisi 
                    ? '🎉 Seluruh soal telah berhasil Anda jawab!' 
                    : `⚠️ Masih ada ${totalSoal - jumlahTerisi} soal yang belum Anda isi.`}
                </span>
                <p className="submit-info-desc">
                  {semuaTerisi
                    ? 'Klik tombol di bawah ini untuk memeriksa jawaban, melihat perolehan skor, dan membuka pembahasan setiap butir soal.'
                    : 'Pastikan seluruh soal telah Anda jawab dengan lengkap sebelum memeriksa jawaban.'}
                </p>
              </div>

              <button
                type="button"
                className={`btn btn-hero-primary btn-submit-quiz ${!semuaTerisi ? 'btn-disabled-hint' : ''}`}
                onClick={handlePeriksaJawaban}
              >
                <span>Periksa Jawaban Kuis ({jumlahTerisi}/{totalSoal})</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
            </div>
          ) : (
            <div className="submit-box-card submit-box-done">
              <div className="submit-box-info">
                <span className="submit-info-title">Pembahasan Kuis Telah Ditampilkan</span>
                <p className="submit-info-desc">
                  Anda dapat meninjau kembali pembahasan di atas atau mengacak kembali butir soal untuk latihan ulang.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-hero-primary"
                onClick={inisialisasiKuis}
              >
                🔄 Ulangi & Acak Kuis Kembali
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
