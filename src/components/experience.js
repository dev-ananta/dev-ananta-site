import { html, extAttrs } from '../lib/html.js';

export default function experience({ content }) {
  return html`
<section class="section reveal" id="experience" aria-labelledby="experience-h">
  <div class="wrap">
    <h2 class="label" id="experience-h">(Experience)</h2>
    <ol class="rows">
      ${content.experience.map((e) => html`
      <li class="row">
        <span class="row__main">${e.role}</span>
        <span class="row__org muted">${e.href ? html`<a href="${e.href}"${extAttrs(e.href)}>${e.org}</a>` : e.org}</span>
        <span class="row__meta muted mono">${e.period}</span>
      </li>`)}
    </ol>
  </div>
</section>`;
}
