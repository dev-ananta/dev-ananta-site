import { html, extAttrs } from '../lib/html.js';
import { sun, moon } from './icons.js';
// import modeToggle from './modeToggle.js'; // Document 4 — Personal mode (inactive)

/**
 * The reference site's FOOTER: copyright, local time, socials, theme switch.
 * Inverted layout (Document 2) moves it to the top as a slim utility bar.
 * The same component renders as a classic footer when LAYOUT.invert is false.
 */
export default function utilityBar({ content, site, edge }) {
  const Tag = edge === 'top' ? 'header' : 'footer';
  return html`
<${Tag} class="utility utility--${edge}" id="footer">
  <div class="wrap utility__inner">
    <p class="utility__id">
      <a href="/" class="utility__name">${site.name}</a>
      <span class="muted">© ${site.year}</span>
    </p>

    <p class="utility__time muted mono" aria-label="Local time">
      <span class="dot" aria-hidden="true"></span>
      <time data-clock data-tz="${site.timezone}">--:--</time>
    </p>

    <nav class="utility__social" aria-label="Social profiles">
      ${content.socials.map((s) => html`<a href="${s.href}"${extAttrs(s.href)}>${s.label}</a>`)}
    </nav>

    <div class="utility__controls">
      ${'' /* modeToggle({ current: 'professional' }) — Document 4, keep commented until Personal ships */}
      <button class="icon-btn" type="button" data-theme-toggle aria-label="Toggle color theme" aria-pressed="false">
        <span class="theme-icon theme-icon--light">${sun(16)}</span>
        <span class="theme-icon theme-icon--dark">${moon(16)}</span>
      </button>
    </div>
  </div>
</${Tag}>`;
}
