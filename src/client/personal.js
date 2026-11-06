/**
 * Personal side (Persona 3 Reload–inspired) client.
 * Loaded after main.js, which already handles page transitions and reveals.
 *
 *  1. ClipDirector: background clips with over-use prevention
 *  2. Keyboard control: ↑↓ / ←→ move, Enter confirms, Esc goes back
 *  3. Resume tabs (ARIA tabs pattern)
 *  4. Pause/play control for the background video (WCAG 2.2.2)
 */

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = navigator.connection?.saveData === true;
const store = {
  get(k, fallback) { try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } },
};

/* 1. ClipDirector -----------------------------------------------------------
 * Over-use prevention:
 *  - every page has its own pool (src/content/clips.js)
 *  - play counts persist across pages in localStorage ('p3r:plays')
 *  - next clip = least-played in the pool, never the one just shown
 *    (even across page loads, via 'p3r:last'), random among ties
 *  - each clip plays once, then hands over, so loops never repeat one clip
 *  - counts are normalised so they don't grow forever
 */
class ClipDirector {
  constructor(stage) {
    this.stage = stage;
    this.pool = stage.dataset.clips.split(',').filter(Boolean);
    this.base = stage.dataset.clipBase;
    this.poster = stage.querySelector('.p3-stage__poster');
    this.videos = [...stage.querySelectorAll('video')];
    this.front = 0;
    this.current = null;
    this.paused = store.get('p3r:paused', false);
  }

  pick(exclude = []) {
    const plays = store.get('p3r:plays', {});
    const last = store.get('p3r:last', null);
    const avoid = new Set([...exclude, last].filter(Boolean));
    let candidates = this.pool.filter((id) => !avoid.has(id));
    if (!candidates.length) candidates = this.pool.filter((id) => id !== this.current);
    if (!candidates.length) candidates = this.pool;
    const min = Math.min(...candidates.map((id) => plays[id] || 0));
    const least = candidates.filter((id) => (plays[id] || 0) === min);
    return least[Math.floor(Math.random() * least.length)];
  }

  record(id) {
    const plays = store.get('p3r:plays', {});
    plays[id] = (plays[id] || 0) + 1;
    const floor = Math.min(...Object.values(plays));
    if (floor > 50) for (const k in plays) plays[k] -= floor; // keep numbers small
    store.set('p3r:plays', plays);
    store.set('p3r:last', id);
  }

  showPoster(id) {
    this.poster.src = `${this.base}${id}.jpg`;
  }

  start() {
    const first = this.pick();
    this.showPoster(first);
    if (reduceMotion || saveData) { root.classList.add('js-nomotion'); this.record(first); return; }
    this.videos.forEach((v) => {
      v.addEventListener('ended', () => { if (v === this.videos[this.front]) this.next(); });
    });
    document.addEventListener('visibilitychange', () => {
      const v = this.videos[this.front];
      if (document.hidden) v.pause(); else if (!this.paused) v.play().catch(() => {});
    });
    this.load(this.videos[this.front], first, true);
  }

  load(video, id, show) {
    video.preload = 'auto';
    video.src = `${this.base}${id}.mp4`;
    video.poster = `${this.base}${id}.jpg`;
    if (!show) { video.load(); return; }
    this.current = id;
    this.record(id);
    const go = () => {
      video.classList.add('is-on');
      if (!this.paused) video.play().catch(() => {});
      // Preload the next clip into the hidden video while this one plays.
      const standby = this.videos[1 - this.front];
      standby.dataset.clip = this.pick([id]);
      this.load(standby, standby.dataset.clip, false);
    };
    if (video.readyState >= 2) go(); else video.addEventListener('loadeddata', go, { once: true });
  }

  next() {
    const outgoing = this.videos[this.front];
    this.front = 1 - this.front;
    const incoming = this.videos[this.front];
    const id = incoming.dataset.clip || this.pick([this.current]);
    this.current = id;
    this.record(id);
    this.showPoster(id);
    const go = () => {
      incoming.currentTime = 0;
      if (!this.paused) incoming.play().catch(() => {});
      incoming.classList.add('is-on');
      outgoing.classList.remove('is-on');
      setTimeout(() => {
        outgoing.pause();
        outgoing.dataset.clip = this.pick([id]);
        this.load(outgoing, outgoing.dataset.clip, false);
      }, 750);
    };
    if (incoming.readyState >= 2) go(); else incoming.addEventListener('loadeddata', go, { once: true });
  }

  setPaused(paused) {
    this.paused = paused;
    store.set('p3r:paused', paused);
    const v = this.videos[this.front];
    if (paused) v.pause(); else v.play().catch(() => {});
  }
}

const stage = document.querySelector('.p3-stage');
const director = stage ? new ClipDirector(stage) : null;
director?.start();

/* 4. Pause / play ---------------------------------------------------------- */
const motionBtn = document.querySelector('[data-motion-toggle]');
if (motionBtn && director) {
  const sync = () => motionBtn.setAttribute('aria-pressed', String(director.paused));
  motionBtn.addEventListener('click', () => { director.setPaused(!director.paused); sync(); });
  sync();
}

/* 2. Keyboard -------------------------------------------------------------- */
// Roving focus for menu / request / party lists: arrows move, Enter follows.
document.querySelectorAll('[data-roving]').forEach((list) => {
  const links = [...list.querySelectorAll('a')];
  if (!links.length) return;
  const isMenu = !!list.closest('.p3-menu');
  let idx = 0;
  const activate = (i, focus = true) => {
    idx = (i + links.length) % links.length;
    links.forEach((a, j) => a.classList.toggle('is-active', j === idx));
    if (focus) links[idx].focus({ preventScroll: !isMenu ? false : true });
  };
  links.forEach((a, i) => {
    a.addEventListener('mouseenter', () => activate(i, false));
    a.addEventListener('focus', () => activate(i, false));
  });
  // The menu opens with the first item highlighted, as in the game.
  if (isMenu) setTimeout(() => activate(0, false), 700);

  document.addEventListener('keydown', (e) => {
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.getAttribute('role') === 'tab') return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); activate(idx + 1); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); activate(idx - 1); }
    else if (e.key === 'Enter' && document.activeElement === document.body) { links[idx].click(); }
  });
});

// Esc → back to the Persona menu (sub-pages only).
const back = document.querySelector('[data-esc-back]');
if (back) document.addEventListener('keydown', (e) => { if (e.key === 'Escape') back.click(); });

/* 3. Resume tabs ----------------------------------------------------------- */
document.querySelectorAll('[data-tabs]').forEach((wrap) => {
  const tabs = [...wrap.querySelectorAll('[role="tab"]')];
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls'))?.toggleAttribute('data-hidden', !on);
    });
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t, false));
    t.addEventListener('keydown', (e) => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in keys) { e.preventDefault(); select(tabs[(i + keys[e.key] + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); select(tabs.at(-1), true); }
    });
  });
});
