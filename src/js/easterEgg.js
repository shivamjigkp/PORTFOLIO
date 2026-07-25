/* ==========================================================================
   EASTEREGG.JS — two tasteful, low-risk touches for the curious visitor:
   1. A styled console greeting for anyone who opens devtools.
   2. The Konami code, which reveals a small friendly toast. Nothing else
      on the page changes — no popups, no blocking, no layout shift.
   ========================================================================== */

import { showToast } from './toast.js';

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

function logConsoleGreeting() {
  const style = 'font-family:monospace;font-size:13px;color:#4F46E5;';
  console.log('%c👋  Hey, curious developer.', style + 'font-weight:bold;font-size:15px;');
  console.log(
    '%cLiked what you saw in the source? I\'m always up for a chat about full-stack dev, ML, or systematic trading.\nquantxcoder@gmail.com · github.com/shivamjigkp',
    style
  );
}

export function initEasterEgg() {
  logConsoleGreeting();

  let position = 0;
  document.addEventListener('keydown', (e) => {
    if (typeof e.key !== 'string') return;
    const expected = KONAMI[position];
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === expected) {
      position += 1;
      if (position === KONAMI.length) {
        position = 0;
        showToast({
          type: 'success',
          icon: '🥚',
          title: 'You found it',
          message: "Nice — that's the Konami code. Curiosity like that is exactly what I look for. Let's talk: quantxcoder@gmail.com",
          duration: 6000,
        });
      }
    } else {
      position = key === KONAMI[0] ? 1 : 0;
    }
  });
}
