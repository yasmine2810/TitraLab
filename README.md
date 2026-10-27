# React + Vite Modern Project

Projek React 18 modern bertenaga Vite dengan performa tinggi, styling Vanilla CSS elegan (Glassmorphism & Dark/Light mode), dan playground interaktif.

## 🚀 Memulai (Quick Start)

### 1. Instal Dependensi
Jalankan perintah berikut di terminal:
```bash
npm install
```

### 2. Jalankan Development Server
```bash
npm run dev
```
Setelah dijalankan, buka browser di alamat yang muncul (biasanya `http://localhost:3000`).

### 3. Build untuk Produksi
```bash
npm run build
```
Hasil build optimal akan tersedia di folder `dist/`.

---

## 📁 Struktur Direktori

```text
WEBSITE/
├── index.html              # Template HTML utama & Google Fonts
├── vite.config.js          # Konfigurasi Vite & React plugin
├── package.json            # Daftar script & dependensi projek
├── .gitignore              # Mengabaikan node_modules, dist, dll.
└── src/
    ├── main.jsx            # Entry point aplikasi React
    ├── App.jsx             # Komponen root aplikasi & manajemen tema
    ├── App.css             # Styling layout, grid, & komponen
    ├── index.css           # Global design system & token warna/variabel
    └── components/
        ├── Navbar.jsx      # Navigasi & switch Dark/Light mode
        ├── Hero.jsx        # Bagian utama landing & copy command
        ├── Features.jsx    # Kartu fitur arsitektur & keunggulan
        ├── InteractiveDemo.jsx # Playground state counter & todo checklist
        └── Footer.jsx      # Footer informasi projek
```

## ✨ Fitur Unggulan
- **Vite HMR**: Update kode secepat kilat (&lt;50ms).
- **Dark & Light Mode**: Desain responsif dengan transisi warna halus.
- **Interaktivitas State**: Demo langsung React Hook `useState`.
- **Zero Config Headache**: Bebas konflik dependensi dan siap dikembangkan lebih lanjut.
