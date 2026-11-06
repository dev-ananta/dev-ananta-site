/**
 * Site configuration — the single place to change identity, layout and mode.
 *
 * Everything here is read at BUILD time by scripts/build.mjs, so the shipped
 * site is plain static HTML (fast first paint, crawlable, no client framework).
 */

export const SITE = {
  name: 'Anant Parikh',
  shortName: 'Ananta',
  role: 'Developer',            // rendered as "(Developer)", design-engineer style
  handle: 'dev-ananta',
  url: process.env.SITE_URL || 'https://dev-ananta.vercel.app',
  description: 'Anant Parikh — developer building thoughtful, fast, accessible software.',
  locale: 'en-US',
  timezone: 'America/Chicago',  // drives the live local-time readout in the utility bar
  email: 'hello@example.com',   // TODO: replace with your public contact address
  year: new Date().getFullYear(),
};

/**
 * LAYOUT — Document 2 (Format)
 * ---------------------------------------------------------------------------
 * `base` is the reference order, reverse-engineered top → bottom:
 *
 *   nav → hero → projects → experience → now → contact → footer
 *
 * With `invert: true`, the order flips. What sat at the bottom moves to the
 * top and vice versa:
 *
 *   footer (utility bar) → contact → now → experience → projects → hero → nav (dock)
 *
 * The nav becomes a fixed bottom dock. That suits Fitts's Law: on phones it
 * sits in the thumb zone and makes a large, stable target. The old footer
 * becomes a slim top utility bar (copyright, local time, socials, theme).
 *
 * Set `invert: false` to restore the reference order without touching any
 * component code.
 */
export const LAYOUT = {
  invert: true,
  base: ['nav', 'hero', 'projects', 'experience', 'now', 'contact', 'footer'],
};

/**
 * MODE — Document 4 (Professional / Personal)
 * ---------------------------------------------------------------------------
 * This codebase ships PROFESSIONAL mode only. Personal mode is scaffolded but
 * deliberately commented out. See scripts/build.mjs, src/components/modeToggle.js
 * and personal/README.md for the two supported strategies (folder or branch).
 */
export const MODE = {
  current: 'professional',
  // current: process.env.SITE_MODE === 'personal' ? 'personal' : 'professional',
};
