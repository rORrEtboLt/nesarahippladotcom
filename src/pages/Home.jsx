import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import profile from '../content/profile.json';
import builds from '../content/builds.json';
import '../styles/home.css';

const LIFE = [
  { slug: 'cottage', name: 'The Cottage', line: 'I built a timber cottage by hand in the forest and got the roof on before the monsoon.' },
  { slug: 'farm', name: 'The Farm', line: 'I grow coffee and pepper, and use ESP32 sensors to tell me which beds need water.' },
  { slug: 'coffee', name: 'Coffee', line: 'I roast beans in the town where they grow, on a drum roaster I built from a salvaged motor.' },
];

function ExtLink({ link, className }) {
  if (link.internal) {
    return <Link to={link.url} className={className}>{link.label}</Link>;
  }
  return (
    <a href={link.url} target="_blank" rel="noreferrer" className={className}>
      {link.label} <span aria-hidden="true">↗</span>
    </a>
  );
}

export default function Home() {
  const { now, shipped, stack } = builds;
  const title = `${profile.name}, an engineer and founder building robotics, dev tools and hardware`;
  const description =
    `${profile.name} is a full-stack and systems engineer in ${profile.location}, India. ` +
    `Now building ${now.name}: ${now.pitch}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <link rel="canonical" href="https://nesarahippla.com/" />
      </Helmet>

      <div className="home">
        <header className="home-nav">
          <span className="home-mark">{profile.name}</span>
          <nav>
            <a href="#now">Building</a>
            <a href="#shipped">Shipped</a>
            <a href="#life">Life</a>
            <a href={`mailto:${profile.email}`} className="home-nav-cta">Contact</a>
          </nav>
        </header>

        <main>
          <section className="home-hero">
            <p className="home-eyebrow">
              <span className="home-dot" aria-hidden="true" /> Founder &amp; engineer · {profile.location}, India
            </p>
            <h1>
              I build things that work in the real world, from <em>C on a phone</em> to{' '}
              <em>sensors in a coffee field</em>.
            </h1>
            <p className="home-lede">
              I'm Nesara, a programmer, builder and farmer from the coffee hills of Chikmaglur.
              I've shipped an electronics CAD app, an offline document scanner, roasting telemetry
              and several games, mostly in C, C++ and TypeScript. Now I'm working on{' '}
              <a href="#now">{now.name}</a>: robot swarms that turn garbage into raw materials.
            </p>
            <div className="home-cta">
              <a href={`mailto:${profile.email}`} className="btn btn-primary">Email me</a>
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="btn">
                GitHub ↗
              </a>
            </div>
          </section>

          <section id="now" className="home-section">
            <h2 className="home-label">Now building</h2>
            <article className="now-card">
              <div className="now-head">
                <h3>{now.name}</h3>
                <ul className="tags">
                  {now.tags.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
              <p className="now-pitch">{now.pitch}</p>
              <p className="now-detail">{now.detail}</p>
              <ol className="now-loop">
                {['Scout', 'Collect', 'Segregate', 'Transform & sell'].map((step, i) => (
                  <li key={step}><span>{String(i + 1).padStart(2, '0')}</span>{step}</li>
                ))}
              </ol>
              <div className="links">
                {now.links.map((l) => <ExtLink key={l.url} link={l} className="link" />)}
              </div>
            </article>
          </section>

          <section id="shipped" className="home-section">
            <h2 className="home-label">Shipped</h2>
            <div className="ship-grid">
              {shipped.map((p) => (
                <article key={p.name} className="ship-card">
                  <p className="ship-kind">{p.kind}</p>
                  <h3>{p.name}</h3>
                  <p className="ship-pitch">{p.pitch}</p>
                  <ul className="ship-highlights">
                    {p.highlights.map((h) => <li key={h}>{h}</li>)}
                  </ul>
                  <ul className="tags">
                    {p.stack.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                  <div className="links">
                    {p.links.map((l) => <ExtLink key={l.url} link={l} className="link" />)}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="home-section">
            <h2 className="home-label">Toolbox</h2>
            <dl className="stack">
              {stack.map((s) => (
                <div key={s.area}>
                  <dt>{s.area}</dt>
                  <dd>{s.items.join(' · ')}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="life" className="home-section">
            <h2 className="home-label">Off the keyboard</h2>
            <p className="life-intro">
              I build with clay, timber and earth too. Building physical things taught me to understand
              the material before I try to shape it, and I use that in software as well.
            </p>
            <div className="life-grid">
              {LIFE.map((l) => (
                <Link key={l.slug} to={`/work/${l.slug}`} className="life-card">
                  <h3>{l.name} <span aria-hidden="true">→</span></h3>
                  <p>{l.line}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="home-contact">
            <h2>Let's talk.</h2>
            <p>
              I'd like to hear from investors, possible co-founders and anyone working on robotics,
              recycling or hardware.
            </p>
            <a href={`mailto:${profile.email}`} className="home-email">{profile.email}</a>
            <div className="home-socials">
              <a href={profile.socials.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={profile.socials.instagram} target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </section>
        </main>

        <footer className="home-footer">
          © {new Date().getFullYear()} {profile.name} · Made in Chikmaglur
        </footer>
      </div>
    </>
  );
}
