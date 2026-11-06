/**
 * Professional / Personal segmented toggle — Document 4.
 * ---------------------------------------------------------------------------
 * INACTIVE. The site ships Professional mode only. The whole component is
 * commented out so nothing about Personal mode reaches production.
 *
 * To enable it, follow personal/README.md, then uncomment below and the
 * import + call in utilityBar.js.
 *
 * The toggle is a pair of real links rather than a JS-only switch, so it
 * works without JavaScript and each mode has its own crawlable URL:
 *   - Folder strategy: Professional = "/", Personal = "/personal/"
 *   - Branch strategy: Personal = process.env.PERSONAL_URL (a separate Vercel deployment)
 */

// import { html } from '../lib/html.js';
//
// const PERSONAL_HREF = process.env.PERSONAL_URL || '/personal/';
// const PROFESSIONAL_HREF = process.env.PROFESSIONAL_URL || '/';
//
// export default function modeToggle({ current = 'professional' } = {}) {
//   const item = (mode, label, href) => html`
//     <a class="segmented__item" href="${href}" data-mode="${mode}"
//        ${current === mode ? html`aria-current="page"` : ''}>${label}</a>`;
//
//   return html`
//     <nav class="segmented" aria-label="Site mode">
//       ${item('professional', 'Professional', PROFESSIONAL_HREF)}
//       ${item('personal', 'Personal', PERSONAL_HREF)}
//     </nav>`;
// }

export default function modeToggle() {
  return '';
}
