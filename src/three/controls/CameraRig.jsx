import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '../store';

// Camera framing per hotspot: [cameraPosition, lookAtTarget]
const VIEWS = {
  idle: [[0, 2.4, 6.5], [0, 1.0, 0]],
  about: [[-1.6, 1.3, 1.5], [-1.6, 0.95, -0.2]],
  blog: [[-0.1, 1.3, 1.9], [-0.1, 0.55, 0.2]],
  projects: [[1.6, 1.4, 1.7], [1.6, 0.9, -0.3]],
  support: [[0.7, 1.1, 1.6], [0.7, 0.55, 0.3]],
  contact: [[2.3, 1.0, 2.3], [2.4, 0.35, 0.9]],
};

const tmpTarget = new THREE.Vector3();
const tmpPos = new THREE.Vector3();

export default function CameraRig({ reducedMotion = false }) {
  const { camera } = useThree();
  const active = useSceneStore((s) => s.active);
  const target = useRef(new THREE.Vector3(...VIEWS.idle[1]));
  const desired = useRef(new THREE.Vector3(...VIEWS.idle[0]));
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const view = VIEWS[active] || VIEWS.idle;
    desired.current.set(...view[0]);
    target.current.set(...view[1]);
  }, [active]);

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame(() => {
    // Parallax wobble only when idle
    const parallaxX = active ? 0 : pointer.current.x * 0.6;
    const parallaxY = active ? 0 : -pointer.current.y * 0.3;
    tmpPos.copy(desired.current);
    tmpPos.x += parallaxX;
    tmpPos.y += parallaxY;

    const damping = reducedMotion ? 1 : 0.06;
    camera.position.lerp(tmpPos, damping);

    tmpTarget.copy(target.current);
    camera.lookAt(tmpTarget);
  });

  return null;
}
