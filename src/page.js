import { html, raw } from './lib/html.js';
import { LAYOUT } from './config.js';

import utilityBar from './components/utilityBar.js';
import contact from './components/contact.js';
import now from './components/now.js';
import experience from './components/experience.js';
import projects from './components/projects.js';
import hero from './components/hero.js';
import dock from './components/dock.js';

/** Registry: layout slot → component. Add a section by adding one entry. */
const REGISTRY = {
  footer: utilityBar,
  contact,
  now,
  experience,
  projects,
  hero,
  nav: dock,
};

/** Resolves the final top→bottom order according to Document 2. */
export function resolveOrder(layout = LAYOUT) {
  return layout.invert ? [...layout.base].reverse() : [...layout.base];
}

export function renderBody({ content, site, layout = LAYOUT }) {
  const order = resolveOrder(layout);
  const last = order.length - 1;

  // Chrome (nav/footer) renders outside <main>; content sections inside.
  const chrome = { top: '', bottom: '' };
  const sections = [];

  order.forEach((slot, i) => {
    const edge = i === 0 ? 'top' : i === last ? 'bottom' : null;
    const out = REGISTRY[slot]({ content, site, edge, inverted: layout.invert });
    if (edge) chrome[edge] = out;
    else sections.push(out);
  });

  return html`
<a class="skip-link" href="#main">Skip to content</a>
${chrome.top}
<main id="main" tabindex="-1">
${sections}
</main>
${chrome.bottom}`;
}

export function renderDocument({ content, site, layout, path = '/', title, body }) {
  const pageTitle = title || `${site.name} / (${site.role})`;
  const canonical = new URL(path, site.url).href;
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.role,
    url: site.url,
    sameAs: content.socials.map((s) => s.href),
  }).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="${site.locale.split('-')[0]}" data-layout="${layout?.invert === false ? 'standard' : 'inverted'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${pageTitle}</title>
  <meta name="description" content="${site.description}">
  <link rel="canonical" href="${canonical}">
  <meta name="theme-color" content="#fafaf9" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0b0d0c" media="(prefers-color-scheme: dark)">
  <meta name="color-scheme" content="light dark">

  <meta property="og:type" content="website">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${site.description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${new URL('/og.png', site.url).href}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css">

  <!-- Apply saved theme before first paint to avoid a flash. -->
  <script>try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
  <script type="application/ld+json">${jsonLd}</script>
  <script type="module" src="/main.js" defer></script>
</head>
<body>
${body ?? raw(renderBody({ content, site, layout }))}
</body>
</html>
`;
}
