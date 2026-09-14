import React from 'react';

export default function BigText() {
  return (
    <section className="w-full overflow-hidden bg-gradient-to-b from-[#F4F8FC] via-[#E6F0FA] to-[#E8F1FB] py-20 md:py-28 border-t border-[#1A4C98]/10 flex items-center justify-center">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 md:px-8 text-center">
        <h2 className="flex flex-col items-center justify-center gap-2 md:gap-4 font-black uppercase leading-[0.9] select-none tracking-tight">
          <div className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#1A4C98] tracking-tight drop-shadow-sm">
            Supply
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 md:gap-x-6 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#081426]">
            <span className="text-[#00A3E0]">that</span>
            <span className="text-[#1A4C98]">empowers</span>
            <span className="text-[#00A3E0]">every</span>
          </div>
          <div className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#081426] tracking-tight drop-shadow-sm">
            Kitchen
          </div>
        </h2>
        <p className="mt-8 text-xs sm:text-sm md:text-base font-black text-[#1A4C98]/80 uppercase tracking-widest">
          Institutional Food Distribution · Vellayil · Kozhikode
        </p>
      </div>
    </section>
  );
}
