import React from 'react';
import profile from '../../content/profile.json';

const OPTIONS = [
  {
    key: 'buyMeACoffee',
    label: 'Buy me a coffee',
    blurb: 'One-off coffee to fuel the next project.',
    cta: 'Send a coffee ☕',
    accent: 'coffee',
  },
  {
    key: 'patreon',
    label: 'Patreon',
    blurb: 'Monthly support + early access to projects and posts.',
    cta: 'Become a patron',
    accent: 'patreon',
  },
  {
    key: 'githubSponsors',
    label: 'GitHub Sponsors',
    blurb: 'Sponsor my open-source work directly on GitHub.',
    cta: 'Sponsor on GitHub',
    accent: 'github',
  },
];

export default function SupportPanel() {
  return (
    <div className="support">
      <p className="lead">
        If anything I've built or written has helped you, a tiny tip goes a
        very long way. Thank you. 💛
      </p>
      <ul className="support-grid">
        {OPTIONS.map((opt) => {
          const url = profile.support[opt.key];
          const disabled = !url || url.endsWith('/');
          return (
            <li key={opt.key} className={`support-card accent-${opt.accent}`}>
              <h3>{opt.label}</h3>
              <p>{opt.blurb}</p>
              {disabled ? (
                <button className="btn" disabled>
                  Coming soon
                </button>
              ) : (
                <a className="btn" href={url} target="_blank" rel="noreferrer">
                  {opt.cta}
                </a>
              )}
            </li>
          );
        })}
      </ul>
      <p className="muted small">
        Not in a position to tip? A star on GitHub or a kind note via the
        mailbox means just as much.
      </p>
    </div>
  );
}
