import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import profile from '../content/profile.json';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About — {profile.name}</title>
        <meta name="description" content={profile.bio} />
      </Helmet>

      <div className="page">
        <header className="page-header">
          <div className="page-header-inner">
            <Link to="/" className="brand">{profile.name}</Link>
            <nav className="header-nav">
              <Link to="/about" className="active">About</Link>
            </nav>
          </div>
        </header>

        <main className="page-main">
          <div className="about-layout">
            <div className="about-bio">
              <p>
                {profile.bio}
              </p>

              <h2>Currently</h2>
              <p>
                I'm available for freelance software projects, creative collaborations, and the odd interesting problem. I work across the full stack but am most at home at the intersection of software and physical things — embedded systems, creative tools, and the kind of product that makes you want to show someone.
              </p>
              <p>
                When I'm not writing code, I'm probably painting, in a shop somewhere, or somewhere with no wifi.
              </p>

              <h2>Get in touch</h2>
              <p>
                The best way to reach me is email:{' '}
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                . I try to respond within a day or two. I'm also on GitHub and occasionally Twitter.
              </p>
            </div>

            <aside className="about-sidebar">
              <div className="about-card">
                <h3>Find me</h3>
                <ul>
                  <li><a href={profile.socials.github} target="_blank" rel="noreferrer">GitHub</a></li>
                  <li><a href={profile.socials.twitter} target="_blank" rel="noreferrer">Twitter</a></li>
                  <li><a href={profile.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
                </ul>
              </div>

              <div className="about-card">
                <h3>This site</h3>
                <ul>
                  <li>
                    <Link to="/">All work</Link>
                  </li>
                </ul>
              </div>
            </aside>
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
