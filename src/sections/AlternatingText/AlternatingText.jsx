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
    body: 'Wholesale crate and carton pricing designed for food service margins. Providing consistent supply to over 500+ premier commercial kitchens, bakeries, and fine-dining establishments.',
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

      // Desktop: Scroll-driven continuous transition across all review rows with one shared logo
      if (containerRef.current && sections.length > 0) {
        const mm = gsap.matchMedia(containerRef);

        mm.add(
          {
            isDesktop: '(min-width: 768px)',
            isMobile: '(max-width: 767px)',
            reduceMotion: '(prefers-reduced-motion: reduce)',
          },
          (context) => {
            const { isDesktop, isMobile, reduceMotion } = context.conditions;

            // Desktop & tablet only (min-width: 768px):
            if (isDesktop && sharedLogoRef.current) {
              const desktopDistance = Math.min(window.innerWidth * 0.25, 340);
              const xTarget = desktopDistance;

              // Position 1: Start beside Review 1 (on the right side)
              gsap.set(sharedLogoRef.current, {
                x: xTarget,
                y: 0,
                scale: 1,
              });

              if (!reduceMotion && logoPinRef.current) {
                // Unified ScrollTrigger timeline: pins the shared logo viewport container
                // and continuously animates the logo across rows without disappearing
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

                // Continuous animation:
                // Review 1 (right) -> Review 2 (left) -> Review 3 (right)
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

            // Mobile only (max-width: 767px):
            // Very subtle scroll-driven horizontal movement only (12–18px left/right, no rotation or scale)
            if (isMobile && !reduceMotion) {
              const mobileLogos = gsap.utils.toArray('.mobile-review-logo');
              mobileLogos.forEach((logo, idx) => {
                const travelDistance = idx % 2 === 0 ? 15 : -15;
                gsap.fromTo(
                  logo,
                  { x: -travelDistance },
                  {
                    x: travelDistance,
                    ease: 'power1.out',
                    scrollTrigger: {
                      trigger: logo,
                      start: 'top 95%',
                      end: 'bottom 20%',
                      scrub: 1.0,
                    },
                  }
                );
              });
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
      {/* Pinned Shared Scroll-Driven Decorative Logo (Desktop & Tablet only >= 768px) */}
      <div
        ref={logoPinRef}
        className="pointer-events-none select-none absolute top-0 left-0 w-full h-screen z-0 hidden md:flex items-center justify-center overflow-hidden"
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

      <div className="relative w-full">
        {/* Alternating Review Rows */}
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 md:px-8 relative z-10">
          {TEXT_GROUP.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={item.heading}
                className="alternating-section relative w-full flex flex-col items-center mb-10 sm:mb-14 last:mb-0 md:mb-0 md:h-screen md:grid md:grid-cols-2 md:gap-x-12 md:place-items-center md:py-0"
              >
                {/* Review Card: Fully Opaque Solid Light Background, Left on Row 1 & 3; Right on Row 2 */}
                <div
                  className={clsx(
                    isEven
                      ? 'md:order-1 md:col-start-1 md:mr-auto'
                      : 'md:order-2 md:col-start-2 md:ml-auto',
                    'relative z-10 rounded-3xl p-6 sm:p-8 md:p-10 bg-white shadow-2xl border border-[#1A4C98]/10 w-full max-w-full sm:max-w-lg lg:max-w-xl transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(26,76,152,0.18)]'
                  )}
                >
                  <span className="inline-block rounded-full bg-emerald-900/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-900 mb-3 border border-emerald-900/15">
                    {item.tag}
                  </span>

                  <h2 className="text-balance text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#081426] tracking-tight leading-tight">
                    {item.heading}
                  </h2>

                  {/* Google Review Quote Highlight */}
                  <div className="mt-4 rounded-2xl bg-amber-500/10 p-4 border-l-4 border-amber-600 bg-amber-50/50 shadow-sm">
                    <p className="text-sm md:text-base font-bold italic text-[#081426] leading-relaxed">
                      {item.reviewQuote}
                    </p>
                    <span className="block mt-2 text-xs font-black text-amber-800">
                      ★ 5.0 — {item.reviewer}
                    </span>
                  </div>

                  <div className="mt-4 text-sm sm:text-base md:text-lg font-medium text-[#081426]/85 leading-relaxed">
                    <p>{item.body}</p>
                  </div>
                </div>

                {/* Mobile Logo: Centered directly below the review card on mobile screens (< md) */}
                <div className="md:hidden flex flex-col items-center justify-center mt-6 sm:mt-8 w-full">
                  <div className="mobile-review-logo will-change-transform flex items-center justify-center w-[140px] sm:w-[155px] aspect-square">
                    <img
                      src={BRANDING.LOGO_PATH}
                      alt="Global Trades Logo"
                      className="size-full object-contain drop-shadow-[0_12px_30px_rgba(26,76,152,0.18)] select-none pointer-events-none"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Empty column space on desktop preserving two-column grid balance for shared logo */}
                <div
                  className={clsx(
                    isEven ? 'md:order-2 md:col-start-2' : 'md:order-1 md:col-start-1',
                    'hidden md:block pointer-events-none select-none w-full h-full'
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
