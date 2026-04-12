import React from 'react';
import profile from '../../content/profile.json';

export default function AboutPanel() {
  return (
    <div className="about-panel">
      <p className="lead">{profile.tagline}</p>
      <p>{profile.bio}</p>
      <dl className="about-meta">
        <div>
          <dt>Based in</dt>
          <dd>{profile.location}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </dd>
        </div>
      </dl>
      <div className="socials">
        {Object.entries(profile.socials).map(([key, url]) => (
          <a key={key} href={url} target="_blank" rel="noreferrer">
            {key}
          </a>
        ))}
      </div>
    </div>
  );
}
