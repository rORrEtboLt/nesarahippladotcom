import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Hotspot from './Hotspot';

export default function CoffeeMug({ position = [0.7, 0.48, 0.35] }) {
  const steamRef = useRef();

  useFrame((state) => {
    if (!steamRef.current) return;
    const t = state.clock.getElapsedTime();
    steamRef.current.children.forEach((puff, i) => {
      puff.position.y = 0.25 + ((t * 0.4 + i * 0.33) % 1) * 0.45;
      puff.position.x = Math.sin(t * 1.2 + i) * 0.03;
      const life = ((t * 0.4 + i * 0.33) % 1);
      puff.material.opacity = Math.max(0, 0.5 - life * 0.5);
      const s = 0.04 + life * 0.12;
      puff.scale.set(s, s, s);
    });
  });

  return (
    <Hotspot
      id="support"
      label="Buy me a coffee"
      hint="Support my work"
      position={position}
      hitboxSize={[0.5, 0.6, 0.5]}
      labelOffset={[0, 0.55, 0]}
    >
      {/* Mug body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.11, 0.09, 0.18, 28]} />
        <meshStandardMaterial color="#e8e2d4" roughness={0.6} />
      </mesh>
      {/* Mug inside (coffee) */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.01, 28]} />
        <meshStandardMaterial color="#3a1f12" roughness={0.4} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.13, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.05, 0.015, 12, 24, Math.PI]} />
        <meshStandardMaterial color="#e8e2d4" roughness={0.6} />
      </mesh>
      {/* Heart logo */}
      <mesh position={[0, 0, 0.111]}>
        <circleGeometry args={[0.035, 24]} />
        <meshBasicMaterial color="#d94f4f" />
      </mesh>
      {/* Steam */}
      <group ref={steamRef}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, 0.25, 0]}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.5} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </Hotspot>
  );
}
