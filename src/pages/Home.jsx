import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import files from '../content/files';
import Terminal from '../components/vscode/Terminal';
import '../styles/vscode.css';

const ROOT = 'nesarahippla';
const DEFAULT_FILE = 'README.md';
const isMobile = () => window.innerWidth <= 800;

// Explorer tree: folders first (like VS Code), then root files.
function buildTree() {
  const folders = {};
  const rootFiles = [];
  Object.keys(files).forEach((path) => {
    const parts = path.split('/');
    if (parts.length === 1) rootFiles.push(path);
    else (folders[parts[0]] = folders[parts[0]] || []).push(path);
  });
  return { folders, rootFiles };
}

function fileFromHash() {
  const path = decodeURIComponent(window.location.hash.replace(/^#\/?/, ''));
  return files[path] !== undefined ? path : DEFAULT_FILE;
}

function resolvePath(from, href) {
  const out = from.includes('/') ? from.split('/').slice(0, -1) : [];
  href.split('/').forEach((seg) => {
    if (seg === '..') out.pop();
    else if (seg && seg !== '.') out.push(seg);
  });
  const path = out.join('/');
  return files[path] !== undefined ? path : href;
}

// --- Markdown source highlighting ---------------------------------------

const INLINE = /(\[[^\]]+\]\([^)]+\))|(`[^`]+`)|(\*\*[^*]+\*\*)|([\w.+-]+@[\w-]+\.[\w.]+)/g;

function Inline({ text, current, open }) {
  const out = [];
  let last = 0;
  let m;
  const re = new RegExp(INLINE);
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = m.index;
    if (m[1]) {
      const [, label, href] = m[1].match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const inner = (
        <>
          <span className="md-punct">[</span>
          <span className="md-link-text">{label}</span>
          <span className="md-punct">](</span>
          <span className="md-link-url">{href}</span>
          <span className="md-punct">)</span>
        </>
      );
      const target = resolvePath(current, href);
      if (files[target]) {
        out.push(
          <a key={key} href={`#${target}`} className="md-link" onClick={(e) => { e.preventDefault(); open(target); }}>
            {inner}
          </a>
        );
      } else if (href.startsWith('/')) {
        out.push(<Link key={key} to={href} className="md-link">{inner}</Link>);
      } else {
        out.push(<a key={key} href={href} target="_blank" rel="noreferrer" className="md-link">{inner}</a>);
      }
    } else if (m[2]) {
      out.push(<span key={key} className="md-code">{m[2]}</span>);
    } else if (m[3]) {
      out.push(<span key={key} className="md-bold">{m[3]}</span>);
    } else if (m[4]) {
      out.push(<a key={key} href={`mailto:${m[4]}`} className="md-link md-link-url">{m[4]}</a>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Media({ file, alt, onClick }) {
  if (file.type === 'video') {
    return (
      <video
        src={file.src}
        poster={file.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt || file.caption}
        onClick={onClick}
      />
    );
  }
  return <img src={file.src} alt={alt || file.caption} loading="lazy" onClick={onClick} />;
}

function Line({ line, current, open }) {
  let m;
  if ((m = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/))) {
    const target = resolvePath(current, m[2]);
    const file = files[target];
    return (
      <>
        <span className="md-punct">![</span>
        <span className="md-link-text">{m[1]}</span>
        <span className="md-punct">](</span>
        <span className="md-link-url">{m[2]}</span>
        <span className="md-punct">)</span>
        {file && (
          <span className="md-media">
            <Media file={file} alt={m[1]} onClick={() => open(target)} />
          </span>
        )}
      </>
    );
  }
  if ((m = line.match(/^(#{1,6} )(.*)$/))) {
    return (
      <span className="md-heading">
        <span className="md-heading-mark">{m[1]}</span>
        <Inline text={m[2]} current={current} open={open} />
      </span>
    );
  }
  if ((m = line.match(/^(> )(.*)$/))) {
    return <span className="md-quote">{m[1]}<Inline text={m[2]} current={current} open={open} /></span>;
  }
  if ((m = line.match(/^(\s*)([-*]|\d+\.)( .*)$/))) {
    return (
      <>
        {m[1]}<span className="md-list">{m[2]}</span>
        <Inline text={m[3]} current={current} open={open} />
      </>
    );
  }
  return <Inline text={line} current={current} open={open} />;
}

// --- Chrome --------------------------------------------------------------

function FileIcon({ path }) {
  const type = files[path]?.type;
  if (type === 'image') return <span className="vs-icon vs-icon-img" aria-hidden="true">▣</span>;
  if (type === 'video') return <span className="vs-icon vs-icon-vid" aria-hidden="true">▶</span>;
  if (type === 'app' && path.endsWith('.ts')) return <span className="vs-icon vs-icon-ts" aria-hidden="true">TS</span>;
  if (type === 'app') return <span className="vs-icon vs-icon-wasm" aria-hidden="true">WA</span>;
  return <span className="vs-icon vs-icon-md" aria-hidden="true">M↓</span>;
}

function ActivityIcon({ d, active, label }) {
  return (
    <div className={`vs-activity-item${active ? ' active' : ''}`} title={label} aria-hidden="true">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d={d} />
      </svg>
    </div>
  );
}

// Runs a build from public/apps/ in the editor. Big downloads wait for a click.
function AppView({ path, file }) {
  const [running, setRunning] = useState(!file.size);
  const [reloads, setReloads] = useState(0);
  const src = `${process.env.PUBLIC_URL}/${file.src}`;
  return (
    <div className="vs-app">
      <div className="vs-app-bar">
        <span className="vs-app-cmd">$ emrun {path}</span>
        <span className="vs-app-stack">{file.stack.join(' · ')}</span>
        <span className="vs-app-actions">
          {running && <button onClick={() => setReloads((n) => n + 1)} title="Restart">⟳ restart</button>}
          <a href={src} target="_blank" rel="noreferrer">fullscreen ↗</a>
          <a href={file.repo} target="_blank" rel="noreferrer">source ↗</a>
        </span>
      </div>
      {running ? (
        <iframe
          key={reloads}
          className="vs-app-frame"
          src={src}
          title={path}
          allow="autoplay; fullscreen; gamepad; clipboard-write"
          allowFullScreen
        />
      ) : (
        <button className="vs-app-run" onClick={() => setRunning(true)}>
          ▶ Run {path.split('/').pop()} <small>{file.size}</small>
        </button>
      )}
    </div>
  );
}

function Editor({ path, open }) {
  const file = files[path];
  if (file.type === 'app') return <AppView key={path} path={path} file={file} />;
  if (file.type === 'image' || file.type === 'video') {
    return (
      <div className="vs-preview">
        <Media file={file} />
        <p className="vs-preview-caption">{file.caption}</p>
      </div>
    );
  }
  const lines = file.content.replace(/\n$/, '').split('\n');
  return (
    <div className="vs-lines">
      {lines.map((line, i) => (
        <div className="vs-line" key={`${path}-${i}`}>
          <span className="vs-ln">{i + 1}</span>
          <span className="vs-code"><Line line={line} current={path} open={open} />{'\n'}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [current, setCurrent] = useState(fileFromHash);
  const [tabs, setTabs] = useState(() => Array.from(new Set([DEFAULT_FILE, fileFromHash()])));
  const [openFolders, setOpenFolders] = useState({ now: true, projects: true, games: true });
  const [sidebar, setSidebar] = useState(() => !isMobile());
  const [panel, setPanel] = useState(() => !isMobile());
  const { folders, rootFiles } = buildTree();

  useEffect(() => {
    const onHash = () => open(fileFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  });

  function open(path) {
    setTabs((t) => (t.includes(path) ? t : [...t, path]));
    setCurrent(path);
    const folder = path.includes('/') ? path.split('/')[0] : null;
    if (folder) setOpenFolders((f) => ({ ...f, [folder]: true }));
    if (window.location.hash !== `#${path}`) window.history.replaceState(null, '', `#${path}`);
    if (isMobile()) setSidebar(false);
    document.querySelector('.vs-editor')?.scrollTo(0, 0);
  }

  function close(path, e) {
    e.stopPropagation();
    const next = tabs.filter((t) => t !== path);
    if (!next.length) next.push(DEFAULT_FILE);
    setTabs(next);
    if (path === current) open(next[next.length - 1]);
  }

  const file = files[current];
  const name = current.split('/').pop();
  const lineCount = file.type === 'md' ? file.content.replace(/\n$/, '').split('\n').length : 0;
  const language = file.type === 'app'
    ? (current.endsWith('.ts') ? 'TypeScript' : 'WebAssembly')
    : { md: 'Markdown', image: 'Image', video: 'Video' }[file.type];

  const fileRow = (path, depth) => (
    <button
      key={path}
      className={`vs-tree-row${path === current ? ' selected' : ''}`}
      style={{ paddingLeft: 8 + depth * 12 }}
      onClick={() => open(path)}
    >
      <span className="vs-chevron" /> <FileIcon path={path} /> {path.split('/').pop()}
    </button>
  );

  return (
    <>
      <Helmet>
        <title>Nesara Hippla</title>
        <meta name="theme-color" content="#181818" />
      </Helmet>

      <div className="vs">
        <div className="vs-titlebar">
          <div className="vs-lights" aria-hidden="true"><i /><i /><i /></div>
          <button className="vs-menu" onClick={() => setSidebar((s) => !s)} aria-label="Toggle explorer">☰</button>
          <div className="vs-title">{name} — {ROOT}</div>
        </div>

        <div className="vs-body">
          <nav className="vs-activity" aria-hidden="true">
            <ActivityIcon active label="Explorer" d="M14 3H7a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7zM14 3v4h4M3 7v13a1 1 0 0 0 1 1h10" />
            <ActivityIcon label="Search" d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 21 21" />
            <ActivityIcon label="Source Control" d="M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9" />
            <ActivityIcon label="Run" d="M7 4v16l13-8z" />
            <ActivityIcon label="Extensions" d="M4 4h7v7H4zM13 13h7v7h-7zM4 13h7v7H4zM15 3l5 5-5 5-5-5z" />
          </nav>

          {sidebar && (
            <aside className="vs-sidebar">
              <div className="vs-sidebar-title">EXPLORER</div>
              <div className="vs-tree-root">⌄ {ROOT.toUpperCase()}</div>
              {Object.keys(folders).sort().map((folder) => (
                <div key={folder}>
                  <button
                    className="vs-tree-row vs-folder"
                    style={{ paddingLeft: 8 }}
                    onClick={() => setOpenFolders((f) => ({ ...f, [folder]: !f[folder] }))}
                  >
                    <span className="vs-chevron">{openFolders[folder] ? '⌄' : '›'}</span> {folder}
                  </button>
                  {openFolders[folder] && folders[folder].map((p) => fileRow(p, 1))}
                </div>
              ))}
              {rootFiles.map((p) => fileRow(p, 0))}

              <div className="vs-sidebar-links">
                <a href="https://github.com/rORrEtboLt" target="_blank" rel="noreferrer">github ↗</a>
                <a href="https://www.instagram.com/nesara.hippla/" target="_blank" rel="noreferrer">instagram ↗</a>
                <a href="mailto:nesara.hippla@gmail.com">email</a>
              </div>
            </aside>
          )}

          <main className="vs-main">
            <div className="vs-tabs">
              {tabs.map((t) => (
                <div
                  key={t}
                  className={`vs-tab${t === current ? ' active' : ''}`}
                  onClick={() => open(t)}
                  role="tab"
                  aria-selected={t === current}
                >
                  <FileIcon path={t} /> {t.split('/').pop()}
                  <button className="vs-tab-close" onClick={(e) => close(t, e)} aria-label={`Close ${t}`}>×</button>
                </div>
              ))}
            </div>
            <div className="vs-breadcrumbs">
              {[ROOT, ...current.split('/')].join(' › ')}
            </div>
            <div className="vs-editor">
              <Editor path={current} open={open} />
            </div>

            <section className={`vs-panel${panel ? ' open' : ''}`}>
              <div className="vs-panel-head">
                <span className="vs-panel-tab vs-hide-mobile">PROBLEMS</span>
                <span className="vs-panel-tab vs-hide-mobile">OUTPUT</span>
                <button className="vs-panel-tab active" onClick={() => setPanel(true)}>TERMINAL</button>
                <span className="vs-panel-spacer" />
                <span className="vs-panel-shell vs-hide-mobile">zsh</span>
                <button className="vs-panel-toggle" onClick={() => setPanel((p) => !p)} aria-label={panel ? 'Hide terminal' : 'Show terminal'}>
                  {panel ? '⌄' : '⌃'}
                </button>
              </div>
              <div className="vs-panel-body" hidden={!panel}>
                <Terminal open={open} />
              </div>
            </section>
          </main>
        </div>

        <footer className="vs-status">
          <span>⎇ master</span>
          <span className="vs-status-right">
            {lineCount > 0 && <span>Ln {lineCount}, Col 1</span>}
            <span>UTF-8</span>
            <span>{language}</span>
          </span>
        </footer>
      </div>
    </>
  );
}
