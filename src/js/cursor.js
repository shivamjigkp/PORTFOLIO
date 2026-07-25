/* ==========================================================================
   CURSOR.JS — custom dot + trailing ring cursor.
   Only activates on devices that report a fine pointer AND hover support
   (i.e. an actual mouse/trackpad) — touch devices are left completely
   untouched, including no hidden native cursor.
   ========================================================================== */

import { reduceMotion } from './utilities.js';

const HOVER_TARGETS = 'a, button, .btn, .proj-card, .skill-tag, .cert-item, .tl-item, [data-cursor-hover]';

export function initCursor() {
  const isFinePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
  if (!isFinePointer) return;

  const html = document.documentElement;
  html.classList.add('has-custom-cursor');

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let idleTimer;

  function onMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    html.classList.remove('cursor-idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => html.classList.add('cursor-idle'), 2200);
  }

  function renderRing() {
    // Simple lerp so the ring trails the dot with a soft, deliberate lag.
    const ease = reduceMotion ? 1 : 0.18;
    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderRing);
  }

  document.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseleave', () => html.classList.add('cursor-idle'));
  document.addEventListener('mouseenter', () => html.classList.remove('cursor-idle'));

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(HOVER_TARGETS)) html.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(HOVER_TARGETS)) html.classList.remove('cursor-hover');
  });

  requestAnimationFrame(renderRing);
}
