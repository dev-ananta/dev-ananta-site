import { html, raw, extAttrs } from '../lib/html.js';
import { CLIPS, CLIP_BASE, POOLS } from '../content/clips.js';

/*
 * Personal side: Persona 3 Reload–inspired screens.
 * Visual language is ported from the unfinished React prototype
 * (P3Menu.jsx, ResumePage.jsx, Socials.jsx, PageTransition.jsx) into
 * dependency-free, CSP-safe static HTML: no inline styles, and every
 * per-item variation is a CSS class.
 */

/* ── Shared chrome ──────────────────────────────────────────────────────── */

/** Background video stage. Two <video> elements crossfade; personal.js
 *  picks the least-shown clip from this page's pool. With no JS the poster
 *  of the first clip shows as a still. */
export function stage(poolName) {
  const pool = POOLS[poolName];
  const first = pool[0];
  return html`
<div class="p3-stage" data-clips="${pool.join(',')}" data-clip-base="${CLIP_BASE}" aria-hidden="true">
  <img class="p3-stage__poster" src="${CLIP_BASE}${first}.jpg" alt="" width="1280" height="720" decoding="async">
  <video class="p3-stage__v" muted playsinline preload="none"></video>
  <video class="p3-stage__v" muted playsinline preload="none"></video>
  <div class="p3-stage__shade p3-stage__shade--${poolName}"></div>
</div>`;
}

export function chrome({ content, back = true, hints }) {
  const keys = hints || (back
    ? [['↑↓', 'SELECT'], ['↵', 'CONFIRM'], ['ESC', 'BACK']]
    : [['↑↓', 'NAVIGATE'], ['↵', 'CONFIRM']]);
  return html`
<div class="p3-stripe" aria-hidden="true"></div>
<div class="p3-topbar">
  ${back ? html`<a class="p3-back" href="/personal" data-esc-back><span aria-hidden="true">◄</span> MENU</a>` : ''}
  <button class="p3-motion" type="button" data-motion-toggle aria-pressed="false">
    <span class="p3-motion__on">PAUSE VIDEO</span><span class="p3-motion__off">PLAY VIDEO</span>
  </button>
</div>
<footer class="p3-foot">
  <p class="p3-credit">${content.credit}</p>
  <ul class="p3-keys" aria-hidden="true">
    ${keys.map(([k, v]) => html`<li><span class="p3-key">${k}</span>${v}</li>`)}
  </ul>
</footer>`;
}

/* ── Menu (P3Menu.jsx) ─────────────────────────────────────────────────── */
export function menu({ content }) {
  return html`
<main id="main" class="p3-menu-screen" tabindex="-1">
  <p class="p3-nametag" aria-hidden="true"><span>${content.nameTag[0]}</span><span>${content.nameTag[1]}</span></p>
  <h1 class="sr-only">Ananta’s Persona: personal side of Anant Parikh’s site</h1>
  <nav class="p3-menu" aria-label="Persona menu">
    <ul data-roving>
      ${content.menu.map((m, i) => html`
      <li class="p3-item p3-item--${i + 1}">
        <a class="p3-link" href="${m.href}"${m.external ? extAttrs(m.href) : ''} aria-describedby="hint-${i + 1}">
          <span class="p3-tri" aria-hidden="true"></span>
          <span class="p3-hl" aria-hidden="true"></span>
          <span class="p3-label" data-text="${m.label}">${m.label}</span>
        </a>
        <span class="sr-only" id="hint-${i + 1}">${m.hint}</span>
      </li>`)}
    </ul>
  </nav>
  <a class="p3-mode" href="/"><span class="p3-mode__k">TO</span>PROFESSIONAL</a>
</main>`;
}

/* ── About: status screen ──────────────────────────────────────────────── */
export function about({ content }) {
  const s = content.status;
  const pips = (n, max) => raw(Array.from({ length: max }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join(''));
  return html`
<main id="main" class="p3-page p3-status" tabindex="-1">
  <header class="p3-head">
    <p class="p3-kicker">STATUS</p>
    <h1 class="p3-title">ABOUT ME</h1>
  </header>

  <div class="p3-status__grid">
    <figure class="p3-portrait reveal">
      <img src="/images/avatar.jpg" alt="Anant’s illustrated profile picture: a silhouette in a hoodie against a sunset, with code, a robot and books behind him" width="640" height="640">
      <figcaption>
        <span class="p3-portrait__name">${s.name}</span>
        <span class="p3-portrait__arcana">ARCANA · ${s.arcana}</span>
      </figcaption>
    </figure>

    <section class="p3-panel p3-panel--card reveal" aria-labelledby="who-h">
      <h2 class="p3-panel__h" id="who-h">${s.title}</h2>
      <p class="p3-bio">${s.bio}</p>
      <p class="p3-motto">${s.motto}</p>
    </section>

    <section class="p3-panel reveal" aria-labelledby="stats-h">
      <h2 class="p3-panel__h" id="stats-h">SOCIAL STATS</h2>
      <ul class="p3-stats">
        ${s.stats.map((st) => html`
        <li class="p3-stat">
          <span class="p3-stat__name">${st.stat}<small>${st.label}</small></span>
          <span class="p3-stat__rank">${st.rankName}</span>
          <span class="p3-pips" role="img" aria-label="Rank ${st.rank} of 6">${pips(st.rank, 6)}</span>
          <span class="p3-stat__note">${st.note}</span>
        </li>`)}
      </ul>
    </section>

    <section class="p3-panel reveal" aria-labelledby="int-h">
      <h2 class="p3-panel__h" id="int-h">INTERESTS</h2>
      <ul class="p3-chips">${s.interests.map((x) => html`<li>${x}</li>`)}</ul>
      <h2 class="p3-panel__h p3-panel__h--sub">LANGUAGES</h2>
      <ul class="p3-chips p3-chips--alt">${s.languages.map((x) => html`<li>${x}</li>`)}</ul>
    </section>

    <section class="p3-panel reveal" aria-labelledby="goal-h">
      <h2 class="p3-panel__h" id="goal-h">GOALS</h2>
      <ol class="p3-goals">${s.goals.map((g) => html`<li>${g}</li>`)}</ol>
    </section>
  </div>
</main>`;
}

/* ── Resume: card stack + Social Links (ResumePage.jsx) ────────────────── */
export function resume({ content }) {
  const cards = content.resume;
  return html`
<main id="main" class="p3-page p3-resume" tabindex="-1">
  <header class="p3-head">
    <p class="p3-kicker">RECORDS</p>
    <h1 class="p3-title">RESUME</h1>
  </header>

  <div class="p3-resume__grid" data-tabs>
    <div class="p3-cards" role="tablist" aria-label="Resume sections" aria-orientation="vertical">
      ${cards.map((c, i) => html`
      <button class="p3-card" type="button" role="tab" id="tab-${c.id}" aria-controls="panel-${c.id}" aria-selected="${i === 0 ? 'true' : 'false'}"${i ? raw(' tabindex="-1"') : ''}>
        <span class="p3-card__badge" aria-hidden="true">${c.badge}</span>
        <span class="p3-card__title">${c.title}</span>
        <span class="p3-card__rank"><small>RANK</small>${c.rank}</span>
        <span class="p3-card__sub">${c.subtitle}</span>
      </button>`)}
    </div>

    <div class="p3-details">
      ${cards.map((c, i) => html`
      <section class="p3-detail" role="tabpanel" id="panel-${c.id}" aria-labelledby="tab-${c.id}"${i ? raw(' data-hidden') : ''}>
        <h2 class="p3-detail__h"><span>${c.badge}</span>${c.title}</h2>
        <ol class="p3-rows">
          ${c.rows.map((r, j) => html`
          <li class="p3-row">
            <span class="p3-row__i">${String(j + 1).padStart(2, '0')}</span>
            <span class="p3-row__t">${r.href ? html`<a href="${r.href}"${extAttrs(r.href)}>${r.title}</a>` : r.title}</span>
            <span class="p3-row__s">${r.status}</span>
          </li>`)}
        </ol>
      </section>`)}
      <a class="p3-cta" href="/about"><span>FULL PROFESSIONAL VERSION</span> ►</a>
    </div>
  </div>

  <section class="p3-links" aria-labelledby="sl-h">
    <h2 class="p3-sec-h" id="sl-h">SOCIAL LINKS</h2>
    <p class="p3-sec-note">The groups I’m part of. Arcana and ranks are my own playful read of each bond, 1 to 10.</p>
    <ul class="p3-link-grid">
      ${content.socialLinks.map((l) => html`
      <li class="p3-sl reveal">
        <span class="p3-sl__num" aria-hidden="true">${l.numeral}</span>
        <span class="p3-sl__arcana">${l.arcana}</span>
        <h3 class="p3-sl__name">${l.name}</h3>
        <p class="p3-sl__role">${l.role}</p>
        <p class="p3-sl__note">${l.note}</p>
        <span class="p3-sl__rank"><small>RANK</small>${l.rank}<span class="p3-pips p3-pips--10" role="img" aria-label="Rank ${l.rank} of 10">${raw(Array.from({ length: 10 }, (_, i) => `<i class="${i < l.rank ? 'on' : ''}"></i>`).join(''))}</span></span>
      </li>`)}
    </ul>
  </section>
</main>`;
}

/* ── Side projects: requests ───────────────────────────────────────────── */
export function projects({ content }) {
  const done = content.requests.filter((r) => r.status === 'complete').length;
  return html`
<main id="main" class="p3-page p3-requests" tabindex="-1">
  <header class="p3-head">
    <p class="p3-kicker">REQUESTS · ${done}/${content.requests.length} COMPLETE</p>
    <h1 class="p3-title">SIDE PROJECTS</h1>
  </header>
  <ol class="p3-req-list" data-roving>
    ${content.requests.map((r) => html`
    <li class="p3-req reveal">
      <a class="p3-req__link" href="${r.href}"${extAttrs(r.href)}>
        <span class="p3-req__no">No.${r.no}</span>
        <span class="p3-req__title">${r.title}</span>
        <span class="p3-req__meta"><small>CLIENT</small>${r.client}</span>
        <span class="p3-req__meta"><small>REWARD</small>${r.reward}</span>
        <span class="p3-req__note">${r.note}</span>
        <span class="p3-stamp p3-stamp--${r.status}">${r.status === 'complete' ? 'COMPLETE' : 'IN PROGRESS'}</span>
      </a>
    </li>`)}
  </ol>
</main>`;
}

/* ── Socials: party (Socials.jsx) ──────────────────────────────────────── */
const ICONS = {
  GITHUB: '<path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" fill="currentColor"/>',
  LINKEDIN: '<path d="M4.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 9h3v12H3V9Zm6 0h2.9v1.7h.1c.4-.8 1.4-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.8V21h-3v-6.4c0-1.5 0-3.5-2.1-3.5s-2.5 1.7-2.5 3.4V21H9V9Z" fill="currentColor"/>',
  EMAIL: '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m3 7 9 6 9-6" fill="none" stroke="currentColor" stroke-width="2"/>',
};

export function socials({ content }) {
  return html`
<main id="main" class="p3-page p3-party" tabindex="-1">
  <header class="p3-head">
    <p class="p3-kicker">PARTY</p>
    <h1 class="p3-title">SOCIALS</h1>
  </header>
  <ul class="p3-party__list" data-roving>
    ${content.party.map((p, i) => html`
    <li class="p3-member p3-member--${i + 1} reveal">
      <a class="p3-member__link" href="${p.href}"${extAttrs(p.href)}>
        <span class="p3-member__role p3-member__role--${p.role.toLowerCase()}">${p.role}</span>
        <span class="p3-member__face" aria-hidden="true">${i === 0
          ? raw('<img src="/images/avatar.jpg" alt="" width="640" height="640">')
          : raw(`<svg viewBox="0 0 24 24" width="40" height="40">${ICONS[p.label]}</svg>`)}</span>
        <span class="p3-member__main">
          <span class="p3-member__label">${i === 0 ? raw(`<svg class="p3-member__ico" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">${ICONS[p.label]}</svg>`) : ''}${p.label}</span>
          <span class="p3-member__handle">${p.handle}</span>
        </span>
        <span class="p3-member__stats">
          ${[p.stat, p.stat2].map(([k, v], j) => html`<span class="p3-mstat p3-mstat--${j ? 'sp' : 'hp'}"><small>${k}</small>${v}</span>`)}
        </span>
      </a>
    </li>`)}
  </ul>
  <p class="p3-party__note">Contact by email only. I don’t share other personal accounts here.</p>
</main>`;
}

export const clipLabel = (id) => CLIPS[id]?.label || id;
