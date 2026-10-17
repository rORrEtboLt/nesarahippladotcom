import React, { useEffect, useRef } from 'react';

// Chrome-dino style runner. The dino is Buster; the cacti are coffee bushes and rocks.

const PX = 4;
const BODY = [
  '...........kk...',
  '..........####..',
  '..........#k###k',
  'k.........####..',
  '.k##########....',
  '.###########....',
  '.###########....',
];
const LEGS = [
  ['..#.#.....#.#...', '..#.#.....#.#...'],
  ['..#.......#.....', '.#.......#......'],
  ['....#.......#...', '.....#.......#..'],
];
const COLORS = { '#': '#c98f56', k: '#3b2a1a' };
const DOG_W = 16 * PX;
const DOG_H = (BODY.length + 2) * PX;
const TOKENS = ['{ }', '</>', ';', '=>', '[]', '&&', '#!', '()'];

function readHi() {
  try { return Number(localStorage.getItem('buster-hi')) || 0; } catch { return 0; }
}
function writeHi(v) {
  try { localStorage.setItem('buster-hi', String(v)); } catch {}
}

function drawSprite(ctx, rows, x, y) {
  rows.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      const color = COLORS[row[c]];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x + c * PX, y + r * PX, PX, PX);
      }
    }
  });
}

function drawObstacle(ctx, o, groundY) {
  const top = groundY - o.h;
  if (o.kind === 'rock') {
    ctx.fillStyle = '#6e7681';
    ctx.fillRect(o.x + PX, top, o.w - 2 * PX, o.h);
    ctx.fillRect(o.x, top + PX * 2, o.w, o.h - PX * 2);
    return;
  }
  // coffee bush with red cherries
  ctx.fillStyle = '#6a9955';
  ctx.fillRect(o.x + PX * 2, top, o.w - PX * 4, o.h);
  ctx.fillRect(o.x, top + PX * 3, o.w, o.h - PX * 5);
  ctx.fillStyle = '#4b7a3c';
  ctx.fillRect(o.x + o.w / 2 - PX / 2, groundY - PX * 3, PX, PX * 3);
  ctx.fillStyle = '#f14c4c';
  for (let i = 0; i < o.cherries.length; i++) {
    const [cx, cy] = o.cherries[i];
    ctx.fillRect(o.x + cx, top + cy, PX, PX);
  }
}

function makeObstacle(x) {
  if (Math.random() < 0.3) {
    return { kind: 'rock', x, w: PX * 7, h: PX * 4 };
  }
  const w = PX * (6 + Math.floor(Math.random() * 3) * 2);
  const h = PX * (8 + Math.floor(Math.random() * 5));
  const cherries = Array.from({ length: 4 }, () => [
    PX * (1 + Math.floor(Math.random() * (w / PX - 2))),
    PX * (1 + Math.floor(Math.random() * (h / PX - 5))),
  ]);
  return { kind: 'bush', x, w, h, cherries };
}

export default function DinoGame() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W = 0;
    const H = 260;
    const groundY = H - 36;
    const dogX = 48;

    const s = {
      mode: 'ready',
      y: 0,
      vy: 0,
      speed: 380,
      dist: 0,
      hi: readHi(),
      obstacles: [],
      nextGap: 400,
      tokens: [],
      overAt: 0,
      t: 0,
    };

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.clientWidth;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      if (!s.tokens.length) {
        s.tokens = Array.from({ length: 6 }, (_, i) => ({
          x: (W / 6) * i + Math.random() * 60,
          y: 30 + Math.random() * 90,
          text: TOKENS[i % TOKENS.length],
        }));
      }
    }

    function reset() {
      Object.assign(s, { mode: 'run', y: 0, vy: 0, speed: 380, dist: 0, obstacles: [], nextGap: 300 });
    }

    function jump() {
      if (s.mode === 'ready') return reset();
      if (s.mode === 'over') {
        if (performance.now() - s.overAt > 400) reset();
        return;
      }
      if (s.y === 0) s.vy = -780;
    }

    function update(dt) {
      s.t += dt;
      s.tokens.forEach((tk) => {
        tk.x -= (s.mode === 'run' ? s.speed * 0.15 : 15) * dt;
        if (tk.x < -40) {
          tk.x = W + Math.random() * 80;
          tk.y = 30 + Math.random() * 90;
        }
      });
      if (s.mode !== 'run') return;

      s.speed = Math.min(950, s.speed + 10 * dt);
      s.dist += s.speed * dt;
      s.vy += 2500 * dt;
      s.y = Math.min(0, s.y + s.vy * dt);
      if (s.y === 0) s.vy = 0;

      s.obstacles.forEach((o) => { o.x -= s.speed * dt; });
      s.obstacles = s.obstacles.filter((o) => o.x + o.w > -10);

      const last = s.obstacles[s.obstacles.length - 1];
      if (!last || W - (last.x + last.w) > s.nextGap) {
        s.obstacles.push(makeObstacle(W + 10));
        s.nextGap = s.speed * (0.55 + Math.random() * 0.75) + 120;
      }

      const dogTop = groundY - DOG_H + s.y;
      const hit = s.obstacles.some((o) =>
        dogX + DOG_W - 10 > o.x + 4 &&
        dogX + 8 < o.x + o.w - 4 &&
        dogTop + DOG_H - 4 > groundY - o.h + 4
      );
      if (hit) {
        s.mode = 'over';
        s.overAt = performance.now();
        const score = Math.floor(s.dist / 20);
        if (score > s.hi) {
          s.hi = score;
          writeHi(score);
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.font = '14px "JetBrains Mono", Menlo, monospace';

      ctx.fillStyle = '#3a3d41';
      s.tokens.forEach((tk) => ctx.fillText(tk.text, tk.x, tk.y));

      ctx.fillStyle = '#3c3c3c';
      ctx.fillRect(0, groundY, W, 2);
      ctx.fillStyle = '#2f2f2f';
      for (let x = -((s.dist / 2) % 40); x < W; x += 40) ctx.fillRect(x, groundY + 10, 12, 2);

      s.obstacles.forEach((o) => drawObstacle(ctx, o, groundY));

      const running = s.mode === 'run' && s.y === 0;
      const legs = running ? LEGS[1 + (Math.floor(s.dist / 40) % 2)] : LEGS[0];
      const top = groundY - DOG_H + s.y;
      drawSprite(ctx, BODY, dogX, top);
      drawSprite(ctx, legs, dogX, top + BODY.length * PX);

      const score = String(Math.floor(s.dist / 20)).padStart(5, '0');
      ctx.fillStyle = '#9d9d9d';
      ctx.textAlign = 'right';
      ctx.fillText(`HI ${String(s.hi).padStart(5, '0')}  ${score}`, W - 16, 28);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#cccccc';
      if (s.mode === 'ready') {
        ctx.fillText('press space or tap to start', W / 2, 92);
      } else if (s.mode === 'over') {
        ctx.fillText('G A M E   O V E R', W / 2, 84);
        ctx.fillStyle = '#9d9d9d';
        ctx.fillText('space or tap to try again', W / 2, 108);
      }
      ctx.textAlign = 'left';
    }

    let raf;
    let prev = performance.now();
    function frame(now) {
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;
      update(dt);
      draw();
      raf = requestAnimationFrame(frame);
    }

    function onKey(e) {
      if (e.target.closest && e.target.closest('input, textarea')) return;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        jump();
      }
    }
    function onPointer(e) {
      e.preventDefault();
      jump();
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener('keydown', onKey);
    canvas.addEventListener('pointerdown', onPointer);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('keydown', onKey);
      canvas.removeEventListener('pointerdown', onPointer);
    };
  }, []);

  return (
    <div className="vs-game">
      <div className="vs-game-cmd"><span className="md-list">$</span> node games/dino.js</div>
      <p className="vs-game-note">
        <span className="md-quote">{'// Buster never learned fetch. He did learn to jump over coffee bushes.'}</span>
      </p>
      <canvas ref={canvasRef} className="vs-game-canvas" aria-label="Runner game. Press space or tap to jump." />
      <p className="vs-game-note">
        <span className="md-quote">{'// space / ↑ / tap to jump'}</span>
      </p>
    </div>
  );
}
