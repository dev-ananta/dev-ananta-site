/**
 * Professional / Personal toggle — Document 4.
 * ---------------------------------------------------------------------------
 * INACTIVE. The site ships Professional mode only. To enable it, follow
 * personal/README.md, uncomment this component, and render it inside
 * navBar() in src/components/shared.js (next to the logo).
 *
 * It's a pair of real links rather than a JS switch, so it works without
 * JavaScript and each mode has its own URL:
 *   - Folder strategy: Professional = "/", Personal = "/personal/"
 *   - Branch strategy: Personal = process.env.PERSONAL_URL (separate deployment)
 */

// import { html, raw } from '../lib/html.js';
//
// const PERSONAL_HREF = process.env.PERSONAL_URL || '/personal/';
// const PROFESSIONAL_HREF = process.env.PROFESSIONAL_URL || '/';
//
// export default function modeToggle({ current = 'professional' } = {}) {
//   const item = (mode, label, href) =>
//     html`<a class="segmented__item" href="${href}" data-mode="${mode}"${current === mode ? raw(' aria-current="page"') : ''}>${label}</a>`;
//   return html`
//     <nav class="segmented" aria-label="Site mode">
//       ${item('professional', 'Professional', PROFESSIONAL_HREF)}
//       ${item('personal', 'Personal', PERSONAL_HREF)}
//     </nav>`;
// }

export default function modeToggle() {
  return '';
}
