import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import profile from '../content/profile.json';
import projects from '../content/projects.json';

export default function LinkTree() {
  const upiUrl = `upi://pay?pa=${encodeURIComponent(profile.buyMeCoffee.upiId)}&pn=${encodeURIComponent(profile.name)}&cu=INR`;

  return (
    <>
      <Helmet>
        <title>{profile.name}</title>
        <meta name="description" content={`${profile.tagline} — ${profile.bio}`} />
      </Helmet>

      <div className="linktree">
        <div className="linktree-inner">
          <div className="linktree-profile">
            <div className="linktree-avatar">
              {profile.name.split(' ').map(w => w[0]).join('')}
            </div>
            <h1 className="linktree-name">{profile.name}</h1>
            <p className="linktree-tagline">{profile.tagline}</p>
            <p className="linktree-location">{profile.location}</p>
          </div>

          <div className="linktree-links">
            {projects.map((project) => (
              <Link
                key={project.slug}
                to={`/work/${project.slug}`}
                className="linktree-link"
              >
                <span className="linktree-link-text">{project.name}</span>
                <span className="linktree-link-sub">{project.tagline}</span>
              </Link>
            ))}

            <div className="linktree-divider" />

            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              className="linktree-link"
            >
              <span className="linktree-link-text">GitHub</span>
            </a>

            <a
              href={profile.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="linktree-link"
            >
              <span className="linktree-link-text">Instagram</span>
            </a>

            <a
              href={`mailto:${profile.email}`}
              className="linktree-link"
            >
              <span className="linktree-link-text">Email</span>
            </a>

            <div className="linktree-divider" />

            <a
              href={upiUrl}
              className="linktree-link linktree-link--coffee"
            >
              <span className="linktree-link-text">{profile.buyMeCoffee.label}</span>
              <span className="linktree-link-sub">Support my work via UPI</span>
            </a>
          </div>

          <footer className="linktree-footer">
            <p>&copy; {new Date().getFullYear()} {profile.name}</p>
          </footer>
        </div>
      </div>
    </>
  );
}
