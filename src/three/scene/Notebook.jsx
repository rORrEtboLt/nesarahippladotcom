import React from 'react';
import Hotspot from './Hotspot';

export default function Notebook({ position = [-0.1, 0.46, 0.25] }) {
  return (
    <Hotspot
      id="blog"
      label="Blog"
      hint="Flip through the notebook"
      position={position}
      hitboxSize={[0.6, 0.3, 0.45]}
      labelOffset={[0, 0.35, 0]}
    >
      {/* Cover */}
      <mesh rotation={[-0.05, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.04, 0.34]} />
        <meshStandardMaterial color="#7a4a2b" roughness={0.7} />
      </mesh>
      {/* Pages */}
      <mesh rotation={[-0.05, 0.3, 0]} position={[0, 0.025, 0]} castShadow>
        <boxGeometry args={[0.44, 0.02, 0.3]} />
        <meshStandardMaterial color="#f4ecd8" roughness={0.9} />
      </mesh>
      {/* Pen */}
      <mesh position={[0.2, 0.05, 0.1]} rotation={[0, 0.3, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.24, 12]} />
        <meshStandardMaterial color="#d94f4f" roughness={0.3} metalness={0.2} />
      </mesh>
    </Hotspot>
  );
}
