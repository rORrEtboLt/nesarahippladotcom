import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '../store';

// Floating island + desk. The "world" the hotspots live on.
export default function Environment() {
  const night = useSceneStore((s) => s.night);
  const islandRef = useRef();

  useFrame((state) => {
    if (!islandRef.current) return;
    const t = state.clock.getElapsedTime();
    islandRef.current.position.y = Math.sin(t * 0.5) * 0.05;
    islandRef.current.rotation.y = Math.sin(t * 0.2) * 0.02;
  });

  // Scatter small rocks around the island
  const rocks = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        pos: [
          Math.cos((i / 10) * Math.PI * 2) * 3.2 + (Math.sin(i * 13) * 0.3),
          -0.05 + Math.abs(Math.sin(i * 5)) * 0.05,
          Math.sin((i / 10) * Math.PI * 2) * 2.2 + (Math.cos(i * 7) * 0.3),
        ],
        scale: 0.08 + (i % 3) * 0.04,
        rot: i * 0.7,
      })),
    []
  );

  return (
    <group ref={islandRef}>
      {/* Desk top */}
      <mesh position={[0, 0.35, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.2, 0.08, 2.0]} />
        <meshStandardMaterial color={night ? '#3a2e24' : '#8b6a4a'} roughness={0.7} />
      </mesh>
      {/* Desk edge trim */}
      <mesh position={[0, 0.31, 0]}>
        <boxGeometry args={[4.22, 0.02, 2.02]} />
        <meshStandardMaterial color={night ? '#241c16' : '#6b4a2b'} roughness={0.8} />
      </mesh>

      {/* Island grass top */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[3.6, 3.6, 0.6, 48]} />
        <meshStandardMaterial
          color={night ? '#2a4438' : '#5ea667'}
          roughness={0.9}
        />
      </mesh>
      {/* Island dirt underside - inverted cone-ish */}
      <mesh position={[0, -0.9, 0]} receiveShadow>
        <coneGeometry args={[3.4, 1.6, 32]} />
        <meshStandardMaterial color={night ? '#2a1f16' : '#6b4a2b'} roughness={1} />
      </mesh>

      {/* Scattered rocks */}
      {rocks.map((r, i) => (
        <mesh key={i} position={r.pos} rotation={[0, r.rot, 0]} castShadow>
          <dodecahedronGeometry args={[r.scale, 0]} />
          <meshStandardMaterial color={night ? '#4a4a55' : '#8a8a92'} roughness={0.9} />
        </mesh>
      ))}

      {/* A tiny tree */}
      <group position={[-3.0, 0.2, 0.6]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.6, 10]} />
          <meshStandardMaterial color="#5a3a22" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial
            color={night ? '#2f5a40' : '#4a8f6a'}
            roughness={0.9}
          />
        </mesh>
      </group>

      {/* A lamppost */}
      <group position={[2.9, 0.2, -0.6]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.04, 1.4, 10]} />
          <meshStandardMaterial color="#222" roughness={0.6} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#fff3c4"
            emissive={night ? '#ffcb6b' : '#fff3c4'}
            emissiveIntensity={night ? 2.5 : 0.3}
          />
        </mesh>
        {night && (
          <pointLight position={[0, 0.8, 0]} intensity={1.5} color="#ffcb6b" distance={3.5} />
        )}
      </group>
    </group>
  );
}
