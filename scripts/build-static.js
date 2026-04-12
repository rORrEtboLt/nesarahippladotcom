#!/usr/bin/env node
/* eslint-disable */
/**
 * Build the app into a hand-editable `docs/` folder ready to be served by
 * GitHub Pages from `master/docs`.
 *
 * Steps:
 *  1. Run Create React App's production build.
 *  2. Copy the `build/` output into `docs/` (wiping any previous contents).
 *  3. Run prettier over every HTML and CSS file so a human can read and
 *     tweak them directly. The JS bundle is left alone (it's minified by
 *     webpack and regenerated on each build — edit source in `src/` for
 *     code changes).
 *  4. Write a short README into `docs/` explaining what's safe to edit.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BUILD_DIR = path.join(ROOT, 'build');
const DOCS_DIR = path.join(ROOT, 'docs');

function run(cmd, opts = {}) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: ROOT, ...opts });
}

function rimraf(p) {
  if (!fs.existsSync(p)) return;
  fs.rmSync(p, { recursive: true, force: true });
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function walk(dir, match, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, match, out);
    else if (match.test(entry.name)) out.push(p);
  }
  return out;
}

(async () => {
  console.log('▶ Building app with react-scripts...');
  // CI=false so eslint warnings don't fail the build.
  run('npm run build', { env: { ...process.env, CI: 'false' } });

  console.log('▶ Resetting docs/ ...');
  rimraf(DOCS_DIR);
  copyDir(BUILD_DIR, DOCS_DIR);

  // Sourcemaps bloat the committed folder and aren't needed to serve the
  // site. Strip them (plus the tiny sourceMappingURL comment trailer).
  const maps = walk(DOCS_DIR, /\.map$/);
  for (const m of maps) fs.unlinkSync(m);
  for (const file of walk(DOCS_DIR, /\.(js|css)$/)) {
    const cleaned = fs
      .readFileSync(file, 'utf8')
      .replace(/\n?\/[\/\*]# sourceMappingURL=.*$/m, '');
    fs.writeFileSync(file, cleaned);
  }

  console.log('▶ Prettifying HTML and CSS files ...');
  const prettier = require('prettier');
  const targets = walk(DOCS_DIR, /\.(html|css)$/);
  for (const file of targets) {
    const source = fs.readFileSync(file, 'utf8');
    const parser = file.endsWith('.html') ? 'html' : 'css';
    const formatted = await prettier.format(source, {
      parser,
      printWidth: 100,
      htmlWhitespaceSensitivity: 'ignore',
    });
    fs.writeFileSync(file, formatted);
    console.log('   formatted', path.relative(ROOT, file));
  }

  // Drop a tiny note so anyone browsing docs/ on GitHub knows what's what.
  const notice = `# docs/

This folder is the **published output** of the site. GitHub Pages serves it
from \`master\` → \`/docs\`.

## What's safe to hand-edit

- \`index.html\` — prettified HTML. Tweak meta tags, inline content, etc.
- \`static/css/*.css\` — prettified CSS. Safe to restyle directly.
- Any static assets (images, fonts) in \`static/media/\`.

## What is **not** editable by hand

- \`static/js/*.js\` — bundled React + Three.js. Regenerated every build.
  For code or content changes, edit the source in \`src/\` and run:

    \`\`\`
    npm run build:static
    \`\`\`

  That rebuilds this folder from scratch, so hand-edits in \`docs/\` will
  be overwritten. Commit them to \`src/\` if you want them to persist.
`;
  fs.writeFileSync(path.join(DOCS_DIR, 'README.md'), notice);

  // GitHub Pages needs this to stop Jekyll from hiding files starting with _.
  fs.writeFileSync(path.join(DOCS_DIR, '.nojekyll'), '');

  console.log('\n✔ docs/ is ready. Commit and push to publish.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
