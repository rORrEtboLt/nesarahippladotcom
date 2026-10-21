// Files shown in the homepage "editor" and the terminal.
// type: 'md' (content), 'image' | 'video' (src), 'game'.
// In markdown, `*.md` and media paths open in a tab, `/path` is a site route,
// anything else is external. `![alt](path)` renders the media under the line.

const DE = 'https://rorretbolt.github.io/designElectronics/assets';

const md = (content) => ({ type: 'md', content });
const image = (src, caption) => ({ type: 'image', src, caption });
const video = (src, poster, caption) => ({ type: 'video', src, poster, caption });

const files = {
  'README.md': md(`# Nesara Hippla

Programmer, farmer and builder. I live on a coffee estate in
Chikmaglur, Karnataka.

I write mostly C, C++ and TypeScript. I like software that works
offline, runs on cheap hardware, and that I can fix myself.

> psst: there's a terminal down there. try \`help\`, or \`dino\`.

## Now

Working on [AnyGarbs](now/anygarbs.md): robot swarms that collect garbage,
sort it by material, and turn it into raw material that factories buy.

![AnyGarbs](media/anygarbs.gif)

## Things I've made

- [designElectronics](projects/designElectronics.md) - breadboard, schematic and PCB editor for desktop and phone
- [MyFiles](projects/MyFiles.md) - scan paper documents, then search to find which envelope they're in
- [RoastIQ](projects/RoastIQ.md) - ESP32 temperature logging for my coffee roaster
- [Enchantress](projects/Enchantress.md) - dice lane-defense game, Indian mythology
- [Adventures with Buster](projects/Buster.md) - a small game about my dog
- [Dweepa](projects/Dweepa.md) - island defense game

Most of these run in your browser, in windows on the [home page](/).
Everything else is on [github.com/rORrEtboLt](https://github.com/rORrEtboLt).

## Away from the computer

- Built a [cottage](/work/cottage) in the forest with friends
- Grow coffee and pepper on the [farm](/work/farm)
- Roast [coffee](/work/coffee) on a drum roaster I made

![Raising the cottage frame](media/cottage-frame-complete.webp)

More photos and videos in [media/](media/gallery.md).

## Contact

nesara.hippla@gmail.com
`),

  'now/anygarbs.md': md(`# AnyGarbs

> Any garbage, back into raw material.

Robot swarms that find waste, collect it, sort it down to the material,
and process it into something a factory will buy.

![anygarbs.com](media/anygarbs.webp)

## How it works

1. **Scout** - drones and public data map dumps, ditches and landfills
2. **Collect** - hauler bots run routes, wet organics first
3. **Segregate** - vision, near-infrared and XRF sort by material, not category
4. **Transform & sell** - container-sized refiners per stream, an agent sells the output

## What comes out

Compost, biogas, PET/HDPE/PP, paper pulp, steel and aluminium,
copper, rare-earth oxides, gold, silver.

## Links

- [anygarbs.com](https://anygarbs.com)
- [source](https://github.com/rORrEtboLt/anygarbs)
`),

  'projects/designElectronics.md': md(`# designElectronics

Electronics design app for desktop and phone, inspired by Fritzing.
Build a circuit on a breadboard, draw the schematic, lay out the PCB,
export Gerbers.

![555 blinker, breadboard to PCB](media/555-blinker.mp4)

- Three linked views: breadboard, schematic, PCB
- A* autorouter with vias and clearances, plus DRC
- A project is one \`.dez\` file with every part embedded, so it opens offline

![Breadboard view](media/de-breadboard.webp)
![PCB view](media/de-pcb.webp)

Stack: \`C++17\` \`SDL3\`

- [docs](https://rorretbolt.github.io/designElectronics/)
- [source](https://github.com/rORrEtboLt/designElectronics)
`),

  'projects/MyFiles.md': md(`# MyFiles

I keep paper documents in numbered envelopes. This app tells me
which envelope something is in.

- Give each envelope a number (handwritten or a printed QR label)
- Scan the pages, OCR runs on the phone
- Search "insurance 2026" and it says \`F-0042\`
- Works offline, syncs with my own server when online

![Search](media/myfiles-search.webp)

Stack: \`C\` \`SDL3\` \`SQLite FTS5\` \`Node\` \`Hapi\` \`PostgreSQL\`

- [docs](https://rorretbolt.github.io/MyFiles/)
- [source](https://github.com/rORrEtboLt/MyFiles)
`),

  'projects/RoastIQ.md': md(`# RoastIQ

I roast coffee from our estate. An ESP32 reads bean and exhaust
temperatures from two thermocouples and streams them over WebSocket
into Artisan, so I can see the roast curve live.

![RoastIQ, exploded](media/roastiq.webp)

Stack: \`ESP32\` \`MAX6675\` \`TypeScript\` \`WebSocket\`

- [roastiq.in](https://roastiq.in)
- [bridge source](https://github.com/rORrEtboLt/esp32_temp)
`),

  'projects/Enchantress.md': md(`# Enchantress

Dice lane-defense. Roll a die, summon a creature, drag it onto a lane,
hold off the waves. Characters from Indian mythology.

- 11 unit types, 18 enemy types
- No ads, no in-app purchases
- Written in C

- [game page](/enchantress)
`),

  'projects/Buster.md': md(`# Adventures with Buster

A small game about Buster, my half-indie half-dachshund, and the
things he taught me. Chapter 1: he chases the ball and never brings it back.

Every character and tree is built from primitive meshes in C++,
no art assets.

Stack: \`Godot 4\` \`C++ GDExtension\`

- [play in browser](https://rorretbolt.github.io/-do-naina-india-platformer/)
- [source](https://github.com/rORrEtboLt/-do-naina-india-platformer)
- or run [games/dino.js](games/dino.js) and help him jump over things
`),

  'projects/Dweepa.md': md(`# Dweepa

Island defense game I built together with Claude.

![Dweepa title screen](media/dweepa.webp)

- [play in browser](https://rorretbolt.github.io/dweepa/)
- [source](https://github.com/rORrEtboLt/dweepa)
`),

  'games/dino.js': { type: 'game' },

  'media/gallery.md': md(`# media/

## Cottage

![Measuring the floor frame, ten by ten, give or take](cottage-floor-frame.webp)
![Granite foundation stones](cottage-stone-foundations.webp)
![The frame, level and raised](cottage-frame-complete.webp)

## Hardware

![ESP32 blink, simulated in designElectronics](esp32-blink.gif)
![RoastIQ, exploded](roastiq.webp)

## Screens

![AnyGarbs](anygarbs.gif)
![designElectronics on a phone](de-phone.webp)
![Arduino tour](arduino-tour.mp4)
`),
  'media/anygarbs.gif': image('/media/anygarbs.gif', 'anygarbs.com hero, pixel-art swarm at work'),
  'media/anygarbs.webp': image('/media/anygarbs.webp', 'anygarbs.com'),
  'media/cottage-floor-frame.webp': image('/media/cottage-floor-frame.webp', 'Measuring the floor frame'),
  'media/cottage-stone-foundations.webp': image('/media/cottage-stone-foundations.webp', 'Granite foundation stones'),
  'media/cottage-frame-complete.webp': image('/media/cottage-frame-complete.webp', 'The frame, level and raised'),
  'media/roastiq.webp': image('/media/roastiq.webp', 'RoastIQ: ESP32 + two MAX6675 thermocouple boards'),
  'media/dweepa.webp': image('/media/dweepa.webp', 'Dweepa: A Tale of Tides and Steel'),
  'media/esp32-blink.gif': image(`${DE}/video/esp32-blink.gif`, 'ESP32 blink in the designElectronics simulator'),
  'media/de-breadboard.webp': image(`${DE}/img/breadboard.webp`, 'designElectronics breadboard view'),
  'media/de-pcb.webp': image(`${DE}/img/pcb.webp`, 'designElectronics PCB view'),
  'media/de-phone.webp': image(`${DE}/img/phone.webp`, 'designElectronics on a phone'),
  'media/myfiles-search.webp': image('https://rorretbolt.github.io/MyFiles/img/search.webp', 'MyFiles search'),
  'media/555-blinker.mp4': video(`${DE}/video/reel-555-blinker.mp4`, `${DE}/video/reel-555-blinker.jpg`, '555 blinker: breadboard to PCB'),
  'media/arduino-tour.mp4': video(`${DE}/video/youtube-tour-arduino.mp4`, `${DE}/video/youtube-tour-arduino.jpg`, 'designElectronics tour with an Arduino'),
};

export default files;
