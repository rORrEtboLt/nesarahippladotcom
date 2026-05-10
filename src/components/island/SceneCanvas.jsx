import React from 'react';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';

export default function SceneCanvas() {
  return (
    <Canvas
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
      }}
      dpr={[1, 1.5]}
      eventSource={document.getElementById('root')}
      eventPrefix="client"
    >
      <View.Port />
    </Canvas>
  );
}
