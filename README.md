# dev-ananta-site

Personal site for **Anant Parikh**, live at **[dev-ananta.vercel.app](https://dev-ananta.vercel.app)**.

It's a minimal, design-engineer-style portfolio with zero runtime dependencies.
Pages are rendered to static HTML at build time with plain Node, and a ~3 KB
client script adds the interactive parts. No framework, no `node_modules`,
nothing to keep patched.

---

## How the brief maps to the code

| Brief | Where it lives |
|---|---|
| **Doc 1: Reference.** Design-engineer portfolio idiom: `Name / (Role)` identity, parenthesised mono section labels, single narrow column, card grid, experience rows, local-time readout | `src/components/*`, `src/styles/*` |
| **Doc 2: Format.** Top and bottom swapped: footer → top utility bar, nav → bottom dock, sections reversed | `LAYOUT` in `src/config.js` (`invert: true`), resolved in `src/page.js` |
| **Doc 3: Colors.** Red accent → green | `--accent*` tokens in `src/styles/tokens.css` |
| **Doc 4: Professional / Personal.** Ships Professional; Personal loader + toggle scaffolded and **commented out** | `src/config.js`, `scripts/build.mjs`, `src/components/modeToggle.js`, `src/client/main.js`, `personal/` |

**Layout order**

```
Reference (invert: false)          This build (invert: true)
─────────────────────────          ─────────────────────────
nav                                utility bar (old footer, sticky)
hero                               contact
projects                           now
experience                         experience
now                                projects
contact                            hero (the single <h1>)
footer                             dock (old nav, fixed bottom)
```

**UX principles applied**

- **Fitts's Law.** The dock is fixed in the thumb zone, and every interactive target is ≥ 44 px. Project cards are whole-card links rather than small "view" links.
- **Jakob's Law.** The pill dock mirrors familiar iOS tab bars and macOS docks. The utility bar keeps conventional footer content (©, socials).
- **Visual hierarchy.** One `<h1>`, a fluid type scale (`clamp()`), muted mono labels so headings carry the weight, and green used sparingly for action and state only.
- **Accessibility.** Skip link, landmark elements, `aria-current` on the active section, visible focus rings, AA-contrast accent in both themes, and `prefers-reduced-motion` respected. The page works fully without JavaScript.

> Note: The Terms of Service and Privacy Policy pages were left out. The brief
> asks for them only when the product is commercial, SaaS or e-commerce, and
> this is a personal portfolio that sets no cookies and runs no analytics. If you
> add analytics, a contact form or anything that collects data, add a
> `/privacy` page.

---

## Project structure

```
dev-ananta-site/
├── src/
│   ├── config.js              # identity, LAYOUT (Doc 2), MODE (Doc 4)
│   ├── page.js                # layout resolver + HTML document shell
│   ├── content/
│   │   └── professional.js    # all copy/data, no markup
│   ├── components/            # pure functions → HTML strings
│   │   ├── utilityBar.js      # old footer → top bar
│   │   ├── contact.js
│   │   ├── now.js
│   │   ├── experience.js
│   │   ├── projects.js
│   │   ├── hero.js
│   │   ├── dock.js            # old nav → bottom dock
│   │   ├── modeToggle.js      # Doc 4, commented out
│   │   └── icons.js
│   ├── lib/html.js            # auto-escaping template tag
│   ├── client/main.js         # theme, clock, active nav, copy, reveal
│   └── styles/                # tokens → base → layout → components
├── personal/                  # Doc 4, inactive Personal variant
├── public/                    # copied as-is (favicon, og.png, robots, sitemap)
├── scripts/
│   ├── build.mjs              # src → dist/
│   ├── dev.mjs                # local server + rebuild on change
│   └── check.mjs              # post-build sanity checks (used in CI)
├── .github/workflows/ci.yml
├── vercel.json                # build config + security headers
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
npm run dev        # → http://localhost:3000, rebuilds on save (refresh to see)
```

| Script | What it does |
|---|---|
| `npm run dev` | Build, serve `dist/` on `:3000`, rebuild on change |
| `npm run build` | Produce the static site in `dist/` |
| `npm run check` | Build, then verify output (1 `<h1>`, no dup ids, layout order, required files) |
| `npm run preview` | Production build served locally |

### Editing content

- **Copy, projects, experience, socials:** `src/content/professional.js` (search for `TODO`)
- **Name, role, email, timezone:** `SITE` in `src/config.js`
- **Accent color:** `--accent`, `--accent-ink` and `--accent-soft` in `src/styles/tokens.css`
- **Layout order:** `LAYOUT` in `src/config.js`. Set `invert: false` for the reference order.
- **Social preview image:** replace `public/og.png` (1200×630)

---

## Environment variables

All optional. See `.env.example`.

| Variable | Default | Purpose |
|---|---|---|
| `SITE_URL` | `https://dev-ananta.vercel.app` | Canonical + Open Graph URLs |
| `PORT` | `3000` | Dev server port |
| `SITE_MODE` | *(inactive)* | Doc 4: `personal` builds the Personal variant once enabled |
| `PERSONAL_URL` / `PROFESSIONAL_URL` | *(inactive)* | Doc 4: toggle targets for the branch strategy |

Locally, pass them inline (`SITE_URL=http://localhost:3000 npm run build`) or use
Node's loader: `node --env-file=.env scripts/build.mjs`. On Vercel, set them
under **Project → Settings → Environment Variables**.

---

## Push to GitHub

```bash
cd dev-ananta-site
git init -b main            # skip if the repo is already initialised
git add -A
git commit -m "Initial commit"

# Create the repo (GitHub CLI) and push:
gh repo create dev-ananta-site --public --source=. --remote=origin --push

# …or create "dev-ananta-site" on github.com (no README/license; this repo
# already has them), then:
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/dev-ananta-site.git
git push -u origin main
```

Then replace `YOUR_GITHUB_USERNAME` in `package.json` and this README.

---

## Deploy to Vercel (dev-ananta.vercel.app)

`vercel.json` already sets the build command, output directory and headers, so
there's nothing to configure in the dashboard.

**Dashboard**

1. Go to [vercel.com/new](https://vercel.com/new) and import `dev-ananta-site` from GitHub.
2. Set **Project Name** to `dev-ananta`. That name is what gives you `dev-ananta.vercel.app`.
3. Leave Framework Preset as **Other**, then click **Deploy**.

**CLI**

```bash
npm i -g vercel
vercel link --project dev-ananta     # creates/links the project
vercel --prod
```

After that, every push to `main` deploys to production and every other branch
or PR gets a preview URL. If `dev-ananta.vercel.app` is already taken, add it
(or a custom domain) under **Project → Settings → Domains**.

### Security headers

`vercel.json` sends HSTS, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy` and a strict CSP. The CSP allows exactly
one inline script, the pre-paint theme snippet in `src/page.js`, by its
SHA-256 hash. **If you edit that snippet, recompute the hash:**

```bash
npm run build && node -e "const h=require('fs').readFileSync('dist/index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];console.log('sha256-'+require('crypto').createHash('sha256').update(h).digest('base64'))"
```

and paste it into `script-src` in `vercel.json`.

---

## Personal mode (Document 4)

Disabled by design. To turn it on, follow [`personal/README.md`](personal/README.md),
which covers both the **folder** strategy (`/personal/` on the same deployment)
and the **branch** strategy (a `personal` branch with its own Vercel domain).

---

## License

[MIT](LICENSE) © 2026 Anant Parikh
