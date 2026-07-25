/* ==========================================================================
   LOADER.JS — hides the branded loading screen once the page has settled.
   Guarantees a minimum visible time so it never feels like a flicker, but
   never blocks longer than necessary once the page is actually ready.
   ========================================================================== */

import { qs, reduceMotion } from './utilities.js';

const MIN_VISIBLE_MS = 450;

export function initLoader() {
  const loader = qs('#loader');
  if (!loader) return;

  const shownAt = performance.now();

  const hide = () => {
    const elapsed = performance.now() - shownAt;
    const wait = reduceMotion ? 0 : Math.max(0, MIN_VISIBLE_MS - elapsed);
    setTimeout(() => {
      loader.classList.add('is-hidden');
      loader.addEventListener(
        'transitionend',
        () => loader.remove(),
        { once: true }
      );
      // Fallback in case transitionend doesn't fire (e.g. reduced motion / no transition)
      setTimeout(() => loader.remove(), 700);
    }, wait);
  };

  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', hide, { once: true });
  }
}
