import React, { useRef } from 'react';
import { Environment } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import FloatingCan from '@/components/FloatingCan';
import { useMediaQuery } from '@/hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AlternatingScene() {
  const canRef = useRef(null);
  const isDesktop = useMediaQuery('(min-width: 768px)', true);

  const bgColors = ['#E2ECF8', '#DBEAFE', '#F0F5FA'];

  useGSAP(
    () => {
      if (!canRef.current) return;

      const sections = gsap.utils.toArray('.alternating-section');

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.alternating-text-view',
          endTrigger: '.alternating-text-container',
          pin: true,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      sections.forEach((_, index) => {
        if (!canRef.current) return;
        if (index === 0) return;

        const isOdd = index % 2 !== 0;

        const xPosition = isDesktop ? (isOdd ? '-1.25' : '1.25') : 0;
        const yRotation = isDesktop ? (isOdd ? '.35' : '-.35') : 0;
        scrollTl
          .to(canRef.current.position, {
            x: xPosition,
            ease: 'circ.inOut',
            delay: 0.5,
          })
          .to(
            canRef.current.rotation,
            {
              y: yRotation,
              ease: 'back.inOut',
            },
            '<'
          )
          .to('.alternating-text-container', {
            backgroundColor: gsap.utils.wrap(bgColors, index),
          });
      });
    },
    { dependencies: [isDesktop] }
  );

  return (
    <group
      ref={canRef}
      position-x={isDesktop ? 1.25 : 0}
      rotation-y={isDesktop ? -0.3 : 0}
    >
      <FloatingCan
        accentColor="#00A3E0"
        scale={isDesktop ? 1.05 : 0.75}
        floatIntensity={0.3}
        rotationIntensity={0.2}
      />
      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
    </group>
  );
}
