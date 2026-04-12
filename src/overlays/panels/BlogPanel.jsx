import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import posts from '../../content/posts';

export default function BlogPanel() {
  const [activeSlug, setActiveSlug] = useState(null);
  const active = posts.find((p) => p.slug === activeSlug);

  if (active) {
    return (
      <article className="post">
        <button className="linkish" onClick={() => setActiveSlug(null)}>
          ← Back to all posts
        </button>
        <header className="post-header">
          <h3>{active.title}</h3>
          <time>{active.date}</time>
          <div className="tag-row">
            {active.tags.map((t) => (
              <span key={t} className="tag">
                #{t}
              </span>
            ))}
          </div>
        </header>
        <div className="post-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {active.content}
          </ReactMarkdown>
        </div>
      </article>
    );
  }

  return (
    <ul className="post-list">
      {posts.map((p) => (
        <li key={p.slug}>
          <button className="post-card" onClick={() => setActiveSlug(p.slug)}>
            <h3>{p.title}</h3>
            <time>{p.date}</time>
            <p>{p.excerpt}</p>
            <div className="tag-row">
              {p.tags.map((t) => (
                <span key={t} className="tag">
                  #{t}
                </span>
              ))}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
