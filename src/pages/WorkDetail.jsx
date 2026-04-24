import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import projects from '../content/projects.json';
import profile from '../content/profile.json';

export default function WorkDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="page">
        <main className="page-main" style={{ paddingTop: 64 }}>
          <p>Project not found. <Link to="/">Back to all work</Link></p>
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.name} — {profile.name}</title>
        <meta name="description" content={project.tagline} />
      </Helmet>

      <div className="page">
        <header className="page-header">
          <div className="page-header-inner">
            <Link to="/" className="brand">{profile.name}</Link>
            <nav className="header-nav">
              <Link to="/about">About</Link>
              <Link to="/play">Play</Link>
            </nav>
          </div>
        </header>

        <main className="page-main">
          <img
            className="work-hero"
            src={project.images[0]}
            alt={project.name}
          />

          <div className="work-header">
            <h1 className="work-title">{project.name}</h1>
            <p className="work-tagline">{project.tagline}</p>
          </div>

          <div className="work-story">
            {project.story.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="work-gallery">
            {project.images.slice(1).map((src, i) => (
              <img key={i} src={src} alt={`${project.name} ${i + 2}`} />
            ))}
          </div>

          <div className="work-closing">
            <p>{project.closing}</p>
          </div>

          <div className="work-contact">
            <p>Interested in a commission or collaboration?</p>
            <a href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </div>

          <Link to="/" className="back-link">
            &larr; All work
          </Link>
        </main>

        <footer className="page-footer">
          <div className="footer-inner">
            <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="your@email.com" aria-label="Email for newsletter" />
              <button type="submit">Subscribe</button>
            </form>
            <nav className="footer-links">
              <a href={`mailto:${profile.email}`}>Email</a>
              <a href={profile.socials.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={profile.socials.twitter} target="_blank" rel="noreferrer">Twitter</a>
            </nav>
            <p className="footer-copy">&copy; {new Date().getFullYear()} {profile.name}</p>
          </div>
        </footer>
      </div>
    </>
  );
}
