/* ==========================================================================
   NAVBAR.JS — mobile hamburger menu open/close
   ========================================================================== */

import { qs, qsa } from './utilities.js';

export function initMobileNav() {
  const toggle = qs('#nav-toggle');
  const links = qs('#nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    links.setAttribute('data-open', String(!open));
  });

  qsa('a', links).forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      links.setAttribute('data-open', 'false');
    });
  });
}
