import { html, ordered } from '../lib/html.js';
import { asterisk, dataTable, toHref } from './shared.js';

/* Home blocks. The reference order is:
 *   hero (red, sticky) → statement (dark, slides over hero) → photo
 *   (dissolves into white) → work preview (white)
 * page.js reverses that list when inverted.
 */

/** Full-viewport brand-colour hero. Reference: meta row on top, giant name at
 *  the bottom. Inverted: giant name on top, meta row at the bottom. The hero
 *  sticks to the viewport edge, so the neighbouring dark section slides over it
 *  (reference) or pulls away to reveal it (inverted). */
export function hero({ site, content, inv }) {
  const meta = html`
  <div class="hero__meta">
    <p class="hero__role">${site.role}</p>
    <div class="hero__intro">
      <p>${content.home.intro}</p>
      ${asterisk('asterisk--spin hero__star')}
    </div>
    <p class="hero__loc">${site.location.map((l) => html`<span>${l}</span>`)}</p>
  </div>`;
  const name = html`<h1 class="hero__name">${site.name}</h1>`;

  return html`
<section class="hero ${inv ? 'hero--inv' : ''}" data-ink="dark" aria-label="Introduction">
  ${ordered(inv, meta, name)}
</section>`;
}

export function statement({ content }) {
  return html`
<section class="statement" data-ink="light">
  <p class="statement__text reveal">${content.home.statement}</p>
</section>`;
}

/** Full-bleed photo. A canvas grid of squares dissolves it into the white
 *  section next to it: below it in the reference, above it when inverted. */
export function photo({ content, inv }) {
  const p = content.home.photo;
  return html`
<section class="photo" data-ink="light" data-dissolve="${inv ? 'top' : 'bottom'}">
  <img src="${p.src}" alt="${p.alt}" width="1200" height="1500" loading="lazy" decoding="async">
  <canvas class="photo__dissolve" aria-hidden="true"></canvas>
</section>`;
}

export function workPreview({ content, inv }) {
  const w = content.home.work;
  const rows = content.projects.items.filter((p) => p.featured).map((p) => ({
    year: p.year, primary: p.name, link: p.url, href: toHref(p.url), tag: p.category,
  }));
  const lead = html`
  <div class="work__lead">
    <h2 class="lead reveal">${w.lead}</h2>
    <a class="pill" href="${w.cta.href}">${w.cta.label}</a>
  </div>`;
  const table = html`<div class="reveal">${dataTable({ rows, caption: 'Selected projects', cols: ['Year', 'Project', 'Link', 'Type'] })}</div>`;
  const grid = html`<div class="work__grid" aria-hidden="true"></div>`;

  return html`
<section class="work" data-ink="dark" aria-label="Selected work">
  ${ordered(inv, grid, lead, table)}
</section>`;
}
