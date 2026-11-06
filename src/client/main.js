/**
 * Client enhancements. Every page is complete without JavaScript. This adds
 * the reference's motion and interactivity:
 *   1. Striped page transitions (brand green)
 *   2. Nav-bar ink that adapts to the section beneath it
 *   3. Odometer roll on the footer year ("20*26")
 *   4. Pixel dissolve between the home photo and the white section
 *   5. Pointer-reactive dash field on About
 *   6. Scroll reveals
 *   7. Contact form submission (progressive enhancement)
 */

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const raf = (fn) => { let q = false; return () => { if (q) return; q = true; requestAnimationFrame(() => { q = false; fn(); }); }; };
const session = {
  get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* storage blocked */ } },
  del: (k) => { try { sessionStorage.removeItem(k); } catch { /* storage blocked */ } },
};

/* 1. Page transitions ------------------------------------------------------ */
const pt = document.querySelector('[data-pt]');

function revealPage() {
  session.del('pt');
  if (!root.classList.contains('pt-in') || !pt) return root.classList.remove('pt-in');
  requestAnimationFrame(() => requestAnimationFrame(() => pt.classList.add('is-reveal')));
  setTimeout(() => { root.classList.remove('pt-in'); pt.classList.remove('is-reveal'); }, 900);
}
revealPage();
// Coming back via the back/forward cache: make sure the stripes aren't stuck.
addEventListener('pageshow', (e) => { if (e.persisted && pt) { pt.classList.remove('is-cover'); root.classList.remove('pt-in'); } });

document.addEventListener('click', (e) => {
  if (reduceMotion || !pt || e.defaultPrevented || e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest('a[href]');
  if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return;
  if (url.pathname === location.pathname && (url.hash || url.search === location.search)) return;
  e.preventDefault();
  session.set('pt', '1');
  pt.classList.add('is-cover');
  setTimeout(() => { location.href = url.href; }, 560);
});

/* 2. Nav bar ink ----------------------------------------------------------- */
const navbar = document.querySelector('[data-navbar]');
if (navbar) {
  const update = () => {
    const r = navbar.getBoundingClientRect();
    const y = Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2));
    const under = document.elementsFromPoint(innerWidth / 2, y)
      .find((el) => !navbar.contains(el) && !el.closest('[data-pt]') && el.closest('[data-ink]'));
    const section = under?.closest('[data-ink]');
    if (!section) return;
    navbar.dataset.ink = section.dataset.ink;
    navbar.style.setProperty('--nav-bg', getComputedStyle(section).backgroundColor);
  };
  const onScroll = raf(update);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();
}

/* 3. Odometer -------------------------------------------------------------- */
document.querySelectorAll('.year').forEach((year) => {
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  year.classList.add('is-armed');            // park every digit on 0
  year.querySelectorAll('.odo__strip').forEach((s, i) => { s.style.transitionDelay = `${i * 110}ms`; });
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    io.disconnect();
    void year.offsetWidth;                   // commit the parked state
    year.classList.remove('is-armed');
    year.classList.add('is-rolling');        // roll to the d-N digits
  }, { threshold: 0.35 });
  io.observe(year);
});

/* 4. Pixel dissolve -------------------------------------------------------- */
document.querySelectorAll('[data-dissolve]').forEach((section) => {
  const canvas = section.querySelector('canvas');
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  const edge = section.dataset.dissolve;    // 'top' | 'bottom': where the white section is
  const fill = getComputedStyle(root).getPropertyValue('--paper').trim() || '#fff';
  let cells = [], cols = 0, rows = 0, size = 0, dpr = 1;

  const layout = () => {
    const { width, height } = section.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    cols = width < 700 ? 10 : 18;
    size = width / cols;
    rows = Math.ceil(height / size);
    cells = [];
    for (let y = 0; y < rows; y++) {
      const fromEdge = edge === 'bottom' ? (rows - 1 - y) / rows : y / rows; // 0 at the white edge
      for (let x = 0; x < cols; x++) cells.push({ x, y, t: fromEdge * 0.72 + Math.random() * 0.28 });
    }
    draw();
  };

  const coverage = () => {
    const r = section.getBoundingClientRect();
    // How far the white edge has travelled across the viewport, 0 → 1.
    const raw = edge === 'bottom' ? 1 - r.bottom / innerHeight : r.top / innerHeight;
    return Math.max(0, Math.min(1, raw * 1.15));
  };

  const draw = () => {
    const c = coverage();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (c <= 0) return;
    ctx.fillStyle = fill;
    ctx.strokeStyle = 'rgba(0,0,0,0.035)';
    ctx.lineWidth = 1;
    for (const cell of cells) {
      if (cell.t >= c) continue;
      const px = cell.x * size, py = cell.y * size;
      ctx.fillRect(px - 0.5, py - 0.5, size + 1, size + 1);
      ctx.strokeRect(px + 0.5, py + 0.5, size - 1, size - 1);
    }
  };

  const onScroll = raf(draw);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', raf(layout));
  const img = section.querySelector('img');
  if (img && !img.complete) img.addEventListener('load', layout, { once: true });
  layout();
});

/* 5. Dash field (About) ---------------------------------------------------- */
document.querySelectorAll('[data-dashfield]').forEach((svg) => {
  if (reduceMotion) return;
  const lines = [...svg.querySelectorAll('line')].map((l) => ({ el: l, cx: +l.dataset.cx, cy: +l.dataset.cy }));
  const vb = svg.viewBox.baseVal;
  let target = { x: vb.width / 2, y: vb.height / 2 };
  let pointer = null, visible = false, t0 = performance.now();

  addEventListener('pointermove', (e) => {
    const r = svg.getBoundingClientRect();
    pointer = { x: ((e.clientX - r.left) / r.width) * vb.width, y: ((e.clientY - r.top) / r.height) * vb.height };
  }, { passive: true });

  const frame = (now) => {
    if (!visible) return;
    const t = (now - t0) / 1000;
    // Idle: the swirl's centre drifts in a slow orbit. Pointer: it follows you.
    const idle = { x: vb.width / 2 + Math.cos(t * 0.6) * vb.width * 0.18, y: vb.height / 2 + Math.sin(t * 0.6) * vb.height * 0.18 };
    const goal = pointer || idle;
    target.x += (goal.x - target.x) * 0.08;
    target.y += (goal.y - target.y) * 0.08;
    for (const l of lines) {
      const ang = (Math.atan2(l.cy - target.y, l.cx - target.x) * 180) / Math.PI + 90;
      l.el.setAttribute('transform', `rotate(${ang.toFixed(1)} ${l.cx} ${l.cy})`);
    }
    requestAnimationFrame(frame);
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) requestAnimationFrame(frame);
  }).observe(svg);
});

/* 6. Scroll reveal --------------------------------------------------------- */
if ('IntersectionObserver' in window) {
  const ro = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => ro.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
}

/* 7. Contact form ---------------------------------------------------------- */
const form = document.querySelector('[data-contact]');
if (form) {
  const status = form.querySelector('[data-status]');
  const button = form.querySelector('button[type="submit"]');
  const say = (msg) => { status.textContent = msg; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let firstBad = null;
    form.querySelectorAll('input[required], textarea[required]').forEach((f) => {
      const bad = !f.checkValidity();
      f.setAttribute('aria-invalid', String(bad));
      if (bad && !firstBad) firstBad = f;
    });
    if (firstBad) { say('Please fill in every field with a valid email.'); firstBad.focus(); return; }

    button.disabled = true;
    say('Sending…');
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Request failed');
      form.reset();
      say('Thanks, your message is on its way. I’ll reply soon.');
      window.turnstile?.reset?.();
    } catch (err) {
      say(`${err.message}. You can also email me directly.`);
    } finally {
      button.disabled = false;
    }
  });
}

/* Document 4 — Personal mode (inactive) -------------------------------------
 * The toggle is plain links (src/components/modeToggle.js), so it needs no JS.
 * To remember the visitor's last mode, uncomment:
 *
 * document.addEventListener('click', (e) => {
 *   const link = e.target.closest('[data-mode]');
 *   if (link) try { localStorage.setItem('mode', link.dataset.mode); } catch {}
 * });
 */
