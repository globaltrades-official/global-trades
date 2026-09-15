import React, { useRef } from 'react';
import { Environment } from '@react-three/drei';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import FloatingCan from '@/components/FloatingCan';
import { useStore } from '@/hooks/useStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HeroScene() {
  const isReady = useStore((state) => state.isReady);
  const isDesktop = useMediaQuery('(min-width: 768px)', true);

  const mainLogoRef = useRef(null);
  const groupRef = useRef(null);

  useGSAP(() => {
    if (!mainLogoRef.current || !groupRef.current) return;

    isReady();

    // Position the main logo as an ambient background medallion with deep z-depth
    const initialY = isDesktop ? 0.0 : -0.3;
    const initialZ = isDesktop ? -5.8 : -6.2;
    gsap.set(mainLogoRef.current.position, { x: 0, y: initialY, z: initialZ });
    gsap.set(mainLogoRef.current.rotation, { x: 0.08, y: 0, z: 0 });

    // Continuous smooth idle rotation
    gsap.to(mainLogoRef.current.rotation, {
      y: Math.PI * 2,
      duration: 22,
      repeat: -1,
      ease: 'none',
    });

    // Intro timeline
    const introTl = gsap.timeline({
      defaults: {
        duration: 2.0,
        ease: 'power3.out',
      },
    });

    if (window.scrollY < 20) {
      introTl
        .from(mainLogoRef.current.position, { z: -8, y: -1.5, duration: 2.2 }, 0)
        .from(mainLogoRef.current.scale, { x: 0.4, y: 0.4, z: 0.4, duration: 2.2 }, 0);
    }

    // Scroll timeline: gracefully elevate up and back so it never collides with fold 2 text
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });

    scrollTl
      .to(
        mainLogoRef.current.position,
        {
          x: 0,
          y: 2.2,
          z: -6.5,
        },
        0
      )
      .to(
        mainLogoRef.current.scale,
        {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        0
      )
      .to(mainLogoRef.current.rotation, { x: 0.25, z: 0.15 }, 0)
      .to(groupRef.current.rotation, { y: 0.4 }, 0);
  }, { dependencies: [isDesktop] });

  return (
    <group ref={groupRef}>
      {/* Primary Ambient Background 3D Global Trades Medallion */}
      <FloatingCan
        ref={mainLogoRef}
        accentColor="#00A3E0"
        scale={isDesktop ? 0.68 : 0.48}
        floatIntensity={isDesktop ? 0.2 : 0.12}
        rotationIntensity={isDesktop ? 0.1 : 0.06}
        floatSpeed={0.85}
      />

      <Environment files="/hdr/field.hdr" environmentIntensity={1.2} />
      <directionalLight position={[2, 4, 3]} intensity={2.5} color="#FFFFFF" />
      <ambientLight intensity={1.5} color="#FFFFFF" />
    </group>
  );
}
