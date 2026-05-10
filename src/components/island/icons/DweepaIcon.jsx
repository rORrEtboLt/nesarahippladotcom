import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DweepaIcon({ hovered }) {
  const groupRef = useRef();
  const towerRef = useRef();
  const speed = useRef(0.5);

  useFrame((state) => {
    if (!groupRef.current) return;
    speed.current = THREE.MathUtils.lerp(speed.current, hovered ? 1.5 : 0.5, 0.05);
    groupRef.current.rotation.y += 0.01 * speed.current;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.0) * 0.04;
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, hovered ? 1.2 : 1, 0.08);
    groupRef.current.scale.setScalar(s);

    if (towerRef.current) {
      towerRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Island base */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.3, 0.18, 0.15, 7]} />
        <meshStandardMaterial color="#6B8E23" flatShading />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.18, 0.1, 0.12, 6]} />
        <meshStandardMaterial color="#8B7355" flatShading />
      </mesh>
      {/* Defense tower */}
      <group ref={towerRef}>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.3, 6]} />
          <meshStandardMaterial color="#a0a0a0" flatShading />
        </mesh>
        {/* Tower top / flag */}
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.14, 0.04, 0.14]} />
          <meshStandardMaterial color="#808080" flatShading />
        </mesh>
        <mesh position={[0.02, 0.38, 0]}>
          <boxGeometry args={[0.08, 0.1, 0.015]} />
          <meshStandardMaterial color="#e04040" flatShading />
        </mesh>
      </group>
      {/* Small palm tree */}
      <mesh position={[-0.18, -0.02, 0.05]}>
        <cylinderGeometry args={[0.015, 0.02, 0.18, 5]} />
        <meshStandardMaterial color="#8B6914" flatShading />
      </mesh>
      <mesh position={[-0.18, 0.1, 0.05]}>
        <coneGeometry args={[0.08, 0.1, 5]} />
        <meshStandardMaterial color="#4a7c3f" flatShading />
      </mesh>
    </group>
  );
}
