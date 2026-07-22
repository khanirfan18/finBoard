import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "@fontsource/inter";
import { applyThemeToDocument, getStoredTheme } from './context/ThemeContext';
import {
  startFaviconAnimation,
  stopFaviconAnimation
} from "./components/utils/faviconAnimation";

let bootTheme = 'dark';

try {
  bootTheme = getStoredTheme();
} catch {
  bootTheme = 'dark';
}

applyThemeToDocument(bootTheme);

// Start animated favicon
startFaviconAnimation();

// Pause favicon animation when tab is inactive
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopFaviconAnimation();
  } else {
    startFaviconAnimation();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)