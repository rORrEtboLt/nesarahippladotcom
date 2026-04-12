import React, { useMemo } from 'react';
import Hotspot from './Hotspot';

const COLORS = ['#b5502e', '#3d6a85', '#7a5c9e', '#d6a03b', '#4a8f6a', '#c06a8e'];

export default function Bookshelf({ position = [1.6, 0.9, -0.4] }) {
  const books = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        color: COLORS[i % COLORS.length],
        height: 0.4 + (i % 3) * 0.06,
        width: 0.07 + ((i * 37) % 3) * 0.015,
        tilt: i === 4 ? -0.12 : 0,
      })),
    []
  );

  return (
    <Hotspot
      id="projects"
      label="Projects"
      hint="Browse the shelf"
      position={position}
      hitboxSize={[1.0, 0.9, 0.45]}
      labelOffset={[0, 0.65, 0]}
    >
      {/* Shelf back */}
      <mesh position={[0, 0, -0.18]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.75, 0.04]} />
        <meshStandardMaterial color="#6a4a2e" roughness={0.9} />
      </mesh>
      {/* Shelves */}
      {[-0.2, 0.2].map((y) => (
        <mesh key={y} position={[0, y, -0.08]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.03, 0.22]} />
          <meshStandardMaterial color="#8a6040" roughness={0.8} />
        </mesh>
      ))}
      {/* Books */}
      {books.map((b, i) => {
        const x = -0.38 + i * 0.11;
        return (
          <mesh
            key={i}
            position={[x, -0.02, -0.05]}
            rotation={[0, 0, b.tilt]}
            castShadow
          >
            <boxGeometry args={[b.width, b.height, 0.14]} />
            <meshStandardMaterial color={b.color} roughness={0.7} />
          </mesh>
        );
      })}
      {/* Decor: tiny plant */}
      <group position={[0.35, 0.22, -0.05]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.08, 16]} />
          <meshStandardMaterial color="#a1683b" />
        </mesh>
        <mesh position={[0, 0.09, 0]} castShadow>
          <icosahedronGeometry args={[0.08, 0]} />
          <meshStandardMaterial color="#4a8f6a" roughness={0.8} />
        </mesh>
      </group>
    </Hotspot>
  );
}
