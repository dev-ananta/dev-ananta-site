import { raw } from '../lib/html.js';

/* Inline SVG icons. All are decorative (aria-hidden); the controls that use
   them always carry their own accessible label. */

const svg = (path, size = 16) =>
  raw(`<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`);

export const arrowUpRight = (s) => svg('<path d="M7 17 17 7M8 7h9v9"/>', s);
export const arrowDown = (s) => svg('<path d="M12 5v14M5 12l7 7 7-7"/>', s);
export const sun = (s) => svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', s);
export const moon = (s) => svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>', s);
export const mail = (s) => svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>', s);
export const copy = (s) => svg('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>', s);
