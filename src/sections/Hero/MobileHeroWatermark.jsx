import React from 'react';
import { BRANDING } from '@/constants/theme';

export default function MobileHeroWatermark() {
  const logoSrc = BRANDING?.LOGO_PATH || '/company-logo.png';

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
      aria-hidden="true"
    >
      <style>{`
        @keyframes gt-medallion-rotate {
          0% {
            transform: perspective(1000px) rotateY(0deg);
          }
          100% {
            transform: perspective(1000px) rotateY(360deg);
          }
        }
      `}</style>

      {/* Soft Ambient Radial Glow matching 3D lighting */}
      <div className="absolute top-1/4 size-80 rounded-full bg-gradient-to-tr from-[#00A3E0]/15 via-[#1A4C98]/10 to-transparent blur-3xl" />

      {/* Identical 3D Medallion Representation */}
      <div className="relative flex flex-col items-center justify-center opacity-25 md:opacity-30 transform-gpu">
        <div
          className="relative size-56 sm:size-72 rounded-full bg-white shadow-xl p-4 flex items-center justify-center border border-[#D0DFEF]"
          style={{
            animation: 'gt-medallion-rotate 22s linear infinite',
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            src={logoSrc}
            alt=""
            className="size-full object-contain filter drop-shadow-sm"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
