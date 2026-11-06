#!/usr/bin/env node
/**
 * Static build. No dependencies, Node 18+.
 *   src/** + public/**  →  dist/
 *
 * Output: dist/index.html, dist/404.html, dist/styles.css (concatenated),
 * dist/main.js, and every file in public/ copied as-is.
 */
import { mkdir, readFile, writeFile, cp, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'dist');

// Cache-bust imports so `npm run dev` picks up edits on rebuild.
const load = async (rel) => (await import(`${pathToFileURL(join(SRC, rel)).href}?t=${Date.now()}`));

export async function build({ quiet = false } = {}) {
  const t0 = performance.now();
  const { SITE, LAYOUT, MODE } = await load('config.js');
  const { renderDocument } = await load('page.js');
  const { html } = await load('lib/html.js');

  /* ── Document 4: content source by mode ───────────────────────────────
   * Professional is the only active mode. To enable Personal, uncomment
   * the block below (see personal/README.md).
   */
  const content = (await load('content/professional.js')).default;
  let outDir = OUT;
  // if (MODE.current === 'personal') {
  //   const personal = (await import(pathToFileURL(join(ROOT, 'personal/content.js')).href)).default;
  //   if (!personal) throw new Error('personal/content.js is empty — fill it in before building Personal mode.');
  //   content = personal;          // (change `const content` above to `let`)
  //   outDir = join(OUT, 'personal'); // folder strategy → served at /personal/
  // }
  void MODE;

  if (outDir === OUT) await rm(OUT, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  // Pages
  await writeFile(join(outDir, 'index.html'), renderDocument({ content, site: SITE, layout: LAYOUT }));

  const notFound = html`
<a class="skip-link" href="#main">Skip to content</a>
<main id="main" class="notfound">
  <div class="wrap">
    <p class="label mono">(404)</p>
    <h1 class="hero__name">This page wandered off.</h1>
    <p class="muted">The link may be old, or the page may have moved.</p>
    <a class="btn btn--primary" href="/">Back home</a>
  </div>
</main>`;
  await writeFile(join(outDir, '404.html'),
    renderDocument({ content, site: SITE, layout: LAYOUT, path: '/404', title: `Not found · ${SITE.name}`, body: notFound }));

  // Styles: concatenate in cascade order into one request.
  const order = ['tokens.css', 'base.css', 'layout.css', 'components.css'];
  const css = (await Promise.all(order.map((f) => readFile(join(SRC, 'styles', f), 'utf8')))).join('\n');
  await writeFile(join(OUT, 'styles.css'), css);

  // Client script + static assets
  await cp(join(SRC, 'client', 'main.js'), join(OUT, 'main.js'));
  if (existsSync(join(ROOT, 'public'))) await cp(join(ROOT, 'public'), OUT, { recursive: true });

  if (!quiet) {
    const files = await readdir(OUT);
    console.log(`✓ built ${files.length} entries → dist/ in ${Math.round(performance.now() - t0)}ms`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  build().catch((err) => { console.error(err); process.exit(1); });
}
