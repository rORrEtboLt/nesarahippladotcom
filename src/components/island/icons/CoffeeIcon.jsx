import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CoffeeIcon({ hovered }) {
  const groupRef = useRef();
  const steam1 = useRef();
  const steam2 = useRef();
  const speed = useRef(0.5);

  useFrame((state) => {
    if (!groupRef.current) return;
    speed.current = THREE.MathUtils.lerp(speed.current, hovered ? 1.5 : 0.5, 0.05);
    groupRef.current.rotation.y += 0.008 * speed.current;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.0) * 0.04;
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, hovered ? 1.2 : 1, 0.08);
    groupRef.current.scale.setScalar(s);

    if (steam1.current && steam2.current) {
      const t = state.clock.elapsedTime;
      steam1.current.position.y = 0.35 + ((t * 0.5) % 0.4);
      steam1.current.scale.setScalar(1 - ((t * 0.5) % 0.4));
      steam2.current.position.y = 0.35 + ((t * 0.5 + 0.2) % 0.4);
      steam2.current.scale.setScalar(1 - ((t * 0.5 + 0.2) % 0.4));
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cup body */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.2, 0.16, 0.35, 8]} />
        <meshStandardMaterial color="#6F4E37" flatShading />
      </mesh>
      {/* Handle */}
      <mesh position={[0.25, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.1, 0.025, 6, 8, Math.PI]} />
        <meshStandardMaterial color="#a0825a" flatShading />
      </mesh>
      {/* Steam particles */}
      <mesh ref={steam1} position={[0.05, 0.35, 0]}>
        <sphereGeometry args={[0.03, 4, 4]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
      <mesh ref={steam2} position={[-0.05, 0.35, 0]}>
        <sphereGeometry args={[0.025, 4, 4]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
