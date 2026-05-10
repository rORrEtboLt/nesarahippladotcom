import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CeramicsIcon({ hovered }) {
  const groupRef = useRef();
  const speed = useRef(1);

  const vaseGeometry = useMemo(() => {
    const points = [
      new THREE.Vector2(0.12, -0.2),
      new THREE.Vector2(0.18, -0.1),
      new THREE.Vector2(0.2, 0.0),
      new THREE.Vector2(0.18, 0.1),
      new THREE.Vector2(0.12, 0.18),
      new THREE.Vector2(0.1, 0.22),
      new THREE.Vector2(0.12, 0.25),
    ];
    return new THREE.LatheGeometry(points, 8);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    speed.current = THREE.MathUtils.lerp(speed.current, hovered ? 3 : 1, 0.05);
    groupRef.current.rotation.y += 0.015 * speed.current;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.03;
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, hovered ? 1.2 : 1, 0.08);
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={vaseGeometry}>
        <meshStandardMaterial color="#c4956a" flatShading />
      </mesh>
      {/* Base wheel disc */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.03, 8]} />
        <meshStandardMaterial color="#8B7355" flatShading />
      </mesh>
    </group>
  );
}
