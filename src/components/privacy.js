import { html } from '../lib/html.js';

/**
 * Privacy notice: a professionally structured placeholder.
 * The site has a contact form, so a notice is warranted even for a personal
 * portfolio. Review it, fill in the TODOs, and have it checked if you rely on
 * it. This template is not legal advice.
 */
export function privacyBlock({ site }) {
  const updated = 'November 5, 2026'; // update when you change this page
  const S = (id, title, body) => html`
    <section class="legal__section" aria-labelledby="${id}">
      <h2 id="${id}">${title}</h2>
      ${body}
    </section>`;

  return html`
<article class="legal" data-ink="dark">
  <header class="legal__head">
    <p class="legal__kicker">Privacy notice</p>
    <h1 class="lead lead--xl">How this site handles your information.</h1>
    <p class="legal__meta">Last updated ${updated}</p>
  </header>

  ${S('p-who', '1. Who is responsible', html`
    <p>This website (<a href="${site.url}">${site.url.replace(/^https?:\/\//, '')}</a>) is the personal portfolio of ${site.name} (“I”, “me”), a student. I am responsible for the personal information described here. You can reach me at <a href="mailto:${site.email}">${site.email}</a>, the only contact address I publish.</p>`)}

  ${S('p-what', '2. What I collect', html`
    <ul>
      <li><strong>Contact form.</strong> When you send a message, I receive the name, email address and message you enter.</li>
      <li><strong>Technical data.</strong> My hosting provider automatically processes standard request data (IP address, browser type, pages requested, time) to deliver the site and keep it secure.</li>
      <li><strong>Local preferences.</strong> The site stores a few small, non-tracking values in your browser: whether a page transition is in progress, and on the Personal side, which background clips you’ve seen (so they rotate evenly) and whether you paused the video. These never leave your device.</li>
    </ul>
    <p>This site does not use advertising, analytics or tracking cookies.</p>`)}

  ${S('p-why', '3. Why I use it', html`
    <ul>
      <li>To read and reply to your message. The legal basis is my legitimate interest in responding, or steps you asked for before a possible engagement.</li>
      <li>To protect the site against spam and abuse. The legal basis is legitimate interest.</li>
    </ul>
    <p>I do not sell your information or use it for marketing.</p>`)}

  ${S('p-share', '4. Service providers', html`
    <p>I rely on a few providers that process data on my behalf:</p>
    <ul>
      <li><strong>Vercel Inc.</strong>: website hosting and serverless functions.</li>
      <li><strong>Resend</strong>: forwards contact-form messages to my inbox.</li>
      <li><strong>Cloudflare, Inc.</strong> (only if Turnstile is enabled): bot protection on the contact form.</li>
    </ul>
    <p>These providers may process data outside your country under appropriate safeguards.</p>`)}

  ${S('p-keep', '5. How long I keep it', html`
    <p>I keep messages only as long as needed to handle your enquiry and any follow-up, and at most 24 months, unless we start working together. Hosting logs are kept according to the provider’s retention policy.</p>`)}

  ${S('p-rights', '6. Your choices and rights', html`
    <p>Depending on where you live (for example under the GDPR, UK GDPR or California law), you may have the right to access, correct, delete or restrict use of your information, and to object or complain to a supervisory authority. To make a request, email <a href="mailto:${site.email}">${site.email}</a>.</p>`)}

  ${S('p-kids', '7. Children', html`
    <p>This site is not directed at children under 13 (or the minimum age in your country), and I do not knowingly collect their information.</p>`)}

  ${S('p-changes', '8. Changes', html`
    <p>If I change this notice, I will update the date at the top of this page.</p>`)}
</article>`;
}
