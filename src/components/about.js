import { html, raw, ordered } from '../lib/html.js';
import { dataTable, toHref } from './shared.js';

/** Viewport-high intro. Reference: dash-field graphic at the top right, big
 *  headline at the bottom. Inverted: headline on top, graphic at the bottom. */
export function intro({ content, inv }) {
  const field = html`<div class="about__field">${dashField()}</div>`;
  const head = html`<h1 class="display about__headline">${content.about.headline}</h1>`;
  return html`
<section class="about-intro ${inv ? 'about-intro--inv' : ''}" data-ink="dark">
  ${ordered(inv, field, head)}
</section>`;
}

/** Alternating left/right statements with an experience table in the middle. */
export function statements({ content, inv }) {
  const items = content.about.statements.map((s) => {
    if (s.type === 'experience') {
      const rows = content.about.experience.map((e) => ({
        year: e.year, primary: e.role, sub: e.org, link: e.url, href: toHref(e.url), tag: e.period,
      }));
      return html`<li class="about__row about__row--table reveal">${dataTable({ rows, caption: 'Experience', cols: ['Year', 'Role', 'Link', 'Dates'] })}</li>`;
    }
    return html`<li class="about__row about__row--${s.align} reveal"><p class="lead">${s.text}</p></li>`;
  });
  return html`
<section class="about-list" data-ink="dark" aria-label="About me">
  <ul>${ordered(inv, ...items)}</ul>
</section>`;
}

/**
 * Static SVG of short dashes arranged as a swirl (7×7 grid). It's rendered
 * at build time so it shows without JavaScript; client/main.js then animates
 * each dash toward the pointer.
 */
function dashField(n = 7, size = 140) {
  const step = size / n;
  const c = (n - 1) / 2;
  let lines = '';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const cx = step * (x + 0.5);
      const cy = step * (y + 0.5);
      const ang = (Math.atan2(y - c, x - c) * 180) / Math.PI + 90; // tangent → swirl
      lines += `<line x1="${(cx - step * 0.3).toFixed(1)}" y1="${cy.toFixed(1)}" x2="${(cx + step * 0.3).toFixed(1)}" y2="${cy.toFixed(1)}" transform="rotate(${ang.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})" data-cx="${cx.toFixed(1)}" data-cy="${cy.toFixed(1)}"/>`;
    }
  }
  return raw(`<svg class="dashfield" viewBox="0 0 ${size} ${size}" aria-hidden="true" focusable="false" data-dashfield><g stroke="currentColor" stroke-width="2.4" stroke-linecap="butt">${lines}</g></svg>`);
}
