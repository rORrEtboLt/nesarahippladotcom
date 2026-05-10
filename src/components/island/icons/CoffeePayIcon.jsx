import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CoffeePayIcon({ hovered }) {
  const groupRef = useRef();
  const coinRef = useRef();
  const speed = useRef(0.5);

  useFrame((state) => {
    if (!groupRef.current) return;
    speed.current = THREE.MathUtils.lerp(speed.current, hovered ? 1.5 : 0.5, 0.05);
    groupRef.current.rotation.y += 0.008 * speed.current;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.0) * 0.04;
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, hovered ? 1.2 : 1, 0.08);
    groupRef.current.scale.setScalar(s);

    if (coinRef.current) {
      coinRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cup */}
      <mesh position={[-0.08, -0.05, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.28, 8]} />
        <meshStandardMaterial color="#6F4E37" flatShading />
      </mesh>
      {/* Handle */}
      <mesh position={[0.12, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.08, 0.02, 6, 8, Math.PI]} />
        <meshStandardMaterial color="#a0825a" flatShading />
      </mesh>
      {/* Spinning coin */}
      <group ref={coinRef} position={[0.2, 0.15, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.015, 12]} />
          <meshStandardMaterial color="#ffd700" flatShading />
        </mesh>
      </group>
    </group>
  );
}
