// Blog posts authored inline. Keeping them as JS modules lets us avoid
// configuring a markdown loader in Create React App. To add a new post,
// append an object below and the Blog panel picks it up automatically.

const posts = [
  {
    slug: 'welcome',
    title: 'Welcome to my little 3D world',
    date: '2026-04-12',
    excerpt: 'Why I rebuilt my site as an interactive, game-like experience.',
    tags: ['meta', 'three.js'],
    content: `# Welcome!

Thanks for wandering in. This site is less of a CV and more of a tiny, curated
room that happens to host my writing and open-source work.

## Why a 3D site?

I spend my days looking at rectangles full of text. I wanted my homepage to
feel like a *place* rather than a page — something you explore at your own pace.

- **Monitor** → a short about-me
- **Notebook** → the blog you're reading right now
- **Bookshelf** → open-source projects
- **Coffee mug** → ways to support my work
- **Mailbox** → get in touch

## Under the hood

The scene is rendered with [React Three Fiber](https://r3f.docs.pmnd.rs/) and
[drei](https://github.com/pmndrs/drei). Camera moves use springs, posts are
plain Markdown, and the whole thing falls back to a flat HTML version if your
device prefers reduced motion.

> Have fun clicking things. Press \`Esc\` to return to the overview at any time.

— Nesara
`,
  },
  {
    slug: 'hello-three',
    title: 'Five things I wish I knew before picking up Three.js',
    date: '2026-03-28',
    excerpt: 'Hard-won lessons from shipping my first interactive 3D site.',
    tags: ['three.js', 'graphics', 'webgl'],
    content: `# Five things I wish I knew before picking up Three.js

Three.js is magical — and full of sharp edges. Here are the lessons that saved
me the most time.

## 1. Units are arbitrary, but be consistent

Pick meters, stick to meters. Mixing centimeters and meters across imported
models will wreck your lighting and shadow bias.

## 2. Postprocessing is not free

Bloom looks great in screenshots and eats frames on mobile. Guard it behind a
device-pixel-ratio or reduced-motion check.

## 3. Raycasting needs large targets

Users don't hover over coffee mugs with pixel precision. Wrap small hotspots
with an invisible, slightly larger mesh that handles pointer events.

## 4. Camera transitions via springs > lerps

\`@react-spring/three\` turns a chaotic camera into a pleasant one.

## 5. Ship a 2D fallback

Not every visitor has a GPU, good bandwidth, or a vestibular system that loves
flying cameras. A \`/flat\` route is respectful *and* SEO-friendly.

Happy rendering!
`,
  },
  {
    slug: 'open-source-notes',
    title: 'Keeping small open-source projects joyful',
    date: '2026-02-14',
    excerpt: 'A few rituals that keep side-project burnout at bay.',
    tags: ['open-source', 'career'],
    content: `# Keeping small open-source projects joyful

Shipping something to GitHub is easy. Keeping it alive without burning out is
the harder part. Here's what works for me.

## Set a cadence, not a deadline

"One small PR every Sunday morning" beats "I'll finish this feature by Friday".

## Say no, kindly

Every issue is a little ask for your attention. It's okay to close ones that
don't match the project's scope — with a warm note.

## Let the README do the work

A crisp, honest README that says what the project *is* and *isn't* saves
hours of triage later.

Stay curious.
`,
  },
];

posts.sort((a, b) => (a.date < b.date ? 1 : -1));

export default posts;
