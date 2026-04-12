import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Hotspot from './Hotspot';
import { useSceneStore } from '../store';

export default function Monitor({ position = [-1.6, 0.95, -0.2] }) {
  const screenRef = useRef();
  const night = useSceneStore((s) => s.night);

  useFrame((state) => {
    if (!screenRef.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle screen flicker
    const intensity = 0.6 + Math.sin(t * 6.0) * 0.04 + Math.sin(t * 23.0) * 0.02;
    screenRef.current.material.emissiveIntensity = intensity;
  });

  return (
    <Hotspot
      id="about"
      label="About me"
      hint="Click the monitor"
      position={position}
      hitboxSize={[1.3, 1.1, 0.6]}
      labelOffset={[0, 0.95, 0]}
    >
      {/* Stand */}
      <mesh position={[0, -0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.12, 24]} />
        <meshStandardMaterial color="#2a2a33" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, -0.62, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.04, 0.3]} />
        <meshStandardMaterial color="#2a2a33" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Bezel */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.15, 0.75, 0.08]} />
        <meshStandardMaterial color="#1a1a22" roughness={0.4} metalness={0.4} />
      </mesh>
      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0, 0.045]}>
        <planeGeometry args={[1.05, 0.65]} />
        <meshStandardMaterial
          color="#0b1020"
          emissive={night ? '#4fa3ff' : '#7cc6ff'}
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>
      {/* Fake code lines */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[-0.35 + (i % 2) * 0.05, 0.22 - i * 0.08, 0.046]}>
          <planeGeometry args={[0.3 + (i % 3) * 0.12, 0.03]} />
          <meshBasicMaterial color={i % 3 === 0 ? '#ffc7a0' : '#9ee6ff'} />
        </mesh>
      ))}
    </Hotspot>
  );
}
