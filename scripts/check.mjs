#!/usr/bin/env node
/**
 * Lightweight post-build sanity checks (no dependencies). Fails CI if:
 *  - required files are missing from dist/
 *  - the page has no / multiple <h1>
 *  - images lack alt, or there are duplicate ids
 *  - the inverted order doesn't match config
 */
import { readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LAYOUT } from '../src/config.js';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const fail = [];

for (const f of ['index.html', '404.html', 'styles.css', 'main.js', 'favicon.svg', 'robots.txt']) {
  await access(join(DIST, f)).catch(() => fail.push(`missing dist/${f}`));
}

const page = await readFile(join(DIST, 'index.html'), 'utf8');
const h1s = page.match(/<h1\b/g)?.length ?? 0;
if (h1s !== 1) fail.push(`expected exactly 1 <h1>, found ${h1s}`);
if (/<img(?![^>]*\balt=)/.test(page)) fail.push('an <img> is missing alt');

const ids = [...page.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length) fail.push(`duplicate ids: ${[...new Set(dupes)].join(', ')}`);

// Order check: first chrome element should match the configured top slot.
const top = LAYOUT.invert ? LAYOUT.base.at(-1) : LAYOUT.base[0];
const firstChrome = page.indexOf('class="utility') < page.indexOf('class="dock') ? 'footer' : 'nav';
if (firstChrome !== top) fail.push(`layout order mismatch: expected "${top}" first, got "${firstChrome}"`);

if (fail.length) {
  console.error('✗ check failed:\n  - ' + fail.join('\n  - '));
  process.exit(1);
}
console.log('✓ checks passed');
