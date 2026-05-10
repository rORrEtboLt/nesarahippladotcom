import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import profile from '../content/profile.json';
import projects from '../content/projects.json';
import LinkIcon3D from '../components/island/LinkIcon3D';

const SceneCanvas = lazy(() => import('../components/island/SceneCanvas'));

const VISIBLE_SLUGS = ['cottage', 'farm'];

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export default function LinkTree() {
  const reducedMotion = useReducedMotion();
  const [hoveredSlug, setHoveredSlug] = useState(null);
  const visibleProjects = projects.filter(p => VISIBLE_SLUGS.includes(p.slug));

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
            {visibleProjects.map((project) => (
              <Link
                key={project.slug}
                to={`/work/${project.slug}`}
                className="linktree-link"
                onMouseEnter={() => setHoveredSlug(project.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
              >
                {!reducedMotion && (
                  <LinkIcon3D type={project.slug} hovered={hoveredSlug === project.slug} />
                )}
                <div className="linktree-link-content">
                  <span className="linktree-link-text">{project.name}</span>
                  <span className="linktree-link-sub">{project.tagline}</span>
                </div>
              </Link>
            ))}

            <a
              href="https://rorretbolt.github.io/dweepa/"
              target="_blank"
              rel="noreferrer"
              className="linktree-link"
              onMouseEnter={() => setHoveredSlug('dweepa')}
              onMouseLeave={() => setHoveredSlug(null)}
            >
              {!reducedMotion && (
                <LinkIcon3D type="dweepa" hovered={hoveredSlug === 'dweepa'} />
              )}
              <div className="linktree-link-content">
                <span className="linktree-link-text">Dweepa</span>
                <span className="linktree-link-sub">An island defense game made with Claude</span>
              </div>
            </a>

            <div className="linktree-divider" />

            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              className="linktree-link"
              onMouseEnter={() => setHoveredSlug('github')}
              onMouseLeave={() => setHoveredSlug(null)}
            >
              {!reducedMotion && (
                <LinkIcon3D type="github" hovered={hoveredSlug === 'github'} />
              )}
              <div className="linktree-link-content">
                <span className="linktree-link-text">GitHub</span>
              </div>
            </a>

            <a
              href={profile.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="linktree-link"
              onMouseEnter={() => setHoveredSlug('instagram')}
              onMouseLeave={() => setHoveredSlug(null)}
            >
              {!reducedMotion && (
                <LinkIcon3D type="instagram" hovered={hoveredSlug === 'instagram'} />
              )}
              <div className="linktree-link-content">
                <span className="linktree-link-text">Instagram</span>
              </div>
            </a>

            <a
              href={`mailto:${profile.email}`}
              className="linktree-link"
              onMouseEnter={() => setHoveredSlug('email')}
              onMouseLeave={() => setHoveredSlug(null)}
            >
              {!reducedMotion && (
                <LinkIcon3D type="email" hovered={hoveredSlug === 'email'} />
              )}
              <div className="linktree-link-content">
                <span className="linktree-link-text">Email</span>
              </div>
            </a>
          </div>

          <footer className="linktree-footer">
            <p>&copy; {new Date().getFullYear()} {profile.name}</p>
          </footer>
        </div>
      </div>

      {!reducedMotion && (
        <Suspense fallback={null}>
          <SceneCanvas />
        </Suspense>
      )}
    </>
  );
}
