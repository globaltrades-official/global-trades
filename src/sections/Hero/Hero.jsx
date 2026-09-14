import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { View } from '@react-three/drei';

import Button from '@/components/Button';
import { TextSplitter } from '@/components/TextSplitter';
import HeroScene from './HeroScene';
import { Bubbles } from './Bubbles';
import { useStore } from '@/hooks/useStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { BRANDING, CONTACT } from '@/constants/theme';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Hero({ onNavigate }) {
  const ready = useStore((state) => state.ready);
  const isDesktop = useMediaQuery('(min-width: 768px)', true);

  useGSAP(
    () => {
      if (!ready) return;

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
        .from('.hero-body', {
          opacity: 0,
          y: 10,
        })
        .from('.hero-buttons', {
          opacity: 0,
          y: 10,
          duration: 0.6,
        });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      });

      scrollTl
        .fromTo(
          'body',
          {
            backgroundColor: '#F4F8FC',
          },
          {
            backgroundColor: '#E2ECF8',
            overwrite: 'auto',
          },
          1
        )
        .from('.text-side-heading .split-char', {
          scale: 1.15,
          y: 30,
          rotate: -12,
          opacity: 0,
          stagger: 0.04,
          ease: 'back.out(2)',
          duration: 0.5,
        })
        .from('.text-side-body', {
          y: 20,
          opacity: 0,
        });
    },
    { dependencies: [ready, isDesktop] }
  );

  return (
    <section
      id="hero"
      className="hero relative w-full overflow-hidden bg-gradient-to-b from-[#EBF3FC] via-[#F4F8FC] to-[#DDEAF8]"
    >
      {/* 3D Animated Background Logo Scene (Desktop & Mobile) */}
      <View className="hero-scene pointer-events-none sticky top-0 z-0 -mt-[100vh] block h-screen w-full opacity-40 md:opacity-50">
        <HeroScene />
        <Bubbles count={isDesktop ? 200 : 70} speed={isDesktop ? 2 : 1.2} repeat={true} />
      </View>

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 md:px-8 relative z-10">
        {/* First Fold: Hero Banner */}
        <div className="grid min-h-[calc(100vh-7rem)] place-items-center py-4 md:py-6 w-full">
          <div className="grid auto-rows-min place-items-center text-center max-w-5xl w-full px-2 sm:px-4">
            {/* Top Badge */}
            <div className="hero-badge mb-3 md:mb-4 flex items-center justify-center">
              <span className="rounded-full bg-[#1A4C98]/10 px-4 py-1.5 text-xs md:text-sm font-extrabold uppercase tracking-wider text-[#1A4C98] border border-[#1A4C98]/20 backdrop-blur-sm shadow-sm bg-white/60">
                Wholesale Food Service · Kozhikode
              </span>
            </div>

            {/* Hero Headline - Balanced Wide Single-Line Desktop Spread with White Drop Shadow */}
            <h1 className="hero-header text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] 2xl:text-[6.25rem] font-black uppercase leading-[1.05] text-[#1A4C98] tracking-tight drop-shadow-[0_2px_16px_rgba(255,255,255,0.95)] w-full select-none">
              <TextSplitter
                text="Global Trades"
                wordDisplayStyle="inline-block"
                className="hero-header-word mx-1.5 sm:mx-2 md:mx-3"
              />
            </h1>

            {/* Subheading */}
            <div className="hero-subheading mt-3 md:mt-4 text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-[#081426] tracking-tight max-w-4xl drop-shadow-[0_1px_8px_rgba(255,255,255,0.9)]">
              <p>Your Trusted Partner for Quality Goods and Wholesale Trading.</p>
            </div>

            {/* Body Description */}
            <div className="hero-body text-sm sm:text-base md:text-lg font-medium text-[#081426]/85 mt-2.5 md:mt-3 max-w-3xl drop-shadow-[0_1px_6px_rgba(255,255,255,0.85)]">
              <p>
                Authorized distributors, dealers &amp; C&amp;F agents of Indian &amp; imported processed foods,
                gourmet syrups, sauces, and cafe essentials based in Vellayil, Kozhikode.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="hero-buttons mt-5 md:mt-6 flex flex-wrap items-center justify-center gap-4">
              <Button
                buttonLink="#products"
                buttonText="Products"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) {
                    onNavigate('products');
                  }
                }}
                className="shadow-[#1A4C98]/30 bg-[#1A4C98] hover:bg-[#123873]"
              />
              <a
                href={`https://wa.me/${CONTACT.WHATSAPP_NUMBER}?text=Hi%20Global%20Trades,%20I%20would%20like%20to%20place%20a%20bulk%20order.`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-emerald-800 px-6 py-3.5 text-center text-base md:text-lg font-bold uppercase tracking-wide text-white transition-all duration-200 hover:bg-emerald-900 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/30 cursor-pointer inline-flex items-center gap-2"
              >
                <span>WhatsApp Order</span>
              </a>
            </div>
          </div>
        </div>

        {/* Secondary Hero Section: Authorized Network - Full Width */}
        <div className="text-side relative z-[80] flex flex-col items-center justify-center text-center min-h-[60vh] md:min-h-[75vh] py-14 md:py-20 w-full">
          <div className="inline-block rounded-lg bg-sky-950/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-sky-950 mb-4 border border-sky-950/15">
            Authorized C&amp;F Network
          </div>
          <h2 className="text-side-heading text-balance text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-sky-950 leading-tight">
            <TextSplitter text="Distributing 80+ World-Class Brands" />
          </h2>
          <div className="text-side-body mt-4 md:mt-6 max-w-3xl text-balance text-base md:text-lg font-medium text-sky-950/90 leading-relaxed mx-auto">
            <p>
              From Monin syrups, gourmet crushes, pasta, and imported culinary sauces to bulk cafe
              condiments. We ensure cold-chain freshness and prompt bulk delivery across Kozhikode
              and North Kerala directly from our PT Usha Road distribution center.
            </p>
          </div>

          {/* Key Service Highlights - Full Width 4-Card Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold text-sky-950 bg-white/80 backdrop-blur-sm py-4 px-4 rounded-2xl border border-white/80 shadow-sm">
              <span className="size-2 rounded-full bg-emerald-600 shrink-0"></span>
              <span>Direct Authorized Sourcing</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold text-sky-950 bg-white/80 backdrop-blur-sm py-4 px-4 rounded-2xl border border-white/80 shadow-sm">
              <span className="size-2 rounded-full bg-emerald-600 shrink-0"></span>
              <span>Bulk Food Service Rates</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold text-sky-950 bg-white/80 backdrop-blur-sm py-4 px-4 rounded-2xl border border-white/80 shadow-sm">
              <span className="size-2 rounded-full bg-emerald-600 shrink-0"></span>
              <span>Central Kozhikode Warehouse</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold text-sky-950 bg-white/80 backdrop-blur-sm py-4 px-4 rounded-2xl border border-white/80 shadow-sm">
              <span className="size-2 rounded-full bg-emerald-600 shrink-0"></span>
              <span>Daily Malabar Dispatches</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
