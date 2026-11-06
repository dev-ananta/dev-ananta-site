import { html, raw, extAttrs, ordered } from '../lib/html.js';

/* ── Nav bar ───────────────────────────────────────────────────────────────
 * Reference: a thin row at the top of every page (logo left, links right).
 * Inverted: fixed to the bottom of the viewport. Its ink colour follows
 * whichever section sits under it (client/main.js → [data-ink]).
 * Targets are 44px tall even though the type is small (Fitts's Law).
 */
export function navBar({ site, nav, path, inv }) {
  return html`
<nav class="navbar ${inv ? 'navbar--bottom' : 'navbar--top'}" aria-label="Primary" data-navbar>
  <a class="navbar__logo" href="/">${site.logo}</a>
  <ul class="navbar__links">
    ${nav.map((n) => html`<li><a href="${n.href}"${n.href === path ? raw(' aria-current="page"') : ''}>${n.label}</a></li>`)}
  </ul>
</nav>`;
}

/* ── Footer ────────────────────────────────────────────────────────────────
 * Reference: white, two right-aligned link columns, then a giant
 * "20*26" year whose digits roll into place like an odometer.
 * Inverted: it opens every page. The year comes first, then the columns.
 */
export function footer({ site, nav, content, inv }) {
  const yy = String(site.year);
  const [a, b] = [yy.slice(0, 2), yy.slice(2)];

  const year = html`
  <p class="year" aria-label="${yy}">
    <span aria-hidden="true">${odo(a)}<span class="year__star">${asterisk()}</span>${odo(b)}</span>
  </p>`;

  const cols = html`
  <div class="footer__cols">
    <ul class="footer__col">
      ${nav.map((n) => html`<li><a href="${n.href}">${n.label}</a></li>`)}
      <li class="footer__fine"><a href="/privacy">Privacy</a></li>
    </ul>
    <ul class="footer__col">
      <li><a href="mailto:${site.email}">${site.email}</a></li>
      ${content.socials.map((s) => html`<li><a href="${s.href}"${extAttrs(s.href)}>${s.label}</a></li>`)}
      <li class="footer__fine">© ${site.year} ${site.name}</li>
    </ul>
  </div>`;

  return html`
<footer class="footer ${inv ? 'footer--top' : ''}" data-ink="dark">
  ${ordered(inv, cols, year)}
</footer>`;
}

/** Odometer digits. The final digit is set by class (no inline styles, CSP-safe). */
function odo(digits) {
  return [...digits].map((d) => html`<span class="odo d-${d}" data-odo="${d}"><span class="odo__strip">${
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => html`<span>${n}</span>`)
  }</span></span>`);
}

/** Six-armed asterisk as SVG so it renders identically everywhere. */
export function asterisk(cls = '') {
  return raw(`<svg class="asterisk ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g stroke="currentColor" stroke-width="3.2" stroke-linecap="butt"><path d="M12 1.5v21"/><path d="M2.9 6.75l18.2 10.5"/><path d="M2.9 17.25l18.2-10.5"/></g></svg>`);
}

/* ── Data table ───────────────────────────────────────────────────────────
 * Four-column rows (year · name · link · tag) used for projects on Home and
 * Projects, and for roles on About. The year only shows on the first row of
 * each group, as in the reference.
 */
export function dataTable({ rows, caption, cols }) {
  return html`
<table class="dtable">
  <caption class="sr-only">${caption}</caption>
  <thead class="sr-only"><tr>${cols.map((c) => html`<th scope="col">${c}</th>`)}</tr></thead>
  <tbody>
    ${rows.map((r, i) => {
      const showYear = r.year && (i === 0 || rows[i - 1].year !== r.year);
      const groupStart = showYear && i > 0;
      return html`
    <tr${groupStart ? raw(' class="is-group"') : ''}>
      <td class="dtable__year">${showYear ? `’${r.year}` : ''}</td>
      <td class="dtable__name">${r.primary}${r.sub ? html`<span class="dtable__sub">${r.sub}</span>` : ''}</td>
      <td class="dtable__link">${r.href ? html`<a href="${r.href}"${extAttrs(r.href)}>${softBreak(r.link)}</a>` : softBreak(r.link)}</td>
      <td class="dtable__tag">${r.tag}</td>
    </tr>`;
    })}
  </tbody>
</table>`;
}

/** Lets long URLs wrap after dots instead of mid-word. */
const softBreak = (text = '') => text.split('.').map((part, i) => (i ? html`.<wbr>${part}` : html`${part}`));

export const toHref = (url) => (url && !/^https?:/.test(url) ? `https://${url}` : url);
