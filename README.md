# nesarahippla.com

An interactive 3D portfolio, blog, and open-source playground built with
**React Three Fiber**. Instead of flat pages, visitors explore a small
floating-island scene and click objects to reveal themed content panels.

| Object      | Section       |
| ----------- | ------------- |
| Monitor     | About         |
| Notebook    | Blog          |
| Bookshelf   | Projects      |
| Coffee mug  | Support me    |
| Mailbox     | Contact form  |

A flat, accessible version is always available at `/flat` and is used
automatically for visitors with `prefers-reduced-motion`.

## Getting started

```bash
npm install
npm start          # dev server on http://localhost:3006
npm run build      # production build
```

## Editing content

Everything a visitor sees is driven by a handful of small files:

- `src/content/profile.json` — name, bio, email, social links, and support
  URLs (Buy Me a Coffee, Patreon, GitHub Sponsors). Leave a URL ending in `/`
  to hide its button until you fill it in.
- `src/content/projects.json` — hand-picked list of projects shown on the
  shelf. Set `githubUsername` in `profile.json` to automatically pull your
  pinned repos from GitHub (falls back to this list on failure).
- `src/content/posts.js` — blog posts authored inline as markdown strings.
  Each entry needs `slug`, `title`, `date`, `excerpt`, `tags`, and `content`.
  Posts are sorted newest-first automatically.

## Tech

- **react**, **react-router-dom** — shell + routing
- **three**, **@react-three/fiber**, **@react-three/drei**,
  **@react-three/postprocessing** — 3D scene, helpers, bloom/vignette
- **zustand** — scene state (active hotspot, day/night)
- **framer-motion** — panel and loading screen transitions
- **react-markdown** + **remark-gfm** + **rehype-highlight** — blog rendering
- **react-helmet-async** — per-page titles / OG tags

## Scene tips

- Press `1`–`5` to jump between hotspots, `Esc` to return.
- Click the sun/moon in the top right to toggle day / night mood.
- The hamburger icon jumps to the flat accessible version.

## Accessibility

- `prefers-reduced-motion` visitors are redirected to `/flat`.
- All interactive meshes have oversized invisible hit-boxes so small objects
  remain clickable.
- The flat fallback renders the full blog and projects content as plain HTML
  so search engines and screen readers stay happy.

## Deployment

This repo is the **private source of truth**. Published output lives in
the public repo **`rORrEtboLt/website`**, which GitHub Pages serves at
**nesarahippla.com**.

On every push to `master` here, the workflow
`.github/workflows/deploy-to-website.yml`:

1. Installs deps and runs `npm run build:static`.
   - Builds via `react-scripts build`.
   - Copies output into `docs/`.
   - Strips sourcemaps.
   - Runs Prettier over all HTML + CSS so the published files are
     human-readable and hand-editable.
2. Checks out `rORrEtboLt/website` using a PAT secret.
3. Backs up `CNAME`, wipes the repo (except `.git`), copies `docs/` in,
   restores `CNAME`.
4. Commits and pushes to `rORrEtboLt/website@master`.

### One-time setup

1. Create a **fine-grained personal access token** (or classic PAT) with
   `Contents: read/write` permission on `rORrEtboLt/website`.
2. In this repo, go to **Settings → Secrets and variables → Actions**
   and add a new secret named `WEBSITE_DEPLOY_TOKEN` with that token's
   value.
3. Confirm `rORrEtboLt/website` has `CNAME` at its root containing
   `nesarahippla.com` (the workflow preserves it across deploys).
4. In the `website` repo, **Settings → Pages → Source:**
   *Deploy from a branch* → `master` → `/` (root).

### Running the build locally

```bash
npm run build:static   # generates ./docs, gitignored locally
```

You can inspect `docs/index.html`, `docs/static/css/main.*.css`, etc.
directly and tweak them. Local edits to `docs/` are not pushed — the CI
always rebuilds from `src/` on master.

### Notes

- `package.json` has `"homepage": "."` so asset paths are relative.
- `App.js` derives the React Router `basename` from `PUBLIC_URL` at
  runtime, keeping deep links working under a subpath if needed.
- Other static hosts (Vercel, Netlify, Cloudflare Pages) also work if
  you point them at `npm run build` → `build/`.
