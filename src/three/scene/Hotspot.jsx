import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useSceneStore } from '../store';

/**
 * Wraps a 3D object with hover + click behavior and a floating label.
 * Children should be the visual mesh(es). A slightly enlarged invisible
 * hit-box mesh is rendered so small objects are easy to click.
 */
export default function Hotspot({
  id,
  label,
  hint,
  position = [0, 0, 0],
  hitboxSize = [1, 1, 1],
  labelOffset = [0, 1.1, 0],
  children,
}) {
  const group = useRef();
  const hovered = useSceneStore((s) => s.hovered === id);
  const active = useSceneStore((s) => s.active === id);
  const setHovered = useSceneStore((s) => s.setHovered);
  const setActive = useSceneStore((s) => s.setActive);

  useFrame((state) => {
    if (!group.current) return;
    // Gentle bob to draw attention
    const t = state.clock.getElapsedTime();
    group.current.position.y = position[1] + Math.sin(t * 1.3 + position[0]) * 0.03;
    const target = hovered ? 1.08 : 1;
    group.current.scale.lerp({ x: target, y: target, z: target }, 0.15);
  });

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        setActive(id);
      }}
    >
      {children}
      {/* Oversized invisible hitbox */}
      <mesh visible={false}>
        <boxGeometry args={hitboxSize} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {(hovered || active) && (
        <Html
          center
          position={labelOffset}
          distanceFactor={8}
          style={{ pointerEvents: 'none' }}
        >
          <div className="hotspot-label">
            <strong>{label}</strong>
            {hint && <span>{hint}</span>}
          </div>
        </Html>
      )}
    </group>
  );
}
