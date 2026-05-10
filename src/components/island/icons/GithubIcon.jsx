import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GithubIcon({ hovered }) {
  const meshRef = useRef();
  const speed = useRef(0.3);

  useFrame((state) => {
    if (!meshRef.current) return;
    speed.current = THREE.MathUtils.lerp(speed.current, hovered ? 1.2 : 0.3, 0.05);
    meshRef.current.rotation.x += 0.005 * speed.current;
    meshRef.current.rotation.y += 0.008 * speed.current;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.04;
    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, hovered ? 1.2 : 1, 0.08);
    meshRef.current.scale.setScalar(s);
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[0.28, 0]} />
      <meshStandardMaterial color="#1d1d1f" flatShading />
    </mesh>
  );
}
