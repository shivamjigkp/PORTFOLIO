/* ==========================================================================
   THEME.JS — dark / light mode toggle
   Persists choice in localStorage; falls back to system preference.
   Default is LIGHT (the site's primary, designed-for aesthetic).
   ========================================================================== */

import { qs } from './utilities.js';

const STORAGE_KEY = 'sg-portfolio-theme';
const root = document.documentElement;

function getPreferredTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  // Respect system preference, but default to light if no strong preference.
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme, toggleBtn) {
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
  if (toggleBtn) {
    toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  const metaTheme = qs('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'dark' ? '#0B0B0F' : '#FFFFFF');
  }
}

export function initTheme() {
  const toggleBtn = qs('#theme-toggle');
  // Apply immediately to avoid a flash of the wrong theme.
  applyTheme(getPreferredTheme(), toggleBtn);

  if (!toggleBtn) return;
  toggleBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, toggleBtn);
    localStorage.setItem(STORAGE_KEY, next);
  });
}
