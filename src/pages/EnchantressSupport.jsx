import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import profile from '../content/profile.json';

export default function EnchantressSupport() {
  return (
    <>
      <Helmet>
        <title>Enchantress — Support</title>
        <meta name="description" content="Get help with Enchantress, the dice lane defense game." />
      </Helmet>

      <div className="page">
        <header className="page-header">
          <div className="page-header-inner">
            <Link to="/" className="brand">{profile.name}</Link>
            <nav className="header-nav">
              <Link to="/enchantress">Enchantress</Link>
            </nav>
          </div>
        </header>

        <main className="page-main">
          <div className="enchantress-page">
            <h1>Enchantress — Support</h1>
            <p className="enchantress-subtitle">Dice Lane Defense</p>

            <section>
              <h2>Contact</h2>
              <p>
                Found a bug or have a question? Email me at{' '}
                <a href={`mailto:${profile.email}?subject=Enchantress%20Support`}>{profile.email}</a>.
                Include what device you're playing on, what happened, and what you expected.
                I try to respond within a day or two.
              </p>
            </section>

            <section>
              <h2>FAQ</h2>

              <h3>The game is running slowly</h3>
              <p>
                Try closing other apps to free up memory. On iOS, make sure Low Power Mode
                is off. The game runs best on iPhone 8 or newer.
              </p>

              <h3>My progress was lost</h3>
              <p>
                Enchantress does not save mid-run progress. Each game is a fresh run from
                Wave 1. Your settings (difficulty, audio) are saved between sessions.
              </p>

              <h3>How do I place units?</h3>
              <p>
                Tap a dice to roll it, then drag the result onto any empty cell on the
                battlefield. Each dice face summons a different unit type.
              </p>
            </section>
          </div>
        </main>

        <footer className="page-footer">
          <div className="footer-inner">
            <nav className="footer-links">
              <Link to="/enchantress">Enchantress</Link>
              <Link to="/enchantress/support">Support</Link>
              <Link to="/enchantress/privacy">Privacy</Link>
              <a href={`mailto:${profile.email}`}>Email</a>
            </nav>
            <p className="footer-copy">&copy; {new Date().getFullYear()} {profile.name}</p>
          </div>
        </footer>
      </div>
    </>
  );
}
