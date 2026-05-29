import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import profile from '../content/profile.json';

export default function EnchantressPrivacy() {
  return (
    <>
      <Helmet>
        <title>Enchantress — Privacy Policy</title>
        <meta name="description" content="Privacy policy for Enchantress, the dice lane defense game." />
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
            <h1>Enchantress — Privacy Policy</h1>
            <p className="enchantress-subtitle">Last updated: May 29, 2026</p>

            <section>
              <h2>Data Collection</h2>
              <p>
                Enchantress does not collect, store, or transmit any personal data. The game
                runs entirely on your device with no network calls, no analytics, no tracking,
                and no advertising.
              </p>
            </section>

            <section>
              <h2>Local Storage</h2>
              <p>
                The game saves your settings (difficulty mode, audio preferences) locally on
                your device. This data never leaves your device and is deleted when you
                uninstall the app.
              </p>
            </section>

            <section>
              <h2>Third-Party Services</h2>
              <p>
                Enchantress does not use any third-party analytics, advertising, or data
                collection services.
              </p>
            </section>

            <section>
              <h2>Children's Privacy</h2>
              <p>
                Enchantress does not collect any data from any user, including children
                under the age of 13.
              </p>
            </section>

            <section>
              <h2>Contact</h2>
              <p>
                If you have questions about this privacy policy, email{' '}
                <a href={`mailto:${profile.email}`}>{profile.email}</a>.
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
