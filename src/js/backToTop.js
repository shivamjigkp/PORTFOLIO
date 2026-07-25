/* ==========================================================================
   BACKTOTOP.JS — floating scroll-to-top control
   ========================================================================== */

import { qs, reduceMotion } from './utilities.js';

export function initBackToTop() {
  const btn = qs('#back-to-top');
  if (!btn) return;

  const toggleVisibility = () => {
    btn.setAttribute('data-visible', window.scrollY > 700 ? 'true' : 'false');
  };
  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}
