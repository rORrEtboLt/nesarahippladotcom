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
                I'm available for freelance projects, creative collaborations, and the kind of work that doesn't fit neatly into a category. I'm most at home where software meets the physical world — embedded systems, creative tools, and things that respond to the real environment.
              </p>
              <p>
                When I'm not writing code, I'm roasting coffee, at the pottery wheel, planting trees, sailing, or somewhere without wifi.
              </p>

              <h2>Get in touch</h2>
              <p>
                The best way to reach me is email:{' '}
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                . I try to respond within a day or two. You can also find me on Instagram and GitHub.
              </p>
            </div>

            <aside className="about-sidebar">
              <div className="about-card">
                <h3>Find me</h3>
                <ul>
                  <li><a href={profile.socials.github} target="_blank" rel="noreferrer">GitHub</a></li>
                  <li><a href={profile.socials.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
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
