import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function MudHouseIcon({ hovered }) {
  const groupRef = useRef();
  const speed = useRef(0.5);

  useFrame((state) => {
    if (!groupRef.current) return;
    speed.current = THREE.MathUtils.lerp(speed.current, hovered ? 1.5 : 0.5, 0.05);
    groupRef.current.rotation.y += 0.008 * speed.current;
    const wobble = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
    groupRef.current.rotation.z = wobble;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.03;
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, hovered ? 1.2 : 1, 0.08);
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group ref={groupRef}>
      {/* Base */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.3, 0.32, 0.12, 8]} />
        <meshStandardMaterial color="#8B7355" flatShading />
      </mesh>
      {/* Dome */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.28, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#a0825a" flatShading />
      </mesh>
      {/* Door opening */}
      <mesh position={[0, -0.08, 0.26]}>
        <boxGeometry args={[0.1, 0.14, 0.05]} />
        <meshStandardMaterial color="#5a4020" flatShading />
      </mesh>
    </group>
  );
}
