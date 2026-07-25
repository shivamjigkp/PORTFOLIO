/* ==========================================================================
   COUNTUP.JS — animates [data-count-to] numbers when they scroll into view
   ========================================================================== */

import { qsa, reduceMotion } from './utilities.js';

function animate(el) {
  const target = parseFloat(el.getAttribute('data-count-to'));
  const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1100;
  const start = performance.now();

  if (reduceMotion) {
    el.textContent = target.toFixed(decimals) + suffix;
    return;
  }

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

export function initCountUp() {
  const counters = qsa('[data-count-to]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((c) => observer.observe(c));
}
