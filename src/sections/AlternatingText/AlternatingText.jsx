import React from 'react';
import { Star } from 'lucide-react';
import { BRANDING } from '@/constants/theme';

const REVIEWS = [
  {
    initials: 'IH',
    reviewer: 'Irshad Hassan',
    badge: 'Google Local Guide',
    rating: 5,
    tag: 'Monin & Continental',
    quote: '“One stop for continental food supply syrup and monin syrup. Complete portfolio under one roof for quick commercial pickup.”',
  },
  {
    initials: 'IK',
    reviewer: 'Irshad Kallan',
    badge: 'Google Local Guide',
    rating: 5,
    tag: 'Bulk Trade Supply',
    quote: '“Best place to purchase bulk for cafe and restaurant. A lot of products Indian and imported with consistent trade supply.”',
  },
  {
    initials: 'ST',
    reviewer: 'Shereen Tariq',
    badge: 'Google Local Guide',
    rating: 5,
    tag: 'Vellayil Center',
    quote: '“One Stop for All Kinds of Cafe, Restaurants Needs. Fully stocked warehouse ready for direct purchase and delivery across Kozhikode.”',
  },
];

export default function AlternatingText() {
  return (
    <section
      id="benefits"
      className="relative w-full bg-gradient-to-b from-[#E8F1FB] via-[#EFF6FC] to-[#F4F8FC] py-8 sm:py-10 md:py-12 border-t border-[#1A4C98]/15 overflow-hidden"
    >
      {/* 3D Rotating Ambient Background Brand Medallion (Matching Computer to Mobile) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
        aria-hidden="true"
      >
        <style>{`
          @keyframes gt-review-medallion-rotate {
            0% {
              transform: perspective(1000px) rotateY(0deg);
            }
            100% {
              transform: perspective(1000px) rotateY(360deg);
            }
          }
        `}</style>

        {/* Ambient Radial Soft Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-72 sm:size-96 rounded-full bg-gradient-to-tr from-[#00A3E0]/15 via-[#1A4C98]/10 to-[#E52528]/10 blur-3xl pointer-events-none" />

        {/* Concentric Subtle Rotating Brand Accent Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 sm:size-80 md:size-96 rounded-full border border-[#1A4C98]/10 pointer-events-none animate-[spin_40s_linear_infinite]" />

        {/* 3D Brand Medallion */}
        <div className="relative flex flex-col items-center justify-center opacity-25 sm:opacity-30 transform-gpu">
          <div
            className="relative size-44 sm:size-60 md:size-72 rounded-full bg-white shadow-xl p-4 sm:p-5 flex items-center justify-center border border-[#D0DFEF]"
            style={{
              animation: 'gt-review-medallion-rotate 22s linear infinite',
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              src={BRANDING.LOGO_PATH}
              alt=""
              className="size-full object-contain filter drop-shadow-sm"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 md:px-8 relative z-10">
        {/* Compact Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-5 sm:mb-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#1A4C98]/20 px-3.5 py-1 text-[11px] sm:text-xs font-bold shadow-2xs mb-2.5">
            <span className="font-extrabold uppercase tracking-wider text-[#1A4C98]">
              {BRANDING.COMPANY_NAME}
            </span>
            <span className="text-[#081426]/25 font-light">|</span>
            <span className="text-amber-600 font-extrabold">★ {BRANDING.RATING}</span>
            <span className="text-[#081426]/75 font-medium">({BRANDING.REVIEWS_COUNT} Google Reviews)</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            Trusted by Kozhikode Food Businesses
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-[#081426]/70 font-normal leading-relaxed">
            Verified feedback from cafes, restaurants, and bakeries in Kozhikode.
          </p>
        </div>

        {/* Compact Review Cards: Standard responsive grid on both mobile and desktop (no swiping) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {REVIEWS.map((item) => (
            <div
              key={item.reviewer}
              className="w-full rounded-2xl bg-white p-4 sm:p-5 border border-[#D0DFEF] shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Tag */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#1A4C98] bg-[#1A4C98]/10 px-2 py-0.5 rounded-full">
                    {item.tag}
                  </span>
                </div>

                {/* Review Quote */}
                <p className="text-xs sm:text-sm font-medium text-[#081426]/85 leading-relaxed italic">
                  {item.quote}
                </p>
              </div>

              {/* Reviewer Profile with small verified client company logo */}
              <div className="mt-3.5 pt-2.5 border-t border-[#F0F5FA] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-7 rounded-full bg-[#1A4C98]/10 text-[#1A4C98] font-bold text-[10px] flex items-center justify-center shrink-0 border border-[#1A4C98]/15">
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-[#081426] truncate leading-tight">
                      {item.reviewer}
                    </span>
                    <span className="block text-[10px] text-emerald-700 font-semibold truncate leading-tight">
                      {item.badge}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center opacity-70" title="Verified Global Trades Client">
                  <img src={BRANDING.LOGO_PATH} alt="Global Trades" className="size-4 object-contain" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
