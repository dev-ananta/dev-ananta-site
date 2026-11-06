# Personal side: "Ananta's Persona" (active)

The personal side is a Persona 3 Reload–inspired set of screens served under
`/personal`. It is built from this repo (folder strategy) every time you run
`npm run build`.

| Path | Screen | Clip pool |
|---|---|---|
| `/personal` | Main menu (port of the prototype's `P3Menu.jsx`) | `menu` |
| `/personal/about` | Status: profile, Social Stats, interests, goals | `about` |
| `/personal/resume` | Resume cards + Social Links | `resume` |
| `/personal/projects` | Side projects as Requests | `projects` |
| `/personal/socials` | Party: GitHub, LinkedIn, email | `socials` |

## Where things live

- Content: `src/content/personal.js`
- Clip library and pools: `src/content/clips.js` (files in `public/media/p3r/`)
- Markup: `src/components/personal.js`
- Styles: `src/styles/personal.css`
- Behaviour (clip rotation, keyboard, tabs, pause): `src/client/personal.js`

## Clip rotation (no over-used clips)

The 12 clips were cut from the supplied recording at scene changes. The logo
card was left out. Each clip is in exactly two page pools. On every page,
`ClipDirector` plays the least-shown clip in that page's pool, never the clip
you just saw, then hands over to the next least-shown one when it ends. Counts
persist in `localStorage` (`p3r:plays`), so screen time evens out across the
whole visit. Visitors with reduced motion or Data Saver get a still poster
instead, and everyone gets a Pause video button.

To add a clip: drop `name.mp4` + `name.jpg` (1280×720) into
`public/media/p3r/`, add it to `CLIPS`, and put it in at least two `POOLS`.
`npm run check` enforces this.

## Turning it off

`SITE_PERSONAL=off npm run build` ships the Professional side only, and the
footer toggle disappears.

## The original prototype

The unfinished React/Vite prototype isn't in this repo. Its design (menu
geometry, colours, transitions, resume cards, party bars) was ported to plain
HTML/CSS/JS so the whole site stays zero-dependency and works under a strict
CSP. The prototype's game character art and fake follower counts weren't
carried over. Your own illustrations and real numbers are used instead.

## Footage credit

Persona 3 Reload footage © ATLUS © SEGA. This is a fan tribute, not
affiliated with or endorsed by either company. The credit line is
`credit` in `src/content/personal.js` and shows on every personal screen.
