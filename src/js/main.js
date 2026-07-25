/* ==========================================================================
   MAIN.JS — application entry point
   Imports every feature module and wires it up once the DOM is ready.
   Loaded via <script type="module"> so imports work natively, no bundler
   required.
   ========================================================================== */

import { qs } from './utilities.js';
import { initTheme } from './theme.js';
import { initMobileNav } from './navbar.js';
import { initScrollReveal } from './scrollReveal.js';
import { initActiveNav } from './activeNav.js';
import { initCountUp } from './countUp.js';
import { initBackToTop } from './backToTop.js';
import { initLoader } from './loader.js';
import { initCursor } from './cursor.js';
import { initCommandPalette } from './commandPalette.js';
import { initEasterEgg } from './easterEgg.js';
import { initTimeline } from './timeline.js';
import { initContactForm } from './contactForm.js';

function initFooterYear() {
  const el = qs('#current-year');
  if (el) el.textContent = new Date().getFullYear();
}

function init() {
  initTheme();
  initMobileNav();
  initScrollReveal();
  initActiveNav();
  initCountUp();
  initBackToTop();
  initFooterYear();
  initLoader();
  initCursor();
  initCommandPalette();
  initEasterEgg();
  initTimeline();
  initContactForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
