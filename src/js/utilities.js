/* ==========================================================================
   UTILITIES — small shared helpers used by other modules
   ========================================================================== */

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function qsa(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}
