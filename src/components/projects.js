import { html, extAttrs } from '../lib/html.js';
import { arrowUpRight } from './icons.js';

/**
 * Card grid. The whole card is one link, so the hit area is the full card
 * (Fitts's Law) rather than a small "view" text link.
 */
export default function projects({ content }) {
  return html`
<section class="section reveal" id="projects" aria-labelledby="projects-h">
  <div class="wrap">
    <h2 class="label" id="projects-h">(Selected work)</h2>
    <ul class="cards">
      ${content.projects.map((p, i) => {
        const inner = html`
          <div class="card__top">
            <span class="card__index mono muted">${String(i + 1).padStart(2, '0')}</span>
            ${p.year ? html`<span class="mono muted">${p.year}</span>` : ''}
          </div>
          <h3 class="card__title">${p.title}${p.href ? html` <span class="card__arrow">${arrowUpRight(14)}</span>` : ''}</h3>
          <p class="card__blurb muted">${p.blurb}</p>
          ${p.tags?.length ? html`<ul class="tags" aria-label="Technologies">${p.tags.map((t) => html`<li>${t}</li>`)}</ul>` : ''}`;
        return html`<li>${p.href
          ? html`<a class="card" href="${p.href}"${extAttrs(p.href)}>${inner}</a>`
          : html`<div class="card">${inner}</div>`}</li>`;
      })}
    </ul>
  </div>
</section>`;
}
