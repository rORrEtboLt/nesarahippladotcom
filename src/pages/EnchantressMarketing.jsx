import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import profile from '../content/profile.json';

export default function EnchantressMarketing() {
  return (
    <>
      <Helmet>
        <title>Enchantress — Dice Lane Defense</title>
        <meta name="description" content="Roll dice, summon warriors from Indian mythology, defend against waves of enemies. A premium tower defense game with no ads and no in-app purchases." />
        <meta property="og:title" content="Enchantress — Dice Lane Defense" />
        <meta property="og:description" content="Roll dice, summon warriors, defend your base. No ads, no IAP." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="page">
        <header className="page-header">
          <div className="page-header-inner">
            <Link to="/" className="brand">{profile.name}</Link>
            <nav className="header-nav">
              <Link to="/enchantress" className="active">Enchantress</Link>
            </nav>
          </div>
        </header>

        <main className="page-main">
          <div className="enchantress-page enchantress-marketing">
            <h1>Enchantress</h1>
            <p className="enchantress-tagline">Dice Lane Defense</p>

            <p className="enchantress-hero-text">
              Roll dice to summon warriors. Defend your base against waves of enemies.
              Every roll is a decision. Every lane is a battle.
            </p>

            <section>
              <h2>How It Works</h2>
              <p>
                Tap to roll a dice. Each face summons a different creature — bears, pandas,
                turtles, sharks, lizards, minotaurs, spiders, and more. Drag your unit onto
                the battlefield and watch them fight.
              </p>
              <p>
                Enemies march in from the right across five lanes. Place defenders wisely,
                choose rewards between waves, and upgrade your army as the difficulty scales.
              </p>
            </section>

            <section>
              <h2>Features</h2>
              <ul className="enchantress-features">
                <li>11 summonable unit types with unique abilities</li>
                <li>18 enemy types with different behaviors</li>
                <li>Wave-based progression with scaling difficulty</li>
                <li>Reward choices after every wave cleared</li>
                <li>Unit upgrades up to level 10</li>
                <li>Three difficulty modes</li>
                <li>Pixel art visuals with smooth animations</li>
                <li>Original soundtrack and sound effects</li>
              </ul>
            </section>

            <section>
              <h2>No Ads. No IAP. No Energy Timers.</h2>
              <p>
                Enchantress is a premium game. Pay once, play forever. No pop-ups interrupting
                your strategy. No timers forcing you to wait. Just you, the dice, and the
                battlefield.
              </p>
            </section>

            <section className="enchantress-links">
              <h2>Play</h2>
              <p>
                Available on the App Store for iPhone and iPad.
              </p>
              <p>
                <Link to="/enchantress/support">Support</Link>
                {' · '}
                <Link to="/enchantress/privacy">Privacy Policy</Link>
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
