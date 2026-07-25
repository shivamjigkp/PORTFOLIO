/* ==========================================================================
   TOAST.JS — tiny shared notification utility.
   Lazily creates a single stack container and appends toasts to it.
   Used by the contact form (submit result) and the easter egg (reveal).
   ========================================================================== */

let stack;

function getStack() {
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    stack.setAttribute('aria-live', 'polite');
    document.body.appendChild(stack);
  }
  return stack;
}

/**
 * @param {Object} opts
 * @param {'success'|'error'|'info'} [opts.type]
 * @param {string} [opts.icon]
 * @param {string} [opts.title]
 * @param {string} opts.message
 * @param {number} [opts.duration] ms before auto-dismiss
 */
export function showToast({ type = 'info', icon, title, message, duration = 4200 }) {
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  const defaultIcon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : '💬';
  el.innerHTML = `
    <span class="toast-icon">${icon || defaultIcon}</span>
    <span class="toast-body">
      ${title ? `<span class="toast-title">${title}</span><br>` : ''}${message}
    </span>
  `;
  getStack().appendChild(el);

  requestAnimationFrame(() => el.classList.add('is-visible'));

  const remove = () => {
    el.classList.remove('is-visible');
    setTimeout(() => el.remove(), 320);
  };
  setTimeout(remove, duration);
  el.addEventListener('click', remove);
}
