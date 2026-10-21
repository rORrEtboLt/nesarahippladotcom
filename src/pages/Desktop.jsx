import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import apps, { moreRepos } from '../content/apps';
import files from '../content/files';
import '../styles/desktop.css';

const asset = (path) => `${process.env.PUBLIC_URL}/${path}`;

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return <span>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>;
}

// One app in a small window. The iframe is only mounted while running, so
// stopping a window frees its WebAssembly memory.
function AppWindow({ app }) {
  const ref = useRef(null);
  const [running, setRunning] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [reloads, setReloads] = useState(0);

  // Autoplay apps start the first time their window scrolls into view.
  useEffect(() => {
    if (!app.autoplay || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRunning(true);
        io.disconnect();
      }
    }, { rootMargin: '100px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [app.autoplay]);

  useEffect(() => {
    if (!maximized) return;
    const onKey = (e) => e.key === 'Escape' && setMaximized(false);
    document.body.classList.add('dt-locked');
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('dt-locked');
      window.removeEventListener('keydown', onKey);
    };
  }, [maximized]);

  const run = () => {
    setRunning(true);
    setMinimized(false);
  };

  const cls = ['dt-window', app.wide && 'wide', minimized && 'minimized', maximized && 'maximized']
    .filter(Boolean)
    .join(' ');

  return (
    <article ref={ref} className={cls} style={{ '--app-color': app.color }} aria-label={app.name}>
      <header className="dt-titlebar" onDoubleClick={() => setMaximized((m) => !m)}>
        <div className="dt-lights">
          <button className="dt-light close" onClick={() => setRunning(false)} title="Stop" aria-label={`Stop ${app.name}`} />
          <button className="dt-light min" onClick={() => setMinimized((m) => !m)} title="Minimize" aria-label={`Minimize ${app.name}`} />
          <button className="dt-light max" onClick={() => setMaximized((m) => !m)} title={maximized ? 'Restore' : 'Maximize'} aria-label={`${maximized ? 'Restore' : 'Maximize'} ${app.name}`} />
        </div>
        <h2 className="dt-title">{app.name}</h2>
        <div className="dt-actions">
          {running && (
            <button onClick={() => setReloads((n) => n + 1)} title="Restart" aria-label={`Restart ${app.name}`}>⟳</button>
          )}
          <a href={asset(app.src)} target="_blank" rel="noreferrer" title="Open in a new tab" aria-label={`Open ${app.name} in a new tab`}>↗</a>
        </div>
      </header>

      <div className="dt-body" hidden={minimized}>
        {running ? (
          <iframe
            key={reloads}
            src={asset(app.src)}
            title={app.name}
            allow="autoplay; fullscreen; gamepad; clipboard-write"
            allowFullScreen
          />
        ) : (
          <button className="dt-poster" onClick={run} style={app.poster ? { backgroundImage: `url(${asset(app.poster)})` } : undefined}>
            <span className="dt-poster-name">{app.name}</span>
            <span className="dt-poster-run">▶ Run <small>{app.size}</small></span>
          </button>
        )}
      </div>

      <footer className="dt-status">
        <span className="dt-tagline">{app.tagline}</span>
        <span className="dt-stack">
          {app.stack.map((s) => <code key={s}>{s}</code>)}
          <a href={app.repo} target="_blank" rel="noreferrer">source ↗</a>
        </span>
      </footer>
    </article>
  );
}

export default function Desktop() {
  const navigate = useNavigate();

  // Old homepage links (/#projects/x.md) now live in the editor at /code.
  useEffect(() => {
    const path = decodeURIComponent(window.location.hash.replace(/^#\/?/, ''));
    if (files[path] !== undefined) navigate(`/code#${path}`, { replace: true });
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Nesara Hippla</title>
        <meta name="theme-color" content="#141414" />
      </Helmet>

      <div className="dt">
        <nav className="dt-menubar">
          <span className="dt-brand"><i aria-hidden="true" /> nesarahippla</span>
          <span className="dt-menu">
            <Link to="/code">README.md</Link>
            <a href="https://github.com/rORrEtboLt" target="_blank" rel="noreferrer">github ↗</a>
            <a href="mailto:nesara.hippla@gmail.com">email</a>
            <span className="dt-hide-mobile"><Clock /></span>
          </span>
        </nav>

        <header className="dt-intro">
          <h1>Nesara Hippla</h1>
          <p>
            Programmer, farmer and builder on a coffee estate in Chikmaglur. These are my games and
            apps, compiled to WebAssembly and running live in the windows below. Click into one to
            play. More about me in <Link to="/code">README.md</Link>.
          </p>
        </header>

        <main className="dt-grid">
          {apps.map((app) => <AppWindow key={app.slug} app={app} />)}
        </main>

        <section className="dt-more">
          <h2>Not in a window yet</h2>
          <ul>
            {moreRepos.map((r) => (
              <li key={r.name}>
                <a href={r.href} target="_blank" rel="noreferrer">{r.name}</a> {r.about}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
