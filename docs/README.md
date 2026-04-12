# docs/

This folder is the **published output** of the site. GitHub Pages serves it
from `master` → `/docs`.

## What's safe to hand-edit

- `index.html` — prettified HTML. Tweak meta tags, inline content, etc.
- `static/css/*.css` — prettified CSS. Safe to restyle directly.
- Any static assets (images, fonts) in `static/media/`.

## What is **not** editable by hand

- `static/js/*.js` — bundled React + Three.js. Regenerated every build.
  For code or content changes, edit the source in `src/` and run:

    ```
    npm run build:static
    ```

  That rebuilds this folder from scratch, so hand-edits in `docs/` will
  be overwritten. Commit them to `src/` if you want them to persist.
