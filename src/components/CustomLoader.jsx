import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { BRANDING } from '../constants/theme';

export default function CustomLoader() {
  const { active } = useProgress();
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    let timer;
    if (active) {
      setVisible(true);
      setOpacity(1);
    } else {
      setOpacity(0);
      timer = setTimeout(() => {
        setVisible(false);
      }, 350);
    }
    return () => clearTimeout(timer);
  }, [active]);

  if (!visible) return null;

  const logoSrc = BRANDING?.LOGO_PATH || '/company-logo.png';

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#F4F8FC] transition-opacity duration-300"
      style={{
        opacity,
        pointerEvents: opacity === 1 ? 'auto' : 'none',
      }}
    >
      <div className="relative flex flex-col items-center px-6">
        {/* Soft Background Radial Glow */}
        <div className="absolute -inset-8 rounded-full bg-blue-400/15 blur-2xl pointer-events-none" />

        {/* Logo Card with Rotating Spinner */}
        <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white shadow-2xl shadow-blue-950/10 border border-[#D0DFEF] p-4">
          {/* Animated Spinner Ring around the Logo */}
          <div
            className="absolute -inset-2 rounded-[28px] border-2 border-dashed border-[#1A4C98]/40 animate-spin"
            style={{ animationDuration: '6s' }}
          />

          {/* Glowing Inner Ring */}
          <div
            className="absolute -inset-1 rounded-[24px] border-2 border-transparent border-t-[#1A4C98] border-r-[#00A3E0] animate-spin"
            style={{ animationDuration: '1.2s' }}
          />

          {/* Company Logo with Breathing Animation */}
          <img
            src={logoSrc}
            alt="Global Trades Logo"
            className="w-full h-full object-contain select-none"
            style={{
              animation: 'gt-pulse 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}
