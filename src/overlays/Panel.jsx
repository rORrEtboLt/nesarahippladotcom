import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSceneStore } from '../three/store';

import AboutPanel from './panels/AboutPanel';
import BlogPanel from './panels/BlogPanel';
import ProjectsPanel from './panels/ProjectsPanel';
import SupportPanel from './panels/SupportPanel';
import ContactPanel from './panels/ContactPanel';

const PANELS = {
  about: { Component: AboutPanel, title: 'About' },
  blog: { Component: BlogPanel, title: 'Blog' },
  projects: { Component: ProjectsPanel, title: 'Projects' },
  support: { Component: SupportPanel, title: 'Support' },
  contact: { Component: ContactPanel, title: 'Contact' },
};

export default function Panel() {
  const active = useSceneStore((s) => s.active);
  const clearActive = useSceneStore((s) => s.clearActive);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === 'Escape') clearActive();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, clearActive]);

  const entry = active ? PANELS[active] : null;

  return (
    <AnimatePresence mode="wait">
      {entry && (
        <motion.aside
          key={active}
          className="panel"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label={entry.title}
        >
          <div className="panel-header">
            <h2>{entry.title}</h2>
            <button
              className="panel-close"
              onClick={clearActive}
              aria-label="Close panel"
            >
              ×
            </button>
          </div>
          <div className="panel-body">
            <entry.Component />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
