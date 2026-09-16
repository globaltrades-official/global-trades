import React, { useRef } from 'react';
import clsx from 'clsx';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRANDING } from '@/constants/theme';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TEXT_GROUP = [
  {
    tag: 'Continental & Beverage Specialization',
    heading: 'One Stop for Continental & Monin Syrups',
    reviewer: 'Irshad Hassan · Google Local Guide',
    reviewQuote: '“One stop for continental food supply syrup and monin syrup”',
    body: 'Complete portfolio of Monin gourmet syrups, fruit purees, cocktail syrups, imported cooking sauces, Italian pasta, and barista ingredients under one roof for quick commercial pickup.',
  },
  {
    tag: 'Institutional Wholesale Value',
    heading: 'Bulk Purchase for Cafes & Restaurants',
    reviewer: 'Irshad Kallan · Google Local Guide',
    reviewQuote: '“Best place to purchase bulk for cafe and restaurant. A lot of products Indian and imported.”',
    body: 'Wholesale crate and carton pricing designed for food service margins. Providing consistent supply to commercial kitchens, cafes, bakeries, and food establishments across Kozhikode.',
  },
  {
    tag: 'Centrally Located in Kozhikode',
    heading: 'PT Usha Road Distribution Center',
    reviewer: 'Shereen Tariq · Google Local Guide',
    reviewQuote: '“One Stop for All Kinds of Cafe, Restaurants Needs...”',
    body: 'Conveniently located at 4th Gate, Zilla Housing Colony, Vellayil, Kozhikode. Fully stocked warehouse ready for direct store purchase and product collection, or prompt delivery across Kozhikode.',
  },
];

export default function AlternatingText() {
  const containerRef = useRef(null);
  const logoPinRef = useRef(null);
  const sharedLogoRef = useRef(null);

  useGSAP(
    () => {
      // Desktop: Scroll-driven continuous transition across all review rows with one shared logo
      if (containerRef.current) {
        const mm = gsap.matchMedia(containerRef);

        mm.add(
          {
            isDesktop: '(min-width: 1024px)',
            reduceMotion: '(prefers-reduced-motion: reduce)',
          },
          (context) => {
            const { isDesktop, reduceMotion } = context.conditions;

            // Desktop only (min-width: 1024px):
            if (isDesktop) {
              const sections = gsap.utils.toArray('.alternating-section');
              const bgColors = ['#E2ECF8', '#DBEAFE', '#F0F5FA'];

              sections.forEach((section, index) => {
                if (index === 0) return;
                ScrollTrigger.create({
                  trigger: section,
                  start: 'top 60%',
                  end: 'bottom 60%',
                  onEnter: () => {
                    gsap.to('.alternating-text-container', {
                      backgroundColor: bgColors[index % bgColors.length],
                      duration: 0.8,
                      overwrite: 'auto',
                    });
                  },
                  onEnterBack: () => {
                    gsap.to('.alternating-text-container', {
                      backgroundColor: bgColors[(index - 1) % bgColors.length],
                      duration: 0.8,
                      overwrite: 'auto',
                    });
                  },
                });
              });

              if (sharedLogoRef.current) {
                const desktopDistance = Math.min(window.innerWidth * 0.25, 340);
                const xTarget = desktopDistance;

                // Position 1: Start beside Review 1 (on the right side)
                gsap.set(sharedLogoRef.current, {
                  x: xTarget,
                  y: 0,
                  scale: 1,
                });

                if (!reduceMotion && logoPinRef.current) {
                  const scrollTl = gsap.timeline({
                    scrollTrigger: {
                      trigger: containerRef.current,
                      pin: logoPinRef.current,
                      start: 'top top',
                      end: 'bottom bottom',
                      scrub: 0.8,
                      pinSpacing: false,
                      invalidateOnRefresh: true,
                    },
                  });

                  scrollTl
                    .to(sharedLogoRef.current, {
                      x: -xTarget,
                      ease: 'sine.inOut',
                      duration: 1,
                    })
                    .to(sharedLogoRef.current, {
                      x: xTarget,
                      ease: 'sine.inOut',
                      duration: 1,
                    });
                }
              }
            }
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="benefits"
      className="alternating-text-container relative w-full bg-[#E2ECF8] text-[#081426] transition-colors duration-700 py-8 md:py-0"
    >
      {/* Pinned Shared Scroll-Driven Decorative Logo (Desktop only >= 1024px) */}
      <div
        ref={logoPinRef}
        className="pointer-events-none select-none absolute top-0 left-0 w-full h-screen z-0 hidden lg:flex items-center justify-center overflow-hidden"
        style={{ perspective: '1200px' }}
        aria-hidden="true"
      >
        <div
          ref={sharedLogoRef}
          className="will-change-transform flex items-center justify-center w-[500px] lg:w-[560px] xl:w-[620px] aspect-square"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <img
            src={BRANDING.LOGO_PATH}
            alt="Global Trades Logo"
            className="size-full object-contain drop-shadow-[0_20px_50px_rgba(26,76,152,0.22)] select-none pointer-events-none"
            loading="lazy"
          />
        </div>
      </div>

      <div className="relative w-full pt-12 md:pt-16">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center px-4 mb-6 sm:mb-14 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-900 shadow-2xs mb-3">
            <span className="text-amber-600 font-extrabold">★ {BRANDING.RATING}</span>
            <span className="text-amber-300">·</span>
            <span className="text-[#081426]/80">{BRANDING.REVIEWS_COUNT} Reviews</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            Trusted by Kozhikode Food Businesses
          </h2>

          <p className="mt-2 sm:mt-3 text-xs sm:text-base text-[#081426]/80 font-medium leading-relaxed">
            What cafes, restaurants, and bakery customers say about Global Trades.
          </p>
        </div>

        {/* Review Cards: Grid on Mobile/Tablet matching Why Global Trades, Scroll-pinned on Desktop */}
        <div className="mx-auto grid grid-cols-1 md:grid-cols-3 lg:flex lg:flex-col items-stretch lg:items-center px-4 md:px-8 relative z-10 gap-3 sm:gap-6 lg:gap-0">
          {TEXT_GROUP.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={item.heading}
                className="alternating-section relative w-full flex flex-col items-center mb-0 lg:h-screen lg:grid lg:grid-cols-2 lg:gap-x-12 lg:place-items-center lg:py-0"
              >
                {/* Review Card: Fully Opaque Solid Light Background, Left on Row 1 & 3; Right on Row 2 */}
                <div
                  className={clsx(
                    isEven
                      ? 'lg:order-1 lg:col-start-1 lg:mr-auto'
                      : 'lg:order-2 lg:col-start-2 lg:ml-auto',
                    'relative z-10 rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 bg-white shadow-2xs hover:shadow-lg border border-[#D0DFEF] w-full transition-all duration-300 flex flex-col justify-between'
                  )}
                >
                  <div>
                    <span className="inline-block rounded-full bg-emerald-900/10 px-2.5 py-0.5 sm:px-3.5 sm:py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-900 mb-2 sm:mb-3 border border-emerald-900/15">
                      {item.tag}
                    </span>

                    <h3 className="text-base sm:text-xl lg:text-3xl font-black text-[#081426] tracking-tight leading-snug">
                      {item.heading}
                    </h3>

                    {/* Google Review Quote Highlight */}
                    <div className="mt-2.5 sm:mt-4 rounded-xl sm:rounded-2xl bg-amber-50/70 p-3 sm:p-4 border-l-4 border-amber-600 shadow-2xs">
                      <p className="text-xs sm:text-sm md:text-base font-bold italic text-[#081426] leading-relaxed">
                        {item.reviewQuote}
                      </p>
                      <span className="block mt-1 sm:mt-1.5 text-[10px] sm:text-xs font-black text-amber-800">
                        ★ 5.0 — {item.reviewer}
                      </span>
                    </div>

                    <div className="mt-2.5 sm:mt-4 text-xs sm:text-sm md:text-base font-medium text-[#081426]/85 leading-relaxed">
                      <p>{item.body}</p>
                    </div>
                  </div>
                </div>

                {/* Empty column space on desktop preserving two-column grid balance for shared logo */}
                <div
                  className={clsx(
                    isEven ? 'lg:order-2 lg:col-start-2' : 'lg:order-1 lg:col-start-1',
                    'hidden lg:block pointer-events-none select-none w-full h-full'
                  )}
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
