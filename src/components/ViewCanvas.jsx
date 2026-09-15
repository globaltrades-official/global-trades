import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import CustomLoader from './CustomLoader';

export default function ViewCanvas() {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
      dpr={[1, 1.25]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{
        fov: 30,
      }}
    >
      <Suspense fallback={null}>
        <View.Port />
      </Suspense>
    </Canvas>
  );
}
