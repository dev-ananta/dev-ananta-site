#!/usr/bin/env node
/**
 * Static build. No dependencies, Node 18+.
 *   src/** + public/**  →  dist/
 *
 * Output: one HTML file per page (index, about, projects, contact, privacy),
 * 404.html, styles.css (concatenated), main.js, and public/ copied as-is.
 * Vercel's cleanUrls serves /about from about.html.
 */
import { mkdir, readFile, writeFile, cp, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'dist');

// Cache-bust imports so `npm run dev` picks up edits on rebuild.
// (Only the entry modules are re-imported. Restart dev after editing components.)
const load = async (rel) => import(`${pathToFileURL(join(SRC, rel)).href}?t=${Date.now()}`);

export async function build({ quiet = false } = {}) {
  const t0 = performance.now();
  const { MODE } = await load('config.js');
  const { PAGES, renderDocument, PERSONAL_PAGES, renderPersonalDocument } = await load('page.js');
  const { html } = await load('lib/html.js');

  const content = (await load('content/professional.js')).default;
  const outDir = OUT;
  await rm(OUT, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  for (const page of PAGES) {
    await writeFile(join(outDir, page.out), renderDocument(page, { content }));
  }

  /* ── Document 4: Personal side (folder strategy → /personal/*) ───────── */
  if (MODE.personal) {
    const personal = (await load('content/personal.js')).default;
    await mkdir(join(OUT, 'personal'), { recursive: true });
    for (const page of PERSONAL_PAGES) {
      await writeFile(join(OUT, page.out), renderPersonalDocument(page, { content: personal }));
    }
    const pcss = ['tokens.css', 'base.css', 'motion.css', 'personal.css'];
    await writeFile(join(OUT, 'personal.css'),
      (await Promise.all(pcss.map((f) => readFile(join(SRC, 'styles', f), 'utf8')))).join('\n'));
    await cp(join(SRC, 'client', 'personal.js'), join(OUT, 'personal.js'));
  }

  const notFound = { path: '/404', title: 'Not found', theme: 'legal', themeColor: '#ffffff' };
  await writeFile(join(outDir, '404.html'), renderDocument(notFound, {
    content,
    body: html`
<a class="skip-link" href="#main">Skip to content</a>
<main id="main" class="notfound" data-ink="dark">
  <p class="legal__kicker">404</p>
  <h1 class="display">This page wandered off.</h1>
  <a class="pill pill--lg" href="/">Back home</a>
</main>`,
  }));

  // Styles: concatenate in cascade order → one request.
  const order = ['tokens.css', 'base.css', 'layout.css', 'components.css', 'motion.css'];
  const css = (await Promise.all(order.map((f) => readFile(join(SRC, 'styles', f), 'utf8')))).join('\n');
  await writeFile(join(OUT, 'styles.css'), css);

  await cp(join(SRC, 'client', 'main.js'), join(OUT, 'main.js'));
  if (existsSync(join(ROOT, 'public'))) await cp(join(ROOT, 'public'), OUT, { recursive: true });

  if (!quiet) {
    const files = await readdir(OUT);
    const n = PAGES.length + (MODE.personal ? PERSONAL_PAGES.length : 0);
    console.log(`✓ built ${n} pages (${files.length} entries) → dist/ in ${Math.round(performance.now() - t0)}ms`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  build().catch((err) => { console.error(err); process.exit(1); });
}
