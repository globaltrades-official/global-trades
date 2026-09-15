import React from 'react';
import { BRANDING } from '@/constants/theme';

export default function MobileHeroWatermark() {
  const logoSrc = BRANDING?.LOGO_PATH || '/company-logo.png';

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Soft Ambient Radial Glow */}
      <div className="absolute top-1/4 size-72 rounded-full bg-gradient-to-tr from-[#00A3E0]/15 via-[#1A4C98]/10 to-transparent blur-3xl animate-pulse" />

      {/* Floating Medallion with CSS 3D Depth */}
      <div className="relative flex flex-col items-center justify-center opacity-20 transform-gpu animate-[gt-float_6s_ease-in-out_infinite]">
        {/* Outer Accent Ring */}
        <div className="relative size-44 rounded-full border-2 border-dashed border-[#1A4C98]/30 flex items-center justify-center p-3 animate-[gt-spin_28s_linear_infinite]">
          {/* Inner Accent Ring */}
          <div className="size-full rounded-full border-2 border-[#00A3E0]/40 flex items-center justify-center p-2.5 bg-white/40 shadow-xl backdrop-blur-xs">
            {/* Logo Emblem */}
            <img
              src={logoSrc}
              alt=""
              className="size-full object-contain filter drop-shadow-md"
              loading="eager"
            />
          </div>
        </div>

        {/* Ambient Bubbles using pure CSS */}
        <span className="absolute -top-6 left-4 size-3 rounded-full bg-[#00A3E0]/30 animate-[gt-bubble_4s_ease-in-out_infinite]" />
        <span className="absolute top-8 -right-4 size-4 rounded-full bg-[#1A4C98]/25 animate-[gt-bubble_5s_ease-in-out_infinite_1s]" />
        <span className="absolute -bottom-4 right-6 size-2.5 rounded-full bg-[#00A3E0]/25 animate-[gt-bubble_3.5s_ease-in-out_infinite_0.5s]" />
      </div>
    </div>
  );
}
