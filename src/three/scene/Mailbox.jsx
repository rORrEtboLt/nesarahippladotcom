import React from 'react';
import Hotspot from './Hotspot';

export default function Mailbox({ position = [2.4, 0.2, 0.9] }) {
  return (
    <Hotspot
      id="contact"
      label="Contact"
      hint="Drop me a letter"
      position={position}
      hitboxSize={[0.6, 0.9, 0.6]}
      labelOffset={[0, 0.65, 0]}
    >
      {/* Post */}
      <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
        <meshStandardMaterial color="#6b4a2b" roughness={0.9} />
      </mesh>
      {/* Box body */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.26, 0.34]} />
        <meshStandardMaterial color="#cf3a3a" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Rounded top */}
      <mesh position={[0, 0.23, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.42, 20, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#cf3a3a" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Flag */}
      <mesh position={[0.22, 0.15, 0]} castShadow>
        <boxGeometry args={[0.02, 0.16, 0.02]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.27, 0.2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.07, 0.01]} />
        <meshStandardMaterial color="#f0c84a" />
      </mesh>
      {/* Slot */}
      <mesh position={[0, 0.12, 0.171]}>
        <planeGeometry args={[0.28, 0.04]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
    </Hotspot>
  );
}
