---
name: testing-p-productions-site
description: Test the !P | PRODUCTIONS Discord bots site end-to-end (landing page, Google login, admin panel). Use when verifying UI or Firebase changes in this repo.
---

# Testing the !P | PRODUCTIONS site

## Setup
- Requires Node >= 20.19 (Vite 8). If the default node is older, use `source ~/.nvm/nvm.sh && nvm use 22`.
- `npm install`, then `npm run dev` starts the site at http://localhost:5173.
- Verify with `npm run build` and `npm run lint` (oxlint) — both should pass with no errors (only fast-refresh warnings).

## Firebase environment
- Project: `smart-applications-6ced1` (config hardcoded in `src/lib/firebase.ts`).
- Cloud Firestore might be disabled in the project (check with `curl "https://firestore.googleapis.com/v1/projects/smart-applications-6ced1/databases/(default)/documents/settings/site"` — a 403 means disabled). If disabled, admin CRUD cannot be tested end-to-end; the public site still works with fallback texts.
- Google login completion requires the owner's Google account and cannot be automated. You can still verify that clicking "Continuar com o Google" opens the real Google popup pointing at `smart-applications-6ced1.firebaseapp.com`, and that closing it shows the inline error (no browser alert).
- Admin access: `/admin` is restricted to `OWNER_EMAIL` in `src/lib/firebase.ts` plus emails in the `adminEmails` array of the Firestore doc `settings/site`. Logged out, `/admin` must redirect to `/login`.

## What to test
1. Landing page (`/`): hero with !P logo, gradient title, "Ver Planos"/"Nossos Bots" CTAs; Bots and Plans sections render Firestore data or fallback texts without crashing.
2. `/termos`: two cards (Termos de Serviço, Política de Privacidade) with content from `settings/site` or fallback.
3. `/login`: Google popup flow as described above.
4. `/admin`: route protection; with an admin account, CRUD tabs for Bots, Planos, Termos, Configurações.

## Gotchas
- The managed Chrome (CDP on port 29229) might not be running; the `google-chrome` wrapper in `~/.local/bin` only talks to that port. Workaround: install Chrome (`wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && sudo apt-get install -y ./google-chrome-stable_current_amd64.deb`) and launch with `DISPLAY=:0 /opt/google/chrome/chrome --remote-debugging-port=29229 --user-data-dir=/home/ubuntu/.chrome-profile <url>`.
- Data reads use `onSnapshot`; with Firestore disabled the listeners fail silently and fallback UI is shown — this is expected, not a bug.

## Devin Secrets Needed
- None currently (Firebase web config is public in the repo). Full admin-panel testing would require the owner to log in interactively or a test Google account credential.
