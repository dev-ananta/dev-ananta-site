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
import { PAGES, PREPAINT, PERSONAL_PAGES } from '../src/page.js';
import { MODE } from '../src/config.js';
import { CLIPS, POOLS, CLIP_BASE } from '../src/content/clips.js';

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

/* Personal side */
if (MODE.personal) {
  for (const page of PERSONAL_PAGES) {
    const html = await readFile(join(DIST, page.out), 'utf8').catch(() => { fail.push(`missing dist/${page.out}`); return ''; });
    const tag = `${page.out}:`;
    const h1s = html.match(/<h1\b/g)?.length ?? 0;
    if (h1s !== 1) fail.push(`${tag} expected 1 <h1>, found ${h1s}`);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    if (dupes.length) fail.push(`${tag} duplicate ids: ${dupes.join(', ')}`);
    if (/\sstyle="/.test(html)) fail.push(`${tag} inline style attribute (blocked by CSP)`);
  }
  // Clip library: every clip exists, is in at least two pools, and no pool is empty.
  const uses = {};
  for (const [name, pool] of Object.entries(POOLS)) {
    if (!pool.length) fail.push(`clip pool "${name}" is empty`);
    for (const id of pool) { uses[id] = (uses[id] || 0) + 1; if (!CLIPS[id]) fail.push(`pool "${name}" uses unknown clip "${id}"`); }
  }
  for (const id of Object.keys(CLIPS)) {
    if ((uses[id] || 0) < 2) fail.push(`clip "${id}" is in fewer than 2 pools`);
    for (const ext of ['mp4', 'jpg']) await access(join(DIST, CLIP_BASE, `${id}.${ext}`)).catch(() => fail.push(`missing clip file ${id}.${ext}`));
  }
}

/* Privacy guard (owner is a minor): no phone numbers, street addresses,
   personal/school emails or school names anywhere in the output. */
{
  const { readdir } = await import('node:fs/promises');
  const walk = async (d) => (await Promise.all((await readdir(d, { withFileTypes: true })).map((e) =>
    e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]))).flat();
  const files = (await walk(DIST)).filter((f) => /\.(html|js|css|txt|xml)$/.test(f));
  const banned = [
    [/\(?\b630\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/, 'phone number'],
    [/anantparikh014|aparikh1@|bsd220\.org/i, 'non-public email'],
    [/galloway|60192|hoffman estates/i, 'home address/town'],
    [/barrington high|bhs\b|prairie|barbara rose|schaumburg christian/i, 'school name'],
    [/_aparikh1/i, 'personal Instagram'],
  ];
  for (const f of files) {
    const text = await readFile(f, 'utf8');
    for (const [re, what] of banned) if (re.test(text)) fail.push(`${f.replace(DIST, 'dist')}: contains ${what}`);
  }
  const emails = new Set((await Promise.all(files.map((f) => readFile(f, 'utf8')))).join('\n').match(/[\w.+-]+@[\w-]+\.[\w.]+/g) || []);
  for (const e of emails) if (!['ananta.dev@proton.me', 'you@example.com', 'onboarding@resend.dev'].includes(e)) fail.push(`unexpected email in output: ${e}`);
}

const hash = `sha256-${createHash('sha256').update(PREPAINT).digest('base64')}`;
const vercel = await readFile(join(ROOT, 'vercel.json'), 'utf8');
if (!vercel.includes(hash)) fail.push(`vercel.json CSP is missing the pre-paint hash '${hash}'`);

if (fail.length) {
  console.error('✗ check failed:\n  - ' + fail.join('\n  - '));
  process.exit(1);
}
console.log(`✓ checks passed (${PAGES.length} professional + ${MODE.personal ? PERSONAL_PAGES.length : 0} personal pages, privacy guard clean)`);
