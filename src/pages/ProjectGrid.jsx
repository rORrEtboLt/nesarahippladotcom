import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import projects from '../content/projects.json';
import profile from '../content/profile.json';

export default function ProjectGrid() {
  return (
    <>
      <Helmet>
        <title>{profile.name}</title>
        <meta name="description" content={profile.tagline} />
      </Helmet>

      <div className="page">
        <header className="page-header">
          <div className="page-header-inner">
            <Link to="/" className="brand">{profile.name}</Link>
            <nav className="header-nav">
              <Link to="/about">About</Link>
            </nav>
          </div>
        </header>

        <main className="page-main">
          <div className="project-grid">
            {projects.map((project) => (
              <Link
                key={project.slug}
                to={`/work/${project.slug}`}
                className="project-tile"
              >
                <div className="tile-img">
                  <img
                    src={project.images[0]}
                    alt={project.name}
                    loading="lazy"
                  />
                </div>
                <div className="tile-name">{project.name}</div>
                <div className="tile-desc">{project.tagline}</div>
              </Link>
            ))}
          </div>
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
