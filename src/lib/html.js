/**
 * Tiny, dependency-free HTML templating with auto-escaping.
 *
 *   html`<p>${userText}</p>`  → interpolated values are escaped
 *   html`<ul>${items.map(i => html`<li>${i}</li>`)}</ul>` → nested templates are trusted
 */

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ESC[c]);

class Raw {
  constructor(value) { this.value = value; }
  toString() { return this.value; }
}

export const raw = (value) => new Raw(String(value));

const fmt = (v) => {
  if (v === null || v === undefined || v === false) return '';
  if (Array.isArray(v)) return v.map(fmt).join('');
  if (v instanceof Raw) return v.value;
  return esc(v);
};

export function html(strings, ...values) {
  let out = '';
  strings.forEach((str, i) => {
    out += str;
    if (i < values.length) out += fmt(values[i]);
  });
  return new Raw(out);
}

/**
 * Document 2 helper: returns the parts in reading order, reversed when the
 * layout is inverted. Used both for page-level block order and for the
 * top/bottom arrangement inside a block, so DOM order always matches what
 * you see.
 */
export const ordered = (inverted, ...parts) => (inverted ? parts.reverse() : parts);

/** Returns true for links that leave the site, so we can add rel/target safely. */
export const isExternal = (href = '') => /^https?:\/\//.test(href);

export const extAttrs = (href) =>
  isExternal(href) ? raw(' target="_blank" rel="noopener noreferrer"') : '';
