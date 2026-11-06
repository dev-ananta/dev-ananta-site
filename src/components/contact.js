import { html } from '../lib/html.js';
import { mail, copy } from './icons.js';

export default function contact({ content, site }) {
  const c = content.contact;
  return html`
<section class="section reveal" id="contact" aria-labelledby="contact-h">
  <div class="wrap">
    <h2 class="label" id="contact-h">(Contact)</h2>
    <p class="contact__heading">${c.heading}</p>
    <p class="muted">${c.note}</p>
    <div class="contact__actions">
      <a class="btn btn--primary" href="mailto:${site.email}">${mail(16)}<span>${site.email}</span></a>
      <button class="btn btn--ghost" type="button" data-copy="${site.email}" aria-live="polite">
        ${copy(16)}<span data-copy-label>Copy email</span>
      </button>
    </div>
  </div>
</section>`;
}
