#!/usr/bin/env node
/**
 * Post-build checks (no dependencies). Fails CI if:
 *  - required files are missing from dist/
 *  - any page doesn't have exactly one <h1>, has duplicate ids, or an <img> without alt
 *  - the Document 2 order is wrong (inverted: footer first in <main>, nav after <main>)
 *  - the pre-paint script's CSP hash in vercel.json is stale
 */
import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LAYOUT } from '../src/config.js';
import { PAGES, PREPAINT } from '../src/page.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const fail = [];

for (const f of ['404.html', 'styles.css', 'main.js', 'favicon.svg', 'robots.txt', 'og.png', ...PAGES.map((p) => p.out)]) {
  await access(join(DIST, f)).catch(() => fail.push(`missing dist/${f}`));
}

for (const page of PAGES) {
  const html = await readFile(join(DIST, page.out), 'utf8');
  const tag = `${page.out}:`;
  const h1s = html.match(/<h1\b/g)?.length ?? 0;
  if (h1s !== 1) fail.push(`${tag} expected 1 <h1>, found ${h1s}`);
  if (/<img(?![^>]*\balt=)/.test(html)) fail.push(`${tag} <img> missing alt`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  if (dupes.length) fail.push(`${tag} duplicate ids: ${dupes.join(', ')}`);

  const main = html.indexOf('<main');
  const nav = html.indexOf('class="navbar');
  const firstBlock = html.slice(main).match(/<(footer|section|article)\b/)?.[1];
  if (LAYOUT.invert) {
    if (firstBlock !== 'footer') fail.push(`${tag} inverted layout should open <main> with the footer (got <${firstBlock}>)`);
    if (nav < main) fail.push(`${tag} inverted layout should place the nav after <main>`);
  } else if (nav > main) fail.push(`${tag} standard layout should place the nav before <main>`);
}

const hash = `sha256-${createHash('sha256').update(PREPAINT).digest('base64')}`;
const vercel = await readFile(join(ROOT, 'vercel.json'), 'utf8');
if (!vercel.includes(hash)) fail.push(`vercel.json CSP is missing the pre-paint hash '${hash}'`);

if (fail.length) {
  console.error('✗ check failed:\n  - ' + fail.join('\n  - '));
  process.exit(1);
}
console.log(`✓ checks passed (${PAGES.length} pages)`);
