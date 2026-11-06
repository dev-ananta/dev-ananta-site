import { html, raw, ordered } from '../lib/html.js';

/** Grey page. Reference: headline at the top, form lower right.
 *  Inverted: form at the top, headline at the bottom. */
export function contactBlock({ site, content, inv }) {
  const c = content.contact;
  const f = c.fields;

  const head = html`<h1 class="lead lead--xl contact__headline">${c.headline}</h1>`;

  const form = html`
  <form class="cform" method="post" action="/api/contact" data-contact novalidate>
    <label class="cform__field">
      <span class="cform__label">${f.name.label}</span>
      <input name="name" type="text" autocomplete="name" placeholder="${f.name.placeholder}" required maxlength="120">
    </label>
    <label class="cform__field">
      <span class="cform__label">${f.email.label}</span>
      <input name="email" type="email" autocomplete="email" inputmode="email" placeholder="${f.email.placeholder}" required maxlength="200">
    </label>
    <label class="cform__field">
      <span class="cform__label">${f.message.label}</span>
      <textarea name="message" rows="3" placeholder="${f.message.placeholder}" required maxlength="5000"></textarea>
    </label>

    <!-- Honeypot: hidden from people, tempting to bots. -->
    <div class="hp" aria-hidden="true">
      <label>Company <input name="company" type="text" tabindex="-1" autocomplete="off"></label>
    </div>

    <div class="cform__actions">
      ${site.turnstileSiteKey
        ? raw(`<div class="cf-turnstile" data-sitekey="${site.turnstileSiteKey}" data-theme="light"></div>`)
        : ''}
      <button class="pill pill--lg" type="submit">${c.submit}</button>
    </div>
    <p class="cform__status" role="status" aria-live="polite" data-status></p>
    <p class="cform__msg" id="sent">Thanks, your message is on its way.</p>
    <p class="cform__msg" id="error">Something went wrong. Please email ${site.email} instead.</p>
    <p class="cform__fine">Your details are used only to reply to you. See the <a href="/privacy">privacy notice</a>.</p>
  </form>`;

  return html`
<section class="contact ${inv ? 'contact--inv' : ''}" data-ink="dark">
  ${ordered(inv, head, form)}
</section>`;
}
