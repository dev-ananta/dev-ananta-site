import { html, raw } from '../lib/html.js';
import { MODE } from '../config.js';

/**
 * Professional / Personal toggle — Document 4 (now active).
 * Plain links, so it works without JavaScript and each side has its own URL.
 * Rendered in the professional footer. The personal menu has its own
 * "TO PROFESSIONAL" exit.
 */
export default function modeToggle({ current = 'professional' } = {}) {
  if (!MODE.personal) return '';
  const item = (mode, label, href) =>
    html`<a class="segmented__item" href="${href}" data-mode="${mode}"${current === mode ? raw(' aria-current="page"') : ''}>${label}</a>`;
  return html`
    <nav class="segmented footer__mode" aria-label="Site side">
      ${item('professional', 'Professional', MODE.professionalHref)}
      ${item('personal', 'Personal', MODE.personalHref)}
    </nav>`;
}
