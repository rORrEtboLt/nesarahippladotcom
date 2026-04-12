import React from 'react';
import { Link } from 'react-router-dom';
import { useSceneStore, HOTSPOTS } from '../three/store';
import profile from '../content/profile.json';

const LABELS = {
  about: 'About',
  blog: 'Blog',
  projects: 'Projects',
  support: 'Support',
  contact: 'Contact',
};

export default function HUD() {
  const night = useSceneStore((s) => s.night);
  const active = useSceneStore((s) => s.active);
  const setActive = useSceneStore((s) => s.setActive);
  const toggleNight = useSceneStore((s) => s.toggleNight);

  return (
    <>
      <header className="hud hud-top">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden>◆</span>
          <span className="brand-name">{profile.name}</span>
        </Link>
        <nav className="hud-nav" aria-label="Sections">
          {HOTSPOTS.map((id, i) => (
            <button
              key={id}
              className={`hud-link ${active === id ? 'is-active' : ''}`}
              onClick={() => setActive(id)}
            >
              <kbd>{i + 1}</kbd>
              <span>{LABELS[id]}</span>
            </button>
          ))}
        </nav>
        <div className="hud-tools">
          <button
            className="hud-icon"
            onClick={toggleNight}
            aria-label="Toggle day / night"
            title="Toggle day / night"
          >
            {night ? '☾' : '☀'}
          </button>
          <Link to="/flat" className="hud-icon" title="Flat version" aria-label="Flat version">
            ≡
          </Link>
        </div>
      </header>

      {!active && (
        <div className="hud-hint" aria-hidden>
          <span>click an object</span>
          <span className="dot" />
          <span>drag to look · <kbd>esc</kbd> to return</span>
        </div>
      )}
    </>
  );
}
