#!/usr/bin/env node
/**
 * Zero-dependency dev server: builds, serves dist/ on http://localhost:3000,
 * and rebuilds when src/ or public/ change (refresh the browser to see edits).
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 3000;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
};

await build();

// Mirror vercel.json's global headers (CSP etc.) so local testing matches production.
const vercelHeaders = Object.fromEntries(
  (JSON.parse(await readFile(join(ROOT, 'vercel.json'), 'utf8')).headers || [])
    .filter((h) => h.source === '/(.*)')
    .flatMap((h) => h.headers.map(({ key, value }) => [key, value]))
    .filter(([k]) => k !== 'Strict-Transport-Security'),
);

let timer;
for (const dir of ['src', 'public']) {
  watch(join(ROOT, dir), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => build().catch((e) => console.error(e.message)), 80);
  });
}

createServer(async (req, res) => {
  if (req.url.startsWith('/api/')) {
    // Serverless functions run on Vercel (use `vercel dev` to emulate them locally).
    res.writeHead(503, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: false, error: 'API runs on Vercel. Use `vercel dev` locally' }));
  }
  const url = new URL(req.url, 'http://x');
  let p = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(DIST, p);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
  } catch {
    file = join(DIST, p + '.html'); // emulate Vercel cleanUrls
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { ...vercelHeaders, 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404, { ...vercelHeaders, 'Content-Type': TYPES['.html'] });
    res.end(await readFile(join(DIST, '404.html')));
  }
}).listen(PORT, () => console.log(`→ http://localhost:${PORT}`));
