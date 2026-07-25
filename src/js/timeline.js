/* ==========================================================================
   TIMELINE.JS — makes the experience timeline interactive:
   - click/keyboard toggle to expand a "stack used" tag row per item
   - the dot for whichever item is currently in view gets a soft pulse
   ========================================================================== */

import { qs, qsa } from './utilities.js';

export function initTimeline() {
  const items = qsa('.tl-item');
  if (!items.length) return;

  items.forEach((item) => {
    const toggle = item.querySelector('.tl-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const expanded = item.classList.toggle('is-expanded');
      toggle.setAttribute('aria-expanded', String(expanded));
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-active', entry.isIntersecting);
      });
    },
    { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
  );
  items.forEach((item) => observer.observe(item));
}
