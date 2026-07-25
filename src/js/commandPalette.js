/* ==========================================================================
   COMMANDPALETTE.JS — Ctrl/Cmd+K quick navigation & actions.
   Injects its own DOM (overlay + panel) so index.html stays uncluttered;
   only the small nav trigger pill lives in the markup.
   ========================================================================== */

import { qs } from './utilities.js';
import { showToast } from './toast.js';

const COMMANDS = [
  { group: 'Navigate', icon: '👤', label: 'About', hint: 'Section', action: () => scrollToId('about') },
  { group: 'Navigate', icon: '💼', label: 'Experience', hint: 'Section', action: () => scrollToId('experience') },
  { group: 'Navigate', icon: '🚀', label: 'Projects', hint: 'Section', action: () => scrollToId('projects') },
  { group: 'Navigate', icon: '🛠️', label: 'Skills', hint: 'Section', action: () => scrollToId('skills') },
  { group: 'Navigate', icon: '🏆', label: 'Achievements', hint: 'Section', action: () => scrollToId('achievements') },
  { group: 'Navigate', icon: '📬', label: 'Contact', hint: 'Section', action: () => scrollToId('contact') },

  { group: 'Actions', icon: '🌓', label: 'Toggle theme', hint: 'Light / Dark', action: () => qs('#theme-toggle')?.click() },
  { group: 'Actions', icon: '📄', label: 'Download resume', hint: 'PDF', action: () => qs('#resume-link')?.click() },
  {
    group: 'Actions', icon: '✉️', label: 'Copy email address', hint: 'quantxcoder@gmail.com',
    action: () => copyToClipboard('quantxcoder@gmail.com', 'Email copied to clipboard.'),
  },
  {
    group: 'Actions', icon: '📞', label: 'Copy phone number', hint: '+91-8081513780',
    action: () => copyToClipboard('+91-8081513780', 'Phone number copied to clipboard.'),
  },

  { group: 'Links', icon: '🔗', label: 'Open GitHub', hint: 'github.com', action: () => window.open('https://github.com/shivamjigkp', '_blank') },
  { group: 'Links', icon: '🔗', label: 'Open LinkedIn', hint: 'linkedin.com', action: () => window.open('https://linkedin.com/in/shivam-gupta-05209a27b', '_blank') },
  { group: 'Links', icon: '🔗', label: 'Open YouTube channel', hint: 'youtube.com', action: () => window.open('https://www.youtube.com/@Mastermindtraderindia', '_blank') },
];

function scrollToId(id) {
  qs(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function copyToClipboard(text, message) {
  navigator.clipboard?.writeText(text).then(() => {
    showToast({ type: 'success', message });
  }).catch(() => {
    showToast({ type: 'error', message: 'Could not copy — please copy it manually.' });
  });
}

export function initCommandPalette() {
  const overlay = document.createElement('div');
  overlay.className = 'cmdk-overlay';
  overlay.innerHTML = `
    <div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="Command palette">
      <div class="cmdk-input-row">
        <span class="cmdk-input-icon">⌕</span>
        <input class="cmdk-input" type="text" placeholder="Jump to a section or run a command…" autocomplete="off" spellcheck="false">
        <span class="cmdk-esc">Esc</span>
      </div>
      <div class="cmdk-list"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const panel = overlay.querySelector('.cmdk-panel');
  const input = overlay.querySelector('.cmdk-input');
  const list = overlay.querySelector('.cmdk-list');

  let activeIndex = 0;
  let visibleCommands = [];
  let lastFocused = null;

  function render(query = '') {
    const q = query.trim().toLowerCase();
    visibleCommands = COMMANDS.filter((c) => c.label.toLowerCase().includes(q));
    activeIndex = 0;

    if (!visibleCommands.length) {
      list.innerHTML = `<div class="cmdk-empty">No matching commands.</div>`;
      return;
    }

    let html = '';
    let currentGroup = '';
    visibleCommands.forEach((cmd, i) => {
      if (cmd.group !== currentGroup) {
        currentGroup = cmd.group;
        html += `<div class="cmdk-group-label">${currentGroup}</div>`;
      }
      html += `
        <div class="cmdk-item${i === activeIndex ? ' is-active' : ''}" data-index="${i}">
          <span class="cmdk-item-icon">${cmd.icon}</span>
          <span class="cmdk-item-label">${cmd.label}</span>
          <span class="cmdk-item-hint">${cmd.hint}</span>
        </div>
      `;
    });
    list.innerHTML = html;
  }

  function setActive(index) {
    const items = list.querySelectorAll('.cmdk-item');
    if (!items.length) return;
    activeIndex = (index + items.length) % items.length;
    items.forEach((el, i) => el.classList.toggle('is-active', i === activeIndex));
    items[activeIndex].scrollIntoView({ block: 'nearest' });
  }

  function runActive() {
    const cmd = visibleCommands[activeIndex];
    if (cmd) {
      close();
      cmd.action();
    }
  }

  function open() {
    lastFocused = document.activeElement;
    overlay.classList.add('is-open');
    render('');
    input.value = '';
    setTimeout(() => input.focus(), 30);
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    overlay.classList.remove('is-open');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(activeIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(activeIndex - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runActive();
    }
  }

  input.addEventListener('input', () => render(input.value));
  list.addEventListener('click', (e) => {
    const item = e.target.closest('.cmdk-item');
    if (!item) return;
    activeIndex = Number(item.dataset.index);
    runActive();
  });
  overlay.addEventListener('mousedown', (e) => {
    if (e.target === overlay) close();
  });
  panel.addEventListener('mousedown', (e) => e.stopPropagation());

  // Global open shortcut: Ctrl/Cmd + K
  document.addEventListener('keydown', (e) => {
    if (typeof e.key !== 'string') return;
    const isK = e.key.toLowerCase() === 'k';
    if ((e.metaKey || e.ctrlKey) && isK) {
      e.preventDefault();
      overlay.classList.contains('is-open') ? close() : open();
    }
  });

  // Nav pill trigger
  qs('#cmdk-open')?.addEventListener('click', open);
}
