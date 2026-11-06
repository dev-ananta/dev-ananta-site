# Personal mode (inactive)

This folder holds the **Personal** variant of the site. It is scaffolded but
**not wired in**: every hook that would load it is commented out, so the
production build is Professional mode only.

There are two ways to turn it on later. Pick one.

## Option A: folder (same branch)

1. Fill in `personal/content.js`. It must export the same shape as
   `src/content/professional.js`.
2. Uncomment the `SITE_MODE` lines in:
   - `src/config.js` (`MODE.current`)
   - `scripts/build.mjs` (the content loader)
   - `src/components/modeToggle.js`, rendered from `navBar()` in `src/components/shared.js`
   - the toggle handler in `src/client/main.js`
3. Build both variants:
   ```bash
   npm run build                      # professional → dist/
   SITE_MODE=personal npm run build   # personal → dist/personal/
   ```
   The toggle then links between `/` and `/personal/`.

## Option B: branch

1. Create a `personal` branch: `git checkout -b personal`.
2. On that branch, edit `src/content/professional.js` directly, or set
   `SITE_MODE=personal` in that branch's Vercel environment.
3. Vercel deploys every branch automatically. Give the `personal` branch a
   domain such as `personal.dev-ananta.vercel.app` (Project → Settings →
   Domains → assign to branch).
4. Uncomment the toggle and set `PERSONAL_URL` in `.env` so it links across
   the two deployments.
