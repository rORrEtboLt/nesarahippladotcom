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

## Deployment — GitHub Pages

Every push / merge to `master` is automatically built and deployed by the
workflow at `.github/workflows/deploy-pages.yml` using the official
`actions/deploy-pages` action.

One-time setup in your repo settings:

1. **Settings → Pages → Build and deployment → Source:** select
   **GitHub Actions**.
2. (Optional) **Settings → Pages → Custom domain:** set your domain (e.g.
   `nesarahippla.com`) and add a `public/CNAME` file containing the same
   domain so it survives every build.

How SPA routing is handled:

- The workflow copies `build/index.html` to `build/404.html`, so any deep
  link (e.g. `/flat`) served by GitHub Pages falls back to the app and
  React Router renders the right screen.
- `package.json` has `"homepage": "."` so asset paths are relative, which
  works for both custom-domain and project-page (`<user>.github.io/<repo>`)
  hosting.
- `App.js` derives the router `basename` from `PUBLIC_URL` at runtime, so
  links stay correct under a subdirectory deploy.

Other static hosts (Vercel, Netlify, Cloudflare Pages) also work after
`npm run build`.
