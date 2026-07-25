website link : https://portfolio-pi-lyart-oxllegc7ux.vercel.app

# Shivam Gupta — Portfolio

A single-page, dependency-free portfolio site (plain HTML/CSS/JS, ES modules — no build step, no framework).

**Live sections:** Hero · Stats · About · Experience · Projects · Skills · Achievements · Contact

---

## Running locally

The site uses `<script type="module">`, which browsers block from loading over `file://`. You **must** serve it over a local HTTP server — don't just double-click `index.html`.

**Option A — Python (already on most machines):**
```bash
cd site
python -m http.server 8000
```
Then open `http://localhost:8000`.

**Option B — VS Code:**
Install the **Live Server** extension → right-click `index.html` → "Open with Live Server".

---

## Project structure

```
site/
├── index.html                 # single page, all sections
├── resume.pdf
├── assets/
│   └── images/profile.jpg
└── src/
    ├── styles/                # loaded in cascade order in index.html <head>
    │   ├── variables.css      # design tokens (colors, radii, shadows) — light + dark theme
    │   ├── globals.css        # reset, base typography, layout shell
    │   ├── buttons.css
    │   ├── navbar.css
    │   ├── hero.css
    │   ├── stats.css
    │   ├── about.css
    │   ├── experience.css     # timeline, incl. expandable "stack used" tags
    │   ├── projects.css
    │   ├── skills.css
    │   ├── achievements.css
    │   ├── contact.css        # dark "spotlight" quick-contact card
    │   ├── contact-form.css   # the message form next to it
    │   ├── command-palette.css# Ctrl/Cmd+K palette
    │   ├── cursor.css         # custom cursor (fine-pointer devices only)
    │   ├── toast.css          # shared notification component
    │   ├── loader.css         # branded loading screen
    │   ├── footer.css
    │   ├── animations.css     # keyframes + .reveal scroll-in utility
    │   └── responsive.css     # small cross-component mobile tweaks
    └── js/
        ├── main.js            # entry point — imports & inits every module
        ├── utilities.js       # qs/qsa helpers, reduceMotion flag
        ├── theme.js           # dark/light toggle, persisted in localStorage
        ├── navbar.js          # mobile hamburger menu
        ├── scrollReveal.js    # IntersectionObserver fade-up-on-scroll, staggered
        ├── activeNav.js       # scroll-spy nav highlighting
        ├── countUp.js         # animated stat counters
        ├── backToTop.js       # floating back-to-top button
        ├── timeline.js        # expandable experience items + active-dot pulse
        ├── contactForm.js     # validation + submit handler (see below)
        ├── toast.js           # shared toast notification utility
        ├── commandPalette.js  # Ctrl/Cmd+K palette logic + commands
        ├── cursor.js          # custom cursor (dot + trailing ring)
        ├── easterEgg.js       # console greeting + Konami code
        └── loader.js          # hides the loading screen once ready
```

Every stylesheet and script is scoped to one concern — nothing is imported that isn't used, and `main.js` is the only script tag in `index.html`.

---

## Features

- **Dark/Light theme**, saved in `localStorage`, defaults to system preference.
- **Ctrl/Cmd + K command palette** — jump to any section, toggle theme, download resume, copy email/phone, open social links. Also reachable via the pill button in the nav.
- **Custom cursor** (dot + trailing ring) on mouse/trackpad devices only — untouched on touchscreens.
- **Branded loading screen** — brief, minimum-visible-time animation on first load.
- **Animated stat counters** and **scroll-reveal** animations (staggered when multiple cards enter together), all disabled automatically if the visitor has `prefers-reduced-motion` on.
- **Interactive timeline** — each experience item expands to show a "stack used" tag row; the in-view item's dot pulses.
- **Contact form** with client-side validation and a honeypot spam trap (see next section for backend wiring).
- **Easter egg** — a console greeting for anyone who opens devtools, and the Konami code (`↑ ↑ ↓ ↓ ← → ← → B A`) reveals a small toast.

---

## Contact form → Supabase

The form (`#contact-form` in `index.html`, logic in `src/js/contactForm.js`) currently **does not send data anywhere** — it validates, shows a loading state, then resolves a mock promise so the full UI/UX is testable without a backend. Look for `submitToBackend()` in `contactForm.js`.

To connect it to Supabase:

1. **Create a Supabase project** (free tier is enough) at [supabase.com](https://supabase.com).
2. **Create a table**, e.g. `contacts`:
   ```sql
   create table contacts (
     id uuid primary key default gen_random_uuid(),
     created_at timestamptz default now(),
     name text not null,
     email text not null,
     phone text,
     message text not null
   );
   ```
3. **Enable Row Level Security** and add an insert-only policy so the public key can submit but never read:
   ```sql
   alter table contacts enable row level security;

   create policy "Allow public insert"
     on contacts for insert
     to anon
     with check (true);
   -- No select/update/delete policy is added, so the anon key can never read rows.
   ```
4. **Add the Supabase client.** Install via CDN (no bundler needed) or npm — simplest is an ES-module CDN import in a new `src/js/supabaseClient.js`:
   ```js
   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

   export const supabase = createClient(
     'YOUR_SUPABASE_PROJECT_URL',
     'YOUR_SUPABASE_ANON_PUBLIC_KEY'
   );
   ```
5. **Replace `submitToBackend()`** in `contactForm.js` with:
   ```js
   import { supabase } from './supabaseClient.js';

   async function submitToBackend(data) {
     const { error } = await supabase.from('contacts').insert([data]);
     if (error) throw error;
   }
   ```
   Nothing else in `contactForm.js` needs to change — validation, the honeypot check, and all UI states already work against this function.

**Never commit or expose the `service_role` key** — only the `anon public` key belongs in frontend code, and it's safe to expose as long as RLS is enabled as above.

---

## Deployment

Any static host works — Vercel, Netlify, GitHub Pages, Cloudflare Pages. Deploy the `site/` folder as the project root; no build command is required.
