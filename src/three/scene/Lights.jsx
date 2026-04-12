import React from 'react';
import { useSceneStore } from '../store';

export default function Lights() {
  const night = useSceneStore((s) => s.night);

  return (
    <>
      <ambientLight intensity={night ? 0.25 : 0.6} color={night ? '#7aa0ff' : '#ffe9c4'} />
      <hemisphereLight
        args={[night ? '#6b8cff' : '#ffd9a8', night ? '#1a1f3a' : '#2a1f14', 0.55]}
      />
      <directionalLight
        position={[6, 9, 5]}
        intensity={night ? 0.6 : 1.2}
        color={night ? '#8fb0ff' : '#fff1d4'}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />
      <pointLight
        position={[-2.2, 1.8, -0.4]}
        intensity={night ? 1.6 : 0.8}
        color={night ? '#ffb86b' : '#ffd49a'}
        distance={6}
        decay={2}
      />
    </>
  );
}
