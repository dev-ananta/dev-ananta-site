import { html } from '../lib/html.js';

/**
 * Primary navigation. The reference has it as a top nav. Inverted
 * (Document 2), it becomes a fixed floating dock at the bottom of the
 * viewport.
 *  - Fitts's Law: 44px+ targets in the thumb zone, always in the same spot.
 *  - Jakob's Law: a familiar pill/segmented nav (iOS tab bar, macOS dock).
 *  - Active section is highlighted via aria-current, set in client/main.js.
 */
const LINKS = [
  { id: 'contact', label: 'Contact' },
  { id: 'now', label: 'Now' },
  { id: 'experience', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
];

export default function dock({ edge, inverted }) {
  // Keep link order matching the visual section order on the page.
  const links = inverted ? LINKS : [...LINKS].reverse();
  return html`
<nav class="dock dock--${edge}" id="nav" aria-label="Primary">
  <ul class="dock__list">
    ${links.map((l) => html`<li><a class="dock__link" href="#${l.id}" data-nav="${l.id}">${l.label}</a></li>`)}
  </ul>
</nav>`;
}
