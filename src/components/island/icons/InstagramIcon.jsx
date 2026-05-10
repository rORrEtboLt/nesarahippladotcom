import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export default function InstagramIcon({ hovered }) {
  const groupRef = useRef();
  const speed = useRef(0.4);

  useFrame((state) => {
    if (!groupRef.current) return;
    speed.current = THREE.MathUtils.lerp(speed.current, hovered ? 1.5 : 0.4, 0.05);
    groupRef.current.rotation.y += 0.008 * speed.current;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.04;
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, hovered ? 1.2 : 1, 0.08);
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group ref={groupRef}>
      <RoundedBox args={[0.4, 0.4, 0.12]} radius={0.08} smoothness={2}>
        <meshStandardMaterial color="#e1306c" flatShading />
      </RoundedBox>
      {/* Lens circle */}
      <mesh position={[0, 0, 0.07]}>
        <torusGeometry args={[0.1, 0.02, 6, 8]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>
      {/* Flash dot */}
      <mesh position={[0.12, 0.12, 0.07]}>
        <sphereGeometry args={[0.025, 5, 5]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>
    </group>
  );
}
