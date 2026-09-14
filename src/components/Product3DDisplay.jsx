import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const FALLBACK_TEXTURE_URL = '/company-logo.png';
const textureCache = new Map();
const textureLoader = new THREE.TextureLoader();

// Preload the default fallback texture immediately
let defaultTexture = null;
textureLoader.load(FALLBACK_TEXTURE_URL, (tex) => {
  tex.colorSpace = THREE.SRGBColorSpace;
  defaultTexture = tex;
  textureCache.set(FALLBACK_TEXTURE_URL, tex);
});

export function Product3DDisplay({
  scale = 1.8,
  accentColor = '#00A3E0',
  textureUrl = FALLBACK_TEXTURE_URL,
  ...props
}) {
  const url = textureUrl || FALLBACK_TEXTURE_URL;
  const [texture, setTexture] = useState(() => textureCache.get(url) || defaultTexture);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (!url) {
      setTexture(defaultTexture);
      return;
    }

    if (textureCache.has(url)) {
      setTexture(textureCache.get(url));
      return;
    }

    textureLoader.load(
      url,
      (loadedTex) => {
        if (!mountedRef.current) return;
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        loadedTex.needsUpdate = true;
        textureCache.set(url, loadedTex);
        setTexture(loadedTex);
      },
      undefined,
      (err) => {
        if (!mountedRef.current) return;
        console.warn('Failed to load texture for 3D medallion:', url);
        setTexture(defaultTexture);
      }
    );

    return () => {
      mountedRef.current = false;
    };
  }, [url]);

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
        {texture ? (
          <meshBasicMaterial map={texture} transparent />
        ) : (
          <meshBasicMaterial color="#FFFFFF" />
        )}
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
        {texture ? (
          <meshBasicMaterial map={texture} transparent />
        ) : (
          <meshBasicMaterial color="#FFFFFF" />
        )}
      </mesh>
    </group>
  );
}
