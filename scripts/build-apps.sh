#!/usr/bin/env bash
# Build the games and apps that run in windows on the homepage.
#
# Each repo is cloned (shallow, default branch), built for the web, and its
# output copied into public/apps/<slug>/ so CRA ships it as static files.
# SDL3 repos are compiled with Emscripten, so `emcmake` must be on PATH
# (CI uses mymindstorm/setup-emsdk; locally: `source ~/emsdk/emsdk_env.sh`).
#
#   npm run build:apps            # build everything
#   npm run build:apps maayavi    # build only the named apps
#
# The window list itself lives in src/content/apps.js.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/apps"
WORK="${APPS_WORK_DIR:-$ROOT/.apps-build}"
GH="https://github.com/rORrEtboLt"
JOBS="$(nproc 2>/dev/null || echo 4)"

mkdir -p "$OUT" "$WORK"

clone() { # clone <repo> -> prints the checkout path
  local dir="$WORK/$1"
  if [ -d "$dir/.git" ]; then
    git -C "$dir" pull -q --ff-only >&2
  else
    git clone -q --depth 1 "$GH/$1.git" "$dir" >&2
  fi
  echo "$dir"
}

fresh() { rm -rf "$OUT/$1" && mkdir -p "$OUT/$1" && echo "$OUT/$1"; }

# Enchantress (repo: sdl3-games) - C + SDL3, ships its own Emscripten shell page.
build_maayavi() {
  local src dst
  src="$(clone sdl3-games)"
  emcmake cmake -S "$src" -B "$src/build-web" -DCMAKE_BUILD_TYPE=Release
  cmake --build "$src/build-web" -j"$JOBS"
  dst="$(fresh maayavi)"
  cp "$src/build-web/maayavi.html" "$dst/index.html"
  cp "$src/build-web/maayavi.js" "$src/build-web/maayavi.wasm" "$dst/"
}

# designElectronics - C++17 + SDL3 + SDL3_ttf, started by docs/app/loader.js.
build_designelectronics() {
  local src dst
  src="$(clone designElectronics)"
  [ -d "$src/external/SDL" ] ||
    git clone -q --depth 1 -b release-3.4.x https://github.com/libsdl-org/SDL.git "$src/external/SDL"
  [ -d "$src/external/SDL_ttf" ] ||
    git clone -q --depth 1 --recursive -b release-3.2.x https://github.com/libsdl-org/SDL_ttf.git "$src/external/SDL_ttf"
  emcmake cmake -S "$src" -B "$src/build-web" -DCMAKE_BUILD_TYPE=Release
  cmake --build "$src/build-web" -j"$JOBS"
  dst="$(fresh designelectronics)"
  cp "$src/docs/app/index.html" "$src/docs/app/loader.js" "$dst/"
  cp "$src/build-web/designElectronics."{js,wasm,data} "$dst/"
}

# Adventures with Buster - Godot 4 + GDExtension; the web export is committed in dist/.
build_buster() {
  local src dst
  src="$(clone -do-naina-india-platformer)"
  dst="$(fresh buster)"
  cp -R "$src/dist/." "$dst/"
}

# Dweepa - TypeScript + canvas, built with Vite.
build_dweepa() {
  local src dst
  src="$(clone dweepa)"
  (cd "$src" && npm ci --no-audit --no-fund && npx tsc -b && npx vite build --base=./)
  dst="$(fresh dweepa)"
  cp -R "$src/dist/." "$dst/"
}

APPS=("$@")
[ ${#APPS[@]} -gt 0 ] || APPS=(maayavi designelectronics buster dweepa)

for app in "${APPS[@]}"; do
  echo "▶ $app"
  "build_$app"
done

echo "✔ apps built into public/apps/"
