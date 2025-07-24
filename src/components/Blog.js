import React from 'react';

function Blog() {
  const posts = [
    {
      title: "Dreams in Color: My Latest Acrylic Experiment",
      excerpt: "I tried new layering techniques for vibrancy...",
      date: "2025-07-19",
    },
    {
      title: "How I Digitize My Sketchbook",
      excerpt: "A simple workflow to bring sketches online...",
      date: "2025-07-15",
    }
  ];

  return (
    <section className="blog">
      <h2>Art Blog & Experiments</h2>
      <ul>
        {posts.map((post, idx) => (
          <li key={idx}>
            <h3>{post.title}</h3>
            <time>{post.date}</time>
            <p>{post.excerpt}</p>
            <a href="#">Read More</a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Blog;
