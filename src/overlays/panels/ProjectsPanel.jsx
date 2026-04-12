import React, { useEffect, useState } from 'react';
import fallback from '../../content/projects.json';
import profile from '../../content/profile.json';

export default function ProjectsPanel() {
  const [projects, setProjects] = useState(fallback);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const user = profile.githubUsername;
    if (!user) return;
    let cancelled = false;
    setStatus('loading');
    fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=8`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (cancelled) return;
        const mapped = data
          .filter((r) => !r.fork)
          .map((r) => ({
            name: r.name,
            description: r.description || '',
            url: r.html_url,
            stars: r.stargazers_count,
            language: r.language,
            tags: r.topics || [],
          }));
        if (mapped.length) setProjects(mapped);
        setStatus('ok');
      })
      .catch(() => setStatus('error'));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="projects">
      {status === 'error' && (
        <p className="muted">
          Couldn't reach GitHub right now — showing a hand-picked list instead.
        </p>
      )}
      <ul className="project-grid">
        {projects.map((p) => (
          <li key={p.name} className="project-card">
            <a href={p.url} target="_blank" rel="noreferrer" className="project-link">
              <div className="project-head">
                <h3>{p.name}</h3>
                {typeof p.stars === 'number' && (
                  <span className="stars" aria-label={`${p.stars} stars`}>
                    ★ {p.stars}
                  </span>
                )}
              </div>
              <p>{p.description}</p>
              <div className="tag-row">
                {p.language && <span className="tag lang">{p.language}</span>}
                {(p.tags || []).slice(0, 3).map((t) => (
                  <span key={t} className="tag">
                    #{t}
                  </span>
                ))}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
