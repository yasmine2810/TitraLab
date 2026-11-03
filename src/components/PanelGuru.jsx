import React, { useState } from 'react';
import { daftarSoalKuis } from '../data/kuis';

/**
 * Komponen PanelGuru
 * Panel khusus yang aktif pada Beranda ketika peran pengguna adalah Guru / Pendidik.
 * Menyediakan:
 * 1. Rencana Pelaksanaan Pembelajaran (RPP) & Modul Ajar Kimia SMA XI
 * 2. Lembar Kerja Peserta Didik (LKPD Virtual)
 * 3. Bank Kunci & Rubrik Evaluasi Kuis
 * 4. Petunjuk Praktikum Laboratorium Simulasi PhET
 */
export default function PanelGuru({ onGantiPeran }) {
  const [tabAktif, setTabAktif] = useState('rpp');

  return (
    <section className="teacher-panel-section" id="panel-guru" aria-labelledby="teacher-panel-heading">
      <div className="container">
        {/* Banner Identitas Pendidik */}
        <div className="teacher-panel-banner">
          <div className="teacher-banner-left">
            <span className="teacher-role-tag">
              <span className="teacher-role-dot" aria-hidden="true"></span>
              Mode Pengajar Aktif
            </span>
            <h2 id="teacher-panel-heading" className="teacher-panel-title">
              Ruang Pendidik & Administrasi Pembelajaran Kimia
            </h2>
            <p className="teacher-panel-desc">
              Selamat datang, Bapak/Ibu Guru. Halaman ini menyediakan perangkat ajar lengkap Kurikulum Merdeka untuk topik Asam Basa, panduan LKPD berbasis simulasi PhET, serta kunci evaluasi kuis.
            </p>
          </div>

          <div className="teacher-banner-right">
            <button
              type="button"
              className="btn btn-hero-secondary btn-sm"
              onClick={onGantiPeran}
            >
              🔄 Beralih ke Tampilan Siswa
            </button>
          </div>
        </div>

        {/* Tab Navigasi Panel Guru */}
        <div className="teacher-nav-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tabAktif === 'rpp'}
            className={`teacher-tab-item ${tabAktif === 'rpp' ? 'active' : ''}`}
            onClick={() => setTabAktif('rpp')}
          >
            <span className="tab-icon" aria-hidden="true">📋</span>
            <span>Modul Ajar & RPP</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tabAktif === 'lkpd'}
            className={`teacher-tab-item ${tabAktif === 'lkpd' ? 'active' : ''}`}
            onClick={() => setTabAktif('lkpd')}
          >
            <span className="tab-icon" aria-hidden="true">📑</span>
            <span>LKPD Virtual PhET</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tabAktif === 'kunci'}
            className={`teacher-tab-item ${tabAktif === 'kunci' ? 'active' : ''}`}
            onClick={() => setTabAktif('kunci')}
          >
            <span className="tab-icon" aria-hidden="true">🔑</span>
            <span>Bank Kunci & Rubrik Kuis</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tabAktif === 'panduan'}
            className={`teacher-tab-item ${tabAktif === 'panduan' ? 'active' : ''}`}
            onClick={() => setTabAktif('panduan')}
          >
            <span className="tab-icon" aria-hidden="true">🔬</span>
            <span>Petunjuk Teknis PhET</span>
          </button>
        </div>

        {/* Konten Tab 1: Modul Ajar & RPP */}
        {tabAktif === 'rpp' && (
          <div className="teacher-card-content" role="tabpanel">
            <div className="content-header-group">
              <h3 className="content-main-title">Modul Ajar Kimia SMA Kelas XI: Asam Basa (Fase F)</h3>
              <span className="badge-curriculum">Kurikulum Merdeka 2026</span>
            </div>

            <div className="rpp-grid">
              <div className="rpp-box">
                <h4 className="rpp-box-title">1. Capaian Pembelajaran (CP)</h4>
                <p>
                  Peserta didik mampu memahami konsep kesetimbangan ion dalam larutan, membedakan sifat asam dan basa menggunakan berbagai indikator, menghitung derajat keasaman (pH) larutan asam-basa kuat dan lemah, serta merancang dan melaksanakan titrasi asam basa untuk menentukan konsentrasi larutan.
                </p>
              </div>

              <div className="rpp-box">
                <h4 className="rpp-box-title">2. Alur Tujuan Pembelajaran (ATP)</h4>
                <ul>
                  <li>Menganalisis perkembangan teori asam basa Arrhenius, Brønsted-Lowry, dan Lewis.</li>
                  <li>Mengidentifikasi trayek perubahan warna indikator alami, lakmus, dan indikator universal.</li>
                  <li>Mengkorelasikan konsentrasi ion H⁺ dan OH⁻ terhadap nilai pH larutan.</li>
                  <li>Menganalisis kurva titrasi asam kuat dan basa kuat serta menentukan titik ekivalen.</li>
                </ul>
              </div>

              <div className="rpp-box">
                <h4 className="rpp-box-title">3. Model & Metode Pembelajaran</h4>
                <p>
                  <strong>Model:</strong> *Inquiry-Based Learning* & *Discovery Learning* berbantuan Simulasi PhET Interactive Simulations.<br />
                  <strong>Pendekatan:</strong> Saintifik berbasis TPACK (Technological Pedagogical Content Knowledge).
                </p>
              </div>

              <div className="rpp-box">
                <h4 className="rpp-box-title">4. Alokasi Waktu Pembelajaran</h4>
                <p>
                  Total 3 Pertemuan (6 Jam Pelajaran @ 45 menit):
                  <br />• Pertemuan 1: Konsep & Indikator Asam Basa (2 JP)
                  <br />• Pertemuan 2: Derajat Ionisasi & Perhitungan pH (2 JP)
                  <br />• Pertemuan 3: Praktikum Titrasi Volumetri Virtual (2 JP)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Konten Tab 2: LKPD Virtual */}
        {tabAktif === 'lkpd' && (
          <div className="teacher-card-content" role="tabpanel">
            <div className="content-header-group">
              <h3 className="content-main-title">Lembar Kerja Peserta Didik (LKPD Virtual)</h3>
              <p className="content-sub-text">Bapak/Ibu Guru dapat memanfaatkan panduan aktivitas ini untuk penugasan siswa di laboratorium komputer atau kelas.</p>
            </div>

            <div className="lkpd-cards-list">
              <div className="lkpd-card-item">
                <div className="lkpd-item-top">
                  <span className="lkpd-number">LKPD 01</span>
                  <span className="lkpd-sim-tag">Simulasi PhET: pH Scale Basics</span>
                </div>
                <h4 className="lkpd-title">Identifikasi Trayek pH Larutan Sehari-hari</h4>
                <p className="lkpd-desc">
                  Siswa menyelidiki pengaruh pengenceran air murni terhadap nilai pH air sabun, jus jeruk, asam lambung, dan kopi melalui simulasi PhET pH Scale Basics.
                </p>
                <div className="lkpd-outcomes">
                  <strong>Indikator Kerja Siswa:</strong>
                  <span>Menyimpulkan bahwa pengenceran larutan asam menaikkan pH mendekati 7, sedangkan pengenceran basa menurunkan pH mendekati 7.</span>
                </div>
              </div>

              <div className="lkpd-card-item">
                <div className="lkpd-item-top">
                  <span className="lkpd-number">LKPD 02</span>
                  <span className="lkpd-sim-tag">Simulasi PhET: Acid-Base Solutions</span>
                </div>
                <h4 className="lkpd-title">Visualisasi Partikel Asam-Basa Kuat dan Lemah</h4>
                <p className="lkpd-desc">
                  Siswa membandingkan derajat ionisasi (α) dan jumlah molekul tak terionisasi antara asam kuat (HCl) dan asam lemah (HF) pada konsentrasi yang sama.
                </p>
                <div className="lkpd-outcomes">
                  <strong>Indikator Kerja Siswa:</strong>
                  <span>Membuktikan bahwa asam kuat terionisasi sempurna (α = 1) sementara asam lemah hanya terionisasi sebagian (α &lt;&lt; 1).</span>
                </div>
              </div>

              <div className="lkpd-card-item">
                <div className="lkpd-item-top">
                  <span className="lkpd-number">LKPD 03</span>
                  <span className="lkpd-sim-tag">Simulasi PhET: Acid-Base Titration</span>
                </div>
                <h4 className="lkpd-title">Penentuan Konsentrasi Larutan Analit Melalui Titrasi</h4>
                <p className="lkpd-desc">
                  Siswa melakukan titrasi asam kuat dengan basa kuat untuk menentukan konsentrasi larutan analit yang belum diketahui dengan bantuan indikator fenolftalein (PP).
                </p>
                <div className="lkpd-outcomes">
                  <strong>Indikator Kerja Siswa:</strong>
                  <span>Menggunakan rumus stoikiometri Va × Ma × a = Vb × Mb × b untuk menghitung konsentrasi analit pada titik akhir titrasi.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Konten Tab 3: Bank Kunci & Rubrik Kuis */}
        {tabAktif === 'kunci' && (
          <div className="teacher-card-content" role="tabpanel">
            <div className="content-header-group">
              <h3 className="content-main-title">Bank Kunci Jawaban & Rubrik Penilaian Kuis</h3>
              <p className="content-sub-text">Kunci jawaban resmi dan pembahasan lengkap untuk keperluan asesmen diagnostik dan formatif kelas.</p>
            </div>

            <div className="teacher-quiz-keys-list">
              {daftarSoalKuis.map((soal, idx) => {
                const opsiBenar = soal.pilihan.find(p => p.benar);
                return (
                  <div key={soal.id} className="teacher-key-card">
                    <div className="key-card-header">
                      <span className="key-number">Nomor {idx + 1}</span>
                      <span className="key-badge">Kunci: Opsi {opsiBenar?.teks}</span>
                    </div>
                    <p className="key-question">{soal.pertanyaan}</p>
                    <div className="key-explanation">
                      <strong>Pembahasan Konsep Guru:</strong>
                      <p>{soal.pembahasan}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Konten Tab 4: Petunjuk Teknis PhET */}
        {tabAktif === 'panduan' && (
          <div className="teacher-card-content" role="tabpanel">
            <div className="content-header-group">
              <h3 className="content-main-title">Petunjuk Teknis Pembelajaran Laboratorium Virtual PhET</h3>
              <p className="content-sub-text">Rekomendasi bagi guru dalam membimbing siswa selama sesi pembelajaran mandiri maupun klasikal.</p>
            </div>

            <div className="teacher-guidelines-grid">
              <div className="guideline-item">
                <span className="guideline-step">Langkah 1</span>
                <h4>Orientasi Awal & Pertanyaan Pemantik</h4>
                <p>
                  Awali dengan fenomena nyata: mengapa rasa sengatan semut (asam format) dapat diredakan dengan soda kue (basa)? Arahkan siswa membuka kalkulator pH virtual untuk membandingkan skala keasamannya.
                </p>
              </div>

              <div className="guideline-item">
                <span className="guideline-step">Langkah 2</span>
                <h4>Eksplorasi Mandiri Siswa (Student-Centered)</h4>
                <p>
                  Beri waktu 25 menit kepada peserta didik untuk membuka Modul 1 sampai 3 secara bergantian. Dorong siswa mencoba slider konsentrasi pada kalkulator pH untuk melihat dampak perubahan konsentrasi terhadap ion H⁺ dan OH⁻.
                </p>
              </div>

              <div className="guideline-item">
                <span className="guideline-step">Langkah 3</span>
                <h4>Evaluasi Formatif Melalui Kuis Cepat</h4>
                <p>
                  Minta seluruh siswa mengerjakan Kuis Pemahaman pada bagian bawah beranda. Karena soal dan pilihan jawaban diacak otomatis, siswa tidak dapat saling menyontek urutan huruf jawaban.
                </p>
              </div>

              <div className="guideline-item">
                <span className="guideline-step">Langkah 4</span>
                <h4>Privasi & Kebersihan Data</h4>
                <p>
                  Seluruh data tersimpan secara anonim pada komputer masing-masing. Di akhir sesi praktikum komputer sekolah, siswa dapat menekan tombol <strong>Hapus Progres</strong> di pojok atas untuk membersihkan peramban bagi kelas berikutnya.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

