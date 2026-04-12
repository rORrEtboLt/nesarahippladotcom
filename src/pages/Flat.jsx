import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import profile from '../content/profile.json';
import projects from '../content/projects.json';
import posts from '../content/posts';

const SUPPORT = [
  { key: 'buyMeACoffee', label: 'Buy me a coffee' },
  { key: 'patreon', label: 'Patreon' },
  { key: 'githubSponsors', label: 'GitHub Sponsors' },
];

export default function Flat() {
  return (
    <div className="flat-wrap">
      <div className="flat-container">
        <nav className="flat-nav" aria-label="Sections">
          <Link to="/" className="brand">
            <span className="brand-mark">◆</span> {profile.name}
          </Link>
          <a href="#about">About</a>
          <a href="#blog">Blog</a>
          <a href="#projects">Projects</a>
          <a href="#support">Support</a>
          <a href="#contact">Contact</a>
          <Link to="/">← Interactive view</Link>
        </nav>

        <section id="about" className="flat-section">
          <h2>About</h2>
          <p className="lead">{profile.tagline}</p>
          <p>{profile.bio}</p>
          <p>
            Email: <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
          <div className="socials">
            {Object.entries(profile.socials).map(([k, url]) => (
              <a key={k} href={url} target="_blank" rel="noreferrer">
                {k}
              </a>
            ))}
          </div>
        </section>

        <section id="blog" className="flat-section">
          <h2>Blog</h2>
          {posts.map((p) => (
            <article key={p.slug} style={{ marginBottom: 40 }}>
              <h3>{p.title}</h3>
              <time className="muted">{p.date}</time>
              <div className="post-body">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {p.content}
                </ReactMarkdown>
              </div>
            </article>
          ))}
        </section>

        <section id="projects" className="flat-section">
          <h2>Projects</h2>
          <ul className="project-grid">
            {projects.map((p) => (
              <li key={p.name} className="project-card">
                <a href={p.url} target="_blank" rel="noreferrer" className="project-link">
                  <div className="project-head">
                    <h3>{p.name}</h3>
                    {p.stars ? <span className="stars">★ {p.stars}</span> : null}
                  </div>
                  <p>{p.description}</p>
                  <div className="tag-row">
                    {p.language && <span className="tag lang">{p.language}</span>}
                    {(p.tags || []).map((t) => (
                      <span key={t} className="tag">#{t}</span>
                    ))}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="support" className="flat-section">
          <h2>Support my work</h2>
          <ul className="support-grid">
            {SUPPORT.map((s) => {
              const url = profile.support[s.key];
              const disabled = !url || url.endsWith('/');
              return (
                <li key={s.key} className="support-card">
                  <h3>{s.label}</h3>
                  {disabled ? (
                    <p className="muted">Coming soon.</p>
                  ) : (
                    <a className="btn" href={url} target="_blank" rel="noreferrer">
                      Open {s.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section id="contact" className="flat-section">
          <h2>Contact</h2>
          <p>
            Drop a line to{' '}
            <a href={`mailto:${profile.email}`}>{profile.email}</a> — I read
            every message.
          </p>
        </section>
      </div>
    </div>
  );
}
