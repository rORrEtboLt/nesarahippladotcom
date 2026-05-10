import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FarmIcon({ hovered }) {
  const groupRef = useRef();
  const leavesRef = useRef();
  const speed = useRef(0.5);

  useFrame((state) => {
    if (!groupRef.current) return;
    speed.current = THREE.MathUtils.lerp(speed.current, hovered ? 1.5 : 0.5, 0.05);
    groupRef.current.rotation.y += 0.006 * speed.current;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.0) * 0.03;
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, hovered ? 1.2 : 1, 0.08);
    groupRef.current.scale.setScalar(s);

    if (leavesRef.current) {
      leavesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Stem */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.4, 5]} />
        <meshStandardMaterial color="#5a7a3a" flatShading />
      </mesh>
      {/* Leaves */}
      <group ref={leavesRef}>
        <mesh position={[-0.1, 0.08, 0]} rotation={[0, 0, -0.5]}>
          <sphereGeometry args={[0.08, 4, 3]} />
          <meshStandardMaterial color="#4a7c3f" flatShading />
        </mesh>
        <mesh position={[0.1, 0.02, 0.04]} rotation={[0, 0, 0.5]}>
          <sphereGeometry args={[0.07, 4, 3]} />
          <meshStandardMaterial color="#5d9448" flatShading />
        </mesh>
        <mesh position={[-0.05, 0.15, -0.04]} rotation={[0.3, 0, -0.3]}>
          <sphereGeometry args={[0.06, 4, 3]} />
          <meshStandardMaterial color="#3d6b33" flatShading />
        </mesh>
      </group>
      {/* Fruit */}
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#CC3333" flatShading />
      </mesh>
      {/* Soil */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.06, 6]} />
        <meshStandardMaterial color="#6b5533" flatShading />
      </mesh>
    </group>
  );
}
