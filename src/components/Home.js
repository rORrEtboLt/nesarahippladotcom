import React from 'react';

function Home() {
  return (
    <section className="home">
      <header>
        <h1>Welcome to Nesara Hippla's Art Journey</h1>
        <p>
          <em>
            "Unthrifty loveliness, why dost thou spend<br/>
            Upon thyself thy beauty’s legacy?" <br/>
            — <strong>Sonnet 4, William Shakespeare</strong>
          </em>
        </p>
        <p>
          Discover a world where art—like beauty—finds purpose not just within,
          but in its sharing and connection. Explore stories, experiments, and
          original artworks available for both body and soul.
        </p>
      </header>
      <div className="art-preview">
        <img src="/sample-art1.jpg" alt="Featured Art 1" />
        <img src="/sample-art2.jpg" alt="Featured Art 2" />
      </div>
      <section className="home-links">
        <a href="/shop" className="btn">Shop Art</a>
        <a href="/blog" className="btn">Read the Blog</a>
      </section>
    </section>
  );
}

export default Home;
