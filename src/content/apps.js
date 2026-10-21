// Apps shown as live windows on the homepage. Each one is built into
// public/apps/<slug>/ by scripts/build-apps.sh and loaded in an <iframe>.
//   src       entry page under public/, hash params included
//   autoplay  start as soon as the window scrolls into view
//   wide      span two grid columns on wide screens (landscape apps)
//   size      download size, shown on the Run button

const apps = [
  {
    slug: 'designelectronics',
    name: 'designElectronics',
    tagline: 'Breadboard, schematic and PCB editor with live simulation',
    stack: ['C++17', 'SDL3', 'Emscripten'],
    repo: 'https://github.com/rORrEtboLt/designElectronics',
    src: 'apps/designelectronics/index.html#example=4&sim=1',
    size: '5 MB',
    autoplay: true,
    wide: true,
    color: '#2f6f4f',
  },
  {
    slug: 'maayavi',
    name: 'Enchantress',
    tagline: 'Dice lane-defense with warriors from Indian mythology',
    stack: ['C', 'SDL3', 'Emscripten'],
    repo: 'https://github.com/rORrEtboLt/sdl3-games',
    src: 'apps/maayavi/index.html',
    size: '1.3 MB',
    autoplay: true,
    color: '#3b2a5c',
  },
  {
    slug: 'buster',
    name: 'Adventures with Buster',
    tagline: 'A small game about my dog. He never learned fetch',
    stack: ['C++', 'Godot 4', 'WebAssembly'],
    repo: 'https://github.com/rORrEtboLt/-do-naina-india-platformer',
    src: 'apps/buster/index.html',
    size: '43 MB',
    wide: true,
    color: '#7a4a1e',
  },
  {
    slug: 'dweepa',
    name: 'Dweepa',
    tagline: 'Hand-drawn island defense against sea raiders',
    stack: ['TypeScript', 'Canvas'],
    repo: 'https://github.com/rORrEtboLt/dweepa',
    src: 'apps/dweepa/index.html',
    size: '80 KB',
    autoplay: true,
    color: '#5c4317',
  },
];

// Repos without a web build yet: listed under the windows.
export const moreRepos = [
  { name: 'MyFiles', about: 'Find which envelope a paper document is in. C + SDL3, iOS/Android', href: 'https://github.com/rORrEtboLt/MyFiles' },
  { name: 'RoastIQ', about: 'ESP32 temperature logging for my coffee roaster', href: 'https://github.com/rORrEtboLt/roastiq.github.io' },
  { name: 'AnyGarbs', about: 'Robot swarms that turn garbage back into raw material', href: 'https://github.com/rORrEtboLt/anygarbs' },
  { name: 'brack', about: 'Brackeys jam game where the game itself lies to you. Godot', href: 'https://github.com/rORrEtboLt/brack' },
];

export default apps;
