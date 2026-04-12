import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, Stars, ContactShadows, AdaptiveDpr } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

import Lights from './scene/Lights';
import Environment from './scene/Environment';
import Monitor from './scene/Monitor';
import Notebook from './scene/Notebook';
import Bookshelf from './scene/Bookshelf';
import CoffeeMug from './scene/CoffeeMug';
import Mailbox from './scene/Mailbox';
import Particles from './scene/Particles';
import CameraRig from './controls/CameraRig';
import { useSceneStore } from './store';
import useReducedMotion from '../hooks/useReducedMotion';
import useIsMobile from '../hooks/useIsMobile';

export default function Experience() {
  const night = useSceneStore((s) => s.night);
  const setReady = useSceneStore((s) => s.setReady);
  const clearActive = useSceneStore((s) => s.clearActive);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') clearActive();
      const map = { 1: 'about', 2: 'blog', 3: 'projects', 4: 'support', 5: 'contact' };
      if (map[e.key]) useSceneStore.getState().setActive(map[e.key]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clearActive]);

  useEffect(() => {
    // Give the canvas a tick before marking ready (for opening fade)
    const t = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(t);
  }, [setReady]);

  return (
    <Canvas
      shadows={!isMobile}
      dpr={isMobile ? [1, 1.2] : [1, 2]}
      camera={{ position: [0, 2.4, 6.5], fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => clearActive()}
    >
      <color attach="background" args={[night ? '#0a0f1f' : '#cfe7ff']} />
      <fog attach="fog" args={[night ? '#0a0f1f' : '#cfe7ff', 10, 28]} />

      <Suspense fallback={null}>
        {night ? (
          <Stars radius={60} depth={40} count={3000} factor={3} fade speed={0.6} />
        ) : (
          <Sky sunPosition={[10, 6, -5]} turbidity={6} rayleigh={1} />
        )}

        <Lights />
        <Environment />

        <Monitor />
        <Notebook />
        <Bookshelf />
        <CoffeeMug />
        <Mailbox />

        <Particles count={isMobile ? 50 : 140} />

        <ContactShadows
          position={[0, 0.22, 0]}
          opacity={night ? 0.5 : 0.35}
          scale={8}
          blur={2.4}
          far={3}
        />

        {!isMobile && !reducedMotion && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={night ? 0.9 : 0.35}
              luminanceThreshold={0.75}
              luminanceSmoothing={0.2}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.2} darkness={0.55} />
          </EffectComposer>
        )}
      </Suspense>

      <CameraRig reducedMotion={reducedMotion} />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
