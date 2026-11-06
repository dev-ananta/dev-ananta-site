import { html } from '../lib/html.js';
import { dataTable, toHref } from './shared.js';

/** Black viewport intro. The headline sits at the bottom (reference) or the
 *  top (inverted). The flex direction comes from the --inv modifier, and the
 *  block has a single child, so DOM order needs no change. */
export function intro({ content, inv }) {
  return html`
<section class="projects-intro ${inv ? 'projects-intro--inv' : ''}" data-ink="light">
  <h1 class="display projects__headline">${content.projects.headline}</h1>
</section>`;
}

export function grid({ content }) {
  return html`
<section class="pgrid" data-ink="light" aria-label="Project gallery">
  <ul class="pgrid__list">
    ${content.projects.items.map((p) => html`
    <li class="pgrid__item reveal">
      <a href="${toHref(p.url)}" target="_blank" rel="noopener noreferrer">
        <span class="pgrid__label">${p.name}</span>
        <img src="${p.image}" alt="" width="600" height="${p.featured ? 750 : 560}" loading="lazy" decoding="async">
      </a>
    </li>`)}
  </ul>
</section>`;
}

export function table({ content }) {
  const rows = content.projects.items.map((p) => ({
    year: p.year, primary: p.name, link: p.url, href: toHref(p.url), tag: p.category,
  }));
  return html`
<section class="ptable" data-ink="light" aria-label="All projects">
  <div class="reveal">${dataTable({ rows, caption: 'All projects', cols: ['Year', 'Project', 'Link', 'Type'] })}</div>
</section>`;
}
