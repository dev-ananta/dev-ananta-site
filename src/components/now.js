import { html } from '../lib/html.js';

export default function now({ content }) {
  return html`
<section class="section reveal" id="now" aria-labelledby="now-h">
  <div class="wrap">
    <h2 class="label" id="now-h">(Now)</h2>
    <ul class="now-list">
      ${content.now.map((item) => html`<li>${item}</li>`)}
    </ul>
  </div>
</section>`;
}
