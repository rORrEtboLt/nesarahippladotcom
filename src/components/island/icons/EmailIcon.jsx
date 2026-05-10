import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function EmailIcon({ hovered }) {
  const meshRef = useRef();
  const speed = useRef(0.4);

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.15);
    shape.lineTo(0.25, 0);
    shape.lineTo(0.2, -0.12);
    shape.lineTo(-0.2, -0.12);
    shape.lineTo(-0.25, 0);
    shape.closePath();

    const settings = { depth: 0.04, bevelEnabled: false };
    return new THREE.ExtrudeGeometry(shape, settings);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    speed.current = THREE.MathUtils.lerp(speed.current, hovered ? 1.5 : 0.4, 0.05);
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = Math.sin(t * 0.8 * speed.current) * 0.3;
    meshRef.current.rotation.x = Math.sin(t * 0.6) * 0.1 - 0.1;
    meshRef.current.position.y = Math.sin(t * 1.2) * 0.04;
    meshRef.current.position.x = Math.sin(t * 0.5) * 0.02;
    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, hovered ? 1.2 : 1, 0.08);
    meshRef.current.scale.setScalar(s);
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color="#f0f0f0" flatShading />
    </mesh>
  );
}
