/**
 * Client enhancements. The page is complete without JavaScript; this adds:
 *  - theme toggle (persisted, respects prefers-color-scheme by default)
 *  - live local-time clock in the utility bar
 *  - active-section highlighting in the dock
 *  - copy-email button
 *  - scroll reveal (disabled under prefers-reduced-motion)
 */

const root = document.documentElement;
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

/* Theme ------------------------------------------------------------------ */
const systemDark = matchMedia('(prefers-color-scheme: dark)');
const effectiveTheme = () => root.dataset.theme || (systemDark.matches ? 'dark' : 'light');

function syncThemeButtons() {
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(effectiveTheme() === 'dark'));
  });
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-theme-toggle]')) return;
  const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  store.set('theme', next);
  syncThemeButtons();
});
systemDark.addEventListener('change', syncThemeButtons);
syncThemeButtons();

/* Clock ------------------------------------------------------------------ */
document.querySelectorAll('[data-clock]').forEach((el) => {
  const fmt = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric', minute: '2-digit', timeZone: el.dataset.tz, timeZoneName: 'short',
  });
  const tick = () => {
    const now = new Date();
    el.textContent = fmt.format(now);
    el.dateTime = now.toISOString();
  };
  tick();
  setInterval(tick, 30_000);
});

/* Copy email ------------------------------------------------------------- */
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  const label = btn.querySelector('[data-copy-label]');
  try {
    await navigator.clipboard.writeText(btn.dataset.copy);
    label.textContent = 'Copied';
  } catch {
    label.textContent = 'Press ⌘/Ctrl+C';
  }
  setTimeout(() => { label.textContent = 'Copy email'; }, 1800);
});

/* Active section in dock ------------------------------------------------- */
const navLinks = new Map(
  [...document.querySelectorAll('[data-nav]')].map((a) => [a.dataset.nav, a]),
);
if (navLinks.size && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.removeAttribute('aria-current'));
      navLinks.get(entry.target.id)?.setAttribute('aria-current', 'true');
    });
    edges();
  }, { rootMargin: '-45% 0px -45% 0px' });
  navLinks.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });

  // At the very top/bottom the middle band can miss the first/last section.
  const ids = [...navLinks.keys()]
    .filter((id) => document.getElementById(id))
    .sort((a, b) => document.getElementById(a).offsetTop - document.getElementById(b).offsetTop);
  function edges() {
    const atTop = scrollY < 40;
    const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 40;
    if (!atTop && !atBottom) return;
    navLinks.forEach((a) => a.removeAttribute('aria-current'));
    navLinks.get(atTop ? ids[0] : ids.at(-1))?.setAttribute('aria-current', 'true');
  }
  addEventListener('scroll', () => requestAnimationFrame(edges), { passive: true });
  setTimeout(edges, 0);
}

/* Reveal on scroll ------------------------------------------------------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');
if (!reduce && 'IntersectionObserver' in window) {
  root.classList.add('js-reveal');
  const ro = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); ro.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  reveals.forEach((el) => ro.observe(el));
}

/* Document 4 — Personal mode toggle (inactive) ----------------------------
 * The toggle is plain links (see src/components/modeToggle.js), so it needs
 * no JS to work. If you want to remember the visitor's last mode, uncomment:
 *
 * document.addEventListener('click', (e) => {
 *   const link = e.target.closest('[data-mode]');
 *   if (link) store.set('mode', link.dataset.mode);
 * });
 */
