/* ==========================================================================
   ACTIVENAV.JS — scroll-spy: highlight the nav link for the visible section
   ========================================================================== */

import { qs, qsa } from './utilities.js';

export function initActiveNav() {
  const sections = qsa('main section[id]');
  const links = qsa('.navlinks a');
  if (!sections.length || !links.length) return;

  const linkFor = (id) => qs(`.navlinks a[href="#${id}"]`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkFor(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}
