import React from 'react';
import { View } from '@react-three/drei';
import HeroScene from './HeroScene';
import { Bubbles } from './Bubbles';

export default function Desktop3DHero({ isDesktop = true }) {
  return (
    <View className="hero-scene pointer-events-none sticky top-0 z-0 -mt-[100vh] block h-screen w-full opacity-25 md:opacity-30">
      <HeroScene />
      <Bubbles count={isDesktop ? 120 : 45} speed={isDesktop ? 1.5 : 1} repeat={true} />
    </View>
  );
}
