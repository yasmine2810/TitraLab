import React, { useState, useEffect } from 'react';
import { 
  getOrCreateAnonStudentId, 
  getCompletedModules, 
  getQuizProgress,
  getQuizSubmission 
} from '../utils/storage';
import { daftarSoalKuis } from '../data/kuis';
import { modulData } from '../data/modul';

/**
 * Halaman PanelGuru (Panel Khusus Guru Kimia SMA Kelas XI)
 * Menyediakan:
 * 1. Pemantauan Progres & Rekap Nilai Siswa (Analisis Ketuntasan Belajar KKTP & Ekspor Rekap)
 * 2. Kunci Jawaban Lengkap & Panduan Miskonsepsi Kuis
 * 3. Perangkat Pembelajaran (Alur Tujuan Pembelajaran & LKPD Praktikum Virtual PhET)
 * 4. Mode Demonstrasi Kelas (Preset Perhitungan pH & Titrasi)
 */
export default function PanelGuru({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('pemantauan'); // 'pemantauan' | 'kunci' | 'perangkat' | 'demo'
  const [anonId, setAnonId] = useState('');
  const [completedMods, setCompletedMods] = useState([]);
  const [quizScore, setQuizScore] = useState(null);
  const [quizSession, setQuizSession] = useState(null);
  const [salinStatus, setSalinStatus] = useState('');

  useEffect(() => {
    setAnonId(getOrCreateAnonStudentId());
    setCompletedMods(getCompletedModules());
    setQuizScore(getQuizProgress());
    setQuizSession(getQuizSubmission());
  }, []);

  // Fungsi Ekspor Data Nilai ke Berkas CSV
  const handleExportCSV = () => {
    const header = "ID Siswa,Modul 1 Selesai,Modul 2 Selesai,Modul 3 Selesai,Skor Kuis,Jawaban Benar,Total Soal,Waktu Pengerjaan,Status Ketuntasan (KKTP >= 75)\n";
    const m1 = completedMods.includes('modul-1') ? 'Ya' : 'Belum';
    const m2 = completedMods.includes('modul-2') ? 'Ya' : 'Belum';
    const m3 = completedMods.includes('modul-3') ? 'Ya' : 'Belum';
    const skor = quizScore ? quizScore.skor : 0;
    const benar = quizScore ? quizScore.benar : 0;
    const total = quizScore ? quizScore.total : daftarSoalKuis.length;
    const waktu = quizScore ? (quizScore.waktu || 'Tersimpan') : '-';
    const tuntas = skor >= 75 ? 'Tuntas' : (quizScore ? 'Perlu Bimbingan' : 'Belum Mengerjakan');

    const row = `"${anonId}","${m1}","${m2}","${m3}",${skor},${benar},${total},"${waktu}","${tuntas}"\n`;
    const blob = new Blob([header + row], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rekap-nilai-titralab-${anonId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fungsi Cetak Lembar Kerja / Laporan
  const handlePrint = () => {
    window.print();
  };

  // Fungsi Salin Teks LKPD
  const handleSalinLKPD = () => {
    const teksLKPD = `LEMBAR KERJA PESERTA DIDIK (LKPD) VIRTUAL PhET
Mata Pelajaran: Kimia
Fase / Kelas: Fase F / SMA Kelas XI
Materi: Larutan Asam Basa & Titrasi PhET

A. Tujuan Percobaan:
1. Mengidentifikasi sifat larutan asam dan basa menggunakan kertas lakmus dan trayek pH PhET.
2. Membandingkan derajat ionisasi (alpha) antara asam kuat vs asam lemah.
3. Menentukan konsentrasi larutan asam melalui titrasi volumetri PhET.

B. Langkah Kerja:
1. Buka modul PhET "pH Scale Basics" pada web TitraLab.
2. Celupkan strip indikator ke dalam sampel air jeruk, sabun, dan asam klorida.
3. Catat nilai pH dan perhatikan warna kertas lakmus.
4. Lakukan perhitungan nilai [H+] dengan rumus [H+] = 10^(-pH).

C. Pertanyaan Analisis:
1. Mengapa asam klorida 0,1 M memiliki pH lebih rendah daripada asam asetat 0,1 M?
2. Bagaimana pengaruh penambahan air terhadap pH larutan asam kuat?`;

    navigator.clipboard.writeText(teksLKPD).then(() => {
      setSalinStatus('Teks LKPD berhasil disalin ke papan klip!');
      setTimeout(() => setSalinStatus(''), 3000);
    }).catch(() => {
      setSalinStatus('Gagal menyalin teks.');
    });
  };

  return (
    <div className="page-container page-panel-guru">
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
              Panel Guru Kimia
            </li>
          </ol>
        </nav>
      </div>

      <div className="container guru-main-container">
        {/* 2. Hero Banner Panel Guru */}
        <section className="guru-hero-banner" aria-label="Pusat Kendali Guru">
          <div className="guru-hero-content">
            <div className="guru-badge-row">
              <span className="badge-guru-role">👨‍🏫 Portal Khusus Pendidik</span>
              <span className="badge-guru-subject">Kimia SMA Kelas XI • Fase F</span>
            </div>
            <h1 className="guru-hero-title">
              Panel Kendali &amp; Perangkat Ajar <span className="highlight-guru">TitraLab PhET</span>
            </h1>
            <p className="guru-hero-desc">
              Pusat monitoring ketuntasan belajar siswa, kunci jawaban kuis resmi, panduan miskonsepsi, lembar kerja praktikum virtual (LKPD), serta preset demonstrasi di kelas.
            </p>
          </div>

          <div className="guru-hero-actions">
            <button 
              type="button" 
              className="btn btn-primary-guru"
              onClick={handlePrint}
              title="Cetak tampilan materi perangkat ajar"
            >
              🖨️ Cetak / Simpan PDF
            </button>
            <button 
              type="button" 
              className="btn btn-secondary-guru"
              onClick={handleExportCSV}
              title="Unduh rekapitulasi data nilai siswa dalam format CSV"
            >
              📥 Ekspor Rekap CSV
            </button>
          </div>
        </section>

        {/* Notifikasi Salin LKPD */}
        {salinStatus && (
          <div className="guru-alert-toast" role="status">
            <span>✓ {salinStatus}</span>
          </div>
        )}

        {/* 3. Tab Navigasi Panel Guru */}
        <div className="guru-tabs-nav" role="tablist" aria-label="Menu Panel Guru">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pemantauan'}
            className={`guru-tab-btn ${activeTab === 'pemantauan' ? 'active' : ''}`}
            onClick={() => setActiveTab('pemantauan')}
          >
            <span className="tab-icon" aria-hidden="true">📊</span>
            <span>Pemantauan Progres Siswa</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'kunci'}
            className={`guru-tab-btn ${activeTab === 'kunci' ? 'active' : ''}`}
            onClick={() => setActiveTab('kunci')}
          >
            <span className="tab-icon" aria-hidden="true">🔑</span>
            <span>Kunci Jawaban &amp; Miskonsepsi</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'perangkat'}
            className={`guru-tab-btn ${activeTab === 'perangkat' ? 'active' : ''}`}
            onClick={() => setActiveTab('perangkat')}
          >
            <span className="tab-icon" aria-hidden="true">📑</span>
            <span>Perangkat Ajar &amp; LKPD</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'demo'}
            className={`guru-tab-btn ${activeTab === 'demo' ? 'active' : ''}`}
            onClick={() => setActiveTab('demo')}
          >
            <span className="tab-icon" aria-hidden="true">💡</span>
            <span>Preset Demonstrasi Kelas</span>
          </button>
        </div>

        {/* ====================================================================
            TAB 1: PEMANTAUAN PROGRES & KETUNTASAN SISWA
            ==================================================================== */}
        {activeTab === 'pemantauan' && (
          <div className="guru-tab-pane" role="tabpanel">
            {/* Kartu Ringkasan Metrik */}
            <div className="guru-metrics-grid">
              <div className="guru-metric-card">
                <span className="metric-icon-box bg-blue">🧪</span>
                <div className="metric-text-box">
                  <span className="metric-val">{completedMods.length} / 3</span>
                  <span className="metric-title">Modul Diselesaikan</span>
                  <div className="progress-bar-mini">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(completedMods.length / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="guru-metric-card">
                <span className="metric-icon-box bg-emerald">📝</span>
                <div className="metric-text-box">
                  <span className="metric-val">
                    {quizScore ? `${quizScore.skor}` : 'Belum Ada'}
                    {quizScore && <small> / 100</small>}
                  </span>
                  <span className="metric-title">Skor Kuis Pemahaman</span>
                  <span className="metric-subtitle">
                    {quizScore ? `Benar: ${quizScore.benar} dari ${quizScore.total} Soal` : 'Siswa belum menyelesaikan kuis'}
                  </span>
                </div>
              </div>

              <div className="guru-metric-card">
                <span className="metric-icon-box bg-indigo">🎯</span>
                <div className="metric-text-box">
                  <span className="metric-val">
                    {quizScore ? (quizScore.skor >= 75 ? 'Tuntas' : 'Perlu Remidi') : 'Dalam Proses'}
                  </span>
                  <span className="metric-title">Analisis Ketuntasan (KKTP)</span>
                  <span className="metric-subtitle">Standar Kelulusan Minimal ≥ 75</span>
                </div>
              </div>
            </div>

            {/* Tabel Pemantauan Sesi Pembelajaran */}
            <div className="guru-card">
              <div className="guru-card-header">
                <div>
                  <h2 className="guru-card-title">Tabel Rekapitulasi Pembelajaran Siswa (Sesi Perangkat)</h2>
                  <p className="guru-card-subtitle">
                    Data disimpan secara aman pada penyimpanan peramban (<code>localStorage</code>) tanpa memuat data pribadi sensitif siswa.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn btn-outline-guru-sm"
                  onClick={handleExportCSV}
                >
                  Ekspor CSV
                </button>
              </div>

              <div className="table-responsive">
                <table className="guru-table">
                  <thead>
                    <tr>
                      <th scope="col">ID Siswa</th>
                      <th scope="col">Modul 1 (Konsep)</th>
                      <th scope="col">Modul 2 (Kekuatan &amp; pH)</th>
                      <th scope="col">Modul 3 (Titrasi PhET)</th>
                      <th scope="col">Skor Kuis</th>
                      <th scope="col">Status KKTP</th>
                      <th scope="col">Waktu Terakhir</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong className="student-id-badge">{anonId}</strong>
                        <span className="active-tag">Sesi Aktif</span>
                      </td>
                      <td>
                        {completedMods.includes('modul-1') ? (
                          <span className="status-badge-ok">✓ Selesai</span>
                        ) : (
                          <span className="status-badge-wait">○ Belum</span>
                        )}
                      </td>
                      <td>
                        {completedMods.includes('modul-2') ? (
                          <span className="status-badge-ok">✓ Selesai</span>
                        ) : (
                          <span className="status-badge-wait">○ Belum</span>
                        )}
                      </td>
                      <td>
                        {completedMods.includes('modul-3') ? (
                          <span className="status-badge-ok">✓ Selesai</span>
                        ) : (
                          <span className="status-badge-wait">○ Belum</span>
                        )}
                      </td>
                      <td>
                        {quizScore ? (
                          <span className="quiz-score-badge">{quizScore.skor} / 100</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        {quizScore ? (
                          quizScore.skor >= 75 ? (
                            <span className="badge-kktp-pass">Tuntas (Memenuhi)</span>
                          ) : (
                            <span className="badge-kktp-remedial">Remedial Materi</span>
                          )
                        ) : (
                          <span className="badge-kktp-pending">Belum Ujian</span>
                        )}
                      </td>
                      <td>
                        <small className="time-text">
                          {quizScore?.waktu ? `${quizScore.waktu}` : 'Sesi ini'}
                        </small>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Rincian Evaluasi Jawaban Siswa Jika Kuis Selesai */}
              {quizSession && Array.isArray(quizSession.soalAcak) && (
                <div className="quiz-answers-review-box">
                  <h3 className="review-title">Rincian Lembar Jawaban Kuis Siswa Terakhir:</h3>
                  <div className="review-items-list">
                    {quizSession.soalAcak.map((soal, idx) => {
                      const jawabanSiswa = quizSession.jawabanSiswa?.[soal.id];
                      const opsiTerpilih = soal.pilihan.find(p => p.id === jawabanSiswa);
                      const opsiBenar = soal.pilihan.find(p => p.benar);
                      const isBenar = opsiTerpilih?.benar;

                      return (
                        <div key={soal.id} className={`review-item ${isBenar ? 'item-correct' : 'item-wrong'}`}>
                          <div className="review-item-header">
                            <span className="review-num">Soal #{idx + 1}</span>
                            <span className={`review-badge ${isBenar ? 'badge-correct' : 'badge-wrong'}`}>
                              {isBenar ? 'Jawaban Benar (+20 Poin)' : 'Jawaban Kurang Tepat (0 Poin)'}
                            </span>
                          </div>
                          <p className="review-q">{soal.pertanyaan}</p>
                          <div className="review-ans-row">
                            <span>Jawaban Siswa: <strong>{opsiTerpilih ? opsiTerpilih.teks : 'Tidak dijawab'}</strong></span>
                            {!isBenar && (
                              <span className="correct-ans-highlight">
                                Kunci Resmi: <strong>{opsiBenar?.teks}</strong>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 2: KUNCI JAWABAN LENGKAP & PANDUAN MISKONSEPSI
            ==================================================================== */}
        {activeTab === 'kunci' && (
          <div className="guru-tab-pane" role="tabpanel">
            <div className="guru-card">
              <div className="guru-card-header">
                <div>
                  <h2 className="guru-card-title">Bank Soal Kuis, Kunci Jawaban &amp; Pembahasan</h2>
                  <p className="guru-card-subtitle">
                    Referensi guru untuk menjelaskan miskonsepsi yang sering dialami siswa pada materi asam basa.
                  </p>
                </div>
                <span className="badge-count">{daftarSoalKuis.length} Butir Soal Terstandar</span>
              </div>

              <div className="soal-guru-list">
                {daftarSoalKuis.map((soal, idx) => {
                  const kunci = soal.pilihan.find(p => p.benar);
                  return (
                    <article key={soal.id} className="soal-guru-card">
                      <div className="soal-card-top">
                        <span className="soal-number-pill">Soal {idx + 1}</span>
                        <span className="soal-topic-tag">Topik Kimia SMA XI</span>
                      </div>

                      <h3 className="soal-text">{soal.pertanyaan}</h3>

                      {/* Pilihan Jawaban */}
                      <div className="options-guru-list">
                        {soal.pilihan.map((pilih) => (
                          <div 
                            key={pilih.id} 
                            className={`option-guru-row ${pilih.benar ? 'option-key' : ''}`}
                          >
                            <span className="opt-letter">{pilih.id.toUpperCase()}.</span>
                            <span className="opt-text">{pilih.teks}</span>
                            {pilih.benar && (
                              <span className="opt-key-badge">✓ Kunci Jawaban Benar</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Kotak Pembahasan & Catatan Guru */}
                      <div className="soal-explanation-box">
                        <div className="explanation-head">
                          <span className="exp-icon">💡</span>
                          <strong>Penjelasan Konsep &amp; Panduan Miskonsepsi:</strong>
                        </div>
                        <p className="exp-content">{soal.pembahasan}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 3: PERANGKAT AJAR & LKPD VIRTUAL PhET
            ==================================================================== */}
        {activeTab === 'perangkat' && (
          <div className="guru-tab-pane" role="tabpanel">
            <div className="guru-grid-2col">
              {/* Kolom 1: Alur Tujuan Pembelajaran & Sintaks Inkuiri */}
              <div className="guru-card">
                <div className="guru-card-header">
                  <h2 className="guru-card-title">Alur Pembelajaran (Sintaks Inkuiri PhET)</h2>
                </div>

                <div className="sintaks-step-list">
                  <div className="sintaks-step">
                    <div className="step-circle">1</div>
                    <div className="step-desc">
                      <strong>Tahap Orientasi &amp; Stimulus:</strong>
                      <p>Siswa mengamati tayangan sifat larutan sehari-hari (cuka, sabun, air jeruk) dan memprediksi sifat asam-basanya.</p>
                    </div>
                  </div>

                  <div className="sintaks-step">
                    <div className="step-circle">2</div>
                    <div className="step-desc">
                      <strong>Eksplorasi Simulasi PhET (Modul 1 &amp; 2):</strong>
                      <p>Siswa mencelupkan indikator lakmus virtual dan mengamati visualisasi partikel disosiasi asam kuat vs lemah.</p>
                    </div>
                  </div>

                  <div className="sintaks-step">
                    <div className="step-circle">3</div>
                    <div className="step-desc">
                      <strong>Kalkulasi pH &amp; Diskusi Terbimbing:</strong>
                      <p>Siswa memverifikasi perhitungan derajat keasaman memakai alat <em>Kalkulator pH Virtual</em>.</p>
                    </div>
                  </div>

                  <div className="sintaks-step">
                    <div className="step-circle">4</div>
                    <div className="step-desc">
                      <strong>Praktikum Titrasi &amp; Evaluasi (Modul 3 &amp; Kuis):</strong>
                      <p>Siswa melakukan titrasi volumetri dan mengerjakan kuis pemahaman mandiri.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom 2: Lembar Kerja Peserta Didik (LKPD) */}
              <div className="guru-card">
                <div className="guru-card-header">
                  <div>
                    <h2 className="guru-card-title">Lembar Kerja Praktikum (LKPD)</h2>
                    <p className="guru-card-subtitle">Format siap salin atau cetak untuk dibagikan ke siswa di kelas.</p>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary-guru-sm"
                    onClick={handleSalinLKPD}
                  >
                    📋 Salin Teks LKPD
                  </button>
                </div>

                <div className="lkpd-preview-box">
                  <div className="lkpd-doc-header">
                    <h4>LEMBAR KERJA PESERTA DIDIK (LKPD)</h4>
                    <p>Mata Pelajaran: Kimia | Kelas: XI SMA | Waktu: 2 × 45 Menit</p>
                  </div>

                  <div className="lkpd-body-text">
                    <strong>A. Indikator Percobaan:</strong>
                    <ul>
                      <li>Mengidentifikasi larutan asam/basa menggunakan indikator lakmus pada simulasi PhET.</li>
                      <li>Menghitung konsentrasi ion H⁺ dan OH⁻ dari konsentrasi larutan awal.</li>
                    </ul>

                    <strong>B. Tabel Pengamatan Simulasi PhET:</strong>
                    <div className="table-responsive">
                      <table className="lkpd-sample-table">
                        <thead>
                          <tr>
                            <th>Sampel Larutan</th>
                            <th>Warna Lakmus Merah</th>
                            <th>Warna Lakmus Biru</th>
                            <th>Nilai pH</th>
                            <th>Sifat Larutan</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td>Air Jeruk</td><td>Merah</td><td>Merah</td><td>2,4</td><td>Asam</td></tr>
                          <tr><td>Air Sabun</td><td>Biru</td><td>Biru</td><td>10,0</td><td>Basa</td></tr>
                          <tr><td>HCl 0,1 M</td><td>Merah</td><td>Merah</td><td>1,0</td><td>Asam Kuat</td></tr>
                          <tr><td>NaOH 0,1 M</td><td>Biru</td><td>Biru</td><td>13,0</td><td>Basa Kuat</td></tr>
                        </tbody>
                      </table>
                    </div>

                    <strong>C. Pertanyaan Refleksi:</strong>
                    <p>1. Apa perbedaan partikel asam kuat dan asam lemah pada konsentrasi yang sama?</p>
                    <p>2. Jelaskan mengapa titik ekuivalen titrasi asam kuat dengan basa kuat terjadi pada pH 7,0!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 4: PRESET DEMONSTRASI KELAS (PROYEKTOR)
            ==================================================================== */}
        {activeTab === 'demo' && (
          <div className="guru-tab-pane" role="tabpanel">
            <div className="guru-card">
              <div className="guru-card-header">
                <div>
                  <h2 className="guru-card-title">Preset Demonstrasi Cepat untuk Guru</h2>
                  <p className="guru-card-subtitle">
                    Gunakan preset larutan kimia di bawah ini saat mendemonstrasikan materi di depan kelas menggunakan proyektor.
                  </p>
                </div>
              </div>

              <div className="demo-preset-grid">
                {/* Preset 1: Asam Kuat */}
                <div className="demo-preset-card">
                  <div className="demo-preset-head">
                    <span className="preset-tag tag-acid">Asam Kuat</span>
                    <span className="preset-formula">HCl (Asam Klorida)</span>
                  </div>
                  <div className="demo-preset-body">
                    <p className="preset-calc">[H⁺] = a × M = 1 × 0,1 = 0,1 M</p>
                    <div className="preset-result">
                      <span>Hasil Hitung:</span>
                      <strong>pH = 1,00</strong>
                    </div>
                    <small className="preset-note">Disosiasi sempurna (α = 1). Cocok untuk demonstrasi awal kurva pH.</small>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-outline-preset"
                    onClick={() => onNavigate && onNavigate('kalkulator')}
                  >
                    Buka di Kalkulator pH →
                  </button>
                </div>

                {/* Preset 2: Asam Lemah */}
                <div className="demo-preset-card">
                  <div className="demo-preset-head">
                    <span className="preset-tag tag-weak-acid">Asam Lemah</span>
                    <span className="preset-formula">CH₃COOH (Asam Asetat)</span>
                  </div>
                  <div className="demo-preset-body">
                    <p className="preset-calc">[H⁺] = √(Ka × M) = √(1,8 × 10⁻⁵ × 0,1)</p>
                    <div className="preset-result">
                      <span>Hasil Hitung:</span>
                      <strong>pH = 2,87</strong>
                    </div>
                    <small className="preset-note">Disosiasi sebagian. Bagus untuk membandingkan perbedaan pH dengan HCl pada konsentrasi sama.</small>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-outline-preset"
                    onClick={() => onNavigate && onNavigate('kalkulator')}
                  >
                    Buka di Kalkulator pH →
                  </button>
                </div>

                {/* Preset 3: Basa Kuat */}
                <div className="demo-preset-card">
                  <div className="demo-preset-head">
                    <span className="preset-tag tag-base">Basa Kuat</span>
                    <span className="preset-formula">NaOH (Natrium Hidroksida)</span>
                  </div>
                  <div className="demo-preset-body">
                    <p className="preset-calc">[OH⁻] = b × M = 1 × 0,1 M | pOH = 1,00</p>
                    <div className="preset-result">
                      <span>Hasil Hitung:</span>
                      <strong>pH = 13,00</strong>
                    </div>
                    <small className="preset-note">Disosiasi 100%. Rumus relasi suhu 25 °C: pH = 14 − pOH = 13,00.</small>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-outline-preset"
                    onClick={() => onNavigate && onNavigate('kalkulator')}
                  >
                    Buka di Kalkulator pH →
                  </button>
                </div>

                {/* Preset 4: Titrasi Volumetri */}
                <div className="demo-preset-card card-highlight">
                  <div className="demo-preset-head">
                    <span className="preset-tag tag-titration">Titrasi Netralisasi</span>
                    <span className="preset-formula">HCl 25 mL (0,1 M) + NaOH (0,1 M)</span>
                  </div>
                  <div className="demo-preset-body">
                    <p className="preset-calc">Va × Ma × a = Vb × Mb × b</p>
                    <div className="preset-result">
                      <span>Titik Ekivalen:</span>
                      <strong>Vb = 25,0 mL (pH = 7,00)</strong>
                    </div>
                    <small className="preset-note">Indikator fenolftalein (PP) berubah warna dari tak berwarna menjadi merah muda lembut pada pH 8,3.</small>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary-preset"
                    onClick={() => onNavigate && onNavigate('modul')}
                  >
                    Buka Modul Titrasi PhET →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

