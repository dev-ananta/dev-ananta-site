/**
 * Site configuration — identity, layout inversion, colours and mode.
 * Read at BUILD time by scripts/build.mjs; the output is static HTML.
 */

export const SITE = {
  name: 'Anant Parikh',
  logo: 'dev-ananta',
  role: 'Student Software Engineer',
  url: process.env.SITE_URL || 'https://dev-ananta.vercel.app',
  description: 'Anant Parikh (Ananta): high school student software engineer. Full-stack apps, FIRST Robotics software and a student nonprofit.',
  locale: 'en-US',
  // Privacy: the owner is a minor. Only region-level location and one
  // public email are ever published. No school name, address, phone or grades.
  location: ['Midwest', 'United States'],
  email: 'ananta.dev@proton.me',
  year: new Date().getFullYear(),
  // Cloudflare Turnstile is optional. Leave empty to skip the widget.
  turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || '',
};

/** Primary navigation (shared by the nav bar and the footer columns). */
export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Work with me' },
];

/**
 * LAYOUT — Document 2 (Format)
 * ---------------------------------------------------------------------------
 * Every page in the reference is a vertical stack of blocks:
 *
 *   header/nav → hero → …content… → footer (links + giant "20*26")
 *
 * With `invert: true`, each page's stack is reversed, and so is the internal
 * top/bottom arrangement of each block:
 *  - the footer (giant year first, then link columns) opens every page
 *  - the header becomes a fixed bottom nav bar (thumb zone, Fitts's Law)
 *  - each hero puts its big headline at the top of the viewport and its
 *    small meta row at the bottom
 *
 * DOM order always matches visual order, so reading and tab order stay
 * correct. Set `invert: false` to get the reference arrangement back.
 */
export const LAYOUT = { invert: true };

/**
 * THEME — Document 3 (Colors)
 * The reference's signature red (#ff0000) is now green. The value lives in
 * src/styles/tokens.css (--brand), and every place that used red reads it.
 */

/**
 * MODE — Document 4 (Professional / Personal)
 * Both sides are built (folder strategy): Professional at "/", Personal
 * (Persona 3 Reload–inspired) at "/personal". The toggle lives in the footer
 * on Professional and in the menu on Personal. Set `personal: false` to ship
 * Professional only.
 */
export const MODE = {
  personal: process.env.SITE_PERSONAL !== 'off',
  professionalHref: '/',
  personalHref: '/personal',
};
