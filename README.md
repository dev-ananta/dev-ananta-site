# dev-ananta-site

Personal site for **Anant Parikh**, live at **[dev-ananta.vercel.app](https://dev-ananta.vercel.app)**.

It's a bold, Swiss-style, multi-page portfolio: Home, About, Projects, Work with me,
and Privacy. Pages are rendered to static HTML at build time with plain Node, and one
small client script adds the motion. There are **zero npm dependencies**, so there's
nothing to install and nothing to keep patched. The contact form runs on a
dependency-free Vercel function.

---

## How the brief maps to the code

| Brief | Implementation |
|---|---|
| **Doc 1: Reference** (reverse-engineered from a mobile recording) | Per-page palettes (brand / sky blue / black / stone grey / white), full-viewport hero with one-line display name and spinning asterisk, sticky hero reveal, photo with **pixel-dissolve** transition, four-column data tables, alternating left/right statements, pointer-reactive **dash field**, striped **page transitions**, giant footer year with **odometer roll** |
| **Doc 2: Format** (top ↔ bottom) | `LAYOUT.invert` in `src/config.js`. Every page's stack is reversed, and so is each block's internal top/bottom arrangement. The footer (year + links) now opens every page, and the nav becomes a fixed bottom bar |
| **Doc 3: Colors** (red → green) | `--brand: #00d65b` (was `#ff0000`) in `src/styles/tokens.css`: hero, transition stripes, theme-color, favicon, OG image |
| **Doc 4: Professional / Personal** | **Both sides are live.** Professional at `/`, and a Persona 3 Reload–inspired Personal side at `/personal` with a rotating 12-clip background library. The Professional/Personal toggle sits in the footer. See [`personal/README.md`](personal/README.md) |

### Layout order (Document 2)

```
Reference (invert: false)                 This build (invert: true)
──────────────────────────                ──────────────────────────
nav (top)                                 footer: giant "20*26" → link columns
HOME hero: meta row → name                work: table → lead + "View all projects"
statement (dark, slides over hero)        photo (assembles from white pixels)
photo (dissolves into white)              statement (dark, pulls away from hero)
work: lead → table                        HOME hero: name → meta row (sticky reveal)
footer: link columns → giant "20*26"      nav (fixed bottom bar)
```

The same reversal applies on About, Projects, Contact and Privacy. DOM order always
matches visual order, so screen-reader and keyboard order stay correct. `npm run check`
verifies the order on every page.

### UX principles

- **Fitts's Law.** The nav is a fixed bottom bar in the thumb zone. Every link and button is at least 44px tall even where the type is tiny (the reference uses ~28px pills; these are enlarged). Project cards are whole-card links.
- **Jakob's Law.** Conventional page names, a persistent nav, and a footer with links, email and ©.
- **Visual hierarchy.** One `<h1>` per page, display type at 4–15vw against 12px UI text, and colour fields that tell you which page you're on.
- **Legibility.** The nav bar reads the section beneath it and switches ink and background to match (light on dark, dark on light). UI text has a 12px floor. Black on brand green is about 10:1.
- **Accessibility.** Skip link, landmarks, captioned tables, labelled form fields, `aria-live` form status, visible focus, and `prefers-reduced-motion` turns off every animation. Every page works fully without JavaScript, including the contact form via a 303 redirect plus `:target` messages.

### Compliance pages

The brief asks for Terms/Privacy pages only for commercial, SaaS or e-commerce
products. This is a personal portfolio, so there are **no Terms of Service**. It does
collect names and emails through the contact form, though, so it includes a
professionally structured **Privacy notice** at `/privacy` (linked from the footer and
the form, as in the reference). It names your real providers (Vercel, Resend, optional Cloudflare). Review it before launch. It is not legal advice.

---

## Project structure

```
dev-ananta-site/
├── api/
│   └── contact.js             # Vercel function: validate → Turnstile (opt.) → Resend
├── src/
│   ├── config.js              # SITE, NAV, LAYOUT (Doc 2), MODE (Doc 4)
│   ├── page.js                # page definitions, layout inversion, HTML shell
│   ├── content/
│   │   ├── professional.js    # professional copy and data
│   │   ├── personal.js        # Persona-side copy and data
│   │   └── clips.js           # P3R clip library + per-page pools
│   ├── components/
│   │   ├── shared.js          # nav bar, footer + odometer, data table, asterisk
│   │   ├── home.js            # hero, statement, photo, work preview
│   │   ├── about.js           # intro + dash field, statements + experience
│   │   ├── projects.js        # intro, image grid, table
│   │   ├── contact.js         # form (progressive enhancement)
│   │   ├── privacy.js         # privacy notice
│   │   ├── personal.js        # Persona screens: menu, status, resume, requests, party
│   │   └── modeToggle.js      # Professional / Personal toggle
│   ├── lib/html.js            # auto-escaping template tag + ordered()
│   ├── client/main.js         # transitions, nav ink, odometer, dissolve, dash field, form
│   ├── client/personal.js     # clip director, keyboard menu, resume tabs, pause control
│   └── styles/                # tokens → base → layout → components → motion
├── personal/README.md         # Doc 4: how the Personal side works
├── public/
│   ├── fonts/                 # Inter, Anton, Bebas Neue (self-hosted subsets, OFL)
│   ├── images/                # portrait, avatar, banner, project covers
│   ├── media/p3r/             # 12 P3R clips + posters (≈5 MB)
│   └── favicon.svg, og.png, robots.txt, sitemap.xml
├── scripts/
│   ├── build.mjs              # src → dist/
│   ├── dev.mjs                # local server with production headers + rebuild
│   └── check.mjs              # post-build checks (CI)
├── .github/workflows/ci.yml
├── vercel.json                # build, security headers, function config
├── .env.example
├── LICENSE                    # MIT
└── package.json
```

---

## Local setup

Requires **Node 18.17+** (20 LTS recommended). There's nothing to install.

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/dev-ananta-site.git
cd dev-ananta-site
npm run dev        # → http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Build, serve `dist/` with production headers, rebuild on change (refresh to see edits; restart after editing components) |
| `npm run build` | Produce the static site in `dist/` |
| `npm run check` | Build, then verify: one `<h1>` per page, no duplicate ids, alt text, Document 2 order, CSP hash |
| `npm run preview` | Production build served locally |

The dev server doesn't run `/api/*`. To test the contact form locally, use the
Vercel CLI: `npx vercel dev`.

### Make it yours

| What | Where |
|---|---|
| Name, role, location, email | `SITE` in `src/config.js` (keep the privacy rules below) |
| All copy, projects, roles, socials | `src/content/professional.js` |
| Home photo | `public/images/portrait.jpg` (cropped from your LinkedIn banner art) |
| Project covers | `public/images/projects/*.svg` (typographic covers; swap in screenshots any time) |
| Personal side | `src/content/personal.js`, `src/content/clips.js` |
| Brand colour | `--brand` in `src/styles/tokens.css` (also `themeColor` for Home in `src/page.js`) |
| Page colours | `--about`, `--black`, `--stone`, `--dark`, `--paper` in `tokens.css` |
| Layout direction | `LAYOUT.invert` in `src/config.js` |
| Privacy notice | `src/components/privacy.js` |
| Social image | `public/og.png` (1200×630) |

---

## Environment variables

Set these in **Vercel → Project → Settings → Environment Variables**. All are optional,
but the contact form needs the Resend pair to send email.

| Variable | Used by | Purpose |
|---|---|---|
| `SITE_URL` | build | Canonical + Open Graph URLs (default `https://dev-ananta.vercel.app`) |
| `RESEND_API_KEY` | `api/contact.js` | Sends form messages via [Resend](https://resend.com) (free tier is plenty) |
| `CONTACT_TO_EMAIL` | `api/contact.js` | Your inbox |
| `CONTACT_FROM_EMAIL` | `api/contact.js` | Verified sender, e.g. `Portfolio <hello@yourdomain.com>` (defaults to Resend's test sender) |
| `TURNSTILE_SITE_KEY` | build | Shows a Cloudflare Turnstile widget on the form |
| `TURNSTILE_SECRET_KEY` | `api/contact.js` | Verifies the Turnstile token server-side |
| `PORT` | dev | Dev server port (default 3000) |
| `SITE_MODE`, `PERSONAL_URL`, `PROFESSIONAL_URL` | *(inactive)* | Document 4, see `personal/README.md` |

Without `RESEND_API_KEY`, the form returns a friendly "isn't set up yet" message
instead of failing silently. Spam protection is layered: a honeypot field, server-side
validation and length limits, and optionally Turnstile. For rate limiting, add a Vercel
Firewall rule on `/api/contact`.

---

## Push to GitHub

```bash
cd dev-ananta-site
# The repo is already initialised with one commit on `main`.
gh repo create dev-ananta-site --public --source=. --remote=origin --push

# …or create an empty "dev-ananta-site" repo on github.com, then:
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/dev-ananta-site.git
git push -u origin main
```

Then replace `YOUR_GITHUB_USERNAME` in `package.json` and this README.

---

## Deploy to Vercel (dev-ananta.vercel.app)

`vercel.json` already sets the build command, output directory, headers and function
limits, so there's nothing to configure in the dashboard.

**Dashboard**

1. Go to [vercel.com/new](https://vercel.com/new) and import `dev-ananta-site`.
2. Set **Project Name** to `dev-ananta`. That's what gives you `dev-ananta.vercel.app`.
3. Leave Framework Preset as **Other**, add the environment variables above, then **Deploy**.

**CLI**

```bash
npx vercel link --project dev-ananta
npx vercel env add RESEND_API_KEY      # repeat for the others
npx vercel --prod
```

Every push to `main` deploys to production, and every other branch or PR gets a preview
URL. If `dev-ananta.vercel.app` is taken, assign a domain under **Settings → Domains**.

### Security headers

`vercel.json` sends HSTS, `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`,
`Permissions-Policy` and a strict **CSP**: no inline styles, no third-party scripts
except Cloudflare Turnstile, and exactly one inline script (the pre-paint snippet,
`PREPAINT` in `src/page.js`) allowed by its SHA-256 hash. If you edit that snippet,
`npm run check` will fail and print the new hash to paste into `vercel.json`.

---

## Personal side (Document 4)

`/personal` is "Ananta's Persona", a Persona 3 Reload–inspired menu with About
(status and Social Stats), Resume (cards and Social Links), Side Projects
(Requests) and Socials (party). Background clips rotate least-shown-first, so
no clip gets over-used. Details are in [`personal/README.md`](personal/README.md).
Persona 3 Reload footage © ATLUS © SEGA. Fan tribute, not affiliated.

## Privacy (the site owner is a minor)

- The only contact published is **ananta.dev@proton.me**.
- No phone number, home address, town, school name, grades or transcript data appear anywhere. Location is shown only as "Midwest, United States".
- `npm run check` includes a **privacy guard** that fails the build if a phone number, the old personal or school email addresses, the home street or town, a school name, or any email other than the public one appears in the built site.
- Personal social accounts (Instagram, Discord, YouTube) are deliberately left off. Add them in `src/content/*.js` only if you decide to.

---

## Credits and license

- Code: [MIT](LICENSE) © 2026 Anant Parikh
- Typefaces: [Inter](https://github.com/rsms/inter), [Anton](https://github.com/googlefonts/AntonFont) and [Bebas Neue](https://github.com/dharmatype/Bebas-Neue), SIL Open Font License 1.1 (`public/fonts/OFL.txt`)
- Persona 3 Reload footage © ATLUS © SEGA (fan tribute on the Personal side, not covered by the MIT license)
- Layout and interaction patterns inspired by [aryan.am](https://aryan.am). All copy is original. Illustrations are the owner's own profile art.
