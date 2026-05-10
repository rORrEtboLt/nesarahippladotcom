import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CottageIcon({ hovered }) {
  const groupRef = useRef();
  const speed = useRef(0.5);

  useFrame((state) => {
    if (!groupRef.current) return;
    speed.current = THREE.MathUtils.lerp(speed.current, hovered ? 1.5 : 0.5, 0.05);
    groupRef.current.rotation.y += 0.01 * speed.current;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.05;
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, hovered ? 1.2 : 1, 0.08);
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.5, 0.35, 0.4]} />
        <meshStandardMaterial color="#C4A882" flatShading />
      </mesh>
      <mesh position={[0, 0.25, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.42, 0.28, 4]} />
        <meshStandardMaterial color="#5C4033" flatShading />
      </mesh>
      <mesh position={[0, -0.1, 0.21]}>
        <boxGeometry args={[0.1, 0.16, 0.02]} />
        <meshStandardMaterial color="#3d2b1f" flatShading />
      </mesh>
    </group>
  );
}
