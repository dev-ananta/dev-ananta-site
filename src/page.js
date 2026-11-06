import { html, raw } from './lib/html.js';
import { SITE, NAV, LAYOUT } from './config.js';
import { navBar, footer } from './components/shared.js';
import * as home from './components/home.js';
import * as about from './components/about.js';
import * as projects from './components/projects.js';
import { contactBlock } from './components/contact.js';
import { privacyBlock } from './components/privacy.js';

/**
 * Page definitions in REFERENCE order (top → bottom), excluding the shared
 * chrome. renderBody() wraps each list as [nav, ...blocks, footer] and
 * reverses the whole stack when LAYOUT.invert is on (Document 2).
 *
 * `theme` sets the page background (matches the reference per page) and
 * `themeColor` sets the mobile browser chrome.
 */
/** Inline pre-paint script. If you edit it, update its sha256 in vercel.json. */
export const PREPAINT = "document.documentElement.classList.add('js');try{if(sessionStorage.getItem('pt'))document.documentElement.classList.add('pt-in')}catch(e){}";

export const PAGES = [
  {
    path: '/', out: 'index.html', title: null, theme: 'home', themeColor: '#00d65b',
    blocks: [home.hero, home.statement, home.photo, home.workPreview],
  },
  {
    path: '/about', out: 'about.html', title: 'About', theme: 'about', themeColor: '#c9ecf4',
    blocks: [about.intro, about.statements],
  },
  {
    path: '/projects', out: 'projects.html', title: 'Projects', theme: 'projects', themeColor: '#000000',
    blocks: [projects.intro, projects.grid, projects.table],
  },
  {
    path: '/contact', out: 'contact.html', title: 'Work with me', theme: 'contact', themeColor: '#bfbfbf',
    blocks: [contactBlock],
  },
  {
    path: '/privacy', out: 'privacy.html', title: 'Privacy', theme: 'legal', themeColor: '#ffffff',
    blocks: [privacyBlock],
  },
];

export function renderBody(page, { content, site = SITE, layout = LAYOUT, nav = NAV }) {
  const inv = layout.invert;
  const ctx = { site, content, nav, inv, path: page.path };

  const blocks = page.blocks.map((b) => b(ctx));
  const stack = inv ? [footer(ctx), ...blocks.reverse()] : [...blocks, footer(ctx)];
  const bar = navBar(ctx);

  return html`
<a class="skip-link" href="#main">Skip to content</a>
<div class="pt" aria-hidden="true" data-pt>${raw('<i></i>'.repeat(10))}</div>
${inv ? '' : bar}
<main id="main" tabindex="-1">
${stack}
</main>
${inv ? bar : ''}`;
}

export function renderDocument(page, { content, site = SITE, layout = LAYOUT, body } = {}) {
  const pageTitle = page.title ? `${page.title} · ${site.name}` : `${site.name} / (${site.role})`;
  const canonical = new URL(page.path, site.url).href;
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.role,
    url: site.url,
    sameAs: content.socials.map((s) => s.href),
  }).replace(/</g, '\\u003c');
  const needsTurnstile = page.path === '/contact' && site.turnstileSiteKey;

  return `<!doctype html>
<html lang="${site.locale.split('-')[0]}" data-layout="${layout.invert ? 'inverted' : 'standard'}" data-theme="${page.theme}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${pageTitle}</title>
  <meta name="description" content="${site.description}">
  <link rel="canonical" href="${canonical}">
  <meta name="theme-color" content="${page.themeColor}">

  <meta property="og:type" content="website">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${site.description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${new URL('/og.png', site.url).href}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/fonts/InterDisplay-Medium.woff" as="font" type="font/woff" crossorigin>
  <link rel="stylesheet" href="/styles.css">
  <!-- Pre-paint: flag JS + continue a page transition. Allowed by its CSP hash (see README). -->
  <script>${PREPAINT}</script>
  <script type="application/ld+json">${jsonLd}</script>
  <script type="module" src="/main.js"></script>${needsTurnstile ? '\n  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : ''}
</head>
<body>
${body ?? raw(renderBody(page, { content, site, layout }))}
</body>
</html>
`;
}
