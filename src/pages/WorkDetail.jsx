import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import projects from '../content/projects.json';
import profile from '../content/profile.json';
import VideoCard from '../components/VideoCard';

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
          {(() => {
            const hero = project.images[0];
            const heroSrc = typeof hero === 'string' ? hero : hero.url;
            const heroCaption = typeof hero === 'string' ? null : hero.caption;
            return (
              <figure className="work-hero-figure">
                <img className="work-hero" src={heroSrc} alt={heroCaption || project.name} />
                {heroCaption && <figcaption className="work-img-caption">{heroCaption}</figcaption>}
              </figure>
            );
          })()}

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
            {project.images.slice(1).map((img, i) => {
              const src = typeof img === 'string' ? img : img.url;
              const caption = typeof img === 'string' ? null : img.caption;
              return (
                <figure key={i} className="work-gallery-figure">
                  <img src={src} alt={caption || `${project.name} ${i + 2}`} />
                  {caption && <figcaption className="work-img-caption">{caption}</figcaption>}
                </figure>
              );
            })}
          </div>

          {project.videos && project.videos.length > 0 && (
            <div className="work-videos">
              <h2 className="work-videos-title">Footage</h2>
              <div className="work-video-grid">
                {project.videos.map((video, i) => (
                  <VideoCard key={i} src={video.src} poster={video.poster} caption={video.caption} />
                ))}
              </div>
            </div>
          )}

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
              <a href={profile.socials.instagram} target="_blank" rel="noreferrer">Instagram</a>
            </nav>
            <p className="footer-copy">&copy; {new Date().getFullYear()} {profile.name}</p>
          </div>
        </footer>
      </div>
    </>
  );
}
