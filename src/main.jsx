import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "@fontsource/inter";
import { applyThemeToDocument, getStoredTheme } from './context/ThemeContext';

const frames = [
  "/favicon/frame_00.png",
  "/favicon/frame_02.png",
  "/favicon/frame_04.png",
  "/favicon/frame_06.png",
  "/favicon/frame_08.png",
  "/favicon/frame_10.png",
  "/favicon/frame_12.png",
  "/favicon/frame_14.png",
  "/favicon/frame_16.png",
  "/favicon/frame_18.png",
  "/favicon/frame_20.png",
  "/favicon/frame_22.png",
  "/favicon/frame_24.png",
  "/favicon/frame_26.png",
  "/favicon/frame_28.png",
  "/favicon/frame_30.png",
];

let i = 0;

window.addEventListener("DOMContentLoaded", () => {
  const favicon = document.getElementById("favicon");

  setInterval(() => {
    favicon.href = frames[i] + "?v=" + i; // helps avoid caching
    i = (i + 1) % frames.length;
  }, 100);
});

let bootTheme = 'dark';

try {
  bootTheme = getStoredTheme();
} catch {
  bootTheme = 'dark';
}

applyThemeToDocument(bootTheme);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
