import React, { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Preload company logo and all 5 featured carousel product images for instant, smooth 3D switching
useTexture.preload([
  '/company-logo.png',
  '/products/monin-syrup.jpg',
  '/products/morton-peaches.jpg',
  '/products/callebaut-chocolate.jpg',
  '/products/goldencrown-mushrooms.jpg',
  '/products/veeba-mayo.jpg',
]);

export function Product3DDisplay({
  scale = 1.8,
  accentColor = '#00A3E0',
  textureUrl = '/company-logo.png',
  ...props
}) {
  const displayTexture = useTexture(textureUrl || '/company-logo.png');

  if (displayTexture) {
    displayTexture.colorSpace = THREE.SRGBColorSpace;
    displayTexture.needsUpdate = true;
  }

  return (
    <group {...props} scale={scale} dispose={null}>
      {/* Outer Snow-White Cylinder Bezel */}
      <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={0}>
        <cylinderGeometry args={[1.1, 1.1, 0.1, 64]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* Outer Crimson Accent Rings */}
      <mesh position={[0, 0, 0.051]} renderOrder={1}>
        <ringGeometry args={[1.07, 1.1, 64]} />
        <meshBasicMaterial color="#E52528" />
      </mesh>
      <mesh position={[0, 0, -0.051]} rotation={[0, Math.PI, 0]} renderOrder={1}>
        <ringGeometry args={[1.07, 1.1, 64]} />
        <meshBasicMaterial color="#E52528" />
      </mesh>

      {/* Inner Brand Accent Rings */}
      <mesh position={[0, 0, 0.052]} renderOrder={2}>
        <ringGeometry args={[1.01, 1.06, 64]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      <mesh position={[0, 0, -0.052]} rotation={[0, Math.PI, 0]} renderOrder={2}>
        <ringGeometry args={[1.01, 1.06, 64]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* FRONT FACE */}
      {/* Pristine Snow-White Medallion Disc */}
      <mesh position={[0, 0, 0.053]} renderOrder={3}>
        <circleGeometry args={[1.01, 64]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      {/* Product Packshot / Logo Emblem */}
      <mesh position={[0, 0, 0.054]} renderOrder={4}>
        <circleGeometry args={[0.98, 64]} />
        <meshBasicMaterial map={displayTexture} transparent />
      </mesh>

      {/* BACK FACE */}
      {/* Pristine Snow-White Medallion Disc */}
      <mesh position={[0, 0, -0.053]} rotation={[0, Math.PI, 0]} renderOrder={3}>
        <circleGeometry args={[1.01, 64]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      {/* Product Packshot / Logo Emblem (mirrored to preserve readability from reverse) */}
      <mesh position={[0, 0, -0.054]} rotation={[0, Math.PI, 0]} renderOrder={4}>
        <circleGeometry args={[0.98, 64]} />
        <meshBasicMaterial map={displayTexture} transparent />
      </mesh>
    </group>
  );
}
