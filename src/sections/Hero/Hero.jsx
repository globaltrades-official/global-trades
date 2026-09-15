import React, { lazy, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, FileText, Tag, Truck, Store, HelpCircle } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';

import Button from '@/components/Button';
import { TextSplitter } from '@/components/TextSplitter';
import MobileHeroWatermark from './MobileHeroWatermark';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { BRANDING, CONTACT } from '@/constants/theme';

// Lazy load the desktop 3D WebGL scene so mobile devices load instantly without Three.js
const Desktop3DHero = lazy(() => import('./Desktop3DHero'));

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
    { dependencies: [isDesktop] }
  );

  return (
    <section
      id="hero"
      className="hero relative w-full overflow-hidden bg-gradient-to-b from-[#EBF3FC] via-[#F4F8FC] to-[#DDEAF8]"
    >
      {/* Background Medallion: 3D WebGL on all devices with seamless fallback */}
      <Suspense fallback={<MobileHeroWatermark />}>
        <Desktop3DHero isDesktop={isDesktop} />
      </Suspense>

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 md:px-8 relative z-10">
        {/* First Fold: Hero Banner with Clean Hierarchy */}
        <div className="grid min-h-[calc(100vh-7rem)] place-items-center py-6 md:py-10 w-full">
          <div className="grid auto-rows-min place-items-center text-center max-w-5xl w-full px-2 sm:px-4">
            {/* 1. Business Type */}
            <div className="hero-badge mb-3 md:mb-4 flex items-center justify-center">
              <span className="rounded-full bg-white/85 px-4 py-1.5 text-xs md:text-sm font-extrabold uppercase tracking-wider text-[#1A4C98] border border-[#1A4C98]/20 backdrop-blur-md shadow-sm">
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
            <div className="hero-subheading mt-3 md:mt-4 text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#081426] tracking-tight max-w-3xl drop-shadow-[0_1px_8px_rgba(255,255,255,0.9)] leading-snug">
              <p>
                Authorized B2B supply of gourmet syrups, cafe essentials, bakery ingredients, and imported culinary foods. Delivery across Kozhikode. Customers are welcome to visit our store for direct purchase.
              </p>
            </div>

            {/* 4. Action CTAs */}
            <div className="hero-buttons mt-6 md:mt-7 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
              {/* Primary CTA */}
              <a
                href={`https://wa.me/${CONTACT.WHATSAPP_NUMBER}?text=Hi%20Global%20Trades,%20I%20would%20like%20to%20place%20a%20bulk%20order.`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-emerald-800 px-6 py-3.5 text-center text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-emerald-900 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/30 cursor-pointer inline-flex items-center gap-2.5"
              >
                <WhatsAppIcon size={20} className="shrink-0" />
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
                className="shadow-[#1A4C98]/30 bg-[#1A4C98] hover:bg-[#123873]"
              />
            </div>

            {/* Compact 5-Item Trust-Benefit Strip Directly Below Hero CTA Buttons */}
            <div className="hero-trust-strip mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl">
              <div className="flex items-center gap-1.5 rounded-full bg-white/85 border border-[#1A4C98]/15 px-3.5 py-1.5 text-xs font-bold text-[#081426] shadow-sm backdrop-blur-sm">
                <ShieldCheck size={15} className="text-emerald-700 shrink-0" />
                <span>Authorized Supply</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/85 border border-[#1A4C98]/15 px-3.5 py-1.5 text-xs font-bold text-[#081426] shadow-sm backdrop-blur-sm">
                <FileText size={15} className="text-[#1A4C98] shrink-0" />
                <span>GST Billing</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/85 border border-[#1A4C98]/15 px-3.5 py-1.5 text-xs font-bold text-[#081426] shadow-sm backdrop-blur-sm">
                <Tag size={15} className="text-emerald-700 shrink-0" />
                <span>Bulk Food-Service Rates</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/85 border border-[#1A4C98]/15 px-3.5 py-1.5 text-xs font-bold text-[#081426] shadow-sm backdrop-blur-sm">
                <Truck size={15} className="text-[#1A4C98] shrink-0" />
                <span>Kozhikode Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/85 border border-[#1A4C98]/15 px-3.5 py-1.5 text-xs font-bold text-[#081426] shadow-sm backdrop-blur-sm">
                <Store size={15} className="text-emerald-700 shrink-0" />
                <span>Store Pickup Available</span>
              </div>
            </div>

            {/* Small 'Need help choosing products?' consultation CTA */}
            <div className="mt-4 flex items-center justify-center">
              <a
                href={CONTACT.WHATSAPP_HELP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A4C98] hover:text-[#00A3E0] transition-colors underline underline-offset-4"
              >
                <WhatsAppIcon size={15} className="shrink-0 text-emerald-600" />
                <span>Need help choosing products? Order on WhatsApp: 0495 2765320</span>
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
              condiments. Delivery available across Kozhikode, and customers from anywhere are welcome
              to visit our PT Usha Road distribution center for direct purchase and product collection.
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
              <span>Kozhikode Delivery &amp; Store Pickup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
