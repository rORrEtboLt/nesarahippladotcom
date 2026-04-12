import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSceneStore } from '../three/store';
import profile from '../content/profile.json';

export default function LoadingScreen() {
  const ready = useSceneStore((s) => s.ready);

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="loading-inner">
            <div className="loading-logo">◆</div>
            <h1>{profile.name}</h1>
            <p>Warming up the world…</p>
            <div className="loading-bar">
              <motion.span
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
