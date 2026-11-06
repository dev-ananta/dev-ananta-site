import { html } from '../lib/html.js';

/**
 * Identity block. In the reference it opens the page. With the inverted
 * layout it closes the page, just above the dock, as a sign-off. It keeps
 * the page's only <h1>, so heading semantics hold whatever the order.
 */
export default function hero({ content, site }) {
  const h = content.hero;
  return html`
<section class="section hero reveal" id="about" aria-labelledby="hero-h">
  <div class="wrap">
    <p class="eyebrow"><span class="dot dot--live" aria-hidden="true"></span>${h.eyebrow}</p>
    <h1 class="hero__name" id="hero-h">${site.name} <span class="hero__role">/ (${site.role})</span></h1>
    <p class="hero__headline">${h.headline}</p>
    ${h.bio.map((p) => html`<p class="hero__bio muted">${p}</p>`)}
    <a class="link-accent" href="${h.cta.href}">${h.cta.label} →</a>
  </div>
</section>`;
}
