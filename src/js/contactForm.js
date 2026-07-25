/* ==========================================================================
   CONTACTFORM.JS — validates and "submits" the contact form.

   NOTE FOR LATER: this currently uses a mock submit (submitToBackend below)
   so the UI is fully testable without a backend. When Supabase is ready,
   replace ONLY the body of submitToBackend() with a real insert call, e.g.:

     import { supabase } from './supabaseClient.js';
     async function submitToBackend(data) {
       const { error } = await supabase.from('contacts').insert([data]);
       if (error) throw error;
     }

   Nothing else in this file needs to change — validation, UI states, and
   the honeypot spam check all stay the same.
   ========================================================================== */

import { qs } from './utilities.js';
import { showToast } from './toast.js';
import { supabase } from './supabaseClient.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s()-]{7,20}$/;

function setFieldError(row, message) {
  const errEl = row.querySelector('.form-error-msg');
  if (message) {
    row.classList.add('has-error');
    if (errEl) errEl.textContent = message;
  } else {
    row.classList.remove('has-error');
    if (errEl) errEl.textContent = '';
  }
}

function validate(form) {
  let firstInvalid = null;
  const values = {};

  const nameRow = form.querySelector('[data-row="name"]');
  const nameInput = form.querySelector('#contact-name');
  values.name = nameInput.value.trim();
  if (values.name.length < 2) {
    setFieldError(nameRow, 'Please enter your name.');
    firstInvalid = firstInvalid || nameInput;
  } else {
    setFieldError(nameRow, '');
  }

  const emailRow = form.querySelector('[data-row="email"]');
  const emailInput = form.querySelector('#contact-email');
  values.email = emailInput.value.trim();
  if (!EMAIL_RE.test(values.email)) {
    setFieldError(emailRow, 'Enter a valid email address.');
    firstInvalid = firstInvalid || emailInput;
  } else {
    setFieldError(emailRow, '');
  }

  const phoneRow = form.querySelector('[data-row="phone"]');
  const phoneInput = form.querySelector('#contact-phone');
  values.phone = phoneInput.value.trim();
  if (values.phone && !PHONE_RE.test(values.phone)) {
    setFieldError(phoneRow, 'Enter a valid phone number, or leave this blank.');
    firstInvalid = firstInvalid || phoneInput;
  } else {
    setFieldError(phoneRow, '');
  }

  const msgRow = form.querySelector('[data-row="message"]');
  const msgInput = form.querySelector('#contact-message');
  values.message = msgInput.value.trim();
  if (values.message.length < 10) {
    setFieldError(msgRow, 'Message should be at least 10 characters.');
    firstInvalid = firstInvalid || msgInput;
  } else {
    setFieldError(msgRow, '');
  }

  return { valid: !firstInvalid, values, firstInvalid };
}

// --- Mock backend call. Swap this out for Supabase later (see note above). ---
async function submitToBackend(data) {
  const { error } = await supabase.from('contacts').insert([data]);
  if (error) throw error;
}

export function initContactForm() {
  const form = qs('#contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('.form-submit');
  const submitLabel = submitBtn.querySelector('.form-submit-label');
  const statusEl = form.querySelector('.form-status');
  const honeypot = form.querySelector('#contact-hp');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Silent bot trap — a real visitor never fills a visually hidden field.
    if (honeypot && honeypot.value) return;

    const { valid, values, firstInvalid } = validate(form);
    if (!valid) {
      firstInvalid.focus();
      statusEl.textContent = '';
      return;
    }

    submitBtn.setAttribute('disabled', 'true');
    submitLabel.textContent = 'Sending…';
    statusEl.textContent = '';

    try {
      await submitToBackend(values);
      form.reset();
      showToast({
        type: 'success',
        title: 'Message sent',
        message: `Thanks, ${values.name.split(' ')[0]} — I'll get back to you soon.`,
      });
      statusEl.textContent = "Thanks — I'll get back to you soon.";
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Something went wrong',
        message: 'Please try again, or email me directly.',
      });
      statusEl.textContent = 'Could not send — please try again.';
    } finally {
      submitBtn.removeAttribute('disabled');
      submitLabel.textContent = 'Send Message';
    }
  });

  // Clear a field's error state as soon as the person starts fixing it.
  form.querySelectorAll('.form-input, .form-textarea').forEach((input) => {
    input.addEventListener('input', () => {
      const row = input.closest('.form-row');
      if (row) setFieldError(row, '');
    });
  });
}
