/* ==========================================================================
   SCROLLREVEAL.JS — fade-up reveal for elements with the .reveal class
   ========================================================================== */

import { qsa, reduceMotion } from './utilities.js';

const STAGGER_STEP_MS = 70;
const STAGGER_MAX_STEPS = 5;

// Elements that share a parent and enter the viewport together (grids,
// stacked cards) reveal in a short cascade rather than all at once.
function applyStagger(el) {
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
  const index = siblings.indexOf(el);
  const step = Math.min(index, STAGGER_MAX_STEPS);
  el.style.transitionDelay = `${step * STAGGER_STEP_MS}ms`;
}

export function initScrollReveal() {
  const targets = qsa('.reveal');
  if (!targets.length) return;

  if (reduceMotion) {
    targets.forEach((el) => el.classList.add('in'));
    return;
  }

  targets.forEach(applyStagger);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}
