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
        @keyframes gt-medallion-flip {
          0% {
            transform: perspective(1200px) rotateY(0deg);
          }
          100% {
            transform: perspective(1200px) rotateY(360deg);
          }
        }
      `}</style>

      {/* Soft Ambient Radial Glow */}
      <div className="absolute top-1/4 size-80 rounded-full bg-gradient-to-tr from-[#00A3E0]/15 via-[#1A4C98]/10 to-transparent blur-3xl" />

      {/* Identical 3D Medallion Representation */}
      <div className="relative flex flex-col items-center justify-center opacity-20 md:opacity-25 transform-gpu">
        <div
          className="relative size-60 sm:size-72 rounded-full bg-white shadow-2xl p-4 flex items-center justify-center border-4 border-[#E52528] ring-4 ring-[#00A3E0]"
          style={{
            animation: 'gt-medallion-flip 22s linear infinite',
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            src={logoSrc}
            alt=""
            className="size-full object-contain filter drop-shadow-md"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
