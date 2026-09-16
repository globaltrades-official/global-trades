import React, { lazy, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ShieldCheck, FileText, Tag, Truck, Store } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { CONTACT } from '@/constants/theme';

import Button from '@/components/Button';
import { TextSplitter } from '@/components/TextSplitter';
import MobileHeroWatermark from './MobileHeroWatermark';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Lazy load the desktop 3D WebGL scene so mobile devices load instantly without Three.js
const Desktop3DHero = lazy(() => import('./Desktop3DHero'));

gsap.registerPlugin(useGSAP);

export default function Hero({ onNavigate }) {
  const isDesktop = useMediaQuery('(min-width: 768px)', true);

  useGSAP(
    () => {
      const introTl = gsap.timeline();

      introTl
        .set('.hero', { opacity: 1 })
        .from('.hero-badge', {
          y: -20,
          opacity: 0,
          duration: 0.6,
        })
        .from('.hero-header-word', {
          scale: 2.2,
          opacity: 0,
          ease: 'power4.in',
          delay: 0.1,
          stagger: 0.4,
        })
        .from(
          '.hero-subheading',
          {
            opacity: 0,
            y: 30,
          },
          '+=.3'
        )
        .from('.hero-buttons', {
          opacity: 0,
          y: 10,
          duration: 0.6,
        })
        .from('.hero-trust-strip', {
          opacity: 0,
          y: 10,
          duration: 0.5,
        });
    },
    { dependencies: [isDesktop] }
  );

  return (
    <section
      id="hero"
      className="hero relative w-full overflow-hidden bg-gradient-to-b from-[#EBF3FC] via-[#F4F8FC] to-[#DDEAF8]"
    >
      {/* Background Medallion: 3D WebGL scene matching computer on mobile */}
      <Suspense fallback={<MobileHeroWatermark />}>
        <Desktop3DHero isDesktop={isDesktop} />
      </Suspense>

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 md:px-8 relative z-10">
        {/* First Fold: Hero Banner with Clean Hierarchy */}
        <div className="grid min-h-[calc(100vh-7rem)] place-items-center py-6 md:py-10 w-full">
          <div className="grid auto-rows-min place-items-center text-center max-w-5xl w-full px-2 sm:px-4">
            {/* 1. Business Type */}
            <div className="hero-badge mb-3 md:mb-4 flex items-center justify-center">
              <span className="rounded-full bg-white/90 px-3.5 py-1.5 sm:px-4 text-[11px] sm:text-xs md:text-sm font-extrabold uppercase tracking-wider text-[#1A4C98] border border-[#1A4C98]/20 backdrop-blur-md shadow-2xs">
                Wholesale Food Service &amp; Institutional Distribution · Kozhikode
              </span>
            </div>

            {/* 2. Main Headline */}
            <h1 className="hero-header text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] 2xl:text-[6.25rem] font-black uppercase leading-[1.05] text-[#1A4C98] tracking-tight drop-shadow-[0_2px_16px_rgba(255,255,255,0.95)] w-full select-none">
              <TextSplitter
                text="Global Trades"
                wordDisplayStyle="inline-block"
                className="hero-header-word mx-1.5 sm:mx-2 md:mx-3"
              />
            </h1>

            {/* 3. Short Value Proposition with Accurate Service Area */}
            <div className="hero-subheading mt-3 sm:mt-4 text-xs sm:text-base md:text-lg lg:text-xl font-medium text-[#081426]/80 tracking-normal max-w-2xl drop-shadow-[0_1px_8px_rgba(255,255,255,0.9)] leading-relaxed px-2">
              <p>
                Authorized B2B supply of gourmet syrups, cafe essentials, bakery ingredients, and imported culinary foods. Delivery across Kozhikode. Customers are welcome to visit our store for direct purchase.
              </p>
            </div>

            {/* 4. Action CTAs */}
            <div className="hero-buttons mt-5 sm:mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {/* Primary CTA */}
              <a
                href={`https://wa.me/${CONTACT.WHATSAPP_NUMBER}?text=Hi%20Global%20Trades,%20I%20would%20like%20to%20place%20a%20bulk%20order.`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-emerald-800 px-5 sm:px-6 py-3 sm:py-3.5 text-center text-xs sm:text-base md:text-lg font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-emerald-900 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/30 cursor-pointer inline-flex items-center gap-2"
              >
                <WhatsAppIcon size={18} className="shrink-0" />
                <span>Get Wholesale Quote</span>
              </a>

              {/* Secondary CTA */}
              <Button
                buttonLink="#products"
                buttonText="Explore Products"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) {
                    onNavigate('products');
                  }
                }}
                className="shadow-[#1A4C98]/30 bg-[#1A4C98] hover:bg-[#123873] px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-base"
              />
            </div>

            {/* Compact 5-Item Trust-Benefit Strip: Single-line scroll on mobile, flex-wrap on desktop */}
            <div className="hero-trust-strip mt-6 sm:mt-8 w-full max-w-4xl px-2">
              <div className="flex sm:flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 scrollbar-none snap-x">
                <div className="shrink-0 snap-start flex items-center gap-1.5 rounded-full bg-white/90 border border-[#1A4C98]/15 px-3 py-1.5 sm:px-3.5 text-[11px] sm:text-xs font-semibold text-[#081426] shadow-2xs backdrop-blur-sm">
                  <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
                  <span>Authorized Supply</span>
                </div>
                <div className="shrink-0 snap-start flex items-center gap-1.5 rounded-full bg-white/90 border border-[#1A4C98]/15 px-3 py-1.5 sm:px-3.5 text-[11px] sm:text-xs font-semibold text-[#081426] shadow-2xs backdrop-blur-sm">
                  <FileText size={14} className="text-[#1A4C98] shrink-0" />
                  <span>GST Billing</span>
                </div>
                <div className="shrink-0 snap-start flex items-center gap-1.5 rounded-full bg-white/90 border border-[#1A4C98]/15 px-3 py-1.5 sm:px-3.5 text-[11px] sm:text-xs font-semibold text-[#081426] shadow-2xs backdrop-blur-sm">
                  <Tag size={14} className="text-emerald-700 shrink-0" />
                  <span>Bulk Food-Service Rates</span>
                </div>
                <div className="shrink-0 snap-start flex items-center gap-1.5 rounded-full bg-white/90 border border-[#1A4C98]/15 px-3 py-1.5 sm:px-3.5 text-[11px] sm:text-xs font-semibold text-[#081426] shadow-2xs backdrop-blur-sm">
                  <Truck size={14} className="text-[#1A4C98] shrink-0" />
                  <span>Kozhikode Delivery</span>
                </div>
                <div className="shrink-0 snap-start flex items-center gap-1.5 rounded-full bg-white/90 border border-[#1A4C98]/15 px-3 py-1.5 sm:px-3.5 text-[11px] sm:text-xs font-semibold text-[#081426] shadow-2xs backdrop-blur-sm">
                  <Store size={14} className="text-emerald-700 shrink-0" />
                  <span>Store Pickup Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
