import React, { useState, useEffect } from 'react';
import Beranda from './pages/Beranda';
import './App.css';

/**
 * Komponen Utama App
 * Mengelola state tema aktif (gelap/terang laboratorium) dan merender Halaman Beranda
 */
export default function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return <Beranda theme={theme} toggleTheme={toggleTheme} />;
}
